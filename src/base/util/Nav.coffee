
class Nav

  constructor:( @stream,  @dirs, @comp ) ->
    @$router =  null
    @queue   =  null # Last published obj created before route call request by new component
    @queued  =  false

  # Publish twice because Tocs needs to update comp before any Nav view updates
  pub:( obj ) ->
    # console.log('Nav.pub()', obj )
    @stream.publish( 'Nav',  obj )
    return

  set:( obj ) ->
    for own key,   val of obj
          @[key] = val
    # console.log('Nav.set()', obj, @tab )
    return

  dir:( dr, event=null ) =>
    return if dr is 'prev'
    if event is null then {}
    comp = @dirs[@comp][dr]
    @pub( comp )
    @$router.push( { name:comp } ) if @$router?
    console.log('Nav.dir()', { beg:@comp, dir:dr, end:comp } )
    @comp = comp
    return

  route:( comp, obj ) ->
    if @$router?
       @$router.push( { name:comp } )
       # console.log(   'Nav.router()', { name:comp } )
    else
       console.error( 'Nav.router() $router not set' )
    # Oueue up obj for for component to request when mounted
    @comp   = comp
    @queue  = obj
    @queued = true
    return

  que:( source, queued ) ->
    # console.log( 'Nav.que()', { source:source, queued:@queued, queue:@queue } )
    @queued = queued
    @queue

  adjDir:( dir ) ->
    switch dir
      when 'west'  then 'east'
      when 'north' then 'south'
      when 'east'  then 'west'
      when 'south' then 'north'
      else              'west'

export default Nav