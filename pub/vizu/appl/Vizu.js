var Vizu;

import Access from '../../../lib/pub/util/Access.js';

import Stream from '../../../lib/pub/util/Stream.js';

import Nav from '../../../lib/pub/navi/Nav.js';

import Mix from '../../../lib/pub/navi/Mix.js';

import {
  vis
} from '../../../lib/pub/draw/Vis.js';

import {
  tester
} from '../../../lib/pub/test/tester.js';

import Main from '../main/Main.js';

import Dash from '../../../vue/vizu/appl/Dash.vue';

import {
  createApp
} from 'vue';

import MainJson from '../../../data/opts/Main.json';

import PrinJson from '../../../data/muse/Prin.json';

import RowsJson from '../../../data/muse/Rows.json';

import InfoJson from '../../../data/muse/Info.json';

import KnowJson from '../../../data/muse/Know.json';

import WiseJson from '../../../data/muse/Wise.json';

import CubeJson from '../../../data/muse/Cube.json';

import TestJson from '../../../data/muse/Test.json';

import FontJson from '../../../LIB/css/font/three/helvetiker_regular.typeface.json';

Vizu = (function() {
  class Vizu {
    static start(href) {
      var key, ref, val;
      console.log("Viz.start()", href);
      Vizu.href = href;
      Vizu.addToHead();
      ref = Vizu.Batch;
      for (key in ref) {
        val = ref[key];
        if ((val.refine != null) && val.refine) {
          val.data = Access.refine(val.data);
        }
      }
      Vizu.init();
    }

    static addToHead() {
      var head, maniElem, siteElem;
      // manifest   = """<link href="manifest.json"  rel="manifest" crossorigin="use-credentials">"""
      // siteLink   = """<link href="https://vit-muse.web.app/" rel="canonical">"""
      maniElem = document.createElement('link');
      maniElem.href = "manifest.json";
      maniElem.rel = "manifest";
      maniElem['crossorigin'] = "use-credentials";
      siteElem = document.createElement('link');
      siteElem.href = window.location.href;
      siteElem.rel = "canonical";
      head = document.getElementsByTagName("head")[0];
      head.appendChild(maniElem);
      head.appendChild(siteElem);
    }

    static init() {
      var error, streamLog, subjects;
      subjects = ["Nav", "Tab", "View"];
      streamLog = {
        subscribe: false,
        publish: false,
        subjects: subjects
      };
      Vizu.stream = new Stream(subjects, streamLog);
      Vizu.mix = new Mix(Vizu);
      Vizu.nav = new Nav(Vizu, Vizu.stream, Vizu.komps, Vizu.pages);
      Vizu.vis = vis;
      Vizu.main = new Main(Vizu.stream, Vizu.nav);
      Vizu.tester = tester;
      try {
        //izu.mix.opts = Vizu.Batch.Main.data # JSON.parse( batch.Main.data )
        //Viz.cache  = new Cache( Viz.stream )
        Vizu.vue3();
      } catch (error1) {
        error = error1;
        console.error('Viz.vue app.use error', error);
      }
    }

    static vue3() {
      Vizu.app = createApp(Dash);
      Vizu.app.provide('mix', Vizu.mix);
      Vizu.app.provide('nav', Vizu.nav);
      Vizu.app.provide('vis', Vizu.vis);
      Vizu.app.provide('main', Vizu.main);
      Vizu.app.mount('#vizu');
      Vizu.nav.pub(Vizu.nav.toPub(Vizu.href), true);
    }

    static lazy(name) {
      return function() {
        var path;
        path = `../../${name}.vue`;
        if (path === false) {
          ({});
        }
        return import( /* @vite-ignore */ path );
      };
    }

  };

  Vizu.appName = 'Vizu';

  Vizu.debug = true;

  Vizu.Batch = {
    Main: {
      url: 'opts/Main.json',
      data: MainJson,
      refine: false
    },
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
    Test: {
      url: 'muse/Test.json',
      data: TestJson,
      refine: true
    },
    Cube: {
      url: 'muse/Cube.json',
      data: CubeJson,
      refine: true
    },
    Font: {
      url: '',
      data: FontJson,
      refine: false
    }
  };

  Vizu.komps = Access.kompsDirs({
    Home: {
      title: 'Home',
      key: 'Home',
      pracs: {},
      ikw: false,
      icon: "fas fa-home"
    },
    Hexa: {
      title: 'Hexa',
      key: 'Hexa',
      pracs: {},
      ikw: false,
      icon: "fas fa-snowflake"
    },
    Hues: {
      title: 'Hues',
      key: 'Hues',
      pracs: {},
      ikw: false,
      icon: "fas fa-palette"
    },
    Rgbs: {
      title: 'Rgbs',
      key: 'Rgbs',
      pracs: {},
      ikw: false,
      icon: "fas fa-cube"
    },
    Grid: {
      title: 'Grid',
      key: 'Grid',
      pracs: {},
      ikw: false,
      icon: "fas fa-border-none"
    },
    Cube: {
      title: 'Cube',
      key: 'Cube',
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

  Vizu.FontUrl = "../../css/font/three/helvetiker_regular.typeface.json";

  // This does not make sense
  Vizu.pages = {
    Hexa: {
      Hex30: {
        title: 'Hex30',
        key: 'Hex30',
        show: false
      },
      Hex60: {
        title: 'Hex60',
        key: 'Hex60',
        show: false
      },
      Ysv: {
        title: 'Ysv',
        key: 'Ysv',
        show: false
      },
      Hsv: {
        title: 'Hsv',
        key: 'Hsv',
        show: false
      },
      Surface: {
        title: 'Surface',
        key: 'Surface',
        show: false
      }
    },
    Rgbs: {
      Rgb: {
        title: 'Rgb',
        key: 'Rgb',
        show: false
      },
      Face: {
        title: 'Face',
        key: 'Face',
        show: false
      }
    },
    Hues: {
      Red: {
        title: 'Red',
        key: 'Red',
        show: false
      },
      Orange: {
        title: 'Orange',
        key: 'Orange',
        show: false
      },
      Yellow: {
        title: 'Yellow',
        key: 'Yellow',
        show: false
      },
      Lime: {
        title: 'Lime',
        key: 'Lime',
        show: false
      },
      Green: {
        title: 'Green',
        key: 'Green',
        show: false
      },
      Cyan: {
        title: 'Cyan',
        key: 'Cyan',
        show: false
      },
      Blue: {
        title: 'Blue',
        key: 'Blue',
        show: false
      },
      Magenta: {
        title: 'Magenta',
        key: 'Magenta',
        show: false
      }
    },
    Grid: {
      Grid: {
        title: 'Grid',
        key: 'Grid',
        show: false
      }
    }
  };

  return Vizu;

}).call(this);

export default Vizu;

//# sourceMappingURL=Vizu.js.map
