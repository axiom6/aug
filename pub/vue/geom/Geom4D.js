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

let Planes = class Planes {

  static ga() {


    GA( 4, 1, () => {  // Create a Clifford Algebra with 4,1 metric for 3D CGA.

      // no                  = 1e5 - 1e4  origin
      // ni                  = 0.5(1e4 + 1e5)  inifinity
      // nino                = ni ^ no
      // points(x,y,z)       = no + x*1e1 + y*1e2 + z*1e3 + 0.5 * ( x*x + y*y + z*z ) * ni;
      // circle(p1,p2,p3 )   = p1^p2^p3
      // sphere(p1,p2,p3,p4) = p1^p2^p3^p4
      // sphere(p,r)         = !(p-r*ni)
      // sphere(p,r)         = (p,r) => !(p-r*ni)
      // line(p1,p2)         = p1 ^ p2
      // lineINF(p1,p2)      = p1 ^ p2 ^ ni
      // join                = p1 ^ p2
      // meet                = p1 & p2
      // rotor(a,b)          = exp((a/2)*b)

      // We start by defining a null basis, and upcasting for points
   // let total = 5.0;
      let scale = 0.2;
      let xs = scale;
      let ys = scale;
      let zs = scale;
   // let range = total * scale;
      let ni = 1e4   + 1e5;
      let no = 0.5e5 - 0.5e4;
      // let nino = ni ^ no;
   // let up = (x) => no + x + .5 * x * x * ni;

      let point = (xa,ya,za) => {
        let x = xa*xs, y=ya*ys, z=za*zs;
        return no + x*1e1 + y*1e2 + z*1e3 + 0.5 * ( x*x + y*y + z*z ) * ni; };
      let planeDR = (p1,p2,p3,p4) => [p1,p2,p3,p4];

      let r   = 3;
   // let h   = r * 0.5;
      let bne = point(  r,  r,  r );
      let bse = point(  r, -r,  r );
      let bnw = point( -r,  r,  r );
      let bsw = point( -r, -r,  r );
      let fne = point(  r,  r, -r );
      let fse = point(  r, -r, -r );
      let fnw = point( -r,  r, -r );
      let fsw = point( -r, -r, -r );

   // let pb = plane3P(bne,bnw,bsw), db = planeDR(bne,bnw,bsw,bse);
      let de = planeDR(bne,fne,fse,bse);
   // let pn = plane3P(bne,bnw,fnw), dn = planeDR(bne,bnw,fnw,fne);
      let dw = planeDR(bnw,fnw,fsw,bsw);
      let ds = planeDR(bse,bsw,fsw,fse);

   // let line     = (p1,p2) => [p1,p2];
   // let planeBR  = (b,r)   => !( b + r * scale * ni );
      let spherePR = (p,r)   => !( p - r * scale * ni );
   // let grid     = (b,r,n) => plane(b,r);

      // Next we'll define some objects.
      let p0 = point(0, 0, 0 );                           // point
      let sc = spherePR( p0,0.5 ); // !(p1 - 0.20 * ni);  // main dual sphere around point (interactive)


    let items = [
      0xFFFFFF,   bne, 'bne', bse, 'bse', bnw, 'bnw', bsw, 'bsw',
      0xFFFFFF,   fne, 'fne', fse, 'fse', fnw, 'fnw', fsw, 'fsw',
      0xFFFFFF,   de, dw, ds,
      0xFFFFFF,   p0, sc, "Sc" ];

    let svg = Element.graph( () => {
       return items; },
      { conformal:true, camera:1+.5e01-.5e02, gl:false, grid:false } );

      window['Geom']['Planes'].process( 'Planes', svg );

  } ); } };

/*
     // 0xFF00FF,   lt, "Pr&Lt",                  // line intersect plane
     // 0x0000FF,   m1, "Sc&Pb",                  // sphere meet plane
     // 0x888800,   m2, "Sc&Lt",                  // sphere meet line
     // 0x0088FF,   m3, "Sc&Sl",                  // sphere meet sphere
     // 0x008800,   m4, "Sc&Cr",                  // sphere meet circle
     // 0x880000,   m5, "Cr&Pr",                  // circle meet sphere
     // 0x888800,   lp,                      // line and circle
 */

let GA$1 = window['Algebra']; // import GA from '../../../pub/lib/ga/ganja.esm.js';

let Sphere = class Sphere {

  static ga() {


    GA$1(4, 1, () => {  // Create a Clifford Algebra with 4,1 metric for 3D CGA.

      // console.log( this.describe() );

      // We start by defining a null basis, and upcasting for points
      let ni = 1e4 + 1e5, no = .5e5 - .5e4;
      let up = (x) => no + x + .5 * x * x * ni;

      // Next we'll define 4 points
      let p1 = up(1e1), p2 = up(1e2), p3 = up(-1e3), p4 = up(-1e2);

      // The outer product can be used to construct the sphere through
      // any four points.
      let s = () => p1 ^ p2 ^ p3 ^ p4;

      // The outer product between any three points and infinity is a plane.
      let p = () => p1 ^ p2 ^ p3 ^ ni;

      // Graph the items. (hex numbers are html5 colors, two extra first bytes = alpha)
      let canvas = Element.graph([
        0x00FF0000, p1, "p1", p2, "p2", p3, "p3", p4, "p4", // points
        0xE0008800, p, "p",                                 // plane
        0xE00000FF, s, "s"                                  // sphere
      ], { conformal:true, gl:true, grid:false });

      //let context = canvas.getContext('webgl');
      //context.fillStyle = '#000000';

      window['Geom']['Sphere'].process( 'Sphere', canvas );

    } ); } };

//

var script$2 = {

  extends: GeomND,
  
  components:{ 'd-dabs':Dabs },

  data() {
    return { comp:'Geom4D', key:'Sphere', pages:{
        Planes:  { title:'Planes',  key:'Planes',  obj:Planes, created:false },
        Sphere:  { title:'Sphere',  key:'Sphere',  obj:Sphere, created:false }
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
  

  
  var Geom4D = normalizeComponent_1(
    {},
    __vue_inject_styles__$2,
    __vue_script__$2,
    __vue_scope_id__$2,
    __vue_is_functional_template__$2,
    __vue_module_identifier__$2,
    undefined,
    undefined
  );

export default Geom4D;
