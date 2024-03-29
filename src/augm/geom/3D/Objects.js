

import Algebra from 'ganja.js';

let Objects  = class Objects {

  static ga() {

    Algebra( 3, 0, 1, () => {

    // rotation helper and Lathe function.
    let rot = (a,P)=>Math.cos(a)+Math.sin(a)*P.Normalized,
      lathe=(X,n,P,m)=>[...Array(n+1)].map((x,i)=>rot(i/n*Math.PI*(m||1),P)>>>X),

    // wrap takes X, a double array of points, and generates triangles.
    wrap=(X)=>{
      let u=X.length-1,v=X[0].length-1; X=[].concat.apply([],X);
      let P=[],vp=v+1; for(let i=0;i<u*vp;i+=vp)for(let j=0;j<v;j++)P.push([i+j,i+j+1,vp+i+j],[i+j+1,vp+i+j,vp+i+j+1]);
      return P.map(x=>x.map(x=>X[x]));
    },

    // Basic primitives constructed by Lathing points, line segments, etc.
    cylinder = (r=1,h=1,x=32)=>wrap(lathe([!1e0,!(1e0+r*1e3),!(1e0+r*1e3+h*1e1),!(1e0+h*1e1)],x,1e23)),
    torus    = (r=.3,r2=.25,x=32,y=16)=>wrap(lathe((1+r*.5e03)>>>lathe(!(1e0+r2*(1e1+1e3)/2**.5),y,1e13),x,1e23)),
    sphere   = (r=1,x=32,y=16)=>wrap(lathe(lathe(!(1e0+r*1e1),y,1e13,.5),x,1e23)),
    cone     = (r=1,h=1,x=64)=>wrap(lathe([!1e0,!(1e0+r*1e3),!(1e0+h*1e1)],x,1e23)),
    arrow    = ()=>[...cone(.15,.3),...cone(.15,0),...cylinder(.05,-2)],

    // A selection of these objects.
    objs=[ arrow(),         torus(0.8,.3),       sphere(.8),        sphere(.8,3,2),
           cone(1,2**.5,3), cone(1,2**.5,4),     cone(1,2**.5),     torus(.8,.2,5,32),
           cylinder(),      cylinder(1,2**.5,4), torus(.8,.3,4,4),
           torus(.8,.3,64,4)].map(x=>( {data:x} ) );

  let canvas = Element.graph( () => {
    let time = performance.now()/1000;
    objs.forEach((obj,i) => obj.transform =
      (1+1e0-3e01-((i%3)-1)*1.5e03-((i/3|0)-1.5)*1.5e02)*rot(time,1e12)*rot(time*0.331,1e13));
    return [0xFF0088,...objs]; }, { gl:true, animate:false } );

/* let svg = Element.graph( () => {
    objs.forEach((obj,i) => obj.transform =
      (1+1e0-3e01-((i%3)-1)*1.5e03-((i/3|0)-1.5)*1.5e02)); // *rot(time,1e12)*rot(time*0.331,1e13));
      (1+1e0-3e01-((i%3)-1)*1.5e03-((i/3|0)-1.5)*1.5e02)*rot(time,1e12)*rot(time*0.331,1e13));
    return [0xFF8888,...objs]; }, { } ); */

    window['Geom']['Objects'].process( 'Objects', canvas );

} ) } }

export default Objects;