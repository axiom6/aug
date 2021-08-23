var Cameras;

import {
  PerspectiveCamera,
  OrthographicCamera,
  CameraHelper
} from 'three';

import {
  OrbitControls
} from 'three/examples/jsm/controls/OrbitControls.js';

import {
  TrackballControls
} from 'three/examples/jsm/controls/TrackballControls.js';

Cameras = class Cameras {
  constructor(main) {
    var cc;
    this.onResize = this.onResize.bind(this);
    this.onDispose = this.onDispose.bind(this);
    this.main = main;
    this.klass = this.constructor.name;
    cc = this.main.cartesian;
    this.optsCam = this.main.opts.cameras;
    this.camera = this.selectCamera(this.optsCam, cc);
    this.controls = this.selectControls(this.optsCam, cc, this.camera);
    this.main.stream.subscribe('Resize', this.klass, (obj) => {
      return this.onResize(obj);
    });
    this.main.stream.subscribe('Dispose', this.klass, (obj) => {
      return this.onDispose(obj);
    });
    this.main.log(this.klass + '()', this, this.optsCam);
  }

  initDefs(cc) {
    var defs;
    defs = {};
    defs.aspect = this.main.aspectRatio;
    defs.dist = cc.dist;
    defs.scale = 2.0;
    defs.position = {
      x: defs.dist * 0.2,
      y: defs.dist * 0.2,
      z: defs.dist * 0.20
    };
    defs.fov = 75;
    return defs;
  }

  processOpts(optsCamera, cc, defs) {
    var opts;
    opts = Object.assign({}, optsCamera);
    opts.aspect = this.main.aspectRatio;
    opts.dist = cc.dist;
    opts.scale = opts.scale != null ? opts.scale : defs.scale;
    opts.scaleXYZ = {
      x: opts.aspect / opts.scale,
      y: opts.aspect / opts.scale,
      z: opts.aspect / opts.scale
    };
    opts.scenePos = this.main.scene.position;
    opts.position = opts.position != null ? opts.position : defs.position;
    opts.fov = opts.fov != null ? opts.fov : defs.fov;
    opts.left = opts.left != null ? opts.left : defs.left;
    opts.right = opts.right != null ? opts.right : defs.right;
    opts.top = opts.top != null ? opts.top : defs.top;
    opts.bottom = opts.bottom != null ? opts.bottom : defs.bottom;
    opts.near = opts.near != null ? opts.near : defs.near;
    opts.far = opts.far != null ? opts.far : defs.far;
    return opts;
  }

  selectCamera(optsCam, cc) {
    if ((optsCam == null) && (optsCam.camera == null)) {
      return this.orthographic(optsCam, cc);
    }
    switch (optsCam.camera) {
      case 'OrthoXYZ':
        return this.orthoXYZ(optsCam, cc);
      case 'OrthoISO':
        return this.orthoISO(optsCam, cc);
      case 'Orthographic':
        return this.orthographic(optsCam, cc);
      case 'Perspective':
        return this.perspective(optsCam, cc);
      case 'Muse':
        return this.muse(optsCam, cc);
      default:
        console.error('Cameras.selectCamera() unknown camera', optsCam);
        return this.orthographic(optsCam, cc);
    }
  }

  selectControls(optsCam, cc, camera) {
    this.main.log("Camera.selectControls()", optsCam, cc);
    if ((optsCam == null) && (optsCam.controls != null)) {
      return this.orbit(optsCam, cc);
    }
    switch (optsCam.controls) {
      case 'Orbit':
        return this.orbit(camera, cc);
      case 'Trackball':
        return this.trackball(camera, cc);
      default:
        console.error('Cameras.selectControls() unknown controls', optsCam.controls);
        return this.orbit(optsCam, cc);
    }
  }

  orthoXYZ(camOpts, cc) {
    var camera, defs, opts;
    defs = this.initDefs(cc);
    defs.near = -defs.dist * 5.0;
    defs.far = defs.dist * 5.0;
    defs.left = -defs.dist * defs.aspect;
    defs.right = defs.dist * defs.aspect;
    defs.top = defs.dist;
    defs.bottom = -defs.dist;
    opts = this.processOpts(camOpts, cc, defs);
    camera = this.ortho(opts);
    this.projectionMatrix(camera.projectionMatrix, opts);
    return camera;
  }

  orthoISO(camOpts, cc) {
    var camera, defs, opts;
    defs = this.initDefs(cc);
    defs.near = -defs.dist * 5.0;
    defs.far = defs.dist * 5.0;
    defs.left = -defs.dist * defs.aspect; // Orthographic
    defs.right = defs.dist * defs.aspect;
    defs.top = defs.dist;
    defs.bottom = -defs.dist;
    opts = this.processOpts(camOpts, cc, defs);
    camera = this.ortho(opts);
    this.projectionMatrix(camera.projectionMatrix, opts);
    return camera;
  }

  projectionMatrix(matrix, opts) {
    var s, xAxis, yAxis, zAxis;
    s = opts.scaleXYZ;
    xAxis = {
      x: s.x,
      y: 1,
      z: 1
    };
    yAxis = {
      x: 1,
      y: s.y,
      z: 1
    };
    zAxis = {
      x: 1,
      y: 1,
      z: s.z
    };
    matrix.makeBasis(xAxis, yAxis, zAxis);
  }

  orthographic(camOpts, cc) { // Uses world coordinates
    var defs, opts;
    defs = this.initDefs(cc);
    defs.near = -defs.dist * 5.0;
    defs.far = defs.dist * 5.0;
    defs.left = -defs.dist * defs.aspect; // Orthographic
    defs.right = defs.dist * defs.aspect;
    defs.top = defs.dist;
    defs.bottom = -defs.dist;
    opts = this.processOpts(camOpts, cc, defs);
    return this.ortho(opts);
  }

  ortho(opts) { // Uses world coordinates
    var camera, helper;
    camera = new OrthographicCamera(opts.left, opts.right, opts.top, opts.bottom, opts.near, opts.far);
    camera.scale.set(opts.scaleXYZ.x, opts.scaleXYZ.y, opts.scaleXYZ.z);
    camera.position.set(opts.position.x, opts.position.y, opts.position.z);
    camera.lookAt(opts.scenePos.x, opts.scenePos.y, opts.scenePos.z);
    if ((opts.helper != null) && opts.helper) {
      helper = new CameraHelper(camera);
      this.main.addToScene(helper);
    }
    return camera;
  }

  perspective(camOpts, cc) {
    var camera, defs, helper, opts;
    defs = this.initDefs(cc);
    defs.fov = 75;
    defs.near = defs.dist * 0.01;
    defs.far = defs.dist * 100;
    opts = this.processOpts(camOpts, cc, defs);
    camera = new PerspectiveCamera(opts.fov, this.main.aspectRatio, opts.near, opts.far);
    camera.scale.set(opts.scaleXYZ.x, opts.scaleXYZ.y, opts.scaleXYZ.z);
    camera.position.set(opts.position.x, opts.position.y, opts.position.z);
    camera.lookAt(opts.scenePos.x, opts.scenePos.y, opts.scenePos.z);
    if ((opts.helper != null) && opts.helper) {
      helper = new CameraHelper(camera);
      this.main.addToScene(helper);
    }
    return camera;
  }

  muse(camOpts, cc) {
    var defs, opts;
    defs = this.initDefs(cc);
    defs.fov = 45;
    defs.near = 1;
    defs.far = 10000;
    defs.position = {
      "x": 0,
      "y": 6,
      "z": 1600
    };
    opts = this.processOpts(camOpts, cc, defs);
    return this.perspective(opts);
  }

  orbit(camera, cc) {
    var controls, scenePos;
    if (cc) {
      false;
    }
    controls = new OrbitControls(camera, this.main.render.renderer.domElement);
    scenePos = this.main.scene.position;
    controls.target.set(scenePos.x, scenePos.y, scenePos.z);
    controls.update();
    return controls;
  }

  trackball(camera, cc) {
    var controls, scenePos;
    if (cc) {
      false;
    }
    controls = new TrackballControls(camera, this.main.render.renderer.domElement);
    scenePos = this.main.scene.position;
    controls.target.set(scenePos.x, scenePos.y, scenePos.z);
    controls.update();
    return controls;
  }

  onResize(obj) {
    var cscale, nscale, r;
    this.main.log(this.klass + '.onResize()', obj);
    this.camera.aspect = obj.aspectRatio;
    r = obj.aspectRatio / obj.aspectLast;
    if (this.optsCam.camera === 'Orthographic') {
      cscale = this.camera.scale;
      nscale = {
        "x": cscale.x * r,
        "y": cscale.y * r,
        "z": cscale.y * r
      };
      this.camera.scale.set(nscale.x, nscale.y, nscale.z);
    }
    this.camera.updateProjectionMatrix();
  }

  onDispose(obj) {
    return this.main.log(this.klass + 'onDispose()', obj);
  }

};

// @isometric.dispose()   if @isometric?
// @perspective.dispose() if @@perspective?
export default Cameras;

//# sourceMappingURL=Cameras.js.map
