
let GA = window['Algebra']; // import GA from '../../../lib/ga/ganja.esm.js';

let Conform = class Conform {

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
      let ni = 1e4   + 1e5;
      let no = 0.5e5 - 0.5e4;
      // let nino = ni ^ no;
   // let up = (x) => no + x + .5 * x * x * ni;

      let point = (xa,ya,za) => {
        let x = xa*xs, y=ya*ys, z=za*zs;
        return no + x*1e1 + y*1e2 + z*1e3 + 0.5 * ( x*x + y*y + z*z ) * ni; }

      let plane3P = (p1,p2,p3)    => () => p1 ^ p2 ^ p3 ^ ni;
      let planeDR = (p1,p2,p3,p4) => [p1,p2,p3,p4];

      let r   = 3;
   // let h   = r * 0.5;
      let bne = point(  r,  r,  r );
      let bse = point(  r, -r,  r );
      let bnw = point( -r,  r,  r );
      let bsw = point( -r, -r,  r );
      let fne = point(  r,  r, -r );
      let fse = point(  r, -r, -r );
      let fnw = point( -r,  r, -r );
      let fsw = point( -r, -r, -r );

   // let pb = plane3P(bne,bnw,bsw), db = planeDR(bne,bnw,bsw,bse);
      let pe = plane3P(bne,fne,fse), de = planeDR(bne,fne,fse,bse);
   // let pn = plane3P(bne,bnw,fnw), dn = planeDR(bne,bnw,fnw,fne);
      let pw = plane3P(bnw,fnw,fsw), dw = planeDR(bnw,fnw,fsw,bsw);
      let ps = plane3P(bse,bsw,fsw), ds = planeDR(bse,bsw,fsw,fse);

      if( pe===false && pe===false && pe===false && pw===false && ps===false ) {}

   // let line     = (p1,p2) => [p1,p2];
   // let planeBR  = (b,r)   => !( b + r * scale * ni );
      let spherePR = (p,r)   => !( p - r * scale * ni );
   // let grid     = (b,r,n) => plane(b,r);

      // Next we'll define some objects.
      let p0 = point(0, 0, 0 );                           // point
   // let p2 = point(-0.7, 0, 0 );
   // let p3 = point( 0.7, 0, 0 );
      let sc = () => spherePR( p0,0.5 ); // !(p1 - 0.20 * ni);  // main dual sphere around point (interactive)
   // let sl = () => spherePR( p2,0.5 );       // left dual sphere
   // let cr = () => !(p3 - .125 * ni) & !(1e3); // right circle
   // let lt = point( 2.0, 2.5, 0 ) ^ point( -2.0, 2.5, 0 );// top line up(.9e2 - 1e1) ^ ni

  // let pd = planeBR( 1e3,  rp ); // !(1e3 + 2.0 * ni );  // depth  dual plane - dark
  // let pb = planeBR( 1e2, -rp );  // bottom dual plane
  // let pr = planeBR( 1e1,  rp );  // right  dual plane
  // let pl = planeBR( 1e1, -rp );  // left   dual plane
  // let pt = planeBR( 1e2,  rp );  // top    dual plane

  // The intersections of the big sphere with the other 4 objects.
  // let m1 = () => sc & pb, m2 = () => sc & lt, m3 = () => sc & sl, m4 = () => sc & cr, m5 = () => cr & pr;

  // For line meet plane its a bit more involved.
  //
  // let lp = up(nino << (pr & lt ^ no));

    let items = [
      0x000000,   bne, 'bne', bse, 'bse', bnw, 'bnw', bsw, 'bsw',
      0x000000,   fne, 'fne', fse, 'fse', fnw, 'fnw', fsw, 'fsw',
      0x444444,   de, dw, ds,
      0x444444,   p0, "Sc",
      0xFFFFFF,   sc, "Sc"
      ];

      // Graph the items. (hex numbers are html5 colors, two extra first bytes = alpha)
      let canvas = Element.graph( () => {
         return items; },
        { conformal:true, gl:true, grid:false } );

      window.Style.process( 'Planes', canvas );

  } ) } }

export default Conform;

/*
     // 0xFF00FF,   lt, "Pr&Lt",                  // line intersect plane
     // 0x0000FF,   m1, "Sc&Pb",                  // sphere meet plane
     // 0x888800,   m2, "Sc&Lt",                  // sphere meet line
     // 0x0088FF,   m3, "Sc&Sl",                  // sphere meet sphere
     // 0x008800,   m4, "Sc&Cr",                  // sphere meet circle
     // 0x880000,   m5, "Cr&Pr",                  // circle meet sphere
     // 0x888800,   lp,                      // line and circle
 */