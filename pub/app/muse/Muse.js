var Muse;

import Data from '../../base/util/Data.js';

import Build from '../../base/util/Build.js';

import Stream from '../../base/util/Stream.js';

import Nav from '../../base/nav/Nav.js';

import Mixin from '../../base/vue/Mixin.js';

import Vue from '../../lib/vue/vue.esm.browser.js';

import Router from '../../lib/vue/vue-router.esm.js';

import Home from './Home.js';

Vue['config'].productionTip = false;

Muse = (function() {
  class Muse {
    static start() {
      Data.batchRead(Muse.Batch, Muse.init, Data.refine);
    }

    static init(batch) {
      var infoSpec, subjects;
      Muse.Batch = batch; // Not necessary here, but assigned for compatibilitry
      Muse.app = 'Muse';
      subjects = ["Nav"];
      infoSpec = {
        subscribe: false,
        publish: false,
        subjects: subjects
      };
      Muse.stream = new Stream(subjects, infoSpec);
      Muse.nav = new Nav(Muse.stream, batch, Muse.komps, true);
      Muse.build = new Build(batch, Muse.komps);
      //use.cache  = new Cache( Muse.stream )
      Data.buildInnov(batch, 'Data', 'Info');
      Data.mergePracs(batch, 'Prin', ['Info', 'Know', 'Wise', 'Data']);
      Muse.mergeCols();
      Muse.vue();
    }

    static vue() {
      var app;
      Muse.mixin = new Mixin(Muse, [
        'Home',
        'Prin',
        'Comp',
        'Prac',
        'Disp' // Really can't use komps. Need Prac and Disp
      ]);
      Vue['mixin'](Muse.mixin.mixin());
      Vue.use(Router);
      app = new Vue({
        router: Muse.router(),
        render: function(h) {
          return h(Home.Dash);
        }
      });
      Muse.nav.$router = app.$router;
      app.$mount('muse');
    }

    static lazy(name) {
      var path;
      path = `../../${name}.js`;
      if (path === false) {
        ({});
      }
      return import( path );
    }

    static router() {
      return new Router({
        routes: [
          {
            path: '/',
            name: 'Home',
            components: {
              Home: Home
            }
          },
          {
            path: '/prin',
            name: 'Prin',
            components: {
              Prin: Home.Prin
            }
          },
          {
            path: '/comp',
            name: 'Comp',
            components: {
              Comp: Home.Comp
            }
          },
          {
            path: '/prac',
            name: 'Prac',
            components: {
              Prac: Home.Prac
            }
          },
          {
            path: '/disp',
            name: 'Disp',
            components: {
              Disp: Home.Disp
            }
          }
        ]
      });
    }

    static mergeCols() {
      Muse.build.dimDisps(); // Add disps to every dim - dimension
      Muse.build.colPracs(); // Add pracs to every col
    }

    static logPracs(compk) {
      console.log('Muse.pracs', Muse.Batch[compk].data[compk].pracs);
    }

  };

  Muse.Batch = {
    Prin: {
      url: 'muse/Prin.json',
      data: null,
      type: 'Pack',
      plane: 'Prin'
    },
    Rows: {
      url: 'muse/Rows.json',
      data: null,
      type: 'Pack',
      plane: 'Rows'
    },
    Info: {
      url: 'muse/Info.json',
      data: null,
      type: 'Pack',
      plane: 'Info'
    },
    Know: {
      url: 'muse/Know.json',
      data: null,
      type: 'Pack',
      plane: 'Know'
    },
    Wise: {
      url: 'muse/Wise.json',
      data: null,
      type: 'Pack',
      plane: 'Wise'
    },
    Data: {
      url: 'muse/Data.json',
      data: null,
      type: 'Pack',
      plane: 'Data'
    }
  };

  // Toc.vue components and routes
  Muse.komps = {
    Home: {
      title: 'Home',
      key: 'Home',
      route: 'Home',
      pracs: {},
      ikw: false,
      icon: "fas fa-home",
      west: "Wise",
      north: "Wise",
      prev: "Wise",
      east: "Prin",
      south: "Prin",
      next: "Prin"
    },
    Prin: {
      title: 'Base',
      key: 'Prin',
      route: 'Prin',
      pracs: {},
      ikw: true,
      icon: "fas fa-balance-scale",
      west: "Home",
      north: "Home",
      prev: "Home",
      east: "Info",
      south: "Info",
      next: "Info"
    },
    Info: {
      title: 'Info',
      key: 'Info',
      route: 'Comp',
      pracs: {},
      ikw: true,
      icon: "fas fa-th",
      west: "Prin",
      north: "Prin",
      prev: "Prin",
      east: "Know",
      south: "Know",
      next: "Know"
    },
    Know: {
      title: 'Know',
      key: 'Know',
      route: 'Comp',
      pracs: {},
      ikw: true,
      icon: "fas fa-university",
      west: "Info",
      north: "Info",
      prev: "Info",
      east: "Wise",
      south: "Wise",
      next: "Wise"
    },
    Wise: {
      title: 'Wise',
      key: 'Wise',
      route: 'Comp',
      pracs: {},
      ikw: true,
      icon: "fab fa-tripadvisor",
      west: "Know",
      north: "Know",
      prev: "Know",
      east: "Home",
      south: "Home",
      next: "Home"
    }
  };

  return Muse;

}).call(this);

export default Muse;
