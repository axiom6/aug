
import Graph  from "../../../../src/augm/geom/2D/Graph.js"
import Basics from "../../../../src/augm/geom/2D/Basics.js"
import Grids  from "../../../../src/augm/geom/3D/Grids.js"
import Isomet from "../../../../src/augm/geom/3D/Isomet.js"
import Play   from "../../../../src/augm/geom/3D/Play.js"
import Isohed from "../../../../src/augm/geom/3D/Isohed.js"
import Torus  from "../../../../src/augm/geom/3D/Torus.js"
import Sphere from "../../../../src/augm/geom/4D/Sphere.js"

class GeomMgr

  constructor:() ->

  createPageObj:( page ) ->
    return page.obj if page.obj?
    switch page.key
      when 'Graph'  then Graph
      when 'Basics' then Basics
      when 'Grids'  then Grids
      when 'Isomet' then Isomet
      when 'Play'   then Play
      when 'Isohed' then Isohed
      when 'Torus'  then Torus
      when 'Sphere' then Sphere
      else
        console.log( 'GeomMgr.createPageObj() bad page.key', { pageKey:page.key, page:page } )
        Graph

export default GeomMgr