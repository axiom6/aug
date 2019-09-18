
import Tocca from '../../../pub/lib/touch/Tocca.esm.js'

class Touch

  constructor:() ->
    @tocca = Tocca()
    @dirs  = ['up', 'down', 'left', 'right']
    @evts  = ['tap', 'dbltap', 'longtap', 'swipeleft', 'swipeup', 'swiperight', 'swipedown']

  onDir:(   elem, dir ) ->
    @tap(   elem,(e) -> dir.touch('next',  e ) )
    @dbl(   elem,(e) -> dir.touch('next',  e ) )
    @hold(  elem,(e) -> dir.touch('prev',  e ) )
    @right( elem,(e) -> dir.touch('west',  e ) )  # All directions reversed
    @down(  elem,(e) -> dir.touch('north', e ) )
    @left(  elem,(e) -> dir.touch('east',  e ) )
    @up(    elem,(e) -> dir.touch('south', e ) )
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
    

    