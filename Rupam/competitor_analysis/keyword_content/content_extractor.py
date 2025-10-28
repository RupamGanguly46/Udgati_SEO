def get_page_text(url):
    import requests
    from bs4 import BeautifulSoup

    response = requests.get(url)
    soup = BeautifulSoup(response.text, 'html.parser')

    # Remove scripts, styles
    for script in soup(["script", "style"]):
        script.extract()

    text = soup.get_text(separator=' ')
    text = ' '.join(text.split())  # Clean whitespace
    return text
