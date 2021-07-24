var Spot;

import * as THREE from 'three';

import {
  TWEEN
} from 'three/examples/jsm/libs/tween.module.min.js';

import {
  OrbitControls
} from 'three/examples/jsm/controls/OrbitControls.js';

Spot = class Spot {
  constructor(elem, nav) {
    // Third arg useCapture must match addEventLIstenter()
    // window.removeEventListener( 'resize', @onWindowResize, false )
    this.onWindowResize = this.onWindowResize.bind(this);
    this.animate = this.animate.bind(this);
    this.render = this.render.bind(this);
    this.tween = this.tween.bind(this);
    this.elem = elem;
    this.nav = nav;
    this.debug = true;
    this.doSpot();
    this.init();
    this.render();
    this.animate();
  }

  doSpot() {
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 1, 2000);
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.scene = new THREE.Scene();
    this.matFloor = new THREE.MeshPhongMaterial();
    this.matBox = new THREE.MeshPhongMaterial({
      color: 0xaaaaaa
    });
    this.geoFloor = new THREE.PlaneGeometry(2000, 2000);
    this.geoBox = new THREE.BoxGeometry(3, 1, 2);
    this.mshFloor = new THREE.Mesh(this.geoFloor, this.matFloor);
    this.mshFloor.rotation.x = -Math.PI * 0.5;
    this.mshBox = new THREE.Mesh(this.geoBox, this.matBox);
    this.ambient = new THREE.AmbientLight(0x111111);
    this.spotLight1 = this.createSpotlight(0xFF7F00);
    this.spotLight2 = this.createSpotlight(0x00FF7F);
    this.spotLight3 = this.createSpotlight(0x7F00FF);
  }

  init() {
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.outputEncoding = THREE.sRGBEncoding;
    this.camera.position.set(46, 22, -21);
    this.spotLight1.position.set(15, 40, 45);
    this.spotLight2.position.set(0, 40, 35);
    this.spotLight3.position.set(-15, 40, 45);
    this.lightHelper1 = new THREE.SpotLightHelper(this.spotLight1);
    this.lightHelper2 = new THREE.SpotLightHelper(this.spotLight2);
    this.lightHelper3 = new THREE.SpotLightHelper(this.spotLight3);
    this.matFloor.color.set(0x808080);
    this.mshFloor.receiveShadow = true;
    this.mshFloor.position.set(0, -0.05, 0);
    this.mshBox.castShadow = true;
    this.mshBox.receiveShadow = true;
    this.mshBox.position.set(0, 5, 0);
    this.addToScene(this.mshFloor);
    this.addToScene(this.mshBox);
    this.addToScene(this.ambient);
    this.addToScene(this.spotLight1, this.spotLight2, this.spotLight3);
    this.addToScene(this.lightHelper1, this.lightHelper2, this.lightHelper3);
    this.elem.appendChild(this.renderer.domElement);
    this.onWindowResize();
    window.addEventListener('resize', this.onWindowResize, false);
    this.controls.target.set(0, 7, 0);
    this.controls.maxPolarAngle = Math.PI / 2;
    this.controls.update();
    console.log("Spot.TWEEN", TWEEN);
  }

  addToScene(...args) {
    var arg, i, len;
    for (i = 0, len = args.length; i < len; i++) {
      arg = args[i];
      if (this.debug) {
        console.log(arg);
      }
      this.scene.add(arg);
    }
  }

  createSpotlight(color) {
    var newObj;
    newObj = new THREE.SpotLight(color, 2);
    newObj.castShadow = true;
    newObj.angle = 0.3;
    newObj.penumbra = 0.2;
    newObj.decay = 2;
    newObj.distance = 50;
    return newObj;
  }

  dispose() {}

  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  animate() {
    this.tween(this.spotLight1);
    this.tween(this.spotLight2);
    this.tween(this.spotLight3);
    setTimeout(this.animate, 5000);
  }

  render() {
    TWEEN.update();
    if (this.lightHelper1 != null) {
      this.lightHelper1.update();
    }
    if (this.lightHelper2 != null) {
      this.lightHelper2.update();
    }
    if (this.lightHelper3 != null) {
      this.lightHelper3.update();
    }
    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame(this.render);
  }

  tween(light) {
    new TWEEN.Tween(light).to({
      angle: (Math.random() * 0.7) + 0.1,
      penumbra: Math.random() + 1
    }, Math.random() * 3000 + 2000).easing(TWEEN.Easing.Quadratic.Out).start();
    new TWEEN.Tween(light.position).to({
      x: (Math.random() * 30) - 15,
      y: (Math.random() * 10) + 15,
      z: (Math.random() * 30) - 15
    }, Math.random() * 3000 + 2000).easing(TWEEN.Easing.Quadratic.Out).start();
  }

};

export default Spot;

//# sourceMappingURL=Spot.js.map
