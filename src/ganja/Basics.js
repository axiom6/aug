// Create a Clifford Algebra with 2,0,1 metric. 
//import GA from '../../lib/math/ganja.esm.js';
let GA = window['Algebra'];

let Basics  = class Basics {

  static run (elem) {

    window.Geom['Basics'].elem = elem;

    GA(2, 0, 1, () => {

      // We work in dual space so we define our points to be bivectors. Ganja.js overloads
      // scientific notation to specify basis blades.
      // For readability we create a function that converts 2D euclidean coordinates
      // to their 3D bivector representation.
      let point = (x, y) => 1e12 - x * 1e02 + y * 1e01;

      // Similarly, we can define lines directly. The euclidean line ax + by + c can be specified so :
      let line = (a, b, c) => a * 1e1 + b * 1e2 + c * 1e0;

      // Define 3 points.
      let A = point(-1, 1), B = point(-1, -1), C = point(1, -1);

      // Define the line y=x-0.5
      let L = line(-1, 1, 0.5)

      // Or by joining two points. We define M as a function so it will update when C or A are dragged.
      let M = () => C & A;

      // Points can also be found by intersecting two lines. We similarly define D as a function
      // for interactive updates.
      let D = () => L ^ M;

      // We now use the graph function to create an SVG object that visualises our algebraic elements.
      // The graph function accepts
      // an array of items that it will render in order. It can render points, lines, labels, colors,
      // line segments and polygons.


      let geom   = window.Geom;
      let basics = geom['Basics'];

      basics.elem.appendChild( Element.graph( [
        A, "A",         // Render point A and label it.
        B, "B",         // Render point B and label it.
        C, "C",         // Render point C and label them.
        L, "L", M, "M", // Render and label lines.
        D, "D",         // Intersection point of L and M
        0xff0000,       // Set the color to red.
        [B, C],          // Render line segment from B to C.
        0xffcccc,       // Set the color to light red.
        [A, B, C]         // render polygon ABC.
      ], { grid:true, width:geom.width, height:geom.height }));

      // , style:'background:black;'

    });
  }
}

export default Basics;