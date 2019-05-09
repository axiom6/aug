

let GA = window['Algebra'];  //import GA from '../../lib/math/ganja.esm.js';

let Graph  = class Graph {

  static ga () {

    GA( 2, 0, 1, () => {

      let items = [];
      let total = 5.0;
      let scale = 0.35;

      let pointXY = ( x, y )    => 1e12 - x*scale * 1e02 - y*scale * 1e01;
   // let pointXY = ( x, y )    => 1e12 - x*scale * 1e02 + y*scale * 1e01;
   // let pointLL = ( l1, l2 )  => () => l1 ^ l2;
   // let lineABC = ( a, b, c ) => a*scale*1e1 + b*scale*1e2 + c*scale*1e0;
   // let linePP  = ( p1, p2 )  => () => p1 & p2;

      let lineX = (x,nw,ne,sw,se) => [sw*(1-x)+se*x, nw*(1-x)+ne*x]; // x scales from [0,1]
      let lineY = (y,nw,ne,sw,se) => [sw*(1-y)+nw*y, se*(1-y)+ne*y]; // y scales from [0,1]

      let linesXL = ( n1, n2, nw, ne, sw, se, array, axis='ns' )  => {
        let d1 = 1.0 / n1;
        for( let x=0, i=0; i<=n1; i++, x=i*d1 ) {
          let ps = sw*(1-x)+se*x;
          let pn = nw*(1-x)+ne*x;
          let o2 = i  % n2 === 0;
          let st = o2 ? 0xFFFFFF : 0x666666;
          array.push( st, [ps, pn] ); // Push stroke and line onto array
          if( o2 && i > 0 ) {                  // Lable major tics
            let dn = 0; // 0.01*1e01;
            let ds = 0; // 3*dn;
            let iv = i.toString();
            if( axis.includes('s') ) { array.push( st, ps-ds, iv ); }
            if( axis.includes('n') ) { array.push( st, pn+dn, iv ); } } } } // Push south and north axis labels

      let linesYL = ( n1, n2, nw, ne, sw, se, array, axis='we' )  => {
        let d1 = 1.0 / n1;
        for( let y=0, i=0; i<=n1; i++, y=i*d1 ) {
          let pw = sw*(1-y)+nw*y;
          let pe = se*(1-y)+ne*y;
          let o2 = i  % n2 === 0;
          let st = o2 ? 0xFFFFFF : 0x666666;
          array.push( st, [pw, pe] ); // Push stroke and line onto array
          if( o2 && i > 0 ) {                  // Lable major tics
            let dw = 0; // 0.01*1e02;
            let de = 0; // 3*dw;
            let iv = i.toString();
            if( axis.includes('w') ) { array.push( st, pw-dw, iv ); }
            if( axis.includes('e') ) { array.push( st, pe+de, iv ); } } } } // Push south and north axis
        // labels

      if( linesXL===false && lineX===false && lineY===false ) {}

   // let oo = pointXY( 0,    0   );
      let sw = pointXY( -total, -total );
      let nw = pointXY( -total,  total );
      let se = pointXY(  total, -total );
      let ne = pointXY(  total,  total );
   // items.push( 0x0000FF, sw, 'SW', se, 'SE', nw, 'NW', ne, 'NE', oo, 'OO' );

   // let stroke = ( i, n2 ) => {
   //   return i % n2 === 0 ? 0xFFFFFF : 0x666666; }

      let grid = ( n1, n2, nw, ne, sw, se, array ) => {
          linesXL( n1, n2, nw, ne, sw, se, array, 's' );
          linesYL( n1, n2, nw, ne, sw, se, array, 'w' ); }
     // let d1 = 1.0 / n1;
     // for( let x=0, i=0; i<=n1; i++, x=i*d1 ) { array.push( stroke(i,n2), lineX(x,nw,ne,sw,se) ); }
     // for( let y=0, i=0; i<=n1; i++, y=i*d1 ) { array.push( stroke(i,n2), lineY(y,nw,ne,sw,se) ); } }
        
      grid( 100, 10, nw, ne, sw, se, items );
      
      let svg = Element.graph( () => { return items; }, { grid:false } );

      window.Style.process( 'Graph', svg );

    } ) } }

export default Graph;