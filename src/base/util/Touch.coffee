
import Tocca from '../../../pub/lib/touch/Tocca.esm.js'

class Touch

  constructor:() ->
    @tocca = Tocca()
    @dirs  = ['up', 'down', 'left', 'right']
    @evts  = ['tap', 'dbltap', 'longtap', 'swipeleft', 'swipeup', 'swiperight', 'swipedown']

  onNav:(   elem, nav ) ->
    @tap(   elem,(e) -> nav.dir('next',  e ) )
    @dbl(   elem,(e) -> nav.dir('next',  e ) )
    @hold(  elem,(e) -> nav.dir('prev',  e ) )
    @right( elem,(e) -> nav.dir('west',  e ) )  # All directions reversed
    @down(  elem,(e) -> nav.dir('north', e ) )
    @left(  elem,(e) -> nav.dir('east',  e ) )
    @up(    elem,(e) -> nav.dir('south', e ) )
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

export default Touch
    

    