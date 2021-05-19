var TestMgr,
  hasProp = {}.hasOwnProperty;

import Local from '../store/Local.js';

TestMgr = class TestMgr {
  constructor(nav, appName) {
    this.doReplay = this.doReplay.bind(this);
    this.nav = nav;
    this.appName = appName;
    this.dbName = 'Test';
    this.local = new Local(this.nav.stream, this.dbName);
  }

  async doReplay() { // CoffeeScript implicitly makes doReplay()
    var key, obj, ref;
    ref = this.nav.replays;
    //  async when in encounters await
    for (key in ref) {
      if (!hasProp.call(ref, key)) continue;
      obj = ref[key];
      await this.nav.sleep(1000);
      obj.source = 'Replay';
      this.nav.pub(obj, true);
    }
    this.local.add(this.dbName, this.appName, this.nav.replays);
  }

  doUrlMsg() {
    var i, len, url, urls;
    urls = ['http://localhost:3000/Home', 'http://localhost:3000/Prin', 'http://localhost:3000/Prin/Embrace', 'http://localhost:3000/Info', 'http://localhost:3000/Info?page=Topics', 'http://localhost:3000/Info?page=Topics&innovate=Soft', 'http://localhost:3000/Info/Team', 'http://localhost:3000/Info/Team/Collab', 'http://localhost:3000/Info/Team/Collab?page=Topics', 'http://localhost:3000/Info/Team?page=Graphs', 'http://localhost:3000/Cube'];
    for (i = 0, len = urls.length; i < len; i++) {
      url = urls[i];
      this.nav.toMsg(url);
    }
  }

};

export default TestMgr;
