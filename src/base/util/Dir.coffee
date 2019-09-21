
class Dir

  constructor:( @stream,  @navs, @route='Home' ) ->
    @$router =  null

  pub:( route ) ->
    # console.log('Dir.pub()', route )
    @stream.publish( 'Dir',  route )
    return

  touch:( dir, event=null ) =>
    # return if dir is 'prev'
    if event is null then {}
    route = @navs[@route][dir]
    @pub(     route )
    @doRoute( route, dir )
    return

  doRoute:( route, dir='None' ) ->
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