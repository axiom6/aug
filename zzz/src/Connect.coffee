
import Vis       from '../../base/util/Vis'
import SvgMgr    from '../../base/d3d/SvgMgr.js'
import Build     from '../../ikw/cube/Build.js';
import Shapes    from './Shapes'
import Embrace   from './Embrace'
import Innovate  from './Innovate'
import Encourage from './Encourage'

class Connect

  constructor:( @stream,  @batch, @prac, @elem, @level ) ->
    @build  = new Build(  @batch() )
    @shapes = new Shapes( @stream  )
    @svgMgr = new SvgMgr( @prac.name, @elem, @level, @stream )
    @draw   = @createDraw()
    @draw.drawSvg( @svgMgr.g, @svgMgr.size, @svgMgr.defs )

  createDraw:() ->
    switch @prac.column
      when 'Embrace'   then new Embrace(   @prac, @shapes, @build )
      when 'Innovate'  then new Innovate(  @prac, @shapes, @build )
      when 'Encourage' then new Encourage( @prac, @shapes, @build )
      else                  new Innovate(  @prac, @shapes, @build )

  clear:() ->
    @shapes.clearSvg( @graph )
    return

export default Connect