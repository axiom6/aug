
import Vis from "../util/Vis.js"

class Embrace

  constructor:( @spec, @shapes, @build ) ->
    @studies = @shapes.arrange( @spec )
    @innovs  = @build.adjacentStudies( @spec, 'east' )

  drawSvg:( g, geom, defs ) =>
    #$g.hide()
    lay  = @shapes.layout( geom, @spec.column, @shapes.size(@studies), @shapes.size(@innovs) )
    fill = @shapes.toFill(@spec)
    @shapes.keyHole( g, lay.xc, lay.yc, lay.xk, lay.yk, lay.ro, lay.hk, fill, lay.stroke )
    yl = lay.yl
    a1 = lay.a1
    xr = lay.xr + lay.wr
    yr = lay.yr
    for own key, study of @studies
      fill = @shapes.toFill(study)
      wedgeId = @shapes.htmlId( study.name, 'Wedge' )
      @shapes.wedge( g, lay.ro, lay.rs, a1, a1-lay.da, lay.xc, lay.yc, fill, study.name, wedgeId  )
      for a in [a1-lay.li...a1-lay.da] by -lay.ds
        @shapes.link( g, a, lay.ro, lay.ri, lay.xc, lay.yc, lay.xc, yl, xr, yl, fill, lay.thick )
        yl += lay.dl
      a1 -= lay.da
      yr += lay.hr
    x = lay.xr+lay.wr
    y = lay.yr
    w = lay.w  - x
    h = lay.ri
    yt = geom.y0 + geom.h * 0.49
    @shapes.conveySankey( "Embrace", defs, g, @studies, @innovs, x, y, w, h  )
    @shapes.icon( g, geom.x0, geom.y0, @spec.name, @shapes.htmlId(@spec.name,'IconSvg'), Vis.unicode(@spec.icon) )
    @shapes.text( g, w-12,         yt, @spec.name, @shapes.htmlId(@spec.name,'TextSvg'), 'black' )
    @shapes.practiceFlow( g, geom, @spec )
    #$g.show()
    return

  # Not called but matches innovation
  innovateStudies:( g, geom ) ->
    r0   = geom.x0/2 - 36
    w    = 24
    h    = r0 / @shapes.size(@innovs)
    x0   = geom.w  - w
    y0   = geom.y0 - r0/2
    for own key, innov of @innovs
      fill = @shapes.toFill(innov)
      @shapes.rect( g, x0, y0, w, h, fill, 'none' )
      y0 += h
    return

export default Embrace


