// https://observablehq.com/@axiom6/ganja-js-cheat-sheets@1109
export default function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], function(md){return(
md`# Ganja.js cheat-sheets

[Ganja.js](https://github.com/enkimute/ganja.js) provides support for a wide range of **Clifford Algebras** over the reals. (up to 32 generators squaring to -1,+1 or 0). In this notebook we list a selection of commonly used low dimensional Clifford Algebras, together with Cayley tables, geometric interpretation, available operators, graphing options and a  **live** expression evaluator for all of them.`
)});
  main.variable(observer()).define(["md","tex"], function(md,tex)
{ var menu = Object.assign(md`# Clifford Algebras - The Rosetta Stone.
<center style="width:100%; color:#ddd">Low-Dimensional :</center>
<DIV CLASS="box">
  <DIV CLASS="title">0 Dimensions</DIV>
  <TABLE>
   <TR><TD>${tex`\mathbb R_{0,0,0}`}<TD>${tex`\mathbb R`}<TD>Real Numbers
  </TABLE>
</DIV>
<DIV CLASS="box">
  <DIV CLASS="title">1 Dimension</DIV>
  <TABLE>
   <TR><TD>${tex`\mathbb R_{1,0,0}`}<TD>${tex`\mathbb D`}<TD>Hyperbolic Numbers
   <TR><TD>${tex`\mathbb R_{0,1,0}`}<TD>${tex`\mathbb C`}<TD>Complex Numbers
   <TR><TD>${tex`\mathbb R_{0,0,1}`}<TD>${tex`\mathbb D`}<TD>Dual Numbers
  </TABLE>
</DIV>
<DIV CLASS="box">
  <DIV CLASS="title">2 Dimensions</DIV>
  <TABLE>
   <TR><TD>${tex`\mathbb R_{2,0,0}`}<TD>&nbsp;<TD>2D Vector Space
   <TR><TD>${tex`\mathbb R_{0,2,0}`}<TD>${tex`\mathbb H`}<TD>Quaternions
   <TR><TD>${tex`\mathbb R_{1,1,0}`}<TD>${tex`\mathbb M`}<TD>Minkowski Plane
  </TABLE>
</DIV>
<DIV CLASS="box">
  <DIV CLASS="title">3 Dimensions</DIV>
  <TABLE>
   <TR><TD>${tex`\mathbb R_{3,0,0}`}<TD>&nbsp;<TD>3D Vector Space
   <TR><TD>${tex`\mathbb R_{0,2,1}`}<TD>${tex`\mathbb {DH}`}<TD>Dual Quaternions
   <TR><TD>${tex`\mathbb R_{2,0,1}`}<TD>&nbsp;<TD>2D Euclidean Projective GA
   <TR><TD>${tex`\mathbb R_{3,0,0}`}<TD>&nbsp;<TD>2D Elliptic Projective GA
   <TR><TD>${tex`\mathbb R_{2,1,0}`}<TD>&nbsp;<TD>2D Hyperbolic Projective GA
  </TABLE>
</DIV>
<DIV CLASS="box">
  <DIV CLASS="title">4 Dimensions</DIV>
  <TABLE>
   <TR><TD>${tex`\mathbb R_{4,0,0}`}<TD>&nbsp;<TD>4D Vector Space
   <TR><TD>${tex`\mathbb R_{3,0,1}`}<TD>&nbsp;<TD>3D Euclidean Projective GA
   <TR><TD>${tex`\mathbb R_{4,0,0}`}<TD>&nbsp;<TD>3D Elliptic Projective GA
   <TR><TD>${tex`\mathbb R_{3,1,0}`}<TD>&nbsp;<TD>3D Hyperbolic Projective GA
   <TR><TD>${tex`\mathbb R_{3,1,0}`}<TD>&nbsp;<TD>Minkowski Spacetime
   <TR><TD>${tex`\mathbb R_{3,1,0}`}<TD>&nbsp;<TD>2D Conformal GA
  </TABLE>
</DIV>
<DIV CLASS="box">
  <DIV CLASS="title">5 Dimensions</DIV>
  <TABLE>
   <TR><TD>${tex`\mathbb R_{5,0,0}`}<TD>&nbsp;<TD>5D Vector Space
   <TR><TD>${tex`\mathbb R_{4,1,0}`}<TD>&nbsp;<TD>3D Conformal GA
  </TABLE>
</DIV>

<center style="width:100%; color:#ddd">High-Dimensional :</center>

<DIV CLASS="box">
  <DIV CLASS="title">8 Dimensions</DIV>
  <TABLE>
   <TR><TD>${tex`\mathbb R_{4,4,0}`}<TD>&nbsp;<TD>Mother Algebra
  </TABLE>
</DIV>
<DIV CLASS="box">
  <DIV CLASS="title">9 Dimensions</DIV>
  <TABLE>
   <TR><TD>${tex`\mathbb R_{6,3,0}`}<TD>&nbsp;<TD>Colored Conformal GA
  </TABLE>
</DIV>
<DIV CLASS="box">
  <DIV CLASS="title">10 Dimensions</DIV>
  <TABLE>
   <TR><TD>${tex`\mathbb R_{8,2,0}`}<TD>&nbsp;<TD>Double Conformal GA
  </TABLE>
</DIV>
<DIV CLASS="box">
  <DIV CLASS="title">15 Dimensions</DIV>
  <TABLE>
   <TR><TD>${tex`\mathbb R_{9,6,0}`}<TD>&nbsp;<TD>Quadric Conformal GA
  </TABLE>
</DIV>
`,{className:'sheet'});

[...menu.querySelectorAll('td:nth-child(3)')].forEach(x=>{
  x.parentElement.onclick = ()=>{
    var a = document.getElementById(x.innerText);
    if (a) a.scrollIntoView({behavior:'instant',block:'start',inline:'start'});
  };
  x.parentElement.onmouseenter = function(){this.style.background="#EEF";}
  x.parentElement.onmouseleave = function(){this.style.background="";}
  x.parentElement.style.cursor = "pointer";
});

return menu;

}
);
  main.variable(observer()).define(["md"], function(md){return(
md`---`
)});
  main.variable(observer()).define(["md"], function(md){return(
md`# 0 Dimensions`
)});
  main.variable(observer("real")).define("real", ["quick_sheet","md","tex"], function(quick_sheet,md,tex){return(
quick_sheet({
  title : "Real Numbers",
  titlesym : "R",
  altname : "one",
  sample  : "1",
  sig     : [0,0,0],
  evaluate:"1+1",
  cards : [
    {
      description : "Geometry",
      text : md`No immediate geometric interpretation. In the context of Clifford Algebra's, the reals are called **scalars** and considered to be zero-dimensional.`
    },
    { 
      description : "Sub-Algebras",
      text : md`${tex`\mathbb R`} occurs as a sub-algebra of all Clifford algebras.`
    },
    { 
      description : "Matrices",
      text : md`\`\`\`javascript
var M = [[1,0],[0,1]];   // 2x2 identity matrix.
var V = [1,1];           // 1x2 vector. 
var R = M*V;             // matrix-vector product.
var N = M*M;             // matrix-matrix product.
var s = V*V;             // vector-vector dot product.
var O = !M;              // transpose matrix.
\`\`\`
`
    }
  ]
})
)});
  main.variable(observer()).define(["md"], function(md){return(
md`---
# 1 Dimension`
)});
  main.variable(observer("hyperbolic")).define("hyperbolic", ["quick_sheet","md","tex"], function(quick_sheet,md,tex){return(
quick_sheet({
  title : "Hyperbolic Numbers",
  titlesym : "D",
  altname : "j",
  sample  : "1e1",
  sig     : [1,0,0],
evaluate : "(3+2e1)*(1+4e1)",
    cards : [{description:"Geometry",text:"Hyperbolic rotations. The geometry here could also be called Minkowski **vector** plane geometry."} ,{ 
      description : "Sub-Algebras",
      text : md`The complex numbers have the scalars ${tex`\mathbb R`} as a sub-algebra.`
    },{ 
      description : "Matrices",
      text : md`\`\`\`javascript
var M = [[1e1,1],[0,1]]; // 2x2 hyperbolic matrix.
var V = [1,1e1];         // 1x2 hyperbolic vector.
var R = M*V;             // matrix-vector product.
var N = M*M;             // matrix-matrix product.
var s = V*V;             // vector-vector dot product.
var O = !M;              // conjugate-transpose matrix.
\`\`\`
`
    }]
})
)});
  main.variable(observer("complex")).define("complex", ["quick_sheet","md","tex"], function(quick_sheet,md,tex){return(
quick_sheet({
  title : "Complex Numbers",
  titlesym : "C",
  altname : "i",
  sample  : "1e1",
  sig     : [0,1,0],
  evaluate : "(3+2e1)*(1+4e1)",
  cards: [{description:"Geometry",text:md`Rotations around the origin. The geometry of ${tex`\mathbb C`} is often called Euclidean plane geometry. A better name would be Euclidean **vector** plane geometry.`} ,{ 
      description : "Sub-Algebras",
      text : md`The complex numbers have the scalars ${tex`\mathbb R`} as a sub-algebra.`
    },{ 
      description : "Matrices",
      text : md`\`\`\`javascript
var M = [[1e1,1],[0,1]]; // 2x2 complex matrix.
var V = [1,1e1];         // 1x2 complex vector.
var R = M*V;             // matrix-vector product.
var N = M*M;             // matrix-matrix product.
var s = V*V;             // vector-vector dot product.
var O = !M;              // conjugate-transpose matrix.
\`\`\`
`
    }]
})
)});
  main.variable(observer("dual")).define("dual", ["quick_sheet","md","tex"], function(quick_sheet,md,tex){return(
quick_sheet({
  title : "Dual Numbers",
  titlesym : "D",
  altname : "epsilon",
  sample  : "1e0",
  sig     : [0,0,1],
  evaluate : "(3+2e0)*(1+4e0)",
  
  cards : [{description:"Geometry",text:"Translations in the dual direction. Dual numbers are popular because of their use in **automatic differentiation** in the backpropagation algorithm for AI"}
 ,{ 
      description : "Sub-Algebras",
      text : md`The complex numbers have the scalars ${tex`\mathbb R`} as a sub-algebra.`
    },{ 
      description : "Matrices",
      text : md`\`\`\`javascript
var M = [[1e0,1],[0,1]]; // 2x2 dual matrix.
var V = [1,1e0];         // 1x2 dual vector.
var R = M*V;             // matrix-vector product.
var N = M*M;             // matrix-matrix product.
var s = V*V;             // vector-vector dot product.
var O = !M;              // conjugate-transpose matrix.
\`\`\`
`
    }]
})
)});
  main.variable(observer()).define(["md"], function(md){return(
md`---
# 2 Dimensions`
)});
  main.variable(observer("R2")).define("R2", ["quick_sheet","md"], function(quick_sheet,md){return(
quick_sheet({
  title : "2D Vector Space",
  titlesym : "",
  altname : "vec",
  sample  : "1e1+1e2",
  sig     : [2,0,0],
  evaluate : "1e1*1e2",
  cards : [{
    description:"Geometry",
    text:md`The natural embedding of one scalar, two vectors and one bivector for the Graded Euclidean Vector Plane.`
  },
  
  
  {
    description:"Sub-Algebras",
    text:md`<TABLE>
<TR><TD>Scalars<TD>1
<TR><TD>Complex numbers<TD>1,e<sub>12</sub>
<TR><TD>Hyperbolic numbers<TD>1,e<sub>1</sub> or 1,e<sub>2</sub>
</TABLE>`
  },{ 
      description : "Matrices",
      text : md`\`\`\`javascript
var M = [[1e1,1e2],[0,1]];// 2x2 matrix.
var V = [1,1e12];         // 1x2 vector.
var R = M*V;              // matrix-vector product.
var N = M*M;              // matrix-matrix product.
var s = V*V;              // vector-vector dot product.
var O = !M;               // conjugate-transpose matrix.
\`\`\`
`
    }
   ]
})
)});
  main.variable(observer("quaternion")).define("quaternion", ["quick_sheet","md","tex"], function(quick_sheet,md,tex){return(
quick_sheet({
  title : "Quaternions",
  titlesym : "H",
  altname : "quat",
  sample  : "1+1e1+1e2+1e12",
  sig     : [0,2,0],
  evaluate : "(0.707+0.707e1)*(1e1)*~(0.707+0.707e1)",
  cards:[
    {description:"Geometry",
    text:md`The quaternions represent 3D rotations around the origin. While ${tex`\mathbb R_{0,2}`} is the smallest Clifford Algebra isomorph to the quaternions, they occur more intuitively in higher dimensional spaces like ${tex`\mathbb R_{3,0,0}`}.
`},{
    description:"Sub-Algebras",
    text:md`<TABLE>
<TR><TD>Scalars<TD>1
<TR><TD>Complex numbers<TD>1,e<sub>1</sub> or 1,e<sub>2</sub> or 1,e<sub>12</sub>
</TABLE>`
  },{ 
      description : "Matrices",
      text : md`\`\`\`javascript
var M = [[1e1,1e1],[0,1]];// 2x2 quaternion matrix.
var V = [1+1e1,1e12];     // 1x2 quaternion vector.
var R = M*V;              // matrix-vector product.
var N = M*M;              // matrix-matrix product.
var s = V*V;              // vector-vector dot product.
var O = !M;               // conjugate-transpose matrix.
\`\`\`
`
    }]
})
)});
  main.variable(observer("minkowski")).define("minkowski", ["quick_sheet","md"], function(quick_sheet,md){return(
quick_sheet({
  title : "Minkowski Plane",
  titlesym : "M",
  altname : "m",
  sample  : "1+1e1+1e2+1e12",
  sig     : [1,1,0],
  evaluate : "1e2*1e2",
  cards : [{
    description:"Geometry",
    text:md`The natural embedding of one scalar, one space vector, one time vector and one bivector for the Graded Minkowski vector Plane. Naturally enables Lorentz transformations.`
  },
  {
    description:"Sub-Algebras",
    text:md`<TABLE>
<TR><TD>Scalars<TD>1
<TR><TD>Complex numbers<TD>1,e<sub>2</sub>
<TR><TD>Hyperbolic numbers<TD>1,e<sub>1</sub> or 1,e<sub>12</sub>
</TABLE>`
  },{ 
      description : "Matrices",
      text : md`\`\`\`javascript
var M = [[1e1,1e2],[0,1]];// 2x2 minkowski matrix.
var V = [1,1e12];         // 1x2 minkowski vector.
var R = M*V;              // matrix-vector product.
var N = M*M;              // matrix-matrix product.
var s = V*V;              // vector-vector dot product.
var O = !M;               // conjugate-transpose matrix.
\`\`\`
`
    }
   ]
  
})
)});
  main.variable(observer()).define(["md"], function(md){return(
md`---
# 3 Dimensions`
)});
  main.variable(observer("R3")).define("R3", ["quick_sheet","md"], function(quick_sheet,md){return(
quick_sheet({
  title : "3D Vector Space",
  titlesym : "",
  altname : "vec",
  sample  : "1e1+1e2+1e3",
  sig     : [3,0,0],
  evaluate : "1e1*1e12",
  cards : [{
    description:"Geometry",
    text:md`The natural embedding of one scalar, three vectors, three bivectors and one trivector for the Graded Euclidean Vector Space.`
  },
  {
    description:"Sub-Algebras",
    text:md`<TABLE>
<TR><TD>Scalars<TD>1
<TR><TD>Complex numbers<TD>1,e<sub>12</sub> or 1,e<sub>13</sub> or 1,e<sub>23</sub>  or 1,e<sub>123</sub> 
<TR><TD>Hyperbolic numbers<TD>1,e<sub>1</sub> or 1,e<sub>2</sub>  or 1,e<sub>3</sub>
<TR><TD>Quaternions<TD>1,e<sub>12</sub>, e<sub>13</sub>, e<sub>23</sub>
</TABLE>`
  },{ 
      description : "Matrices",
      text : md`\`\`\`javascript
var M = [[1e1,1e3],[0,1]]; // matrix w. vector elements
var V = [1,1e123];         // vector w. vector elements
var R = M*V;               // matrix-vector product.
var N = M*M;               // matrix-matrix product.
var s = V*V;               // vector-vector dot product.
var O = !M;                // conjugate-transpose matrix
\`\`\`
`
    }
   ]
})
)});
  main.variable(observer("dualQuaternions")).define("dualQuaternions", ["quick_sheet","md"], function(quick_sheet,md){return(
quick_sheet({
  title : "Dual Quaternions",
  titlesym : "DH",
  altname : "dquat",
  sample  : "1e1+1e12+1e0+1e01",
  sig     : [0,2,1],
  evaluate : "1e1*1e12",
  cards : [{
    description:"Geometry",
    text:md`The Dual Quaternions are the smallest algebra to include rotations and translations as versors.`
  },
  {
    description:"Sub-Algebras",
    text:md`<TABLE>
<TR><TD>Scalars<TD>1
<TR><TD>Complex numbers<TD>1,e<sub>1</sub> or 1,e<sub>2</sub> or 1,e<sub>12</sub>
<TR><TD>Dual numbers<TD>1,e<sub>0</sub> or 1,e<sub>01</sub>  or 1,e<sub>02</sub>
<TR><TD>Quaternions<TD>1,e<sub>1</sub>, e<sub>2</sub>, e<sub>12</sub>
</TABLE>`
  },{ 
      description : "Matrices",
      text : md`\`\`\`javascript
var M = [[1e1,1e3],[0,1]];// 2x2 dual quaternion matrix.
var V = [1,1e123];        // 1x2 dual quaternion vector.
var R = M*V;              // matrix-vector product.
var N = M*M;              // matrix-matrix product.
var s = V*V;              // vector-vector dot product.
var O = !M;               // conjugate-transpose matrix.
\`\`\`
`
    }
   ]  
})
)});
  main.variable(observer("PGA2D")).define("PGA2D", ["notTheThumb","quick_sheet","md","tex","Algebra"], function(notTheThumb,quick_sheet,md,tex,Algebra){return(
notTheThumb&&quick_sheet({
  title : "2D Euclidean Projective GA",
  titlesym : "",
  altname : "mv",
  sample  : "1e1+1e12+1e0+1e01",
  sig     : [2,0,1],
    evaluate : "1e1*1e12",

  cards : [{
    description : "Plane Based Geometry",
    origin  : "e_{12}",
    points  : "e_{12} + xe_{01} + ye_{02}",
    "ideal points"  : "xe_{01} + ye_{02}",
    lines   : "ae_1 + be_2 + ce_0",
    join    : "p_1 \\vee p_2",
    meet    : "l_1 \\wedge l_2",
    rotors  : "e^{\\frac\\alpha 2B} = cos\\frac\\alpha 2 + sin\\frac\\alpha 2 B",
    motors  : "e^{\\frac\\delta 2B} = 1 + \\frac\\delta 2B"
  },
           
  {
    description:"Sub-Algebras",
    text:md`<TABLE>
<TR><TD>Scalars<TD>1
<TR><TD>Complex numbers<TD>1,e<sub>12</sub>
<TR><TD>Hyperbolic numbers<TD>1,e<sub>1</sub> or 1,e<sub>2</sub>
<TR><TD>Dual numbers<TD>1,e<sub>0</sub> or 1,e<sub>01</sub>  or 1,e<sub>02</sub> or 1,e<sub>e012</sub>
<TR><TD>Even Sub-Algebra ${tex`\mathbb R^+_{2,0,1}`}<TD>1,e<sub>01</sub>, e<sub>02</sub>, e<sub>12</sub>
</TABLE>

2D PGA is the smallest Algebra to contain (as even sub-algebra) natural representations of all Euclidean distance preserving transformations SE(2), as well as natural representations of points, ideal points (free vectors) and lines.`
  },{ 
      description : "Matrices",
      text : md`\`\`\`javascript
var M = [[1e1,1e0],[0,1]];// 2x2 PGA matrix.
var V = [1,1e012];        // 1x2 PGA vector.
var R = M*V;              // matrix-vector product.
var N = M*M;              // matrix-matrix product.
var s = V*V;              // vector-vector dot product.
var O = !M;               // conjugate-transpose matrix.
\`\`\`
`
    },{
    description : "Graphing",
    text : md`SVG output is used for 2D PGA with support for points, lines, line segments, polygons, labels and colors.
${Algebra(2,0,1,()=>this.graph([1e12,"origin",0xff0000,1e1,"y",0x0000ff,1e2,"x"],{grid:1,width:window.innerWidth-100}))}
${md`
\`\`\`javascript
Algebra(2,0,1,()=>this.graph([1e12,"origin",0xff0000,1e1,"y",0x0000ff,1e2,"x"],{grid:1}));
\`\`\``}
`
    }]
})
)});
  main.variable(observer("PGAh2D")).define("PGAh2D", ["notTheThumb","quick_sheet","md","tex","Algebra"], function(notTheThumb,quick_sheet,md,tex,Algebra){return(
notTheThumb&&quick_sheet({
  title : "2D Elliptic Projective GA",
  titlesym : "",
  altname : "mv",
  sample  : "1e1+1e12+1e0+1e01",
 sig     : [3,0,0],
    evaluate : "1e2*1e12",

  cards : [{
    description : "Plane Based Geometry",
    origin  : "e_{12}",
    points  : "e_{12} + xe_{01} + ye_{02}",
    "ideal points"  : "xe_{01} + ye_{02}",
    lines   : "ae_1 + be_2 + ce_0",
    join    : "p_1 \\vee p_2",
    meet    : "l_1 \\wedge l_2",
    rotors  : "e^{\\frac\\alpha 2B} = cos\\frac\\alpha 2 + sin\\frac\\alpha 2 B",
    motors  : "e^{\\frac\\delta 2B} = 1 + \\frac\\delta 2B"
  },
  {
    description:"Sub-Algebras",
    text:md`<TABLE>
<TR><TD>Scalars<TD>1
<TR><TD>Complex numbers<TD>1,e<sub>12</sub> or 1,e<sub>13</sub> or 1,e<sub>23</sub> or 1,e<sub>123</sub>
<TR><TD>Hyperbolic numbers<TD>1,e<sub>1</sub> or 1,e<sub>2</sub> or 1,e<sub>3</sub>
<TR><TD>Quaternions ${tex`\mathbb R^+_{2,0,1}`}<TD>1,e<sub>12</sub>, e<sub>13</sub>, e<sub>23</sub>
</TABLE>

2D Hyperbolic PGA is the smallest Algebra for points, free vectors and lines in the Hyperbolic Plane. It has the quaternions as even sub-algebra.`
  },{ 
      description : "Matrices",
      text : md`\`\`\`javascript
var M = [[1e1,1e2],[0,1]];// 2x2 PGA matrix.
var V = [1,1e123];        // 1x2 PGA vector.
var R = M*V;              // matrix-vector product.
var N = M*M;              // matrix-matrix product.
var s = V*V;              // vector-vector dot product.
var O = !M;               // conjugate-transpose matrix.
\`\`\`
`
    },{
    description : "Graphing",
    text : md`SVG output is used for 2D Hyperbolic PGA with support for points, lines, line segments, polygons, labels and colors. Shown below are points on a hyperbolic grid.
${Algebra(3,()=>{
  var p = (x,y)=>1e23+x*1e12+y*1e13;
  var tr= (x,y)=>Math.E**(x*1.5e12+y*1.5e13);
  var pt=[...Array(10*10)].map((x,i)=>tr((i%10)/18-.25,((i/10)|0)/18-.25)>>>p(0,0));
  return (this.graph(pt,{width:window.innerWidth-100}))
})}
${md`
\`\`\`javascript
Algebra(3,()=>{
  var p = (x,y)=>1e23+x*1e12+y*1e13;
  var tr= (x,y)=>Math.E**(x*1.5e12+y*1.5e13);
  var pt=[...Array(10*10)].map((x,i)=>tr((i%10)/18-.25,((i/10)|0)/18-.25)>>>p(0,0));
  return (this.graph(pt))
})
\`\`\``}
`
    }]
})
)});
  main.variable(observer("PGAe2D")).define("PGAe2D", ["notTheThumb","quick_sheet","md","tex","Algebra"], function(notTheThumb,quick_sheet,md,tex,Algebra){return(
notTheThumb&&quick_sheet({
  title : "2D Hyperbolic Projective GA",
  titlesym : "",
  altname : "mv",
  sample  : "1e1+1e12+1e0+1e01",
  sig     : [2,1,0],  evaluate : "1e1*1e12",

  cards : [{
    description : "Plane Based Geometry",
    origin  : "e_{12}",
    points  : "e_{12} + xe_{01} + ye_{02}",
    "ideal points"  : "xe_{01} + ye_{02}",
    lines   : "ae_1 + be_2 + ce_0",
    join    : "p_1 \\vee p_2",
    meet    : "l_1 \\wedge l_2",
    rotors  : "e^{\\frac\\alpha 2B} = cos\\frac\\alpha 2 + sin\\frac\\alpha 2 B",
    motors  : "e^{\\frac\\delta 2B} = 1 + \\frac\\delta 2B"
  },
  {
    description:"Sub-Algebras",
    text:md`<TABLE>
<TR><TD>Scalars<TD>1
<TR><TD>Complex numbers<TD>1,e<sub>3</sub> or 1,e<sub>12</sub>
<TR><TD>Hyperbolic numbers<TD>1,e<sub>1</sub> or 1,e<sub>2</sub> or 1,e<sub>13</sub> or 1,e<sub>23</sub>  or 1,e<sub>123</sub>
<TR><TD>Even sub-algebra ${tex`\mathbb R^+_{2,1,0}`}<TD>1,e<sub>12</sub>, e<sub>13</sub>, e<sub>23</sub>
</TABLE>

2D Elliptic PGA is the smallest Algebra for points, free vectors and lines in the Elliptic Plane.`
  },{ 
      description : "Matrices",
      text : md`\`\`\`javascript
var M = [[1e1,1e2],[0,1]]; // 2x2 PGA matrix.
var V = [1,1e123];         // 1x2 PGA vector.
var R = M*V;               // matrix-vector product.
var N = M*M;               // matrix-matrix product.
var s = V*V;               // vector-vector dot product.
var O = !M;                // conjugate-transpose matrix
\`\`\`
`
    },{
    description : "Graphing",
    text : md`SVG output is used for 2D Hyperbolic PGA with support for points, lines, line segments, polygons, labels and colors. Shown below are points on an elliptic grid. (note that the ganja graph function expects the projective dimension first, so the equivalent 1,2 signature is used)
${Algebra(1,2,()=>{
  var p = (x,y)=>1e23+x*1e12+y*1e13;
  var tr= (x,y)=>Math.E**(x*2e12+y*2e13);
  var pt=[...Array(10*10)].map((x,i)=>tr((i%10)/18-.25,((i/10)|0)/18-.25)>>>p(0,0));
  return (this.graph(pt,{scale:2,width:window.innerWidth-100}))
})}
${md`
\`\`\`javascript
Algebra(1,2,()=>{
  var p = (x,y)=>1e23+x*1e12+y*1e13;
  var tr= (x,y)=>Math.E**(x*1.5e12+y*1.5e13);
  var pt=[...Array(10*10)].map((x,i)=>tr((i%10)/18-.25,((i/10)|0)/18-.25)>>>p(0,0));
  return this.graph(pt)
})
\`\`\``}
`
    }]
})
)});
  main.variable(observer()).define(["md"], function(md){return(
md`---
# 4 Dimensions`
)});
  main.variable(observer("R4")).define("R4", ["quick_sheet","md"], function(quick_sheet,md){return(
quick_sheet({
  title : "4D Vector Space",
  titlesym : "",
  altname : "vec",
  sample  : "1e1+1e2+1e3+1e4",
  sig     : [4,0,0],  evaluate : "1e1*1e12",

  cards : [{
    description:"Geometry",
    text:md`The natural embedding of one scalar, four vectors, six bivectors, six trivectors and one quadvector for the Graded Euclidean 4D Vector Space.`
  },
  {
    description:"Sub-Algebras",
    text:md`<TABLE>
<TR><TD>Scalars<TD>1
<TR><TD>Complex numbers<TD>1,e<sub>12</sub>..e<sub>234</sub>
<TR><TD>Hyperbolic numbers<TD>1,e<sub>1</sub>..e<sub>4</sub> or 1,e<sub>1234</sub>
<TR><TD>Quaternions<TD>1,e<sub>23</sub>, e<sub>24</sub>, e<sub>34</sub>
</TABLE>`
  },{ 
      description : "Matrices",
      text : md`\`\`\`javascript
var M = [[1e1+2e4,1e3],[0,1]];   // 2x2 matrix with euclidean 4D vector elements.
var V = [1,1e123];               // 1x2 vector with euclidean 4D vector elements.
var R = M*V;                     // matrix-vector product.
var N = M*M;                     // matrix-matrix product.
var s = V*V;                     // vector-vector dot product.
var O = !M;                      // conjugate-transpose matrix.
\`\`\`
`
    }
   ]
})
)});
  main.variable(observer("spacetime")).define("spacetime", ["quick_sheet","md","tex"], function(quick_sheet,md,tex){return(
quick_sheet({
  title : "Minkowski Spacetime",
  titlesym : "M",
  altname : "event",
  sample  : "1e1+1e2+1e3+1e4",
  sig     : [3,1,0],  evaluate : "1e1*1e12",

  cards : [{
    description:"Geometry",
    text:md`The natural space for spacetime events hosting 3 space-like vectors, 1 time like vector and the corresponding bivectors, trivectors and quadvector. Versors include Lorentz transforms.`
  },
  {
    description:"Sub-Algebras",
    text:md`<TABLE>
<TR><TD>Scalars<TD>1
<TR><TD>Complex numbers<TD>e.g. 1,e<sub>12</sub>
<TR><TD>Hyperbolic numbers<TD>e.g. 1,e<sub>14</sub>
<TR><TD>Even Sub-Algebra ${tex`\mathbb R^+_{4,0,0}`}<td>1,e<sub>12</sub>,e<sub>13</sub>,e<sub>14</sub>,e<sub>23</sub>,e<sub>24</sub>,e<sub>34</sub>,e<sub>1234</sub>
</TABLE>`
  },{ 
      description : "Matrices",
      text : md`\`\`\`javascript
var M = [[1e1+2e4,1e3],[0,1]];   // 2x2 matrix with spacetime events.
var V = [1,1e123];               // 1x2 vector with spacetime events.
var R = M*V;                     // matrix-vector product.
var N = M*M;                     // matrix-matrix product.
var s = V*V;                     // vector-vector dot product.
var O = !M;                      // conjugate-transpose matrix.
\`\`\`
`
    }
   ]
})
)});
  main.variable(observer("CGA2D")).define("CGA2D", ["notTheThumb","quick_sheet","md","tex","Algebra"], function(notTheThumb,quick_sheet,md,tex,Algebra){return(
notTheThumb&&quick_sheet({
  title : "2D Conformal GA",
  titlesym : "",
  altname : "mv",
  sample  : "1e1+1e2+1e3+1e4",
  sig     : [3,1,0],  evaluate : "1e1*1e12",

  cards : [{
    description : "Point Based Geometry",
    origin   : "e_o = e_4-e_3",
    infinity : "e_\\infty = \\frac 1 2 (e_4+e_3)",
    points  : "e_o + xe_1 + ye_2 + \\frac 1 2(x^2+y^2)e_\\infty",
    lines   : "!(ae_1 + be_2 + ce_\\infty)",
    circles : "p_1 - \\frac {r^2} 2 e_\\infty",
    join    : "p_1 \\wedge p_2",
    meet    : "l_1 \\vee l_2",
    rotors  : "e^{\\frac\\alpha 2B}",
    motors  : "e^{\\frac\\delta 2B}"
  },
  {
    description:"Sub-Algebras",
    text:md`<TABLE>
<TR><TD>Scalars<TD>1
<TR><TD>Complex numbers<TD>e.g. 1,e<sub>12</sub>
<TR><TD>Hyperbolic numbers<TD>e.g. 1,e<sub>14</sub>
<TR><TD>Even Sub-Algebra ${tex`\mathbb R^+_{4,0,0}`}<td>1,e<sub>12</sub>,e<sub>13</sub>,e<sub>14</sub>,e<sub>23</sub>,e<sub>24</sub>,e<sub>34</sub>,e<sub>1234</sub>
</TABLE>`
  },{
    description : "Graphing",
    text : md`SVG is used for 2D CGA with support for points, lines, circles, line segments, polygons, labels and colors.
${
Algebra(3,1,()=>{ 
  var ei = 1e4-1e3,         
      eo = 0.5*(1e4+1e3),
      point  = (x,y)=>eo + x*1e1 + y*1e2 + 0.5*(x*x+y*y)*ei,
      line   = (a,b,c)=>!(a*1e1 + b*1e2 + c*ei),
      circle = (x,y,r)=>!(point(x,y) - r**2/2*ei),
      p1 = point(-0.5, -0.5), p2 = point( 1, -0.5),  p3 = point(   0,  1.5),
      C = ()=>p1^p2^p3, D = circle(1,-1,0.9),
      X=line(0,1,0), Y=()=>p2^p3^ei,
      pp1=()=>X&C, pp2=()=>C&D, pp3=()=>Y&D, p4=()=>0.5*(eo<<(X&Y).Normalized)>>>ei;
  return (this.graph([
    "2D CGA - drag p1,p2,p3","",                  // title
    0xFF8888, C, "C", D, "D",                     // circles
    0x44AA44, X, "X", Y, "Y", p4,                 // lines
    0x4444FF, pp1, "pp1", pp2, "pp2", pp3, "pp3", // point pairs
    0x666666, p1, "p1", p2, "p2", p3, "p3",       // points
  ],{conformal:true,grid:true,width:window.innerWidth-100}));                 // conformal flag!  
})
  }
${md`
\`\`\`javascript
Algebra(3,1,()=>{ 
  var ei     = 1e4-1e3, 
      eo     = 0.5*(1e4+1e3),
      point  = (x,y)=>eo + x*1e1 + y*1e2 + 0.5*(x*x+y*y)*ei,
      line   = (a,b,c)=>!(a*1e1 + b*1e2 + c*ei),
      circle = (x,y,r)=>!(point(x,y) - r**2/2*ei),
      p1     = point(-0.5,-0.5), p2 = point(1,-0.5),  p3 = point(0,1.5),
      C      = ()=>p1^p2^p3, D = circle(1,-1,0.9),
      X      = line(0,1,0), Y=()=>p2^p3^ei,
      pp1    = ()=>X&C, pp2=()=>C&D, pp3=()=>Y&D, 
      p4     = ()=>0.5*(eo<<(X&Y).Normalized)>>>ei;
  return (this.graph([
    "2D CGA - drag p1,p2,p3","",                  // title
    0xFF8888, C, "C", D, "D",                     // circles
    0x44AA44, X, "X", Y, "Y", p4,                 // lines
    0x4444FF, pp1, "pp1", pp2, "pp2", pp3, "pp3", // point pairs
    0x666666, p1, "p1", p2, "p2", p3, "p3",       // points
  ],{conformal:true,grid:true,width:window.innerWidth-100}));                 // conformal flag!  
})
\`\`\``}
`
    }]  
})
)});
  main.variable(observer("PGAe3D")).define("PGAe3D", ["notTheThumb","quick_sheet","md","tex","Algebra"], function(notTheThumb,quick_sheet,md,tex,Algebra){return(
notTheThumb&&quick_sheet({
  title : "3D Hyperbolic Projective GA",
  titlesym : "",
  altname : "mv",
  sample  : "1e1+1e2+1e3+1e4",
  sig     : [3,1,0],  evaluate : "1e1*1e12",

  cards : [{
    description : "Plane Based Geometry",
    origin  : "e_{123}",
    points  : "e_{123} + xe_{012} + ye_{013} + ze_{023}",
    "ideal points"  : "xe_{012} + ye_{013} + ze_{023}",
    lines   : "p_1 \\vee p_2",
    planes  : "p_1 \\vee p_2 \\vee p_3",
    join    : "p_1 \\vee p_2",
    meet    : "l_1 \\wedge l_2",
    rotors  : "e^{\\frac\\alpha 2B}",
    motors  : "e^{\\frac\\delta 2B}"
  },
  {
    description:"Sub-Algebras",
    text:md`<TABLE>
<TR><TD>Scalars<TD>1
<TR><TD>Complex numbers<TD>e.g. 1,e<sub>12</sub>
<TR><TD>Hyperbolic numbers<TD>e.g. 1,e<sub>14</sub>
<TR><TD>Even Sub-Algebra ${tex`\mathbb R^+_{4,0,0}`}<td>1,e<sub>12</sub>,e<sub>13</sub>,e<sub>14</sub>,e<sub>23</sub>,e<sub>24</sub>,e<sub>34</sub>,e<sub>1234</sub>
</TABLE>`
  },{ 
      description : "Matrices",
      text : md`\`\`\`javascript
var M = [[1e1,1e2],[0,1]];   // 2x2 PGA matrix.
var V = [1,1e123];           // 1x2 PGA vector.
var R = M*V;                 // matrix-vector product.
var N = M*M;                 // matrix-matrix product.
var s = V*V;                 // vector-vector dot product.
var O = !M;                  // conjugate-transpose matrix.
\`\`\`
`
    },{
    description : "Graphing",
    text : md`SVG and webGL output can be used for 3D PGA with support for points, lines, line segments, polygons, labels and colors. Shown below is a elliptic screw motion.
${
Algebra(1,3,()=>{ 
  var bv = 1e13+1e24, screw=[];
  for (var j=0; j<20; j++)
  screw = screw.concat(
    [...Array(60)]                                                            
      .map((x,i)=>Math.E**((i/16-1.8)*bv)>>>                                   
                  (Math.cos(j/20*Math.PI)+Math.sin(j/20*Math.PI)*1e13)>>>     
                  (!(1e1+1e2)))                                               
      .map((x,i,a)=>[x,i?a[i-1]:x])                                           
  );
  return this.graph(screw,{grid:1,width:window.innerWidth-100});
}) 
 }
${md`
\`\`\`javascript
Algebra(1,3,()=>{ 
  var bv = 1e13+1e24, screw=[];
  for (var j=0; j<20; j++)
  screw = screw.concat(
    [...Array(60)]                                                            
      .map((x,i)=>Math.E**((i/16-1.8)*bv)>>>                                   
                  (Math.cos(j/20*Math.PI)+Math.sin(j/20*Math.PI)*1e13)>>>     
                  (!(1e1+1e2)))                                               
      .map((x,i,a)=>[x,i?a[i-1]:x])                                           
  );
  return this.graph(screw,{grid:1,width:window.innerWidth-100});
}) 
\`\`\``}
`
    }]
})
)});
  main.variable(observer("PGAh3D")).define("PGAh3D", ["notTheThumb","quick_sheet","md","Algebra"], function(notTheThumb,quick_sheet,md,Algebra){return(
notTheThumb&&quick_sheet({
  title : "3D Elliptic Projective GA",
  titlesym : "",
  altname : "mv",
  sample  : "1e1+1e2+1e3+1e4",
  sig     : [4,0,0],  evaluate : "1e1*1e12",

  cards : [{
    description : "Plane Based Geometry",
    origin  : "e_{123}",
    points  : "e_{123} + xe_{012} + ye_{013} + ze_{023}",
    "ideal points"  : "xe_{012} + ye_{013} + ze_{023}",
    lines   : "p_1 \\vee p_2",
    planes  : "p_1 \\vee p_2 \\vee p_3",
    join    : "p_1 \\vee p_2",
    meet    : "l_1 \\wedge l_2",
    rotors  : "e^{\\frac\\alpha 2B}",
    motors  : "e^{\\frac\\delta 2B}"
  },{
    description:"Sub-Algebras",
    text:md`<TABLE>
<TR><TD>Scalars<TD>1
<TR><TD>Complex numbers<TD>1,e<sub>12</sub>..e<sub>234</sub>
<TR><TD>Hyperbolic numbers<TD>1,e<sub>1</sub>..e<sub>4</sub> or 1,e<sub>1234</sub>
<TR><TD>Quaternions<TD>1,e<sub>23</sub>, e<sub>24</sub>, e<sub>34</sub>
</TABLE>`
  },{ 
      description : "Matrices",
      text : md`\`\`\`javascript
var M = [[1e1,1e2],[0,1]];   // 2x2 PGA matrix.
var V = [1,1e123];           // 1x2 PGA vector.
var R = M*V;                 // matrix-vector product.
var N = M*M;                 // matrix-matrix product.
var s = V*V;                 // vector-vector dot product.
var O = !M;                  // conjugate-transpose matrix.
\`\`\`
`
    },{
    description : "Graphing",
    text : md`SVG and webGL output can be used for 3D PGA with support for points, lines, line segments, polygons, labels and colors. Shown below is a hyperbolic screw motion.
${
Algebra(4,()=>{ 
  var bv = 1e13+1e24, screw=[];
  for (var j=0; j<20; j++)
  screw = screw.concat(
    [...Array(40)]                                                            
      .map((x,i)=>Math.E**((i/16-1.2)*bv)>>>                                   
                  (Math.cos(j/20*Math.PI)+Math.sin(j/20*Math.PI)*1e13)>>>     
                  (!(1e1+1e2)))                                               
      .map((x,i,a)=>[x,i?a[i-1]:x])                                           
  );
  return this.graph(screw,{grid:1,width:window.innerWidth-100});
}) 
 }
${md`
\`\`\`javascript
Algebra(4,()=>{ 
  var bv = 1e13+1e24, screw=[];
  for (var j=0; j<20; j++)
  screw = screw.concat(
    [...Array(40)]                                                            
      .map((x,i)=>Math.E**((i/16-1.2)*bv)>>>                                   
                  (Math.cos(j/20*Math.PI)+Math.sin(j/20*Math.PI)*1e13)>>>     
                  (!(1e1+1e2)))                                               
      .map((x,i,a)=>[x,i?a[i-1]:x])                                           
  );
  return this.graph(screw,{grid:true});
});
\`\`\``}
`
    }]
})
)});
  main.variable(observer("PGA3D")).define("PGA3D", ["notTheThumb","quick_sheet","md","Algebra"], function(notTheThumb,quick_sheet,md,Algebra){return(
notTheThumb&&quick_sheet({
  title : "3D Euclidean Projective GA",
  titlesym : "",
  altname : "mv",
  sample  : "1e0+1e1+1e2+1e3",
  sig     : [3,0,1],  evaluate : "1e1*1e12",

  cards : [{
    description : "Plane Based Geometry",
    origin  : "e_{123}",
    points  : "e_{123} + xe_{012} + ye_{013} + ze_{023}",
    "ideal points"  : "xe_{012} + ye_{013} + ze_{023}",
    lines   : "p_1 \\vee p_2",
    planes  : "p_1 \\vee p_2 \\vee p_3",
    join    : "p_1 \\vee p_2",
    meet    : "l_1 \\wedge l_2",
    rotors  : "e^{\\frac\\alpha 2B}",
    motors  : "e^{\\frac\\delta 2B}"
  },{
    description:"Sub-Algebras",
    text:md`<TABLE>
<TR><TD>Scalars<TD>1
<TR><TD>Complex numbers<TD>e.g. 1,e<sub>12</sub>
<TR><TD>Hyperbolic numbers<TD>e.g. 1,e<sub>1</sub>
<TR><TD>Dual numbers<TD>e.g. 1,e<sub>0</sub>
<TR><TD>Quaternions<TD>1,e<sub>12</sub>, e<sub>13</sub>, e<sub>23</sub>
<TR><TD>Dual Quaternions<TD>1,e<sub>01</sub>, e<sub>02</sub>, e<sub>03</sub>,e<sub>12</sub>, e<sub>13</sub>, e<sub>23</sub>, e<sub>0123</sub>
</TABLE>
`
  },{ 
      description : "Matrices",
      text : md`\`\`\`javascript
var M = [[1e1,1e2],[0,1]];   // 2x2 PGA matrix.
var V = [1,1e123];           // 1x2 PGA vector.
var R = M*V;                 // matrix-vector product.
var N = M*M;                 // matrix-matrix product.
var s = V*V;                 // vector-vector dot product.
var O = !M;                  // conjugate-transpose matrix.
\`\`\`
`
    },{
    description : "Graphing",
    text : md`SVG and webGL output can be used for 3D PGA with support for points, lines, line segments, polygons, labels and colors. Shown below is a euclidean screw motion.
${
Algebra(3,0,1,()=>{ 
  var bv = 1e02+1e13, screw=[];
  for (var j=0; j<10; j++)
  screw = screw.concat(
    [...Array(40)]                                                            
      .map((x,i)=>Math.E**((i/16-1.2)*bv)*                                   
                  (Math.cos(j/10*Math.PI)+Math.sin(j/10*Math.PI)*1e13)>>>     
                  (!(1e0+1e1)))                                               
      .map((x,i,a)=>[x,i?a[i-1]:x])                                           
  );
  return this.graph(screw,{grid:1,width:window.innerWidth-100});
}) 
 }
${md`
\`\`\`javascript
Algebra(3,0,1,()=>{ 
  var bv = 1e02+1e13, screw=[];
  for (var j=0; j<10; j++)
  screw = screw.concat(
    [...Array(40)]                                                            
      .map((x,i)=>Math.E**((i/16-1.2)*bv)>>>                                   
                  (Math.cos(j/10*Math.PI)+Math.sin(j/10*Math.PI)*1e13)>>>     
                  (!(1e0+1e1)))                                               
      .map((x,i,a)=>[x,i?a[i-1]:x])                                           
  );
  return this.graph(screw);
});
\`\`\``}
`
    }]  
})
)});
  main.variable(observer()).define(["md"], function(md){return(
md`---
# 5 Dimensions`
)});
  main.variable(observer("R5")).define("R5", ["quick_sheet"], function(quick_sheet){return(
quick_sheet({
  title : "5D Vector Space",
  titlesym : "",
  altname : "vec",
  sample  : "1e1+1e2+1e3+1e4+1e5",  evaluate : "1e1*1e12",

  sig     : [5,0,0]
})
)});
  main.variable(observer("CGA3D")).define("CGA3D", ["notTheThumb","quick_sheet","md","Algebra"], function(notTheThumb,quick_sheet,md,Algebra){return(
notTheThumb&&quick_sheet({
  title : "3D Conformal GA",
  titlesym : "",
  altname : "vec",
  sample  : "1e1+1e2+1e3+1e4+1e5",
  sig     : [4,1,0],  evaluate : "1e1*1e12",

  cards : [{
    description : "Point Based Geometry",
    origin   : "e_o = e_5-e_4",
    infinity : "e_\\infty = \\frac 1 2 (e_5+e_4)",
    points  : "e_o + xe_1 + ye_2 + ze_3 + \\frac 1 2(x^2+y^2+z^2)e_\\infty",
    circles : "p_1 \\wedge p_2 \\wedge p_3",
    lines   : "p_1 \\wedge p_2 \\wedge e_\\infty",
    spheres : "p_1 \\wedge p_2 \\wedge p_3 \\wedge p_4",
    planes  : "p_1 \\wedge p_2 \\wedge p_3 \\wedge e_\\infty",
    join    : "p_1 \\wedge p_2",
    meet    : "l_1 \\vee l_2",
    rotors  : "e^{\\frac\\alpha 2B}",
    motors  : "e^{\\frac\\delta 2B}"
  },{
    description : "Graphing",
    text : md`webGL is used for 3D CGA with support for points, point-pairs, lines, circles, planes, spheres, line segments, polygons, labels and colors.
${
Algebra(4,1,()=>{

// We start by defining a null basis, and upcasting for points
  var ni = 1e4+1e5, no = .5e5-.5e4, nino = ni^no;
  var up = (x)=> no + x + .5*x*x*ni;

// Next we'll define some objects.
  var p  = up(0),                          // point
      S  = ()=>!(p-.5*ni),                 // main dual sphere around point (interactive)
      S2 = !(up(-1.4e1)-0.125*ni),         // left dual sphere
      C  = !(up(1.4e1)-.125*ni)&!(1e3),    // right circle
      L  = up(.9e2)^up(.9e2-1e1)^ni,       // top line
      P  = !(1e2-.9*ni),                   // bottom dual plane
      P2 = !(1e1+1.7*ni);                   // right dual plane

// The intersections of the big sphere with the other 4 objects.
  var C1 = ()=>S&P, C2 = ()=>S&L, C3 = ()=>S&S2, C4 = ()=>S&C, C5 = ()=>C&P2;
  
// For line meet plane its a bit more involved.
  var lp = up(nino<<(P2&L^no));

// Graph the items. (hex numbers are html5 colors, two extra first bytes = alpha)
  return (this.graph([ 
      0x00FF0000, p, "s1",             // point 
      0xFF00FF,lp,"l&p",               // line intersect plane
      0x0000FF,C1,"s&p",               // sphere meet plane
      0x888800,C2,"s&l",               // sphere meet line
      0x0088FF,C3,"s&s",               // sphere meet sphere
      0x008800,C4,"s&c",               // sphere meet circle
      0x880000,C5,"c&p",               // circle meet sphere
      0,L,0,C,                         // line and circle
      0xE0008800, P, P2,               // plane
      0xE0FFFFFF, S, "s1", S2          // spheres
  ],{conformal:true,width:'100%',height:'500px',gl:true}));
})
  }
${md`
\`\`\`javascript
Algebra(4,1,()=>{

// We start by defining a null basis, and upcasting for points
  var ni = 1e4+1e5, no = .5e5-.5e4, nino = ni^no;
  var up = (x)=> no + x + .5*x*x*ni;

// Next we'll define some objects.
  var p  = up(0),                          // point
      S  = ()=>!(p-.5*ni),                 // main dual sphere around point (interactive)
      S2 = !(up(-1.4e1)-0.125*ni),         // left dual sphere
      C  = !(up(1.4e1)-.125*ni)&!(1e3),    // right circle
      L  = up(.9e2)^up(.9e2-1e1)^ni,       // top line
      P  = !(1e2-.9*ni),                   // bottom dual plane
      P2 = !(1e1+1.7*ni);                   // right dual plane

// The intersections of the big sphere with the other 4 objects.
  var C1 = ()=>S&P, C2 = ()=>S&L, C3 = ()=>S&S2, C4 = ()=>S&C, C5 = ()=>C&P2;
  
// For line meet plane its a bit more involved.
  var lp = up(nino<<(P2&L^no));

// Graph the items. (hex numbers are html5 colors, two extra first bytes = alpha)
  document.body.appendChild(this.graph([ 
      0x00FF0000, p, "s1",             // point 
      0xFF00FF,lp,"l&p",               // line intersect plane
      0x0000FF,C1,"s&p",               // sphere meet plane
      0x888800,C2,"s&l",               // sphere meet line
      0x0088FF,C3,"s&s",               // sphere meet sphere
      0x008800,C4,"s&c",               // sphere meet circle
      0x880000,C5,"c&p",               // circle meet sphere
      0,L,0,C,                         // line and circle
      0xE0008800, P, P2,               // plane
      0xE0FFFFFF, S, "s1", S2          // spheres
  ],{conformal:true,gl:true}));
});
\`\`\``}
`
    }]  
})
)});
  main.variable(observer()).define(["md"], function(md){return(
md`---
# 8 Dimensions`
)});
  main.variable(observer("MA")).define("MA", ["notTheThumb","quick_sheet","md","tex","Algebra"], function(notTheThumb,quick_sheet,md,tex,Algebra){return(
notTheThumb&&quick_sheet({
  title : "Mother Algebra",
  titlesym : "", 
  altname : "vec",
  sample  : "1e1+1e2+1e3+1e4+1e5", // evaluate : "1e1*1e12",
  sig     : [4,4,0],
  cards : [{
    description : "Witt Basis",
    text : md`The Witt Basis used for ${tex`\mathbb R_{4,4}`} GA is fully degenerate, and provides a homogenous projective system for both point and plane based approaches.
    <TABLE>
    <TR><TD>${tex`w_0 = \frac 1 2 (e_1+e_5)`} <TD>${tex`\overline {w_0} = \frac 1 2 (e_1-e_5)`}
    <TR><TD>${tex`w_1 = \frac 1 2 (e_2+e_6)`} <TD>${tex`\overline {w_1} = \frac 1 2 (e_2-e_6)`}
    <TR><TD>${tex`w_2 = \frac 1 2 (e_3+e_7)`} <TD>${tex`\overline {w_2} = \frac 1 2 (e_3-e_7)`}
    <TR><TD>${tex`w_3 = \frac 1 2 (e_4+e_8)`} <TD>${tex`\overline {w_3} = \frac 1 2 (e_4-e_8)`}
    </TABLE>
    `
  },{
    description : "Point and Plane Based Geometry",
    origin   : "e_o = w_0",
    points  : "w_0 + xw_1 + yw_2 + zw_3",
    lines   : "p_1 \\wedge p_2",
    planes  : "p_1 \\wedge p_2 \\wedge p_3",
    sectors : "p_1 \\wedge p_2 \\wedge p_3 \\wedge p_4",
    join    : "p_1 \\wedge p_2",
    meet    : "l_1 \\vee l_2",
  },{
    description : "Graphing",
    text : md`webGL2 is used for the mother algebra - directly rendering the OPNS space using raytracing on the GPU.
${
Algebra(4,4,()=>{ 
  var w0  = .5e1+.5e5, w1  = .5e2+.5e6, w2  = .5e3+.5e7, w3  = .5e4+.5e8, 
      wd0 = .5e1-.5e5, wd1 = .5e2-.5e6, wd2 = .5e3-.5e7, wd3 = .5e4-.5e8;
  var vec = (x,y,z)=>x*w1+y*w2+z*w3,
      pnt = (x,y,z)=>w0+vec(x,y,z);
  var pnt_opns = [".5",".5*x",".5*y",".5*z",".5",".5*x",".5*y",".5*z"];
  var options={width:'100%',height:'600px',thresh:0.05,up:pnt_opns}, c= (this.graph([
    0x00ff00, 1e1234*pnt(0,0,0),
    0xff0000, 1e1234*(pnt(-2,0,0)^pnt(1,1,1)),
  ],options))
  c.onmouseenter=(e)=>{ options.animate=true; c.update(c.value); };
  c.onmouseleave=(e)=>{options.animate=false; }
  return c;

})
  }
${md`
\`\`\`javascript
Algebra(4,4,()=>{ 
  var w0  = .5e1+.5e5, w1  = .5e2+.5e6, w2  = .5e3+.5e7, w3  = .5e4+.5e8, 
      wd0 = .5e1-.5e5, wd1 = .5e2-.5e6, wd2 = .5e3-.5e7, wd3 = .5e4-.5e8;
  var vec = (x,y,z)=>x*w1+y*w2+z*w3,
      pnt = (x,y,z)=>w0+vec(x,y,z);
  var pnt_opns = [".5",".5*x",".5*y",".5*z",".5",".5*x",".5*y",".5*z"];
  return (this.graph([
    0x00ff00, 1e1234*pnt(0,0,0),
    0xff0000, 1e1234*(pnt(-2,0,0)^pnt(1,1,1)),
  ],{tresh:0.15,up:pnt_opns}))
})
\`\`\``}`}]
})
)});
  main.variable(observer()).define(["md"], function(md){return(
md`---
# 9 Dimensions`
)});
  main.variable(observer("CCGA")).define("CCGA", ["notTheThumb","quick_sheet","md","Algebra"], function(notTheThumb,quick_sheet,md,Algebra){return(
notTheThumb&&quick_sheet({
  title : "Colored Conformal GA",
  titlesym : "", 
  altname : "vec",
  sample  : "1e1+1e2+1e3+1e4+1e5", // evaluate : "1e1*1e12",
  sig     : [6,3,0],
  cards : [{
    description : "Graphing",
    text : md`webGL2 is used for the CCGA - directly rendering the OPNS space using raytracing on the GPU.
${
Algebra(6,3,()=>{ 
  var eix = 1e4+1e7,   eiy = 1e5+1e8,   eiz = 1e6+1e9;
  var eox = .5e7-.5e4, eoy = .5e8-.5e5, eoz = .5e9-.5e6;
  var ei = (eix+eiy+eiz)*(1/3), eo = eox+eoy+eoz, pss = 1e123456789;
  var pointv = [1e1,1e2,1e3,eix,eiy,eiz,eo],
      point  = (x,y,z)=>[x,y,z,.5*x**2,.5*y**2,.5*z**2,1]*pointv,
      ellipsoidv = [1e1,1e2,1e3,ei,eox,eoy,eoz],
      ellipsoid = (h,k,l,a,b,c)=>[h*a**-2,k*b**-2,l*c**-2,
                                  .5*(h**2*a**-2+k**2*b**-2+l**2*c**-2-1),
                                  a**-2,b**-2,c**-2]*ellipsoidv,
      plane = (x,y,z,d)=>x*1e1+y*1e2+z*1e3+d*ei;
  var upviz = ["x","y","z",".5*x*x-.5",".5*y*y-.5",".5*z*z-.5",".5*x*x+.5",".5*y*y+.5",".5*z*z+.5"];    
  var E = ellipsoid(0,0,0,2,3,2),
      P = plane(0.9,0.3,0.0,0.0),
      e = (E^P).Normalized;
  var options = {up:upviz, width:'100%',height:'600px'}
  var c=(this.graph([
    0xff8800, pss*E,
    0x0088ff, pss*e
  ],options));    
  c.onmouseenter=(e)=>{ options.animate=true; c.update(c.value); };
  c.onmouseleave=(e)=>{options.animate=false; }
  return c;
})
  }
${md`
\`\`\`javascript
Algebra(6,3,()=>{ 
  var eix = 1e4+1e7,   eiy = 1e5+1e8,   eiz = 1e6+1e9;
  var eox = .5e7-.5e4, eoy = .5e8-.5e5, eoz = .5e9-.5e6;
  var ei = (eix+eiy+eiz)*(1/3), eo = eox+eoy+eoz, pss = 1e123456789;
  var pointv = [1e1,1e2,1e3,eix,eiy,eiz,eo],
      point  = (x,y,z)=>[x,y,z,.5*x**2,.5*y**2,.5*z**2,1]*pointv,
      ellipsoidv = [1e1,1e2,1e3,ei,eox,eoy,eoz],
      ellipsoid = (h,k,l,a,b,c)=>[h*a**-2,k*b**-2,l*c**-2,
                                  .5*(h**2*a**-2+k**2*b**-2+l**2*c**-2-1),
                                  a**-2,b**-2,c**-2]*ellipsoidv,
      plane = (x,y,z,d)=>x*1e1+y*1e2+z*1e3+d*ei;
  var upviz = ["x","y","z",".5*x*x-.5",".5*y*y-.5",".5*z*z-.5",
                           ".5*x*x+.5",".5*y*y+.5",".5*z*z+.5"];    
  var E = ellipsoid(0,0,0,2,3,2),
      P = plane(0.9,0.3,0.0,0.0),
      e = (E^P).Normalized;
  return (this.graph([
    0xff8800, pss*E,
    0x0088ff, pss*e
  ],{up:upviz}));    
})
\`\`\``}`}]
})
)});
  main.variable(observer()).define(["md"], function(md){return(
md`---
# 10 Dimensions`
)});
  main.variable(observer("DCGA")).define("DCGA", ["notTheThumb","quick_sheet"], function(notTheThumb,quick_sheet){return(
notTheThumb&&quick_sheet({
  title : "Double Conformal GA",
  titlesym : "", 
  altname : "vec",
  sample  : "1e1+1e2+1e3+1e4+1e5", // evaluate : "1e1*1e12",

  sig     : [8,2,0]
})
)});
  main.variable(observer()).define(["md"], function(md){return(
md`---
# 15 Dimensions`
)});
  main.variable(observer("QCGA")).define("QCGA", ["notTheThumb","quick_sheet","md","Algebra"], function(notTheThumb,quick_sheet,md,Algebra){return(
notTheThumb&&quick_sheet({
  title : "Quadric Conformal GA",
  titlesym : "", 
  altname : "vec",
  sample  : "1e1+1e2+1e3+1e4+1e5", // evaluate : "1e1*1e12",

  sig     : [9,6,0],
  cards : [{
    description : "Graphing",
    text : md`webGL2 is used for QCGA - directly rendering the OPNS space using raytracing on the GPU. Below is a general quadric surface, and its intersection with another (non-drawn) quadric surface.
${
Algebra(9,6,()=>{ 
    var ei1=1e04+1e10,   ei2=1e05+1e11,   ei3=1e06+1e12,   ei4=1e07+1e13,   ei5=1e08+1e14,   ei6=1e09+1e15,
        eo1=.5e10-.5e04, eo2=.5e11-.5e05, eo3=.5e12-.5e06, eo4=.5e13-.5e07, eo5=.5e14-.5e08, eo6=.5e15-.5e09;
    var Ii  = ei1^ei2^ei3^ei4^ei5^ei6,          Io   = eo1^eo2^eo3^eo4^eo5^eo6,
        pIi = (ei1-ei2)^(ei2-ei3)^ei4^ei5^ei6,  pIo  = (eo1-eo2)^(eo2-eo3)^eo4^eo5^eo6,
        PSS = 1e010203040506070809101112131415, PSSe = 1e010203, PSSi = -PSS;
    var pv = [1e01,1e02,1e03,ei1,ei2,ei3,ei4,ei5,ei6,eo1+eo2+eo3],
        p  = (x,y,z)=> [x,y,z,.5*x**2,.5*y**2,.5*z**2,x*y,x*z,y*z,1]*pv;          
    var pviz = ["x","y","z",".5*x*x-.5",".5*y*y-.5",".5*z*z-.5","x*y","x*z","y*z",
                            ".5*x*x+.5",".5*y*y+.5",".5*z*z+.5","x*y","x*z","y*z"]
    var p1=p(0,1,0), p2=p(0,-1,0), p3=p(1,0,0), p4=p(0,0,1);
    var q1=p(0,1.5+.35,.5), q2=p(0,-.5+.35,.5), q3=p(1.3,.5+.35,.5), q4=p(0,.5+.35,1.6);
    var sphere = (p1^p2^p3^p4^pIi^pIo).Normalized, sphere2 = (q1^q2^q3^q4^pIi^pIo).Normalized;
    sphere[14][10]*=.2; sphere[14][11]*=6; sphere = sphere.Normalized;
    sphere2[14][12]*=.4; sphere2[14][10]*=8; sphere2 = sphere2.Normalized;
    var options = {width:'100%',height:'600px',up:pviz};
    var c= (this.graph(()=>{
      var s = 0+sphere, s2 = 0+sphere2;                    // copy originals
      s[14][4]+=0.2*Math.sin(performance.now()/1000);      // animate
      s[14][10]+=0.1+Math.sin(performance.now()/1491);
      s2[14][11]+=0.5*Math.sin(performance.now()/790);
      s2[14][13]+=Math.sin(performance.now()/1300);
      var c = (s&s2).Normalized;                           // intersect
      return [0x8800ff,s,0xff8800,c]                       // render
    },options))
    
    c.onmouseenter=(e)=>{ options.animate = true; c.update(c.value); }
    c.onmouseleave=(e)=>{ options.animate = false; }
    
    return c;
})
  }
${md`
\`\`\`javascript
Algebra(9,6,()=>{ 
    var ei1=1e04+1e10,   ei2=1e05+1e11,   ei3=1e06+1e12,   ei4=1e07+1e13,   ei5=1e08+1e14,   ei6=1e09+1e15,
        eo1=.5e10-.5e04, eo2=.5e11-.5e05, eo3=.5e12-.5e06, eo4=.5e13-.5e07, eo5=.5e14-.5e08, eo6=.5e15-.5e09;
    var Ii  = ei1^ei2^ei3^ei4^ei5^ei6,          Io   = eo1^eo2^eo3^eo4^eo5^eo6,
        pIi = (ei1-ei2)^(ei2-ei3)^ei4^ei5^ei6,  pIo  = (eo1-eo2)^(eo2-eo3)^eo4^eo5^eo6,
        PSS = 1e010203040506070809101112131415, PSSe = 1e010203, PSSi = -PSS;
    var pv = [1e01,1e02,1e03,ei1,ei2,ei3,ei4,ei5,ei6,eo1+eo2+eo3],
        p  = (x,y,z)=> [x,y,z,.5*x**2,.5*y**2,.5*z**2,x*y,x*z,y*z,1]*pv;          
    var pviz = ["x","y","z",".5*x*x-.5",".5*y*y-.5",".5*z*z-.5","x*y","x*z","y*z",
                            ".5*x*x+.5",".5*y*y+.5",".5*z*z+.5","x*y","x*z","y*z"]
    var p1=p(0,1,0), p2=p(0,-1,0), p3=p(1,0,0), p4=p(0,0,1);
    var q1=p(0,1.5+.35,.5), q2=p(0,-.5+.35,.5), q3=p(1.3,.5+.35,.5), q4=p(0,.5+.35,1.6);
    var sphere = (p1^p2^p3^p4^pIi^pIo).Normalized, sphere2 = (q1^q2^q3^q4^pIi^pIo).Normalized;
    sphere[14][10]*=.2; sphere[14][11]*=6; sphere = sphere.Normalized;
    sphere2[14][12]*=.4; sphere2[14][10]*=8; sphere2 = sphere2.Normalized;
    return (this.graph(()=>{
      var s = 0+sphere, s2 = 0+sphere2;                    // copy originals
      s[14][4]+=0.2*Math.sin(performance.now()/1000);      // animate
      s[14][10]+=0.1+Math.sin(performance.now()/1491);
      s2[14][11]+=0.5*Math.sin(performance.now()/790);
      s2[14][13]+=Math.sin(performance.now()/1300);
      var c = (s&s2).Normalized;                           // intersect
      return [0x8800ff,s,0xff8800,c]                       // render
    },{up:pviz}))
})
\`\`\``}`}]
})
)});
  main.variable(observer("Algebra")).define("Algebra", ["require"], function(require){return(
require('ganja.js@latest')
)});
  main.variable(observer("quick_sheet")).define("quick_sheet", ["Algebra","md","tex","html"], function(Algebra,md,tex,html){return(
(data)=>{
   
  var al = Algebra(data.sig[0],data.sig[1],data.sig[2]);
   var len = data.sig[0]+data.sig[1]+data.sig[2];
  if (len > 6) debugger
   var a=al.describe();
  
   if (len<6) {
  var A=new al(), B=new al();
   for (var i=0; i<A.length; i++) {A[i]=i+1; B[i]=i+1+A.length; }
   var AS = len>2?"A":("("+A+")").replace(/_(\d+)/g,"_{$1}");
   var BS = len>2?"B":("("+B+")").replace(/_(\d+)/g,"_{$1}");
  var evalex = (x)=>{
    try {
      return al.inline(new Function("return "+x))().toString().replace(/_(\d+)/g,"_{$1}"); 
    } catch (e) {
      return e.message;
    }
  }
   var updateex = (x,el)=>{
     while (el.firstChild) el.removeChild(el.firstChild);
     el.appendChild(md`= ${tex`${evalex(x)}`}`)
   }}
  console.log('here');
   return Object.assign(md`# ${data.title} ${tex`\mathbb {${data.titlesym}} \cong \mathbb{R}_{${data.sig}}`}
  <DIV CLASS="box">
    <DIV CLASS="title">create</DIV>
${md`\`\`\`javascript
var ${data.titlesym||"A"} = Algebra(${data.sig.join(',')});
var ${data.altname||"x"} = Algebra(${data.sig.join(',')},()=>${data.sample});
\`\`\``}
  </DIV>
  <DIV CLASS="box">
    <DIV CLASS="title">basis and metric</DIV>
    <TABLE>
      <TR>${(len<6?a.basis:a.basis[1]).map(x=>"<TD STYLE='background:"+["#EEE","#F4FFF4","#FFF4F4","#F4F4FF","#FFFFe4","#FFe4FF","#e4e4FF"][(""+x).replace('-','').length]+"'>"+(""+x).replace(/e(\d+)/,"e<SUB>$1</SUB>")).join('')}
      <TR>${(len<6?a.metric:a.metric[1]).map((x,i)=>("<TD STYLE='background:"+["#EEE","#F4FFF4","#FFF4F4","#F4F4FF","#FFFFF4","#FFF4FF","#F4F4FF"][(""+(len<6?a.basis:a.basis[1])[i]).replace('-','').length]+"'>")+((x==1)?"+1":x)).join('')}
    </TABLE>
  </DIV>
${a.mulTable&&md`
  <DIV CLASS="box">
    <DIV CLASS="title">Cayley Table</DIV>
    <TABLE STYLE="font-size:${a.basis.length>16?50:70}%"><TR>
       ${a.mulTable.map(x=>x.map(x=>'<TD STYLE="background:'+["#EEE","#F4FFF4","#FFF4F4","#F4F4FF","#FFFFe4","#FFe4FF","#e4e4FF"][(""+x).replace('-','').length]+'">'+x.replace(/e(\d+)/,"e<SUB>$1</SUB>")).join('')).join('<TR>')}
    </TABLE>
  </DIV>`||""}
${data.cards&&data.cards.map(x=>md`
 <DIV CLASS="box">
    <DIV CLASS="title">${x.description}</DIV>
    ${
Object.keys(x).length>2?                 
html`<TABLE>${Object.keys(x).slice(1).map((y,i)=>html`<TR><TD>${y}<TD>${tex`${x[y]}`}`)}</TABLE>`
:md`${x.text}`}
 </DIV>
`)||""}
${len in{"1":1,"2":1,"3":1}&&md`
 <DIV CLASS="box" STYLE="min-width:90%; box-sizing:border-box">
    <DIV CLASS="title">Operators</DIV>
    <TABLE>
      ${len>2?"<TR><TD>&nbsp;<TD>A<TD>":""}${len>2?md`${tex`${("("+A+")").replace(/_(\d+)/g,"_{$1}")}`}`:""}
      ${len>2?"<TR><TD>&nbsp;<TD>B<TD>":""}${len>2?md`${tex`${("("+B+")").replace(/_(\d+)/g,"_{$1}")}`}`:""}
      <TR><TD>Addition<TD>+<TD>${tex`${AS}+${BS}=${(""+A.Add(B)).replace(/_(\d+)/g,"_{$1}")}`}
      <TR><TD>Subtraction<TD>-<TD>${tex`${AS}-${BS}=${(""+A.Sub(B)).replace(/_(\d+)/g,"_{$1}")}`}
      <TR><TD>Geometric Product<TD>*<TD>${tex`${AS}*${BS}=${(""+A.Mul(B)).replace(/_(\d+)/g,"_{$1}")}`}
      <TR><TD>Outer Product<TD>^<TD>${tex`${AS} \wedge ${BS}=${(""+A.Wedge(B)).replace(/_(\d+)/g,"_{$1}")}`}
      <TR><TD>Left Contraction<TD>&lt;&lt;<TD>${tex`${AS}\cdot ${BS}=${(""+A.Dot(B)).replace(/_(\d+)/g,"_{$1}")}`}
      <TR><TD>Regressive Product<TD>&<TD>${tex`${AS} \vee ${BS}=${(""+A.Vee(B)).replace(/_(\d+)/g,"_{$1}")}`}
      <TR><TD>Conjugation<TD>~<TD>${tex`\overline{${AS}} =${(""+A.Conjugate).replace(/_(\d+)/g,"_{$1}")}`}
      <TR><TD>Dual<TD>!<TD>${tex`!{${AS}} =${(""+A.Dual).replace(/_(\d+)/g,"_{$1}")}`}
    </TABLE>
  </DIV>
`||""}
${data.evaluate&&((()=>{ var r=md`
  <DIV CLASS="box">
    <DIV CLASS="title">Expression Evaluator</DIV>
    <INPUT TYPE="text" VALUE="${data.evaluate}"></INPUT>
    <DIV CLASS="out">= ${tex`${evalex(data.evaluate)}`}</DIV>
  </DIV>
`; 
                        
  var i = r.querySelector('input');
  var j = r.querySelector('div.out')                      
  i.onkeyup = ()=>updateex(i.value,j);
  return r; })())||""}
`,{className:"sheet",id:data.title})}
)});
  main.variable(observer("cheat_styles")).define("cheat_styles", ["html"], function(html){return(
html`<STYLE>
  .sheet { 
     display:flex; width:calc(100vw-20px); max-width:100%;
     background:#444; padding:15px; flex-wrap:wrap; 
     border-radius:10px; border:2px solid #84f; align-items:stretch;
  }
  .sheet h1 { color:#EEE; text-align:center; flex:1 0 100%; box-sizing:border-box; }
  .box {
     padding:10px; border:1px solid #F84; max-width:100%; font-size:90%;
     background:#CCC; border-radius:3px; flex:1 0 calc(50% - 10px); margin:5px; box-sizing:border-box;
  }
  .box pre { margin:0; }
  .box input {     margin-top: 4px;
    background-color: #eee;
    bordeR: 1px solid rgba(0,0,0,0.3);
    padding: 4px;
    font-size: 110%;
    width: 100%;
    box-sizing: border-box; }
  .box p { min-width:100%; }
  .title { text-align:right; color:#A63; font-size:80%; margin-bottom:-5px;  }
  th, td { border-bottom: 1px solid #888; text-align:center; }
  table { border: 1px solid #888; margin-top:5px; font-size:85%; background:#EEE; min-width:100%; }
  .hljs-comment { color:#040 }
</STYLE>`
)});
  main.variable(observer("notTheThumb")).define("notTheThumb", function(){return(
!navigator.userAgent.match('HeadlessChrome')
)});
  return main;
}
