var GA;

GA = class GA {
  // opts = {
  //   p,            integer number of positive dimensions.
  //   q,            integer number of negative dimensions.
  //   r,            integer number of zero dimensions.
  //   metric,       [a,b,..] array with metric per generating dimensions. (e.g. [0,1,1] for PGA2D)
  //   basis,        ["1","e1","e2"] basis that overrules the standard cannonical basis.
  //   Cayley,       [["1","e1"],["e1","-1"]] Cayley table to overrule standard GA tables.
  //   baseType,     float32Array (default), float64Array, .. baseType to be used for the Elements.
  //   mix           Set to true to enable interoperable sub-algebras. (defaults to false). }

    // Basic
  // var Hyper   = Algebra(1);       // Hyperbolic numbers.
  // var Complex = Algebra(0,1);     // Complex numbers.
  // var Dual    = Algebra(0,0,1);   // Dual numbers.
  // var H       = Algebra(0,2);     // Quaternions.

    // Clifford
  // var Cl2 = Algebra(2);           // Clifford algebra for 2D vector space.
  // var Cl3 = Algebra(3);           // Clifford algebra for 3D vector space.
  // var CTS = Algebra(1,3);         // Clifford algebra for timespace vectors.

    // SubAlgebras
  // var Complex = Algebra({p:3,basis:['1','e123']});            // Complex Numbers as subalgebra of Cl3
  // var Quater  = Algebra({p:3,basis:['1','e12','e13','e23']}); // Quaternions as even subalgebra of Cl3

    // Geometric
  // var PGA2D = Algebra(2,0,1);     // Projective Euclidean 2D plane. (dual)
  // var PGA3D = Algebra(3,0,1);     // Projective Euclidean 3D space. (dual)
  // var CGA2D = Algebra(3,1);       // conformal 2D space.
  // var CGA3D = Algebra(4,1);       // Conformal 3D space.

    // High-Dimensional GA
  // var DCGA3D = Algebra(6,2);      // Double Conformal 3D Space.
  // var TCGA3D = Algebra(9,3);      // Tripple Conformal 3D Space.
  // var DCGSTA = Algebra(4,8);      // Double Conformal Geometric Space Time Algebra.
  // var QCGA   = Algebra(9,6);      // Quadric Conformal Geometric Algebra.
  constructor(opts, func) {}

};

export default GA;

//# sourceMappingURL=GA.js.map
