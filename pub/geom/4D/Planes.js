
import GA from '../../lib/ga/ganja.esm.js';

let Planes = class Planes {

  static ga() {


    GA( 4, 1, () => {  // Create a Clifford Algebra with 4,1 metric for 3D CGA.

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
      let sc = spherePR( p0,0.5 ); // !(p1 - 0.20 * ni);  // main dual sphere around point (interactive)


    let items = [
      0xFFFFFF,   bne, 'bne', bse, 'bse', bnw, 'bnw', bsw, 'bsw',
      0xFFFFFF,   fne, 'fne', fse, 'fse', fnw, 'fnw', fsw, 'fsw',
      0xFFFFFF,   de, dw, ds,
      0xFFFFFF,   p0, sc, "Sc" ];

    let svg = Element.graph( () => {
       return items; },
      { conformal:true, camera:1+.5e01-.5e02, gl:false, grid:false } );

      window['Geom']['Planes'].process( 'Planes', svg );

  } ) } }

export default Planes;

/*
     // 0xFF00FF,   lt, "Pr&Lt",                  // line intersect plane
     // 0x0000FF,   m1, "Sc&Pb",                  // sphere meet plane
     // 0x888800,   m2, "Sc&Lt",                  // sphere meet line
     // 0x0088FF,   m3, "Sc&Sl",                  // sphere meet sphere
     // 0x008800,   m4, "Sc&Cr",                  // sphere meet circle
     // 0x880000,   m5, "Cr&Pr",                  // circle meet sphere
     // 0x888800,   lp,                      // line and circle
 */