var TestMgr,
  hasProp = {}.hasOwnProperty;

import Local from '../store/Local.js';

TestMgr = class TestMgr {
  constructor(nav) {
    this.doReplay = this.doReplay.bind(this);
    this.nav = nav;
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
  }

  saveReplay(id) {
    this.local.add(this.dbName, id, this.nav.replays);
  }

};

export default TestMgr;
