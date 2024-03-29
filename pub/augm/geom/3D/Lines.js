
import { GA } from '../../../lib/ga/ganja.esm.js';

let Lines  = class Lines {

  static ga() {

  GA( 3, 0, 1, () => {

  // We work in dual space. Our 1-blade's are dual-vectors (aka functionals of the
  // form ax + by + cz + dw = 0).
  // The four basis functionals are thus (x=0, y=0, z=0, w=0). In three dimensions
  // these represent the yz, xz, xy and
  // ideal plane.

  // Specify a point directly (trivectors specified with overloaded e-notation.)
  let point = (x,y,z)=>1e123-x*1e012+y*1e013+z*1e023;

  // Lines can be defined using plucker coordinates
  // let line = (px,py,pz,dx,dy,dz)=>px*1e01+py&1e02+pz*1e03+dx*1e12+dy*1e13+dz*1e23;

  // Planes can be defined directly using e0,e1,e2,e3
  // let plane = (a,b,c,d)=>d*1e0+a*1e1+b*1e2+c*1e3;

  // Useful joins
     let line_from_points  = (P1,P2)=>P1.Normalized&P2.Normalized;
  // let plane_from_points = (P1,P2,P3)=>P1&P2&P3;
  // let plane_from_point_and_line = (P,L)=>P&L;

  // Usefull meets
     let line_from_planes  = (p1,p2)=>p1^p2;
  // let point_from_planes = (p1,p2,p3)=>p1^p2^p3;
     let point_from_line_and_plane = (L,P)=>L^P;

   // Create 5 points and some joining lines.
      let A=point(0,-1,0  );
      let B=point(1,1,-1  );
      let C=point(-1,1,-1 );
      let D=point(1,1, 1  );
      let E=point(-1,1, 1 );
      let centroid=A+B+C+D+E;
      let camera=1e0;

  // Graph the 3D items
  let graph = Element.graph( ()=> {
    let time=performance.now()/12000;
    camera['set'](Math.cos(time)+Math.sin(time)*1e13);                      // rotate around Y
    return [
      0xddaaff,[A,B,C],                                            // graph on face
      0xAA88FF,[A,B],[A,C],[A,D],[B,C],[B,D],[C,E],[A,E],[E,D],    // graph all edges
      0x444444,A,"A",B,"B",C,"C",D,"D",E,"E",                      // graph all vertices
      0xFF8888,C+E,centroid,"sum of points",
      0x8888FF,line_from_points(centroid,C+E),"line from points ..",
      0x44AA44,line_from_planes(A&B&C,B&C&D),"line from planes ..",
      0x4488FF,point_from_line_and_plane(line_from_points(centroid,C+E),A&D&B),
        "point from line and plane ..",
      0xFFAA66,(B&D)+(C&E),"sum of lines"]; }, { animate:true, camera } );

    window['Geom']['Lines'].process( 'Lines', graph );

  } ); } }

export default Lines;
