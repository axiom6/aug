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
    this.opts = this.main.opts.cameras;
    cc = this.main.cartesian;
    this.camera = this.selectCamera(this.opts, cc);
    this.controls = this.selectControls(this.opts, cc, this.camera);
    this.main.stream.subscribe('Resize', this.klass, (obj) => {
      return this.onResize(obj);
    });
    this.main.stream.subscribe('Dispose', this.klass, (obj) => {
      return this.onDispose(obj);
    });
    this.main.log(this.klass + '()', this, this.opts);
  }

  selectCamera(opts, cc) {
    if ((opts == null) && (opts.camera == null)) {
      return this.orthographic(opts, cc);
    }
    switch (opts.camera) {
      case 'Orthographic':
        return this.orthographic(opts, cc);
      case 'Perspective':
        return this.perspective(opts, cc);
      case 'Muse':
        return this.muse(opts, cc);
      default:
        console.error('Cameras.selectCamera() unknown camera', opts.camera);
        return this.orthographic(opts, cc);
    }
  }

  selectControls(opts, cc, camera) {
    if ((opts == null) && (opts.controls != null)) {
      return this.orbit(opts, cc);
    }
    switch (opts.controls) {
      case 'Orbit':
        return this.orbit(camera, cc);
      case 'Trackball':
        return this.trackball(camera, cc);
      default:
        console.error('Cameras.selectControls() unknown controls', opts.controls);
        return this.orbit(opts, cc);
    }
  }

  orthographic(opts, cc) { // Uses world coordinates
    var aspect, bottom, camera, dist, far, helper, left, near, position, r, right, scale, scenePos, top;
    aspect = this.main.aspectRatio;
    dist = cc.dist;
    left = opts.left != null ? opts.left : -dist * aspect;
    right = opts.right != null ? opts.right : dist * aspect;
    top = opts.top != null ? opts.top : dist;
    bottom = opts.bottom != null ? opts.bottom : -dist;
    near = opts.near != null ? opts.near : -dist * 5.0;
    far = opts.far != null ? opts.far : dist * 5.0;
    position = opts.position != null ? opts.position : {
      "x": dist * 0.2,
      "y": dist * 0.2,
      "z": dist * 0.2
    };
    r = 0.90;
    scale = {
      "x": r * aspect,
      "y": r,
      "z": r * aspect // { "x":0.5*aspect, "y":0.375, "z":0.5*aspect }
    };
    scenePos = this.main.scene.position;
    camera = new OrthographicCamera(left, right, top, bottom, near, far);
    camera.scale.set(scale.x, scale.y, scale.z);
    camera.position.set(position.x, position.y, position.z);
    camera.lookAt(scenePos.x, scenePos.y, scenePos.z);
    if ((opts.helper != null) && opts.helper) {
      helper = new CameraHelper(camera);
      this.main.addToScene(helper);
    }
    return camera;
  }

  perspective(opts, cc) {
    var camera, dist, far, fov, helper, near, position, scenePos;
    dist = cc.dist;
    fov = opts.fov != null ? opts.fov : 75;
    near = opts.near != null ? opts.near : 0.01 * dist;
    far = opts.far != null ? opts.far : 100 * dist;
    position = opts.position != null ? opts.position : {
      "x": 0,
      "y": 0.6 * dist,
      "z": 16 * dist
    };
    scenePos = this.main.scene.position;
    camera = new PerspectiveCamera(fov, this.main.aspectRatio, near, far);
    camera.position.set(position.x, position.y, position.z);
    camera.lookAt(scenePos.x, scenePos.y, scenePos.z);
    if ((opts.helper != null) && opts.helper) {
      helper = new CameraHelper(camera);
      this.main.addToScene(helper);
    }
    return camera;
  }

  muse(opts, cc) {
    var camera, far, fov, helper, near, position, scenePos;
    if (cc) {
      false;
    }
    fov = opts.fov != null ? opts.fov : 45;
    near = opts.near != null ? opts.near : 1;
    far = opts.far != null ? opts.far : 10000;
    position = opts.position != null ? opts.position : {
      "x": 0,
      "y": 6,
      "z": 1600
    };
    scenePos = this.main.scene.position;
    camera = new PerspectiveCamera(fov, this.main.aspectRatio, near, far);
    camera.position.set(position.x, position.y, position.z);
    camera.lookAt(scenePos.x, scenePos.y, scenePos.z);
    if ((opts.helper != null) && opts.helper) {
      helper = new CameraHelper(camera);
      this.main.addToScene(helper);
    }
    return camera;
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
    if (this.opts.camera === 'Orthographic') {
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

/*
  perspective:( opts, cc ) ->

    @camera.position.set( 0, 6, 1500 )

    h    = (cc.ymax-cc.ymin)
    near =    1 # 0.01 * h
    far  = 1000
    pos  = h * 5
    if h and pos and cc then false
    camera = new PerspectiveCamera( 75, @main.aspectRatio, near, far ) # ( 45, @aspectRatio, 1, 10000 )
    #amera.position.set( pos, pos, pos )
    camera.lookAt( @main.scene.position ) # ( 0, 0, 0 )
 * @main.addToScene( camera )
    if opts.helper? and opts.helper
      helper = new CameraHelper( camera )
      @main.addToScene( helper )
    camera

 */

//# sourceMappingURL=Cameras.js.map
