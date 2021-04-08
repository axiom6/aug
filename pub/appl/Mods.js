var Load;

import GeomND from '../../vue/geom/GeomND.vue';

import MathND from '../../vue/math/MathND.vue';

import Draw from '../../vue/draw/Draw.vue';

import Hues from '../../vue/draw/Hues.vue';

import Cube from '../../vue/cube/Cube.vue';

import Wood from '../../vue/wood/Wood.vue';

import Home from '../../vue/appl/Home.vue';

Load = class Load {
  constructor() {
    this.addScript("/assets/mathbox-bundle.js");
  }

  load(name) {
    switch (name) {
      case 'GeomND':
        return GeomND;
      case 'MathND':
        return MathND;
      case 'Draw':
        return Draw;
      case 'Hues':
        return Hues;
      case 'Cube':
        return Cube;
      case 'Wood':
        return Wood;
      default:
        return Home;
    }
  }

  addScript(src) { // "/lib/mbox/mathbox-bundle.js"
    var i, len, script, scripts, scriptx;
    scripts = document.getElementsByTagName('script');
    for (i = 0, len = scripts.length; i < len; i++) {
      scriptx = scripts[i];
      // console.log( 'Mods.addScript() scriptx src', scriptx.src )
      if (scriptx.src.includes(src)) {
        return;
      }
    }
    // console.log( 'Mods.addScript() adding', src )
    script = document.createElement('script');
    script.src = src;
    document.getElementsByTagName("head")[0].appendChild(script);
  }

};

export default Load;
