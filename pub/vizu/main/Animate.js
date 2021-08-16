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
    this.needsRender = true;
    this.camControls = this.main.cameras.controls;
    if (this.camControls != null) {
      this.camControls.addEventListener('change', () => {
        return this.needsRender = true;
      });
    }
    this.main.log(this.klass + '()', this);
  }

  render() {
    if (this.needsRender) { // Significant step. Not called when scene is static
      this.main.render.renderer.render(this.main.scene, this.main.cameras.camera);
      this.needsRender = false;
    }
  }

  animate() {
    if (this.opts.rotate != null) {
      this.rotate();
    }
    if (this.needsRender && this.main.lights.lightHelpers.length > 0) {
      this.lightHelpers();
    }
    if (this.needsRender && (this.camControls != null)) {
      this.controls();
    }
    this.doAnimations();
    this.render();
    requestAnimationFrame(this.animate);
  }

  doAnimations() {
    var timer;
    if ((this.main.hexagon != null) && this.main.hexagon.obj.animateOn) {
      timer = 0.0001 * Date.now();
      this.main.hexagon.animate(timer);
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
    this.needsRender = true;
  }

};

export default Animate;

//# sourceMappingURL=Animate.js.map
