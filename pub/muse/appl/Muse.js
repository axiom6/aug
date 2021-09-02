var Muse;

import {
  tester
} from '../../../lib/pub/test/Tester.js';

import Access from '../../../lib/pub/util/Access.js';

import Build from '../../../lib/pub/util/Build.js';

import Stream from '../../../lib/pub/util/Stream.js';

import Nav from '../../../lib/pub/navi/Nav.js';

import Touch from '../../../lib/pub/navi/Touch.js';

import Cache from '../../../lib/pub/util/Cache.js';

import Mix from '../../../lib/pub/navi/Mix.js';

import {
  createApp
} from 'vue';

import Home from '../../../vue/muse/appl/Home.vue';

import Dash from '../../../vue/muse/appl/Dash.vue';

import MuseLD from '../../../src/muse/appl/MuseRT.json';

import PrinJson from '../../../data/muse/Prin.json';

import RowsJson from '../../../data/muse/Rows.json';

import InfoJson from '../../../data/muse/Info.json';

import KnowJson from '../../../data/muse/Know.json';

import WiseJson from '../../../data/muse/Wise.json';

import SoftJson from '../../../data/inno/Soft.json';

import DataJson from '../../../data/inno/Data.json';

import ScieJson from '../../../data/inno/Scie.json';

import MathJson from '../../../data/inno/Math.json';

import TestJson from '../../../data/muse/Test.json';

Muse = (function() {
  class Muse {
    static start(href) {
      var key, ref, val;
      console.log("Muse.start()", href, Muse.mode);
      Muse.href = href;
      Muse.addToHead();
      ref = Muse.Batch;
      for (key in ref) {
        val = ref[key];
        if (!((val.refine != null) && val.refine)) {
          continue;
        }
        val.data = Access.refine(val.data);
        if (Muse.debug) {
          console.log('Muse.init()', key);
        }
      }
      Muse.init(Muse.Batch);
    }

    static addToHead() {
      var head, jsonLD, maniElem, siteElem;
      // manifest = """<link href="manifest.json"  rel="manifest" crossorigin="use-credentials">"""
      // siteLink = """<link href="https://vit-muse.web.app/" rel="canonical">"""
      // https://muse-ad352.web.app
      maniElem = document.createElement('link');
      maniElem.href = "manifest.json?v=2";
      maniElem.rel = "manifest";
      maniElem['crossorigin'] = "use-credentials";
      siteElem = document.createElement('link');
      // console.log( 'Location', window.location.href )
      siteElem.href = window.location.href;
      siteElem.rel = "canonical";
      jsonLD = document.createElement('script');
      jsonLD.type = "application/ld+json";
      jsonLD.text = JSON.stringify(MuseLD);
      head = document.getElementsByTagName("head")[0];
      head.appendChild(maniElem);
      head.appendChild(siteElem);
      head.appendChild(jsonLD);
    }

    static init() {
      var error, infoSpec, subjects;
      Muse.myName = 'Muse';
      subjects = ["Nav", "Tab", "View"];
      infoSpec = {
        subscribe: false,
        publish: false,
        subjects: subjects
      };
      Muse.stream = new Stream(subjects, infoSpec);
      Muse.mix = new Mix(Muse);
      Muse.nav = new Nav(Muse, Muse.stream, Muse.komps, Muse.pages, false);
      Muse.touch = new Touch(Muse.stream, Muse.nav);
      Muse.build = new Build(Muse.Batch, Muse.komps);
      if (Muse.mode === 'production') {
        Muse.cache = new Cache(Muse.stream);
      }
      tester.setOptions({
        testing: true,
        archive: true,
        verbose: false,
        debug: false
      });
      Access.buildInnov(Muse.Batch, 'Data', 'Info');
      Access.mergePracs(Muse.Batch, 'Prin', [
        'Info',
        'Know',
        'Wise' // 'Data'
      ]);
      Muse.mergeCols(); // A lot can go wrong with vue3 initialization so trap errors
      try {
        Muse.vue3();
      } catch (error1) {
        error = error1;
        console.error('Muse.vue3 app.use error', error);
      }
    }

    static vue3() {
      Muse.app = createApp(Dash);
      Muse.app.provide('mix', Muse.mix);
      Muse.app.provide('nav', Muse.nav);
      Muse.app.provide('tester', tester);
      Muse.app.mount('#muse');
      Muse.nav.pub(Muse.nav.toPub(Muse.href), true);
    }

    static lazy(name) {
      var path;
      path = `../../${name}.js`;
      if (path === false) {
        ({});
      }
      return import( /* @vite-ignore */ path );
    }

    static mergeCols() {
      Muse.build.dimDisps(); // Add disps to every dim - dimension
      Muse.build.colPracs(); // Add pracs to every col
    }

    static logPracs(compk) {
      console.log('Muse.pracs', Muse.Batch[compk].data[compk].pracs);
    }

  };

  Muse.appName = 'Muse';

  Muse.mode = import.meta.env.MODE;

  // Initialization is accomplished in 3 steps:
  // 1. Read in all the JSON config files in Muse.Batch. Call Muse.init() when complete.
  // 2. Muse.init() initializes publish, subscribe and navigation with Stream and refines Practices with Build and merge.
  // 3. Muse.vue() launches Vue with Home page and a Toc for Prin Info Know and Wise practices
  // Data.batchRead( Muse.Batch, Muse.init, Data.refine )

  // Called by muse.html to kick things off
  // 1. Read in all the JSON config files in Muse.Batch. Call Muse.init() when complete.
  Muse.debug = false;

  Muse.Batch = {
    Prin: {
      url: 'muse/Prin.json',
      data: PrinJson,
      refine: true
    },
    Rows: {
      url: 'muse/Rows.json',
      data: RowsJson,
      refine: true
    },
    Info: {
      url: 'muse/Info.json',
      data: InfoJson,
      refine: true
    },
    Know: {
      url: 'muse/Know.json',
      data: KnowJson,
      refine: true
    },
    Wise: {
      url: 'muse/Wise.json',
      data: WiseJson,
      refine: true
    },
    Soft: {
      url: 'inno/Soft.json',
      data: SoftJson,
      refine: true
    },
    Data: {
      url: 'inno/Data.json',
      data: DataJson,
      refine: true
    },
    Science: {
      url: 'inno/Scie.json',
      data: ScieJson,
      refine: true
    },
    Math: {
      url: 'inno/Math.json',
      data: MathJson,
      refine: true
    },
    Test: {
      url: 'muse/Test.json',
      data: TestJson,
      refine: true
    }
  };

  // Toc.vue components and routes with no west or east directions
  Muse.komps = Access.kompsDirs({
    Home: {
      title: 'Home',
      key: 'Home',
      pracs: {},
      ikw: false,
      icon: "fas fa-home"
    },
    Prin: {
      title: 'Prin',
      key: 'Prin',
      pracs: {},
      ikw: true,
      icon: "fas fa-balance-scale"
    },
    Info: {
      title: 'Info',
      key: 'Info',
      pracs: {},
      ikw: true,
      icon: "fas fa-th"
    },
    Know: {
      title: 'Know',
      key: 'Know',
      pracs: {},
      ikw: true,
      icon: "fas fa-university"
    },
    Wise: {
      title: 'Wise',
      key: 'Wise',
      pracs: {},
      ikw: true,
      icon: "fas fa-yin-yang"
    },
    Defs: {
      title: 'Defs',
      key: 'Defs',
      pracs: {},
      ikw: false,
      icon: "fas fa-cubes"
    },
    Test: {
      title: 'Test',
      key: 'Test',
      pracs: {},
      ikw: false,
      icon: "fas fa-stethoscope"
    }
  });

  Muse.pages = {
    Comp: {
      Icons: {
        title: 'Icons',
        key: 'Icons',
        show: true
      },
      Topics: {
        title: 'Topics',
        key: 'Topics',
        show: false
      },
      Graphs: {
        title: 'Graphs',
        key: 'Graphs',
        show: false
      },
      Texts: {
        title: 'Texts',
        key: 'Texts',
        show: false
      }
    },
    Prac: {
      Topics: {
        title: 'Topics',
        key: 'Topics',
        show: true
      },
      Graphs: {
        title: 'Graphs',
        key: 'Graphs',
        show: false
      },
      Texts: {
        title: 'Texts',
        key: 'Texts',
        show: false
      }
    },
    Disp: {
      Topics: {
        title: 'Topics',
        key: 'Topics',
        show: true
      },
      Texts: {
        title: 'Texts',
        key: 'Texts',
        show: false
      }
    },
    Info: {
      Core: {
        title: 'Core',
        key: "Core",
        show: true,
        icon: "fas fa-th"
      },
      Soft: {
        title: 'Soft',
        key: "Soft",
        show: false,
        icon: "fas fa-codepen"
      },
      Data: {
        title: 'Data',
        key: "Data",
        show: false,
        icon: "fas fa-table"
      }
    },
    Know: {
      Core: {
        title: 'Core',
        key: "Core",
        show: true,
        icon: "fas fa-university"
      },
      Science: {
        title: 'Science',
        key: "Science",
        show: false,
        icon: "fas fa-flask"
      },
      Math: {
        title: 'Math',
        key: "Math",
        show: false,
        icon: "fas fa-calculator"
      }
    },
    Wise: {
      Core: {
        title: 'Core',
        key: "Core",
        show: true,
        icon: "fas fa-yin-yang"
      }
    },
    Rows: {
      Plane: {
        name: 'Info',
        dir: 'cm',
        icon: "fas fa-th"
      },
      Learn: {
        name: 'Learn',
        dir: 'le',
        icon: "fas fa-graduation-cap"
      },
      Do: {
        name: 'Do',
        dir: 'do',
        icon: "fas fa-cog"
      },
      Share: {
        name: 'Share',
        dir: 'sh',
        icon: "fas fa-share-alt-square"
      }
    },
    Prin: {
      Icons: {
        title: 'Icons',
        key: 'Icons',
        show: true
      },
      Topics: {
        title: 'Topics',
        key: 'Topics',
        show: false
      }
    }
  };

  return Muse;

}).call(this);

export default Muse;

//# sourceMappingURL=Muse.js.map
