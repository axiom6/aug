
import Interact from 'interactjs'

class Touch

  constructor:() ->
    @elem  = null
    @iter  = null
    @xSnap = 0
    @ySnap = 0
    @angle = 0
    @pinchAngle   = 0.0
    @pinchScale   = 1.0
    @resetTimeout = null

  element:( elem ) ->
    @elem = elem
    @iter = Interact( elem )
    return

  drag:( event ) ->
    target = event.target
    x = (parseFloat(target.getAttribute('data-x')) or 0 ) +event.dx
    y = (parseFloat(target.getAttribute('data-y')) or 0 ) +event.dy
    target.style.transform = "translate(#{x}px,#{y}px)"
    target.setAttribute('data-x',x)
    target.setAttribute('data-y',y)
    window.dragMoveListener = @drag
    return

  dropObj:() -> {
      accept: '#yes-drop', # only accept elements matching this CSS selector
      overlap: 0.75,      # Require a 75% element overlap for a drop to be possible
      ondropactivate: (event) =>
        event.target.classList.add('drop-active')
        return
      ondragenter: (event) =>
        draggableElement = event.relatedTarget
        dropzoneElement  = event.target
        dropzoneElement.classList.add('drop-target') # // feedback the possibility of a drop
        draggableElement.classList.add('can-drop')
        draggableElement.textContent = 'Dragged in'
        return
      ondragleave: (event) =>  # remove the drop feedback style
        event.target.classList.remove('drop-target')
        event.relatedTarget.classList.remove('can-drop')
        event.relatedTarget.textContent = 'Dragged out'
        return
      ondrop: (event) =>
        event.relatedTarget.textContent = 'Dropped'
        return
      ondropdeactivate: (event) => # remove active dropzone feedback
        event.target.classList.remove('drop-active')
        event.target.classList.remove('drop-target')
        return
  }

  dragObj:() -> {
    inertia: true,
    modifiers: [Interact.modifiers.restrictRect({restriction: 'parent', endOnly: true})],
    autoScroll: true,
    onmove: @drag  # // dragMoveListener from the dragging demo above
  }

  dragDrop:( dragElem, dropElem  ) ->
    Interact(dropElem).dropzone(  @dropObj() )
    Interact(dragElem).draggable( @dragObj() )
    return

  snapObj:() -> {
    modifiers: [
      Interact.modifiers.snap({ targets: [
        Interact.createSnapGrid({ x: 30, y: 30 })],
        range: Infinity,
        relativePoints: [ { x: 0, y: 0 } ]
      }),
      Interact.modifiers.restrict({
        restriction: element.parentNode,
        elementRect: { top: 0, left: 0, bottom: 1, right: 1 },
        endOnly: true } ) ],
    inertia: true
  }
    

  snap:( snapElem ) ->
    Interact( snapElem ).dragable( @snapObj() )
    .on('dragmove', (event) =>
      @xSnap += event.dx
      @ySnap += event.dy
      event.target.style.transform = "translate(#{@xSnap}px,#{@ySnap}px)"
      return )
    return

  resizeDragObj:() -> {
    modifiers: [Interact.modifiers.restrictRect({restriction: 'parent'})],
    onmove: @drag  # // dragMoveListener from the dragging demo above
  }

  resizeObj:() -> {
    edges: { left: true, right: true, bottom: true, top: true }, # // resize from all edges and corners
    modifiers: [Interact.modifiers.restrictRect({restriction: 'parent', endOnly: true}),
                Interact.modifiers.restrictSize({ min: { width: 100, height: 50 } }) ],
    inertia: true
  }

  resize:(    resizeElem ) ->
    Interact( resizeElem )
      .dragable(  @resizeDragObj() )
      .resizable( @resizeObj() )
      .on('resizemove', (event) =>
        target = event.target
        x = (parseFloat(target.getAttribute('data-x')) or 0 )
        y = (parseFloat(target.getAttribute('data-y')) or 0 )
        target.style.width  = event.rect.width  + 'px'
        target.style.height = event.rect.height + 'px'
        x += event.deltaRect.left
        y += event.deltaRect.top
        event.target.style.transform = "translate(#{@xSnap}px,#{@ySnap}px)"
        target.setAttribute('data-x', x)
        target.setAttribute('data-y', y)
        target.textContent = Math.round(event.rect.width) + '\u00D7' + Math.round(event.rect.height)
        return )
    return

  rotate:(    rotateElem, arrowElem, angleElem=null ) ->
    Interact( rotateElem ).gesturable({
      onMove: (event) =>
        @angle += event.da
        arrowElem.style.transform = "rotate(#{angle}deg)"
        angleElem.textContent = @angle.toFixed(2) + '\u00b0' if angleElem?
        return
    } )
    return

  zoom:( zoomElem, areaElem ) ->
    Interact( areaElem ).gesturable( {
      onstart: (event) =>
        @pitchAngle -= event.angle
        clearTimeout( @resetTimeout )
        zoomElem.classList.remove('reset')
        return
      onmove:  (event) =>
        angle = event.angle + @pinchAngle
        scale = event.scale * @pinchScale
        zoomElem.style.transform ="rotate(#{angle}deg) scale(#{scale})"
        return
      onend:   (event) =>
        @pitchAngle  += event.angle
        @pitchScale  *= event.scale
        @resetElem    = zoomElem
        @resetTimeout = setTimeout( @resetZoom, 1000)
        zoomElem.classList.add('reset')
        return
    } ).draggable({ onmove: @drag })

  resetZoom:() ->
    @resetElem.style.transform = 'scale(1)'
    @pinchAngle = 0.0
    @pinchScale = 1.0
    return

  tap:( tapElem, onTap ) ->
    Interact(tapElem).on('tap', (event) =>
      onTap( tapElem )
      event.preventDefault()
      return )
    return

  doubleTap:( doubleTapElem, onDoubleTap ) ->
    Interact( doubleTapElem ).on('doubletap', (event) =>
      onDoubleTap( tapElem )
      event.preventDefault()
      return )
    return

  hold:( holdElem, onHold ) ->
    Interact( holdElem ).on('hold', (event) =>
      onHold( holdElem )
      event.preventDefault()
      return )
    return


    

    