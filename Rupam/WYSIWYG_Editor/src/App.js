import React, { useState, useRef, useEffect } from "react";

function App() {
  const [url, setUrl] = useState("https://google.com");
  const [iframeSrc, setIframeSrc] = useState(
    `http://localhost:8000/preview?url=${encodeURIComponent("https://google.com")}`
  );
  const iframeRef = useRef(null);
  const pendingResponseRef = useRef(null);
    const [iframeSrcDoc, setIframeSrcDoc] = useState("");

  useEffect(() => {
    function onMessage(e) {
      try {
        if (e.data && e.data.type === "HTML_RESPONSE") {
          const html = e.data.html;
          if (pendingResponseRef.current) {
            pendingResponseRef.current(html);
            pendingResponseRef.current = null;
          }
        }
      } catch (err) {
        // ignore
      }
    }
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  const handleLoad = () => {
    if (!url.startsWith("http")) {
      alert("Please include http:// or https://");
      return;
    }
    const previewUrl = `http://localhost:8000/preview?url=${encodeURIComponent(url)}`;
    setIframeSrc(previewUrl);

    // Fetch the sanitized HTML from the backend and inject via srcDoc so the
    // iframe becomes same-origin and editable in the parent.
    fetch(previewUrl)
      .then((res) => res.text())
      .then((html) => {
        setIframeSrcDoc(html);
      })
      .catch((err) => {
        console.error("Failed to fetch preview HTML:", err);
        alert("Failed to load preview HTML: " + err.message);
      });
  };

  const downloadHtml = (html, filename = "export.html") => {
    const blob = new Blob([html], { type: "text/html;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(link.href);
  };

  const handleExport = async () => {
    const iframe = iframeRef.current;
    if (!iframe) return alert("Preview not ready");

    // First attempt: same-origin access
    try {
      const doc = iframe.contentDocument || iframe.contentWindow.document;
      const html = "<!doctype html>\n" + doc.documentElement.outerHTML;
      downloadHtml(html, "export.html");
      return;
    } catch (err) {
      // Cross-origin access blocked — fall back to postMessage
    }

    const htmlFromMessage = await new Promise((resolve, reject) => {
      let done = false;
      pendingResponseRef.current = (html) => {
        if (done) return;
        done = true;
        resolve(html);
      };
      // timeout in 6s
      setTimeout(() => {
        if (!done) {
          done = true;
          pendingResponseRef.current = null;
          reject(new Error("No response from preview iframe"));
        }
      }, 6000);

      // ask the iframe to post back its HTML
      try {
        iframe.contentWindow.postMessage({ type: "GET_HTML" }, "*");
      } catch (err) {
        pendingResponseRef.current = null;
        reject(err);
      }
    });

    downloadHtml(htmlFromMessage, "export.html");
  };

  // editing is enabled by default in the injected preview HTML; paste
  // sanitization is handled inside the injected script on the server side.

  // Auto-load the initial preview when the component mounts
  React.useEffect(() => {
    // call handleLoad after initial render
    handleLoad();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      className="w-screen h-screen flex flex-col bg-gray-100"
      style={{ width: "100vw", height: "100vh", display: "flex", flexDirection: "column", background: "#f3f4f6" }}
    >
      <header className="p-4 bg-white shadow-md flex justify-between items-center">
        <h1 className="text-lg font-semibold">AI SEO Editor</h1>
        <div className="flex items-center gap-2">
          <input
            className="border border-gray-300 rounded-lg px-3 py-2 w-96"
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter website URL..."
          />
          <button
            onClick={handleLoad}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow"
          >
            Load
          </button>
        </div>
      </header>

      <div className="flex-1 p-4 bg-gray-200">
        <div className="w-full h-full flex items-center justify-center">
          {/* Resizable container: users can drag the corner to resize the preview pane */}
          <div
            style={{
              resize: "both",
              overflow: "hidden",
              minWidth: 320,
              minHeight: 300,
              width: "100%",
              height: "70vh",
              maxWidth: "100%",
            }}
            className="bg-white border rounded-lg"
          >
            {iframeSrcDoc ? (
              <iframe
                ref={iframeRef}
                srcDoc={iframeSrcDoc}
                title="Website Preview"
                style={{ width: "100%", height: "100%", border: "none", borderRadius: 8 }}
              />
            ) : (
              <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "#666" }}>
                Loading preview...
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="p-3 bg-gray-100 flex justify-end">
        <button
          onClick={handleExport}
          className="bg-green-600 text-white px-4 py-2 rounded shadow"
        >
          Export HTML
        </button>
      </div>
    </div>
  );
}

export default App;
