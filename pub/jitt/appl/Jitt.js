var Jitter;

import Access from '../../base/util/Access.js';

import Stream from '../../base/util/Stream.js';

import Touch from '../../base/nav/Touch.js';

import Cache from '../../base/util/Cache.js';

import Mix from '../../base/nav/Mix.js';

import Nav from '../../base/nav/Nav.js';

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
      ref = Jitter.Batch;
      // Data.batchRead( Jitter.Batch, Jitter.init, Data.refine )
      for (key in ref) {
        val = ref[key];
        if ((val.refine != null) && val.refine) {
          val.data = Access.refine(val.data);
        }
      }
      Jitter.init(Jitter.Batch);
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
      Jitter.nav = new Nav(Jitter.stream, batch, Jitter.routes, Jitter.routeNames, Jitter.komps, true);
      Jitter.touch = new Touch(Jitter.stream, Jitter.nav);
      Jitter.cache = new Cache(Jitter.stream);
      Jitter.vue();
    }

    static vue() {
      var router;
      Jitter.app = createApp(Home.Dash);
      Jitter.app.provide('app', Jitter.app);
      Jitter.app.provide('mix', Jitter.mix);
      Jitter.app.provide('nav', Jitter.nav);
      router = Jitter.router(Jitter.routes);
      Jitter.app.use(router);
      Jitter.nav.router = router;
      Jitter.app.mount('j-jitter');
      Jitter.nav.doRoute({
        route: 'Home'
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

  Jitter.Batch = {
    Choice: {
      url: 'jitter/Choice.json',
      data: ChoiceJson,
      type: 'None',
      plane: 'None',
      refine: true
    },
    Jitter: {
      url: 'jitter/Jitter.json',
      data: JitterJson,
      type: 'None',
      plane: 'None',
      refine: true
    },
    Flavor: {
      url: 'jitter/Flavor.json',
      data: FlavorJson,
      type: 'None',
      plane: 'None',
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
      path: '/flavor',
      name: 'Flavor',
      components: {
        Flavor: Flavor
      }
    },
    {
      path: '/roast',
      name: 'Roast',
      components: {
        Roast: Roast
      }
    },
    {
      path: '/brew',
      name: 'Brew',
      components: {
        Brew: Brew
      }
    },
    {
      path: '/drink',
      name: 'Drink',
      components: {
        Brew: Drink
      }
    },
    {
      path: '/body',
      name: 'Body',
      components: {
        Body: Body
      }
    },
    {
      path: '/done',
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
