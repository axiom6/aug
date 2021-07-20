
import $    from 'jquery'
import Vis  from '../../../lib/pub/draw/Vis.js'

class AdvisoryUC

  constructor:( @stream, @role, @port, @land ) ->

  ready:() ->
    @$ = $( @html() )

  position:(   screen ) ->
    @onScreen( screen )
    @subscribe()

  subscribe:() ->
    @stream.subscribe( 'Location', 'AdvisoryUC', (location)  => @onLocation(location) )
    @stream.subscribe( 'Screen',   'AdvisoryUC', (screen)    => @onScreen(screen)     )

  onLocation:( location ) ->
    Util.noop( 'AdvisoryUC.onLocation()', @ext, location )

  onScreen:( screen ) ->
    Util.cssPosition( @$, screen, @port, @land )

  html:() ->
    """<div id="#{Vis.htmlId('AdvisoryUC',@role)}" class="#{Vis.cssNameType('AdvisoryUC')}"></div>"""

`export default AdvisoryUC`
