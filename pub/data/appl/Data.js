var Data;

import {
  tester
} from '../../../lib/pub/test/Tester.js';

import Access from '../../../lib/pub/util/Access.js';

import Stream from '../../../lib/pub/util/Stream.js';

import Nav from '../../../lib/pub/navi/Nav.js';

import Touch from '../../../lib/pub/navi/Touch.js';

import Cache from '../../../lib/pub/util/Cache.js';

import Mix from '../../../lib/pub/navi/Mix.js';

import {
  createApp
} from 'vue';

import {
  createRouter,
  createWebHistory
} from 'vue-router';

import Home from '../../../vue/data/appl/Data.vue';

import PrinJson from '../../../data/muse/Prin.json';

import RowsJson from '../../../data/muse/Rows.json';

import InfoJson from '../../../data/muse/Info.json';

import KnowJson from '../../../data/muse/Know.json';

import WiseJson from '../../../data/muse/Wise.json';

import SoftwareJson from '../../../data/inno/Software.json';

import DataScienceJson from '../../../data/inno/DataScience.json';

import ScienceJson from '../../../data/inno/Science.json';

import MathJson from '../../../data/inno/Math.json';

import HuesJson from '../../../data/draw/Hues.json';

Data = (function() {
  class Data {
    static start() {
      var key, ref, val;
      Data.addToHead();
      ref = Data.Batch;
      for (key in ref) {
        val = ref[key];
        if ((val.refine != null) && val.refine) {
          val.data = Access.refine(val.data);
        }
      }
      Data.init(Data.Batch);
    }

    static addToHead() {
      var maniElem, siteElem;
      // manifest = """<link href="manifest.json"  rel="manifest" crossorigin="use-credentials">"""
      // siteLink = """<link href="https://vit-muse.web.app/" rel="canonical">"""
      maniElem = document.createElement('link');
      maniElem.href = "manifest.json";
      maniElem.rel = "manifest";
      maniElem['crossorigin'] = "use-credentials";
      siteElem = document.createElement('link');
      // console.log( 'Location', window.location.href )
      siteElem.href = window.location.href; // "https://vit-muse.web.app/" if window.location.contains('vit-muse')
      siteElem.rel = "canonical";
      document.getElementsByTagName("head")[0].appendChild(maniElem);
      document.getElementsByTagName("head")[0].appendChild(siteElem);
    }

    static init() {
      var error, infoSpec, subjects;
      Data.myName = 'Muse';
      subjects = ["Nav"];
      infoSpec = {
        subscribe: false,
        publish: false,
        subjects: subjects
      };
      Data.stream = new Stream(subjects, infoSpec);
      Data.mix = new Mix(Data);
      Data.nav = new Nav(Data, Data.stream, Data.komps, {}, true);
      Data.touch = new Touch(Data.stream, Data.nav);
      if (Data.mode === 'production') {
        Data.cache = new Cache(Data.stream);
      }
      tester.setOptions({
        testing: true,
        archive: false,
        verbose: false,
        debug: false
      });
      Access.buildInnov(Data.Batch, 'DataScience', 'Info');
      Access.mergePracs(Data.Batch, 'Prin', [
        'Info',
        'Know',
        'Wise' // 'Data'
// A lot can go wrong with vue3 initialization so trap errors
      ]);
      try {
        //ata.mergeCols()
        Data.vue3();
      } catch (error1) {
        error = error1;
        console.error('Muse.vue3 app.use error', error);
      }
    }

    static vue3() {
      var router;
      Data.app = createApp(Home.Dash);
      Data.app.provide('mix', Data.mix);
      Data.app.provide('nav', Data.nav);
      Data.app.provide('tester', tester);
      router = Data.router(Data.routes);
      Data.app.use(router);
      Data.nav.router = router;
      Data.app.mount('#muse');
      Data.nav.doRoute({
        compKey: 'Home'
      });
    }

    static lazy(name) {
      var path;
      path = `../../${name}.js`;
      if (path === false) {
        ({});
      }
      return import( /* @vite-ignore */ path );
    }

    static router(routes) {
      return createRouter({
        routes: routes,
        history: createWebHistory()
      });
    }

    static createRouteNames(routes) {
      var i, len, route, routeNames;
      routeNames = [];
      for (i = 0, len = routes.length; i < len; i++) {
        route = routes[i];
        routeNames.push(route.name);
      }
      return routeNames;
    }

    static logPracs(compk) {
      console.log('Muse.pracs', Data.Batch[compk].data[compk].pracs);
    }

  };

  Data.appName = 'Data';

  Data.mode = import.meta.env.MODE;

  Data.Batch = {
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
    Software: {
      url: 'inno/Software.json',
      data: SoftwareJson,
      refine: true
    },
    DataScience: {
      url: 'inno/DataScience.json',
      data: DataScienceJson,
      refine: true
    },
    Science: {
      url: 'inno/Science.json',
      data: ScienceJson,
      refine: true
    },
    Math: {
      url: 'inno/Math.json',
      data: MathJson,
      refine: true
    },
    Hues: {
      url: 'draw/Hues.json',
      data: HuesJson,
      refine: false
    }
  };

  Data.routes = [
    {
      path: '/',
      name: 'Home',
      components: {
        Home: Home
      }
    },
    {
      path: '/Store',
      name: 'Store',
      components: {
        Store: Home.Store
      }
    },
    {
      path: '/Table',
      name: 'Table',
      components: {
        Table: Home.Table
      }
    },
    {
      path: '/Query',
      name: 'Query',
      components: {
        Query: Home.Query
      }
    }
  ];

  Data.routeNames = Data.createRouteNames(Data.routes);

  // Toc.vue components and routes with no west or east directions
  Data.komps = Access.kompsDirs({
    Home: {
      title: 'Home',
      key: 'Home',
      route: 'Home',
      pracs: {},
      ikw: false,
      icon: "fas fa-home"
    },
    Store: {
      title: 'Store',
      key: 'Store',
      route: 'Store',
      pracs: {},
      ikw: true,
      icon: "fas fa-cubes"
    },
    Table: {
      title: 'Table',
      key: 'Table',
      route: 'Table',
      pracs: {},
      ikw: true,
      icon: "fas fa-table"
    },
    Query: {
      title: 'Query',
      key: 'Query',
      route: 'Query',
      pracs: {},
      ikw: true,
      icon: "fas fa-question-circle"
    }
  });

  return Data;

}).call(this);

export default Data;

//# sourceMappingURL=Data.js.map
