

let GA = window['Algebra'];  //import GA from '../../lib/ga/ganja.esm.js';

let Graph  = class Graph {

  static ga () {

    GA( 2, 0, 1, () => {

      let items    = [];
      let texts    = [];
      let total    = 5.0;
      let scale    = 0.35;
   // let fontSize = 16;

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
          if( o2 ) {                  // Lable major tics
            let iv = i.toString();
            let xt = -total*(1-x) +total*x;
            if( axis.includes('s') ) { text( texts, iv,  xt, -total, 0, '0.1', '#FFFFFF', 's' ); }
            if( axis.includes('n') ) { text( texts, iv,  xt,  total, 0, '0.1', '#FFFFFF', 'n' ); } } } }

      let linesYL = ( n1, n2, nw, ne, sw, se, array, axis='we' )  => {
        let d1 = 1.0 / n1;
        for( let y=0, i=0; i<=n1; i++, y=i*d1 ) {
          let pw = sw*(1-y)+nw*y;
          let pe = se*(1-y)+ne*y;
          let o2 = i  % n2 === 0;
          let st = o2 ? 0xFFFFFF : 0x666666;
          array.push( st, [pw, pe] ); // Push stroke and line onto array
          if( o2 ) {                  // Lable major tics
            let iv = i.toString();
            let yt = -total*(1-y) + total*y;
            if( axis.includes('w') ) { text( texts, iv, -total, yt, 0, '0.1', '#FFFFFF', 'w' ); }
            if( axis.includes('e') ) { text( texts, iv,  total, yt, 0, '0.1', '#FFFFFF', 'e' ); } } } }

   // let oo = pointXY( 0,    0   );
      let sw = pointXY( -total, -total );
      let nw = pointXY( -total,  total );
      let se = pointXY(  total, -total );
      let ne = pointXY(  total,  total );
   // items.push( 0x0000FF, sw, 'SW', se, 'SE', nw, 'NW', ne, 'NE', oo, 'OO' );

   // let stroke = ( i, n2 ) => {
   //   return i % n2 === 0 ? 0xFFFFFF : 0x666666; }

      let grid = ( n1, n2, nw, ne, sw, se, array ) => {
          linesXL( n1, n2, nw, ne, sw, se, array, 'sn' );
          linesYL( n1, n2, nw, ne, sw, se, array, 'we' ); }

      let justify = ( pos ) => {
        let ju = 'middle';
        if(      pos.includes('w') ) { ju = 'end';   }
        else if( pos.includes('e') ) { ju = 'start'; }
        return `text-anchor:${ju};`; }

      let dx = ( pos, fs ) => {
        let d = 0;
        if(      pos.includes('w') ) { d = -1*fs  }
        else if( pos.includes('e') ) { d =  1*fs; }
        return d; }

      let dy = ( pos, fs ) => {
        let d = 0.25*fs;
        if(      pos.includes('s') ) { d =  1.70*fs  }
        else if( pos.includes('n') ) { d = -1.00*fs; }
        return d; }

      let text = ( texts, str, x, y, r, fontSize, color, pos ) => {
        let xt   =  x*scale + dx( pos, 0.1 );
        let yt   = -y*scale + dy( pos, 0.1 );
        let ju   =  justify( pos );
        texts.push( `<text x="${xt}" y="${yt}" font-family="Roboto" font-size="${fontSize}" style="pointer-events:none; ${ju}" 
         fill="${color}">${str}</text>` );  } //  transform="rotate(${r},${x},${y})"
        
      grid( 100, 10, nw, ne, sw, se, items );
      
      let svg = Element.graph( () => { return items; }, { grid:false } );

      text( texts, "OO", 0,    0,   0, '0.1', '#0000FF', 'mc' );
   // text( texts, "SW", -total, -total, 0, '0.1', '#0000FF', 'sw' );
   // text( texts, "SE",  total, -total, 0, '0.1', '#0000FF', 'se' );
   // text( texts, "NW", -total,  total, 0, '0.1', '#0000FF', 'nw' );
   // text( texts, "NE",  total,  total, 0, '0.1', '#0000FF', 'ne' );

      let inner  = "";
      for( let tx in texts ) {
        inner += texts[tx]; }

      let g = document.createElementNS( 'http://www.w3.org/2000/svg', 'g' );
          g.innerHTML = inner;
      svg.appendChild( g );

      window.Style.process( 'Graph', svg );

      if( linesXL===false && lineX===false && lineY===false && dx===false && dy===false) {}

    } ) } }

export default Graph;

/*
           if( axis.includes('w') ) { array.push( st, pw-dw, iv ); }
           if( axis.includes('e') ) { array.push( st, pe+de, iv ); } } } } // Push south and north axis
 */