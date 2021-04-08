var Load;

Load = class Load {
  constructor() {}

  load(name) {
    switch (name) {
      case 'GeomND':
        return this.lazy('../../vue/geom/GeomND.vue');
      case 'MathND':
        return this.lazy('../../vue/math/MathND.vue');
      case 'Draw':
        return this.lazy('../../vue/draw/Draw.vue');
      case 'Hues':
        return this.lazy('../../vue/draw/Hues.vue');
      case 'Cube':
        return this.lazy('../../vue/cube/Cube.vue');
      case 'Wood':
        return this.lazy('../../vue/wood/Wood.vue');
      default:
        return this.lazy('../../vue/appl/Home.vue');
    }
  }

  lazy(path) {
    return function() {
      return import( /* @vite-ignore */ path );
    };
  }

};

export default Load;
