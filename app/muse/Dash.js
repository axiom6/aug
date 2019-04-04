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
    inject("data-v-c5a33bc6_0", { source: ".logo {\n  background-color: black;\n}\n.logo img {\n  width: 140px;\n  height: 50px;\n}\n", map: {"version":3,"sources":["Logo.vue"],"names":[],"mappings":"AAAA;EACE,uBAAuB;AACzB;AACA;EACE,YAAY;EACZ,YAAY;AACd","file":"Logo.vue","sourcesContent":[".logo {\n  background-color: black;\n}\n.logo img {\n  width: 140px;\n  height: 50px;\n}\n"]}, media: undefined });

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
    inject("data-v-20da0a6a_0", { source: ".navb {\n  background-color: darkgrey;\n}\n", map: {"version":3,"sources":["Navb.vue"],"names":[],"mappings":"AAAA;EACE,0BAA0B;AAC5B","file":"Navb.vue","sourcesContent":[".navb {\n  background-color: darkgrey;\n}\n"]}, media: undefined });

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
    inject("data-v-77e50730_0", { source: ".find {\n  background-color: black;\n}\n", map: {"version":3,"sources":["Find.vue"],"names":[],"mappings":"AAAA;EACE,uBAAuB;AACzB","file":"Find.vue","sourcesContent":[".find {\n  background-color: black;\n}\n"]}, media: undefined });

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
//
//
//
//
//

let Tocs = {
  methods: {
    doSelect: function (select) {
      console.log( 'tocs.vue', select );
      this.publish("Select",   select ); }
  } };

/* script */
const __vue_script__$3 = Tocs;

/* template */
var __vue_render__$3 = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c("div", { staticClass: "tocs" }, [
    _c("ul", [
      _c(
        "li",
        [_c("router-link", { attrs: { to: "/info" } }, [_vm._v("Info")])],
        1
      ),
      _vm._v(" "),
      _c(
        "li",
        [_c("router-link", { attrs: { to: "/know" } }, [_vm._v("Know")])],
        1
      ),
      _vm._v(" "),
      _c(
        "li",
        [_c("router-link", { attrs: { to: "/wise" } }, [_vm._v("Wise")])],
        1
      )
    ])
  ])
};
var __vue_staticRenderFns__$3 = [];
__vue_render__$3._withStripped = true;

  /* style */
  const __vue_inject_styles__$3 = function (inject) {
    if (!inject) return
    inject("data-v-cac46602_0", { source: ".tocs {\n  background-color: darkgrey;\n}\n.tocs ul {\n  margin: 0;\n  padding: 0;\n  list-style: none;\n}\n.tocs ul li {\n  margin: 0;\n  background-color: black;\n  color: white;\n  border: white solid 1px;\n  padding-left: 0.25em;\n}\n.tocs ul li a {\n  color: white;\n  text-decoration: none;\n}\n.tocs ul li:hover {\n  margin: 0;\n  background-color: white;\n  color: black;\n  border: white solid 1px;\n}\n.tocs ul li:hover a {\n  color: black;\n  text-decoration: none;\n}\n", map: {"version":3,"sources":["Tocs.vue"],"names":[],"mappings":"AAAA;EACE,0BAA0B;AAC5B;AACA;EACE,SAAS;EACT,UAAU;EACV,gBAAgB;AAClB;AACA;EACE,SAAS;EACT,uBAAuB;EACvB,YAAY;EACZ,uBAAuB;EACvB,oBAAoB;AACtB;AACA;EACE,YAAY;EACZ,qBAAqB;AACvB;AACA;EACE,SAAS;EACT,uBAAuB;EACvB,YAAY;EACZ,uBAAuB;AACzB;AACA;EACE,YAAY;EACZ,qBAAqB;AACvB","file":"Tocs.vue","sourcesContent":[".tocs {\n  background-color: darkgrey;\n}\n.tocs ul {\n  margin: 0;\n  padding: 0;\n  list-style: none;\n}\n.tocs ul li {\n  margin: 0;\n  background-color: black;\n  color: white;\n  border: white solid 1px;\n  padding-left: 0.25em;\n}\n.tocs ul li a {\n  color: white;\n  text-decoration: none;\n}\n.tocs ul li:hover {\n  margin: 0;\n  background-color: white;\n  color: black;\n  border: white solid 1px;\n}\n.tocs ul li:hover a {\n  color: black;\n  text-decoration: none;\n}\n"]}, media: undefined });

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

var script$3 = {
};

/* script */
const __vue_script__$4 = script$3;

/* template */
var __vue_render__$4 = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c("router-view")
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
    inject("data-v-585a5ed0_0", { source: ".side {\n  background-color: darkgrey;\n}\n", map: {"version":3,"sources":["Side.vue"],"names":[],"mappings":"AAAA;EACE,0BAA0B;AAC5B","file":"Side.vue","sourcesContent":[".side {\n  background-color: darkgrey;\n}\n"]}, media: undefined });

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
    inject("data-v-dc85fe1c_0", { source: ".pref {\n  background-color: black;\n}\n", map: {"version":3,"sources":["Pref.vue"],"names":[],"mappings":"AAAA;EACE,uBAAuB;AACzB","file":"Pref.vue","sourcesContent":[".pref {\n  background-color: black;\n}\n"]}, media: undefined });

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
    inject("data-v-debe8272_0", { source: ".foot {\n  background-color: darkgrey;\n}\n", map: {"version":3,"sources":["Foot.vue"],"names":[],"mappings":"AAAA;EACE,0BAA0B;AAC5B","file":"Foot.vue","sourcesContent":[".foot {\n  background-color: darkgrey;\n}\n"]}, media: undefined });

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
    inject("data-v-1ab71cff_0", { source: "\n.trak { background-color:black;\n}\n", map: {"version":3,"sources":["/Users/ax/Documents/prj/aug/vue/dash/Trak.vue"],"names":[],"mappings":";AAUA,QAAA,sBAAA;AAAA","file":"Trak.vue","sourcesContent":["\n<template>\n  <div class=\"trak\"></div>\n</template>\n\n<script>\n  export default {}\n</script>\n\n<style type=\"module\">\n     .trak { background-color:black; }\n</style>\n"]}, media: undefined });

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
  data() { return { sel:"Wise" } },
  methods: {
    onSelect: function (select) {
      this.sel =  select;
      console.log( 'Wise.vue', select ); } },
  mounted: function () {
    console.log( 'view.vue', 'mounted' );
    this.subscribe( 'Select', 'view.vue', (select) => this.onSelect(select) ); }
};

/* script */
const __vue_script__$9 = script$8;

/* template */
var __vue_render__$9 = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _vm._m(0)
};
var __vue_staticRenderFns__$9 = [
  function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c("div", { staticClass: "view" }, [
      _c("div", { staticClass: "nw", attrs: { id: "Collab" } }, [
        _c("div", { staticClass: "pane" }, [
          _c("div", { staticClass: "name" }, [_vm._v("Collab")])
        ])
      ]),
      _vm._v(" "),
      _c("div", { staticClass: "north", attrs: { id: "Domain" } }, [
        _c("div", { staticClass: "pane" }, [
          _c("div", { staticClass: "name" }, [_vm._v("Domain")])
        ])
      ]),
      _vm._v(" "),
      _c("div", { staticClass: "ne", attrs: { id: "Discover" } }, [
        _c("div", { staticClass: "pane" }, [
          _c("div", { staticClass: "name" }, [_vm._v("Discover")])
        ])
      ]),
      _vm._v(" "),
      _c("div", { staticClass: "west", attrs: { id: "Adapt" } }, [
        _c("div", { staticClass: "pane" }, [
          _c("div", { staticClass: "name" }, [_vm._v("Adapt")])
        ])
      ]),
      _vm._v(" "),
      _c("div", { staticClass: "cen", attrs: { id: "Tech" } }, [
        _c("div", { staticClass: "pane" }, [
          _c("div", { staticClass: "name" }, [_vm._v("Tech")])
        ])
      ]),
      _vm._v(" "),
      _c("div", { staticClass: "east", attrs: { id: "Benefit" } }, [
        _c("div", { staticClass: "pane" }, [
          _c("div", { staticClass: "name" }, [_vm._v("Benefit")])
        ])
      ]),
      _vm._v(" "),
      _c("div", { staticClass: "sw", attrs: { id: "Change" } }, [
        _c("div", { staticClass: "pane" }, [
          _c("div", { staticClass: "name" }, [_vm._v("Change")])
        ])
      ]),
      _vm._v(" "),
      _c("div", { staticClass: "south", attrs: { id: "Deliver" } }, [
        _c("div", { staticClass: "pane" }, [
          _c("div", { staticClass: "name" }, [_vm._v("Deliver")])
        ])
      ]),
      _vm._v(" "),
      _c("div", { staticClass: "se", attrs: { id: "Govern" } }, [
        _c("div", { staticClass: "pane" }, [
          _c("div", { staticClass: "name" }, [_vm._v("Govern")])
        ])
      ])
    ])
  }
];
__vue_render__$9._withStripped = true;

  /* style */
  const __vue_inject_styles__$9 = function (inject) {
    if (!inject) return
    inject("data-v-2dcaf994_0", { source: ".view {\n  background-color: grey;\n  display: grid;\n  grid-template-columns: 33%  33% 34%;\n  grid-template-rows: 33%  33% 34%;\n  grid-template-areas: \"nw   north ne\" \"west cen   east\" \"sw   south se\";\n  justify-items: center;\n  align-items: center;\n}\n.view .nw {\n  grid-area: nw;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n}\n.view .north {\n  grid-area: north;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n}\n.view .ne {\n  grid-area: ne;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n}\n.view .west {\n  grid-area: west;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n}\n.view .cen {\n  grid-area: cen;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n}\n.view .east {\n  grid-area: east;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n}\n.view .sw {\n  grid-area: sw;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n}\n.view .south {\n  grid-area: south;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n}\n.view .se {\n  grid-area: se;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n}\n.view .pane {\n  font-size: 1.5em;\n  width: 90%;\n  height: 80%;\n  background-color: tan;\n  justify-self: center;\n  align-self: center;\n  display: grid;\n  border-radius: 0.5em;\n}\n.view .pane .name {\n  font-size: 2em;\n  background-color: tan;\n  justify-self: center;\n  align-self: center;\n  text-align: center;\n}\n", map: {"version":3,"sources":["Info.vue","/Users/ax/Documents/prj/aug/vue/muse/Info.vue"],"names":[],"mappings":"AAAA;EACE,sBAAsB;EACtB,aAAa;EACb,mCAAmC;EACnC,gCAAgC;EAChC,sEAAsE;EACtE,qBAAqB;EACrB,mBAAmB;AACrB;AACA;EACE,aAAa;EACb,qBAAqB;EACrB,mBAAmB;EACnB,aAAa;AACf;AACA;EACE,gBAAgB;EAChB,qBAAqB;EACrB,mBAAmB;EACnB,aAAa;AACf;AACA;EACE,aAAa;EACb,qBAAqB;EACrB,mBAAmB;EACnB,aAAa;AACf;AACA;EACE,eAAe;ECCjB,qBAAA;EACA,mBAAA;EACA,aAAA;AACA;AACA;EACA,cAAA;EACA,qBAAA;EACA,mBAAA;EACA,aAAA;AACA;AACA;EACA,eAAA;EACA,qBAAA;EACA,mBAAA;EACA,aAAA;AACA;AACA;EACA,aAAA;EACA,qBAAA;EACA,mBAAA;EACA,aAAA;AACA;AACA;EDCE,gBAAgB;EAChB,qBAAqB;EACrB,mBAAmB;EACnB,aAAa;AACf;AACA;EACE,aAAa;EACb,qBAAqB;EACrB,mBAAmB;EACnB,aAAa;AACf;AACA;EACE,gBAAgB;EAChB,UAAU;EACV,WAAW;EACX,qBAAqB;EACrB,oBAAoB;EACpB,kBAAkB;EAClB,aAAa;EACb,oBAAoB;AACtB;AACA;EACE,cAAc;EACd,qBAAqB;EACrB,oBAAoB;EACpB,kBAAkB;EAClB,kBAAkB;AACpB","file":"Info.vue","sourcesContent":[".view {\n  background-color: grey;\n  display: grid;\n  grid-template-columns: 33%  33% 34%;\n  grid-template-rows: 33%  33% 34%;\n  grid-template-areas: \"nw   north ne\" \"west cen   east\" \"sw   south se\";\n  justify-items: center;\n  align-items: center;\n}\n.view .nw {\n  grid-area: nw;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n}\n.view .north {\n  grid-area: north;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n}\n.view .ne {\n  grid-area: ne;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n}\n.view .west {\n  grid-area: west;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n}\n.view .cen {\n  grid-area: cen;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n}\n.view .east {\n  grid-area: east;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n}\n.view .sw {\n  grid-area: sw;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n}\n.view .south {\n  grid-area: south;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n}\n.view .se {\n  grid-area: se;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n}\n.view .pane {\n  font-size: 1.5em;\n  width: 90%;\n  height: 80%;\n  background-color: tan;\n  justify-self: center;\n  align-self: center;\n  display: grid;\n  border-radius: 0.5em;\n}\n.view .pane .name {\n  font-size: 2em;\n  background-color: tan;\n  justify-self: center;\n  align-self: center;\n  text-align: center;\n}\n","\n<template>\n  <div class=\"view\">\n    <div id=\"Collab\"   class=\"nw\"     ><div class=\"pane\"><div class=\"name\">Collab</div></div></div>\n    <div id=\"Domain\"   class=\"north\"  ><div class=\"pane\"><div class=\"name\">Domain</div></div></div>\n    <div id=\"Discover\" class=\"ne\"     ><div class=\"pane\"><div class=\"name\">Discover</div></div></div>\n    <div id=\"Adapt\"    class=\"west\"   ><div class=\"pane\"><div class=\"name\">Adapt</div></div></div>\n    <div id=\"Tech\"     class=\"cen\"    ><div class=\"pane\"><div class=\"name\">Tech</div></div></div>\n    <div id=\"Benefit\"  class=\"east\"   ><div class=\"pane\"><div class=\"name\">Benefit</div></div></div>\n    <div id=\"Change\"   class=\"sw\"     ><div class=\"pane\"><div class=\"name\">Change</div></div></div>\n    <div id=\"Deliver\"   class=\"south\" ><div class=\"pane\"><div class=\"name\">Deliver</div></div></div>\n    <div id=\"Govern\"   class=\"se\"     ><div class=\"pane\"><div class=\"name\">Govern</div></div></div>\n  </div>\n</template>\n\n<script type=\"module\">\n  export default {\n    data() { return { sel:\"Wise\" } },\n    methods: {\n      onSelect: function (select) {\n        this.sel =  select;\n        console.log( 'Wise.vue', select ); } },\n    mounted: function () {\n      console.log( 'view.vue', 'mounted' );\n      this.subscribe( 'Select', 'view.vue', (select) => this.onSelect(select) ); }\n  }\n</script>\n\n<style lang=\"less\">\n  .view { background-color:grey;\n    display:grid;\n    grid-template-columns: 33%  33% 34%;\n    grid-template-rows:    33%  33% 34%;\n    grid-template-areas:\n      \"nw   north ne\"\n      \"west cen   east\"\n      \"sw   south se\";\n    justify-items:center; align-items:center;\n    .nw     { grid-area:nw;    justify-self:stretch; align-self:stretch; display:grid; }\n    .north  { grid-area:north; justify-self:stretch; align-self:stretch; display:grid; }\n    .ne     { grid-area:ne;    justify-self:stretch; align-self:stretch; display:grid; }\n    .west   { grid-area:west;  justify-self:stretch; align-self:stretch; display:grid; }\n    .cen    { grid-area:cen;   justify-self:stretch; align-self:stretch; display:grid; }\n    .east   { grid-area:east;  justify-self:stretch; align-self:stretch; display:grid; }\n    .sw     { grid-area:sw;    justify-self:stretch; align-self:stretch; display:grid; }\n    .south  { grid-area:south; justify-self:stretch; align-self:stretch; display:grid; }\n    .se     { grid-area:se;    justify-self:stretch; align-self:stretch; display:grid; }\n    .pane { font-size:1.5em; width:90%; height:80%; background-color:tan;\n      justify-self:center; align-self:center; display:grid; border-radius:0.5em; }\n    .pane .name  { font-size:2em; background-color:tan;\n      justify-self:center; align-self:center; text-align:center; }\n  }\n\n</style>\n\n"]}, media: undefined });

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
  data() { return { sel:"Info" } },
  methods: {
    onSelect: function (select) {
      this.sel =  select;
      console.log( 'view.vue', select ); } },
  mounted: function () {
    console.log( 'Know.vue', 'mounted' );
    this.subscribe( 'Select', 'view.vue', (select) => this.onSelect(select) ); }
};

/* script */
const __vue_script__$a = script$9;

/* template */
var __vue_render__$a = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _vm._m(0)
};
var __vue_staticRenderFns__$a = [
  function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c("div", { staticClass: "view" }, [
      _c("div", { staticClass: "nw", attrs: { id: "Humanity" } }, [
        _c("div", { staticClass: "pane" }, [
          _c("div", { staticClass: "name" }, [_vm._v("Humanity")])
        ])
      ]),
      _vm._v(" "),
      _c("div", { staticClass: "north", attrs: { id: "Science" } }, [
        _c("div", { staticClass: "pane" }, [
          _c("div", { staticClass: "name" }, [_vm._v("Science")])
        ])
      ]),
      _vm._v(" "),
      _c("div", { staticClass: "ne", attrs: { id: "Understand" } }, [
        _c("div", { staticClass: "pane" }, [
          _c("div", { staticClass: "name" }, [_vm._v("Understand")])
        ])
      ]),
      _vm._v(" "),
      _c("div", { staticClass: "west", attrs: { id: "Orchestrate" } }, [
        _c("div", { staticClass: "pane" }, [
          _c("div", { staticClass: "name" }, [_vm._v("Orchestrate")])
        ])
      ]),
      _vm._v(" "),
      _c("div", { staticClass: "cen", attrs: { id: "Cognition" } }, [
        _c("div", { staticClass: "pane" }, [
          _c("div", { staticClass: "name" }, [_vm._v("Cognition")])
        ])
      ]),
      _vm._v(" "),
      _c("div", { staticClass: "east", attrs: { id: "Reason" } }, [
        _c("div", { staticClass: "pane" }, [
          _c("div", { staticClass: "name" }, [_vm._v("Reason")])
        ])
      ]),
      _vm._v(" "),
      _c("div", { staticClass: "sw", attrs: { id: "Evolve" } }, [
        _c("div", { staticClass: "pane" }, [
          _c("div", { staticClass: "name" }, [_vm._v("Evolve")])
        ])
      ]),
      _vm._v(" "),
      _c("div", { staticClass: "south", attrs: { id: "Educate" } }, [
        _c("div", { staticClass: "pane" }, [
          _c("div", { staticClass: "name" }, [_vm._v("Educate")])
        ])
      ]),
      _vm._v(" "),
      _c("div", { staticClass: "se", attrs: { id: "Culture" } }, [
        _c("div", { staticClass: "pane" }, [
          _c("div", { staticClass: "name" }, [_vm._v("Culture")])
        ])
      ])
    ])
  }
];
__vue_render__$a._withStripped = true;

  /* style */
  const __vue_inject_styles__$a = function (inject) {
    if (!inject) return
    inject("data-v-3e9427d0_0", { source: ".view {\n  background-color: grey;\n  display: grid;\n  grid-template-columns: 33%  33% 34%;\n  grid-template-rows: 33%  33% 34%;\n  grid-template-areas: \"nw   north ne\" \"west cen   east\" \"sw   south se\";\n  justify-items: center;\n  align-items: center;\n}\n.view .nw {\n  grid-area: nw;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n}\n.view .north {\n  grid-area: north;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n}\n.view .ne {\n  grid-area: ne;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n}\n.view .west {\n  grid-area: west;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n}\n.view .cen {\n  grid-area: cen;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n}\n.view .east {\n  grid-area: east;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n}\n.view .sw {\n  grid-area: sw;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n}\n.view .south {\n  grid-area: south;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n}\n.view .se {\n  grid-area: se;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n}\n.view .pane {\n  font-size: 1.5em;\n  width: 90%;\n  height: 80%;\n  background-color: tan;\n  justify-self: center;\n  align-self: center;\n  display: grid;\n  border-radius: 0.5em;\n}\n.view .pane .name {\n  font-size: 2em;\n  background-color: tan;\n  justify-self: center;\n  align-self: center;\n  text-align: center;\n}\n", map: {"version":3,"sources":["Know.vue","/Users/ax/Documents/prj/aug/vue/muse/Know.vue"],"names":[],"mappings":"AAAA;EACE,sBAAsB;EACtB,aAAa;EACb,mCAAmC;EACnC,gCAAgC;EAChC,sEAAsE;EACtE,qBAAqB;EACrB,mBAAmB;AACrB;AACA;EACE,aAAa;EACb,qBAAqB;EACrB,mBAAmB;EACnB,aAAa;AACf;AACA;EACE,gBAAgB;EAChB,qBAAqB;EACrB,mBAAmB;EACnB,aAAa;AACf;AACA;EACE,aAAa;EACb,qBAAqB;EACrB,mBAAmB;EACnB,aAAa;AACf;AACA;EACE,eAAe;ECCjB,qBAAA;EACA,mBAAA;EACA,aAAA;AACA;AACA;EACA,cAAA;EACA,qBAAA;EACA,mBAAA;EACA,aAAA;AACA;AACA;EACA,eAAA;EACA,qBAAA;EACA,mBAAA;EACA,aAAA;AACA;AACA;EACA,aAAA;EACA,qBAAA;EACA,mBAAA;EACA,aAAA;AACA;AACA;EDCE,gBAAgB;EAChB,qBAAqB;EACrB,mBAAmB;EACnB,aAAa;AACf;AACA;EACE,aAAa;EACb,qBAAqB;EACrB,mBAAmB;EACnB,aAAa;AACf;AACA;EACE,gBAAgB;EAChB,UAAU;EACV,WAAW;EACX,qBAAqB;EACrB,oBAAoB;EACpB,kBAAkB;EAClB,aAAa;EACb,oBAAoB;AACtB;AACA;EACE,cAAc;EACd,qBAAqB;EACrB,oBAAoB;EACpB,kBAAkB;EAClB,kBAAkB;AACpB","file":"Know.vue","sourcesContent":[".view {\n  background-color: grey;\n  display: grid;\n  grid-template-columns: 33%  33% 34%;\n  grid-template-rows: 33%  33% 34%;\n  grid-template-areas: \"nw   north ne\" \"west cen   east\" \"sw   south se\";\n  justify-items: center;\n  align-items: center;\n}\n.view .nw {\n  grid-area: nw;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n}\n.view .north {\n  grid-area: north;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n}\n.view .ne {\n  grid-area: ne;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n}\n.view .west {\n  grid-area: west;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n}\n.view .cen {\n  grid-area: cen;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n}\n.view .east {\n  grid-area: east;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n}\n.view .sw {\n  grid-area: sw;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n}\n.view .south {\n  grid-area: south;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n}\n.view .se {\n  grid-area: se;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n}\n.view .pane {\n  font-size: 1.5em;\n  width: 90%;\n  height: 80%;\n  background-color: tan;\n  justify-self: center;\n  align-self: center;\n  display: grid;\n  border-radius: 0.5em;\n}\n.view .pane .name {\n  font-size: 2em;\n  background-color: tan;\n  justify-self: center;\n  align-self: center;\n  text-align: center;\n}\n","\n<template>\n  <div class=\"view\">\n    <div id=\"Humanity\"    class=\"nw\"     ><div class=\"pane\"><div class=\"name\">Humanity</div></div></div>\n    <div id=\"Science\"     class=\"north\"  ><div class=\"pane\"><div class=\"name\">Science</div></div></div>\n    <div id=\"Understand\"  class=\"ne\"     ><div class=\"pane\"><div class=\"name\">Understand</div></div></div>\n    <div id=\"Orchestrate\" class=\"west\"   ><div class=\"pane\"><div class=\"name\">Orchestrate</div></div></div>\n    <div id=\"Cognition\"   class=\"cen\"    ><div class=\"pane\"><div class=\"name\">Cognition</div></div></div>\n    <div id=\"Reason\"      class=\"east\"   ><div class=\"pane\"><div class=\"name\">Reason</div></div></div>\n    <div id=\"Evolve\"      class=\"sw\"     ><div class=\"pane\"><div class=\"name\">Evolve</div></div></div>\n    <div id=\"Educate\"     class=\"south\"  ><div class=\"pane\"><div class=\"name\">Educate</div></div></div>\n    <div id=\"Culture\"     class=\"se\"     ><div class=\"pane\"><div class=\"name\">Culture</div></div></div>\n  </div>\n</template>\n\n<script type=\"module\">\n  export default {\n    data() { return { sel:\"Info\" } },\n    methods: {\n      onSelect: function (select) {\n        this.sel =  select;\n        console.log( 'view.vue', select ); } },\n    mounted: function () {\n      console.log( 'Know.vue', 'mounted' );\n      this.subscribe( 'Select', 'view.vue', (select) => this.onSelect(select) ); }\n  }\n</script>\n\n<style lang=\"less\">\n  .view { background-color:grey;\n    display:grid;\n    grid-template-columns: 33%  33% 34%;\n    grid-template-rows:    33%  33% 34%;\n    grid-template-areas:\n      \"nw   north ne\"\n      \"west cen   east\"\n      \"sw   south se\";\n    justify-items:center; align-items:center;\n    .nw     { grid-area:nw;    justify-self:stretch; align-self:stretch; display:grid; }\n    .north  { grid-area:north; justify-self:stretch; align-self:stretch; display:grid; }\n    .ne     { grid-area:ne;    justify-self:stretch; align-self:stretch; display:grid; }\n    .west   { grid-area:west;  justify-self:stretch; align-self:stretch; display:grid; }\n    .cen    { grid-area:cen;   justify-self:stretch; align-self:stretch; display:grid; }\n    .east   { grid-area:east;  justify-self:stretch; align-self:stretch; display:grid; }\n    .sw     { grid-area:sw;    justify-self:stretch; align-self:stretch; display:grid; }\n    .south  { grid-area:south; justify-self:stretch; align-self:stretch; display:grid; }\n    .se     { grid-area:se;    justify-self:stretch; align-self:stretch; display:grid; }\n    .pane { font-size:1.5em; width:90%; height:80%; background-color:tan;\n      justify-self:center; align-self:center; display:grid; border-radius:0.5em; }\n    .pane .name  { font-size:2em; background-color:tan;\n      justify-self:center; align-self:center; text-align:center; }\n  }\n\n</style>\n\n"]}, media: undefined });

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
  data() { return { sel:"Info" } },
  methods: {
    onSelect: function (select) {
      this.sel =  select;
      console.log( 'view.vue', select ); } },
  mounted: function () {
    console.log( 'view.vue', 'mounted' );
    this.subscribe( 'Select', 'view.vue', (select) => this.onSelect(select) ); }
};

/* script */
const __vue_script__$b = script$a;

/* template */
var __vue_render__$b = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _vm._m(0)
};
var __vue_staticRenderFns__$b = [
  function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c("div", { staticClass: "view" }, [
      _c("div", { staticClass: "nw", attrs: { id: "Trust" } }, [
        _c("div", { staticClass: "pane" }, [
          _c("div", { staticClass: "name" }, [_vm._v("Trust")])
        ])
      ]),
      _vm._v(" "),
      _c("div", { staticClass: "north", attrs: { id: "Nature" } }, [
        _c("div", { staticClass: "pane" }, [
          _c("div", { staticClass: "name" }, [_vm._v("Nature")])
        ])
      ]),
      _vm._v(" "),
      _c("div", { staticClass: "ne", attrs: { id: "Truth" } }, [
        _c("div", { staticClass: "pane" }, [
          _c("div", { staticClass: "name" }, [_vm._v("Truth")])
        ])
      ]),
      _vm._v(" "),
      _c("div", { staticClass: "west", attrs: { id: "Experience" } }, [
        _c("div", { staticClass: "pane" }, [
          _c("div", { staticClass: "name" }, [_vm._v("Experience")])
        ])
      ]),
      _vm._v(" "),
      _c("div", { staticClass: "cen", attrs: { id: "Create" } }, [
        _c("div", { staticClass: "pane" }, [
          _c("div", { staticClass: "name" }, [_vm._v("Create")])
        ])
      ]),
      _vm._v(" "),
      _c("div", { staticClass: "east", attrs: { id: "Conscience" } }, [
        _c("div", { staticClass: "pane" }, [
          _c("div", { staticClass: "name" }, [_vm._v("Conscience")])
        ])
      ]),
      _vm._v(" "),
      _c("div", { staticClass: "sw", attrs: { id: "Emerge" } }, [
        _c("div", { staticClass: "pane" }, [
          _c("div", { staticClass: "name" }, [_vm._v("Emerge")])
        ])
      ]),
      _vm._v(" "),
      _c("div", { staticClass: "south", attrs: { id: "Inspire" } }, [
        _c("div", { staticClass: "pane" }, [
          _c("div", { staticClass: "name" }, [_vm._v("Inspire")])
        ])
      ]),
      _vm._v(" "),
      _c("div", { staticClass: "se", attrs: { id: "Actualize" } }, [
        _c("div", { staticClass: "pane" }, [
          _c("div", { staticClass: "name" }, [_vm._v("Actualize")])
        ])
      ])
    ])
  }
];
__vue_render__$b._withStripped = true;

  /* style */
  const __vue_inject_styles__$b = function (inject) {
    if (!inject) return
    inject("data-v-4da4fcfe_0", { source: ".view {\n  background-color: grey;\n  display: grid;\n  grid-template-columns: 33%  33% 34%;\n  grid-template-rows: 33%  33% 34%;\n  grid-template-areas: \"nw   north ne\" \"west cen   east\" \"sw   south se\";\n  justify-items: center;\n  align-items: center;\n}\n.view .nw {\n  grid-area: nw;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n}\n.view .north {\n  grid-area: north;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n}\n.view .ne {\n  grid-area: ne;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n}\n.view .west {\n  grid-area: west;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n}\n.view .cen {\n  grid-area: cen;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n}\n.view .east {\n  grid-area: east;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n}\n.view .sw {\n  grid-area: sw;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n}\n.view .south {\n  grid-area: south;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n}\n.view .se {\n  grid-area: se;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n}\n.view .pane {\n  font-size: 1.5em;\n  width: 90%;\n  height: 80%;\n  background-color: tan;\n  justify-self: center;\n  align-self: center;\n  display: grid;\n  border-radius: 0.5em;\n}\n.view .pane .name {\n  font-size: 2em;\n  background-color: tan;\n  justify-self: center;\n  align-self: center;\n  text-align: center;\n}\n", map: {"version":3,"sources":["Wise.vue","/Users/ax/Documents/prj/aug/vue/muse/Wise.vue"],"names":[],"mappings":"AAAA;EACE,sBAAsB;EACtB,aAAa;EACb,mCAAmC;EACnC,gCAAgC;EAChC,sEAAsE;EACtE,qBAAqB;EACrB,mBAAmB;AACrB;AACA;EACE,aAAa;EACb,qBAAqB;EACrB,mBAAmB;EACnB,aAAa;AACf;AACA;EACE,gBAAgB;EAChB,qBAAqB;EACrB,mBAAmB;EACnB,aAAa;AACf;AACA;EACE,aAAa;EACb,qBAAqB;EACrB,mBAAmB;EACnB,aAAa;AACf;AACA;EACE,eAAe;ECCjB,qBAAA;EACA,mBAAA;EACA,aAAA;AACA;AACA;EACA,cAAA;EACA,qBAAA;EACA,mBAAA;EACA,aAAA;AACA;AACA;EACA,eAAA;EACA,qBAAA;EACA,mBAAA;EACA,aAAA;AACA;AACA;EACA,aAAA;EACA,qBAAA;EACA,mBAAA;EACA,aAAA;AACA;AACA;EDCE,gBAAgB;EAChB,qBAAqB;EACrB,mBAAmB;EACnB,aAAa;AACf;AACA;EACE,aAAa;EACb,qBAAqB;EACrB,mBAAmB;EACnB,aAAa;AACf;AACA;EACE,gBAAgB;EAChB,UAAU;EACV,WAAW;EACX,qBAAqB;EACrB,oBAAoB;EACpB,kBAAkB;EAClB,aAAa;EACb,oBAAoB;AACtB;AACA;EACE,cAAc;EACd,qBAAqB;EACrB,oBAAoB;EACpB,kBAAkB;EAClB,kBAAkB;AACpB","file":"Wise.vue","sourcesContent":[".view {\n  background-color: grey;\n  display: grid;\n  grid-template-columns: 33%  33% 34%;\n  grid-template-rows: 33%  33% 34%;\n  grid-template-areas: \"nw   north ne\" \"west cen   east\" \"sw   south se\";\n  justify-items: center;\n  align-items: center;\n}\n.view .nw {\n  grid-area: nw;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n}\n.view .north {\n  grid-area: north;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n}\n.view .ne {\n  grid-area: ne;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n}\n.view .west {\n  grid-area: west;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n}\n.view .cen {\n  grid-area: cen;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n}\n.view .east {\n  grid-area: east;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n}\n.view .sw {\n  grid-area: sw;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n}\n.view .south {\n  grid-area: south;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n}\n.view .se {\n  grid-area: se;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n}\n.view .pane {\n  font-size: 1.5em;\n  width: 90%;\n  height: 80%;\n  background-color: tan;\n  justify-self: center;\n  align-self: center;\n  display: grid;\n  border-radius: 0.5em;\n}\n.view .pane .name {\n  font-size: 2em;\n  background-color: tan;\n  justify-self: center;\n  align-self: center;\n  text-align: center;\n}\n","\n<template>\n  <div class=\"view\">\n    <div id=\"Trust\"      class=\"nw\"     ><div class=\"pane\"><div class=\"name\">Trust</div></div></div>\n    <div id=\"Nature\"     class=\"north\"  ><div class=\"pane\"><div class=\"name\">Nature</div></div></div>\n    <div id=\"Truth\"      class=\"ne\"     ><div class=\"pane\"><div class=\"name\">Truth</div></div></div>\n    <div id=\"Experience\" class=\"west\"   ><div class=\"pane\"><div class=\"name\">Experience</div></div></div>\n    <div id=\"Create\"     class=\"cen\"    ><div class=\"pane\"><div class=\"name\">Create</div></div></div>\n    <div id=\"Conscience\" class=\"east\"   ><div class=\"pane\"><div class=\"name\">Conscience</div></div></div>\n    <div id=\"Emerge\"     class=\"sw\"     ><div class=\"pane\"><div class=\"name\">Emerge</div></div></div>\n    <div id=\"Inspire\"    class=\"south\"  ><div class=\"pane\"><div class=\"name\">Inspire</div></div></div>\n    <div id=\"Actualize\"  class=\"se\"     ><div class=\"pane\"><div class=\"name\">Actualize</div></div></div>\n  </div>\n</template>\n\n<script type=\"module\">\n  export default {\n    data() { return { sel:\"Info\" } },\n    methods: {\n      onSelect: function (select) {\n        this.sel =  select;\n        console.log( 'view.vue', select ); } },\n    mounted: function () {\n      console.log( 'view.vue', 'mounted' );\n      this.subscribe( 'Select', 'view.vue', (select) => this.onSelect(select) ); }\n  }\n</script>\n\n<style lang=\"less\">\n  .view { background-color:grey;\n    display:grid;\n    grid-template-columns: 33%  33% 34%;\n    grid-template-rows:    33%  33% 34%;\n    grid-template-areas:\n      \"nw   north ne\"\n      \"west cen   east\"\n      \"sw   south se\";\n    justify-items:center; align-items:center;\n    .nw     { grid-area:nw;    justify-self:stretch; align-self:stretch; display:grid; }\n    .north  { grid-area:north; justify-self:stretch; align-self:stretch; display:grid; }\n    .ne     { grid-area:ne;    justify-self:stretch; align-self:stretch; display:grid; }\n    .west   { grid-area:west;  justify-self:stretch; align-self:stretch; display:grid; }\n    .cen    { grid-area:cen;   justify-self:stretch; align-self:stretch; display:grid; }\n    .east   { grid-area:east;  justify-self:stretch; align-self:stretch; display:grid; }\n    .sw     { grid-area:sw;    justify-self:stretch; align-self:stretch; display:grid; }\n    .south  { grid-area:south; justify-self:stretch; align-self:stretch; display:grid; }\n    .se     { grid-area:se;    justify-self:stretch; align-self:stretch; display:grid; }\n    .pane { font-size:1.5em; width:90%; height:80%; background-color:tan;\n      justify-self:center; align-self:center; display:grid; border-radius:0.5em; }\n    .pane .name  { font-size:2em; background-color:tan;\n      justify-self:center; align-self:center; text-align:center; }\n  }\n\n</style>\n\n"]}, media: undefined });

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
    inject("data-v-12c6ac0a_0", { source: ".dash {\n  font-family: Roboto, sans-serif;\n  position: absolute;\n  left: 0;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  display: grid;\n  grid-template-columns: 140px 1fr 50px;\n  grid-template-rows: 50px 1fr 50px;\n  grid-template-areas: \"logo navb find\" \"tocs view side\" \"pref foot trak\";\n}\n.dash #logo {\n  grid-area: logo;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n}\n.dash #navb {\n  grid-area: navb;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n}\n.dash #find {\n  grid-area: find;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n}\n.dash #tocs {\n  grid-area: tocs;\n  justify-self: stretch;\n  align-self: start;\n  display: grid;\n  background-color: gray;\n}\n.dash #view {\n  grid-area: view;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n}\n.dash #side {\n  grid-area: side;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n}\n.dash #pref {\n  grid-area: pref;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n}\n.dash #foot {\n  grid-area: foot;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n}\n.dash #trak {\n  grid-area: trak;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n}\n", map: {"version":3,"sources":["Dash.vue","/Users/ax/Documents/prj/aug/vue/dash/Dash.vue"],"names":[],"mappings":"AAAA;EACE,+BAA+B;EAC/B,kBAAkB;EAClB,OAAO;EACP,MAAM;EACN,QAAQ;EACR,SAAS;EACT,aAAa;EACb,qCAAqC;EACrC,iCAAiC;EACjC,uEAAuE;AACzE;AACA;EACE,eAAe;EACf,qBAAqB;EACrB,mBAAmB;EACnB,aAAa;AACf;AACA;EACE,eAAe;EACf,qBAAqB;EACrB,mBAAmB;EACnB,aAAa;AACf;AACA;EACE,eAAe;EACf,qBAAqB;EACrB,mBAAmB;EACnB,aAAa;AACf;AACA;EACE,eAAe;EACf,qBAAqB;EACrB,iBAAiB;EACjB,aAAa;EACb,sBAAsB;AACxB;AACA;EACE,eAAe;EACf,qBAAqB;EACrB,mBAAmB;EACnB,aAAa;AACf;AACA;EACE,eAAe;EACf,qBAAqB;EACrB,mBAAmB;EACnB,aAAa;ACCf;AACA;EACA,eAAA;EACA,qBAAA;EACA,mBAAA;EACA,aAAA;AACA;AACA;EDCE,eAAe;ECCjB,qBAAA;EACA,mBAAA;EACA,aAAA;AACA;AACA;EACA,eAAA;EACA,qBAAA;EACA,mBAAA;EACA,aAAA;ADCA","file":"Dash.vue","sourcesContent":[".dash {\n  font-family: Roboto, sans-serif;\n  position: absolute;\n  left: 0;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  display: grid;\n  grid-template-columns: 140px 1fr 50px;\n  grid-template-rows: 50px 1fr 50px;\n  grid-template-areas: \"logo navb find\" \"tocs view side\" \"pref foot trak\";\n}\n.dash #logo {\n  grid-area: logo;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n}\n.dash #navb {\n  grid-area: navb;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n}\n.dash #find {\n  grid-area: find;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n}\n.dash #tocs {\n  grid-area: tocs;\n  justify-self: stretch;\n  align-self: start;\n  display: grid;\n  background-color: gray;\n}\n.dash #view {\n  grid-area: view;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n}\n.dash #side {\n  grid-area: side;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n}\n.dash #pref {\n  grid-area: pref;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n}\n.dash #foot {\n  grid-area: foot;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n}\n.dash #trak {\n  grid-area: trak;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n}\n","\n<template>\n  <div class=\"dash\">\n    <d-logo id=\"logo\"></d-logo>\n    <d-navb id=\"navb\"></d-navb>\n    <d-find id=\"find\"></d-find>\n    <d-tocs id=\"tocs\"></d-tocs>\n    <d-view id=\"view\"></d-view>\n    <d-side id=\"side\"></d-side>\n    <d-pref id=\"pref\"></d-pref>\n    <d-foot id=\"foot\"></d-foot>\n    <d-trak id=\"trak\"></d-trak>\n  </div>\n</template>\n\n<script type=\"module\">\n  \n  import Logo from './Logo.vue';\n  import Navb from './Navb.vue';\n  import Find from './Find.vue';\n  import Tocs from './Tocs.vue';\n  import View from './View.vue';\n  import Side from './Side.vue';\n  import Pref from './Pref.vue';\n  import Foot from './Foot.vue';\n  import Trak from './Trak.vue';\n\n  let Dash = {\n      name: 'dash',\n      components: {\n        'd-logo':Logo, 'd-navb':Navb, 'd-find':Find,\n        'd-tocs':Tocs, 'd-view':View, 'd-side':Side,\n        'd-pref':Pref, 'd-foot':Foot, 'd-trak':Trak } };\n\n  import Info from '../muse/Info.vue';\n  import Know from '../muse/Know.vue';\n  import Wise from '../muse/Wise.vue';\n\n  Dash.Info = Info;\n  Dash.Know = Know;\n  Dash.Wise = Wise;\n  \n  export default Dash;\n  \n</script>\n\n<style lang=\"less\">\n\n   .dash { font-family:Roboto, sans-serif;\n     position:absolute; left:0; top:0; right:0; bottom:0; display:grid;\n     grid-template-columns: 140px 1fr 50px;\n     grid-template-rows:     50px 1fr 50px;\n     grid-template-areas:\n       \"logo navb find\"\n       \"tocs view side\"\n       \"pref foot trak\";\n\n    #logo { grid-area:logo; justify-self:stretch; align-self:stretch; display:grid; }\n    #navb { grid-area:navb; justify-self:stretch; align-self:stretch; display:grid; }\n    #find { grid-area:find; justify-self:stretch; align-self:stretch; display:grid; }\n    #tocs { grid-area:tocs; justify-self:stretch; align-self:start;   display:grid; background-color:gray;  }\n    #view { grid-area:view; justify-self:stretch; align-self:stretch; display:grid; }\n    #side { grid-area:side; justify-self:stretch; align-self:stretch; display:grid; }\n    #pref { grid-area:pref; justify-self:stretch; align-self:stretch; display:grid; }\n    #foot { grid-area:foot; justify-self:stretch; align-self:stretch; display:grid; }\n    #trak { grid-area:trak; justify-self:stretch; align-self:stretch; display:grid; } }\n  \n</style>"]}, media: undefined });

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
