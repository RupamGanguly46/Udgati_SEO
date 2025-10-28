from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse, Response
from urllib.parse import urljoin, quote, urlparse, parse_qs, unquote
import os
from collections import OrderedDict
import re
import httpx
from bs4 import BeautifulSoup
import time
from typing import Optional

# Configurable proxy whitelist (comma separated hostnames). Empty = allow all.
PROXY_WHITELIST = [h.strip() for h in os.environ.get('PROXY_WHITELIST', '').split(',') if h.strip()]

# LRU cache for proxied resources: OrderedDict URL -> (timestamp, content, content_type)
_proxy_cache = OrderedDict()
_CACHE_TTL = int(os.environ.get('PROXY_CACHE_TTL', 60 * 5))  # seconds
_CACHE_MAX_ITEMS = int(os.environ.get('PROXY_CACHE_MAX', 200))


app = FastAPI()

# Allow React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def rewrite_css_urls(css_text: str, base: str) -> str:
    """Rewrite CSS url(...) values to route through our proxy endpoint."""

    def repl(match):
        orig = match.group(1).strip().strip('"').strip("'")
        if orig.startswith("data:"):
            return f"url({orig})"
        abs_url = urljoin(base, orig)
        # if already points to our proxy, don't rewrite
        if '/_proxy' in abs_url:
            return f"url('{abs_url}')"
        # ensure URL is quoted for use as a query param
        prox = f"/_proxy?url={quote(abs_url, safe='')}"
        return f"url('{prox}')"

    return re.sub(r"url\(([^)]+)\)", repl, css_text, flags=re.IGNORECASE)


@app.get("/preview", response_class=HTMLResponse)
async def preview(url: str = Query("https://example.com")):
    try:
        # Fetch the webpage
        async with httpx.AsyncClient(follow_redirects=True, timeout=15.0) as client:
            response = await client.get(url, headers={"User-Agent": "AgenticSEO Preview"})
            html = response.text

            # Parse and sanitize
            soup = BeautifulSoup(html, "html.parser")

            # Remove scripts and CSP meta tags
            for tag in soup(["script"]):
                tag.decompose()
            for meta in soup.find_all("meta", attrs={"http-equiv": "Content-Security-Policy"}):
                meta.decompose()

            # Add <base> for relative paths
            base_tag = soup.new_tag("base", href=url)
            if soup.head:
                soup.head.insert(0, base_tag)
            else:
                soup.insert(0, base_tag)

            # Make the page editable by default (set attributes server-side)
            if soup.body:
                soup.body["contenteditable"] = "true"
                soup.body["spellcheck"] = "true"

            # Inline external stylesheets and rewrite font/image URLs in CSS to go
            # through our proxy so the browser requests them from our origin (with CORS headers).
            links = list(soup.find_all('link', rel=lambda v: v and 'stylesheet' in v.lower(), href=True))
            for link in links:
                href = link["href"]
                try:
                    full = urljoin(url, href)
                    css_resp = await client.get(full)
                    # try to decode CSS as text (fallback to utf-8)
                    try:
                        css_text = css_resp.text
                    except Exception:
                        css_text = css_resp.content.decode(errors='ignore')
                    css_text = rewrite_css_urls(css_text, full)
                    style_tag_inline = soup.new_tag('style')
                    style_tag_inline.string = css_text
                    link.replace_with(style_tag_inline)
                except Exception:
                    # leave the link as-is if any error
                    continue

            # Rewrite inline <style> blocks too
            for st in soup.find_all('style'):
                try:
                    if st.string:
                        st.string = rewrite_css_urls(st.string, url)
                except Exception:
                    continue

            # Inject a robust editing script that attaches handlers after DOM is ready
            inject_script = soup.new_tag("script")
            inject_script.string = """
document.addEventListener('DOMContentLoaded', function(){
    try {
        // Keep body non-editable; enable editing on the clicked element only
        document.body.contentEditable = false;
        document.body.spellcheck = true;

        function isEditableTag(node){
            if(!node || node.nodeType !== 1) return false;
            var t = node.tagName.toUpperCase();
            return ['P','SPAN','A','LI','TD','TH','H1','H2','H3','H4','H5','H6','EM','STRONG','SMALL','LABEL','BUTTON'].indexOf(t) !== -1;
        }

        function findEditableContainer(node){
            while(node && node !== document.body){
                if(isEditableTag(node)) return node;
                node = node.parentNode;
            }
            return null;
        }

        // Hover outline for editable elements (visual only)
        document.addEventListener('mouseover', function(e){
            try { var el = findEditableContainer(e.target) || e.target; el.classList && el.classList.add('editable-hover'); } catch(err){}
        }, true);
        document.addEventListener('mouseout', function(e){
            try { var el = findEditableContainer(e.target) || e.target; el.classList && el.classList.remove('editable-hover'); } catch(err){}
        }, true);

        // On click, make the nearest editable container editable and focus caret
        document.addEventListener('click', function(e){
            try {
                var el = findEditableContainer(e.target) || e.target;
                // special case: if it's an interactive control, open links in new window
                var a = e.target.closest && e.target.closest('a');
                if (a && !isEditableTag(a)) { e.preventDefault(); window.open(a.href,'_blank'); return; }

                // clear previous editing element
                var prev = document.querySelector('[data-editing="true"]');
                if(prev && prev !== el){ prev.removeAttribute('contenteditable'); prev.removeAttribute('data-editing'); }

                if(el && el.nodeType===1){
                    el.setAttribute('contenteditable','true');
                    el.setAttribute('data-editing','true');
                    // disable spellcheck while editing to avoid red underlines
                    try { el.spellcheck = false; } catch(e){}
                    el.focus();
                    // set caret near click
                    var range = null;
                    if (document.caretRangeFromPoint) {
                        range = document.caretRangeFromPoint(e.clientX, e.clientY);
                    } else if (document.caretPositionFromPoint) {
                        var pos = document.caretPositionFromPoint(e.clientX, e.clientY);
                        range = document.createRange();
                        range.setStart(pos.offsetNode, pos.offset);
                        range.collapse(true);
                    }
                    if(range){ var sel = window.getSelection(); sel.removeAllRanges(); sel.addRange(range); }
                }
            } catch(err){}
        }, true);

        // When editing element loses focus, turn off editing attribute
        document.addEventListener('focusout', function(e){
            try {
                var el = e.target;
                if(el && el.getAttribute && el.getAttribute('data-editing') === 'true'){
                    el.removeAttribute('contenteditable');
                    el.removeAttribute('data-editing');
                }
            } catch(err){}
        }, true);

        // Sanitize paste: insert plain text so inserted content inherits
        // the formatting of the element where the caret is.
        document.addEventListener('paste', function(e){
            try {
                e.preventDefault();
                var text = '';
                if (e.clipboardData && e.clipboardData.getData) {
                    text = e.clipboardData.getData('text/plain');
                } else if (window.clipboardData && window.clipboardData.getData) {
                    text = window.clipboardData.getData('Text');
                }
                if (!text) return;

                // Prefer insertText; otherwise use a safe range insertion
                try {
                    if (document.queryCommandSupported && document.queryCommandSupported('insertText')) {
                        document.execCommand('insertText', false, text);
                        return;
                    }
                } catch(err){}

                var sel = window.getSelection();
                if (!sel.rangeCount) return;
                var range = sel.getRangeAt(0);
                range.deleteContents();
                var textNode = document.createTextNode(text);
                range.insertNode(textNode);
                // Move caret after inserted node
                range.setStartAfter(textNode);
                range.collapse(true);
                sel.removeAllRanges();
                sel.addRange(range);
            } catch(err) {}
        }, true);

    } catch(err){}
});

// Listen for export requests from the parent and respond with the page HTML
window.addEventListener('message', function(e) {
    try {
        if (e.data && e.data.type === 'GET_HTML') {
            var html = '<!doctype html>\n' + document.documentElement.outerHTML;
            window.parent.postMessage({ type: 'HTML_RESPONSE', html: html }, '*');
        }
    } catch (err) {
        // ignore
    }
});
"""

            style_tag = soup.new_tag("style")
            style_tag.string = ".editable-hover { outline: 2px dashed #3b82f6 !important; }"
            if soup.body:
                soup.body.append(style_tag)
                soup.body.append(inject_script)

            return HTMLResponse(str(soup))

    except Exception as e:
        return HTMLResponse(f"<h3>Error loading preview: {e}</h3>", status_code=500)


@app.get("/_proxy")
async def proxy(url: str = Query(...)):
    """Fetch arbitrary resource and return it with CORS headers.

    WARNING: this is an open proxy endpoint. In production lock it down to
    allowed hosts or add authentication.
    """
    # Use configured whitelist
    WHITELIST = PROXY_WHITELIST

    # Unwrap nested _proxy parameters to avoid recursive proxying
    try:
        parsed = urlparse(url)
        qs = parse_qs(parsed.query)
        if '_proxy' in parsed.path or ('url' in qs and '/_proxy' in qs.get('url', [''])[0]):
            # try to unwrap
            # find final url parameter if present
            if 'url' in qs:
                nested = qs['url'][0]
                # unquote once
                try:
                    nested_unq = unquote(nested)
                    url = nested_unq
                except Exception:
                    url = nested

        # optional whitelist check
        if WHITELIST:
            hostname = urlparse(url).hostname or ''
            if hostname not in WHITELIST:
                return Response("Host not allowed by proxy whitelist", status_code=403)

        # check cache (LRU)
        now = time.time()
        cached = _proxy_cache.get(url)
        if cached and now - cached[0] < _CACHE_TTL:
            # move to end to mark as recently used
            _proxy_cache.move_to_end(url)
            _, content, ctype = cached
            headers = {"Access-Control-Allow-Origin": "*"}
            return Response(content, media_type=ctype, headers=headers)

        async with httpx.AsyncClient(follow_redirects=True, timeout=20.0) as client:
            resp = await client.get(url)
            content = resp.content
            ctype = resp.headers.get('content-type') or 'application/octet-stream'
            # store in cache and evict if necessary
            try:
                _proxy_cache[url] = (now, content, ctype)
                _proxy_cache.move_to_end(url)
                if len(_proxy_cache) > _CACHE_MAX_ITEMS:
                    # pop least recently used
                    _proxy_cache.popitem(last=False)
            except Exception:
                pass
            headers = {"Access-Control-Allow-Origin": "*"}
            return Response(content, media_type=ctype, headers=headers)
    except Exception as e:
        return Response(str(e), status_code=502)
