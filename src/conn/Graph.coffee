
import Util  from '../util/Util.js'
import UI    from '../ui/UI.js'
import Pres  from '../pres/Pres.js'
import Basic from '../prac/Basic.js'

class Graph extends Basic

  constructor:( stream, ui, pane,  build  ) ->
    super(      stream, ui, pane, 'Graph' )
    @build = build
    @pres   = new Pres( @ui, @stream, @pane, @build )
    @shapes = @pres.shapes
    @geom   = null
    Util.noop( @build )
    [@wgpx,@hgpx] = [0,0]

  ready:() =>
    [@wgpx,@hgpx] = @pane.size()
    cells = @spec.cells # if @page.intent is UI.SelectPack then [1,16,1,14] else
    @geom = @pane.geom( cells, @wgpx, @hgpx )
    @graph=null; @g=null; svgId=''; gId=''; @defs=null
    [@graph,@g,svgId,gId,@defs] = @shapes.createSvg( @pane.name, @pane.htmlId, @geom.w, @geom.h )
    @$      = @pane.$.find( '#'+svgId )
    @$g     = @pane.$.find( '#'+gId   )
    @draw   = @pres.createDraw( @pane )
    @draw.drawSvg( @g, @$g, @geom, @defs )
    @htmlId = svgId
    @$

  layout:( intent ) =>
    cells  = if intent is UI.SelectPack then [1,16,1,14] else @spec.cells
    @geom  = @pane.geom( cells, @wgpx, @hgpx )
    @shapes.layout( @graph, @g, @geom.w, @geom.h, @geom.sx, @geom.sy )
    @geom = null # Insure that @pane.geom() gets called for next layout
    return

export default Graph