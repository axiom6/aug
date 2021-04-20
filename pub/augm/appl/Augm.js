var Augm;

import Load from './Load.js';

import Access from '../../base/util/Access.js';

import Stream from '../../base/util/Stream.js';

import Nav from '../../base/nav/Nav.js';

import Mix from '../../base/nav/Mix.js';

import Home from '../../../vue/augm/appl/Augm.vue';

import {
  createApp
} from 'vue';

import {
  createRouter,
  createWebHistory
} from 'vue-router';

import MathJson from '../../../data/augm/Math.json';

import GeomJson from '../../../data/augm/Geom.json';

import DataJson from '../../../data/augm/Data.json';

import PrinJson from '../../../data/muse/Prin.json';

import RowsJson from '../../../data/muse/Rows.json';

import InfoJson from '../../../data/muse/Info.json';

import KnowJson from '../../../data/muse/Know.json';

import WiseJson from '../../../data/muse/Wise.json';

import QuadJson from '../../../data/draw/Quad.json';

import TechJson from '../../../data/draw/Tech.json';

import TreeJson from '../../../data/draw/Tree.json';

import CubeJson from '../../../data/muse/Cube.json';

import FlavorJson from '../../../data/jitter/Flavor.json';

import ChoiceJson from '../../../data/jitter/Choice.json';

import FontJson from "../../../css/font/three/helvetiker_regular.typeface.json";

Augm = (function() {
  var loader;

  //mport DataInov from   '../../../data/inno/Data.json'
  //mport MachInov from   '../../../data/inno/Mach.json'
  //mport MathInov from   '../../../data/inno/Math.json'
  //mport ScieJson from   '../../../data/inno/Scie.json'
  //mport SoftInov from   '../../../data/inno/Soft.json'
  class Augm {
    static start() {
      var key, ref, val;
      // console.log( 'Augm.start() env', process.env.NODE_ENV )
      if (process.env.NODE_ENV === 'development') {
        Augm.routes.push(Augm.geomRoute);
        Augm.komps.Geom = Augm.geomKomp;
      }
      Augm.routeNames = Augm.createRouteNames(Augm.routes);
      Augm.addToHead();
      ref = Augm.Batch;
      for (key in ref) {
        val = ref[key];
        if ((val.refine != null) && val.refine) {
          val.data = Access.refine(val.data);
        }
      }
      Augm.init(Augm.Batch);
    }

    static addToHead() {
      var maniElem, siteElem;
      // manifest   = """<link href="manifest.json"  rel="manifest" crossorigin="use-credentials">"""
      // siteLink   = """<link href="https://vit-muse.web.app/" rel="canonical">"""
      // mboxScript = """<script src="/lib/mbox/augm/mathbox-bundle.js"></script>"""
      maniElem = document.createElement('link');
      maniElem.href = "manifest.json";
      maniElem.rel = "manifest";
      maniElem['crossorigin'] = "use-credentials";
      siteElem = document.createElement('link');
      siteElem.href = window.location.href;
      siteElem.rel = "canonical";
      document.getElementsByTagName("head")[0].appendChild(maniElem);
      document.getElementsByTagName("head")[0].appendChild(siteElem);
    }

    static init(batch) {
      var error, streamLog, subjects;
      Augm.Batch = batch; // Not necessary here, but assigned for compatibilitry
      window['Geom'] = {};
      subjects = ["Nav"];
      streamLog = {
        subscribe: false,
        publish: false,
        subjects: subjects
      };
      Augm.stream = new Stream(subjects, streamLog);
      Augm.mix = new Mix(Augm, Augm.routeNames);
      Augm.nav = new Nav(Augm.stream, batch, Augm.routes, Augm.routeNames, Augm.komps, false);
      try {
        //ugm.cache  = new Cache( Augm.stream )
        Augm.vue();
      } catch (error1) {
        error = error1;
        console.error('Augm.vue app.use error', error);
      }
    }

    static vue() {
      var router;
      Augm.app = createApp(Home.Dash);
      Augm.app.provide('mix', Augm.mix);
      Augm.app.provide('nav', Augm.nav);
      router = Augm.router(Augm.routes);
      Augm.app.use(router);
      Augm.nav.router = router;
      Augm.app.mount('#augm');
      Augm.nav.doRoute({
        route: 'Home'
      });
    }

    static lazy(name) {
      return function() {
        var path;
        path = `../../${name}.vue`;
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
      var child, i, j, len, len1, ref, route, routeNames;
      routeNames = [];
      for (i = 0, len = routes.length; i < len; i++) {
        route = routes[i];
        routeNames.push(route.name);
        if (route.children != null) {
          ref = route.children;
          for (j = 0, len1 = ref.length; j < len1; j++) {
            child = ref[j];
            routeNames.push(child.name);
          }
        }
      }
      return routeNames;
    }

  };

  Augm.Batch = {
    Math: {
      url: 'augm/Math.json',
      data: MathJson,
      refine: true
    },
    Geom: {
      url: 'augm/Geom.json',
      data: GeomJson,
      refine: true
    },
    Data: {
      url: 'augm/Data.json',
      data: DataJson,
      refine: true
    },
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
    Cube: {
      url: 'muse/Cube.json',
      data: CubeJson,
      refine: true
    },
    Quad: {
      url: 'draw/Quad.json',
      data: QuadJson
    },
    Tech: {
      url: 'draw/Tech.json',
      data: TechJson
    },
    Tree: {
      url: 'draw/Tree.json',
      data: TreeJson
    },
    Flavor: {
      url: 'jitter/Flavor.json',
      data: FlavorJson
    },
    Choice: {
      url: 'jitter/Choice.json',
      data: ChoiceJson
    },
    Font: {
      url: '',
      data: FontJson
    }
  };

  loader = new Load();

  Augm.routes = [
    {
      path: '/',
      name: 'Home',
      components: {
        Home: Home
      }
    },
    {
      path: '/augm/math',
      name: 'Math',
      components: {
        Math: Home.Math
      },
      children: [
        {
          path: 'ML',
          name: 'MathML',
          components: {
            MathML: loader.load('MathND')
          }
        },
        {
          path: 'EQ',
          name: 'MathEQ',
          components: {
            MathEQ: loader.load('MathND')
          }
        }
      ]
    },
    {
      path: '/draw',
      name: 'Draw',
      components: {
        Draw: loader.load('Draw')
      }
    },
    {
      path: '/hues',
      name: 'Hues',
      components: {
        Hues: loader.load('Hues')
      }
    },
    {
      path: '/cube',
      name: 'Cube',
      components: {
        Cube: loader.load('Cube')
      }
    },
    {
      path: '/wood',
      name: 'Wood',
      components: {
        Wood: loader.load('Wood')
      }
    }
  ];

  Augm.geomRoute = {
    path: '/augm/geom',
    name: 'Geom',
    components: {
      Geom: Home.Geom
    },
    children: [
      {
        path: '2D',
        name: 'Geom2D',
        components: {
          Geom2D: loader.load('GeomND')
        }
      },
      {
        path: '3D',
        name: 'Geom3D',
        components: {
          Geom3D: loader.load('GeomND')
        }
      }
    ]
  };

  Augm.komps = {
    Home: {
      title: 'Home',
      key: 'Home',
      route: 'Home',
      pracs: {},
      ikw: false,
      icon: "fas fa-home",
      west: "Wood",
      north: "Wood",
      east: "Math",
      south: "Math",
      next: "Math",
      prev: "Wood"
    },
    Math: {
      title: 'Math',
      key: 'Math',
      route: 'Math',
      pracs: {},
      ikw: true,
      icon: "fas fa-bezier-curve",
      west: "Home",
      north: "Home",
      east: "Geom",
      south: "Geom",
      next: "Geom",
      prev: "Home"
    },
    //Data:{ title:'Data', key:'Data', route:'Data', pracs:{}, ikw:true,  icon:"fas fa-database"     }
    Draw: {
      title: 'Draw',
      key: 'Draw',
      route: 'Draw',
      pracs: {},
      ikw: false,
      icon: "fas fa-draw-polygon",
      west: "Note",
      north: "Note",
      east: "Hues",
      south: "Hues",
      next: "Hues",
      prev: "Note"
    },
    Hues: {
      title: 'Hues',
      key: 'Hues',
      route: 'Hues',
      pracs: {},
      ikw: false,
      icon: "fas fa-palette",
      west: "Draw",
      north: "Draw",
      east: "Cube",
      south: "Cube",
      next: "Cube",
      prev: "Draw"
    },
    Cube: {
      title: 'Cube',
      key: 'Cube',
      route: 'Cube',
      pracs: {},
      ikw: false,
      icon: "fas fa-cubes",
      west: "Hues",
      north: "Hues",
      east: "Wood",
      south: "Wood",
      next: "Wood",
      prev: "Hues"
    },
    Wood: {
      title: 'Wood',
      key: 'Wood',
      route: 'Wood',
      pracs: {},
      ikw: false,
      icon: "fas fa-tree",
      west: "Cube",
      north: "Cube",
      east: "Home",
      south: "Home",
      next: "Home",
      prev: "Cube"
    }
  };

  Augm.geomKomp = {
    title: 'Geom',
    key: 'Geom',
    route: 'Geom',
    pracs: {},
    ikw: true,
    icon: "fas fa-shapes",
    west: "Math",
    north: "Math",
    east: "Note",
    south: "Note",
    next: "Note",
    prev: "Math"
  };

  Augm.FontUrl = "../../css/font/three/helvetiker_regular.typeface.json";

  return Augm;

}).call(this);

export default Augm;
