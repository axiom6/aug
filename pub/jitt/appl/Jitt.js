var Jitter;

import {
  tester
} from '../../../lib/pub/test/Tester.js';

import Access from '../../../lib/pub/util/Access.js';

import Stream from '../../../lib/pub/util/Stream.js';

import Touch from '../../../lib/pub/navi/Touch.js';

import Mix from '../../../lib/pub/navi/Mix.js';

import Nav from '../../../lib/pub/navi/Nav.js';

import {
  createApp
} from 'vue';

import {
  createRouter,
  createWebHistory
} from 'vue-router';

import ChoiceJson from '../../../data/jitter/Choice.json';

import JitterJson from '../../../data/jitter/Jitter.json';

import FlavorJson from '../../../data/jitter/Flavor.json';

import Home from '../../../vue/jitt/appl/Jitt.vue';

import Flavor from '../../../vue/jitt/main/Flavor.vue';

import Roast from '../../../vue/jitt/main/Roast.vue';

import Brew from '../../../vue/jitt/main/Brew.vue';

import Drink from '../../../vue/jitt/main/Drink.vue';

import Body from '../../../vue/jitt/main/Body.vue';

import Done from '../../../vue/jitt/main/Done.vue';

Jitter = (function() {
  //mport World   from '../../../vue/jitt/main/World.vue'
  //mport Region  from '../../../vue/jitt/main/Region.vue'
  class Jitter {
    static start() {
      var key, ref, val;
      Jitter.addToHead();
      ref = Jitter.Batch;
      for (key in ref) {
        val = ref[key];
        if ((val.refine != null) && val.refine) {
          val.data = Access.refine(val.data);
        }
      }
      Jitter.init(Jitter.Batch);
    }

    static addToHead() {
      var head, maniElem, siteElem;
      // manifest = """<link href="manifest.json"  rel="manifest" crossorigin="use-credentials">"""
      // siteLink = """<link href="https://vit-muse.web.app/" rel="canonical">"""
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

    static init(batch) {
      var streamLog, subjects;
      Jitter.Batch = batch; // Not necessary here, but assigned for compatibilitry
      Jitter.app = 'Jitter';
      subjects = ["Dir", "Nav"];
      streamLog = {
        subscribe: false,
        publish: false,
        subjects: subjects
      };
      Jitter.stream = new Stream(subjects, streamLog);
      Jitter.mix = new Mix(Jitter, Jitter.routeNames);
      Jitter.nav = new Nav(Jitter.stream, Jitter.mix, batch, Jitter.komps, {}, true);
      Jitter.touch = new Touch(Jitter.stream, Jitter.nav);
      //itter.cache   = new Cache( Jitter.stream )
      tester.setOptions({
        testing: true,
        archive: true,
        verbose: false,
        debug: false
      });
      Jitter.vue();
    }

    static vue() {
      var router;
      Jitter.app = createApp(Home.Dash);
      Jitter.app.provide('app', Jitter.app);
      Jitter.app.provide('mix', Jitter.mix);
      Jitter.app.provide('nav', Jitter.nav);
      Jitter.app.provide('tester', tester);
      router = Jitter.router(Jitter.routes);
      Jitter.app.use(router);
      Jitter.nav.router = router;
      Jitter.app.mount('j-jitter');
      Jitter.nav.doRoute({
        compKey: 'Home'
      });
    }

    static lazy(name) {
      return function() {
        var path;
        path = `../../${name}.js`;
        if (path === false) {
          ({});
        }
        return import( /* @vite-ignore */ path );
      };
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

  };

  Jitter.appName = 'Jitter';

  Jitter.Batch = {
    Choice: {
      url: 'jitter/Choice.json',
      data: ChoiceJson,
      type: 'none',
      plane: 'none',
      refine: true
    },
    Jitter: {
      url: 'jitter/Jitter.json',
      data: JitterJson,
      type: 'none',
      plane: 'none',
      refine: true
    },
    Flavor: {
      url: 'jitter/Flavor.json',
      data: FlavorJson,
      type: 'none',
      plane: 'none',
      refine: true
    }
  };

  // Vue Router Routes
  Jitter.routes = [
    {
      path: '/',
      name: 'Home',
      components: {
        Home: Home
      }
    },
    {
      path: '/Flavor',
      name: 'Flavor',
      components: {
        Flavor: Flavor
      }
    },
    {
      path: '/Roast',
      name: 'Roast',
      components: {
        Roast: Roast
      }
    },
    {
      path: '/Brew',
      name: 'Brew',
      components: {
        Brew: Brew
      }
    },
    {
      path: '/Drink',
      name: 'Drink',
      components: {
        Brew: Drink
      }
    },
    {
      path: '/Body',
      name: 'Body',
      components: {
        Body: Body
      }
    },
    {
      path: '/Done',
      name: 'Done',
      components: {
        Done: Done
      }
    }
  ];

  // Toc.vue components and route Nav() directions
  Jitter.komps = {
    Home: {
      name: 'Home',
      route: 'Home',
      icon: "fas fa-draw-polygon",
      west: "Flavor",
      north: "Flavor",
      east: "Flavor",
      south: "Flavor",
      next: "Home",
      prev: "Home"
    },
    Flavor: {
      name: 'Flavor',
      route: 'Flavor',
      icon: "fas fa-bezier-curve",
      west: "Roast",
      north: "Roast",
      east: "Roast",
      south: "Roast",
      next: "Home",
      prev: "Home"
    },
    Roast: {
      name: 'Roast',
      route: 'Roast',
      icon: "fas fa-bezier-curve",
      west: "Brew",
      north: "Brew",
      east: "Brew",
      south: "Brew",
      next: "Home",
      prev: "Home"
    },
    Brew: {
      name: 'Brew',
      route: 'Brew',
      icon: "fas fa-bezier-curve",
      west: "Drink",
      north: "Drink",
      east: "Drink",
      south: "Drink",
      next: "Home",
      prev: "Home"
    },
    Drink: {
      name: 'Drink',
      route: 'Drink',
      icon: "fas fa-bezier-curve",
      west: "Body",
      north: "Body",
      east: "Body",
      south: "Body",
      next: "Home",
      prev: "Home"
    },
    Body: {
      name: 'Body',
      route: 'Body',
      icon: "fas fa-bezier-curve",
      west: "Flavor",
      north: "Flavor",
      east: "Flavor",
      south: "Flavor",
      next: "Home",
      prev: "Home"
    },
    Done: {
      name: 'Done',
      route: 'Done',
      icon: "fas fa-bezier-curve",
      west: "Home",
      north: "Home",
      east: "Home",
      south: "Home",
      next: "Home",
      prev: "Home"
    }
  };

  Jitter.routeNames = Jitter.createRouteNames(Jitter.routes);

  return Jitter;

}).call(this);

export default Jitter;

//# sourceMappingURL=Jitt.js.map
