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

let GA = window['Algebra'];  //import GA from '../../../pub/lib/ga/ganja.esm.js';

let Graph  = class Graph {

  static ga () {
    
    GA( 2, 0, 1, () => {

      let items    = [];
      let texts    = [];
      let total    = 5.0;
      let scale    = 0.35;
   // let fontSize = 16;

      let pointXY = ( x, y )    => 1e12 - x*scale * 1e02 - y*scale * 1e01;

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
            if( axis.includes('n') ) { text( texts, iv,  xt,  total, 0, '0.1', '#FFFFFF', 'n' ); } } } };

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
            if( axis.includes('e') ) { text( texts, iv,  total, yt, 0, '0.1', '#FFFFFF', 'e' ); } } } };

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
          linesYL( n1, n2, nw, ne, sw, se, array, 'we' ); };

      let justify = ( pos ) => {
        let ju = 'middle';
        if(      pos.includes('w') ) { ju = 'end';   }
        else if( pos.includes('e') ) { ju = 'start'; }
        return `text-anchor:${ju};`; };

      let dx = ( pos, fs ) => {
        let d = 0;
        if(      pos.includes('w') ) { d = -1*fs;  }
        else if( pos.includes('e') ) { d =  1*fs; }
        return d; };

      let dy = ( pos, fs ) => {
        let d = 0.25*fs;
        if(      pos.includes('s') ) { d =  1.70*fs;  }
        else if( pos.includes('n') ) { d = -1.00*fs; }
        return d; };

      let text = ( texts, str, x, y, r, fontSize, color, pos ) => {
        let xt   =  x*scale + dx( pos, 0.1 );
        let yt   = -y*scale + dy( pos, 0.1 );
        let ju   =  justify( pos );
        texts.push( `<text x="${xt}" y="${yt}" font-family="Roboto" font-size="${fontSize}" style="pointer-events:none; ${ju}" 
         fill="${color}">${str}</text>` );  }; //  transform="rotate(${r},${x},${y})"
        
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

      window['Geom']['Graph'].process( 'Graph', svg ); // A bad hack

    } ); } };

/*
           if( axis.includes('w') ) { array.push( st, pw-dw, iv ); }
           if( axis.includes('e') ) { array.push( st, pe+de, iv ); } } } } // Push south and north axis
 */

// Create a Clifford Algebra with 2,0,1 metric.

let GA$1 = window['Algebra']; //import GA from '../../../lib/ga/ganja.esm.js';

let Basics  = class Basics {

  static ga () {

    GA$1( 2, 0, 1, () => {

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

      window['Geom']['Basics'].process( 'Basics', svg );

    } );
  }
};

//

var script$2 = {

  extends: GeomND,

  components:{ 'd-dabs':Dabs },

  data() {
    return { comp:'Geom2D', key:'Graph', pages:{
      Graph:  { title:'Graph',  key:'Graph',  obj:Graph,  created:false },
      Basics: { title:'Basics', key:'Basics', obj:Basics, created:false }
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
  

  
  var Geom2D = normalizeComponent_1(
    {},
    __vue_inject_styles__$2,
    __vue_script__$2,
    __vue_scope_id__$2,
    __vue_is_functional_template__$2,
    __vue_module_identifier__$2,
    undefined,
    undefined
  );

export default Geom2D;
