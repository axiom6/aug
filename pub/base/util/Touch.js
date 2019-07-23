//mport interact  from '../../../node_modules/interactjs/dist/interact.js'
//mport interact, { init as initInteract } from '../../pub/lib/touch/interact.esm.js'
var Touch;

import interact from '../../../pub/lib/touch/interact.esm.js';

import Modernizr from '../../../pub/lib/touch/modernizr.esm.js';

Touch = class Touch {
  constructor() {
    // Called by window.dragMoveListener, dropObj(), resizeDragObj, zoom()
    this.drag = this.drag.bind(this);
    this.hasTouch = Modernizr['touchevents'] != null;
    this.hasPointer = Modernizr['pointerevents'] != null;
    console.log('Touch', {
      hasTouch: this.hasTouch,
      hasPointer: this.hasPointer
    });
    this.xSnap = 0;
    this.ySnap = 0;
    this.angle = 0;
    this.pinchAngle = 0.0;
    this.pinchScale = 1.0;
    this.resetTimeout = null;
    this.dirs = ['up', 'down', 'left', 'right'];
    this.ptes = ['tap', 'doubletap', 'hold', 'down', 'move', 'up'];
  }

  events(elem) {
    //console.log( 'Touch.events', { title:elem.title, elem:elem } )
    this.swipe(elem, this.onOpEvent);
    //snap(      elem, @onOpEvent )
    //resize(    elem, @opOpEvent )
    this.rotate(elem, this.onOpEvent);
    this.zoom(elem, this.onOpEvent);
    this.tap(elem, this.onOpEvent);
    this.doubleTap(elem, this.onOpEvent);
    this.hold(elem, this.onOpEvent);
  }

  onOpEvent(op, event) {
    var name, swipe;
    name = event.target.title != null ? event.target.title : 'None';
    swipe = event['swipe'] != null ? event['swipe'] : 'None;';
    console.log({
      op: op,
      name: name,
      event: event,
      swipe: swipe
    });
  }

  swipe(elem, onSwipe = null) {
    interact(elem).draggable(true).on('dragend', (event) => {
      if ((onSwipe != null) && (event['swipe'] != null)) {
        onSwipe('Swipe', event);
      }
    });
  }

  drag(event) {
    var target, x, y;
    target = event['target'];
    if ((target.title == null) || target.title === 'Info') {
      return;
    }
    x = (parseFloat(target.getAttribute('data-x')) || 0) + event['dx'];
    y = (parseFloat(target.getAttribute('data-y')) || 0) + event['dy'];
    target.style.transform = `translate(${x}px,${y}px)`;
    target.setAttribute('data-x', x);
    target.setAttribute('data-y', y);
    this.onOpEvent('Drag', event);
  }

  //window.dragMoveListener = @drag
  dropObj(elem) {
    return {
      allowFrom: elem,
      //accept: '#yes-drop', # only accept elements matching this CSS selector
      overlap: 0.75, // Require a 75% element overlap for a drop to be possible
      ondropactivate: (event) => {
        event['target']['classList'].add('drop-active');
      },
      ondragenter: (event) => {
        var draggableElement, dropzoneElement;
        draggableElement = event['relatedTarget'];
        dropzoneElement = event['target'];
        dropzoneElement['classList'].add('drop-target'); // // feedback the possibility of a drop
        draggableElement['classList'].add('can-drop');
        draggableElement.textContent = 'Dragged in';
      },
      ondragleave: (event) => { // remove the drop feedback style
        event['target']['classlist'].remove('drop-target');
        event['relatedTarget']['classlist'].remove('can-drop');
        event['relatedTarget']['textContent'] = 'Dragged out';
      },
      ondrop: (event) => {
        event['relatedTarget'].textContent = 'Dropped';
        this.onOpEvent('Drop', event);
      },
      ondropdeactivate: (event) => { // remove active dropzone feedback
        event['target']['classlist'].remove('drop-active');
        event['target']['classlist'].remove('drop-target');
      }
    };
  }

  dragObj(elem) {
    return {
      allowFrom: elem,
      inertia: true,
      modifiers: [
        interact['modifiers'].restrictRect({
          restriction: 'parent',
          endOnly: true
        })
      ],
      autoScroll: true,
      onmove: this.drag // // dragMoveListener from the dragging demo above
    };
  }

  dragDrop(dragElem, dropElem) {
    interact(dropElem).dropzone(this.dropObj(dropElem));
    interact(dragElem).draggable(this.dragObj(dragElem));
  }

  snapObj(elem) {
    return {
      allowFrom: elem,
      modifiers: [
        interact['modifiers'].snap({
          targets: [
            interact.createSnapGrid({
              x: 30,
              y: 30
            })
          ],
          range: 2e308,
          relativePoints: [
            {
              x: 0,
              y: 0
            }
          ]
        }),
        interact['modifiers'].restrict({
          restriction: elem['parentNode'],
          elementRect: {
            top: 0,
            left: 0,
            bottom: 1,
            right: 1
          },
          endOnly: true
        })
      ],
      inertia: true
    };
  }

  snap(elem, onSnap = null) {
    interact(elem).draggable(this.snapObj(elem)).on('dragmove', (event) => {
      this.xSnap += event['dx'];
      this.ySnap += event['dy'];
      event['target'].style.transform = `translate(${this.xSnap}px,${this.ySnap}px)`;
      if (onSnap != null) {
        onSnap('Snap', event);
      }
    });
  }

  resizeDragObj(elem) {
    return {
      allowFrom: elem,
      modifiers: [
        interact['modifiers'].restrictRect({
          restriction: 'parent'
        })
      ],
      onmove: this.drag // // dragMoveListener from the dragging demo above
    };
  }

  resizeObj(elem) {
    return {
      allowFrom: elem,
      edges: {
        left: true,
        right: true,
        bottom: true,
        top: true // // resize from all edges and corners
      },
      modifiers: [
        interact['modifiers'].restrictRect({
          restriction: 'parent',
          endOnly: true
        }),
        interact['modifiers'].restrictSize({
          min: {
            width: 100,
            height: 50
          }
        })
      ],
      inertia: true
    };
  }

  resize(elem, onResize = null) {
    interact(elem).dragable(this.resizeDragObj(elem)).resizable(this.resizeObj(elem)).on('resizemove', (event) => {
      var target, x, y;
      target = event['target'];
      x = parseFloat(target.getAttribute('data-x')) || 0;
      y = parseFloat(target.getAttribute('data-y')) || 0;
      target.style.width = event['rect'].width + 'px';
      target.style.height = event['rect'].height + 'px';
      x += event['deltaRect'].left;
      y += event['deltaRect'].top;
      event['target'].style.transform = `translate(${this.xSnap}px,${this.ySnap}px)`;
      target.setAttribute('data-x', x);
      target.setAttribute('data-y', y);
      target.textContent = Math.round(event['rect'].width) + '\u00D7' + Math.round(event['rect'].height);
      if (onResize != null) {
        onResize('Resize', event);
      }
    });
  }

  rotate(elem, onRotate = null) {
    interact(elem).gesturable({
      allowFrom: elem,
      onMove: (event) => {
        this.angle += event['da'];
        elem.style.transform = `rotate(${this.angle}deg)`;
        if (onRotate != null) {
          onRotate('Resize', event);
        }
      }
    });
  }

  rotate2(rotateElem, arrowElem, angleElem = null) {
    interact(rotateElem).gesturable({
      allowFrom: elem,
      onMove: (event) => {
        this.angle += event['da'];
        arrowElem.style.transform = `rotate(${this.angle}deg)`;
        if (angleElem != null) {
          angleElem.textContent = this.angle.toFixed(2) + '\u00b0';
        }
      }
    });
  }

  zoom(elem, onZoom = null) {
    var area;
    area = elem.parentElement;
    return interact(area).gesturable({
      allowFrom: elem,
      onstart: (event) => {
        this.pitchAngle -= event['angle'];
        clearTimeout(this.resetTimeout);
        elem['classlist'].remove('reset');
      },
      onmove: (event) => {
        var angle, scale;
        angle = event['angle'] + this.pinchAngle;
        scale = event['scale'] * this.pinchScale;
        elem.style.transform = `rotate(${angle}deg) scale(${scale})`;
        if (onZoom != null) {
          onZoom('Zoom', event);
        }
      },
      onend: (event) => {
        this.pitchAngle += event['angle'];
        this.pitchScale *= event['scale'];
        this.resetElem = zoomElem;
        this.resetTimeout = setTimeout(this.resetZoom, 1000);
        elem['classlist'].add('reset');
      }
    }).draggable({
      onmove: this.drag
    });
  }

  resetZoom() {
    this.resetElem.style.transform = 'scale(1)';
    this.pinchAngle = 0.0;
    this.pinchScale = 1.0;
  }

  tap(elem, onTap = null) {
    interact(elem).pointerEvents({
      allowFrom: elem
    }).on('tap', (event) => {
      event.preventDefault();
      if (onTap != null) {
        onTap('Tap', event);
      }
    });
  }

  doubleTap(elem, onDoubleTap = null) {
    interact(elem).pointerEvents({
      allowFrom: elem
    }).on('doubletap', (event) => {
      event.preventDefault();
      if (onDoubleTap != null) {
        onDoubleTap('DoubleTap', event);
      }
    });
  }

  hold(elem, onHold = null) {
    interact(elem).pointerEvents({
      allowFrom: elem
    }).on('hold', (event) => {
      event.preventDefault();
      if (onHold != null) {
        onHold('Hold', event);
      }
    });
  }

};

export default Touch;
