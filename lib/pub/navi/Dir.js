var Dir;

Dir = class Dir {
  constructor(nav) {
    this.dir = this.dir.bind(this);
    this.nav = nav;
    this.komps = this.nav.komps;
    this.build = this.nav.build;
    this.debug = false;
    this.keyEvents();
  }

  keyEvents() {
    var keyDir;
    keyDir = (event) => {
      switch (event.key) {
        case 'ArrowRight':
          return this.dir('east');
        case 'ArrowLeft':
          return this.dir('west');
        case 'ArrowDown':
          return this.dir('south');
        case 'ArrowUp':
          return this.dir('north');
        case '+':
          return this.dir('next');
        case '-':
          return this.dir('prev');
      }
    };
    document.addEventListener('keydown', (event) => {
      return keyDir(event);
    });
  }

  dir(direct) {
    if (this.debug) {
      console.log("Dir.dir()", {
        dir: direct,
        pageKey: this.nav.pageKey
      });
    }
    if (this.nav.isApp('Muse')) {
      switch (this.nav.level) {
        case 'Comp':
          this.dirComp(direct);
          break;
        case 'Prac':
          this.dirPrac(direct);
          break;
        case 'Disp':
          this.dirDisp(direct);
          break;
        default:
          this.dirComp(direct);
      }
    } else if (this.nav.pageKey !== 'none' && (direct === 'west' || direct === 'east')) {
      this.dirPage(direct);
    } else {
      this.dirComp(direct);
    }
  }

  dirComp(dir) {
    var compDir, msg;
    if ((this.komps == null) || this.nav.compKey === 'none') {
      return;
    }
    compDir = this.komps[this.nav.compKey][dir];
    msg = {};
    msg.source = `${'Dir.dirComp'}(${dir})`;
    msg.compKey = compDir;
    this.nav.pub(msg);
  }

  dirPrac(dir) {
    var msg, prac, pracs;
    if (this.nav.compKey === 'none' || this.nav.pracKey === 'none') {
      return;
    }
    pracs = this.build.getPractices(this.nav.compKey);
    prac = this.build.adjacentPractice(pracs[this.nav.pracKey], dir);
    msg = {};
    msg.source = `${'Dir.dirPrac'}(${dir})`;
    msg.pracKey = prac.name;
    msg.compKey = this.build.getPlane(msg.pracKey);
    if (this.debug) {
      console.log("Dir.dirPrac()", {
        dir: dir,
        nextPrac: msg.pracKey,
        prevPrac: this.nav.pracKey,
        nextComp: msg.compKey,
        prevComp: this.nav.compKey,
        prac: prac
      });
    }
    this.nav.pub(msg);
  }

  dirDisp(dir) {
    var msg, prac, pracs;
    if (this.nav.compKey === 'none' || this.nav.pracKey === 'none' || this.nav.dispKey === 'none') {
      return;
    }
    pracs = this.build.getPractices(this.nav.compKey);
    prac = this.build.adjacentPractice(pracs[this.nav.pracKey], dir);
    msg = {};
    msg.source = `${'Dir.dirDisp'}(${dir})`;
    msg.pracKey = prac.name;
    msg.compKey = this.build.getPlane(msg.pracKey);
    msg.dispKey = this.build.getNextDispKey(this.nav.compKey, msg.compKey, this.nav.pracKey, msg.pracKey, this.nav.dispKey);
    if (this.debug) {
      console.log("Dir.dirDisp()", {
        dir: dir,
        nextDisp: msg.dispKey,
        prevDisp: this.nav.dispKey,
        nextPrac: msg.pracKey,
        prevPrac: this.nav.pracKey,
        prac: prac,
        nextComp: msg.compKey,
        prevComp: this.nav.compKey
      });
    }
    if (msg.dispKey !== 'none') {
      this.nav.pub(msg);
    }
  }

  dirPage(dir) {
    var i, j, msg, pageIdx, pages, ref;
    if (this.nav.compKey === 'none' || this.nav.pageKey === 'none') {
      return;
    }
    pages = this.nav.toKeys(this.nav.pages[this.nav.compKey]);
    if (pages.length <= 1) {
      return;
    }
    pageIdx = -1;
    i = 0;
    for (i = j = 0, ref = pages.length; (0 <= ref ? j < ref : j > ref); i = 0 <= ref ? ++j : --j) {
      if (pages[i] === this.nav.pageKey) {
        pageIdx = i;
      }
    }
    if (this.debug) {
      console.log("Dir.dirPage() One", {
        dir: dir,
        pageKey: this.nav.pageKey,
        pages: pages,
        pageIdx: pageIdx
      });
    }
    if (dir === "east") {
      pageIdx = pageIdx < pages.length - 1 ? pageIdx + 1 : 0;
    } else if (dir === "west") {
      pageIdx = pageIdx === 0 ? pages.length - 1 : pageIdx - 1;
    }
    msg = {};
    msg.source = `${'Nav.dirPage'}(${dir})`;
    msg.pageKey = pages[pageIdx];
    if (this.debug) {
      console.log("Dir.dirPage() Two", {
        dir: dir,
        pageKey: msg.pageKey,
        pages: pages,
        pageIdx: pageIdx
      });
    }
    this.nav.pub(msg);
  }

};

export default Dir;

//# sourceMappingURL=Dir.js.map
