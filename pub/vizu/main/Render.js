var Render;

import {
  WebGLRenderer,
  PCFSoftShadowMap,
  sRGBEncoding
} from 'three';

Render = class Render {
  constructor(main) {
    this.onResize = this.onResize.bind(this);
    this.main = main;
    this.klass = this.constructor.name;
    this.opts = this.main.opts;
    this.clearColor = this.opts.clearColor != null ? this.opts.clearColor : 0x000000; // 0x333F47, 1
    this.renderer = new WebGLRenderer({
      antialias: true
    });
    this.main.elem.appendChild(this.renderer.domElement);
    this.renderer.setSize(this.main.screenWidth, this.main.screenHeight);
    this.renderer.setClearColor(this.clearColor, 1);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = PCFSoftShadowMap;
    this.renderer.shadowMapSoft = true;
    this.renderer.outputEncoding = sRGBEncoding;
    this.main.stream.subscribe('Resize', this.klass, (obj) => {
      return this.onResize(obj);
    });
    this.main.log(this.klass + '()', this);
  }

  onResize(obj) {
    this.main.log(this.klass + '.onResize()', obj);
    this.renderer.setSize(obj.screenWidth, obj.screenHeight);
  }

};

export default Render;

/*
  @renderer.shadowMap.enabled = true
  @renderer.shadowMap.type    = THREE.PCFSoftShadowMap
  @renderer.outputEncoding    = THREE.sRGBEncoding
*/

//# sourceMappingURL=Render.js.map
