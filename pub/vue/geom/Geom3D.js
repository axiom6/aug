//
//
//
//
//
//
//
//
//


var script = {

  props: { comp:String, pages:Object, init:String },

  data() { return { key:this.init } },

  methods: {
    pubTab: function (key) {
      this.key = key;
      this.publish( this.comp, key ); },
    classTab: function (key) {
      return this.key===key ? 'tab-active' : 'tab'; } },

  mounted: function () {
    this.subscribe( 'Geom', 'Dabs.vue', (key) => {
      this.classTab(key); } ); }

};

function normalizeComponent(template, style, script, scopeId, isFunctionalTemplate, moduleIdentifier
/* server only */
, shadowMode, createInjector, createInjectorSSR, createInjectorShadow) {
  if (typeof shadowMode !== 'boolean') {
    createInjectorSSR = createInjector;
    createInjector = shadowMode;
    shadowMode = false;
  } // Vue.extend constructor export interop.


  var options = typeof script === 'function' ? script.options : script; // render functions

  if (template && template.render) {
    options.render = template.render;
    options.staticRenderFns = template.staticRenderFns;
    options._compiled = true; // functional template

    if (isFunctionalTemplate) {
      options.functional = true;
    }
  } // scopedId


  if (scopeId) {
    options._scopeId = scopeId;
  }

  var hook;

  if (moduleIdentifier) {
    // server build
    hook = function hook(context) {
      // 2.3 injection
      context = context || // cached call
      this.$vnode && this.$vnode.ssrContext || // stateful
      this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext; // functional
      // 2.2 with runInNewContext: true

      if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
        context = __VUE_SSR_CONTEXT__;
      } // inject component styles


      if (style) {
        style.call(this, createInjectorSSR(context));
      } // register component module identifier for async chunk inference


      if (context && context._registeredComponents) {
        context._registeredComponents.add(moduleIdentifier);
      }
    }; // used by ssr in case component is cached and beforeCreate
    // never gets called


    options._ssrRegister = hook;
  } else if (style) {
    hook = shadowMode ? function () {
      style.call(this, createInjectorShadow(this.$root.$options.shadowRoot));
    } : function (context) {
      style.call(this, createInjector(context));
    };
  }

  if (hook) {
    if (options.functional) {
      // register for functional component in vue file
      var originalRender = options.render;

      options.render = function renderWithStyleInjection(h, context) {
        hook.call(context);
        return originalRender(h, context);
      };
    } else {
      // inject component registration as beforeCreate hook
      var existing = options.beforeCreate;
      options.beforeCreate = existing ? [].concat(existing, hook) : [hook];
    }
  }

  return script;
}

var normalizeComponent_1 = normalizeComponent;

var isOldIE = typeof navigator !== 'undefined' && /msie [6-9]\\b/.test(navigator.userAgent.toLowerCase());
function createInjector(context) {
  return function (id, style) {
    return addStyle(id, style);
  };
}
var HEAD = document.head || document.getElementsByTagName('head')[0];
var styles = {};

function addStyle(id, css) {
  var group = isOldIE ? css.media || 'default' : id;
  var style = styles[group] || (styles[group] = {
    ids: new Set(),
    styles: []
  });

  if (!style.ids.has(id)) {
    style.ids.add(id);
    var code = css.source;

    if (css.map) {
      // https://developer.chrome.com/devtools/docs/javascript-debugging
      // this makes source maps inside style tags work properly in Chrome
      code += '\n/*# sourceURL=' + css.map.sources[0] + ' */'; // http://stackoverflow.com/a/26603875

      code += '\n/*# sourceMappingURL=data:application/json;base64,' + btoa(unescape(encodeURIComponent(JSON.stringify(css.map)))) + ' */';
    }

    if (!style.element) {
      style.element = document.createElement('style');
      style.element.type = 'text/css';
      if (css.media) style.element.setAttribute('media', css.media);
      HEAD.appendChild(style.element);
    }

    if ('styleSheet' in style.element) {
      style.styles.push(code);
      style.element.styleSheet.cssText = style.styles.filter(Boolean).join('\n');
    } else {
      var index = style.ids.size - 1;
      var textNode = document.createTextNode(code);
      var nodes = style.element.childNodes;
      if (nodes[index]) style.element.removeChild(nodes[index]);
      if (nodes.length) style.element.insertBefore(textNode, nodes[index]);else style.element.appendChild(textNode);
    }
  }
}

var browser = createInjector;

/* script */
const __vue_script__ = script;

/* template */
var __vue_render__ = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c(
    "div",
    { staticClass: "dabs" },
    [
      _vm._l(_vm.pages, function(page) {
        return [
          _c(
            "div",
            {
              class: _vm.classTab(page.key),
              on: {
                click: function($event) {
                  return _vm.pubTab(page.key)
                }
              }
            },
            [_vm._v(_vm._s(page.title))]
          )
        ]
      })
    ],
    2
  )
};
var __vue_staticRenderFns__ = [];
__vue_render__._withStripped = true;

  /* style */
  const __vue_inject_styles__ = function (inject) {
    if (!inject) return
    inject("data-v-9471b91a_0", { source: ".dabs {\n  position: absolute;\n  left: 0;\n  top: 0;\n  width: 100%;\n  height: 5%;\n  background-color: black;\n  font-size: 1.5em;\n}\n.dabs .tab {\n  display: inline-block;\n  margin-left: 2em;\n  padding: 0.2em 0.3em 0.1em 0.3em;\n  border-radius: 12px 12px 0 0;\n  border-left: wheat solid thin;\n  border-top: wheat solid thin;\n  border-right: wheat solid thin;\n  background-color: black;\n  color: wheat;\n}\n.dabs .tab:hover {\n  background-color: wheat;\n  color: black;\n}\n.dabs .tab-active {\n  display: inline-block;\n  margin-left: 2em;\n  padding: 0.2em 0.3em 0.1em 0.3em;\n  border-radius: 12px 12px 0 0;\n  border-left: wheat solid thin;\n  border-top: wheat solid thin;\n  border-right: wheat solid thin;\n  background-color: black;\n  color: wheat;\n  background-color: wheat;\n  color: black;\n}\n", map: {"version":3,"sources":["Dabs.vue","/Users/ax/Documents/prj/aug/vue/elem/Dabs.vue"],"names":[],"mappings":"AAAA;EACE,kBAAkB;EAClB,OAAO;EACP,MAAM;EACN,WAAW;EACX,UAAU;EACV,uBAAuB;EACvB,gBAAgB;AAClB;AACA;EACE,qBAAqB;EACrB,gBAAgB;EAChB,gCAAgC;EAChC,4BAA4B;EAC5B,6BAA6B;EAC7B,4BAA4B;EAC5B,8BAA8B;EAC9B,uBAAuB;EACvB,YAAY;AACd;AACA;EACE,uBAAuB;EACvB,YAAY;AACd;AACA;EACE,qBAAqB;EACrB,gBAAgB;EAChB,gCAAgC;EAChC,4BAA4B;EAC5B,6BAA6B;EAC7B,4BAA4B;EAC5B,8BAA8B;EAC9B,uBAAuB;EACvB,YAAY;ECCd,uBAAA;EACA,YAAA;AACA","file":"Dabs.vue","sourcesContent":[".dabs {\n  position: absolute;\n  left: 0;\n  top: 0;\n  width: 100%;\n  height: 5%;\n  background-color: black;\n  font-size: 1.5em;\n}\n.dabs .tab {\n  display: inline-block;\n  margin-left: 2em;\n  padding: 0.2em 0.3em 0.1em 0.3em;\n  border-radius: 12px 12px 0 0;\n  border-left: wheat solid thin;\n  border-top: wheat solid thin;\n  border-right: wheat solid thin;\n  background-color: black;\n  color: wheat;\n}\n.dabs .tab:hover {\n  background-color: wheat;\n  color: black;\n}\n.dabs .tab-active {\n  display: inline-block;\n  margin-left: 2em;\n  padding: 0.2em 0.3em 0.1em 0.3em;\n  border-radius: 12px 12px 0 0;\n  border-left: wheat solid thin;\n  border-top: wheat solid thin;\n  border-right: wheat solid thin;\n  background-color: black;\n  color: wheat;\n  background-color: wheat;\n  color: black;\n}\n","\n<template>\n  <div class=\"dabs\">\n    <template v-for=\"page in pages\">\n      <div :class=\"classTab(page.key)\" @click=\"pubTab(page.key)\">{{page.title}}</div>\n    </template>\n  </div>\n</template>\n\n<script type=\"module\">\n\n  export default {\n\n    props: { comp:String, pages:Object, init:String },\n\n    data() { return { key:this.init } },\n\n    methods: {\n      pubTab: function (key) {\n        this.key = key;\n        this.publish( this.comp, key ); },\n      classTab: function (key) {\n        return this.key===key ? 'tab-active' : 'tab'; } },\n\n    mounted: function () {\n      this.subscribe( 'Geom', 'Dabs.vue', (key) => {\n        this.classTab(key) } ); }\n\n  }\n\n</script>\n\n<style lang=\"less\">\n  \n  .dabs { position:absolute; left:0; top:0; width:100%; height:5%; background-color:black; font-size:1.5em;\n    .tab { display:inline-block; margin-left:2.0em; padding:0.2em 0.3em 0.1em 0.3em;\n      border-radius:12px 12px 0 0; border-left: wheat solid thin;\n      border-top:wheat solid thin; border-right:wheat solid thin;\n      background-color:black; color:wheat; }\n    .tab:hover  {         background-color:wheat; color:black; }\n    .tab-active { .tab(); background-color:wheat; color:black; } }\n\n</style>"]}, media: undefined });

  };
  /* scoped */
  const __vue_scope_id__ = undefined;
  /* module identifier */
  const __vue_module_identifier__ = undefined;
  /* functional template */
  const __vue_is_functional_template__ = false;
  /* style inject SSR */
  

  
  var Dabs = normalizeComponent_1(
    { render: __vue_render__, staticRenderFns: __vue_staticRenderFns__ },
    __vue_inject_styles__,
    __vue_script__,
    __vue_scope_id__,
    __vue_is_functional_template__,
    __vue_module_identifier__,
    browser,
    undefined
  );

var Style;

Style = class Style {
  constructor(elem) {
    this.process = this.process.bind(this);
    this.elem = elem;
    this.width = elem['clientWidth'];
    this.height = elem['clientHeight'];
  }

  process(key, graph) {
    var context, style;
    if (key === 'Objects') {
      this.width * 0.25;
    }
    style = `width:${this.width}px; height:${this.height}px; background:#000000;`;
    graph.setAttribute('style', style);
    if (graph.tagName === 'CANVAS') {
      context = graph.getContext('webgl');
      context.fillStyle = '#000000';
    }
    this.elem.appendChild(graph);
  }

};

var Style$1 = Style;

//

var script$1 = {

  components:{ 'd-dabs':Dabs },

  methods: {

    isPage: function(key) {
      return this.key === key; },

    onTabs: function(key) {
      if( this.pages[key] ) {
          this.key = key;
          this.create(this.key); } },

    create: function( key ) {
      if( !this.pages[key].created ) {
           this.pages[key].created = true;
           this.$nextTick( function() { // Wait for DOM to render
             window['Geom'][key] = new Style$1( this.$refs[key][0] );
             this.pages[key].obj.ga(); } ); } }
  },

  mounted: function () {
    this.subscribe( 'Geom', this.comp+'.vue', (key) => {
      if( typeof(key)==='string' ) {
        this.onTabs( key ); } } );
    this.onTabs( this.key ); }
  };

/* script */
const __vue_script__$1 = script$1;

/* template */
var __vue_render__$1 = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c(
    "div",
    [
      _c("d-dabs", {
        attrs: { comp: "Geom", pages: _vm.pages, init: _vm.key }
      }),
      _vm._v(" "),
      _vm._l(_vm.pages, function(page) {
        return [
          _c("div", {
            directives: [
              {
                name: "show",
                rawName: "v-show",
                value: _vm.isPage(page.key),
                expression: "isPage(page.key)"
              }
            ],
            key: page.key,
            ref: page.key,
            refInFor: true,
            staticClass: "page"
          })
        ]
      })
    ],
    2
  )
};
var __vue_staticRenderFns__$1 = [];
__vue_render__$1._withStripped = true;

  /* style */
  const __vue_inject_styles__$1 = function (inject) {
    if (!inject) return
    inject("data-v-59f62aa1_0", { source: ".page {\n  position: absolute;\n  left: 0;\n  top: 5%;\n  right: 0;\n  bottom: 0;\n  background-color: black;\n  display: grid;\n}\n", map: {"version":3,"sources":["GeomND.vue"],"names":[],"mappings":"AAAA;EACE,kBAAkB;EAClB,OAAO;EACP,OAAO;EACP,QAAQ;EACR,SAAS;EACT,uBAAuB;EACvB,aAAa;AACf","file":"GeomND.vue","sourcesContent":[".page {\n  position: absolute;\n  left: 0;\n  top: 5%;\n  right: 0;\n  bottom: 0;\n  background-color: black;\n  display: grid;\n}\n"]}, media: undefined });

  };
  /* scoped */
  const __vue_scope_id__$1 = undefined;
  /* module identifier */
  const __vue_module_identifier__$1 = undefined;
  /* functional template */
  const __vue_is_functional_template__$1 = false;
  /* style inject SSR */
  

  
  var GeomND = normalizeComponent_1(
    { render: __vue_render__$1, staticRenderFns: __vue_staticRenderFns__$1 },
    __vue_inject_styles__$1,
    __vue_script__$1,
    __vue_scope_id__$1,
    __vue_is_functional_template__$1,
    __vue_module_identifier__$1,
    browser,
    undefined
  );

let GA = window['Algebra']; // import GA from '../../../pub/lib/ga/ganja.esm.js';

let Lines  = class Lines {

  static ga() {

  GA( 3, 0, 1, () => {

  // We work in dual space. Our 1-blade's are dual-vectors (aka functionals of the
  // form ax + by + cz + dw = 0).
  // The four basis functionals are thus (x=0, y=0, z=0, w=0). In three dimensions
  // these represent the yz, xz, xy and
  // ideal plane.

  // Specify a point directly (trivectors specified with overloaded e-notation.)
  let point = (x,y,z)=>1e123-x*1e012+y*1e013+z*1e023;

  // Lines can be defined using plucker coordinates
  // let line = (px,py,pz,dx,dy,dz)=>px*1e01+py&1e02+pz*1e03+dx*1e12+dy*1e13+dz*1e23;

  // Planes can be defined directly using e0,e1,e2,e3
  // let plane = (a,b,c,d)=>d*1e0+a*1e1+b*1e2+c*1e3;

  // Useful joins
     let line_from_points  = (P1,P2)=>P1.Normalized&P2.Normalized;
  // let plane_from_points = (P1,P2,P3)=>P1&P2&P3;
  // let plane_from_point_and_line = (P,L)=>P&L;

  // Usefull meets
     let line_from_planes  = (p1,p2)=>p1^p2;
  // let point_from_planes = (p1,p2,p3)=>p1^p2^p3;
     let point_from_line_and_plane = (L,P)=>L^P;

   // Create 5 points and some joining lines.
      let A=point(0,-1,0  );
      let B=point(1,1,-1  );
      let C=point(-1,1,-1 );
      let D=point(1,1, 1  );
      let E=point(-1,1, 1 );
      let centroid=A+B+C+D+E;
      let camera=1e0;

  // Graph the 3D items
  let graph = Element.graph( ()=> {
    let time=performance.now()/12000;
    camera['set'](Math.cos(time)+Math.sin(time)*1e13);                      // rotate around Y
    return [
      0xddaaff,[A,B,C],                                            // graph on face
      0xAA88FF,[A,B],[A,C],[A,D],[B,C],[B,D],[C,E],[A,E],[E,D],    // graph all edges
      0x444444,A,"A",B,"B",C,"C",D,"D",E,"E",                      // graph all vertices
      0xFF8888,C+E,centroid,"sum of points",
      0x8888FF,line_from_points(centroid,C+E),"line from points ..",
      0x44AA44,line_from_planes(A&B&C,B&C&D),"line from planes ..",
      0x4488FF,point_from_line_and_plane(line_from_points(centroid,C+E),A&D&B),
        "point from line and plane ..",
      0xFFAA66,(B&D)+(C&E),"sum of lines"]; }, { animate:true, camera } );

    window['Geom']['Lines'].process( 'Lines', graph );

  } ); } };

let GA$1 = window['Algebra']; // import GA from '../../../pub/lib/ga/ganja.esm.js';

let Grids  = class Grids {

  static ga() {

  GA$1( 3, 0, 1, () => {  // PGA3D Projective Euclidean 3D space. (dual)

  let items = [];
  let origin=1e123, EX=1e012, EY=1e013, EZ=1e023;
  
  let widthf  = 5.0;
  let heightf = 5.0;
  let widthb  = 3.0;
  let heightb = 3.0;
  let widtho  = 4.0;
  let heighto = 4.0;
  let depth   = 2.0;
  let scale   = 0.35;
  
  let point  = (x,y,z)=> origin + x*scale*EX - y*scale*EY + z*scale*EZ;
  let linePP = (p1,p2)=> p1.Normalized & p2.Normalized;
  let lineX  = (x,sw,nw,se,ne) => [sw*(1-x)+se*x, nw*(1-x)+ne*x]; // x scales from [0,1]
  let lineY  = (y,sw,se,nw,ne) => [sw*(1-y)+nw*y, se*(1-y)+ne*y]; // y scales from [0,1]

  // Rotations can be specified through exponentiation (angle around line).
  // let rotor = (line,angle)=>Math.cos(angle/2) + Math.sin(angle/2)*line.Normalized;
    
  let ooo = point(   0, 0,  0   );
  let pxa = point( widtho, 0,  0   );
  let pya = point( 0, heighto, 0   );
  let pza = point( 0, 0,     depth );

  let xaxis = linePP( ooo, pxa );
  let yaxis = linePP( ooo, pya );
  let zaxis = linePP( ooo, pza );

  items.push( 0x00FF00, xaxis, yaxis, zaxis );
  
  let fsw = point( -widthf, -heightf, -depth );
  let fse = point(  widthf, -heightf, -depth );
  let fnw = point( -widthf,  heightf, -depth );
  let fne = point(  widthf,  heightf, -depth );
  let bsw = point( -widthb, -heightb,  depth );
  let bse = point(  widthb, -heightb,  depth );
  let bnw = point( -widthb,  heightb,  depth );
  let bne = point(  widthb,  heightb,  depth );
  
  items.push( 0xFFFFFF,
    ooo, 'OOO', pxa, 'PXA', pya, 'PYA', pza, 'PZA',
    fsw, 'FSW', fse, 'FSE', fnw, 'FNW', fne, 'FNE',
    bsw, 'BSW', bse, 'BSE', bnw, 'BNW', bne, 'BNE'  );

  let stroke = ( i, n2 ) => {
    return i % n2 === 0 ? 0xFFFFFF : 0x666666; };

  let grid = ( n1, n2, sw, se, nw, ne, array ) => {
    let d1 = 1.0 / n1;
    for( let x=0, i=0; i<=n1; i++, x=i*d1 ) { array.push( stroke(i,n2), lineX(x,sw,nw,se,ne) ); }
    for( let y=0, i=0; i<=n1; i++, y=i*d1 ) { array.push( stroke(i,n2), lineY(y,sw,se,nw,ne) ); } };

    grid( 100, 10, fsw, fse, bsw, bse, items );  // South Grid
    grid( 100, 10, fsw, bsw, fnw, bnw, items );  // West  Grid
    grid( 100, 10, bsw, bse, bnw, bne, items );  // Back  Grid
    grid( 100, 10, fse, bse, fne, bne, items );  // East  Grid

    let camera = 1e0;

    let svg = Element.graph( () => {
      let time = performance.now()/12000;
      camera['set']( Math.cos(time) + Math.sin(time)*1e13 ); // rotate around Y
      return items; }, { animate:true, camera } );

    window['Geom']['Grids'].process( 'Grids', svg );

  } ); } };

let GA$2 = window['Algebra']; // import GA from '../../../pub/lib/ga/ganja.esm.js';

let Isomet  = class Isomet {

  static ga() {

  GA$2( 3, 0, 1, () => {  // PGA3D Projective Euclidean 3D space. (dual)

  let items = [];
  let origin=1e123, EX=-1e012, EY=1e013, EZ=1e012;
  let point  = (x,y,z)=>origin+x*EX-y*EY+z*EZ;

  let s =  0.20;    // xyz Scale
  let t = 10.00*s; // Total lengths
  let c =  8.66*s; // Cos(30)
  let h =  5.00*s; // Sin(30) or Half
  let i =  0.50*s; // 10% increment

  let ooo = point(0,0 ,0 );
  let xoo = point(c,-h, 0 );
  let oyo = point(0,t, 0 );
  let ooz = point(0,-h, c );
  let xyo = point(c,h, 0 );
  let oyz = point(0,h, c );
  let xoz = point(c,-t, c );

  items.push( 0xFFFFFF, ooo, 'ooo', xoo, 'xoo', oyo, 'oyo', ooz, 'ooz',
                        xyo, 'xyo', oyz, 'oyz', xoz, 'xoz' );

  let xy = [ooo,xoo,xyo,oyo];
  let yz = [ooo,ooz,oyz,oyo];
  let zx = [ooo,ooz,xoz,xoo];

  items.push( 0x888888, xy, 0x666666, yz, 0x444444, zx );

  let xyX = (x) => [ooo*(1-x)+xoo*x, oyo*(1-x)+xyo*x]; // x scales from [0,1]
  let xyY = (y) => [ooo*(1-y)+oyo*y, xoo*(1-y)+xyo*y]; // y scales from [0,1]
  let yzY = (y) => [ooo*(1-y)+oyo*y, ooz*(1-y)+oyz*y]; // y scales from [0,1]
  let yzZ = (z) => [ooo*(1-z)+ooz*z, oyo*(1-z)+oyz*z]; // z scales from [0,1]
  let zxX = (x) => [ooo*(1-x)+xoo*x, ooz*(1-x)+xoz*x]; // x scales from [0,1]
  let zxZ = (z) => [ooo*(1-z)+ooz*z, xoo*(1-z)+xoz*z]; // z scales from [0,1]

  let gxy = (t,i, xf, yf, items ) => {
    items.push(0xFFFFFF);
    for( let x=0; x < t; x+=i ) { items.push(xf(x)); }
    for( let y=0; y < t; y+=i ) { items.push(yf(y)); } };

  gxy( h, i, xyX, xyY, items ); // Not sure why h
  gxy( h, i, yzY, yzZ, items );
  gxy( h, i, zxX, zxZ, items );

  let svg = Element.graph( () => { return items; }, {} );

  window['Geom']['Isomet'].process( 'Isomet', svg );

  } ); } };

let GA$3 = window['Algebra']; // import GA from '../../../pub/lib/ga/ganja.esm.js';

let Play  = class Play {

  static ga() {

  GA$3(3,0,1,()=> {

    // console.log( 'PGA3D', this.describe() );

    let graph = Element.graph([1e123,1e23,1e13,1e12],{camera:1+.5e01-.5e02}); // and in 3D PGA

    window['Geom']['Play'].process( 'Play', graph );

  } ); } };

let GA$4 = window['Algebra']; // import GA from '../../../pub/lib/ga/ganja.esm.js';

let Isohed  = class Isohed {

  static ga() {

GA$4(3,0,1,()=>{  // Create a Clifford Algebra with 3,0,1 metric. 

  // Specify a point directly (trivectors specified with overloaded e-notation.)
  let point = (x,y,z)=>1e123-x*1e012+y*1e013+z*1e023;
  let rotor = (P,a)=>Math.cos(a/2)+Math.sin(a/2)*P;

  // Our camera position and orientation
  let  camera=1e0;

  // We construct faces, edges and vertices of an icosahedron.
  let r = rotor(1e13,Math.PI/2.5);
  let A = point(0,1,0);
  let B = point((1-Math.atan(0.5)**2)**0.5,Math.atan(0.5),0);
  let C = rotor(1e13,Math.PI/5)>>>(1e2>>>B);
  let items=[A,"A",B,"B",C,"C"];

  // vertices
  items.push(0x4444FF);
  for (let i=0;i<5;i++) items.push(A,B=r>>>B,C=r>>>C,1e2>>>A);

  // edges
  items.push(0x444444);
  for (let i=0;i<5;i++) items.push([A,B],[B,C],[B,B=r>>>B],[B,C],[C,C=r>>>C],[1e2>>>A,C]);

  // faces
  items.push(0xFFCCCC);
  for (let i=0;i<5;i++) items.push([A,B,r>>>B],[B,B=r>>>B,C],[C,B,r>>>C],[C,1e2>>>A,C=r>>>C]);

  // Graph the 3D items
  let graph = Element.graph( () => {
    let time=performance.now()/4000;
    camera['set'](rotor(1e13,time)*rotor(1e12,time*1.23131));                // animate camera
    return items.slice(0,1+((Math.floor(time*50))%(items.length+20))); },   // show more and more elements
  { gl:true, animate:true, camera } );


  window['Geom']['Isohed'].process( 'Isohed', graph );

  } ); } };

let GA$5 = window['Algebra']; // import GA from '../../../pub/lib/ga/ganja.esm.js';

let Objects  = class Objects {

  static ga() {

    GA$5( 3, 0, 1, () => {

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

} ); } };

let GA$6 = window['Algebra']; // import GA from '../../../pub/lib/ga/ganja.esm.js';

let Torus  = class Torus {

  static ga() {

    GA$6( 3, 0, 1, () => {  // PGA3D Projective Euclidean 3D space.

  // Ganja.js can graph the orbits of parametrised motor variables :
  // these are functions that take one parameter 0<x<1 and return a motor.
  // For a function of 1 parameter, the orbit is rendered as a curve.

  let circle  = (BV,r)=>x=>Math.E**(Math.PI*x*BV)*(1+r*.5e01),
      segment = (BV)=>x=>1+x*0.5*BV;

  // The product of two such parametrised 1D orbits is a 2D manifold :
  // In ganja, you can simply multiply the two 1-parameter orbits to
  // make a 2-parameter manifold. (rendered as a sheet)

  // this allows us to multiply two circles into a torus or sphere,
  // two segments into a plane, or a segment and a circle to produce
  // a disk, cone or cylinder.

  let torus    = (r1,r2)=>circle(1e12,r1)*circle(1e13,r2),
      sphere   = (r)=>circle(1e13,0)*circle(1e12,r),
      plane    = (x,y)=>segment(x*1e02)*segment(y*1e03),
      cylinder = (r,l)=>segment(l*1e02)*circle(1e13,r),
      disk     = (r)=>circle(1e12,0)*segment(r*1e01),
      cone     = (r,l)=>circle(1e12,0)*segment(r*1e01-l*1e03);

  // we can render these now just as our other primitives ..
  let elements = [
    0xff0000, circle(1e12,1),
    0x0000ff, segment(1e01),
    0xff0088, torus(.5,.2),
    0xffff00, sphere(0.1),
    0x00ffff, plane(0.2,0.2),
    0x8800ff, cylinder(.05,1),
    0x00ff00, disk(0.2),
    0xffffff, cone(0.1,0.2)
  ];

  // show with rotating camera..
     let camera=1e1+1; // 0e1+1


  let canvas = Element.graph( () => {
    let time = performance.now()/1234;
    camera['set']( Math.cos(time) + Math.sin(time)*1e13 ); // rotate around Y
    return elements; }, { gl:true, animate:true, camera } ); // Requires gl canvas

  window['Geom']['Torus'].process( 'Torus', canvas );

} ); } };

/*
  document.body.appendChild(this.graph(()=>{
    var t=performance.now()/1234;
    camera.set( Math.cos(t) + Math.sin(t)*1e13  );
    return elements;
  },{camera,gl:1,animate:1}));
 */

//

var script$2 = {

  extends: GeomND,
  
  components:{ 'd-dabs':Dabs },

  data() {
    return { comp:'Geom3D', key:'Grids', pages:{
      Lines:   { title:'Lines',   key:'Lines',   obj:Lines,   created:false },
      Grids:   { title:'Grids',   key:'Grids',   obj:Grids,   created:false },
      Isomet:  { title:'Isomet',  key:'Isomet',  obj:Isomet,  created:false },
      Play:    { title:'Play',    key:'Play',    obj:Play,    created:false },
      Isohed:  { title:'Isohed',  key:'Isohed',  obj:Isohed,  created:false },
      Objects: { title:'Objects', key:'Objects', obj:Objects, created:false },
      Torus:   { title:'Torus',   key:'Torus',   obj:Torus,   created:false }
    } } },
  
  };

/* script */
const __vue_script__$2 = script$2;

/* template */

  /* style */
  const __vue_inject_styles__$2 = undefined;
  /* scoped */
  const __vue_scope_id__$2 = undefined;
  /* module identifier */
  const __vue_module_identifier__$2 = undefined;
  /* functional template */
  const __vue_is_functional_template__$2 = undefined;
  /* style inject */
  
  /* style inject SSR */
  

  
  var Geom3D = normalizeComponent_1(
    {},
    __vue_inject_styles__$2,
    __vue_script__$2,
    __vue_scope_id__$2,
    __vue_is_functional_template__$2,
    __vue_module_identifier__$2,
    undefined,
    undefined
  );

export default Geom3D;
