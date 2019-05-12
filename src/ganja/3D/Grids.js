

let GA = window['Algebra']; //import GA from '../../lib/ga/ganja.esm.js';

let Grids  = class Grids {

  static ga() {

  GA( 3, 0, 1, () => {  // PGA3D Projective Euclidean 3D space. (dual)

  let items = [];
  let origin=1e123, EX=1e012, EY=1e013, EZ=1e023;
  
  let widthf  = 5.0;
  let heightf = 5.0;
  let widthb  = 3.0;
  let heightb = 3.0;
  let widtho  = 4.0;
  let heighto = 4.0;
  let depth   = 2.0
  let scale   = 0.35;
  
  let point  = (x,y,z)=> origin + x*scale*EX - y*scale*EY + z*scale*EZ
  let linePP = (p1,p2)=> p1.Normalized & p2.Normalized;
  let lineX  = (x,sw,nw,se,ne) => [sw*(1-x)+se*x, nw*(1-x)+ne*x]; // x scales from [0,1]
  let lineY  = (y,sw,se,nw,ne) => [sw*(1-y)+nw*y, se*(1-y)+ne*y]; // y scales from [0,1]

  // Rotations can be specified through exponentiation (angle around line).
  // let rotor = (line,angle)=>Math.cos(angle/2) + Math.sin(angle/2)*line.Normalized;
    
  let ooo = point(   0, 0,  0   );
  let pxa = point( widtho, 0,  0   );
  let pya = point( 0, heighto, 0   );
  let pza = point( 0, 0,     depth );

  let xaxis = linePP( ooo, pxa );
  let yaxis = linePP( ooo, pya );
  let zaxis = linePP( ooo, pza );

  items.push( 0x00FF00, xaxis, yaxis, zaxis );
  
  let fsw = point( -widthf, -heightf, -depth );
  let fse = point(  widthf, -heightf, -depth );
  let fnw = point( -widthf,  heightf, -depth );
  let fne = point(  widthf,  heightf, -depth );
  let bsw = point( -widthb, -heightb,  depth );
  let bse = point(  widthb, -heightb,  depth );
  let bnw = point( -widthb,  heightb,  depth );
  let bne = point(  widthb,  heightb,  depth );
  
  items.push( 0xFFFFFF,
    ooo, 'OOO', pxa, 'PXA', pya, 'PYA', pza, 'PZA',
    fsw, 'FSW', fse, 'FSE', fnw, 'FNW', fne, 'FNE',
    bsw, 'BSW', bse, 'BSE', bnw, 'BNW', bne, 'BNE'  );

  let stroke = ( i, n2 ) => {
    return i % n2 === 0 ? 0xFFFFFF : 0x666666; }

  let grid = ( n1, n2, sw, se, nw, ne, array ) => {
    let d1 = 1.0 / n1;
    for( let x=0, i=0; i<=n1; i++, x=i*d1 ) { array.push( stroke(i,n2), lineX(x,sw,nw,se,ne) ); }
    for( let y=0, i=0; i<=n1; i++, y=i*d1 ) { array.push( stroke(i,n2), lineY(y,sw,se,nw,ne) ); } }

    grid( 100, 10, fsw, fse, bsw, bse, items );  // South Grid
    grid( 100, 10, fsw, bsw, fnw, bnw, items );  // West  Grid
    grid( 100, 10, bsw, bse, bnw, bne, items );  // Back  Grid
    grid( 100, 10, fse, bse, fne, bne, items );  // East  Grid

    let camera = 1e0;

    let svg = Element.graph( () => {
      let time = performance.now()/12000;
      camera['set']( Math.cos(time) + Math.sin(time)*1e13 ); // rotate around Y
      return items; }, { animate:true, camera } );

  window.Style.process( 'Grids', svg );

  } ) } }
    
export default Grids;
