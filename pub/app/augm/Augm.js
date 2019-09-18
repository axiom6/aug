var Augm;

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

Augm = (function() {
  class Augm {
    static start() {
      Data.batchRead(Augm.Batch, Augm.init, Data.refine);
    }

    static init(batch) {
      var streamLog, subjects;
      Augm.Batch = batch; // Not necessary here, but assigned for compatibilitry
      window['Geom'] = {};
      Augm.app = 'Augm';
      subjects = ["Draw", "Note", "Menu", "Tabs", "Geom", "Data", "Cache", "Navd"];
      streamLog = {
        subscribe: false,
        publish: false,
        subjects: subjects
      };
      Augm.stream = new Stream(subjects, streamLog);
      Augm.nav = new Nav(Augm.stream, batch);
      Augm.build = new Build(batch);
      //ain.cache  = new Cache( Augm.stream )
      Augm.vue();
    }

    static vue() {
      var app;
      Augm.mixin = new Mixin(Augm, ['Home', 'Math', 'Geom', 'Data', 'Note', 'Draw', 'Cube', 'Wood']);
      Vue['mixin'](Augm.mixin.mixin());
      Vue.use(Router);
      app = new Vue({
        router: Augm.router(),
        render: function(h) {
          return h(Home.Dash);
        }
      });
      app.$mount('h-augm');
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
            path: '/math',
            name: 'Math',
            components: {
              Math: Home.Math
            },
            children: [
              {
                path: 'ML',
                name: 'MathML',
                components: {
                  MathML: Augm.lazy('vue/math/MathML')
                }
              },
              {
                path: 'EQ',
                name: 'MathEQ',
                components: {
                  MathEQ: Augm.lazy('vue/math/MathEQ')
                }
              }
            ]
          },
          {
            path: '/geom',
            name: 'Geom',
            components: {
              Geom: Home.Geom
            },
            children: [
              {
                path: '2D',
                name: 'Geom2D',
                components: {
                  Geom2D: Augm.lazy('vue/geom/Geom2D')
                }
              },
              {
                path: '3D',
                name: 'Geom3D',
                components: {
                  Geom3D: Augm.lazy('vue/geom/Geom3D')
                }
              },
              {
                path: '4D',
                name: 'Geom4D',
                components: {
                  Geom4D: Augm.lazy('vue/geom/Geom4D')
                }
              }
            ]
          },
          {
            path: '/data',
            name: 'Data',
            components: {
              Data: Home.Data
            },
            children: [
              {
                path: 'tables',
                name: 'Tables',
                components: {
                  Tables: Augm.lazy('vue/data/Tables')
                }
              },
              {
                path: 'pivots',
                name: 'Pivots',
                components: {
                  Pivots: Augm.lazy('vue/data/Pivots')
                }
              }
            ]
          },
          {
            path: '/note',
            name: 'Note',
            components: {
              Note: Home.Note
            },
            children: [
              {
                path: 'stand',
                name: 'Stand',
                components: {
                  Stand: Augm.lazy('vue/note/StandVue')
                }
              },
              {
                path: 'embed',
                name: 'Embed',
                components: {
                  Embed: Augm.lazy('vue/note/EmbedVue')
                }
              },
              {
                path: 'maths',
                name: 'Maths',
                components: {
                  Maths: Augm.lazy('vue/note/MathsVue')
                }
              },
              {
                path: 'ganja',
                name: 'Ganja',
                components: {
                  Ganja: Augm.lazy('vue/note/GanjaVue')
                }
              }
            ]
          },
          {
            path: '/draw',
            name: 'Draw',
            components: {
              Draw: Augm.lazy('vue/draw/Draw')
            }
          },
          {
            path: '/cube',
            name: 'Cube',
            components: {
              Cube: Augm.lazy('vue/cube/Cube')
            }
          },
          {
            path: '/wood',
            name: 'Wood',
            components: {
              Wood: Augm.lazy('vue/wood/Wood')
            }
          }
        ]
      });
    }

  };

  Augm.FontUrl = "../../css/font/three/helvetiker_regular.typeface.json";

  Augm.Batch = {
    Math: {
      url: 'augm/Math.json',
      data: null,
      type: 'Pack',
      plane: 'Math'
    },
    Geom: {
      url: 'augm/Geom.json',
      data: null,
      type: 'Pack',
      plane: 'Geom'
    },
    Data: {
      url: 'augm/Data.json',
      data: null,
      type: 'Pack',
      plane: 'Data'
    },
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
    Cube: {
      url: 'muse/Cube.json',
      data: null,
      type: 'Pack',
      plane: 'Cube'
    },
    Font: {
      url: Augm.FontUrl,
      data: null,
      type: 'Font',
      plane: 'Cube'
    }
  };

  // Toc.vue components and routes
  Augm.komps = {
    Home: {
      title: 'Home',
      key: 'Home',
      route: 'Home',
      pracs: {},
      ikw: false,
      icon: "fas fa-home"
    },
    Math: {
      title: 'Math',
      key: 'Math',
      route: 'Math',
      pracs: {},
      ikw: true,
      icon: "fas fa-bezier-curve"
    },
    Geom: {
      title: 'Geom',
      key: 'Geom',
      route: 'Geom',
      pracs: {},
      ikw: true,
      icon: "fas fa-shapes"
    },
    Data: {
      title: 'Data',
      key: 'Data',
      route: 'Data',
      pracs: {},
      ikw: true,
      icon: "fas fa-database"
    },
    Note: {
      title: 'Note',
      key: 'Note',
      route: 'Note',
      pracs: {},
      ikw: false,
      icon: "fab fa-leanpub"
    },
    Draw: {
      title: 'Draw',
      key: 'Draw',
      route: 'Draw',
      pracs: {},
      ikw: false,
      icon: "fas fa-draw-polygon"
    },
    Cube: {
      title: 'Cube',
      key: 'Cube',
      route: 'Cube',
      pracs: {},
      ikw: false,
      icon: "fas fa-cubes"
    },
    Wood: {
      title: 'Wood',
      key: 'Wood',
      route: 'Wood',
      pracs: {},
      ikw: false,
      icon: "fas fa-tree"
    }
  };

  return Augm;

}).call(this);

export default Augm;
