
//import GA from '../../lib/math/ganja.esm.js';
let GA = window['Algebra'];

let Planes = class Planes {

  static ga() {


    GA(4, 1, () => {  // Create a Clifford Algebra with 4,1 metric for 3D CGA.

      // no                  = 1e5 - 1e4  origin
      // ni                  = 0.5(1e4 + 1e5)  inifinity
      // nino                = ni ^ no
      // points(x,y,z)       = no + x*1e1 + y*1e2 + z*1e3 + 0.5 * ( x*x + y*y + z*z ) * ni;
      // circle(p1,p2,p3 )   = p1^p2^p3
      // sphere(p1,p2,p3,p4) = p1^p2^p3^p4
      // sphere(p,r)         = !(p-r*ni)
      // sphere(p,r)         = (p,r) => !(p-r*ni)
      // line(p1,p2)         = p1 ^ p2
      // lineINF(p1,p2)      = p1 ^ p2 ^ ni
      // join                = p1 ^ p2
      // meet                = p1 & p2
      // rotor(a,b)          = exp((a/2)*b)

      // We start by defining a null basis, and upcasting for points
   // let total = 5.0;
      let scale = 0.2;
      let xs = scale;
      let ys = scale;
      let zs = scale;
   // let range = total * scale;
      let ni   = 1.0e4 + 1.0e5;
      let no   = 0.5e5 - 0.5e4;
      let nino = ni ^ no;
      let up   = (x) => no + x + .5 * x * x * ni;

      // Shapes
      let point  = (x,y,z) => no + x*xs*1e1 + y*ys*1e2 + z*zs*1e3 + 0.5 * ( x*x + y*y + z*z ) * ni;
   // let line   = (p1,p2) => [p1,p2];
      let plane  = (b,r)   => !( b + r * scale * ni );
      let sphere = (p,r)   => !( p - r * scale * ni );

      // Next we'll define some objects.
      let p0 = point(0, 0, 0 );                           // point
      let p2 = up(-1.4e1);
      let p3 = up( 1.4e1)
      let sc = () => sphere( p0,1.00 ); // !(p1 - 0.20 * ni);  // main dual sphere around point (interactive)
      let sl = () => sphere( p2,0.75 );       // left dual sphere
      let cr = () => !(p3 - .125 * ni) & !(1e3); // right circle
      let lt = up(.5e2) ^ up(.9e2 - 1e1) ^ ni;  // top line

      let pd = plane( 1e3,  5 ); // !(1e3 + 2.0 * ni );  // depth  dual plane - dark
      let pb = plane( 1e2, -5 );  // bottom dual plane
      let pr = plane( 1e1,  5 );  // right  dual plane
      let pl = plane( 1e1, -5 );  // left   dual plane
      
      // The intersections of the big sphere with the other 4 objects.
      let m1 = () => sc & pb, m2 = () => sc & lt, m3 = () => sc & sl, m4 = () => sc & cr, m5 = () => cr & pr;

      // For line meet plane its a bit more involved.
      let lp = up(nino << (pr & lt ^ no));

      let items = [
        0x00FF00,   p0, "Sc", p2, "Sl", p3, "Cr", // ceter points for 2 spheres and circle
        0xFF00FF,   lt, "Pr&Lt",                  // line intersect plane
        0x0000FF,   m1, "Sc&Pb",                  // sphere meet plane
        0x888800,   m2, "Sc&Lt",                  // sphere meet line
        0x0088FF,   m3, "Sc&Sl",                  // sphere meet sphere
        0x008800,   m4, "Sc&Cr",                  // sphere meet circle
        0x880000,   m5, "Cr&Pr",                  // circle meet sphere
        0x888800,   lp, cr,                       // line and circle
        0xE0008844, pb, pr, pl, pd,               // Bottom and Right plane
        0x00000088, sc, sl                        // spheres 0xE0FFFFFF
      ];

      // Graph the items. (hex numbers are html5 colors, two extra first bytes = alpha)
      let canvas = Element.graph( () => {
         return items; },
        { conformal:true, gl:true, grid:false } );



      window.Style.process( 'Planes', canvas );

  } ) } }

export default Planes;