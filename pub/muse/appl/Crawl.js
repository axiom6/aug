var cheerio, doCrawl, fetch, host, paths;

fetch = require('node-fetch');

cheerio = require('cheerio');

host = 'https://muse-ad352.web.app/'; // 'http://localhost:3000/'

paths = ['Home', 'Prin', 'Prin/Embrace', 'Info', 'Info?page=Topics', 'Info?page=Topics&innovate=Soft', 'Info/Team', 'Info/Team/Collab', 'Info/Team/Collab?page=Topics', 'Info/Team?page=Graphs', 'Cube'];

doCrawl = async function(paths) {
  var $, i, len, path, resp, text, url;
  for (i = 0, len = paths.length; i < len; i++) {
    path = paths[i];
    url = host + path;
    resp = (await fetch(url));
    text = (await resp.text());
    $ = cheerio.load(text);
    console.log('Crawl', {
      url: url,
      muse: $('#muse').html()
    });
  }
};

doCrawl(paths);
