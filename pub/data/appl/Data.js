var Data;

import Access from '../../base/util/Access.js';

import Stream from '../../base/util/Stream.js';

import Nav from '../../base/nav/Nav.js';

import Touch from '../../base/nav/Touch.js';

import Cache from '../../base/util/Cache.js';

import Mix from '../../base/nav/Mix.js';

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

import SoftJson from '../../../data/inno/Soft.json';

import DataJson from '../../../data/inno/Data.json';

import ScieJson from '../../../data/inno/Scie.json';

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

    static init(batch) {
      var error, infoSpec, subjects;
      Data.Batch = batch; // Not necessary here, but assigned for compatibilitry
      Data.myName = 'Muse';
      subjects = ["Nav"];
      infoSpec = {
        subscribe: false,
        publish: false,
        subjects: subjects
      };
      Data.stream = new Stream(subjects, infoSpec);
      Data.mix = new Mix(Data, Data.routeNames);
      Data.nav = new Nav(Data.stream, batch, Data.routes, Data.routeNames, Data.komps);
      Data.touch = new Touch(Data.stream, Data.nav);
      //ata.build  = new Build( batch, Data.komps )
      Data.cache = new Cache(Data.stream);
      Access.buildInnov(batch, 'Data', 'Info');
      Access.mergePracs(batch, 'Prin', [
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
      router = Data.router(Data.routes);
      Data.app.use(router);
      Data.nav.router = router;
      Data.app.mount('#muse');
      Data.nav.doRoute({
        route: 'Home'
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
  Data.komps = {
    Home: {
      title: 'Home',
      key: 'Home',
      route: 'Home',
      pracs: {},
      ikw: false,
      icon: "fas fa-home",
      north: "Query",
      prev: "Query",
      south: "Store",
      next: "Store"
    },
    Store: {
      title: 'Store',
      key: 'Store',
      route: 'Store',
      pracs: {},
      ikw: true,
      icon: "fas fa-cubes",
      north: "Home",
      prev: "Home",
      south: "Table",
      next: "Table"
    },
    Table: {
      title: 'Table',
      key: 'Table',
      route: 'Table',
      pracs: {},
      ikw: true,
      icon: "fas fa-table",
      north: "Store",
      prev: "Store",
      south: "Query",
      next: "Query"
    },
    Query: {
      title: 'Query',
      key: 'Query',
      route: 'Query',
      pracs: {},
      ikw: true,
      icon: "fas fa-question-circle",
      north: "Table",
      prev: "Table",
      south: "Home",
      next: "Home"
    }
  };

  return Data;

}).call(this);

export default Data;
