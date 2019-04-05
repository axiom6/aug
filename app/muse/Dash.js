//
//
//
//
//
//

var script = {};

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
  return _c("div", { staticClass: "logo" })
};
var __vue_staticRenderFns__ = [];
__vue_render__._withStripped = true;

  /* style */
  const __vue_inject_styles__ = function (inject) {
    if (!inject) return
    inject("data-v-78e66bae_0", { source: ".logo {\n  background-color: #333;\n}\n.logo img {\n  width: 140px;\n  height: 50px;\n}\n", map: {"version":3,"sources":["Logo.vue"],"names":[],"mappings":"AAAA;EACE,sBAAsB;AACxB;AACA;EACE,YAAY;EACZ,YAAY;AACd","file":"Logo.vue","sourcesContent":[".logo {\n  background-color: #333;\n}\n.logo img {\n  width: 140px;\n  height: 50px;\n}\n"]}, media: undefined });

  };
  /* scoped */
  const __vue_scope_id__ = undefined;
  /* module identifier */
  const __vue_module_identifier__ = undefined;
  /* functional template */
  const __vue_is_functional_template__ = false;
  /* style inject SSR */
  

  
  var Logo = normalizeComponent_1(
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

var script$1 = {};

/* script */
const __vue_script__$1 = script$1;

/* template */
var __vue_render__$1 = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c("div", { staticClass: "navb" })
};
var __vue_staticRenderFns__$1 = [];
__vue_render__$1._withStripped = true;

  /* style */
  const __vue_inject_styles__$1 = function (inject) {
    if (!inject) return
    inject("data-v-d2a66adc_0", { source: ".navb {\n  background-color: black;\n}\n", map: {"version":3,"sources":["Navb.vue"],"names":[],"mappings":"AAAA;EACE,uBAAuB;AACzB","file":"Navb.vue","sourcesContent":[".navb {\n  background-color: black;\n}\n"]}, media: undefined });

  };
  /* scoped */
  const __vue_scope_id__$1 = undefined;
  /* module identifier */
  const __vue_module_identifier__$1 = undefined;
  /* functional template */
  const __vue_is_functional_template__$1 = false;
  /* style inject SSR */
  

  
  var Navb = normalizeComponent_1(
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
//
//
//
//

var script$2 = {};

/* script */
const __vue_script__$2 = script$2;

/* template */
var __vue_render__$2 = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c("div", { staticClass: "find" })
};
var __vue_staticRenderFns__$2 = [];
__vue_render__$2._withStripped = true;

  /* style */
  const __vue_inject_styles__$2 = function (inject) {
    if (!inject) return
    inject("data-v-4b01193a_0", { source: ".find {\n  background-color: #333;\n}\n", map: {"version":3,"sources":["Find.vue"],"names":[],"mappings":"AAAA;EACE,sBAAsB;AACxB","file":"Find.vue","sourcesContent":[".find {\n  background-color: #333;\n}\n"]}, media: undefined });

  };
  /* scoped */
  const __vue_scope_id__$2 = undefined;
  /* module identifier */
  const __vue_module_identifier__$2 = undefined;
  /* functional template */
  const __vue_is_functional_template__$2 = false;
  /* style inject SSR */
  

  
  var Find = normalizeComponent_1(
    { render: __vue_render__$2, staticRenderFns: __vue_staticRenderFns__$2 },
    __vue_inject_styles__$2,
    __vue_script__$2,
    __vue_scope_id__$2,
    __vue_is_functional_template__$2,
    __vue_module_identifier__$2,
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
//
//
//
//
//
//
//


let Tocs = {
  
  data() {
    return { plane:"None",
      komps:{Info:{name:'Info',pracs:{}},Know:{name:'Know',pracs:{}},Wise:{name:'Wise',pracs:{}}} } },
  methods: {
    showPlane: function(plane) {
      this.plane =  plane;
      this.showPrac(plane); },
    showPrac: function(prac) {
      this.publish( this.plane, prac ); },
    doSelect: function(select) {
      this.publish( 'Select',   select ); } },
  mounted: function () {
    for( let key in this.komps ) {
      if( this.komps.hasOwnProperty(key) ) {
        this.komps[key].pracs = this.pracs(key); } } } };

/* script */
const __vue_script__$3 = Tocs;

/* template */
var __vue_render__$3 = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c("div", { staticClass: "tocs" }, [
    _c(
      "ul",
      [
        _vm._l(_vm.komps, function(komp) {
          return [
            _c("li", { key: komp.name }, [
              _c(
                "span",
                {
                  on: {
                    click: function($event) {
                      return _vm.showPlane(komp.name)
                    }
                  }
                },
                [
                  _c("router-link", { attrs: { to: { name: komp.name } } }, [
                    _vm._v(_vm._s(komp.name))
                  ])
                ],
                1
              ),
              _vm._v(" "),
              _vm.plane === komp.name
                ? _c(
                    "ul",
                    [
                      _vm._l(_vm.komps[komp.name].pracs, function(prac) {
                        return [
                          _c(
                            "li",
                            {
                              key: prac.name,
                              on: {
                                click: function($event) {
                                  return _vm.showPrac(prac.name)
                                }
                              }
                            },
                            [_vm._v(_vm._s(prac.name))]
                          )
                        ]
                      })
                    ],
                    2
                  )
                : _vm._e()
            ])
          ]
        })
      ],
      2
    )
  ])
};
var __vue_staticRenderFns__$3 = [];
__vue_render__$3._withStripped = true;

  /* style */
  const __vue_inject_styles__$3 = function (inject) {
    if (!inject) return
    inject("data-v-6f1a5ec4_0", { source: ".tocs {\n  background-color: black;\n}\n.tocs ul {\n  padding: 0;\n  list-style: none;\n  align-self: start;\n  font-size: 3vh;\n  display: grid;\n}\n.tocs ul li {\n  background-color: #333;\n  padding-left: 0.25em;\n  align-self: start;\n  border-radius: 0 24px 24px 0;\n  margin: 0.2em 0.2em 0.2em 0.2em;\n}\n.tocs ul li a {\n  color: white;\n  text-decoration: none;\n}\n.tocs ul li ul {\n  font-size: 2vh;\n}\n.tocs ul li ul li {\n  border-radius: 0 12px 12px 0;\n  color: white;\n  margin: 0.2em 0.2em 0.2em 0.2em;\n  border: none;\n  background-color: #666;\n}\n.tocs ul li ul li:hover {\n  background-color: white;\n  color: black;\n}\n", map: {"version":3,"sources":["Tocs.vue"],"names":[],"mappings":"AAAA;EACE,uBAAuB;AACzB;AACA;EACE,UAAU;EACV,gBAAgB;EAChB,iBAAiB;EACjB,cAAc;EACd,aAAa;AACf;AACA;EACE,sBAAsB;EACtB,oBAAoB;EACpB,iBAAiB;EACjB,4BAA4B;EAC5B,+BAA+B;AACjC;AACA;EACE,YAAY;EACZ,qBAAqB;AACvB;AACA;EACE,cAAc;AAChB;AACA;EACE,4BAA4B;EAC5B,YAAY;EACZ,+BAA+B;EAC/B,YAAY;EACZ,sBAAsB;AACxB;AACA;EACE,uBAAuB;EACvB,YAAY;AACd","file":"Tocs.vue","sourcesContent":[".tocs {\n  background-color: black;\n}\n.tocs ul {\n  padding: 0;\n  list-style: none;\n  align-self: start;\n  font-size: 3vh;\n  display: grid;\n}\n.tocs ul li {\n  background-color: #333;\n  padding-left: 0.25em;\n  align-self: start;\n  border-radius: 0 24px 24px 0;\n  margin: 0.2em 0.2em 0.2em 0.2em;\n}\n.tocs ul li a {\n  color: white;\n  text-decoration: none;\n}\n.tocs ul li ul {\n  font-size: 2vh;\n}\n.tocs ul li ul li {\n  border-radius: 0 12px 12px 0;\n  color: white;\n  margin: 0.2em 0.2em 0.2em 0.2em;\n  border: none;\n  background-color: #666;\n}\n.tocs ul li ul li:hover {\n  background-color: white;\n  color: black;\n}\n"]}, media: undefined });

  };
  /* scoped */
  const __vue_scope_id__$3 = undefined;
  /* module identifier */
  const __vue_module_identifier__$3 = undefined;
  /* functional template */
  const __vue_is_functional_template__$3 = false;
  /* style inject SSR */
  

  
  var Tocs$1 = normalizeComponent_1(
    { render: __vue_render__$3, staticRenderFns: __vue_staticRenderFns__$3 },
    __vue_inject_styles__$3,
    __vue_script__$3,
    __vue_scope_id__$3,
    __vue_is_functional_template__$3,
    __vue_module_identifier__$3,
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

var script$3 = {
};

/* script */
const __vue_script__$4 = script$3;

/* template */
var __vue_render__$4 = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c(
    "div",
    [
      _c("router-view", { attrs: { name: "Info" } }),
      _vm._v(" "),
      _c("router-view", { attrs: { name: "Know" } }),
      _vm._v(" "),
      _c("router-view", { attrs: { name: "Wise" } })
    ],
    1
  )
};
var __vue_staticRenderFns__$4 = [];
__vue_render__$4._withStripped = true;

  /* style */
  const __vue_inject_styles__$4 = undefined;
  /* scoped */
  const __vue_scope_id__$4 = undefined;
  /* module identifier */
  const __vue_module_identifier__$4 = undefined;
  /* functional template */
  const __vue_is_functional_template__$4 = false;
  /* style inject */
  
  /* style inject SSR */
  

  
  var View = normalizeComponent_1(
    { render: __vue_render__$4, staticRenderFns: __vue_staticRenderFns__$4 },
    __vue_inject_styles__$4,
    __vue_script__$4,
    __vue_scope_id__$4,
    __vue_is_functional_template__$4,
    __vue_module_identifier__$4,
    undefined,
    undefined
  );

//
//
//
//
//

var script$4 = {};

/* script */
const __vue_script__$5 = script$4;

/* template */
var __vue_render__$5 = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c("div", { staticClass: "side" })
};
var __vue_staticRenderFns__$5 = [];
__vue_render__$5._withStripped = true;

  /* style */
  const __vue_inject_styles__$5 = function (inject) {
    if (!inject) return
    inject("data-v-48f77378_0", { source: ".side {\n  background-color: black;\n}\n", map: {"version":3,"sources":["Side.vue"],"names":[],"mappings":"AAAA;EACE,uBAAuB;AACzB","file":"Side.vue","sourcesContent":[".side {\n  background-color: black;\n}\n"]}, media: undefined });

  };
  /* scoped */
  const __vue_scope_id__$5 = undefined;
  /* module identifier */
  const __vue_module_identifier__$5 = undefined;
  /* functional template */
  const __vue_is_functional_template__$5 = false;
  /* style inject SSR */
  

  
  var Side = normalizeComponent_1(
    { render: __vue_render__$5, staticRenderFns: __vue_staticRenderFns__$5 },
    __vue_inject_styles__$5,
    __vue_script__$5,
    __vue_scope_id__$5,
    __vue_is_functional_template__$5,
    __vue_module_identifier__$5,
    browser,
    undefined
  );

//
//
//
//
//

var script$5 = {};

/* script */
const __vue_script__$6 = script$5;

/* template */
var __vue_render__$6 = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c("div", { staticClass: "pref" })
};
var __vue_staticRenderFns__$6 = [];
__vue_render__$6._withStripped = true;

  /* style */
  const __vue_inject_styles__$6 = function (inject) {
    if (!inject) return
    inject("data-v-d140e9be_0", { source: ".pref {\n  background-color: #333;\n}\n", map: {"version":3,"sources":["Pref.vue"],"names":[],"mappings":"AAAA;EACE,sBAAsB;AACxB","file":"Pref.vue","sourcesContent":[".pref {\n  background-color: #333;\n}\n"]}, media: undefined });

  };
  /* scoped */
  const __vue_scope_id__$6 = undefined;
  /* module identifier */
  const __vue_module_identifier__$6 = undefined;
  /* functional template */
  const __vue_is_functional_template__$6 = false;
  /* style inject SSR */
  

  
  var Pref = normalizeComponent_1(
    { render: __vue_render__$6, staticRenderFns: __vue_staticRenderFns__$6 },
    __vue_inject_styles__$6,
    __vue_script__$6,
    __vue_scope_id__$6,
    __vue_is_functional_template__$6,
    __vue_module_identifier__$6,
    browser,
    undefined
  );

//
//
//
//
//

var script$6 = {};

/* script */
const __vue_script__$7 = script$6;

/* template */
var __vue_render__$7 = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c("div", { staticClass: "foot" })
};
var __vue_staticRenderFns__$7 = [];
__vue_render__$7._withStripped = true;

  /* style */
  const __vue_inject_styles__$7 = function (inject) {
    if (!inject) return
    inject("data-v-7573ed31_0", { source: ".foot {\n  background-color: black;\n}\n", map: {"version":3,"sources":["Foot.vue"],"names":[],"mappings":"AAAA;EACE,uBAAuB;AACzB","file":"Foot.vue","sourcesContent":[".foot {\n  background-color: black;\n}\n"]}, media: undefined });

  };
  /* scoped */
  const __vue_scope_id__$7 = undefined;
  /* module identifier */
  const __vue_module_identifier__$7 = undefined;
  /* functional template */
  const __vue_is_functional_template__$7 = false;
  /* style inject SSR */
  

  
  var Foot = normalizeComponent_1(
    { render: __vue_render__$7, staticRenderFns: __vue_staticRenderFns__$7 },
    __vue_inject_styles__$7,
    __vue_script__$7,
    __vue_scope_id__$7,
    __vue_is_functional_template__$7,
    __vue_module_identifier__$7,
    browser,
    undefined
  );

//
//
//
//
//

var script$7 = {};

/* script */
const __vue_script__$8 = script$7;

/* template */
var __vue_render__$8 = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c("div", { staticClass: "trak" })
};
var __vue_staticRenderFns__$8 = [];
__vue_render__$8._withStripped = true;

  /* style */
  const __vue_inject_styles__$8 = function (inject) {
    if (!inject) return
    inject("data-v-27b0e242_0", { source: "\n.trak { background-color:#333;\n}\n", map: {"version":3,"sources":["/Users/ax/Documents/prj/aug/vue/dash/Trak.vue"],"names":[],"mappings":";AAUA,QAAA,qBAAA;AAAA","file":"Trak.vue","sourcesContent":["\n<template>\n  <div class=\"trak\"></div>\n</template>\n\n<script>\n  export default {}\n</script>\n\n<style type=\"module\">\n     .trak { background-color:#333; }\n</style>\n"]}, media: undefined });

  };
  /* scoped */
  const __vue_scope_id__$8 = undefined;
  /* module identifier */
  const __vue_module_identifier__$8 = undefined;
  /* functional template */
  const __vue_is_functional_template__$8 = false;
  /* style inject SSR */
  

  
  var Trak = normalizeComponent_1(
    { render: __vue_render__$8, staticRenderFns: __vue_staticRenderFns__$8 },
    __vue_inject_styles__$8,
    __vue_script__$8,
    __vue_scope_id__$8,
    __vue_is_functional_template__$8,
    __vue_module_identifier__$8,
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
//
//
//
//

var script$8 = {
  data() {
    return { prac:"None", all:true, infos:{} } },
  methods: {
    isPrac: function (prac) {
      return this.prac===prac || this.all; },
    onPrac: function (prac) {
      if( prac==='Info' ) { this.all=true; } else { this.all=false; this.prac=prac; } },
    klass: function(klas) {
      return !this.all ? 'all' : klas; } },
  mounted: function () {
    this.infos = this.pracs('Info');
    this.subscribe( 'Info', 'Info.vue', (prac) => this.onPrac(prac) ); } };

/* script */
const __vue_script__$9 = script$8;

/* template */
var __vue_render__$9 = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c(
    "div",
    { staticClass: "view" },
    [
      _vm._l(_vm.infos, function(prac) {
        return [
          _vm.isPrac(prac.name)
            ? _c(
                "div",
                {
                  key: prac.name,
                  class: _vm.klass(prac.dir),
                  attrs: { id: prac.name }
                },
                [
                  _c(
                    "div",
                    { staticClass: "pane" },
                    [
                      _c("div", { staticClass: "cen" }, [
                        _c("div", [_vm._v(_vm._s(prac.name))])
                      ]),
                      _vm._v(" "),
                      _vm._l(prac.disps, function(disp) {
                        return [
                          _c("div", { class: disp.dir }, [
                            _c("div", [_vm._v(_vm._s(disp.name))])
                          ])
                        ]
                      })
                    ],
                    2
                  )
                ]
              )
            : _vm._e()
        ]
      })
    ],
    2
  )
};
var __vue_staticRenderFns__$9 = [];
__vue_render__$9._withStripped = true;

  /* style */
  const __vue_inject_styles__$9 = function (inject) {
    if (!inject) return
    inject("data-v-6058a4ce_0", { source: ".view {\n  background-color: black;\n  display: grid;\n  position: relative;\n  grid-template-columns: 33%  33% 34%;\n  grid-template-rows: 33%  33% 34%;\n  grid-template-areas: \"nw   north ne\" \"west cen   east\" \"sw   south se\";\n  justify-items: center;\n  align-items: center;\n}\n.view .nw {\n  grid-area: nw;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n}\n.view .north {\n  grid-area: north;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n}\n.view .ne {\n  grid-area: ne;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n}\n.view .west {\n  grid-area: west;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n}\n.view .cen {\n  grid-area: cen;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n}\n.view .east {\n  grid-area: east;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n}\n.view .sw {\n  grid-area: sw;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n}\n.view .south {\n  grid-area: south;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n}\n.view .se {\n  grid-area: se;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n}\n.view .pane {\n  width: 90%;\n  height: 80%;\n  background-color: #603;\n  justify-self: center;\n  align-self: center;\n  display: grid;\n  border-radius: 0.5em;\n  font-size: 3vh;\n  font-weight: bold;\n  grid-template-columns: 33%  33% 34%;\n  grid-template-rows: 33%  33% 34%;\n  grid-template-areas: \"nw   north ne\" \"west cen   east\" \"sw   south se\";\n}\n.view .pane .name {\n  font-size: 2em;\n  background-color: tan;\n  text-align: center;\n  justify-self: center;\n  align-self: center;\n}\n.view .pane .cen {\n  grid-area: cen;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n  background: coral;\n  border-radius: 36px;\n  font-size: 4vh;\n}\n.view .pane .west {\n  grid-area: west;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n  background: springgreen;\n  border-radius: 36px;\n}\n.view .pane .north {\n  grid-area: north;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n  background: gold;\n  border-radius: 36px;\n}\n.view .pane .east {\n  grid-area: east;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n  background: salmon;\n  border-radius: 36px;\n}\n.view .pane .south {\n  grid-area: south;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n  background: peru;\n  border-radius: 36px;\n}\n.view .pane div div {\n  text-align: center;\n  justify-self: center;\n  align-self: center;\n}\n.view .all {\n  position: absolute;\n  left: 3%;\n  top: 6%;\n  right: 3%;\n  bottom: 6%;\n  display: grid;\n}\n.view .all .pane {\n  font-size: 1.5em;\n  width: 100%;\n  height: 100%;\n  background-color: #603;\n  justify-self: center;\n  align-self: center;\n  display: grid;\n  border-radius: 0.5em;\n}\n.view .all .pane .name {\n  font-size: 2em;\n  background-color: tan;\n  justify-self: center;\n  align-self: center;\n  text-align: center;\n}\n", map: {"version":3,"sources":["Info.vue","/Users/ax/Documents/prj/aug/vue/muse/Info.vue"],"names":[],"mappings":"AAAA;EACE,uBAAuB;EACvB,aAAa;EACb,kBAAkB;EAClB,mCAAmC;EACnC,gCAAgC;EAChC,sEAAsE;EACtE,qBAAqB;EACrB,mBAAmB;AACrB;AACA;EACE,aAAa;EACb,qBAAqB;EACrB,mBAAmB;EACnB,aAAa;AACf;AACA;EACE,gBAAgB;EAChB,qBAAqB;EACrB,mBAAmB;EACnB,aAAa;AACf;AACA;EACE,aAAa;EACb,qBAAqB;EACrB,mBAAmB;EACnB,aAAa;AACf;AACA;EACE,eAAe;EACf,qBAAqB;EACrB,mBAAmB;ECCrB,aAAA;ADCA;AACA;EACE,cAAc;EACd,qBAAqB;EACrB,mBAAmB;EACnB,aAAa;AACf;AACA;EACE,eAAe;EACf,qBAAqB;EACrB,mBAAmB;EACnB,aAAa;AACf;AACA;EACE,aAAa;EACb,qBAAqB;EACrB,mBAAmB;EACnB,aAAa;AACf;AACA;EACE,gBAAgB;EAChB,qBAAqB;EACrB,mBAAmB;EACnB,aAAa;AACf;AACA;EACE,aAAa;EACb,qBAAqB;EACrB,mBAAmB;EACnB,aAAa;AACf;AACA;EACE,UAAU;EACV,WAAW;EACX,sBAAsB;EACtB,oBAAoB;EACpB,kBAAkB;EAClB,aAAa;EACb,oBAAoB;EACpB,cAAc;EACd,iBAAiB;EACjB,mCAAmC;EACnC,gCAAgC;EAChC,sEAAsE;AACxE;AACA;EACE,cAAc;EACd,qBAAqB;EACrB,kBAAkB;EAClB,oBAAoB;EACpB,kBAAkB;AACpB;AACA;EACE,cAAc;EACd,qBAAqB;EACrB,mBAAmB;EACnB,aAAa;EACb,iBAAiB;EACjB,mBAAmB;EACnB,cAAc;AAChB;AACA;EACE,eAAe;EACf,qBAAqB;EACrB,mBAAmB;EACnB,aAAa;EACb,uBAAuB;EACvB,mBAAmB;AACrB;AACA;EACE,gBAAgB;EAChB,qBAAqB;EACrB,mBAAmB;EACnB,aAAa;EACb,gBAAgB;EAChB,mBAAmB;AACrB;AACA;EACE,eAAe;EACf,qBAAqB;EACrB,mBAAmB;EACnB,aAAa;EACb,kBAAkB;EAClB,mBAAmB;AACrB;AACA;EACE,gBAAgB;EAChB,qBAAqB;EACrB,mBAAmB;EACnB,aAAa;EACb,gBAAgB;EAChB,mBAAmB;AACrB;AACA;EACE,kBAAkB;EAClB,oBAAoB;EACpB,kBAAkB;AACpB;AACA;EACE,kBAAkB;EAClB,QAAQ;EACR,OAAO;EACP,SAAS;EACT,UAAU;EACV,aAAa;AACf;AACA;EACE,gBAAgB;EAChB,WAAW;EACX,YAAY;EACZ,sBAAsB;EACtB,oBAAoB;EACpB,kBAAkB;EAClB,aAAa;EACb,oBAAoB;AACtB;AACA;EACE,cAAc;EACd,qBAAqB;EACrB,oBAAoB;EACpB,kBAAkB;EAClB,kBAAkB;AACpB","file":"Info.vue","sourcesContent":[".view {\n  background-color: black;\n  display: grid;\n  position: relative;\n  grid-template-columns: 33%  33% 34%;\n  grid-template-rows: 33%  33% 34%;\n  grid-template-areas: \"nw   north ne\" \"west cen   east\" \"sw   south se\";\n  justify-items: center;\n  align-items: center;\n}\n.view .nw {\n  grid-area: nw;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n}\n.view .north {\n  grid-area: north;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n}\n.view .ne {\n  grid-area: ne;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n}\n.view .west {\n  grid-area: west;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n}\n.view .cen {\n  grid-area: cen;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n}\n.view .east {\n  grid-area: east;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n}\n.view .sw {\n  grid-area: sw;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n}\n.view .south {\n  grid-area: south;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n}\n.view .se {\n  grid-area: se;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n}\n.view .pane {\n  width: 90%;\n  height: 80%;\n  background-color: #603;\n  justify-self: center;\n  align-self: center;\n  display: grid;\n  border-radius: 0.5em;\n  font-size: 3vh;\n  font-weight: bold;\n  grid-template-columns: 33%  33% 34%;\n  grid-template-rows: 33%  33% 34%;\n  grid-template-areas: \"nw   north ne\" \"west cen   east\" \"sw   south se\";\n}\n.view .pane .name {\n  font-size: 2em;\n  background-color: tan;\n  text-align: center;\n  justify-self: center;\n  align-self: center;\n}\n.view .pane .cen {\n  grid-area: cen;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n  background: coral;\n  border-radius: 36px;\n  font-size: 4vh;\n}\n.view .pane .west {\n  grid-area: west;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n  background: springgreen;\n  border-radius: 36px;\n}\n.view .pane .north {\n  grid-area: north;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n  background: gold;\n  border-radius: 36px;\n}\n.view .pane .east {\n  grid-area: east;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n  background: salmon;\n  border-radius: 36px;\n}\n.view .pane .south {\n  grid-area: south;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n  background: peru;\n  border-radius: 36px;\n}\n.view .pane div div {\n  text-align: center;\n  justify-self: center;\n  align-self: center;\n}\n.view .all {\n  position: absolute;\n  left: 3%;\n  top: 6%;\n  right: 3%;\n  bottom: 6%;\n  display: grid;\n}\n.view .all .pane {\n  font-size: 1.5em;\n  width: 100%;\n  height: 100%;\n  background-color: #603;\n  justify-self: center;\n  align-self: center;\n  display: grid;\n  border-radius: 0.5em;\n}\n.view .all .pane .name {\n  font-size: 2em;\n  background-color: tan;\n  justify-self: center;\n  align-self: center;\n  text-align: center;\n}\n","\n<template>\n  <div class=\"view\">\n    <template v-for=\"prac in infos\">\n      <div :id=\"prac.name\"  v-if=\"isPrac(prac.name)\" :class=\"klass(prac.dir)\" :key=\"prac.name\">\n        <div class=\"pane\"><div class=\"cen\"><div>{{prac.name}}</div></div>\n          <template  v-for=\"disp in prac.disps\">\n            <div :class=\"disp.dir\"><div>{{disp.name}}</div></div>\n          </template>\n        </div>\n      </div>\n    </template>\n  </div>  \n</template>\n\n<script type=\"module\">\n  export default {\n    data() {\n      return { prac:\"None\", all:true, infos:{} } },\n    methods: {\n      isPrac: function (prac) {\n        return this.prac===prac || this.all; },\n      onPrac: function (prac) {\n        if( prac==='Info' ) { this.all=true; } else { this.all=false; this.prac=prac; } },\n      klass: function(klas) {\n        return !this.all ? 'all' : klas; } },\n    mounted: function () {\n      this.infos = this.pracs('Info');\n      this.subscribe( 'Info', 'Info.vue', (prac) => this.onPrac(prac) ); } }\n</script>\n\n<style lang=\"less\">\n @import \"View.less\";\n</style>\n\n"]}, media: undefined });

  };
  /* scoped */
  const __vue_scope_id__$9 = undefined;
  /* module identifier */
  const __vue_module_identifier__$9 = undefined;
  /* functional template */
  const __vue_is_functional_template__$9 = false;
  /* style inject SSR */
  

  
  var Info = normalizeComponent_1(
    { render: __vue_render__$9, staticRenderFns: __vue_staticRenderFns__$9 },
    __vue_inject_styles__$9,
    __vue_script__$9,
    __vue_scope_id__$9,
    __vue_is_functional_template__$9,
    __vue_module_identifier__$9,
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
//
//
//
//

var script$9 = {
  data() {
    return { prac:"None", all:true, knows:{} } },
  methods: {
    isPrac: function (prac) {
      return this.prac===prac || this.all; },
    onPrac: function (prac) {
      if( prac==='Know' ) { this.all=true; } else { this.all=false; this.prac=prac; } },
    klass: function(klas) {
      return !this.all ? 'all' : klas; } },
  mounted: function () {
    this.knows = this.pracs('Know');
    this.subscribe( 'Know', 'Know.vue', (prac) => this.onPrac(prac) ); } };

/* script */
const __vue_script__$a = script$9;

/* template */
var __vue_render__$a = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c(
    "div",
    { staticClass: "view" },
    [
      _vm._l(_vm.knows, function(prac) {
        return [
          _vm.isPrac(prac.name)
            ? _c(
                "div",
                {
                  key: prac.name,
                  class: _vm.klass(prac.dir),
                  attrs: { id: prac.name }
                },
                [
                  _c(
                    "div",
                    { staticClass: "pane" },
                    [
                      _c("div", { staticClass: "cen" }, [
                        _c("div", [_vm._v(_vm._s(prac.name))])
                      ]),
                      _vm._v(" "),
                      _vm._l(prac.disps, function(disp) {
                        return [
                          _c("div", { class: disp.dir }, [
                            _c("div", [_vm._v(_vm._s(disp.name))])
                          ])
                        ]
                      })
                    ],
                    2
                  )
                ]
              )
            : _vm._e()
        ]
      })
    ],
    2
  )
};
var __vue_staticRenderFns__$a = [];
__vue_render__$a._withStripped = true;

  /* style */
  const __vue_inject_styles__$a = function (inject) {
    if (!inject) return
    inject("data-v-43f33064_0", { source: ".view {\n  background-color: black;\n  display: grid;\n  position: relative;\n  grid-template-columns: 33%  33% 34%;\n  grid-template-rows: 33%  33% 34%;\n  grid-template-areas: \"nw   north ne\" \"west cen   east\" \"sw   south se\";\n  justify-items: center;\n  align-items: center;\n}\n.view .nw {\n  grid-area: nw;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n}\n.view .north {\n  grid-area: north;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n}\n.view .ne {\n  grid-area: ne;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n}\n.view .west {\n  grid-area: west;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n}\n.view .cen {\n  grid-area: cen;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n}\n.view .east {\n  grid-area: east;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n}\n.view .sw {\n  grid-area: sw;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n}\n.view .south {\n  grid-area: south;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n}\n.view .se {\n  grid-area: se;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n}\n.view .pane {\n  width: 90%;\n  height: 80%;\n  background-color: #603;\n  justify-self: center;\n  align-self: center;\n  display: grid;\n  border-radius: 0.5em;\n  font-size: 3vh;\n  font-weight: bold;\n  grid-template-columns: 33%  33% 34%;\n  grid-template-rows: 33%  33% 34%;\n  grid-template-areas: \"nw   north ne\" \"west cen   east\" \"sw   south se\";\n}\n.view .pane .name {\n  font-size: 2em;\n  background-color: tan;\n  text-align: center;\n  justify-self: center;\n  align-self: center;\n}\n.view .pane .cen {\n  grid-area: cen;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n  background: coral;\n  border-radius: 36px;\n  font-size: 4vh;\n}\n.view .pane .west {\n  grid-area: west;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n  background: springgreen;\n  border-radius: 36px;\n}\n.view .pane .north {\n  grid-area: north;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n  background: gold;\n  border-radius: 36px;\n}\n.view .pane .east {\n  grid-area: east;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n  background: salmon;\n  border-radius: 36px;\n}\n.view .pane .south {\n  grid-area: south;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n  background: peru;\n  border-radius: 36px;\n}\n.view .pane div div {\n  text-align: center;\n  justify-self: center;\n  align-self: center;\n}\n.view .all {\n  position: absolute;\n  left: 3%;\n  top: 6%;\n  right: 3%;\n  bottom: 6%;\n  display: grid;\n}\n.view .all .pane {\n  font-size: 1.5em;\n  width: 100%;\n  height: 100%;\n  background-color: #603;\n  justify-self: center;\n  align-self: center;\n  display: grid;\n  border-radius: 0.5em;\n}\n.view .all .pane .name {\n  font-size: 2em;\n  background-color: tan;\n  justify-self: center;\n  align-self: center;\n  text-align: center;\n}\n", map: {"version":3,"sources":["Know.vue","/Users/ax/Documents/prj/aug/vue/muse/Know.vue"],"names":[],"mappings":"AAAA;EACE,uBAAuB;EACvB,aAAa;EACb,kBAAkB;EAClB,mCAAmC;EACnC,gCAAgC;EAChC,sEAAsE;EACtE,qBAAqB;EACrB,mBAAmB;AACrB;AACA;EACE,aAAa;EACb,qBAAqB;EACrB,mBAAmB;EACnB,aAAa;AACf;AACA;EACE,gBAAgB;EAChB,qBAAqB;EACrB,mBAAmB;EACnB,aAAa;AACf;AACA;EACE,aAAa;EACb,qBAAqB;EACrB,mBAAmB;EACnB,aAAa;AACf;AACA;EACE,eAAe;EACf,qBAAqB;EACrB,mBAAmB;ECCrB,aAAA;ADCA;AACA;EACE,cAAc;EACd,qBAAqB;EACrB,mBAAmB;EACnB,aAAa;AACf;AACA;EACE,eAAe;EACf,qBAAqB;EACrB,mBAAmB;EACnB,aAAa;AACf;AACA;EACE,aAAa;EACb,qBAAqB;EACrB,mBAAmB;EACnB,aAAa;AACf;AACA;EACE,gBAAgB;EAChB,qBAAqB;EACrB,mBAAmB;EACnB,aAAa;AACf;AACA;EACE,aAAa;EACb,qBAAqB;EACrB,mBAAmB;EACnB,aAAa;AACf;AACA;EACE,UAAU;EACV,WAAW;EACX,sBAAsB;EACtB,oBAAoB;EACpB,kBAAkB;EAClB,aAAa;EACb,oBAAoB;EACpB,cAAc;EACd,iBAAiB;EACjB,mCAAmC;EACnC,gCAAgC;EAChC,sEAAsE;AACxE;AACA;EACE,cAAc;EACd,qBAAqB;EACrB,kBAAkB;EAClB,oBAAoB;EACpB,kBAAkB;AACpB;AACA;EACE,cAAc;EACd,qBAAqB;EACrB,mBAAmB;EACnB,aAAa;EACb,iBAAiB;EACjB,mBAAmB;EACnB,cAAc;AAChB;AACA;EACE,eAAe;EACf,qBAAqB;EACrB,mBAAmB;EACnB,aAAa;EACb,uBAAuB;EACvB,mBAAmB;AACrB;AACA;EACE,gBAAgB;EAChB,qBAAqB;EACrB,mBAAmB;EACnB,aAAa;EACb,gBAAgB;EAChB,mBAAmB;AACrB;AACA;EACE,eAAe;EACf,qBAAqB;EACrB,mBAAmB;EACnB,aAAa;EACb,kBAAkB;EAClB,mBAAmB;AACrB;AACA;EACE,gBAAgB;EAChB,qBAAqB;EACrB,mBAAmB;EACnB,aAAa;EACb,gBAAgB;EAChB,mBAAmB;AACrB;AACA;EACE,kBAAkB;EAClB,oBAAoB;EACpB,kBAAkB;AACpB;AACA;EACE,kBAAkB;EAClB,QAAQ;EACR,OAAO;EACP,SAAS;EACT,UAAU;EACV,aAAa;AACf;AACA;EACE,gBAAgB;EAChB,WAAW;EACX,YAAY;EACZ,sBAAsB;EACtB,oBAAoB;EACpB,kBAAkB;EAClB,aAAa;EACb,oBAAoB;AACtB;AACA;EACE,cAAc;EACd,qBAAqB;EACrB,oBAAoB;EACpB,kBAAkB;EAClB,kBAAkB;AACpB","file":"Know.vue","sourcesContent":[".view {\n  background-color: black;\n  display: grid;\n  position: relative;\n  grid-template-columns: 33%  33% 34%;\n  grid-template-rows: 33%  33% 34%;\n  grid-template-areas: \"nw   north ne\" \"west cen   east\" \"sw   south se\";\n  justify-items: center;\n  align-items: center;\n}\n.view .nw {\n  grid-area: nw;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n}\n.view .north {\n  grid-area: north;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n}\n.view .ne {\n  grid-area: ne;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n}\n.view .west {\n  grid-area: west;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n}\n.view .cen {\n  grid-area: cen;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n}\n.view .east {\n  grid-area: east;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n}\n.view .sw {\n  grid-area: sw;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n}\n.view .south {\n  grid-area: south;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n}\n.view .se {\n  grid-area: se;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n}\n.view .pane {\n  width: 90%;\n  height: 80%;\n  background-color: #603;\n  justify-self: center;\n  align-self: center;\n  display: grid;\n  border-radius: 0.5em;\n  font-size: 3vh;\n  font-weight: bold;\n  grid-template-columns: 33%  33% 34%;\n  grid-template-rows: 33%  33% 34%;\n  grid-template-areas: \"nw   north ne\" \"west cen   east\" \"sw   south se\";\n}\n.view .pane .name {\n  font-size: 2em;\n  background-color: tan;\n  text-align: center;\n  justify-self: center;\n  align-self: center;\n}\n.view .pane .cen {\n  grid-area: cen;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n  background: coral;\n  border-radius: 36px;\n  font-size: 4vh;\n}\n.view .pane .west {\n  grid-area: west;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n  background: springgreen;\n  border-radius: 36px;\n}\n.view .pane .north {\n  grid-area: north;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n  background: gold;\n  border-radius: 36px;\n}\n.view .pane .east {\n  grid-area: east;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n  background: salmon;\n  border-radius: 36px;\n}\n.view .pane .south {\n  grid-area: south;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n  background: peru;\n  border-radius: 36px;\n}\n.view .pane div div {\n  text-align: center;\n  justify-self: center;\n  align-self: center;\n}\n.view .all {\n  position: absolute;\n  left: 3%;\n  top: 6%;\n  right: 3%;\n  bottom: 6%;\n  display: grid;\n}\n.view .all .pane {\n  font-size: 1.5em;\n  width: 100%;\n  height: 100%;\n  background-color: #603;\n  justify-self: center;\n  align-self: center;\n  display: grid;\n  border-radius: 0.5em;\n}\n.view .all .pane .name {\n  font-size: 2em;\n  background-color: tan;\n  justify-self: center;\n  align-self: center;\n  text-align: center;\n}\n","\n<template>\n  <div class=\"view\">\n    <template v-for=\"prac in knows\">\n      <div :id=\"prac.name\"  v-if=\"isPrac(prac.name)\" :class=\"klass(prac.dir)\" :key=\"prac.name\">\n        <div class=\"pane\"><div class=\"cen\"><div>{{prac.name}}</div></div>\n          <template  v-for=\"disp in prac.disps\">\n            <div :class=\"disp.dir\"><div>{{disp.name}}</div></div>\n          </template>\n        </div>\n      </div>\n    </template>\n  </div>\n</template>\n\n<script type=\"module\">\n  export default {\n    data() {\n      return { prac:\"None\", all:true, knows:{} } },\n    methods: {\n      isPrac: function (prac) {\n        return this.prac===prac || this.all; },\n      onPrac: function (prac) {\n        if( prac==='Know' ) { this.all=true; } else { this.all=false; this.prac=prac; } },\n      klass: function(klas) {\n        return !this.all ? 'all' : klas; } },\n    mounted: function () {\n      this.knows = this.pracs('Know');\n      this.subscribe( 'Know', 'Know.vue', (prac) => this.onPrac(prac) ); } }\n</script>\n\n<style lang=\"less\">\n  @import \"View.less\";\n</style>\n\n"]}, media: undefined });

  };
  /* scoped */
  const __vue_scope_id__$a = undefined;
  /* module identifier */
  const __vue_module_identifier__$a = undefined;
  /* functional template */
  const __vue_is_functional_template__$a = false;
  /* style inject SSR */
  

  
  var Know = normalizeComponent_1(
    { render: __vue_render__$a, staticRenderFns: __vue_staticRenderFns__$a },
    __vue_inject_styles__$a,
    __vue_script__$a,
    __vue_scope_id__$a,
    __vue_is_functional_template__$a,
    __vue_module_identifier__$a,
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
//
//
//
//

var script$a = {
  data() {
    return { prac:"None", all:true, wises:{} } },
  methods: {
    isPrac: function (prac) {
      return this.prac===prac || this.all },
    onPrac: function (prac) {
      if( prac==='Wise' ) { this.all=true; } else { this.all=false; this.prac=prac; } },
    klass: function(klas) {
      return !this.all ? 'all' : klas; } },
  mounted: function () {
    this.wises = this.pracs('Wise');
    this.subscribe( 'Wise', 'Wise.vue', (prac) => this.onPrac(prac) ); } };

/* script */
const __vue_script__$b = script$a;

/* template */
var __vue_render__$b = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c(
    "div",
    { staticClass: "view" },
    [
      _vm._l(_vm.wises, function(prac) {
        return [
          _vm.isPrac(prac.name)
            ? _c(
                "div",
                {
                  key: prac.name,
                  class: _vm.klass(prac.dir),
                  attrs: { id: prac.name }
                },
                [
                  _c(
                    "div",
                    { staticClass: "pane" },
                    [
                      _c("div", { staticClass: "cen" }, [
                        _c("div", [_vm._v(_vm._s(prac.name))])
                      ]),
                      _vm._v(" "),
                      _vm._l(prac.disps, function(disp) {
                        return [
                          _c("div", { class: disp.dir }, [
                            _c("div", [_vm._v(_vm._s(disp.name))])
                          ])
                        ]
                      })
                    ],
                    2
                  )
                ]
              )
            : _vm._e()
        ]
      })
    ],
    2
  )
};
var __vue_staticRenderFns__$b = [];
__vue_render__$b._withStripped = true;

  /* style */
  const __vue_inject_styles__$b = function (inject) {
    if (!inject) return
    inject("data-v-bcc5d122_0", { source: ".view {\n  background-color: black;\n  display: grid;\n  position: relative;\n  grid-template-columns: 33%  33% 34%;\n  grid-template-rows: 33%  33% 34%;\n  grid-template-areas: \"nw   north ne\" \"west cen   east\" \"sw   south se\";\n  justify-items: center;\n  align-items: center;\n}\n.view .nw {\n  grid-area: nw;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n}\n.view .north {\n  grid-area: north;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n}\n.view .ne {\n  grid-area: ne;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n}\n.view .west {\n  grid-area: west;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n}\n.view .cen {\n  grid-area: cen;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n}\n.view .east {\n  grid-area: east;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n}\n.view .sw {\n  grid-area: sw;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n}\n.view .south {\n  grid-area: south;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n}\n.view .se {\n  grid-area: se;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n}\n.view .pane {\n  width: 90%;\n  height: 80%;\n  background-color: #603;\n  justify-self: center;\n  align-self: center;\n  display: grid;\n  border-radius: 0.5em;\n  font-size: 3vh;\n  font-weight: bold;\n  grid-template-columns: 33%  33% 34%;\n  grid-template-rows: 33%  33% 34%;\n  grid-template-areas: \"nw   north ne\" \"west cen   east\" \"sw   south se\";\n}\n.view .pane .name {\n  font-size: 2em;\n  background-color: tan;\n  text-align: center;\n  justify-self: center;\n  align-self: center;\n}\n.view .pane .cen {\n  grid-area: cen;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n  background: coral;\n  border-radius: 36px;\n  font-size: 4vh;\n}\n.view .pane .west {\n  grid-area: west;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n  background: springgreen;\n  border-radius: 36px;\n}\n.view .pane .north {\n  grid-area: north;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n  background: gold;\n  border-radius: 36px;\n}\n.view .pane .east {\n  grid-area: east;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n  background: salmon;\n  border-radius: 36px;\n}\n.view .pane .south {\n  grid-area: south;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n  background: peru;\n  border-radius: 36px;\n}\n.view .pane div div {\n  text-align: center;\n  justify-self: center;\n  align-self: center;\n}\n.view .all {\n  position: absolute;\n  left: 3%;\n  top: 6%;\n  right: 3%;\n  bottom: 6%;\n  display: grid;\n}\n.view .all .pane {\n  font-size: 1.5em;\n  width: 100%;\n  height: 100%;\n  background-color: #603;\n  justify-self: center;\n  align-self: center;\n  display: grid;\n  border-radius: 0.5em;\n}\n.view .all .pane .name {\n  font-size: 2em;\n  background-color: tan;\n  justify-self: center;\n  align-self: center;\n  text-align: center;\n}\n", map: {"version":3,"sources":["Wise.vue","/Users/ax/Documents/prj/aug/vue/muse/Wise.vue"],"names":[],"mappings":"AAAA;EACE,uBAAuB;EACvB,aAAa;EACb,kBAAkB;EAClB,mCAAmC;EACnC,gCAAgC;EAChC,sEAAsE;EACtE,qBAAqB;EACrB,mBAAmB;AACrB;AACA;EACE,aAAa;EACb,qBAAqB;EACrB,mBAAmB;EACnB,aAAa;AACf;AACA;EACE,gBAAgB;EAChB,qBAAqB;EACrB,mBAAmB;EACnB,aAAa;AACf;AACA;EACE,aAAa;EACb,qBAAqB;EACrB,mBAAmB;EACnB,aAAa;AACf;AACA;EACE,eAAe;EACf,qBAAqB;EACrB,mBAAmB;ECCrB,aAAA;ADCA;AACA;EACE,cAAc;EACd,qBAAqB;EACrB,mBAAmB;EACnB,aAAa;AACf;AACA;EACE,eAAe;EACf,qBAAqB;EACrB,mBAAmB;EACnB,aAAa;AACf;AACA;EACE,aAAa;EACb,qBAAqB;EACrB,mBAAmB;EACnB,aAAa;AACf;AACA;EACE,gBAAgB;EAChB,qBAAqB;EACrB,mBAAmB;EACnB,aAAa;AACf;AACA;EACE,aAAa;EACb,qBAAqB;EACrB,mBAAmB;EACnB,aAAa;AACf;AACA;EACE,UAAU;EACV,WAAW;EACX,sBAAsB;EACtB,oBAAoB;EACpB,kBAAkB;EAClB,aAAa;EACb,oBAAoB;EACpB,cAAc;EACd,iBAAiB;EACjB,mCAAmC;EACnC,gCAAgC;EAChC,sEAAsE;AACxE;AACA;EACE,cAAc;EACd,qBAAqB;EACrB,kBAAkB;EAClB,oBAAoB;EACpB,kBAAkB;AACpB;AACA;EACE,cAAc;EACd,qBAAqB;EACrB,mBAAmB;EACnB,aAAa;EACb,iBAAiB;EACjB,mBAAmB;EACnB,cAAc;AAChB;AACA;EACE,eAAe;EACf,qBAAqB;EACrB,mBAAmB;EACnB,aAAa;EACb,uBAAuB;EACvB,mBAAmB;AACrB;AACA;EACE,gBAAgB;EAChB,qBAAqB;EACrB,mBAAmB;EACnB,aAAa;EACb,gBAAgB;EAChB,mBAAmB;AACrB;AACA;EACE,eAAe;EACf,qBAAqB;EACrB,mBAAmB;EACnB,aAAa;EACb,kBAAkB;EAClB,mBAAmB;AACrB;AACA;EACE,gBAAgB;EAChB,qBAAqB;EACrB,mBAAmB;EACnB,aAAa;EACb,gBAAgB;EAChB,mBAAmB;AACrB;AACA;EACE,kBAAkB;EAClB,oBAAoB;EACpB,kBAAkB;AACpB;AACA;EACE,kBAAkB;EAClB,QAAQ;EACR,OAAO;EACP,SAAS;EACT,UAAU;EACV,aAAa;AACf;AACA;EACE,gBAAgB;EAChB,WAAW;EACX,YAAY;EACZ,sBAAsB;EACtB,oBAAoB;EACpB,kBAAkB;EAClB,aAAa;EACb,oBAAoB;AACtB;AACA;EACE,cAAc;EACd,qBAAqB;EACrB,oBAAoB;EACpB,kBAAkB;EAClB,kBAAkB;AACpB","file":"Wise.vue","sourcesContent":[".view {\n  background-color: black;\n  display: grid;\n  position: relative;\n  grid-template-columns: 33%  33% 34%;\n  grid-template-rows: 33%  33% 34%;\n  grid-template-areas: \"nw   north ne\" \"west cen   east\" \"sw   south se\";\n  justify-items: center;\n  align-items: center;\n}\n.view .nw {\n  grid-area: nw;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n}\n.view .north {\n  grid-area: north;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n}\n.view .ne {\n  grid-area: ne;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n}\n.view .west {\n  grid-area: west;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n}\n.view .cen {\n  grid-area: cen;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n}\n.view .east {\n  grid-area: east;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n}\n.view .sw {\n  grid-area: sw;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n}\n.view .south {\n  grid-area: south;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n}\n.view .se {\n  grid-area: se;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n}\n.view .pane {\n  width: 90%;\n  height: 80%;\n  background-color: #603;\n  justify-self: center;\n  align-self: center;\n  display: grid;\n  border-radius: 0.5em;\n  font-size: 3vh;\n  font-weight: bold;\n  grid-template-columns: 33%  33% 34%;\n  grid-template-rows: 33%  33% 34%;\n  grid-template-areas: \"nw   north ne\" \"west cen   east\" \"sw   south se\";\n}\n.view .pane .name {\n  font-size: 2em;\n  background-color: tan;\n  text-align: center;\n  justify-self: center;\n  align-self: center;\n}\n.view .pane .cen {\n  grid-area: cen;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n  background: coral;\n  border-radius: 36px;\n  font-size: 4vh;\n}\n.view .pane .west {\n  grid-area: west;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n  background: springgreen;\n  border-radius: 36px;\n}\n.view .pane .north {\n  grid-area: north;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n  background: gold;\n  border-radius: 36px;\n}\n.view .pane .east {\n  grid-area: east;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n  background: salmon;\n  border-radius: 36px;\n}\n.view .pane .south {\n  grid-area: south;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n  background: peru;\n  border-radius: 36px;\n}\n.view .pane div div {\n  text-align: center;\n  justify-self: center;\n  align-self: center;\n}\n.view .all {\n  position: absolute;\n  left: 3%;\n  top: 6%;\n  right: 3%;\n  bottom: 6%;\n  display: grid;\n}\n.view .all .pane {\n  font-size: 1.5em;\n  width: 100%;\n  height: 100%;\n  background-color: #603;\n  justify-self: center;\n  align-self: center;\n  display: grid;\n  border-radius: 0.5em;\n}\n.view .all .pane .name {\n  font-size: 2em;\n  background-color: tan;\n  justify-self: center;\n  align-self: center;\n  text-align: center;\n}\n","\n<template>\n  <div class=\"view\">\n    <template v-for=\"prac in wises\">\n      <div :id=\"prac.name\"  v-if=\"isPrac(prac.name)\" :class=\"klass(prac.dir)\" :key=\"prac.name\">\n        <div class=\"pane\"><div class=\"cen\"><div>{{prac.name}}</div></div>\n          <template  v-for=\"disp in prac.disps\">\n            <div :class=\"disp.dir\"><div>{{disp.name}}</div></div>\n          </template>\n        </div>\n      </div>\n    </template>\n  </div>\n</template>\n\n<script type=\"module\">\n  export default {\n    data() {\n      return { prac:\"None\", all:true, wises:{} } },\n    methods: {\n      isPrac: function (prac) {\n        return this.prac===prac || this.all },\n      onPrac: function (prac) {\n        if( prac==='Wise' ) { this.all=true; } else { this.all=false; this.prac=prac; } },\n      klass: function(klas) {\n        return !this.all ? 'all' : klas; } },\n    mounted: function () {\n      this.wises = this.pracs('Wise');\n      this.subscribe( 'Wise', 'Wise.vue', (prac) => this.onPrac(prac) ); } }\n</script>\n\n<style lang=\"less\">\n  @import \"View.less\";\n</style>\n\n"]}, media: undefined });

  };
  /* scoped */
  const __vue_scope_id__$b = undefined;
  /* module identifier */
  const __vue_module_identifier__$b = undefined;
  /* functional template */
  const __vue_is_functional_template__$b = false;
  /* style inject SSR */
  

  
  var Wise = normalizeComponent_1(
    { render: __vue_render__$b, staticRenderFns: __vue_staticRenderFns__$b },
    __vue_inject_styles__$b,
    __vue_script__$b,
    __vue_scope_id__$b,
    __vue_is_functional_template__$b,
    __vue_module_identifier__$b,
    browser,
    undefined
  );

//

let Dash = {
    name: 'dash',
    components: {
      'd-logo':Logo, 'd-navb':Navb, 'd-find':Find,
      'd-tocs':Tocs$1, 'd-view':View, 'd-side':Side,
      'd-pref':Pref, 'd-foot':Foot, 'd-trak':Trak } };
Dash.Info = Info;
Dash.Know = Know;
Dash.Wise = Wise;

/* script */
const __vue_script__$c = Dash;

/* template */
var __vue_render__$c = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c(
    "div",
    { staticClass: "dash" },
    [
      _c("d-logo", { attrs: { id: "logo" } }),
      _vm._v(" "),
      _c("d-navb", { attrs: { id: "navb" } }),
      _vm._v(" "),
      _c("d-find", { attrs: { id: "find" } }),
      _vm._v(" "),
      _c("d-tocs", { attrs: { id: "tocs" } }),
      _vm._v(" "),
      _c("d-view", { attrs: { id: "view" } }),
      _vm._v(" "),
      _c("d-side", { attrs: { id: "side" } }),
      _vm._v(" "),
      _c("d-pref", { attrs: { id: "pref" } }),
      _vm._v(" "),
      _c("d-foot", { attrs: { id: "foot" } }),
      _vm._v(" "),
      _c("d-trak", { attrs: { id: "trak" } })
    ],
    1
  )
};
var __vue_staticRenderFns__$c = [];
__vue_render__$c._withStripped = true;

  /* style */
  const __vue_inject_styles__$c = function (inject) {
    if (!inject) return
    inject("data-v-a1ff6b70_0", { source: ".dash {\n  font-family: Roboto, sans-serif;\n  position: absolute;\n  left: 0;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  display: grid;\n  grid-template-columns: 140px 1fr 50px;\n  grid-template-rows: 50px 1fr 50px;\n  grid-template-areas: \"logo navb find\" \"tocs view side\" \"pref foot trak\";\n}\n.dash #logo {\n  grid-area: logo;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n}\n.dash #navb {\n  grid-area: navb;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n}\n.dash #find {\n  grid-area: find;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n}\n.dash #tocs {\n  grid-area: tocs;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n}\n.dash #view {\n  grid-area: view;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n}\n.dash #side {\n  grid-area: side;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n}\n.dash #pref {\n  grid-area: pref;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n}\n.dash #foot {\n  grid-area: foot;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n}\n.dash #trak {\n  grid-area: trak;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n}\n", map: {"version":3,"sources":["Dash.vue","/Users/ax/Documents/prj/aug/vue/dash/Dash.vue"],"names":[],"mappings":"AAAA;EACE,+BAA+B;EAC/B,kBAAkB;EAClB,OAAO;EACP,MAAM;EACN,QAAQ;EACR,SAAS;EACT,aAAa;EACb,qCAAqC;EACrC,iCAAiC;EACjC,uEAAuE;AACzE;AACA;EACE,eAAe;EACf,qBAAqB;EACrB,mBAAmB;EACnB,aAAa;AACf;AACA;EACE,eAAe;EACf,qBAAqB;EACrB,mBAAmB;EACnB,aAAa;AACf;AACA;EACE,eAAe;EACf,qBAAqB;EACrB,mBAAmB;EACnB,aAAa;AACf;AACA;EACE,eAAe;EACf,qBAAqB;EACrB,mBAAmB;EACnB,aAAa;AACf;AACA;EACE,eAAe;EACf,qBAAqB;EACrB,mBAAmB;EACnB,aAAa;AACf;AACA;EACE,eAAe;EACf,qBAAqB;EACrB,mBAAmB;EACnB,aAAa;AACf;AACA;ECCA,eAAA;EACA,qBAAA;EACA,mBAAA;EACA,aAAA;AACA;AACA;EACA,eAAA;EACA,qBAAA;EDCE,mBAAmB;ECCrB,aAAA;AACA;AACA;EACA,eAAA;EACA,qBAAA;EACA,mBAAA;EACA,aAAA;AACA","file":"Dash.vue","sourcesContent":[".dash {\n  font-family: Roboto, sans-serif;\n  position: absolute;\n  left: 0;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  display: grid;\n  grid-template-columns: 140px 1fr 50px;\n  grid-template-rows: 50px 1fr 50px;\n  grid-template-areas: \"logo navb find\" \"tocs view side\" \"pref foot trak\";\n}\n.dash #logo {\n  grid-area: logo;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n}\n.dash #navb {\n  grid-area: navb;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n}\n.dash #find {\n  grid-area: find;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n}\n.dash #tocs {\n  grid-area: tocs;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n}\n.dash #view {\n  grid-area: view;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n}\n.dash #side {\n  grid-area: side;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n}\n.dash #pref {\n  grid-area: pref;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n}\n.dash #foot {\n  grid-area: foot;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n}\n.dash #trak {\n  grid-area: trak;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n}\n","\n<template>\n  <div class=\"dash\">\n    <d-logo id=\"logo\"></d-logo>\n    <d-navb id=\"navb\"></d-navb>\n    <d-find id=\"find\"></d-find>\n    <d-tocs id=\"tocs\"></d-tocs>\n    <d-view id=\"view\"></d-view>\n    <d-side id=\"side\"></d-side>\n    <d-pref id=\"pref\"></d-pref>\n    <d-foot id=\"foot\"></d-foot>\n    <d-trak id=\"trak\"></d-trak>\n  </div>\n</template>\n\n<script type=\"module\">\n  \n  import Logo from './Logo.vue';\n  import Navb from './Navb.vue';\n  import Find from './Find.vue';\n  import Tocs from './Tocs.vue';\n  import View from './View.vue';\n  import Side from './Side.vue';\n  import Pref from './Pref.vue';\n  import Foot from './Foot.vue';\n  import Trak from './Trak.vue';\n  \n  let Dash = {\n      name: 'dash',\n      components: {\n        'd-logo':Logo, 'd-navb':Navb, 'd-find':Find,\n        'd-tocs':Tocs, 'd-view':View, 'd-side':Side,\n        'd-pref':Pref, 'd-foot':Foot, 'd-trak':Trak } };\n\n  // Static imports for minimizing build steps in dev.\n  // Dash.....vue components exported to Router\n  import Info from '../muse/Info.vue';\n  import Know from '../muse/Know.vue';\n  import Wise from '../muse/Wise.vue';\n  Dash.Info = Info;\n  Dash.Know = Know;\n  Dash.Wise = Wise;\n \n  export default Dash;\n  \n</script>\n\n<style lang=\"less\">\n\n   .dash { font-family:Roboto, sans-serif;\n     position:absolute; left:0; top:0; right:0; bottom:0; display:grid;\n     grid-template-columns: 140px 1fr 50px;\n     grid-template-rows:     50px 1fr 50px;\n     grid-template-areas:\n       \"logo navb find\"\n       \"tocs view side\"\n       \"pref foot trak\";\n\n    #logo { grid-area:logo; justify-self:stretch; align-self:stretch; display:grid; }\n    #navb { grid-area:navb; justify-self:stretch; align-self:stretch; display:grid; }\n    #find { grid-area:find; justify-self:stretch; align-self:stretch; display:grid; }\n    #tocs { grid-area:tocs; justify-self:stretch; align-self:stretch; display:grid; }\n    #view { grid-area:view; justify-self:stretch; align-self:stretch; display:grid; }\n    #side { grid-area:side; justify-self:stretch; align-self:stretch; display:grid; }\n    #pref { grid-area:pref; justify-self:stretch; align-self:stretch; display:grid; }\n    #foot { grid-area:foot; justify-self:stretch; align-self:stretch; display:grid; }\n    #trak { grid-area:trak; justify-self:stretch; align-self:stretch; display:grid; } }\n  \n</style>\n"]}, media: undefined });

  };
  /* scoped */
  const __vue_scope_id__$c = undefined;
  /* module identifier */
  const __vue_module_identifier__$c = undefined;
  /* functional template */
  const __vue_is_functional_template__$c = false;
  /* style inject SSR */
  

  
  var Dash$1 = normalizeComponent_1(
    { render: __vue_render__$c, staticRenderFns: __vue_staticRenderFns__$c },
    __vue_inject_styles__$c,
    __vue_script__$c,
    __vue_scope_id__$c,
    __vue_is_functional_template__$c,
    __vue_module_identifier__$c,
    browser,
    undefined
  );

export default Dash$1;
