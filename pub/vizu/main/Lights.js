var Lights;

import {
  AmbientLight,
  DirectionalLight,
  DirectionalLightHelper,
  SpotLight,
  SpotLightHelper,
  Object3D
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
        return this.spotLight(opts);
      case 'Directional':
        return this.directional(opts, cc);
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

  directPlane(opts, cc, plane) {
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
    direct.castShadow = true;
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

};

export default Lights;

/*
      left     = if opts.left?      then opts.left      else -dist * aspect
    right    = if opts.right?     then opts.right     else  dist * aspect
    top      = if opts.top?       then opts.top       else  dist
    bottom   = if opts.bottom?    then opts.bottom    else -dist
    near     = if opts.near?      then opts.near      else -dist * 5.0
    far      = if opts.far?       then opts.far       else  dist * 5.0

    #irectionalXY.shadow.mapSize.width  = 256
    #irectionalXY.shadow.mapSize.height = 256
    #irectionalXY.shadow.camera.near    = cc.zmax
    #irectionalXY.shadow.camera.far     = cc.zmin

    targetXY     = content.createPoint( { x:cc.xc, y:cc.yc, z:cc.zmin }, 0xFF0000, cc.xr*0.1 )
    targetXZ     = content.createPoint( { x:cc.xc, y:cc.yc, z:cc.zmin }, 0x00FF00, cc.yr*0.1 )
    targetYZ     = content.createPoint( { x:cc.xc, y:cc.yc, z:cc.zmin }, 0x0000FF, cc.zr*0.1 )

  createSpotlight:( color ) ->
    newObj = new THREE.SpotLight( color, 2 )
    newObj.castShadow = true
    newObj.angle = 0.3
    newObj.penumbra = 0.2
    newObj.decay = 2
    newObj.distance = 50
    newObj

  const spotLight = new THREE.SpotLight( 0xffffff );
  spotLight.position.set( 100, 1000, 100 );

  spotLight.castShadow = true;

  spotLight.shadow.mapSize.width = 1024;
  spotLight.shadow.mapSize.height = 1024;

  spotLight.shadow.camera.near = 500;
  spotLight.shadow.camera.far = 4000;
  spotLight.shadow.camera.fov = 30;

  distance - Maximum range of the light. Default is 0 (no limit).
  angle - Maximum angle of light dispersion from its direction whose upper bound is Math.PI/2.
  penumbra - Percent of the spotlight cone that is attenuated due to penumbra. Takes values between zero and 1. Default is zero.
  decay - The amount the light dims along the distance of the light.   

  orthographic3:( opts, cc ) ->
    content = @main.content # Content is instanciated before Lights
    spotLightXY = new SpotLight( 0xFF7F00, 2 )
    spotLightXZ = new SpotLight( 0x00FF7F, 2 )
    spotLightYZ = new SpotLight( 0x7F00FF, 2 )
    spotLightXY.position.set( cc.xc, cc.yc, cc.zd )
    spotLightXZ.position.set( cc.xc, cc.yd, cc.zc )
    spotLightYZ.position.set( cc.xd, cc.yc, cc.zc )
    spotLightXY.castShadow = true
    spotLightXZ.castShadow = true
    spotLightYZ.castShadow = true

  targetXY     = content.createPoint( [ cc.xc,   cc.yc,   cc.zmin ], 0xFF0000, cc.xd*0.1 )
  targetXZ     = content.createPoint( [ cc.xc,   cc.ymin, cc.zc   ], 0x00FF00, cc.yd*0.1 )
  targetYZ     = content.createPoint( [ cc.xmin, cc.yc,   cc.zc   ], 0x0000FF, cc.zd*0.1 )

  grids = content.grids
  spotLightXY.target = grids.xyGrid.group
  spotLightXZ.target = grids.xzGrid.group
  spotLightYZ.target = grids.yzGrid.group

  spotHelperXY = new SpotLightHelper( spotLightXY )
  spotHelperXZ = new SpotLightHelper( spotLightXZ )
  spotHelperYZ = new SpotLightHelper( spotLightYZ )
  @lightHelpers.push( spotHelperXY )  # We do this for updates in @animate
  @lightHelpers.push( spotHelperXZ )
  @lightHelpers.push( spotHelperYZ )
  @main.addToScene(  spotLightXY,         spotLightXZ,        spotLightYZ )
  @main.addToScene(  spotLightXY.target,  spotLightXZ.target, spotLightYZ.target )
  @main.addToScene( spotHelperXY,        spotHelperXZ,       spotHelperYZ )
  @main.addToScene(  spotHelperXY )
  [ spotLightXY, spotLightXZ, spotLightYZ ]  
 */

//# sourceMappingURL=Lights.js.map
