
import Algebra from 'ganja.js';

let Isohed  = class Isohed {

  static ga() {

  Algebra(3,0,1,()=>{  // Create a Clifford Algebra with 3,0,1 metric.

  // Specify a point directly (trivectors specified with overloaded e-notation.)
  let point = (x,y,z)=>1e123-x*1e012+y*1e013+z*1e023;
  let rotor = (P,a)=>Math.cos(a/2)+Math.sin(a/2)*P;

  // Our camera position and orientation
  let  camera=1e0;

  // We construct faces, edges and vertices of an icosahedron.
  let r = rotor(1e13,Math.PI/2.5);
  let A = point(0,1,0);
  let B = point((1-Math.atan(0.5)**2)**0.5,Math.atan(0.5),0);
  let C = rotor(1e13,Math.PI/5)>>>(1e2>>>B);
  let items=[A,"A",B,"B",C,"C"];

  // vertices
  items.push(0x4444FF);
  for (let i=0;i<5;i++) items.push(A,B=r>>>B,C=r>>>C,1e2>>>A);

  // edges
  items.push(0x444444);
  for (let i=0;i<5;i++) items.push([A,B],[B,C],[B,B=r>>>B],[B,C],[C,C=r>>>C],[1e2>>>A,C]);

  // faces
  items.push(0xFFCCCC);
  for (let i=0;i<5;i++) items.push([A,B,r>>>B],[B,B=r>>>B,C],[C,B,r>>>C],[C,1e2>>>A,C=r>>>C]);

  // Graph the 3D items
  let graph = Element.graph( () => {
    let time=performance.now()/4000;
    camera['set'](rotor(1e13,time)*rotor(1e12,time*1.23131));                // animate camera
    return items.slice(0,1+((Math.floor(time*50))%(items.length+20))); },   // show more and more elements
  { gl:true, animate:true, camera } );


  window['Geom']['Isohed'].process( 'Isohed', graph );

  } ) } }

export default Isohed;