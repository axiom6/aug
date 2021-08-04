var Lights;

import {
  AmbientLight,
  DirectionalLight,
  DirectionalLightHelper,
  SpotLight,
  SpotLightHelper,
  Object3D,
  HemisphereLight
} from 'three';

Lights = class Lights {
  constructor(main) {
    this.main = main;
    this.klass = this.constructor.name;
    this.opts = this.main.opts.lights;
    this.cc = this.main.cartesian;
    this.lightHelpers = []; // Light Helpers are pushed into this array for animate updates
    this.lights = this.selectLight(this.opts, this.cc); // An array
    this.main.log(this.klass + '()', this);
  }

  selectLight(opts, cc) {
    if ((opts == null) && (opts.light == null)) {
      return this.ambient(opts);
    }
    switch (opts.light) {
      case 'Ambient':
        return this.ambient(opts);
      case 'SpotLight':
        return this.spotlight(opts);
      case 'Directional':
        return this.directional(opts, cc);
      case 'Hemisphere':
        return this.hemisphere();
      case 'DirectColor':
        return this.directColor(opts, cc);
      case 'Muse':
        return this.muse(opts);
      case 'Orthographic':
        return this.orthographic(opts, cc);
      default:
        console.log('Lights.selectLight() unknown light', opts.light);
        return this.ambient(opts);
    }
  }

  ambient(opts) {
    var color, intensity, light;
    color = opts.color != null ? opts.color != null : 0xFFFFFF;
    intensity = opts.intensity != null ? opts.intensity != null : 1.0;
    light = new AmbientLight(color, intensity);
    light.position.set(1, 1, 1).normalize();
    this.main.addToScene(light);
    return [light];
  }

  spotlight(opts) {
    var color, helper, intensity, light;
    color = opts.color != null ? opts.color != null : 0xFFFFFF;
    intensity = opts.intensity != null ? opts.intensity != null : 1.0;
    light = new SpotLight(color, intensity);
    light.castShadow = true;
    light.angle = 0.3;
    light.penumbra = 0.2;
    light.decay = 2;
    light.distance = 50;
    this.main.addToScene(light);
    if ((opts.helper != null) && opts.helper) {
      helper = new SpotLightHelper(light);
      this.main.addToScene(helper);
    }
    return [light];
  }

  hemisphere() {
    var light1, light2;
    light1 = new HemisphereLight(0xffffff, 0x000088);
    light2 = new HemisphereLight(0xffffff, 0x880000, 0.5);
    light1.position.set(-1, 1.5, 1);
    light2.position.set(-1, -1.5, -1);
    this.main.addToScene(light1, light2);
    return [light1, light2];
  }

  muse(opts) {
    var backLight, fillLight, keydLight, spotLight;
    if (opts) {
      false;
    }
    backLight = new DirectionalLight('white', 0.15);
    backLight.position.set(6, 3, 9);
    backLight.name = 'Back light';
    this.main.addToScene(backLight);
    keydLight = new DirectionalLight('white', 0.35);
    keydLight.position.set(-6, -3, 0);
    keydLight.name = 'Key light';
    this.main.addToScene(keydLight);
    fillLight = new DirectionalLight('white', 0.55);
    fillLight.position.set(9, 9, 6);
    fillLight.name = 'Fill light';
    this.main.addToScene(fillLight);
    spotLight = new SpotLight(0xffffff);
    spotLight.position.set(3, 30, 3);
    spotLight.castShadow = true;
    spotLight.shadow.mapSize.width = 2048;
    spotLight.shadow.mapSize.height = 2048;
    spotLight.shadow.camera.near = 1;
    spotLight.shadow.camera.far = 4000;
    spotLight.shadow.camera.fov = 45;
    this.main.addToScene(spotLight);
    return [backLight, keydLight, fillLight, spotLight];
  }

  orthographic(opts, cc) {
    var spotHelperXY, spotLightXY, targetXY;
    spotLightXY = new SpotLight(0xFF7F00, 2);
    spotLightXY.castShadow = true;
    targetXY = new Object3D();
    spotLightXY.position.set(cc.xc, cc.yc, cc.zd * 2.0);
    targetXY.position.set(cc.xc, cc.yc, cc.zmin);
    spotLightXY.angle = 0.36;
    spotLightXY.target = targetXY;
    console.log("Lights.spotLightXY.position", spotLightXY.position, targetXY.position);
    spotHelperXY = new SpotLightHelper(spotLightXY);
    this.lightHelpers.push(spotHelperXY); // We do this for updates in @animate
    this.main.addToScene(spotLightXY, spotLightXY.target, spotHelperXY);
    return [spotLightXY];
  }

  directional(opts, cc) {
    var xy, xz, yz;
    xy = this.directPlane(opts, cc, 'XY');
    xz = this.directPlane(opts, cc, 'XZ');
    yz = this.directPlane(opts, cc, 'YZ');
    return [xy, xz, yz];
  }

  directPlane(opts, cc, plane, castShadow = true) {
    var direct, dist, helper, target;
    direct = new DirectionalLight(cc.hex(plane), 2); // [60,90,90] 0xFF7F00
    target = new Object3D();
    dist = (function() {
      switch (plane) {
        case 'XY':
          direct.position.set(cc.xc, cc.yc, cc.zd * 2.0);
          target.position.set(cc.xc, cc.yc, cc.zmin);
          return cc.zd;
        case 'XZ':
          direct.position.set(cc.xc, cc.yd * 2.0, cc.zc);
          target.position.set(cc.xc, cc.ymin, cc.zc);
          return cc.yd;
        case 'YZ':
          direct.position.set(cc.xd * 2.0, cc.yc, cc.zc);
          target.position.set(cc.xmin, cc.yc, cc.zc);
          return cc.xd;
      }
    })();
    direct.castShadow = castShadow;
    direct.shadow.camera.left = -dist * cc.aspect;
    direct.shadow.camera.right = dist * cc.aspect;
    direct.shadow.camera.top = -dist;
    direct.shadow.camera.bottom = dist;
    direct.shadow.camera.near = -dist * 5.0;
    direct.shadow.camera.far = dist * 5.0;
    direct.target = target;
    helper = new DirectionalLightHelper(direct);
    this.lightHelpers.push(helper); // We do this for updates in @animate
    this.main.addToScene(direct, direct.target, helper);
    return [direct];
  }

  directColor(opts, cc) {
    var xy;
    xy = this.directPlane(opts, cc, 'XY', false);
    return [xy];
  }

  directColor2(opts, cc) {
    var xy, xz;
    xy = this.directPlane(opts, cc, 'XY', false);
    xz = this.directPlane(opts, cc, 'XZ', false);
    return [xy, xz];
  }

};

export default Lights;

//# sourceMappingURL=Lights.js.map
