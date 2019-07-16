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

var script = { };

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
  return _c("div", { staticClass: "wood" }, [
    _c(
      "svg",
      {
        staticClass: "moon",
        attrs: {
          xmlns: "http://www.w3.org/2000/svg",
          viewBox: "0 0 100 100",
          width: "100",
          height: "100"
        }
      },
      [_c("circle", { attrs: { r: "30", fill: "#fff", cx: "70", cy: "70" } })]
    ),
    _vm._v(" "),
    _c("div", { staticClass: "back ground" }),
    _vm._v(" "),
    _c("div", { staticClass: "mid ground" }),
    _vm._v(" "),
    _c("div", { staticClass: "frontmid ground" }),
    _vm._v(" "),
    _c("div", { staticClass: "front ground" }),
    _vm._v(" "),
    _c("div", { staticClass: "horseman" })
  ])
};
var __vue_staticRenderFns__ = [];
__vue_render__._withStripped = true;

  /* style */
  const __vue_inject_styles__ = function (inject) {
    if (!inject) return
    inject("data-v-10816e14_0", { source: ".theme-logo {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-navb {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-find {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-tocs {\n  background-color: black;\n  font-size: 2.5rem;\n}\n.theme-view {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-side {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-pref {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-foot {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-trak {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.wood {\n  position: relative;\n  width: 100%;\n  height: 100%;\n  min-height: 700px;\n  overflow: hidden;\n  background-color: #041e2b;\n  background-image: linear-gradient(to bottom, #041e2b 0%, #407886 41%, #d4dbdb 69%, black 69%, black 100%);\n}\n.wood .moon {\n  position: absolute;\n  left: 25%;\n  top: 100px;\n}\n.wood .horseman {\n  position: absolute;\n  left: 50%;\n  top: 300px;\n  width: 184px;\n  height: 123px;\n  margin-left: -100px;\n  background: url(\"css/svg/horse-hallow5.svg\");\n  animation: horsemove 0.7s steps(15) infinite;\n}\n.wood .ground {\n  position: absolute;\n  left: 0;\n  top: 0;\n  width: 151%;\n  height: 697px;\n  background-size: 800px, 716px;\n  transform: translateZ(0);\n  backface-visibility: hidden;\n  perspective: 1000px;\n}\n.wood .front {\n  background: url(\"css/svg/hallowfront4.svg\") repeat-x;\n  background-size: 1000px 871px;\n  top: -100px;\n  animation: bk 20s -5s linear infinite;\n}\n.wood .frontmid {\n  background: url(\"css/svg/hallowmidfront2.svg\") repeat-x;\n  background-size: 1000px 871px;\n  top: -100px;\n  animation: bk 50s -5s linear infinite;\n}\n.wood .mid {\n  background: url(\"css/svg/hallowmid2.svg\") repeat-x;\n  background-size: 1000px 871px;\n  top: -100px;\n  animation: bk 100s -5s linear infinite;\n}\n.wood .back {\n  background: url(\"css/svg/hallowback2.svg\") repeat-x;\n  background-size: 1000px 871px;\n  top: -100px;\n  animation: bk 100s -5s linear infinite;\n}\n@keyframes horsemove {\n100% {\n    background-position: 0 -1848px;\n}\n}\n@keyframes bk {\n100% {\n    background-position: -200% 0;\n}\n}\n", map: {"version":3,"sources":["Wood.vue","/Users/ax/Documents/prj/aug/vue/wood/Wood.vue"],"names":[],"mappings":"AAAA;EACE,uBAAuB;EACvB,iBAAiB;AACnB;AACA;EACE,uBAAuB;EACvB,iBAAiB;AACnB;AACA;EACE,uBAAuB;EACvB,iBAAiB;AACnB;AACA;EACE,uBAAuB;EACvB,iBAAiB;AACnB;AACA;EACE,uBAAuB;EACvB,iBAAiB;AACnB;AACA;ECCA,uBAAA;EDCE,iBAAiB;ACCnB;AACA;EACA,uBAAA;EDCE,iBAAiB;ACCnB;ADCA;ECCA,uBAAA;EACA,iBAAA;AACA;AACA;EDCE,uBAAuB;ECCzB,iBAAA;AACA;AACA;EACA,kBAAA;EACA,WAAA;EACA,YAAA;EDCE,iBAAiB;ECCnB,gBAAA;EACA,yBAAA;EACA,yGAAA;AACA;AACA;EDCE,kBAAkB;ECCpB,SAAA;EACA,UAAA;AACA;AACA;EACA,kBAAA;EDCE,SAAS;ECCX,UAAA;EACA,YAAA;EACA,aAAA;EACA,mBAAA;EACA,4CAAA;EDCE,4CAA4C;ACC9C;AACA;EACA,kBAAA;EACA,OAAA;EACA,MAAA;EDCE,WAAW;ECCb,aAAA;EACA,6BAAA;EACA,wBAAA;EDCE,2BAA2B;ECC7B,mBAAA;AACA;AACA;EDCE,oDAAoD;EACpD,6BAA6B;EAC7B,WAAW;EACX,qCAAqC;AACvC;AACA;EACE,uDAAuD;EACvD,6BAA6B;EAC7B,WAAW;EACX,qCAAqC;AACvC;AACA;EACE,kDAAkD;EAClD,6BAA6B;EAC7B,WAAW;EACX,sCAAsC;AACxC;AACA;EACE,mDAAmD;EACnD,6BAA6B;EAC7B,WAAW;EACX,sCAAsC;AACxC;AACA;AACE;IACE,8BAA8B;AAChC;AACF;AACA;AACE;IACE,4BAA4B;AAC9B;AACF","file":"Wood.vue","sourcesContent":[".theme-logo {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-navb {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-find {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-tocs {\n  background-color: black;\n  font-size: 2.5rem;\n}\n.theme-view {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-side {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-pref {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-foot {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-trak {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.wood {\n  position: relative;\n  width: 100%;\n  height: 100%;\n  min-height: 700px;\n  overflow: hidden;\n  background-color: #041e2b;\n  background-image: linear-gradient(to bottom, #041e2b 0%, #407886 41%, #d4dbdb 69%, black 69%, black 100%);\n}\n.wood .moon {\n  position: absolute;\n  left: 25%;\n  top: 100px;\n}\n.wood .horseman {\n  position: absolute;\n  left: 50%;\n  top: 300px;\n  width: 184px;\n  height: 123px;\n  margin-left: -100px;\n  background: url(\"css/svg/horse-hallow5.svg\");\n  animation: horsemove 0.7s steps(15) infinite;\n}\n.wood .ground {\n  position: absolute;\n  left: 0;\n  top: 0;\n  width: 151%;\n  height: 697px;\n  background-size: 800px, 716px;\n  transform: translateZ(0);\n  backface-visibility: hidden;\n  perspective: 1000px;\n}\n.wood .front {\n  background: url(\"css/svg/hallowfront4.svg\") repeat-x;\n  background-size: 1000px 871px;\n  top: -100px;\n  animation: bk 20s -5s linear infinite;\n}\n.wood .frontmid {\n  background: url(\"css/svg/hallowmidfront2.svg\") repeat-x;\n  background-size: 1000px 871px;\n  top: -100px;\n  animation: bk 50s -5s linear infinite;\n}\n.wood .mid {\n  background: url(\"css/svg/hallowmid2.svg\") repeat-x;\n  background-size: 1000px 871px;\n  top: -100px;\n  animation: bk 100s -5s linear infinite;\n}\n.wood .back {\n  background: url(\"css/svg/hallowback2.svg\") repeat-x;\n  background-size: 1000px 871px;\n  top: -100px;\n  animation: bk 100s -5s linear infinite;\n}\n@keyframes horsemove {\n  100% {\n    background-position: 0 -1848px;\n  }\n}\n@keyframes bk {\n  100% {\n    background-position: -200% 0;\n  }\n}\n","\n<template>\n  <div class=\"wood\">\n    <svg class=\"moon\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 100 100\" width=\"100\" height=\"100\">\n      <circle r=\"30\" fill=\"#fff\" cx=\"70\" cy=\"70\" ></circle>\n    </svg>\n    <div class=\"back ground\"></div>\n    <div class=\"mid ground\"></div>\n    <div class=\"frontmid ground\"></div>\n    <div class=\"front ground\"></div>\n    <div class=\"horseman\"></div>\n  </div>\n</template>\n\n<script>\n  export default { };\n\n</script>\n\n<style lang=\"less\">\n  \n  @import '../../pub/css/themes/theme.less';\n  \n.wood {\n  position:relative; width: 100%; height: 100%; min-height: 700px; overflow:hidden; background-color: #041e2b;\n  background-image: linear-gradient(to bottom, #041e2b 0%, #407886 41%, #d4dbdb 69%, black 69%, black 100%); }\n\n  .wood .moon {  position:absolute; left:25%; top:100px; }\n\n  .wood .horseman {\n    position: absolute; left:50%; top:300px; width:184px; height:123px; margin-left: -100px;\n    background: url(\"css/svg/horse-hallow5.svg\");\n    animation: horsemove 0.7s steps(15) infinite; }\n\n  .wood .ground {\n    position: absolute; left:0; top:0; width:151%; height:697px;\n    background-size: 800px, 716px;\n    transform: translateZ(0);\n    backface-visibility: hidden;\n    perspective: 1000px; }\n\n.wood .front {\n    background: url(\"css/svg/hallowfront4.svg\") repeat-x;\n    background-size: 1000px 871px;\n    top: -100px;\n    animation: bk 20s -5s linear infinite; }\n\n.wood .frontmid {\n    background: url(\"css/svg/hallowmidfront2.svg\") repeat-x;\n    background-size: 1000px 871px;\n    top: -100px;\n    animation: bk 50s -5s linear infinite; }\n\n.wood .mid {\n    background: url(\"css/svg/hallowmid2.svg\") repeat-x;\n    background-size: 1000px 871px;\n    top: -100px;\n    animation: bk 100s -5s linear infinite; }\n\n.wood .back {\n    background: url(\"css/svg/hallowback2.svg\") repeat-x;\n    background-size: 1000px 871px;\n    top: -100px;\n    animation: bk 100s -5s linear infinite; }\n  \n  @keyframes horsemove {\n    100% {\n      background-position: 0 -1848px; } }\n  \n  @keyframes bk {\n    100% {\n      background-position: -200% 0; } }\n  \n\n</style>\n\n"]}, media: undefined });

  };
  /* scoped */
  const __vue_scope_id__ = undefined;
  /* module identifier */
  const __vue_module_identifier__ = undefined;
  /* functional template */
  const __vue_is_functional_template__ = false;
  /* style inject SSR */
  

  
  var Wood = normalizeComponent_1(
    { render: __vue_render__, staticRenderFns: __vue_staticRenderFns__ },
    __vue_inject_styles__,
    __vue_script__,
    __vue_scope_id__,
    __vue_is_functional_template__,
    __vue_module_identifier__,
    browser,
    undefined
  );

export default Wood;
