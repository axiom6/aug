
import $    from 'jquery'
import Util from '../util/Util.js'

class NavigateUI

  constructor:( @stream ) ->

  ready:() ->
    @htmlId = Util.id('NavigateUI')
    @$      = $( @html(@htmlId) )
    @$img   = @$.find('img')
    return

  position:(   screen ) ->
    onScreen:( screen )
    @subscribe()
    return

  subscribe:() ->
    @stream.subscribe( 'Screen', 'NavigateUI', (screen)   => @onScreen( screen ) )
    return

  onScreen:( screen ) ->
    src = if screen.orientation is 'Landscape' then "/assets/Nav.Land.png" else  "/assets/Nav.Port.png"
    @$img.attr( 'src', src )
    return

  html:( htmlId ) ->
    """<div id="#{htmlId}" class="#{Util.css('NavigateUI')}">
         <img src="/assets/Nav.Port.png" alt="Navigate"/>
       </div>"""

  show:() -> @$.show()

  hide:() -> @$.hide()

`export default NavigateUI`