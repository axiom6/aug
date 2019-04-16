
import Vis from "../util/Vis.js"

class Encourage

  constructor:( @spec, @shapes, @build ) ->
    @studies = @shapes.arrange( @spec )
    @innovs  = @build.adjacentStudies( @spec, 'west' )

  drawSvg:( g, geom, defs ) ->
    lay  = @shapes.layout( geom, @spec.column, @shapes.size(@studies), @shapes.size(@innovs) )
    fill = @shapes.toFill(@spec,true)
    @shapes.keyHole( g, lay.xc, lay.yc, lay.xk, lay.yk, lay.ro, lay.hk, fill, lay.stroke )
    yl = lay.yl
    a1 = lay.a1
    xr = lay.xr + lay.wr
    yr = lay.yr
    for key, study of @studies
      fill = @shapes.toFill(study)
      wedgeId = @shapes.htmlId( study.name, 'Wedge' )
      @shapes.wedge( g, lay.ro, lay.rs, a1, a1-lay.da, lay.xc, lay.yc, fill, study.name, wedgeId  )
      for a in [a1-lay.li...a1-lay.da] by -lay.ds
        @shapes.link( g, a, lay.ro, lay.ri, lay.xc, lay.yc, lay.xc, yl, xr, yl, fill, lay.thick )
        yl += lay.dl
      a1 -= lay.da
      yr += lay.hr
    #@innovateStudies( g, lay )
    x  = 0 # lay.xr+lay.wr
    r0 = lay.ri # geom.x0/2 - 36
    y  = geom.y0 - r0/2 # lay.yr
    w  = lay.xr + lay.wr
    h  = r0 # lay.ri
    xt = x +  w  * 0.5
    yt = geom.y0 * 0.5
    @shapes.conveySankey( "Encourage", defs, g, @studies, @innovs, x, y, w, h )
    @shapes.icon( g, geom.x0, geom.y0, @spec.name, @shapes.htmlId(@spec.name,'IconSvg'), Vis.unicode(@spec.icon) )
    @shapes.text( g, xt,           yt, @spec.name, @shapes.htmlId(@spec.name,'TextSvg'), 'wheat', '2em' )
    @shapes.practiceFlow( g, geom, @spec )
    return

  # Not called but matches Sankey
  innovateStudies:( g, lay ) ->
    yi = lay.yi
    for key, innov of @innovs
      fill = @shapes.toFill(innov)
      @shapes.rect( g, lay.xi, yi, lay.wi, lay.hi, fill, lay.stroke )
      yi += lay.hi
    return

export default Encourage