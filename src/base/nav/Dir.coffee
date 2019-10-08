
class Dir

  constructor:( @stream,  @navs ) ->
    @route   = 'Home'
    @$router =  null

  pub:( obj ) ->
    # console.log('Dir.pub()', obj )
    @stream.publish( 'Dir',  obj )
    return

  touch:( dir, event=null ) =>
    # return if dir is 'prev'
    if event is null then {}
    route = @navs[@route][dir]
    obj = { source:'Dir', route:route }
    @pub(     obj )
    @doRoute( route, dir )
    return

  doRoute:( route ) ->
    if @$router?
       @$router.push( { name:route } )
    else
       console.error( 'Nav.router() $router not set' )
    # console.log('Dir.doRoute()', { beg:@route, dir:dir, end:route } )
    @route = route
    return

  adjDir:( dir ) ->
    switch dir
      when 'west'  then 'east'
      when 'north' then 'south'
      when 'east'  then 'west'
      when 'south' then 'north'
      else              'west'

export default Dir