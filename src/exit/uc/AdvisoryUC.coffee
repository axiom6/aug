
import $    from 'jquery'
import {vis}  from '../../../lib/pub/draw/Vis.js'

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
    vis.noop( 'AdvisoryUC.onLocation()', @ext, location )

  onScreen:( screen ) ->
    vis.cssPosition( @$, screen, @port, @land )

  html:() ->
    """<div id="#{vis.htmlId('AdvisoryUC',@role)}" class="#{vis.cssNameType('AdvisoryUC')}"></div>"""

`export default AdvisoryUC`
