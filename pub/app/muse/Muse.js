var Muse,
  hasProp = {}.hasOwnProperty;

import Data from '../../base/util/Data.js';

import Build from '../../ikw/cube/Build.js';

import Stream from '../../base/util/Stream.js';

import Nav from '../../base/util/Nav.js';

import Cache from '../../base/util/Cache.js';

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
      subjects = ["Info", "Know", "Wise", "Cube", "Menu", "Page", "Nav", "Toc", "Cache"];
      infoSpec = {
        subscribe: false,
        publish: false,
        subjects: subjects
      };
      Muse.stream = new Stream(subjects, infoSpec);
      Muse.nav = new Nav(Muse.stream, batch);
      Muse.build = new Build(batch);
      Muse.cache = new Cache(Muse.stream, 'Muse', Muse.cacheObjs, true);
      Muse.mergePracsPrin();
      //ain.build.logByColumn()
      Muse.vue();
    }

    static vue() {
      var app;
      Muse.mixin = new Mixin(Muse, ['Home', 'Prin', 'Comp', 'Prac', 'Disp', 'Cube']);
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

    static mergePracsPrin() {
      var col, cols, comp, i, key, len, prcs, ref;
      cols = Muse.Batch['Prin'].data.pracs;
      ref = ['Info', 'Know', 'Wise'];
      for (i = 0, len = ref.length; i < len; i++) {
        comp = ref[i];
        prcs = Muse.Batch[comp].data.pracs;
        for (key in cols) {
          if (!hasProp.call(cols, key)) continue;
          col = cols[key];
          prcs[key] = col;
        }
      }
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
      icon: "fas fa-home"
    },
    Prin: {
      title: 'Prin',
      key: 'Prin',
      route: 'Prin',
      pracs: {},
      ikw: true,
      icon: "fas fa-balance-scale"
    },
    Info: {
      title: 'Info',
      key: 'Info',
      route: 'Comp',
      pracs: {},
      ikw: true,
      icon: "fas fa-th"
    },
    Know: {
      title: 'Know',
      key: 'Know',
      route: 'Comp',
      pracs: {},
      ikw: true,
      icon: "fas fa-university"
    },
    Wise: {
      title: 'Wise',
      key: 'Wise',
      route: 'Comp',
      pracs: {},
      ikw: true,
      icon: "fab fa-tripadvisor"
    }
  };

  return Muse;

}).call(this);

Muse.cacheObjs = {
  MuseHtml: {
    name: 'MuseHtml',
    status: 0,
    url: '/pub/app/muse/muse.html'
  },
  //AugmHtml:     { name:'AugmHtml',     status:0, url:'/pub/app/augm/augm.html'         }
  //JitterHtml:   { name:'JitterHtml',   status:0, url:'/pub/app/jitter/jitter.html'     }
  MuseJS: {
    name: 'MuseJS',
    status: 0,
    url: '/pub/app/muse/Muse.js'
  },
  Vue: {
    name: 'Vue',
    status: 0,
    url: '/pub/lib/vue/vue.esm.browser.js'
  },
  VueRouter: {
    name: 'VueRouter',
    status: 0,
    url: '/pub/lib/vue/vue-router.esm.js'
  },
  Roboto: {
    name: 'Roboto',
    status: 0,
    url: '/pub/css/font/roboto/Roboto.css'
  },
  Home: {
    name: 'Home',
    status: 0,
    url: '/pub/app/muse/Home.js'
  },
  RobotoTTF: {
    name: 'RobotoTTF',
    status: 0,
    url: '/pub/css/font/roboto/Roboto-Regular.ttf'
  },
  FaSolidWoff2: {
    name: 'FaSolidWoff2',
    status: 0,
    url: '/pub/css/font/fontawesome/fa-solid-900.woff2'
  },
  FaBrandWoff2: {
    name: 'FaBrandWoff2',
    status: 0,
    url: '/pub/css/font/fontawesome/fa-brans-400.woff2'
  },
  FaInit: {
    name: 'FaInit',
    status: 0,
    url: '/pub/css/font/fontawesome/init.css'
  },
  Mixin: {
    name: 'Mixin',
    status: 0,
    url: '/pub/base/util/Mixin.js'
  },
  Stream: {
    name: 'Stream',
    status: 0,
    url: '/pub/base/util/Stream.js'
  },
  Cache: {
    name: 'Cache',
    status: 0,
    url: '/pub/base/util/Cache.js'
  },
  FontAweJS: {
    name: 'FontAweJS',
    status: 0,
    url: '/pub/base/util/FontAwe.js'
  },
  UtilJS: {
    name: 'UtilJS',
    status: 0,
    url: '/pub/base/util/Util.js'
  },
  DataJS: {
    name: 'UtilJS',
    status: 0,
    url: '/pub/base/util/Data.js'
  },
  VisJS: {
    name: 'VisJS',
    status: 0,
    url: '/pub/base/util/Vis.js'
  },
  NavJS: {
    name: 'NavJS',
    status: 0,
    url: '/pub/base/util/Nav.js'
  },
  BuildJS: {
    name: 'BuildJS',
    status: 0,
    url: '/pub/ikw/cube/Build.js'
  }
};

export default Muse;
