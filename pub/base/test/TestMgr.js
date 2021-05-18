var TestMgr;

import Local from '../store/Local.js';

TestMgr = class TestMgr {
  constructor(nav) {
    this.nav = nav;
    this.local = new Local(this.nav.stream, 'Test');
  }

  saveReplay(name, id) {
    this.local.add(name, id, this.nav.replays);
  }

};

export default TestMgr;
