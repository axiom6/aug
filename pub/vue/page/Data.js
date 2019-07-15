//
//
//
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
  return _vm._m(0)
};
var __vue_staticRenderFns__ = [
  function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c("div", { staticClass: "data" }, [
      _c("div", [_c("h1", [_vm._v("Data Science")])])
    ])
  }
];
__vue_render__._withStripped = true;

  /* style */
  const __vue_inject_styles__ = function (inject) {
    if (!inject) return
    inject("data-v-69146a6a_0", { source: ".theme-logo {\n  background-color: black;\n}\n.theme-navb {\n  background-color: black;\n}\n.theme-find {\n  background-color: black;\n}\n.theme-tocs {\n  background-color: black;\n}\n.theme-view {\n  background-color: black;\n}\n.theme-side {\n  background-color: black;\n}\n.theme-pref {\n  background-color: black;\n}\n.theme-foot {\n  background-color: black;\n}\n.theme-trak {\n  background-color: black;\n}\n.data {\n  position: absolute;\n  left: 0;\n  top: 5%;\n  right: 0;\n  bottom: 0;\n  font-size: 1.75vmin;\n  display: grid;\n  justify-items: center;\n  align-items: center;\n  text-align: center;\n  background-color: black;\n  color: wheat;\n}\n", map: {"version":3,"sources":["Data.vue","/Users/ax/Documents/prj/aug/vue/page/Data.vue"],"names":[],"mappings":"AAAA;EACE,uBAAuB;AACzB;AACA;EACE,uBAAuB;AACzB;AACA;EACE,uBAAuB;AACzB;AACA;EACE,uBAAuB;AACzB;AACA;EACE,uBAAuB;ACCzB;AACA;EACA,uBAAA;AACA;ADCA;EACE,uBAAuB;AACzB;AACA;EACE,uBAAuB;AACzB;AACA;EACE,uBAAuB;AACzB;AACA;EACE,kBAAkB;EAClB,OAAO;EACP,OAAO;EACP,QAAQ;EACR,SAAS;EACT,mBAAmB;EACnB,aAAa;EACb,qBAAqB;EACrB,mBAAmB;EACnB,kBAAkB;EAClB,uBAAuB;EACvB,YAAY;AACd","file":"Data.vue","sourcesContent":[".theme-logo {\n  background-color: black;\n}\n.theme-navb {\n  background-color: black;\n}\n.theme-find {\n  background-color: black;\n}\n.theme-tocs {\n  background-color: black;\n}\n.theme-view {\n  background-color: black;\n}\n.theme-side {\n  background-color: black;\n}\n.theme-pref {\n  background-color: black;\n}\n.theme-foot {\n  background-color: black;\n}\n.theme-trak {\n  background-color: black;\n}\n.data {\n  position: absolute;\n  left: 0;\n  top: 5%;\n  right: 0;\n  bottom: 0;\n  font-size: 1.75vmin;\n  display: grid;\n  justify-items: center;\n  align-items: center;\n  text-align: center;\n  background-color: black;\n  color: wheat;\n}\n","\n<template>\n  <div class=\"data\">\n    <div>\n      <h1>Data Science</h1>\n    </div>\n  </div>\n</template>\n\n<script type=\"module\">\n  export default {}\n</script>\n\n<style lang=\"less\">\n  @import '../../pub/css/themes/theme.less';\n  .data { position:absolute; left:0; top:5%; right:0; bottom:0; font-size:1.75vmin;\n    display:grid; justify-items:center; align-items:center; text-align:center;\n    background-color:@theme-back; color:@theme-color; }\n</style>"]}, media: undefined });

  };
  /* scoped */
  const __vue_scope_id__ = undefined;
  /* module identifier */
  const __vue_module_identifier__ = undefined;
  /* functional template */
  const __vue_is_functional_template__ = false;
  /* style inject SSR */
  

  
  var Data = normalizeComponent_1(
    { render: __vue_render__, staticRenderFns: __vue_staticRenderFns__ },
    __vue_inject_styles__,
    __vue_script__,
    __vue_scope_id__,
    __vue_is_functional_template__,
    __vue_module_identifier__,
    browser,
    undefined
  );

export default Data;
