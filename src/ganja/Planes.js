
//import GA from '../../lib/math/ganja.esm.js';
let GA = window['Algebra'];

let Planes = class Planes {

  static ga() {


    GA(4, 1, () => {  // Create a Clifford Algebra with 4,1 metric for 3D CGA.

      // no                 = 1e5 - 1e4  origin
      // ni                 = 0.5(1e4 + 1e5)  inifity
      // nino               = ni ^ no
      // points(x,y,z)      = no + x*1e1 + y*1e2 + z*1e3 + 0.5 * ( x*x + y*y + z*z ) * ni;
      // circle(p1,p2,p3 )  = p1^p2^p3
      // sphere(p1,p2,p3 )  = p1^p2^p3^p4
      // join               = p1^p2
      // meet               = p1Vp2  // V?
      // rotor(a,b)         = exp((a/2)*b)

      // We start by defining a null basis, and upcasting for points
      let ni = 1e4 + 1e5, no = .5e5 - .5e4, nino = ni ^ no;
      let up = (x) => no + x + .5 * x * x * ni;

      // Next we'll define some objects.
      let p = up(0),                           // point
        S = () => !(p - .4 * ni),                 // main dual sphere around point (interactive)
        S2 = !(up(-1.4e1) - 0.15 * ni),       // left dual sphere
        C = !(up(1.4e1) - .125 * ni) & !(1e3), // right circle
        L = up(.9e2) ^ up(.9e2 - 1e1) ^ ni;  // top line


      let PD = !(1e3 + 2.0 * ni );  // depth  dual plane - dark
      let PB = !(1e2 - 0.9 * ni );  // bottom dual plane
      let PR = !(1e1 + 1.7 * ni );  // right  dual plane
      let PL = !(1e1 - 1.7 * ni );  // left   dual plane


      // The intersections of the big sphere with the other 4 objects.
      let C1 = () => S & PB, C2 = () => S & L, C3 = () => S & S2, C4 = () => S & C, C5 = () => C & PR;

      // For line meet plane its a bit more involved.
      let lp = up(nino << (PR & L ^ no));

      let items = [
        0xE0008888, PD, 'PD',               // Dark background plane
        0x00FF0000, p,  "s1",               // point
        0xFF00FF,   lp, "l&p",               // line intersect plane
        0x0000FF,   C1, "s&p",               // sphere meet plane
        0x888800,   C2, "s&l",               // sphere meet line
        0x0088FF,   C3, "s&s",               // sphere meet sphere
        0x008800,   C4, "s&c",               // sphere meet circle
        0x880000,   C5, "c&p",               // circle meet sphere
        0, L, 0, C,                         // line and circle
        0xE0008888, PB, PR, PL,             // Bottom and Right plane
        0x00000088, S, "s1", S2            // spheres 0xE0FFFFFF
      ];

      // Graph the items. (hex numbers are html5 colors, two extra first bytes = alpha)
      let canvas = Element.graph( () => {
         return items;
      },
      { conformal:true, gl:true, grid:false } );

      let context = canvas.getContext('webgl');
      context.fillStyle = '#000000';
      console.log( "Planes", context, canvas );

      window.Style.process( 'Planes', canvas );

  } ) } }

export default Planes;