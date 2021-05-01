
import $     from 'jquery'
import Util  from '../util/Util.js'

class ThresholdUC

  constructor:( @stream, @ext, @port, @land ) ->

  ready:() ->
    @$ = $( @html() )

  position:(   screen ) ->
    @onScreen( screen )
    @subscribe()

  subscribe:() ->
    @stream.subscribe( 'Screen', 'ThresholdUC', (screen)   => @onScreen( screen ) )

  onScreen:( screen ) ->
    Util.cssPosition( @$, screen, @port, @land )

  html:() ->
    """<div id="#{Util.id('Threshold')}"       class="#{Util.css('Threshold')}">
       <div id="#{Util.id('ThresholdAdjust')}" class="#{Util.css('ThresholdAdjust')}">Adjust Threshold</div>
       <img src="/assets/Threshold.png" width="200" height="200" alt="alt">
    </div>"""

  show:() -> @$.show()
  hide:() -> @$.hide()

`export default ThresholdUC`