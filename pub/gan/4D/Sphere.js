
import GA from '../../lib/ga/ganja.esm.js';

let Sphere = class Sphere {

  static ga() {


    GA(4, 1, () => {  // Create a Clifford Algebra with 4,1 metric for 3D CGA.

      // console.log( this.describe() );

      // We start by defining a null basis, and upcasting for points
      let ni = 1e4 + 1e5, no = .5e5 - .5e4;
      let up = (x) => no + x + .5 * x * x * ni;

      // Next we'll define 4 points
      let p1 = up(1e1), p2 = up(1e2), p3 = up(-1e3), p4 = up(-1e2);

      // The outer product can be used to construct the sphere through
      // any four points.
      let s = () => p1 ^ p2 ^ p3 ^ p4;

      // The outer product between any three points and infinity is a plane.
      let p = () => p1 ^ p2 ^ p3 ^ ni;

      // Graph the items. (hex numbers are html5 colors, two extra first bytes = alpha)
      let canvas = Element.graph([
        0x00FF0000, p1, "p1", p2, "p2", p3, "p3", p4, "p4", // points
        0xE0008800, p, "p",                                 // plane
        0xE00000FF, s, "s"                                  // sphere
      ], { conformal:true, gl:true, grid:false });

      //let context = canvas.getContext('webgl');
      //context.fillStyle = '#000000';

      window['Geom']['Sphere'].process( 'Sphere', canvas );

    } ) } }

export default Sphere;