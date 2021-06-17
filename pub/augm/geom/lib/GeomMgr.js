var GeomMgr;

import Graph from "../../../../src/augm/geom/2D/Graph.js";

import Basics from "../../../../src/augm/geom/2D/Basics.js";

import Grids from "../../../../src/augm/geom/3D/Grids.js";

import Isomet from "../../../../src/augm/geom/3D/Isomet.js";

import Play from "../../../../src/augm/geom/3D/Play.js";

import Isohed from "../../../../src/augm/geom/3D/Isohed.js";

import Torus from "../../../../src/augm/geom/3D/Torus.js";

import Sphere from "../../../../src/augm/geom/4D/Sphere.js";

GeomMgr = class GeomMgr {
  constructor() {}

  createPageObj(page) {
    if (page.obj != null) {
      return page.obj;
    }
    switch (page.key) {
      case 'Graph':
        return Graph;
      case 'Basics':
        return Basics;
      case 'Grids':
        return Grids;
      case 'Isomet':
        return Isomet;
      case 'Play':
        return Play;
      case 'Isohed':
        return Isohed;
      case 'Torus':
        return Torus;
      case 'Sphere':
        return Sphere;
      default:
        console.log('GeomMgr.createPageObj() bad page.key', {
          pageKey: page.key,
          page: page
        });
        return Graph;
    }
  }

};

export default GeomMgr;

//# sourceMappingURL=GeomMgr.js.map
