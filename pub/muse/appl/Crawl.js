var Emitter, Zombie, cheerio, doCrawl, doVisit, doZombie, fetch, host, paths, sleep;

fetch = require('node-fetch');

cheerio = require('cheerio');

Zombie = require('zombie'); // class

Emitter = require('events');

host = 'http://localhost:3000/'; // 'https://muse-ad352.web.app/'  #

paths = ["Prin?page=Icons", "Prin?page=Topics", "Prin/Embrace?page=Topics", "Prin/Embrace?page=Graphs", "Prin/Embrace?page=Texts", "Info?page=Icons&innovate=Core", "Info?page=Topics&innovate=Core", "Info?page=Graphs&innovate=Core", "Info?page=Texts&innovate=Core", "Info?page=Texts&innovate=Soft", "Info?page=Texts&innovate=Data", "Know?page=Texts&innovate=Core", "Know?page=Graphs&innovate=Core", "Know?page=Topics&innovate=Core", "Know?page=Icons&innovate=Core", "Know?page=Icons&innovate=Science", "Know?page=Icons&innovate=Math", "Wise?page=Icons&innovate=Core", "Wise?page=Topics&innovate=Core", "Wise?page=Graphs&innovate=Core", "Wise?page=Texts&innovate=Core", "Defs"];

doCrawl = async function(paths) {
  var $, j, len, path, resp, text, url;
  for (j = 0, len = paths.length; j < len; j++) {
    path = paths[j];
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

// doCrawl( paths )
sleep = function(ms) {
  return new Promise((resolve) => {
    return setTimeout(resolve, ms);
  });
};

doVisit = function(zombie, paths, i) {
  return zombie.visit(host + paths[i], async function() {
    await sleep(1000);
    console.log('Path', paths[i]);
    console.log(zombie.location.href);
    return console.log(zombie.html('#muse'));
  });
};

doZombie = function(paths) {
  var emitter, zombie;
  //ombie.localhost( hostz, 3000 )
  zombie = new Zombie();
  emitter = new Emitter();
  emitter.setMaxListeners(paths.length);
  // for i in [0...paths.length]
  doVisit(zombie, paths, 0);
};

doZombie(paths);