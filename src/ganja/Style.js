
let Obj = {};  // Static Object key store for Style

let Style = class Style {

  static size( elem ) {
    Obj.width  = elem['clientWidth' ];
    Obj.height = elem['clientHeight'];
  }

  static init( key, elem ) {
    Obj[key] = {}
    Obj[key].elem   = elem;
    Obj[key].width  = elem['clientWidth' ]===0 ? Obj.width  : elem['clientWidth' ];
    Obj[key].height = elem['clientHeight']===0 ? Obj.height : elem['clientHeight'];
  }

  static process( key, graph ) {
    let page  = Obj[key];
    let style = `width:${page.width}px; height:${page.height}px; background:#000000;`;
    graph.setAttribute( 'style', style );
    if( graph.tagName==='CANVAS' ) {}
    // console.log( key, style, graph );
    page.elem.appendChild( graph );
  }
}

Style.Obj    = Obj;
window.Style = Style; // Make Style global for access inside ganja.js

export default Style;

