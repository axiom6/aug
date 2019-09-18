var Jitter;

import Data from '../../base/util/Data.js';

import Stream from '../../base/util/Stream.js';

import Dir from '../../base/util/Dir.js';

import Mixin from '../../base/vue/Mixin.js';

import Vue from '../../lib/vue/vue.esm.browser.js';

import Router from '../../lib/vue/vue-router.esm.js';

import Home from '../../vue/jitter/Home.js';

Vue['config'].productionTip = false;

Jitter = (function() {
  class Jitter {
    static start() {
      Data.batchRead(Jitter.Batch, Jitter.init, Data.refine);
    }

    static init(batch) {
      var streamLog, subjects;
      Jitter.Batch = batch; // Not necessary here, but assigned for compatibilitry
      Jitter.app = 'Jitter';
      subjects = ["Dir"];
      streamLog = {
        subscribe: false,
        publish: false,
        subjects: subjects
      };
      Jitter.stream = new Stream(subjects, streamLog);
      Jitter.dir = new Dir(Jitter.stream, batch['Navs'].data, 'Home');
      //ain.cache  = new Cache( Jitter.stream )
      Jitter.vue();
    }

    static vue() {
      var app;
      Jitter.mixin = new Mixin(Jitter, ['Home', 'Flavor', 'Roast', 'Brew', 'Drink', 'Body']);
      Vue['mixin'](Jitter.mixin.mixin());
      Vue.use(Router);
      app = new Vue({
        router: Jitter.router(),
        render: function(h) {
          return h(Home.Dash);
        }
      });
      app.$mount('j-jitter');
    }

    static lazy(name) {
      return function() {
        var path;
        path = `../../${name}.js`;
        if (path === false) {
          ({});
        }
        return import( path );
      };
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
            path: '/flavor',
            name: 'Flavor',
            components: {
              Flavor: Jitter.lazy('vue/jitter/Flavor')
            }
          },
          {
            path: '/roast',
            name: 'Roast',
            components: {
              Roast: Jitter.lazy('vue/jitter/Roast')
            }
          },
          {
            path: '/brew',
            name: 'Brew',
            components: {
              Brew: Jitter.lazy('vue/jitter/Brew')
            }
          },
          {
            path: '/drink',
            name: 'Drink',
            components: {
              Brew: Jitter.lazy('vue/jitter/Drink')
            }
          },
          {
            path: '/body',
            name: 'Body',
            components: {
              Body: Jitter.lazy('vue/jitter/Body')
            }
          },
          {
            path: '/world',
            name: 'World',
            components: {
              World: Jitter.lazy('vue/jitter/World')
            }
          },
          {
            path: '/region',
            name: 'Region',
            components: {
              Region: Jitter.lazy('vue/jitter/Region')
            }
          }
        ]
      });
    }

  };

  Jitter.Batch = {
    Choice: {
      url: 'jitter/Choice.json',
      data: null,
      type: 'None',
      plane: 'None'
    },
    Navs: {
      url: 'jitter/Navs.json',
      data: null,
      type: 'None',
      plane: 'None'
    },
    Jitter: {
      url: 'jitter/Jitter.json',
      data: null,
      type: 'None',
      plane: 'None'
    },
    Flavor: {
      url: 'jitter/Flavor.json',
      data: null,
      type: 'None',
      plane: 'None'
    },
    Region: {
      url: 'jitter/Region.json',
      data: null,
      type: 'None',
      plane: 'None'
    }
  };

  // Toc.vue components and routes
  Jitter.komps = {
    Home: {
      name: 'Home',
      route: 'Home',
      icon: "fas fa-draw-polygon"
    },
    Flavor: {
      name: 'Flavor',
      route: 'Flavor',
      icon: "fas fa-bezier-curve"
    },
    Roast: {
      name: 'Roast',
      route: 'Roast',
      icon: "fas fa-bezier-curve"
    },
    Brew: {
      name: 'Brew',
      route: 'Brew',
      icon: "fas fa-bezier-curve"
    },
    Drink: {
      name: 'Drink',
      route: 'Drink',
      icon: "fas fa-bezier-curve"
    },
    Body: {
      name: 'Body',
      route: 'Body',
      icon: "fas fa-bezier-curve"
    }
  };

  return Jitter;

}).call(this);

export default Jitter;
