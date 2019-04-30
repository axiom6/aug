
//import GA from '../../lib/math/ganja.esm.js';
let GA = window['Algebra'];

let Planes = class Planes {

  static run(elem) {

    window.Geom['Planes'].elem = elem;

    GA(4, 1, () => {  // Create a Clifford Algebra with 4,1 metric for 3D CGA.

      // We start by defining a null basis, and upcasting for points
      let ni = 1e4 + 1e5, no = .5e5 - .5e4, nino = ni ^ no;
      let up = (x) => no + x + .5 * x * x * ni;

      // Next we'll define some objects.
      let p = up(0),                            // point
        S = () => !(p - .5 * ni),                  // main dual sphere around point (interactive)
        S2 = !(up(-1.4e1) - 0.125 * ni),        // left dual sphere
        C = !(up(1.4e1) - .125 * ni) & !(1e3),  // right circle
        L = up(.9e2) ^ up(.9e2 - 1e1) ^ ni,  // top line
        P = !(1e2 - .9 * ni),                     // bottom dual plane
        P2 = !(1e1 + 1.7 * ni);                   // right dual plane

      // The intersections of the big sphere with the other 4 objects.
      let C1 = () => S & P, C2 = () => S & L, C3 = () => S & S2, C4 = () => S & C, C5 = () => C & P2;

      // For line meet plane its a bit more involved.
      let lp = up(nino << (P2 & L ^ no));

      let geom   = window.Geom;
      let planes = geom['Planes'];

      let graph = Element.graph([
        0x00FF0000, p, "s1",               // point
        0xFF00FF, lp, "l&p",               // line intersect plane
        0x0000FF, C1, "s&p",               // sphere meet plane
        0x888800, C2, "s&l",               // sphere meet line
        0x0088FF, C3, "s&s",               // sphere meet sphere
        0x008800, C4, "s&c",               // sphere meet circle
        0x880000, C5, "c&p",               // circle meet sphere
        0, L, 0, C,                        // line and circle
        0xE0008800, P, P2,                 // plane
        0xE0FFFFFF, S, "s1", S2            // spheres
      ], { conformal:true, gl:true, grid:true } );

     // Graph the items. (hex numbers are html5 colors, two extra first bytes = alpha)
     graph.width  = geom.width;
     graph.height = geom.height;
     //console.log( 'Planes', geom.width, geom.height, graph );
     planes.elem.appendChild( graph );

  } ) } }

export default Planes;