var TestMgr;

import Local from '../store/Local.js';

TestMgr = class TestMgr {
  constructor(nav, appName) {
    this.doPubs = this.doPubs.bind(this);
    this.doUrls = this.doUrls.bind(this);
    this.nav = nav;
    this.appName = appName;
    this.dbName = 'Test';
    this.local = new Local(this.nav.stream, this.dbName);
  }

  async doPubs(pubs) { // CoffeeScript implicitly makes doReplay()
    var i, len, obj;
//   async when in encounters await
    for (i = 0, len = pubs.length; i < len; i++) {
      obj = pubs[i];
      await this.nav.sleep(1000);
      obj.source = 'Replay';
      this.nav.pub(obj, true);
    }
    this.local.add(this.dbName, this.appName + 'Pubs', this.nav.pubs);
  }

  async doUrls(urls) {
    var i, len, url;
    for (i = 0, len = urls.length; i < len; i++) {
      url = urls[i];
      await this.nav.sleep(1000);
      this.nav.toMsg(url);
    }
    this.local.add(this.dbName, this.appName + 'Pubs', this.nav.pubs);
  }

  myUrls() {
    return ['http://localhost:3000/Home', 'http://localhost:3000/Prin', 'http://localhost:3000/Prin/Embrace', 'http://localhost:3000/Info', 'http://localhost:3000/Info?page=Topics', 'http://localhost:3000/Info?page=Topics&innovate=Soft', 'http://localhost:3000/Info/Team', 'http://localhost:3000/Info/Team/Collab', 'http://localhost:3000/Info/Team/Collab?page=Topics', 'http://localhost:3000/Info/Team?page=Graphs', 'http://localhost:3000/Cube'];
  }

};

export default TestMgr;
