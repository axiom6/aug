
#mport interact  from '../../../node_modules/interactjs/dist/interact.js'
#mport interact, { init as initInteract } from '../../pub/lib/touch/interact.esm.js'
import interact  from '../../../pub/lib/touch/interact.esm.js'
import Modernizr from '../../../pub/lib/touch/modernizr.esm.js'

class Touch

  constructor:( ) ->
    @hasTouch   = Modernizr['touchevents']?
    @hasPointer = Modernizr['pointerevents']?
    console.log( 'Touch', { hasTouch:@hasTouch, hasPointer:@hasPointer } )
    @xSnap = 0
    @ySnap = 0
    @angle = 0
    @pinchAngle   = 0.0
    @pinchScale   = 1.0
    @resetTimeout = null
    @dirs = ['up', 'down', 'left', 'right']
    @ptes = ['tap', 'doubletap', 'hold', 'down', 'move', 'up']

  events:( elem ) ->
    #console.log( 'Touch.events', { title:elem.title, elem:elem } )
    @swipe(     elem, @onOpEvent )
    #snap(      elem, @onOpEvent )
    #resize(    elem, @opOpEvent )
    @rotate(    elem, @onOpEvent )
    @zoom(      elem, @onOpEvent )
    @tap(       elem, @onOpEvent )
    @doubleTap( elem, @onOpEvent )
    @hold(      elem, @onOpEvent )
    return

  onOpEvent:( op, event ) ->
    name  = if event.target.title? then event.target.title else 'None'
    swipe = if event['swipe']?     then event['swipe']     else 'None;'
    console.log( { op:op, name:name, event:event, swipe:swipe } )
    return

  swipe:( elem, onSwipe=null ) ->
    interact(elem).draggable(true).on('dragend', (event) =>
      onSwipe( 'Swipe', event ) if onSwipe? and event['swipe']?
      return )
    return

  # Called by window.dragMoveListener, dropObj(), resizeDragObj, zoom()
  drag:( event ) =>
    target = event['target']
    return if not target.title? or target.title is 'Info'
    x = (parseFloat(target.getAttribute('data-x')) or 0 ) + event['dx']
    y = (parseFloat(target.getAttribute('data-y')) or 0 ) + event['dy']
    target.style.transform = "translate(#{x}px,#{y}px)"
    target.setAttribute('data-x',x)
    target.setAttribute('data-y',y)
    @onOpEvent( 'Drag', event )
    #window.dragMoveListener = @drag
    return

  dropObj:(elem) -> {
    allowFrom:elem,
    #accept: '#yes-drop', # only accept elements matching this CSS selector
    overlap: 0.75,      # Require a 75% element overlap for a drop to be possible
    ondropactivate: (event) =>
      event['target']['classList'].add('drop-active')
      return
    ondragenter: (event) =>
      draggableElement = event['relatedTarget']
      dropzoneElement  = event['target']
      dropzoneElement[ 'classList'].add('drop-target') # // feedback the possibility of a drop
      draggableElement['classList'].add('can-drop')
      draggableElement.textContent = 'Dragged in'
      return
    ondragleave: (event) =>  # remove the drop feedback style
      event['target']['classlist'].remove('drop-target')
      event['relatedTarget']['classlist'].remove('can-drop')
      event['relatedTarget']['textContent'] = 'Dragged out'
      return
    ondrop: (event) =>
      event['relatedTarget'].textContent = 'Dropped'
      @onOpEvent( 'Drop', event )
      return
    ondropdeactivate: (event) => # remove active dropzone feedback
      event['target']['classlist'].remove('drop-active')
      event['target']['classlist'].remove('drop-target')
      return
  }

  dragObj:(elem) -> {
    allowFrom:elem,
    inertia: true,
    modifiers: [interact['modifiers'].restrictRect({restriction: 'parent', endOnly: true})],
    autoScroll: true,
    onmove: @drag  # // dragMoveListener from the dragging demo above
  }

  dragDrop:( dragElem, dropElem  ) ->
    interact(dropElem).dropzone(  @dropObj(dropElem) )
    interact(dragElem).draggable( @dragObj(dragElem) )
    return

  snapObj:(elem) -> {
    allowFrom:elem,
    modifiers: [
      interact['modifiers'].snap( {
        targets: [ interact.createSnapGrid( { x:30, y:30 } ) ],
        range: Infinity,
        relativePoints: [ { x:0, y:0 } ] } ),
      interact['modifiers'].restrict({
        restriction: elem['parentNode'],
        elementRect: { top: 0, left: 0, bottom: 1, right: 1 },
        endOnly: true } ) ],
    inertia: true
  }

  snap:( elem, onSnap=null ) ->
    interact( elem ).draggable( @snapObj(elem) )
    .on('dragmove', (event) =>
      @xSnap += event['dx']
      @ySnap += event['dy']
      event['target'].style.transform = "translate(#{@xSnap}px,#{@ySnap}px)"
      onSnap( 'Snap', event ) if onSnap?
      return )
    return

  resizeDragObj:(elem) -> {
    allowFrom:elem,
    modifiers: [interact['modifiers'].restrictRect({restriction: 'parent'})],
    onmove: @drag  # // dragMoveListener from the dragging demo above
  }

  resizeObj:(elem) -> {
    allowFrom:elem,
    edges: { left: true, right: true, bottom: true, top: true }, # // resize from all edges and corners
    modifiers: [interact['modifiers'].restrictRect({restriction: 'parent', endOnly: true}),
                interact['modifiers'].restrictSize({ min: { width: 100, height: 50 } }) ],
    inertia: true
  }

  resize:( elem, onResize=null ) ->
    interact( elem )
      .dragable(  @resizeDragObj(elem) )
      .resizable( @resizeObj(elem) )
      .on('resizemove', (event) =>
        target = event['target']
        x = (parseFloat(target.getAttribute('data-x')) or 0 )
        y = (parseFloat(target.getAttribute('data-y')) or 0 )
        target.style.width  = event['rect'].width  + 'px'
        target.style.height = event['rect'].height + 'px'
        x += event['deltaRect'].left
        y += event['deltaRect'].top
        event['target'].style.transform = "translate(#{@xSnap}px,#{@ySnap}px)"
        target.setAttribute('data-x', x)
        target.setAttribute('data-y', y)
        target.textContent = Math.round(event['rect'].width) + '\u00D7' + Math.round(event['rect'].height)
        onResize( 'Resize', event ) if onResize?
        return )
    return

  rotate:(    elem, onRotate=null ) ->
    interact( elem ).gesturable({
      allowFrom:elem,
      onMove: (event) =>
        @angle += event['da']
        elem.style.transform = "rotate(#{@angle}deg)"
        onRotate( 'Resize', event ) if onRotate?
        return
    } )
    return

  rotate2:(    rotateElem, arrowElem, angleElem=null ) ->
    interact( rotateElem ).gesturable({
      allowFrom:elem,
      onMove: (event) =>
        @angle += event['da']
        arrowElem.style.transform = "rotate(#{@angle}deg)"
        angleElem.textContent = @angle.toFixed(2) + '\u00b0' if angleElem?
        return
    } )
    return

  zoom:( elem,  onZoom=null ) ->
    area = elem.parentElement
    interact( area ).gesturable( {
      allowFrom:elem,
      onstart: (event) =>
        @pitchAngle -= event['angle']
        clearTimeout( @resetTimeout )
        elem['classlist'].remove('reset')
        return
      onmove:  (event) =>
        angle = event['angle'] + @pinchAngle
        scale = event['scale'] * @pinchScale
        elem.style.transform ="rotate(#{angle}deg) scale(#{scale})"
        onZoom('Zoom', event ) if onZoom?
        return
      onend:   (event) =>
        @pitchAngle  += event['angle']
        @pitchScale  *= event['scale']
        @resetElem    = zoomElem
        @resetTimeout = setTimeout( @resetZoom, 1000)
        elem['classlist'].add('reset')
        return
    } ).draggable({ onmove: @drag })

  resetZoom:() ->
    @resetElem.style.transform = 'scale(1)'
    @pinchAngle = 0.0
    @pinchScale = 1.0
    return

  tap:( elem, onTap=null ) ->
    interact(elem)
      .pointerEvents( {
         allowFrom:elem } )
      .on('tap', (event) =>
        event.preventDefault()
        onTap( 'Tap', event ) if onTap?
        return )
    return

  doubleTap:( elem, onDoubleTap=null ) ->
    interact( elem )
      .pointerEvents( {
        allowFrom:elem } )
      .on('doubletap', (event) =>
        event.preventDefault()
        onDoubleTap( 'DoubleTap', event ) if onDoubleTap?
        return )
    return

  hold:( elem, onHold=null ) ->
    interact( elem )
      .pointerEvents( {
        allowFrom:elem } )
      .on('hold', (event) =>
        event.preventDefault()
        onHold( 'Hold', event ) if onHold?
        return )
    return

export default Touch
    

    