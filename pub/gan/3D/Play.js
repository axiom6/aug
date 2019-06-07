
let GA = window['Algebra']; // import GA from '../../../pub/lib/ga/ganja.esm.js';

let Play  = class Play {

  static ga() {

  GA(3,0,1,()=> {

    // console.log( 'PGA3D', this.describe() );

    let graph = Element.graph([1e123,1e23,1e13,1e12],{camera:1+.5e01-.5e02}); // and in 3D PGA

    window['Geom']['Play'].process( 'Play', graph );

  } ) } }

export default Play;