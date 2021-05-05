var Exit;

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

import ConditionsEastJson from '../../../data/exit/ConditionsEast.json';

import ConditionsWestJson from '../../../data/exit/ConditionsWest.json';

import DealsJson from '../../../data/exit/Deals.json';

import ForcastsJson from '../../../data/exit/Forcasts.json';

import I70MilePostsJson from '../../../data/exit/I70MilePosts.json';

import SegmentsEastJson from '../../../data/exit/SegmentsEast.json';

import SegmentsWestJson from '../../../data/exit/SegmentsWest.json';

Exit = (function() {
  class Exit {
    static start() {
      var key, ref, val;
      Exit.addToHead();
      ref = Exit.Batch;
      for (key in ref) {
        val = ref[key];
        if ((val.refine != null) && val.refine) {
          val.data = Access.refine(val.data);
        }
      }
      Exit.init(Exit.Batch);
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
      Exit.Batch = batch; // Not necessary here, but assigned for compatibilitry
      Exit.myName = 'Muse';
      subjects = ["Nav"];
      infoSpec = {
        subscribe: false,
        publish: false,
        subjects: subjects
      };
      Exit.stream = new Stream(subjects, infoSpec);
      Exit.mix = new Mix(Exit, Exit.routeNames);
      Exit.nav = new Nav(Exit.stream, batch, Exit.routes, Exit.routeNames, Exit.komps, true);
      Exit.touch = new Touch(Exit.stream, Exit.nav);
      //ata.build  = new Build( batch, Data.komps )
      Exit.cache = new Cache(Exit.stream);
      Access.buildInnov(batch, 'Data', 'Info');
      Access.mergePracs(batch, 'Prin', [
        'Info',
        'Know',
        'Wise' // 'Data'
// A lot can go wrong with vue3 initialization so trap errors
      ]);
      try {
        //ata.mergeCols()
        Exit.vue3();
      } catch (error1) {
        error = error1;
        console.error('Muse.vue3 app.use error', error);
      }
    }

    static vue3() {
      var router;
      Exit.app = createApp(Home.Dash);
      Exit.app.provide('mix', Exit.mix);
      Exit.app.provide('nav', Exit.nav);
      router = Exit.router(Exit.routes);
      Exit.app.use(router);
      Exit.nav.router = router;
      Exit.app.mount('#muse');
      Exit.nav.doRoute({
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
      console.log('Muse.pracs', Exit.Batch[compk].data[compk].pracs);
    }

  };

  Exit.Batch = {
    East: {
      url: 'muse/Prin.json',
      data: ConditionsEastJson,
      refine: true
    },
    West: {
      url: 'muse/Rows.json',
      data: ConditionsWestJson,
      refine: true
    },
    Deal: {
      url: 'muse/Info.json',
      data: DealsJson,
      refine: true
    },
    Fore: {
      url: 'muse/Know.json',
      data: ForcastsJson,
      refine: true
    },
    Post: {
      url: 'muse/Wise.json',
      data: I70MilePostsJson,
      refine: true
    },
    Sege: {
      url: 'inno/Soft.json',
      data: SegmentsEastJson,
      refine: true
    },
    SegW: {
      url: 'inno/Data.json',
      data: SegmentsWestJson,
      refine: true
    }
  };

  Exit.routes = [
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

  Exit.routeNames = Exit.createRouteNames(Exit.routes);

  // Toc.vue components and routes with no west or east directions
  Exit.komps = {
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

  return Exit;

}).call(this);

export default Exit;
