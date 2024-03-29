var Load;

Load = class Load {
  constructor() {}

  load(name) {
    switch (name) {
      case 'GeomND':
        return this.lazy('../../../vue/augm/geom/GeomND.vue');
      case 'MathND':
        return this.lazy('../../../vue/augm/math/MathND.vue');
      case 'Draw':
        return this.lazy('../../../vue/augm/draw/Draw.vue');
      case 'Hues':
        return this.lazy('../../../vue/augm/mbox/Hues.vue');
      case 'Tools':
        return this.lazy('../../../vue/augm/tool/Tools.vue');
      case 'Cube':
        return this.lazy('../../../vue/augm/cube/Cube.vue');
      case 'Wood':
        return this.lazy('../../../vue/augm/wood/Wood.vue');
      default:
        return this.lazy('../../../vue/augm/appl/Augm.vue');
    }
  }

  lazy(path) {
    return function() {
      return import( /* @vite-ignore */ path );
    };
  }

};

export default Load;

//# sourceMappingURL=Lazy.js.map
