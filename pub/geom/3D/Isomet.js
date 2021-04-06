
import { GA } from '../../../lib/ga/ganja.esm.js';

let Isomet  = class Isomet {

  static ga() {

  GA( 3, 0, 1, () => {  // PGA3D Projective Euclidean 3D space. (dual)

  let items = [];
  let origin=1e123, EX=-1e012, EY=1e013, EZ=1e012;
  let point  = (x,y,z)=>origin+x*EX-y*EY+z*EZ

  let s =  0.20;    // xyz Scale
  let t = 10.00*s; // Total lengths
  let c =  8.66*s; // Cos(30)
  let h =  5.00*s; // Sin(30) or Half
  let i =  0.50*s; // 10% increment

  let ooo = point(0,0 ,0 );
  let xoo = point(c,-h, 0 );
  let oyo = point(0,t, 0 );
  let ooz = point(0,-h, c );
  let xyo = point(c,h, 0 );
  let oyz = point(0,h, c );
  let xoz = point(c,-t, c );

  items.push( 0xFFFFFF, ooo, 'ooo', xoo, 'xoo', oyo, 'oyo', ooz, 'ooz',
                        xyo, 'xyo', oyz, 'oyz', xoz, 'xoz' );

  let xy = [ooo,xoo,xyo,oyo];
  let yz = [ooo,ooz,oyz,oyo];
  let zx = [ooo,ooz,xoz,xoo];

  items.push( 0x888888, xy, 0x666666, yz, 0x444444, zx );

  let xyX = (x) => [ooo*(1-x)+xoo*x, oyo*(1-x)+xyo*x]; // x scales from [0,1]
  let xyY = (y) => [ooo*(1-y)+oyo*y, xoo*(1-y)+xyo*y]; // y scales from [0,1]
  let yzY = (y) => [ooo*(1-y)+oyo*y, ooz*(1-y)+oyz*y]; // y scales from [0,1]
  let yzZ = (z) => [ooo*(1-z)+ooz*z, oyo*(1-z)+oyz*z]; // z scales from [0,1]
  let zxX = (x) => [ooo*(1-x)+xoo*x, ooz*(1-x)+xoz*x]; // x scales from [0,1]
  let zxZ = (z) => [ooo*(1-z)+ooz*z, xoo*(1-z)+xoz*z]; // z scales from [0,1]

  let gxy = (t,i, xf, yf, items ) => {
    items.push(0xFFFFFF);
    for( let x=0; x < t; x+=i ) { items.push(xf(x)); }
    for( let y=0; y < t; y+=i ) { items.push(yf(y)); } }

  gxy( h, i, xyX, xyY, items ); // Not sure why h
  gxy( h, i, yzY, yzZ, items );
  gxy( h, i, zxX, zxZ, items );

  let svg = Element.graph( () => { return items; }, {} );

  window['Geom']['Isomet'].process( 'Isomet', svg );

  } ) } }

export default Isomet;
