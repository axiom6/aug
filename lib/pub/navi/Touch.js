var Touch;

Touch = class Touch {
  constructor(stream, nav) {
    //elem.addEventListener( 'pointerout',    @out,    false )
    this.start = this.start.bind(this);
    this.movit = this.movit.bind(this);
    this.leave = this.leave.bind(this);
    this.cancel = this.cancel.bind(this);
    this.out = this.out.bind(this);
    this.up = this.up.bind(this);
    this.endit = this.endit.bind(this);
    this.double = this.double.bind(this);
    this.stream = stream;
    this.nav = nav;
    this.nav.touch = this;
    this.elem = null;
    this.debug = false;
    this.debug2 = false;
    this.reset(); // "tabs-tab","disp-comp","west","east","south","north","cen"
    this.touchClasses = [];
    this.touchOutClasses = [];
  }

  reset() {
    this.beg = null;
    return this.pnt = null;
  }

  /*
  +pointerdown 	mousedown
  +pointerup 	  mouseup
  pointermove 	mousemove
  pointerleave 	mouseleave
  pointercancel

  pointerover 	mouseover
  pointerout 	  mouseout
  pointerenter 	mouseenter
  gotpointercapture 	
  lostpointercapture

  CSS:               touch-action: none
  Event  Properties: pointerId pointerType isPrimary
  Device Propertues: width height pressure tangentialPressure tiltX tiltY twist

  At the first finger touch:
      pointerdown with isPrimary=true and some pointerId.
  For the second finger and more fingers (assuming the first one is still touching):
      pointerdown with isPrimary=false and a different pointerId for every finger
  */
  listen(elem, touchClasses, touchOutClasses = []) {
    if (this.debug) {
      console.log('Touch.listen()', touchOutClasses);
    }
    this.elem = elem;
    this.touchClasses = touchClasses;
    this.touchOutClasses = touchOutClasses;
    this.elem.addEventListener('pointerdown', this.start, false);
    this.elem.addEventListener('pointerup', this.up, false);
    this.elem.addEventListener('pointerleave', this.leave, false);
    this.elem.addEventListener('pointercancel', this.cancel, false);
    this.elem.addEventListener('dblclick', this.double, false);
  }

  start(event) {
    var className, inTouch, outTouch;
    // event.preventDefault()
    className = this.nav.toKlass(event.target.className) === "SVGAnimatedString" ? "SVGAnimatedString" : event.target.className;
    inTouch = this.nav.inArray(className, this.touchClasses);
    outTouch = this.nav.inArray(className, this.touchOutClasses);
    if (this.debug) {
      console.log('Touch.start()', {
        target: className,
        inTouch: inTouch,
        outTouch: outTouch,
        outs: this.touchOutClasses
      });
    }
    // return if not inTouch
    if (outTouch) {
      return;
    }
    if (!((event.touches != null) && event.touches.length > 1)) {
      this.elem.setPointerCapture(event.pointerId);
    }
    this.beg = event;
    this.pnt = this.coord(event, {});
    this.elem.addEventListener('pointermove', this.movit, false);
    if (this.debug2) {
      console.log('Touch.start()', {
        target: event.target.className,
        inTouch: inTouch
      });
    }
  }

  movit(event) {
    var pnt;
    // event.preventDefault()
    pnt = this.pnt != null ? this.pnt : {};
    this.pnt = this.coord(event, pnt);
  }

  coord(event, pnt) {
    if (event.targetTouches != null) {
      pnt.x = event.targetTouches[0].clientX;
      pnt.y = event.targetTouches[0].clientY; // Either Mouse event or Pointer Event
    } else {
      pnt.x = event.clientX;
      pnt.y = event.clientY; // Prefer touch points
    }
    if (this.debug2) {
      console.log('Touch.coord()', {
        x: pnt.x,
        y: pnt.y,
        touches: event.targetTouches != null
      });
    }
    return pnt;
  }

  leave(event) {
    this.endit(event, 'leave');
  }

  cancel(event) {
    this.endit(event, 'cancel');
  }

  out(event) {
    this.endit(event, 'out');
  }

  up(event) {
    this.endit(event, 'cancel');
  }

  endit(event, type) {
    var dir;
    // event.preventDefault()
    if ((event.touches != null) && event.touches.length > 1) {
      return;
    }
    dir = 'none';
    if ((this.beg != null) && (this.pnt != null)) {
      event.target.releasePointerCapture(event.pointerId);
      dir = this.swipeDir(this.beg.clientX, this.beg.clientY, this.pnt.x, this.pnt.y);
      if (dir !== 'none') {
        this.nav.doDir(dir);
      }
      if (this.debug2) {
        console.log('Touch.endit()', {
          type: type,
          x1: this.beg.clientX,
          y1: this.beg.clientY,
          x2: this.pnt.x,
          y2: this.pnt.y,
          dir: dir
        });
      }
    }
    this.elem.removeEventListener('pointermove', this.movit, false);
    this.reset();
  }

  double() {
    return this.nav.doDir("next");
  }

  swipeDir(begX, begY, endX, endY) {
    var ax, ay, dir, dx, dy;
    dir = "none";
    dx = endX - begX;
    dy = endY - begY;
    ax = Math.abs(dx);
    ay = Math.abs(dy);
    //if ax < 10 and ay < 10
    //   dir = if event.shiftKey then 'prev' else 'next'
    if (dx < 0 && ax > ay) {
      dir = 'west';
    } else if (dx > 0 && ax > ay) {
      dir = 'east';
    } else if (dy < 0 && ay > ax) {
      dir = 'north';
    } else if (dy > 0 && ay > ax) {
      dir = 'south';
    } else {
      dir = 'none';
    }
    return dir;
  }

};

export default Touch;

//# sourceMappingURL=Touch.js.map
