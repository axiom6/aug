var Vizu;

import Access from '../../../lib/pub/util/Access.js';

import Stream from '../../../lib/pub/util/Stream.js';

import Nav from '../../../lib/pub/navi/Nav.js';

import Mix from '../../../lib/pub/navi/Mix.js';

import {
  tester
} from '../../../lib/pub/test/tester.js';

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

import FontJson from '../../../css/font/three/helvetiker_regular.typeface.json';

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
      Vizu.tester = tester;
      Vizu.mix.opts = Vizu.Batch.Main.data; // JSON.parse( batch.Main.data )
      try {
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

  Vizu.appName = 'Viz';

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

  Vizu.komps = {
    Home: {
      title: 'Home',
      key: 'Home',
      route: 'Home',
      pracs: {},
      ikw: false,
      icon: "fas fa-home",
      west: "Test",
      north: "Test",
      east: "Main",
      south: "Main",
      next: "Main",
      prev: "Hues"
    },
    Main: {
      title: 'Main',
      key: 'Main',
      route: 'Main',
      pracs: {},
      ikw: false,
      icon: "fas fa-bezier-curve",
      west: "Home",
      north: "Home",
      east: "Cube",
      south: "Cube",
      next: "Cube",
      prev: "Home"
    },
    Spot: {
      title: 'Spot',
      key: 'Spot',
      route: 'Spot',
      pracs: {},
      ikw: false,
      icon: "fas fa-lightbulb",
      west: "Cube",
      north: "Cube",
      east: "Test",
      south: "Test",
      next: "Test",
      prev: "Cube"
    },
    Test: {
      title: 'Test',
      key: 'Test',
      pracs: {},
      ikw: false,
      icon: "fas fa-stethoscope",
      north: "Geom",
      prev: "Geom",
      south: "Home",
      next: "Home"
    }
  };

  Vizu.FontUrl = "../../css/font/three/helvetiker_regular.typeface.json";

  // This does not make sense
  Vizu.pages = {
    Main: {
      Grids: {
        title: 'Grids',
        key: 'Grids',
        show: false
      },
      Rgbs: {
        title: 'Rgbs',
        key: 'Rgbs',
        show: false
      }
    }
  };

  return Vizu;

}).call(this);

export default Vizu;

//# sourceMappingURL=Vizu.js.map
