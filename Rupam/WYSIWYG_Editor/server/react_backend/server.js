// server/server.js
const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.static(path.join(__dirname, "../build"))); // serve React build later

app.get("/preview", async (req, res) => {
  try {
    const url = decodeURIComponent(req.query.url || "https://example.com");
    const response = await axios.get(url, {
      headers: { "User-Agent": "Mozilla/5.0 (AgenticSEO Preview)" },
    });

    const html = response.data;
    const $ = cheerio.load(html);

    // remove unsafe elements
    $("script").remove();
    $('meta[http-equiv="Content-Security-Policy"]').remove();

    // add <base> so relative paths resolve
    $("head").prepend(`<base href="${url}">`);

    // inject editable functionality
    $("body").append(`
      <style>
        .editable-hover { outline: 2px dashed #3b82f6 !important; }
      </style>
      <script>
        document.body.contentEditable = true;
        document.body.spellcheck = true;
        document.addEventListener('mouseover', e => {
          e.target.classList.add('editable-hover');
        });
        document.addEventListener('mouseout', e => {
          e.target.classList.remove('editable-hover');
        });
        document.addEventListener('click', e => {
          const a = e.target.closest('a');
          if (a) { e.preventDefault(); window.open(a.href, '_blank'); }
        });
      </script>
    `);

    res.send($.html());
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Error loading preview: " + err.message);
  }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
