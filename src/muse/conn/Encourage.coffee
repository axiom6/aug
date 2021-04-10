
import Vis from "../../base/draw/Vis.js"

class Encourage

  constructor:( @spec, @shapes, @build ) ->
    @studies = @shapes.arrange( @spec )
    @innovs  = @build.adjacentStudies( @spec, 'west' )

  drawSvg:( g, size, defs ) ->
    lay  = @shapes.layout( size, @spec.column, @shapes.size(@studies), @shapes.size(@innovs) )
    fill = @shapes.toFill(@spec,true)
    @shapes.keyHole( g, lay.xc, lay.yc, lay.xk, lay.yk, lay.ro, lay.hk, fill, lay.stroke )
    yl = lay.yl
    a1 = lay.a1
    xr = lay.xr + lay.wr
    yr = lay.yr
    for key, study of @studies
      fill = @shapes.toFill(study)
      wedgeId = @shapes.htmlId( study.name, 'Wedge' )
      @shapes.wedge( g, lay.ro, lay.rs, a1, a1-lay.da, lay.xc, lay.yc, fill, study.name, wedgeId, size.dispSize, size.level  )
      for a in [a1-lay.li...a1-lay.da] by -lay.ds
        @shapes.link( g, a, lay.ro, lay.ri, lay.xc, lay.yc, lay.xc, yl, xr, yl, fill, lay.thick )
        yl += lay.dl
      a1 -= lay.da
      yr += lay.hr
    #@innovateStudies( g, lay )
    x  = 0 # lay.xr+lay.wr
    r0 = lay.ri # size.x0/2 - 36
    y  = size.yc - r0/2 # lay.yr
    w  = lay.xr + lay.wr
    h  = r0 # lay.ri
    xt = x +  w  * 0.5
    yt = size.yc * 0.5 + size.bannDy
    yi = size.yc       + size.iconDy
    @shapes.conveySankey( "Encourage", defs, g, @studies, @innovs, x, y, w, h )
    @shapes.icon( g, size.xc, yi, @spec.name, @shapes.htmlId(@spec.name,'IconSvg'), 'black', size.iconSize, Vis.unicode(@spec.icon) )
    @shapes.text( g, xt,      yt, @spec.name, @shapes.htmlId(@spec.name,'TextSvg'), 'black', size.bannSize )
    @shapes.practiceFlow( g, size, @spec )
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