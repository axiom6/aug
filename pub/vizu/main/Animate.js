var Animate;

import {
  MathUtils
} from 'three';

Animate = class Animate {
  constructor(main) {
    // Call before animate to insure an initial rendering
    this.render = this.render.bind(this);
    this.animate = this.animate.bind(this);
    this.doAnimations = this.doAnimations.bind(this);
    this.controls = this.controls.bind(this);
    this.rotate = this.rotate.bind(this);
    this.main = main;
    this.klass = this.constructor.name;
    this.opts = this.main.opts.animate;
    this.cc = this.main.cartesian;
    this.theta = (this.opts.rotate != null) && (this.opts.rotate.theta != null) ? this.opts.rotate.theta : 0;
    this.radius = (this.opts.rotate != null) && (this.opts.rotate.radius != null) ? this.opts.rotate.radius : this.cc.dist;
    this.camControls = this.main.cameras.controls;
    if (this.camControls != null) {
      this.camControls.addEventListener('change', () => {
        return this.main.needsRender = true;
      });
    }
    this.main.log(this.klass + '()', this);
  }

  render() {
    if (this.main.needsRender) { // Significant step. Not called when scene is static
      this.main.render.renderer.render(this.main.scene, this.main.cameras.camera);
    }
  }

  animate() {
    if (this.opts.rotate != null) {
      this.rotate();
    }
    if (this.main.needsRender && this.main.lights.lightHelpers.length > 0) {
      this.lightHelpers();
    }
    if (this.main.needsRender && (this.camControls != null)) {
      this.controls();
    }
    if (this.main.animateOn) {
      this.doAnimations();
    }
    this.render();
    requestAnimationFrame(this.animate);
  }

  doAnimations() {
    if (this.main.hexagon != null) {
      this.main.hexagon.animate();
    }
  }

  controls() {
    this.camControls.update(); // if @camControls.enableDamping or @camControls.autoRotate
  }

  lightHelpers() {
    var i, len, lightHelper, ref;
    ref = this.main.lights.lightHelpers;
    for (i = 0, len = ref.length; i < len; i++) {
      lightHelper = ref[i];
      lightHelper.update();
    }
  }

  rotate() {
    var camera;
    camera = this.main.cameras.camera;
    this.theta += 0.1;
    camera.position.x = this.radius * Math.sin(MathUtils.degToRad(this.theta));
    camera.position.y = this.radius * Math.sin(MathUtils.degToRad(this.theta));
    camera.position.z = this.radius * Math.cos(MathUtils.degToRad(this.theta));
    camera.lookAt(this.main.scene.position);
    camera.updateMatrixWorld();
    this.main.needsRender = true;
  }

};

export default Animate;

//# sourceMappingURL=Animate.js.map
