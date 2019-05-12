// Create a Clifford Algebra with 2,0,1 metric.
//import GA from '../../lib/ga/ganja.esm.js';
let GA = window['Algebra'];

let Basics  = class Basics {

  static ga () {

    GA( 2, 0, 1, () => {

      let pointXY = ( x, y )    => 1e12 - x * 1e02 + y * 1e01;
      let pointLL = ( l1, l2 )  => () => l1 ^ l2;
      let lineABC = ( a, b, c ) => a * 1e1 + b * 1e2 + c * 1e0;
      let linePP  = ( p1, p2 )  => () => p1 & p2;

      // Define 3 points.
      let A = pointXY(-1, 1), B = pointXY(-1, -1), C = pointXY(1, -1);

      // Define the line y=x-0.5
      let L = lineABC(-1, 1, 0.5);

      // Or by joining two points. We define M as a function so it will update when C or A are dragged.
      let M = linePP( C, A );

      // Points can also be found by intersecting two lines. We similarly define D as a function
      // for interactive updates.
      let D = pointLL( L, M );


      let svg = Element.graph( [
        A, "A",         // Render point A and label it.
        B, "B",         // Render point B and label it.
        C, "C",         // Render point C and label them.
        L, "L", M, "M", // Render and label lines.
        D, "D",         // Intersection point of L and M
        0xff0000,       // Set the color to red.
        [B, C],          // Render line segment from B to C.
        0xffcccc,       // Set the color to light red.
        [A, B, C]         // render polygon ABC.
      ], { grid:true });

      window.Style.process( 'Basics', svg );

    });
  }
}

export default Basics;