
import SvgMgr    from '../../../lib/pub/base/draw/SvgMgr.js'
import Build     from '../../../lib/pub/base/util/Build.js';
import Shapes    from './Shapes.js'
import Embrace   from './Embrace.js'
import Innovate  from './Innovate.js'
import Encourage from './Encourage.js'

class Connect

  constructor:( @stream,  @batch, @prac, @elem, @level ) ->
    @build  = new Build(  @batch  )
    @shapes = new Shapes( @stream )
    @svgMgr = new SvgMgr( @prac.name, @elem, @level )
    @draw   = @createDraw()
    @draw.drawSvg( @svgMgr.g, @svgMgr.size, @svgMgr.defs )

  createDraw:() ->
    switch @prac.column
      when 'Embrace'   then new Embrace(   @prac, @shapes, @build, @level )
      when 'Innovate'  then new Innovate(  @prac, @shapes, @build, @level )
      when 'Encourage' then new Encourage( @prac, @shapes, @build, @level )
      else                  new Innovate(  @prac, @shapes, @build, @level )

  clearSvg:() ->
    @svgMgr.clearSvg()
    return

  resize:() ->
    @svgMgr.resize()
    return

export default Connect