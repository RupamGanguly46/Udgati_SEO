# internal_links_graph.py
import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin, urlparse
import networkx as nx

def crawl_small_site(start_url: str, max_pages: int = 200):
    domain = urlparse(start_url).netloc
    to_visit = [start_url]
    visited = set()
    G = nx.DiGraph()
    while to_visit and len(visited) < max_pages:
        url = to_visit.pop(0)
        if url in visited:
            continue
        visited.add(url)
        try:
            r = requests.get(url, timeout=8)
            soup = BeautifulSoup(r.text, "lxml")
            for a in soup.find_all("a", href=True):
                href = a['href'].strip()
                if href.startswith("/"):
                    href = urljoin(start_url, href)
                if href.startswith("http"):
                    if urlparse(href).netloc == domain:
                        G.add_edge(url, href)
                        if href not in visited and href not in to_visit:
                            to_visit.append(href)
        except Exception:
            pass
    return G

def internal_link_metrics(start_url: str):
    G = crawl_small_site(start_url, max_pages=200)
    if G.number_of_nodes() == 0:
        return {"nodes": 0, "edges": 0, "avg_out_degree": 0}
    avg_out = sum(dict(G.out_degree()).values()) / G.number_of_nodes()
    return {"nodes": G.number_of_nodes(), "edges": G.number_of_edges(), "avg_out_degree": avg_out}
