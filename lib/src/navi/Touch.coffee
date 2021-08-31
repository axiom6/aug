
class Touch

  constructor:( @stream, @nav ) ->
    @nav.touch    = @
    @elem         = null
    @debug        = true
    @reset()          # "tabs-tab","disp-comp","west","east","south","north","cen"
    @touchClasses    = []
    @touchOutClasses = []

  reset:() ->
    @beg = null
    @pnt = null

  listen:( elem, touchClasses, touchOutClasses=[]  ) ->
    if @debug
      console.log( 'Touch.listen()', touchOutClasses )
    @elem            = elem
    @touchClasses    = touchClasses
    @touchOutClasses = touchOutClasses
    @elem.addEventListener( 'pointerdown',   @start,  false )
    @elem.addEventListener( 'pointerup',     @up,     false )
    @elem.addEventListener( 'pointerleave',  @leave,  false )
    @elem.addEventListener( 'pointercancel', @cancel, false )
    @elem.addEventListener( 'dblclick',      @double, false )
    #elem.addEventListener( 'pointerout',    @out,    false )
    return

  start:(  event ) =>
    # event.preventDefault()
    inTouch  = @nav.inArray( event.target.className, @touchClasses    )
    outTouch = @nav.inArray( event.target.className, @touchOutClasses )
    if @debug
       console.log( 'Touch.start()',
       { target:event.target.className, inTouch:inTouch, outTouch:outTouch, outs:@touchOutClasses } )
    # return if not inTouch
    return   if outTouch
    if not ( event.touches? and event.touches.length > 1 )
      @elem.setPointerCapture( event.pointerId )
    @beg = event
    @pnt = @coord( event, {} )
    @elem.addEventListener( 'pointermove', @movit, false )
    if @debug
      console.log( 'Touch.start()', { target:event.target.className, inTouch:inTouch } )
    return

  movit:( event ) =>
    # event.preventDefault()
    pnt  = if @pnt? then @pnt else {}
    @pnt = @coord( event, pnt )
    return

  coord:( event, pnt ) ->
    if event.targetTouches?                    # Prefer touch points
       pnt.x = event.targetTouches[0].clientX
       pnt.y = event.targetTouches[0].clientY
    else                                      # Either Mouse event or Pointer Event
       pnt.x = event.clientX
       pnt.y = event.clientY
    if @debug
      console.log( 'Touch.movit()', { x:pnt.x, y:pnt.y, touches:event.targetTouches? } )
    return pnt

  leave:( event ) =>
    @endit( event, 'leave' )
    return

  cancel:( event ) =>
    @endit( event, 'cancel' )
    return

  out:( event ) =>
    @endit( event, 'out' )
    return

  up:( event ) =>
    @endit( event, 'cancel' )
    return

  endit:( event, type ) =>
    # event.preventDefault()
    return if event.touches? && event.touches.length > 1
    dir  = 'none'
    if @beg? and @pnt?
       event.target.releasePointerCapture(event.pointerId)
       dir = @swipeDir( @beg.clientX, @beg.clientY, @pnt.x, @pnt.y )
       @nav.doDir( dir ) if dir isnt 'none'
       if @debug
         console.log( 'Touch.endit()', { type:type, x1:@beg.clientX, y1:@beg.clientY, x2:@pnt.x, y2:@pnt.y, dir:dir } )
    @elem.removeEventListener( 'pointermove', @movit, false )
    @reset()
    return

  double:() =>
    @nav.doDir( "next" )

  swipeDir:( begX, begY, endX, endY ) ->
    dir = "none"
    dx  = endX - begX
    dy  = endY - begY
    ax  = Math.abs(dx)
    ay  = Math.abs(dy)
    #if ax < 10 and ay < 10
    #   dir = if event.shiftKey then 'prev' else 'next'
    if      dx <  0 and ax > ay then dir = 'west'
    else if dx >  0 and ax > ay then dir = 'east'
    else if dy <  0 and ay > ax then dir = 'north'
    else if dy >  0 and ay > ax then dir = 'south'
    else                             dir = 'none'
    dir

export default Touch 