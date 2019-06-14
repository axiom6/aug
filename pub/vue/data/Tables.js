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

//
//
//
//
//
//
//
//
//
//
//


let Table1 = {
  
  data() {
    return { comp:'Table1', key:'Table1',
      culs:{  key:"Table1", first:"First", last:"Last",    rank:"Rank"    },
      rows:{
        r1: { key:"1",   first:"Mark",  last:"Felton",  rank:"Colonel" },
        r2: { key:"2",   first:"Brian", last:"Jackson", rank:"Captain" },
        r3: { key:"3",   first:"Dave",  last:"Markum",  rank:"Sargent" } }
       } },

  methods: {},

  mounted: function () { }
};

/* script */
const __vue_script__$1 = Table1;

/* template */
var __vue_render__$1 = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c("table", { staticClass: "table" }, [
    _c(
      "thead",
      [
        _vm._l(_vm.culs, function(col) {
          return [_c("th", [_vm._v(_vm._s(col))])]
        })
      ],
      2
    ),
    _vm._v(" "),
    _c(
      "tbody",
      [
        _vm._l(_vm.rows, function(row) {
          return [
            _c(
              "tr",
              [
                _vm._l(row, function(cell) {
                  return [_c("td", [_vm._v(_vm._s(cell))])]
                })
              ],
              2
            )
          ]
        })
      ],
      2
    ),
    _vm._v(" "),
    _c("tfoot")
  ])
};
var __vue_staticRenderFns__$1 = [];
__vue_render__$1._withStripped = true;

  /* style */
  const __vue_inject_styles__$1 = function (inject) {
    if (!inject) return
    inject("data-v-f3786104_0", { source: ".table {\n  background-color: black;\n  justify-self: center;\n  align-self: center;\n  font-size: 3em;\n}\nth {\n  color: wheat;\n}\ntd {\n  color: wheat;\n}\n", map: {"version":3,"sources":["Table1.vue"],"names":[],"mappings":"AAAA;EACE,uBAAuB;EACvB,oBAAoB;EACpB,kBAAkB;EAClB,cAAc;AAChB;AACA;EACE,YAAY;AACd;AACA;EACE,YAAY;AACd","file":"Table1.vue","sourcesContent":[".table {\n  background-color: black;\n  justify-self: center;\n  align-self: center;\n  font-size: 3em;\n}\nth {\n  color: wheat;\n}\ntd {\n  color: wheat;\n}\n"]}, media: undefined });

  };
  /* scoped */
  const __vue_scope_id__$1 = undefined;
  /* module identifier */
  const __vue_module_identifier__$1 = undefined;
  /* functional template */
  const __vue_is_functional_template__$1 = false;
  /* style inject SSR */
  

  
  var Table1$1 = normalizeComponent_1(
    { render: __vue_render__$1, staticRenderFns: __vue_staticRenderFns__$1 },
    __vue_inject_styles__$1,
    __vue_script__$1,
    __vue_scope_id__$1,
    __vue_is_functional_template__$1,
    __vue_module_identifier__$1,
    browser,
    undefined
  );

//

let Table2 = {
  
  extends:Table1$1
};

/* script */
const __vue_script__$2 = Table2;

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
  

  
  var Table2$1 = normalizeComponent_1(
    {},
    __vue_inject_styles__$2,
    __vue_script__$2,
    __vue_scope_id__$2,
    __vue_is_functional_template__$2,
    __vue_module_identifier__$2,
    undefined,
    undefined
  );

//

let Tables = {
  
  components:{ 'd-dabs':Dabs, 't_table1':Table1$1, 't_table2':Table2$1 },

  data() {
    return { comp:'Tables', key:'None',
      pages:{
        Table1: { title:'Table1', key:'Table1' },
        Table2: { title:'Table2', key:'Table2' } } } },

  methods: {

    isKey: function(key) {
      return this.key === key; },

    onTabs: function(key) {
      if( this.pages[key] ) {
          this.key = key;
       /* this.create(this.key); */ } },

    create: function( key ) {
      if( !this.pages[key].created ) {
        this.pages[key].created = true;
        this.$nextTick( function() { // Wait for DOM to render
          let elem = this.$refs[key][0];
 } ); } }
  },

  mounted: function () {
    this.subscribe( 'Data', this.comp+'.vue', (key) => {
      if( typeof(key)==='string' ) {
        this.onTabs( key ); } } );
    this.onTabs( this.key ); }

};

/* script */
const __vue_script__$3 = Tables;

/* template */
var __vue_render__$2 = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c(
    "div",
    [
      _c("d-dabs", { attrs: { comp: "Data", pages: _vm.pages } }),
      _vm._v(" "),
      _c(
        "div",
        { staticClass: "page" },
        [
          _vm.isKey("None") ? _c("h1", [_vm._v("Tables")]) : _vm._e(),
          _vm._v(" "),
          _vm.isKey("Table1") ? _c("t_table1") : _vm._e(),
          _vm._v(" "),
          _vm.isKey("Table2") ? _c("t_table2") : _vm._e()
        ],
        1
      )
    ],
    1
  )
};
var __vue_staticRenderFns__$2 = [];
__vue_render__$2._withStripped = true;

  /* style */
  const __vue_inject_styles__$3 = function (inject) {
    if (!inject) return
    inject("data-v-b844177c_0", { source: ".page {\n  position: absolute;\n  left: 0;\n  top: 5%;\n  right: 0;\n  bottom: 0;\n  background-color: black;\n  display: grid;\n}\n.page h1 {\n  justify-self: center;\n  align-self: center;\n  text-align: center;\n  color: wheat;\n  font-size: 3em;\n}\n", map: {"version":3,"sources":["Tables.vue"],"names":[],"mappings":"AAAA;EACE,kBAAkB;EAClB,OAAO;EACP,OAAO;EACP,QAAQ;EACR,SAAS;EACT,uBAAuB;EACvB,aAAa;AACf;AACA;EACE,oBAAoB;EACpB,kBAAkB;EAClB,kBAAkB;EAClB,YAAY;EACZ,cAAc;AAChB","file":"Tables.vue","sourcesContent":[".page {\n  position: absolute;\n  left: 0;\n  top: 5%;\n  right: 0;\n  bottom: 0;\n  background-color: black;\n  display: grid;\n}\n.page h1 {\n  justify-self: center;\n  align-self: center;\n  text-align: center;\n  color: wheat;\n  font-size: 3em;\n}\n"]}, media: undefined });

  };
  /* scoped */
  const __vue_scope_id__$3 = undefined;
  /* module identifier */
  const __vue_module_identifier__$3 = undefined;
  /* functional template */
  const __vue_is_functional_template__$3 = false;
  /* style inject SSR */
  

  
  var Tables$1 = normalizeComponent_1(
    { render: __vue_render__$2, staticRenderFns: __vue_staticRenderFns__$2 },
    __vue_inject_styles__$3,
    __vue_script__$3,
    __vue_scope_id__$3,
    __vue_is_functional_template__$3,
    __vue_module_identifier__$3,
    browser,
    undefined
  );

export default Tables$1;
