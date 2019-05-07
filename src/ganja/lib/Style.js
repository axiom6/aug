
let Obj = {};  // Static Object key store for Style

let Style = class Style {

  static size( elem ) {
    Obj.width  = elem['clientWidth' ];
    Obj.height = elem['clientHeight'];
    // console.log( 'Style.size', Obj );
  }

  static init( key, elem ) {
    Obj[key] = {}
    Obj[key].elem   = elem;
    Obj[key].width  = elem['clientWidth' ]===0 ? Obj.width  : elem['clientWidth' ];
    Obj[key].height = elem['clientHeight']===0 ? Obj.height : elem['clientHeight'];
    // console.log( 'Style.init', key, Obj );
  }

  static process( key, graph ) {
    let page  = Obj[key];
    // console.log( 'Style.process', key, page );
    let style = `width:${page.width}px; height:${page.height}px; background:#000000;`;
    graph.setAttribute( 'style', style );
    if( graph.tagName==='CANVAS' ) {
      let context = graph.getContext('webgl');
          context.fillStyle = '#000000';
       // console.log( "Planes", context, graph );
    }
    // console.log( key, style, graph );
    page.elem.appendChild( graph );
  }
}

Style.Obj    = Obj;
window.Style = Style; // Make Style global for access inside ganja.js

export default Style;

