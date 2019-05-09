
let GA = window['Algebra']; //import GA from '../../lib/math/ganja.esm.js';

let Torus  = class Torus {

  static ga() {

    GA( 3, 0, 1, () => {  // PGA3D Projective Euclidean 3D space.

  // Ganja.js can graph the orbits of parametrised motor variables :
  // these are functions that take one parameter 0<x<1 and return a motor.
  // For a function of 1 parameter, the orbit is rendered as a curve.

  let circle  = (BV,r)=>x=>Math.E**(Math.PI*x*BV)*(1+r*.5e01),
    segment = (BV)=>x=>1+x*0.5*BV;

  // The product of two such parametrised 1D orbits is a 2D manifold :
  // In ganja, you can simply multiply the two 1-parameter orbits to
  // make a 2-parameter manifold. (rendered as a sheet)

  // this allows us to multiply two circles into a torus or sphere,
  // two segments into a plane, or a segment and a circle to produce
  // a disk, cone or cylinder.

  let torus    = (r1,r2)=>circle(1e12,r1)*circle(1e13,r2),
    sphere   = (r)=>circle(1e13,0)*circle(1e12,r),
    plane    = (x,y)=>segment(x*1e02)*segment(y*1e03),
    cylinder = (r,l)=>segment(l*1e02)*circle(1e13,r),
    disk     = (r)=>circle(1e12,0)*segment(r*1e01),
    cone     = (r,l)=>circle(1e12,0)*segment(r*1e01-l*1e03);

  // we can render these now just as our other primitives ..
  let elements = [
    0xff0000, circle(1e12,1),
    0x0000ff, segment(1e01),
    0xff0088, torus(.5,.2),
    0xffff00, sphere(0.1),
    0x00ffff, plane(0.2,0.2),
    0x8800ff, cylinder(.05,1),
    0x00ff00, disk(0.2),
    0xffffff, cone(0.1,0.2)
  ];

  // show with rotating camera..
     let camera=1e1+1; // 0e1+1


  let svg = Element.graph( () => {
    let time = performance.now()/1234;
    camera['set']( Math.cos(time) + Math.sin(time)*1e13 ); // rotate around Y
    return elements; }, { gl:true, animate:true, camera } );

  window.Style.process( 'Torus', svg );

} ) } }

export default Torus;

/*
  document.body.appendChild(this.graph(()=>{
    var t=performance.now()/1234;
    camera.set( Math.cos(t) + Math.sin(t)*1e13  );
    return elements;
  },{camera,gl:1,animate:1}));
 */