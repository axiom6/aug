
import Tocca from '../../lib/touch/Tocca.esm.js'


class Touch

  constructor:( @stream, @navs ) ->
    @tocca   = Tocca()
    @dirs    = ['up', 'down', 'left', 'right']
    @evts    = ['tap', 'dbltap', 'longtap', 'swipeleft', 'swipeup', 'swiperight', 'swipedown']
    @route   = 'Home'
    @$router =  null  # Set later

  onDir:(   elem ) ->
    @tap(   elem,(e) => @doTouch('next',  e ) )
    @dbl(   elem,(e) => @doTouch('next',  e ) )
    @hold(  elem,(e) => @doTouch('prev',  e ) )
    @right( elem,(e) => @doTouch('west',  e ) )  # All directions reversed
    @down(  elem,(e) => @doTouch('north', e ) )
    @left(  elem,(e) => @doTouch('east',  e ) )
    @up(    elem,(e) => @doTouch('south', e ) )
    return

  tap:( elem, onEvent ) ->
    elem.addEventListener( 'tap',        onEvent )
    return

  dbl:( elem, onEvent ) ->
    elem.addEventListener( 'dbltap',     onEvent )
    return

  hold:( elem, onEvent ) ->
    elem.addEventListener( 'longtap',    onEvent )
    return

  left:( elem, onEvent ) ->
    elem.addEventListener( 'swipeleft',  onEvent )
    return

  up:( elem, onEvent ) ->
    elem.addEventListener( 'swipeup',    onEvent )
    return

  right:( elem, onEvent ) ->
    elem.addEventListener( 'swiperight', onEvent )
    return

  down:( elem, onEvent ) ->
    elem.addEventListener( 'swipedown',  onEvent )
    return

  doTouch:( dir, event=null ) =>
    # return if dir is 'prev'
    if event is null then {}
    route = @navs[@route][dir]
    obj = { source:'Dir', route:route }
    @pub(     obj )
    @doRoute( route, dir )
    return

  pub:( obj ) ->
    # console.log('Dir.pub()', obj )
    @stream.publish( 'Dir',  obj )
    return

  doRoute:( route ) ->
    if @$router?
      @$router.push( { name:route } )
    else
      console.error( 'Nav.router() $router not set' )
    # console.log('Dir.doRoute()', { beg:@route, dir:dir, end:route } )
    @route = route
    return

export default Touch
       