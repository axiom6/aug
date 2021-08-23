var Main,
  hasProp = {}.hasOwnProperty;

import {
  Scene,
  Color
} from 'three';

import Cartesian from '../coords/Cartesian.js';

import Cylindrical from '../coords/Cylindrical.js';

import Spherical from '../coords/Spherical.js';

import Render from './Render.js';

import Lights from './Lights.js';

import Cameras from './Cameras.js';

import Content from '../content/Content.js';

import Animate from './Animate.js';

import Verify from './Verify.js';

Main = class Main {
  constructor(stream, nav) {
    this.doApp = this.doApp.bind(this);
    this.onVizu = this.onVizu.bind(this);
    this.resizeScreen = this.resizeScreen.bind(this);
    this.stream = stream;
    this.nav = nav;
    this.elem = null;
    this.opts = {};
    this.compKey = "";
    this.pageKey = "";
    this.debug = false;
    this.verifyFlag = false;
    this.hexagon = null;
    this.animateOn = false;
    this.needsRender = true;
  }

  setup() {
    this.scene = new Scene();
    this.scene.background = new Color('black');
    this.cartesian = new Cartesian(this);
    this.cylindrical = new Cylindrical(this);
    this.spherical = new Spherical(this);
    this.render = new Render(this);
    this.cameras = new Cameras(this);
    this.content = new Content(this); // Changed order so Lights can create points
    this.lights = new Lights(this);
    this.animate = new Animate(this);
    this.verify = new Verify(this);
    this.nav.subscribe('Vizu', 'Main', (obj) => {
      return this.onVizu(obj);
    });
    return window.addEventListener('resize', this.resizeScreen, false);
  }

  doApp(elem, opts, compKey, pageKey) {
    this.elem = elem;
    this.opts = opts;
    this.compKey = compKey;
    this.pageKey = pageKey;
    this.opts.main = this.opts.main != null ? this.opts.main : {};
    this.debug = (this.opts.main.debug != null) && this.opts.main.debug;
    this.verifyFlag = (this.opts.main.verify != null) && this.opts.main.verify;
    this.log("Main.doApp()", {
      opts: opts,
      debug: this.debug,
      verify: this.verifyFlag
    });
    this.runApp(elem);
  }

  runApp(elem) {
    this.screen(elem);
    this.setup();
    this.needsRender = true;
    this.animate.animate();
  }

  onVizu(obj) {
    if (obj.animate != null) {
      this.animateOn = !this.animateOn;
      this.needsRender = this.animateOn;
    }
    console.log("Main.onVizu()", obj, this.animateOn);
  }

  screen(elem) {
    var obj;
    this.elem = elem;
    this.screenWidth = this.elem['clientWidth'];
    this.screenHeight = this.elem['clientHeight'];
    this.aspectRatio = this.screenWidth / this.screenHeight;
    this.aspectLast = this.aspectRatio;
    obj = {
      screenWidth: this.screenWidth,
      screenHeight: this.screenHeight,
      aspectRatio: this.aspectRatio
    };
    if (this.debug) {
      return this.log("Main.screen()", obj);
    }
  }

  // object3Ds must be args... not an array
  addToScene(...object3Ds) {
    var i, len, object3D;
    for (i = 0, len = object3Ds.length; i < len; i++) {
      object3D = object3Ds[i];
      if (!this.nav.inArray(object3D.type, ['Line', 'Points', 'Mesh'])) {
        this.log("Main.addToScene(object3D)", object3D);
      }
      if (this.verifyFlag) {
        this.verify.verify(object3D);
      }
      this.scene.add(object3D);
    }
  }

  removeFromScene(...object3Ds) {
    var i, len, object3D;
    for (i = 0, len = object3Ds.length; i < len; i++) {
      object3D = object3Ds[i];
      this.scene.remove(object3D);
    }
  }

  resizeScreen() {
    var obj;
    this.screenWidth = this.elem['clientWidth'];
    this.screenHeight = this.elem['clientHeight'];
    this.aspectRatio = this.screenWidth / this.screenHeight;
    obj = {
      screenWidth: this.screenWidth,
      screenHeight: this.screenHeight,
      aspectRatio: this.aspectRatio,
      aspectLast: this.aspectLast
    };
    this.log("Main.resizeScreen", obj);
    this.stream.publish('Resize', obj);
    this.aspectLast = this.aspectRatio;
  }

  log(klass, ptr) {
    var filter, hides, key, logPtr, obj;
    if (!this.debug) {
      return;
    }
    logPtr = {};
    hides = ['main', 'klass', 'opts', '__proto__'];
    filter = (key) => {
      return key !== this.nav.inArray(key, hides);
    };
    for (key in ptr) {
      if (!hasProp.call(ptr, key)) continue;
      obj = ptr[key];
      if (filter(key)) {
        logPtr[key] = obj;
      }
    }
    console.log(klass, logPtr);
  }

  dispose() {
    // Third arg useCapture must match addEventLIstenter()
    window.removeEventListener('resize', this.resizeScreen, false);
    if (this.debug) {
      this.log("Main.dispose()");
    }
  }

};

// @stream.publish( 'Dispose', {} ) # Hold off for now
export default Main;

//# sourceMappingURL=Main.js.map
