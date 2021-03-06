var Muse;

import Data from '../../base/util/Data.js';

import Build from '../../base/util/Build.js';

import Stream from '../../base/util/Stream.js';

import Nav from '../../base/nav/Nav.js';

import Touch from '../../base/nav/Touch.js';

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
      Muse.touch = new Touch(Muse.stream, Muse.nav.addInovToNavs(Muse.komps));
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
        'Talk',
        'Prin',
        'Comp',
        'Prac',
        'Disp',
        'Cube' // Can't use komps
      ]);
      Muse.nav.setMix(Muse.mixin.mixin().methods);
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
          },
          {
            path: '/cube',
            name: 'Cube',
            components: {
              Cube: Home.Cube
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
      data: null
    },
    Rows: {
      url: 'muse/Rows.json',
      data: null
    },
    Info: {
      url: 'muse/Info.json',
      data: null
    },
    Know: {
      url: 'muse/Know.json',
      data: null
    },
    Wise: {
      url: 'muse/Wise.json',
      data: null
    },
    Soft: {
      url: 'inno/Soft.json',
      data: null
    },
    Data: {
      url: 'inno/Data.json',
      data: null
    },
    Scie: {
      url: 'inno/Scie.json',
      data: null
    },
    Math: {
      url: 'inno/Math.json',
      data: null
    },
    Imgs: {
      url: 'imgs/Imgs.json',
      data: null
    }
  };

  // Toc.vue components and routes with no west or east directions
  Muse.komps = {
    Home: {
      title: 'Home',
      key: 'Home',
      route: 'Home',
      pracs: {},
      ikw: false,
      icon: "fas fa-home",
      north: "Cube",
      prev: "Cube",
      south: "Talk",
      next: "Talk"
    },
    Prin: {
      title: 'Prin',
      key: 'Prin',
      route: 'Prin',
      pracs: {},
      ikw: true,
      icon: "fas fa-balance-scale",
      north: "Home",
      prev: "Home",
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
      north: "Prin",
      prev: "Prin",
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
      north: "Info",
      prev: "Info",
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
      north: "Know",
      prev: "Know",
      south: "Home",
      next: "Home"
    },
    Cube: {
      title: 'Cube',
      key: 'Cube',
      route: 'Cube',
      pracs: {},
      ikw: false,
      icon: "fas fa-cubes",
      north: "Talk",
      prev: "Wise",
      south: "Wise",
      next: "Home"
    }
  };

  return Muse;

}).call(this);

export default Muse;
