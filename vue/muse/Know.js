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

var script = {
  data() { return { sel:"Info" } },
  methods: {
    onSelect: function (select) {
      this.sel =  select;
      console.log( 'view.vue', select ); } },
  mounted: function () {
    console.log( 'Know.vue', 'mounted' );
    this.subscribe( 'Select', 'view.vue', (select) => this.onSelect(select) ); }
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
  return _vm._m(0)
};
var __vue_staticRenderFns__ = [
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
__vue_render__._withStripped = true;

  /* style */
  const __vue_inject_styles__ = function (inject) {
    if (!inject) return
    inject("data-v-3e9427d0_0", { source: ".view {\n  background-color: grey;\n  display: grid;\n  grid-template-columns: 33%  33% 34%;\n  grid-template-rows: 33%  33% 34%;\n  grid-template-areas: \"nw   north ne\" \"west cen   east\" \"sw   south se\";\n  justify-items: center;\n  align-items: center;\n}\n.view .nw {\n  grid-area: nw;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n}\n.view .north {\n  grid-area: north;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n}\n.view .ne {\n  grid-area: ne;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n}\n.view .west {\n  grid-area: west;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n}\n.view .cen {\n  grid-area: cen;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n}\n.view .east {\n  grid-area: east;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n}\n.view .sw {\n  grid-area: sw;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n}\n.view .south {\n  grid-area: south;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n}\n.view .se {\n  grid-area: se;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n}\n.view .pane {\n  font-size: 1.5em;\n  width: 90%;\n  height: 80%;\n  background-color: tan;\n  justify-self: center;\n  align-self: center;\n  display: grid;\n  border-radius: 0.5em;\n}\n.view .pane .name {\n  font-size: 2em;\n  background-color: tan;\n  justify-self: center;\n  align-self: center;\n  text-align: center;\n}\n", map: {"version":3,"sources":["Know.vue","/Users/ax/Documents/prj/aug/vue/muse/Know.vue"],"names":[],"mappings":"AAAA;EACE,sBAAsB;EACtB,aAAa;EACb,mCAAmC;EACnC,gCAAgC;EAChC,sEAAsE;EACtE,qBAAqB;EACrB,mBAAmB;AACrB;AACA;EACE,aAAa;EACb,qBAAqB;EACrB,mBAAmB;EACnB,aAAa;AACf;AACA;EACE,gBAAgB;EAChB,qBAAqB;EACrB,mBAAmB;EACnB,aAAa;AACf;AACA;EACE,aAAa;EACb,qBAAqB;EACrB,mBAAmB;EACnB,aAAa;AACf;AACA;EACE,eAAe;ECCjB,qBAAA;EACA,mBAAA;EACA,aAAA;AACA;AACA;EACA,cAAA;EACA,qBAAA;EACA,mBAAA;EACA,aAAA;AACA;AACA;EACA,eAAA;EACA,qBAAA;EACA,mBAAA;EACA,aAAA;AACA;AACA;EACA,aAAA;EACA,qBAAA;EACA,mBAAA;EACA,aAAA;AACA;AACA;EDCE,gBAAgB;EAChB,qBAAqB;EACrB,mBAAmB;EACnB,aAAa;AACf;AACA;EACE,aAAa;EACb,qBAAqB;EACrB,mBAAmB;EACnB,aAAa;AACf;AACA;EACE,gBAAgB;EAChB,UAAU;EACV,WAAW;EACX,qBAAqB;EACrB,oBAAoB;EACpB,kBAAkB;EAClB,aAAa;EACb,oBAAoB;AACtB;AACA;EACE,cAAc;EACd,qBAAqB;EACrB,oBAAoB;EACpB,kBAAkB;EAClB,kBAAkB;AACpB","file":"Know.vue","sourcesContent":[".view {\n  background-color: grey;\n  display: grid;\n  grid-template-columns: 33%  33% 34%;\n  grid-template-rows: 33%  33% 34%;\n  grid-template-areas: \"nw   north ne\" \"west cen   east\" \"sw   south se\";\n  justify-items: center;\n  align-items: center;\n}\n.view .nw {\n  grid-area: nw;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n}\n.view .north {\n  grid-area: north;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n}\n.view .ne {\n  grid-area: ne;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n}\n.view .west {\n  grid-area: west;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n}\n.view .cen {\n  grid-area: cen;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n}\n.view .east {\n  grid-area: east;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n}\n.view .sw {\n  grid-area: sw;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n}\n.view .south {\n  grid-area: south;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n}\n.view .se {\n  grid-area: se;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n}\n.view .pane {\n  font-size: 1.5em;\n  width: 90%;\n  height: 80%;\n  background-color: tan;\n  justify-self: center;\n  align-self: center;\n  display: grid;\n  border-radius: 0.5em;\n}\n.view .pane .name {\n  font-size: 2em;\n  background-color: tan;\n  justify-self: center;\n  align-self: center;\n  text-align: center;\n}\n","\n<template>\n  <div class=\"view\">\n    <div id=\"Humanity\"    class=\"nw\"     ><div class=\"pane\"><div class=\"name\">Humanity</div></div></div>\n    <div id=\"Science\"     class=\"north\"  ><div class=\"pane\"><div class=\"name\">Science</div></div></div>\n    <div id=\"Understand\"  class=\"ne\"     ><div class=\"pane\"><div class=\"name\">Understand</div></div></div>\n    <div id=\"Orchestrate\" class=\"west\"   ><div class=\"pane\"><div class=\"name\">Orchestrate</div></div></div>\n    <div id=\"Cognition\"   class=\"cen\"    ><div class=\"pane\"><div class=\"name\">Cognition</div></div></div>\n    <div id=\"Reason\"      class=\"east\"   ><div class=\"pane\"><div class=\"name\">Reason</div></div></div>\n    <div id=\"Evolve\"      class=\"sw\"     ><div class=\"pane\"><div class=\"name\">Evolve</div></div></div>\n    <div id=\"Educate\"     class=\"south\"  ><div class=\"pane\"><div class=\"name\">Educate</div></div></div>\n    <div id=\"Culture\"     class=\"se\"     ><div class=\"pane\"><div class=\"name\">Culture</div></div></div>\n  </div>\n</template>\n\n<script type=\"module\">\n  export default {\n    data() { return { sel:\"Info\" } },\n    methods: {\n      onSelect: function (select) {\n        this.sel =  select;\n        console.log( 'view.vue', select ); } },\n    mounted: function () {\n      console.log( 'Know.vue', 'mounted' );\n      this.subscribe( 'Select', 'view.vue', (select) => this.onSelect(select) ); }\n  }\n</script>\n\n<style lang=\"less\">\n  .view { background-color:grey;\n    display:grid;\n    grid-template-columns: 33%  33% 34%;\n    grid-template-rows:    33%  33% 34%;\n    grid-template-areas:\n      \"nw   north ne\"\n      \"west cen   east\"\n      \"sw   south se\";\n    justify-items:center; align-items:center;\n    .nw     { grid-area:nw;    justify-self:stretch; align-self:stretch; display:grid; }\n    .north  { grid-area:north; justify-self:stretch; align-self:stretch; display:grid; }\n    .ne     { grid-area:ne;    justify-self:stretch; align-self:stretch; display:grid; }\n    .west   { grid-area:west;  justify-self:stretch; align-self:stretch; display:grid; }\n    .cen    { grid-area:cen;   justify-self:stretch; align-self:stretch; display:grid; }\n    .east   { grid-area:east;  justify-self:stretch; align-self:stretch; display:grid; }\n    .sw     { grid-area:sw;    justify-self:stretch; align-self:stretch; display:grid; }\n    .south  { grid-area:south; justify-self:stretch; align-self:stretch; display:grid; }\n    .se     { grid-area:se;    justify-self:stretch; align-self:stretch; display:grid; }\n    .pane { font-size:1.5em; width:90%; height:80%; background-color:tan;\n      justify-self:center; align-self:center; display:grid; border-radius:0.5em; }\n    .pane .name  { font-size:2em; background-color:tan;\n      justify-self:center; align-self:center; text-align:center; }\n  }\n\n</style>\n\n"]}, media: undefined });

  };
  /* scoped */
  const __vue_scope_id__ = undefined;
  /* module identifier */
  const __vue_module_identifier__ = undefined;
  /* functional template */
  const __vue_is_functional_template__ = false;
  /* style inject SSR */
  

  
  var Know = normalizeComponent_1(
    { render: __vue_render__, staticRenderFns: __vue_staticRenderFns__ },
    __vue_inject_styles__,
    __vue_script__,
    __vue_scope_id__,
    __vue_is_functional_template__,
    __vue_module_identifier__,
    browser,
    undefined
  );

export default Know;
