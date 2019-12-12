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

  props: { route:String, pages:Object, defn:{ default:'null', type:String }, position:{ default:'full', type:String } },
  
  data() { return { pageKey:'None', pageObj:null,
    positions:{ left:{ left:0, width:'60%' }, right:{ left:'60%', width:'40%' }, full:{ left:0, width:'100%' } } } },
  
  methods: {
    onPage: function (key) {
      if( key !== 'None') {
        this.pageKey = key;
        this.nav().setPageKey( this.route, key ); } },
    doPage: function (key) {
        this.onPage( key );
        let route = this.isDef(this.pages[key].route) ? this.pages[key].route : this.route;
        this.nav().pub( { source:'Tabs', route:route, pageKey:key } ); },
    stylePos: function () {
      return this.positions[this.position]; },
    classTab: function (pageKey) {
      return this.pageKey===pageKey ? 'tabs-tab-active' : 'tabs-tab'; } },

  created: function () {  // We want to set the routes pages asap
    this.onPage( this.nav().setPages( this.route, this.pages, this.defn ) ); },

  mounted: function() {
    this.subscribe(  "Nav", 'Tabs.vue.'+this.route, (obj) => {
      if( obj.source !== 'Tabs' && obj.route === this.route ) {
        this.onPage( obj.pageKey ); } } ); }  // this.nav().getPageKey(this.route)
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
    { staticClass: "tabs-pane", style: _vm.stylePos() },
    [
      _vm._l(_vm.pages, function(pageObj) {
        return [
          _c(
            "div",
            {
              class: _vm.classTab(pageObj.key),
              on: {
                click: function($event) {
                  return _vm.doPage(pageObj.key)
                }
              }
            },
            [_vm._v(_vm._s(pageObj.title))]
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
    inject("data-v-36652744_0", { source: ".theme-h1 {\n  font-size: 8vmin;\n  margin: 2vmin 0 2vmin 0;\n  display: grid;\n  justify-self: center;\n  align-self: center;\n  text-align: center;\n}\n.theme-h2 {\n  font-size: 6.4vmin;\n  margin: 1.6vmin 0 1.6vmin 0;\n  display: grid;\n  justify-self: center;\n  align-self: center;\n  text-align: center;\n}\n.theme-h3 {\n  font-size: 5.12vmin;\n  margin: 1.28vmin 0 1.28vmin 0;\n  display: grid;\n  justify-self: center;\n  align-self: center;\n  text-align: center;\n}\n.theme-h4 {\n  font-size: 4vmin;\n  margin: 1.024vmin 0 1.024vmin 0;\n  display: grid;\n  justify-self: center;\n  align-self: center;\n  text-align: center;\n}\n.theme-h5 {\n  font-size: 3.2vmin;\n  margin: 0.82vmin 0 0.82vmin 0;\n  display: grid;\n  justify-self: center;\n  align-self: center;\n  text-align: center;\n}\n.theme-h6 {\n  font-size: 2.56vmin;\n  margin: 0.656vmin 0 0.656vmin 0;\n  display: grid;\n  justify-self: center;\n  align-self: center;\n  text-align: center;\n}\n.theme-p {\n  font-size: 2vmin;\n  margin: 0.524vmin 0 0.524vmin 0;\n  display: grid;\n  justify-self: start;\n  align-self: center;\n  text-align: left;\n}\n.theme-article {\n  position: absolute;\n  left: 0;\n  top: 0;\n  width: 100%;\n  height: 100%;\n}\n.theme-header {\n  position: absolute;\n  left: 0;\n  top: 0;\n  width: 100%;\n  height: 20%;\n}\n.theme-section {\n  position: absolute;\n  left: 0;\n  top: 20%;\n  width: 100%;\n  height: 60%;\n}\n.theme-footer {\n  position: absolute;\n  left: 0;\n  top: 80%;\n  width: 100%;\n  height: 20%;\n}\n.theme-ul {\n  font-size: 4vmin;\n  padding: 0;\n  margin: 0;\n  list-style: none;\n  font-weight: bold;\n}\n.theme-ul li {\n  margin: 0.25vmin 0.25vmin 0.25vmin 0.25vmin;\n}\n.theme-ul li ul {\n  font-size: 3.5vmin;\n  padding: 0;\n  margin: 0;\n  list-style: none;\n}\n.theme-ul li ul li {\n  padding-left: 1vmin;\n  margin: 0.25vmin 0.25vmin 0.25vmin 0.25vmin;\n}\n.theme-ul li ul li ul {\n  font-size: 3vmin;\n  padding: 0;\n  margin: 0;\n  list-style: none;\n}\n.theme-ul li ul li ul li {\n  padding-left: 1vmin;\n  margin: 0.25vmin 0.25vmin 0.25vmin 0.25vmin;\n}\n.tabs-pane {\n  background-color: black;\n  font-size: 3vmin;\n  position: absolute;\n  left: 0;\n  top: 0;\n  width: 50%;\n  height: 5%;\n}\n.tabs-pane .tabs-tab {\n  display: inline-block;\n  margin-left: 2rem;\n  padding: 0.2rem 0.3rem 0.1rem 0.3rem;\n  border-radius: 12px 12px 0 0;\n  border-left: wheat solid thin;\n  border-top: wheat solid thin;\n  border-right: wheat solid thin;\n  background-color: black;\n  color: wheat;\n}\n.tabs-pane .tabs-tab:hover {\n  background-color: wheat;\n  color: black;\n}\n.tabs-pane .tabs-tab-active {\n  display: inline-block;\n  margin-left: 2rem;\n  padding: 0.2rem 0.3rem 0.1rem 0.3rem;\n  border-radius: 12px 12px 0 0;\n  border-left: wheat solid thin;\n  border-top: wheat solid thin;\n  border-right: wheat solid thin;\n  background-color: black;\n  color: wheat;\n  background-color: wheat;\n  color: black;\n}\n", map: {"version":3,"sources":["Tabs.vue","/Users/ax/Documents/prj/aug/vue/elem/Tabs.vue"],"names":[],"mappings":"AAAA;EACE,gBAAgB;EAChB,uBAAuB;EACvB,aAAa;EACb,oBAAoB;EACpB,kBAAkB;EAClB,kBAAkB;AACpB;AACA;EACE,kBAAkB;EAClB,2BAA2B;EAC3B,aAAa;EACb,oBAAoB;EACpB,kBAAkB;EAClB,kBAAkB;AACpB;AACA;EACE,mBAAmB;EACnB,6BAA6B;EAC7B,aAAa;EACb,oBAAoB;EACpB,kBAAkB;EAClB,kBAAkB;AACpB;AACA;EACE,gBAAgB;EAChB,+BAA+B;EAC/B,aAAa;EACb,oBAAoB;EACpB,kBAAkB;EAClB,kBAAkB;AACpB;AACA;EACE,kBAAkB;EAClB,6BAA6B;EAC7B,aAAa;EACb,oBAAoB;EACpB,kBAAkB;EAClB,kBAAkB;AACpB;AACA;EACE,mBAAmB;EACnB,+BAA+B;EAC/B,aAAa;EACb,oBAAoB;ECCtB,kBAAA;EDCE,kBAAkB;ACCpB;ADCA;ECCA,gBAAA;EACA,+BAAA;EDCE,aAAa;ECCf,mBAAA;EACA,kBAAA;EACA,gBAAA;AACA;AACA;EACA,kBAAA;EDCE,OAAO;EACP,MAAM;EACN,WAAW;EACX,YAAY;AACd;AACA;EACE,kBAAkB;EAClB,OAAO;EACP,MAAM;EACN,WAAW;EACX,WAAW;AACb;AACA;EACE,kBAAkB;EAClB,OAAO;EACP,QAAQ;EACR,WAAW;EACX,WAAW;AACb;AACA;EACE,kBAAkB;EAClB,OAAO;EACP,QAAQ;EACR,WAAW;EACX,WAAW;AACb;AACA;EACE,gBAAgB;EAChB,UAAU;EACV,SAAS;EACT,gBAAgB;EAChB,iBAAiB;AACnB;AACA;EACE,2CAA2C;AAC7C;AACA;EACE,kBAAkB;EAClB,UAAU;EACV,SAAS;EACT,gBAAgB;AAClB;AACA;EACE,mBAAmB;EACnB,2CAA2C;AAC7C;AACA;EACE,gBAAgB;EAChB,UAAU;EACV,SAAS;EACT,gBAAgB;AAClB;AACA;EACE,mBAAmB;EACnB,2CAA2C;AAC7C;AACA;EACE,uBAAuB;EACvB,gBAAgB;EAChB,kBAAkB;EAClB,OAAO;EACP,MAAM;EACN,UAAU;EACV,UAAU;AACZ;AACA;EACE,qBAAqB;EACrB,iBAAiB;EACjB,oCAAoC;EACpC,4BAA4B;EAC5B,6BAA6B;EAC7B,4BAA4B;EAC5B,8BAA8B;EAC9B,uBAAuB;EACvB,YAAY;AACd;AACA;EACE,uBAAuB;EACvB,YAAY;AACd;AACA;EACE,qBAAqB;EACrB,iBAAiB;EACjB,oCAAoC;EACpC,4BAA4B;EAC5B,6BAA6B;EAC7B,4BAA4B;EAC5B,8BAA8B;EAC9B,uBAAuB;EACvB,YAAY;EACZ,uBAAuB;EACvB,YAAY;AACd","file":"Tabs.vue","sourcesContent":[".theme-h1 {\n  font-size: 8vmin;\n  margin: 2vmin 0 2vmin 0;\n  display: grid;\n  justify-self: center;\n  align-self: center;\n  text-align: center;\n}\n.theme-h2 {\n  font-size: 6.4vmin;\n  margin: 1.6vmin 0 1.6vmin 0;\n  display: grid;\n  justify-self: center;\n  align-self: center;\n  text-align: center;\n}\n.theme-h3 {\n  font-size: 5.12vmin;\n  margin: 1.28vmin 0 1.28vmin 0;\n  display: grid;\n  justify-self: center;\n  align-self: center;\n  text-align: center;\n}\n.theme-h4 {\n  font-size: 4vmin;\n  margin: 1.024vmin 0 1.024vmin 0;\n  display: grid;\n  justify-self: center;\n  align-self: center;\n  text-align: center;\n}\n.theme-h5 {\n  font-size: 3.2vmin;\n  margin: 0.82vmin 0 0.82vmin 0;\n  display: grid;\n  justify-self: center;\n  align-self: center;\n  text-align: center;\n}\n.theme-h6 {\n  font-size: 2.56vmin;\n  margin: 0.656vmin 0 0.656vmin 0;\n  display: grid;\n  justify-self: center;\n  align-self: center;\n  text-align: center;\n}\n.theme-p {\n  font-size: 2vmin;\n  margin: 0.524vmin 0 0.524vmin 0;\n  display: grid;\n  justify-self: start;\n  align-self: center;\n  text-align: left;\n}\n.theme-article {\n  position: absolute;\n  left: 0;\n  top: 0;\n  width: 100%;\n  height: 100%;\n}\n.theme-header {\n  position: absolute;\n  left: 0;\n  top: 0;\n  width: 100%;\n  height: 20%;\n}\n.theme-section {\n  position: absolute;\n  left: 0;\n  top: 20%;\n  width: 100%;\n  height: 60%;\n}\n.theme-footer {\n  position: absolute;\n  left: 0;\n  top: 80%;\n  width: 100%;\n  height: 20%;\n}\n.theme-ul {\n  font-size: 4vmin;\n  padding: 0;\n  margin: 0;\n  list-style: none;\n  font-weight: bold;\n}\n.theme-ul li {\n  margin: 0.25vmin 0.25vmin 0.25vmin 0.25vmin;\n}\n.theme-ul li ul {\n  font-size: 3.5vmin;\n  padding: 0;\n  margin: 0;\n  list-style: none;\n}\n.theme-ul li ul li {\n  padding-left: 1vmin;\n  margin: 0.25vmin 0.25vmin 0.25vmin 0.25vmin;\n}\n.theme-ul li ul li ul {\n  font-size: 3vmin;\n  padding: 0;\n  margin: 0;\n  list-style: none;\n}\n.theme-ul li ul li ul li {\n  padding-left: 1vmin;\n  margin: 0.25vmin 0.25vmin 0.25vmin 0.25vmin;\n}\n.tabs-pane {\n  background-color: black;\n  font-size: 3vmin;\n  position: absolute;\n  left: 0;\n  top: 0;\n  width: 50%;\n  height: 5%;\n}\n.tabs-pane .tabs-tab {\n  display: inline-block;\n  margin-left: 2rem;\n  padding: 0.2rem 0.3rem 0.1rem 0.3rem;\n  border-radius: 12px 12px 0 0;\n  border-left: wheat solid thin;\n  border-top: wheat solid thin;\n  border-right: wheat solid thin;\n  background-color: black;\n  color: wheat;\n}\n.tabs-pane .tabs-tab:hover {\n  background-color: wheat;\n  color: black;\n}\n.tabs-pane .tabs-tab-active {\n  display: inline-block;\n  margin-left: 2rem;\n  padding: 0.2rem 0.3rem 0.1rem 0.3rem;\n  border-radius: 12px 12px 0 0;\n  border-left: wheat solid thin;\n  border-top: wheat solid thin;\n  border-right: wheat solid thin;\n  background-color: black;\n  color: wheat;\n  background-color: wheat;\n  color: black;\n}\n","\n<template>\n  <div class=\"tabs-pane\" :style=\"stylePos()\">\n    <template v-for=\"pageObj in pages\">\n      <div :class=\"classTab(pageObj.key)\" @click=\"doPage(pageObj.key)\">{{pageObj.title}}</div>\n    </template>\n  </div>\n</template>\n\n<script type=\"module\">\n\n  export default {\n\n    props: { route:String, pages:Object, defn:{ default:'null', type:String }, position:{ default:'full', type:String } },\n    \n    data() { return { pageKey:'None', pageObj:null,\n      positions:{ left:{ left:0, width:'60%' }, right:{ left:'60%', width:'40%' }, full:{ left:0, width:'100%' } } } },\n    \n    methods: {\n      onPage: function (key) {\n        if( key !== 'None') {\n          this.pageKey = key;\n          this.nav().setPageKey( this.route, key ); } },\n      doPage: function (key) {\n          this.onPage( key );\n          let route = this.isDef(this.pages[key].route) ? this.pages[key].route : this.route\n          this.nav().pub( { source:'Tabs', route:route, pageKey:key } ); },\n      stylePos: function () {\n        return this.positions[this.position]; },\n      classTab: function (pageKey) {\n        return this.pageKey===pageKey ? 'tabs-tab-active' : 'tabs-tab'; } },\n\n    created: function () {  // We want to set the routes pages asap\n      this.onPage( this.nav().setPages( this.route, this.pages, this.defn ) ); },\n\n    mounted: function() {\n      this.subscribe(  \"Nav\", 'Tabs.vue.'+this.route, (obj) => {\n        if( obj.source !== 'Tabs' && obj.route === this.route ) {\n          this.onPage( obj.pageKey ); } } ); }  // this.nav().getPageKey(this.route)\n    }\n  \n</script>\n\n<style lang=\"less\">\n  \n  @import '../../pub/css/themes/theme.less';\n  \n  @tabsFS:1.5*@themeFS;\n  \n  .tabs-pane { background-color:@theme-back; font-size:@tabsFS;\n    position:absolute; left:0; top:0; width:@theme-tabs-width; height:@theme-tabs-height;\n    \n    .tabs-tab { display:inline-block; margin-left:2.0rem; padding:0.2rem 0.3rem 0.1rem 0.3rem;\n      border-radius:12px 12px 0 0; border-left: @theme-fore solid thin;\n      border-top:@theme-fore solid thin; border-right:@theme-fore solid thin;\n                  background-color:@theme-back;  color:@theme-fore;}\n    .tabs-tab:hover  {         background-color:@theme-fore; color:@theme-back; }\n    .tabs-tab-active { .tabs-tab(); background-color:@theme-fore; color:@theme-back; } }\n  \n</style>"]}, media: undefined });

  };
  /* scoped */
  const __vue_scope_id__ = undefined;
  /* module identifier */
  const __vue_module_identifier__ = undefined;
  /* functional template */
  const __vue_is_functional_template__ = false;
  /* style inject SSR */
  

  
  var Tabs = normalizeComponent_1(
    { render: __vue_render__, staticRenderFns: __vue_staticRenderFns__ },
    __vue_inject_styles__,
    __vue_script__,
    __vue_scope_id__,
    __vue_is_functional_template__,
    __vue_module_identifier__,
    browser,
    undefined
  );

var Util,
  indexOf = [].indexOf,
  hasProp = {}.hasOwnProperty;

Util = class Util {
  constructor() {
    this.dummy = "";
  }

  static element($elem) {
    // console.log( 'Dom.element()', $elem, Dom.isJQueryElem( $elem ) )
    if (Util.isJQueryElem($elem)) {
      return $elem.get(0);
    } else if (Util.isStr($elem)) {
      return $($elem).get(0);
    } else {
      console.error('Dom.domElement( $elem )', typeof $elem, $elem, '$elem is neither jQuery object nor selector');
      return $().get(0);
    }
  }

  static isJQueryElem($elem) {
    return (typeof $ !== "undefined" && $ !== null) && ($elem != null) && ($elem instanceof $ || indexOf.call(Object($elem), 'jquery') >= 0);
  }

  static loadScript(path, fn) {
    var head, script;
    head = document.getElementsByTagName('head')[0];
    script = document.createElement('script');
    script.src = path;
    script.async = false;
    if (Util.isFunc(fn)) {
      script.onload = fn;
    }
    head.appendChild(script);
  }

  static ready(fn) {
    if (!Util.isFunc(fn)) { // Sanity check
      return;
    } else if (Util.skipReady) {
      fn();
    } else if (document.readyState === 'complete') { // If document is already loaded, run method
      fn();
    } else {
      document.addEventListener('DOMContentLoaded', fn, false);
    }
  }

  static isChild(key) {
    var a, b;
    a = key.charAt(0);
    b = key.charAt(key.length - 1);
    return a === a.toUpperCase() && a !== '$' && b !== '_';
  }

  static hasChild(obj) {
    var key, val;
    for (key in obj) {
      if (!hasProp.call(obj, key)) continue;
      val = obj[key];
      if (Util.isChild(key)) {
        return true;
      }
    }
    return false;
  }

  static childKeys(obj) {
    var key, val, vals;
    vals = [];
    for (key in obj) {
      if (!hasProp.call(obj, key)) continue;
      val = obj[key];
      if (Util.isChild(key)) {
        vals.push(key);
      }
    }
    return vals;
  }

  // ---- Inquiry ----
  static hasMethod(obj, method, issue = false) {
    var has;
    has = typeof obj[method] === 'function';
    if (!has && issue) {
      console.log('Util.hasMethod()', method, has);
    }
    return has;
  }

  static hasGlobal(global, issue = true) {
    var has;
    has = window[global] != null;
    if (!has && issue) {
      console.error(`Util.hasGlobal() ${global} not present`);
    }
    return has;
  }

  static getGlobal(global, issue = true) {
    if (Util.hasGlobal(global, issue)) {
      return window[global];
    } else {
      return null;
    }
  }

  static hasModule(path, issue = true) {
    var has;
    has = Util.modules[path] != null;
    if (!has && issue) {
      console.error(`Util.hasModule() ${path} not present`);
    }
    return has;
  }

  static dependsOn() {
    var arg, has, j, len1, ok;
    ok = true;
    for (j = 0, len1 = arguments.length; j < len1; j++) {
      arg = arguments[j];
      has = Util.hasGlobal(arg, false) || Util.hasModule(arg, false) || Util.hasPlugin(arg, false);
      if (!has) {
        console.error('Missing Dependency', arg);
      }
      if (has === false) {
        ok = has;
      }
    }
    return ok;
  }

  // ---- Instances ----
  static setInstance(instance, path) {
    console.log('Util.setInstance()', path);
    if ((instance == null) && (path != null)) {
      console.error('Util.setInstance() instance not defined for path', path);
    } else if ((instance != null) && (path == null)) {
      console.error('Util.setInstance() path not defined for instance', instance.toString());
    } else {
      Util.instances[path] = instance;
    }
  }

  static getInstance(path, dbg = false) {
    var instance;
    if (dbg) {
      console.log('getInstance', path);
    }
    instance = Util.instances[path];
    if (instance == null) {
      console.error('Util.getInstance() instance not defined for path', path);
    }
    return instance;
  }

  // ---- Logging -------

  // args should be the arguments passed by the original calling function
  // This method should not be called directly
  static toStrArgs(prefix, args) {
    var arg, j, len1, str;
    Util.logStackNum = 0;
    str = Util.isStr(prefix) ? prefix + " " : "";
    for (j = 0, len1 = args.length; j < len1; j++) {
      arg = args[j];
      str += Util.toStr(arg) + " ";
    }
    return str;
  }

  static toStr(arg) {
    Util.logStackNum++;
    if (Util.logStackNum > Util.logStackMax) {
      return '';
    }
    switch (typeof arg) {
      case 'null':
        return 'null';
      case 'string':
        return Util.toStrStr(arg);
      case 'number':
        return arg.toString();
      case 'object':
        return Util.toStrObj(arg);
      default:
        return arg;
    }
  }

  // Recusively stringify arrays and objects
  static toStrObj(arg) {
    var a, j, key, len1, str, val;
    str = "";
    if (arg == null) {
      str += "null";
    } else if (Util.isArray(arg)) {
      str += "[ ";
      for (j = 0, len1 = arg.length; j < len1; j++) {
        a = arg[j];
        str += Util.toStr(a) + ",";
      }
      str = str.substr(0, str.length - 1) + " ]";
    } else if (Util.isObjEmpty(arg)) {
      str += "{}";
    } else {
      str += "{ ";
      for (key in arg) {
        if (!hasProp.call(arg, key)) continue;
        val = arg[key];
        str += key + ":" + Util.toStr(val) + ", ";
      }
      str = str.substr(0, str.length - 2) + " }"; // Removes last comma
    }
    return str;
  }

  static toStrStr(arg) {
    if (arg.length > 0) {
      return arg;
    } else {
      return '""';
    }
  }

  static toOut(obj, level = 0) {
    var ind, key, out, val;
    ind = Util.indent(level * 2);
    out = "";
    for (key in obj) {
      if (!hasProp.call(obj, key)) continue;
      val = obj[key];
      if (!(key.charAt(0) === key.charAt(0).toUpperCase())) {
        continue;
      }
      out += ind + key + '\n';
      if (Util.isObj(val)) {
        out += Util.toOut(val, level + 1);
      }
    }
    return out;
  }

  // Consume unused but mandated variable to pass code inspections
  static noop(...args) {
  }

  static toError() {
    var str;
    str = Util.toStrArgs('Error:', arguments);
    return new Error(str);
  }

  static alert() {
    var str;
    str = Util.toStrArgs('', arguments);
    console.log(str);
    alert(str);
  }

  static logJSON(json) {
    var obj;
    obj = JSON.parse(json);
    console.log(obj);
  }

  static jQueryHasNotBeenLoaded() {
    if (typeof jQuery === 'undefined') {
      console.error('Util JQuery has not been loaded');
      return true;
    } else {
      return false;
    }
  }

  // ------ Validators ------
  static isDef(d) {
    return d !== null && typeof d !== 'undefined';
  }

  static isNot(d) {
    return !Util.isDef(d);
  }

  static isStr(s) {
    return Util.isDef(s) && typeof s === "string" && s.length > 0;
  }

  static isntStr(s) {
    return !Util.isStr(s);
  }

  static isNum(n) {
    return !isNaN(n);
  }

  static isObj(o) {
    return Util.isDef(o) && typeof o === "object";
  }

  static isVal(v) {
    return typeof v === "number" || typeof v === "string" || typeof v === "boolean";
  }

  static isNaN(v) {
    return Util.isDef(v) && typeof v === "number" && Number.isNaN(v);
  }

  static isSym(v) {
    return typeof v === "symbol";
  }

  static isObjEmpty(o) {
    return Util.isObj(o) && Object.getOwnPropertyNames(o).length === 0;
  }

  static isFunc(f) {
    return Util.isDef(f) && typeof f === "function";
  }

  static isArray(a) {
    return Util.isDef(a) && typeof a !== "string" && (a.length != null) && a.length > 0;
  }

  static isEvent(e) {
    return Util.isDef(e) && (e.target != null);
  }

  static inIndex(a, i) {
    return Util.isArray(a) && 0 <= i && i < a.length;
  }

  static inArray(a, e) {
    return Util.isArray(a) && a.indexOf(e) > -1;
  }

  static atArray(a, e) {
    if (Util.inArray(a, e)) {
      return a.indexOf(e);
    } else {
      return -1;
    }
  }

  static inString(s, e) {
    return Util.isStr(s) && s.indexOf(e) > -1;
  }

  static atLength(a, n) {
    return Util.isArray(a) && a.length === n;
  }

  static head(a) {
    if (Util.isArray(a)) {
      return a[0];
    } else {
      return null;
    }
  }

  static tail(a) {
    if (Util.isArray(a)) {
      return a[a.length - 1];
    } else {
      return null;
    }
  }

  static time() {
    return new Date().getTime();
  }

  static isStrInteger(s) {
    return /^\s*(\+|-)?\d+\s*$/.test(s);
  }

  static isStrFloat(s) {
    return /^\s*(\+|-)?((\d+(\.\d+)?)|(\.\d+))\s*$/.test(s);
  }

  static isStrCurrency(s) {
    return /^\s*(\+|-)?((\d+(\.\d\d)?)|(\.\d\d))\s*$/.test(s);
  }

  //@isStrEmail:(s)   -> /^\s*[\w\-\+_]+(\.[\w\-\+_]+)*\@[\w\-\+_]+\.[\w\-\+_]+(\.[\w\-\+_]+)*\s*$/.test(s)
  static isDefs() {
    var arg, j, len1;
    for (j = 0, len1 = arguments.length; j < len1; j++) {
      arg = arguments[j];
      if (arg == null) {
        return false;
      }
    }
    return true;
  }

  static checkTypes(type, args) {
    var arg, key;
    for (key in args) {
      if (!hasProp.call(args, key)) continue;
      arg = args[key];
      // console.log( "Util.checkTypes isNum() argument #{key} is #{type}", arg, Util.isNum(arg) )
      if (!Util.checkType(type, arg)) {
        console.log(`Util.checkTypes(type,args) argument ${key} is not ${type}`, arg);
        console.trace();
      }
    }
  }

  static checkType(type, arg) {
    switch (type) {
      case "string":
        return Util.isStr(arg);
      case "number":
        return Util.isNum(arg);
      case "object":
        return Util.isObj(arg);
      case "symbol":
        return Util.isSym(arg);
      case "function":
        return Util.isFunc(arg);
      case "array":
        return Util.isArray(arg);
      default:
        return false;
    }
  }

  static copyProperties(to, from) {
    var key, val;
    for (key in from) {
      if (!hasProp.call(from, key)) continue;
      val = from[key];
      to[key] = val;
    }
    return to;
  }

  static contains(array, value) {
    return Util.isArray(array) && array.indexOf(value) !== -1;
  }

  // Screen absolute (left top width height) percent positioning and scaling

  // Percent array to position mapping
  static toPosition(array) {
    return {
      left: array[0],
      top: array[1],
      width: array[2],
      height: array[3]
    };
  }

  // Adds Percent from array for CSS position mapping
  static toPositionPc(array) {
    return {
      position: 'absolute',
      left: array[0] + '%',
      top: array[1] + '%',
      width: array[2] + '%',
      height: array[3] + '%'
    };
  }

  static xyScale(prev, next, port, land) {
    var xn, xp, xs, yn, yp, ys;
    xp = 0;
    yp = 0;
    xn = 0;
    yn = 0;
    [xp, yp] = prev.orientation === 'Portrait' ? [port[2], port[3]] : [land[2], land[3]];
    [xn, yn] = next.orientation === 'Portrait' ? [port[2], port[3]] : [land[2], land[3]];
    xs = next.width * xn / (prev.width * xp);
    ys = next.height * yn / (prev.height * yp);
    return [xs, ys];
  }

  // ----------------- Guarded jQuery dependent calls -----------------
  static resize(callback) {
    window.onresize = function() {
      return setTimeout(callback, 100);
    };
  }

  static resizeTimeout(callback, timeout = null) {
    window.onresize = function() {
      if (timeout != null) {
        clearTimeout(timeout);
      }
      return timeout = setTimeout(callback, 100);
    };
  }

  // ------ Html ------------
  static getHtmlId(name, type = '', ext = '') {
    var id;
    id = name + type + ext + Util.uniqueIdExt;
    return id.replace(/[ \.]/g, "");
  }

  static htmlId(name, type = '', ext = '', issueError = true) {
    var id;
    id = Util.getHtmlId(name, type, ext);
    if ((Util.htmlIds[id] != null) && issueError) {
      console.error('Util.htmlId() duplicate html id', id);
    }
    Util.htmlIds[id] = id;
    return id;
  }

  static clearHtmlIds() {
    return Util.htmlIds = {};
  }

  // ------ Converters ------
  static extend(obj, mixin) {
    var method, name;
    for (name in mixin) {
      if (!hasProp.call(mixin, name)) continue;
      method = mixin[name];
      obj[name] = method;
    }
    return obj;
  }

  static include(klass, mixin) {
    return Util.extend(klass.prototype, mixin);
  }

  static eventErrorCode(e) {
    var errorCode;
    errorCode = (e.target != null) && e.target.errorCode ? e.target.errorCode : 'unknown';
    return {
      errorCode: errorCode
    };
  }

  static toName(s1) {
    var s2, s3, s4, s5;
    if (s1 == null) {
      console.trace();
      return "???";
    }
    s2 = s1.replace('_', ' ');
    s3 = s2.replace(/([A-Z][a-z])/g, ' $1');
    s4 = s3.replace(/([A-Z]+)/g, ' $1');
    s5 = s4.replace(/([0-9][A-Z])/g, ' $1');
    return s5;
  }

  static toAlpha(s1) {
    return s1.replace(/\W/g, '');
  }

  static indent(n) {
    var i, j, ref, str;
    str = '';
    for (i = j = 0, ref = n; (0 <= ref ? j < ref : j > ref); i = 0 <= ref ? ++j : --j) {
      str += ' ';
    }
    return str;
  }

  static hashCode(str) {
    var hash, i, j, ref;
    hash = 0;
    for (i = j = 0, ref = str.length; (0 <= ref ? j < ref : j > ref); i = 0 <= ref ? ++j : --j) {
      hash = (hash << 5) - hash + str.charCodeAt(i);
    }
    return hash;
  }

  static lastTok(str, delim) {
    return str.split(delim).pop();
  }

  static firstTok(str, delim) {
    if (Util.isStr(str) && (str.split != null)) {
      return str.split(delim)[0];
    } else {
      console.error("Util.firstTok() str is not at string", str);
      return '';
    }
  }

  static pdfCSS(href) {
    var link;
    if (!window.location.search.match(/pdf/gi)) {
      return;
    }
    link = document.createElement('link');
    link.rel = 'stylesheet';
    link.type = 'text/css';
    link.href = href;
    document.getElementsByTagName('head')[0].appendChild(link);
  }

  /*
  parse = document.createElement('a')
  parse.href =  "http://example.com:3000/dir1/dir2/file.ext?search=test#hash"
  parse.protocol  "http:"
  parse.hostname  "example.com"
  parse.port      "3000"
  parse.pathname  "/dir1/dir2/file.ext"
  parse.segments  ['dir1','dir2','file.ext']
  parse.fileExt   ['file','ext']
  parse.file       'file'
  parse.ext        'ext'
  parse.search    "?search=test"
  parse.hash      "#hash"
  parse.host      "example.com:3000"
  */
  static parseURI(uri) {
    var a, j, len1, name, nameValue, nameValues, parse, value;
    parse = {};
    parse.params = {};
    a = document.createElement('a');
    a.href = uri;
    parse.href = a.href;
    parse.protocol = a.protocol;
    parse.hostname = a.hostname;
    parse.port = a.port;
    parse.segments = a.pathname.split('/');
    parse.fileExt = parse.segments.pop().split('.');
    parse.file = parse.fileExt[0];
    parse.ext = parse.fileExt.length === 2 ? parse.fileExt[1] : '';
    parse.dbName = parse.file;
    parse.fragment = a.hash;
    parse.query = Util.isStr(a.search) ? a.search.substring(1) : '';
    nameValues = parse.query.split('&');
    if (Util.isArray(nameValues)) {
      for (j = 0, len1 = nameValues.length; j < len1; j++) {
        nameValue = nameValues[j];
        name = '';
        value = '';
        [name, value] = nameValue.split('=');
        parse.params[name] = value;
      }
    }
    return parse;
  }

  static quicksort(array) {
    var a, head, large, small;
    if (array.length === 0) {
      return [];
    }
    head = array.pop();
    small = (function() {
      var j, len1, results;
      results = [];
      for (j = 0, len1 = array.length; j < len1; j++) {
        a = array[j];
        if (a <= head) {
          results.push(a);
        }
      }
      return results;
    })();
    large = (function() {
      var j, len1, results;
      results = [];
      for (j = 0, len1 = array.length; j < len1; j++) {
        a = array[j];
        if (a > head) {
          results.push(a);
        }
      }
      return results;
    })();
    return (Util.quicksort(small)).concat([head]).concat(Util.quicksort(large));
  }

  static pad(n) {
    if (n < 10) {
      return '0' + n;
    } else {
      return n;
    }
  }

  static padStr(n) {
    if (n < 10) {
      return '0' + n.toString();
    } else {
      return n.toString();
    }
  }

  // Return and ISO formated data string
  static isoDateTime(dateIn) {
    var date, pad;
    date = dateIn != null ? dateIn : new Date();
    console.log('Util.isoDatetime()', date);
    console.log('Util.isoDatetime()', date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes, date.getUTCSeconds);
    pad = function(n) {
      return Util.pad(n);
    };
    return date.getFullYear()(+'-' + pad(date.getUTCMonth() + 1) + '-' + pad(date.getUTCDate()) + 'T' + pad(date.getUTCHours()) + ':' + pad(date.getUTCMinutes()) + ':' + pad(date.getUTCSeconds()) + 'Z');
  }

  static toHMS(unixTime) {
    var ampm, date, hour, min, sec, time;
    date = new Date();
    if (Util.isNum(unixTime)) {
      date.setTime(unixTime);
    }
    hour = date.getHours();
    ampm = 'AM';
    if (hour > 12) {
      hour = hour - 12;
      ampm = 'PM';
    }
    min = ('0' + date.getMinutes()).slice(-2);
    sec = ('0' + date.getSeconds()).slice(-2);
    time = `${hour}:${min}:${sec} ${ampm}`;
    return time;
  }

  // Generate four random hex digits
  static hex4() {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  }

  // Generate a 32 bits hex
  static hex32() {
    var hex, i, j;
    hex = this.hex4();
    for (i = j = 1; j <= 4; i = ++j) {
      Util.noop(i);
      hex += this.hex4();
    }
    return hex;
  }

  // Return a number with fixed decimal places
  static toFixed(arg, dec = 2) {
    var num;
    num = (function() {
      switch (typeof arg) {
        case 'number':
          return arg;
        case 'string':
          return parseFloat(arg);
        default:
          return 0;
      }
    })();
    return num.toFixed(dec);
  }

  static toInt(arg) {
    switch (typeof arg) {
      case 'number':
        return Math.floor(arg);
      case 'string':
        return parseInt(arg);
      default:
        return 0;
    }
  }

  static toFloat(arg) {
    switch (typeof arg) {
      case 'number':
        return arg;
      case 'string':
        return parseFloat(arg);
      default:
        return 0;
    }
  }

  static toCap(str) {
    return str.charAt(0).toUpperCase() + str.substring(1);
  }

  static unCap(str) {
    return str.charAt(0).toLowerCase() + str.substring(1);
  }

  static toArray(objs) {
    var array, key, obj;
    if (Util.isArray(objs)) {
      return objs;
    } else {
      array = [];
      for (key in objs) {
        if (!hasProp.call(objs, key)) continue;
        obj = objs[key];
        array.push(obj);
      }
      return array;
    }
  }

  
  // Not working
  static toArray2(objects, whereIn = null, keyField = 'id') {
    var array, j, key, len1, object, where;
    where = whereIn != null ? whereIn : function() {
      return true;
    };
    array = [];
    if (Util.isArray(objects)) {
      for (j = 0, len1 = array.length; j < len1; j++) {
        object = array[j];
        if (!(where(object))) {
          continue;
        }
        if ((object['id'] != null) && keyField !== 'id') {
          object[keyField] = object['id'];
        }
        array.push(object);
      }
    } else {
      for (key in objects) {
        if (!hasProp.call(objects, key)) continue;
        object = objects[key];
        if (!(where(key, object))) {
          continue;
        }
        object[keyField] = key;
        array.push(object);
      }
    }
    return array;
  }

  static toObjects(rows, whereIn = null, keyField = 'id') {
    var j, key, len1, objects, row, where;
    where = whereIn != null ? whereIn : function() {
      return true;
    };
    objects = {};
    if (Util.isArray(rows)) {
      for (j = 0, len1 = rows.length; j < len1; j++) {
        row = rows[j];
        if (!(where(row))) {
          continue;
        }
        if ((row['id'] != null) && keyField !== 'id') {
          row[keyField] = row['id'];
        }
        objects[row[keyField]] = row;
      }
    } else {
      for (key in rows) {
        row = rows[key];
        if (!(where(row))) {
          continue;
        }
        row[keyField] = key;
        objects[key] = row;
      }
    }
    return objects;
  }

  static lenObject(object, where = function() {
      return true;
    }) {
    var key, len, obj;
    len = 0;
    for (key in object) {
      if (!hasProp.call(object, key)) continue;
      obj = object[key];
      if (where(key)) {
        len = len + 1;
      }
    }
    return len;
  }

  // Beautiful Code, Chapter 1.
  // Implements a regular expression matcher that supports character matches,
  // '.', '^', '$', and '*'.

  // Search for the regexp anywhere in the text.
  static match(regexp, text) {
    if (regexp[0] === '^') {
      return Util.match_here(regexp.slice(1), text);
    }
    while (text) {
      if (Util.match_here(regexp, text)) {
        return true;
      }
      text = text.slice(1);
    }
    return false;
  }

  // Search for the regexp at the beginning of the text.
  static match_here(regexp, text) {
    var cur, next;
    cur = "";
    next = "";
    [cur, next] = [regexp[0], regexp[1]];
    if (regexp.length === 0) {
      return true;
    }
    if (next === '*') {
      return Util.match_star(cur, regexp.slice(2), text);
    }
    if (cur === '$' && !next) {
      return text.length === 0;
    }
    if (text && (cur === '.' || cur === text[0])) {
      return Util.match_here(regexp.slice(1), text.slice(1));
    }
    return false;
  }

  // Search for a kleene star match at the beginning of the text.
  static match_star(c, regexp, text) {
    while (true) {
      if (Util.match_here(regexp, text)) {
        return true;
      }
      if (!(text && (text[0] === c || c === '.'))) {
        return false;
      }
      text = text.slice(1);
    }
  }

  static match_test() {
    console.log(Util.match_args("ex", "some text"));
    console.log(Util.match_args("s..t", "spit"));
    console.log(Util.match_args("^..t", "buttercup"));
    console.log(Util.match_args("i..$", "cherries"));
    console.log(Util.match_args("o*m", "vrooooommm!"));
    return console.log(Util.match_args("^hel*o$", "hellllllo"));
  }

  static match_args(regexp, text) {
    return console.log(regexp, text, Util.match(regexp, text));
  }

  static svgId(name, type, svgType, check = false) {
    if (check) {
      return this.id(name, type, svgType);
    } else {
      return name + type + svgType;
    }
  }

  static css(name, type = '') {
    return name + type;
  }

  static icon(name, type, fa) {
    return name + type + ' fa fa-' + fa;
  }

  // json - "application/json;charset=utf-8"
  // svg
  static mineType(fileType) {
    var mine;
    mine = (function() {
      switch (fileType) {
        case 'json':
          return "application/json";
        case 'adoc':
          return "text/plain";
        case 'html':
          return "text/html";
        case 'svg':
          return "image/svg+xml";
        default:
          return "text/plain";
      }
    })();
    mine += ";charset=utf-8";
    return mine;
  }

  static saveFile(stuff, fileName, fileType) {
    var blob, downloadLink, url;
    blob = new Blob([stuff], {
      type: this.mineType(fileType)
    });
    url = window['URL'].createObjectURL(blob);
    downloadLink = document.createElement("a");
    downloadLink.href = url;
    downloadLink.download = fileName;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  }

};

// Static class variables have to be declared outside of class declarion to avoid function wrapper
Util.htmlIds = {}; // Object of unique Html Ids

Util.myVar = 'myVar';

Util.skipReady = false;

Util.modules = [];

Util.instances = [];

Util.logStackNum = 0;

Util.logStackMax = 100;

Util.fills = {};

Util.uniqueIdExt = '';

var Util$1 = Util;

var FontAwe;

FontAwe = {};

FontAwe.icons = {
  "fas fa-refresh": "\uf021",
  "fab fa-mendeley": "\uf7b3",
  "fas fa-drafting-compass": "\uf568",
  "fas fa-users-cog": "\uf509",
  "fab fa-centos": "\uf789",
  "fas fa-yin-yang": "\uf6ad",
  "fab fa-pagelines": "\uf18c",
  "fas fa-network-wired": "\uf6ff",
  "fas fa-warehouse": "\uf494",
  "fas fa-infinity": "\uf534",
  "fas fa-satellite": "\uf7bf",
  "fas fa-hands": "\uf4c2",
  "fas fa-chalkboard-teacher": "\uf51c",
  "fas fa-landmark": "\uf66f",
  "fas fa-podcast": "\uf2ce",
  "fas fa-hot-tub": "\uf593",
  "fas fa-brain": "\uf5dc",
  "fas fa-pen-fancy": "\uf5ac",
  "fas fa-shapes": "\uf61f",
  "fas fa-images": "\uf302",
  "fas fa-people-carry": "\uf4ce",
  "fas fa-poll": "\uf681",
  "fas fa-user-graduate": "\uf501",
  "fab fa-galactic-republic": "\uf50c",
  "fas fa-address-book": "\uf2b9",
  "fas fa-address-card": "\uf2bb",
  "fas fa-adjust": "\uf042",
  "fas fa-align-center": "\uf037",
  "fas fa-align-justify": "\uf039",
  "fas fa-align-left": "\uf036",
  "fas fa-align-right": "\uf038",
  "fas fa-allergies": "\uf461",
  "fas fa-ambulance": "\uf0f9",
  "fas fa-american-sign-language-interpreting": "\uf2a3",
  "fas fa-anchor": "\uf13d",
  "fas fa-angle-double-down": "\uf103",
  "fas fa-angle-double-left": "\uf100",
  "fas fa-angle-double-right": "\uf101",
  "fas fa-angle-double-up": "\uf102",
  "fas fa-angle-down": "\uf107",
  "fas fa-angle-left": "\uf104",
  "fas fa-angle-right": "\uf105",
  "fas fa-angle-up": "\uf106",
  "fas fa-archive": "\uf187",
  "fas fa-arrow-alt-circle-down": "\uf358",
  "fas fa-arrow-alt-circle-left": "\uf359",
  "fas fa-arrow-alt-circle-right": "\uf35a",
  "fas fa-arrow-alt-circle-up": "\uf35b",
  "fas fa-arrow-circle-down": "\uf0ab",
  "fas fa-arrow-circle-left": "\uf0a8",
  "fas fa-arrow-circle-right": "\uf0a9",
  "fas fa-arrow-circle-up": "\uf0aa",
  "fas fa-arrow-down": "\uf063",
  "fas fa-arrow-left": "\uf060",
  "fas fa-arrow-right": "\uf061",
  "fas fa-arrow-up": "\uf062",
  "fas fa-arrows-alt": "\uf0b2",
  "fas fa-arrows-alt-h": "\uf337",
  "fas fa-arrows-alt-v": "\uf338",
  "fas fa-assistive-listening-systems": "\uf2a2",
  "fas fa-asterisk": "\uf069",
  "fas fa-at": "\uf1fa",
  "fas fa-atom": "\uf5d2",
  "fas fa-atom fa-spin": "\uf5d2",
  "fas fa-audio-description": "\uf29e",
  "fas fa-backward": "\uf04a",
  "fas fa-balance-scale": "\uf24e",
  "fas fa-ban": "\uf05e",
  "fas fa-band-aid": "\uf462",
  "fas fa-barcode": "\uf02a",
  "fas fa-bars": "\uf0c9",
  "fas fa-baseball-ball": "\uf433",
  "fas fa-basketball-ball": "\uf434",
  "fas fa-bath": "\uf2cd",
  "fas fa-battery-empty": "\uf244",
  "fas fa-battery-full": "\uf240",
  "fas fa-battery-half": "\uf242",
  "fas fa-battery-quarter": "\uf243",
  "fas fa-battery-three-quarters": "\uf241",
  "fas fa-bed": "\uf236",
  "fas fa-beer": "\uf0fc",
  "fas fa-bell": "\uf0f3",
  "fas fa-bell-slash": "\uf1f6",
  "fas fa-bicycle": "\uf206",
  "fas fa-binoculars": "\uf1e5",
  "fas fa-birthday-cake": "\uf1fd",
  "fas fa-blind": "\uf29d",
  "fas fa-bold": "\uf032",
  "fas fa-bolt": "\uf0e7",
  "fas fa-bomb": "\uf1e2",
  "fas fa-book": "\uf02d",
  "fas fa-bookmark": "\uf02e",
  "fas fa-bowling-ball": "\uf436",
  "fas fa-box": "\uf466",
  "fas fa-box-open": "\uf49e",
  "fas fa-boxes": "\uf468",
  "fas fa-braille": "\uf2a1",
  "fas fa-briefcase": "\uf0b1",
  "fas fa-briefcase-medical": "\uf469",
  "fas fa-bug": "\uf188",
  "fas fa-building": "\uf1ad",
  "fas fa-bullhorn": "\uf0a1",
  "fas fa-bullseye": "\uf140",
  "fas fa-burn": "\uf46a",
  "fas fa-bus": "\uf207",
  "fas fa-calculator": "\uf1ec",
  "fas fa-calendar": "\uf133",
  "fas fa-calendar-alt": "\uf073",
  "fas fa-calendar-check": "\uf274",
  "fas fa-calendar-minus": "\uf272",
  "fas fa-calendar-plus": "\uf271",
  "fas fa-calendar-times": "\uf273",
  "fas fa-camera": "\uf030",
  "fas fa-camera-retro": "\uf083",
  "fas fa-capsules": "\uf46b",
  "fas fa-car": "\uf1b9",
  "fas fa-caret-down": "\uf0d7",
  "fas fa-caret-left": "\uf0d9",
  "fas fa-caret-right": "\uf0da",
  "fas fa-caret-square-down": "\uf150",
  "fas fa-caret-square-left": "\uf191",
  "fas fa-caret-square-right": "\uf152",
  "fas fa-caret-square-up": "\uf151",
  "fas fa-caret-up": "\uf0d8",
  "fas fa-cart-arrow-down": "\uf218",
  "fas fa-cart-plus": "\uf217",
  "fas fa-certificate": "\uf0a3",
  "fas fa-chart-area": "\uf1fe",
  "fas fa-chart-bar": "\uf080",
  "fas fa-chart-line": "\uf201",
  "fas fa-chart-pie": "\uf200",
  "fas fa-check": "\uf00c",
  "fas fa-check-circle": "\uf058",
  "fas fa-check-square": "\uf14a",
  "fas fa-chess": "\uf439",
  "fas fa-chess-bishop": "\uf43a",
  "fas fa-chess-board": "\uf43c",
  "fas fa-chess-king": "\uf43f",
  "fas fa-chess-knight": "\uf441",
  "fas fa-chess-pawn": "\uf443",
  "fas fa-chess-queen": "\uf445",
  "fas fa-chess-rook": "\uf447",
  "fas fa-chevron-circle-down": "\uf13a",
  "fas fa-chevron-circle-left": "\uf137",
  "fas fa-chevron-circle-right": "\uf138",
  "fas fa-chevron-circle-up": "\uf139",
  "fas fa-chevron-down": "\uf078",
  "fas fa-chevron-left": "\uf053",
  "fas fa-chevron-right": "\uf054",
  "fas fa-chevron-up": "\uf077",
  "fas fa-child": "\uf1ae",
  "fas fa-circle": "\uf111",
  "fas fa-circle-notch": "\uf1ce",
  "fas fa-clipboard": "\uf328",
  "fas fa-clipboard-check": "\uf46c",
  "fas fa-clipboard-list": "\uf46d",
  "fas fa-clock": "\uf017",
  "fas fa-clone": "\uf24d",
  "fas fa-closed-captioning": "\uf20a",
  "fas fa-cloud": "\uf0c2",
  "fas fa-cloud-download-alt": "\uf381",
  "fas fa-cloud-upload-alt": "\uf382",
  "fas fa-code": "\uf121",
  "fas fa-code-branch": "\uf126",
  "fas fa-coffee": "\uf0f4",
  "fas fa-cog": "\uf013",
  "fas fa-cogs": "\uf085",
  "fas fa-columns": "\uf0db",
  "fas fa-comment": "\uf075",
  "fas fa-comment-alt": "\uf27a",
  "fas fa-comment-dots": "\uf4ad",
  "fas fa-comment-slash": "\uf4b3",
  "fas fa-comments": "\uf086",
  "fas fa-compass": "\uf14e",
  "fas fa-compress": "\uf066",
  "fas fa-copy": "\uf0c5",
  "fas fa-copyright": "\uf1f9",
  "fas fa-couch": "\uf4b8",
  "fas fa-credit-card": "\uf09d",
  "fas fa-crop": "\uf125",
  "fas fa-crosshairs": "\uf05b",
  "fas fa-cube": "\uf1b2",
  "fas fa-cubes": "\uf1b3",
  "fas fa-cut": "\uf0c4",
  "fas fa-database": "\uf1c0",
  "fas fa-deaf": "\uf2a4",
  "fas fa-desktop": "\uf108",
  "fas fa-dharmachakra": "\uf655",
  "fas fa-diagnoses": "\uf470",
  "fas fa-dna": "\uf471",
  "fas fa-dollar-sign": "\uf155",
  "fas fa-dolly": "\uf472",
  "fas fa-dolly-flatbed": "\uf474",
  "fas fa-donate": "\uf4b9",
  "fas fa-dot-circle": "\uf192",
  "fas fa-dove": "\uf4ba",
  "fas fa-download": "\uf019",
  "fas fa-edit": "\uf044",
  "fas fa-eject": "\uf052",
  "fas fa-ellipsis-h": "\uf141",
  "fas fa-ellipsis-v": "\uf142",
  "fas fa-envelope": "\uf0e0",
  "fas fa-envelope-open": "\uf2b6",
  "fas fa-envelope-square": "\uf199",
  "fas fa-eraser": "\uf12d",
  "fas fa-euro-sign": "\uf153",
  "fas fa-exchange-alt": "\uf362",
  "fas fa-exclamation": "\uf12a",
  "fas fa-exclamation-circle": "\uf06a",
  "fas fa-exclamation-triangle": "\uf071",
  "fas fa-expand": "\uf065",
  "fas fa-expand-arrows-alt": "\uf31e",
  "fas fa-external-link-alt": "\uf35d",
  "fas fa-external-link-square-alt": "\uf360",
  "fas fa-eye": "\uf06e",
  "fas fa-eye-dropper": "\uf1fb",
  "fas fa-eye-slash": "\uf070",
  "fas fa-fast-backward": "\uf049",
  "fas fa-fast-forward": "\uf050",
  "fas fa-fax": "\uf1ac",
  "fas fa-female": "\uf182",
  "fas fa-fighter-jet": "\uf0fb",
  "fas fa-file": "\uf15b",
  "fas fa-file-alt": "\uf15c",
  "fas fa-file-archive": "\uf1c6",
  "fas fa-file-audio": "\uf1c7",
  "fas fa-file-code": "\uf1c9",
  "fas fa-file-excel": "\uf1c3",
  "fas fa-file-image": "\uf1c5",
  "fas fa-file-medical": "\uf477",
  "fas fa-file-medical-alt": "\uf478",
  "fas fa-file-pdf": "\uf1c1",
  "fas fa-file-powerpoint": "\uf1c4",
  "fas fa-file-video": "\uf1c8",
  "fas fa-file-word": "\uf1c2",
  "fas fa-film": "\uf008",
  "fas fa-filter": "\uf0b0",
  "fas fa-fire": "\uf06d",
  "fas fa-fire-extinguisher": "\uf134",
  "fas fa-first-aid": "\uf479",
  "fas fa-flag": "\uf024",
  "fas fa-flag-checkered": "\uf11e",
  "fas fa-flask": "\uf0c3",
  "fas fa-folder": "\uf07b",
  "fas fa-folder-open": "\uf07c",
  "fas fa-font": "\uf031",
  "fas fa-football-ball": "\uf44e",
  "fas fa-forward": "\uf04e",
  "fas fa-frown": "\uf119",
  "fas fa-futbol": "\uf1e3",
  "fas fa-gamepad": "\uf11b",
  "fas fa-gavel": "\uf0e3",
  "fas fa-gem": "\uf3a5",
  "fas fa-genderless": "\uf22d",
  "fas fa-gift": "\uf06b",
  "fas fa-glass-martini": "\uf000",
  "fas fa-globe": "\uf0ac",
  "fas fa-golf-ball": "\uf450",
  "fas fa-graduation-cap": "\uf19d",
  "fas fa-h-square": "\uf0fd",
  "fas fa-hand-holding": "\uf4bd",
  "fas fa-hand-holding-heart": "\uf4be",
  "fas fa-hand-holding-usd": "\uf4c0",
  "fas fa-hand-lizard": "\uf258",
  "fas fa-hand-paper": "\uf256",
  "fas fa-hand-peace": "\uf25b",
  "fas fa-hand-point-down": "\uf0a7",
  "fas fa-hand-point-left": "\uf0a5",
  "fas fa-hand-point-right": "\uf0a4",
  "fas fa-hand-point-up": "\uf0a6",
  "fas fa-hand-pointer": "\uf25a",
  "fas fa-hand-rock": "\uf255",
  "fas fa-hand-scissors": "\uf257",
  "fas fa-hand-spock": "\uf259",
  "fas fa-hands": "\uf4c2",
  "fas fa-hands-helping": "\uf4c4",
  "fas fa-handshake": "\uf2b5",
  "fas fa-hashtag": "\uf292",
  "fas fa-hdd": "\uf0a0",
  "fas fa-heading": "\uf1dc",
  "fas fa-headphones": "\uf025",
  "fas fa-heart": "\uf004",
  "fas fa-heartbeat": "\uf21e",
  "fas fa-history": "\uf1da",
  "fas fa-hockey-puck": "\uf453",
  "fas fa-home": "\uf015",
  "fas fa-hospital": "\uf0f8",
  "fas fa-hospital-alt": "\uf47d",
  "fas fa-hospital-symbol": "\uf47e",
  "fas fa-hourglass": "\uf254",
  "fas fa-hourglass-end": "\uf253",
  "fas fa-hourglass-half": "\uf252",
  "fas fa-hourglass-start": "\uf251",
  "fas fa-i-cursor": "\uf246",
  "fas fa-id-badge": "\uf2c1",
  "fas fa-id-card": "\uf2c2",
  "fas fa-id-card-alt": "\uf47f",
  "fas fa-image": "\uf03e",
  "fas fa-inbox": "\uf01c",
  "fas fa-indent": "\uf03c",
  "fas fa-industry": "\uf275",
  "fas fa-info": "\uf129",
  "fas fa-info-circle": "\uf05a",
  "fas fa-italic": "\uf033",
  "fas fa-key": "\uf084",
  "fas fa-keyboard": "\uf11c",
  "fas fa-language": "\uf1ab",
  "fas fa-laptop": "\uf109",
  "fas fa-leaf": "\uf06c",
  "fas fa-lemon": "\uf094",
  "fas fa-level-down-alt": "\uf3be",
  "fas fa-level-up-alt": "\uf3bf",
  "fas fa-life-ring": "\uf1cd",
  "fas fa-lightbulb": "\uf0eb",
  "fas fa-link": "\uf0c1",
  "fas fa-lira-sign": "\uf195",
  "fas fa-list": "\uf03a",
  "fas fa-list-alt": "\uf022",
  "fas fa-list-ol": "\uf0cb",
  "fas fa-list-ul": "\uf0ca",
  "fas fa-location-arrow": "\uf124",
  "fas fa-lock": "\uf023",
  "fas fa-lock-open": "\uf3c1",
  "fas fa-long-arrow-alt-down": "\uf309",
  "fas fa-long-arrow-alt-left": "\uf30a",
  "fas fa-long-arrow-alt-right": "\uf30b",
  "fas fa-long-arrow-alt-up": "\uf30c",
  "fas fa-low-vision": "\uf2a8",
  "fas fa-magic": "\uf0d0",
  "fas fa-magnet": "\uf076",
  "fas fa-male": "\uf183",
  "fas fa-map": "\uf279",
  "fas fa-map-marker": "\uf041",
  "fas fa-map-marker-alt": "\uf3c5",
  "fas fa-map-pin": "\uf276",
  "fas fa-map-signs": "\uf277",
  "fas fa-mars": "\uf222",
  "fas fa-mars-double": "\uf227",
  "fas fa-mars-stroke": "\uf229",
  "fas fa-mars-stroke-h": "\uf22b",
  "fas fa-mars-stroke-v": "\uf22a",
  "fas fa-medkit": "\uf0fa",
  "fas fa-meh": "\uf11a",
  "fas fa-mercury": "\uf223",
  "fas fa-microchip": "\uf2db",
  "fas fa-microphone": "\uf130",
  "fas fa-microphone-slash": "\uf131",
  "fas fa-minus": "\uf068",
  "fas fa-minus-circle": "\uf056",
  "fas fa-minus-square": "\uf146",
  "fas fa-mobile": "\uf10b",
  "fas fa-mobile-alt": "\uf3cd",
  "fas fa-money-bill-alt": "\uf3d1",
  "fas fa-moon": "\uf186",
  "fas fa-motorcycle": "\uf21c",
  "fas fa-mouse-pointer": "\uf245",
  "fas fa-music": "\uf001",
  "fas fa-neuter": "\uf22c",
  "fas fa-newspaper": "\uf1ea",
  "fas fa-notes-medical": "\uf481",
  "fas fa-object-group": "\uf247",
  "fas fa-object-ungroup": "\uf248",
  "fas fa-outdent": "\uf03b",
  "fas fa-paint-brush": "\uf1fc",
  "fas fa-pallet": "\uf482",
  "fas fa-paper-plane": "\uf1d8",
  "fas fa-paperclip": "\uf0c6",
  "fas fa-parachute-box": "\uf4cd",
  "fas fa-paragraph": "\uf1dd",
  "fas fa-paste": "\uf0ea",
  "fas fa-pause": "\uf04c",
  "fas fa-pause-circle": "\uf28b",
  "fas fa-paw": "\uf1b0",
  "fas fa-pen-square": "\uf14b",
  "fas fa-pencil-alt": "\uf303",
  "fas fa-percent": "\uf295",
  "fas fa-phone": "\uf095",
  "fas fa-phone-slash": "\uf3dd",
  "fas fa-phone-square": "\uf098",
  "fas fa-phone-volume": "\uf2a0",
  "fas fa-piggy-bank": "\uf4d3",
  "fas fa-pills": "\uf484",
  "fas fa-plane": "\uf072",
  "fas fa-play": "\uf04b",
  "fas fa-play-circle": "\uf144",
  "fas fa-plug": "\uf1e6",
  "fas fa-plus": "\uf067",
  "fas fa-plus-circle": "\uf055",
  "fas fa-plus-square": "\uf0fe",
  "fas fa-poo": "\uf2fe",
  "fas fa-pound-sign": "\uf154",
  "fas fa-power-off": "\uf011",
  "fas fa-prescription-bottle": "\uf485",
  "fas fa-prescription-bottle-alt": "\uf486",
  "fas fa-print": "\uf02f",
  "fas fa-procedures": "\uf487",
  "fas fa-puzzle-piece": "\uf12e",
  "fas fa-qrcode": "\uf029",
  "fas fa-question": "\uf128",
  "fas fa-question-circle": "\uf059",
  "fas fa-quidditch": "\uf458",
  "fas fa-quote-left": "\uf10d",
  "fas fa-quote-right": "\uf10e",
  "fas fa-random": "\uf074",
  "fas fa-recycle": "\uf1b8",
  "fas fa-redo": "\uf01e",
  "fas fa-redo-alt": "\uf2f9",
  "fas fa-registered": "\uf25d",
  "fas fa-reply": "\uf3e5",
  "fas fa-reply-all": "\uf122",
  "fas fa-retweet": "\uf079",
  "fas fa-ribbon": "\uf4d6",
  "fas fa-road": "\uf018",
  "fas fa-rocket": "\uf135",
  "fas fa-rss": "\uf09e",
  "fas fa-rss-square": "\uf143",
  "fas fa-ruble-sign": "\uf158",
  "fas fa-rupee-sign": "\uf156",
  "fas fa-save": "\uf0c7",
  "fas fa-search": "\uf002",
  "fas fa-search-minus": "\uf010",
  "fas fa-search-plus": "\uf00e",
  "fas fa-seedling": "\uf4d8",
  "fas fa-server": "\uf233",
  "fas fa-share": "\uf064",
  "fas fa-share-alt": "\uf1e0",
  "fas fa-share-alt-square": "\uf1e1",
  "fas fa-share-square": "\uf14d",
  "fas fa-shekel-sign": "\uf20b",
  "fas fa-shield-alt": "\uf3ed",
  "fas fa-ship": "\uf21a",
  "fas fa-shipping-fast": "\uf48b",
  "fas fa-shopping-bag": "\uf290",
  "fas fa-shopping-basket": "\uf291",
  "fas fa-shopping-cart": "\uf07a",
  "fas fa-shower": "\uf2cc",
  "fas fa-sign": "\uf4d9",
  "fas fa-sign-in-alt": "\uf2f6",
  "fas fa-sign-language": "\uf2a7",
  "fas fa-sign-out-alt": "\uf2f5",
  "fas fa-signal": "\uf012",
  "fas fa-sitemap": "\uf0e8",
  "fas fa-sliders-h": "\uf1de",
  "fas fa-smile": "\uf118",
  "fas fa-smoking": "\uf48d",
  "fas fa-snowflake": "\uf2dc",
  "fas fa-sort": "\uf0dc",
  "fas fa-sort-alpha-down": "\uf15d",
  "fas fa-sort-alpha-up": "\uf15e",
  "fas fa-sort-amount-down": "\uf160",
  "fas fa-sort-amount-up": "\uf161",
  "fas fa-sort-down": "\uf0dd",
  "fas fa-sort-numeric-down": "\uf162",
  "fas fa-sort-numeric-up": "\uf163",
  "fas fa-sort-up": "\uf0de",
  "fas fa-space-shuttle": "\uf197",
  "fas fa-spinner": "\uf110",
  "fas fa-spinner fa-pulse": "\uf110",
  "fas fa-square": "\uf0c8",
  "fas fa-square-full": "\uf45c",
  "fas fa-star": "\uf005",
  "fas fa-star-half": "\uf089",
  "fas fa-step-backward": "\uf048",
  "fas fa-step-forward": "\uf051",
  "fas fa-stethoscope": "\uf0f1",
  "fas fa-sticky-note": "\uf249",
  "fas fa-stop": "\uf04d",
  "fas fa-stop-circle": "\uf28d",
  "fas fa-stopwatch": "\uf2f2",
  "fas fa-street-view": "\uf21d",
  "fas fa-strikethrough": "\uf0cc",
  "fas fa-subscript": "\uf12c",
  "fas fa-subway": "\uf239",
  "fas fa-suitcase": "\uf0f2",
  "fas fa-sun": "\uf185",
  "fas fa-superscript": "\uf12b",
  "fas fa-sync": "\uf021",
  "fas fa-sync fa-spin": "\uf021",
  "fas fa-sync-alt": "\uf2f1",
  "fas fa-syringe": "\uf48e",
  "fas fa-table": "\uf0ce",
  "fas fa-table-tennis": "\uf45d",
  "fas fa-tablet": "\uf10a",
  "fas fa-tablet-alt": "\uf3fa",
  "fas fa-tablets": "\uf490",
  "fas fa-tachometer-alt": "\uf3fd",
  "fas fa-tag": "\uf02b",
  "fas fa-tags": "\uf02c",
  "fas fa-tape": "\uf4db",
  "fas fa-tasks": "\uf0ae",
  "fas fa-taxi": "\uf1ba",
  "fas fa-terminal": "\uf120",
  "fas fa-text-height": "\uf034",
  "fas fa-text-width": "\uf035",
  "fas fa-th": "\uf00a",
  "fas fa-th-large": "\uf009",
  "fas fa-th-list": "\uf00b",
  "fas fa-thermometer": "\uf491",
  "fas fa-thermometer-empty": "\uf2cb",
  "fas fa-thermometer-full": "\uf2c7",
  "fas fa-thermometer-half": "\uf2c9",
  "fas fa-thermometer-quarter": "\uf2ca",
  "fas fa-thermometer-three-quarters": "\uf2c8",
  "fas fa-thumbs-down": "\uf165",
  "fas fa-thumbs-up": "\uf164",
  "fas fa-thumbtack": "\uf08d",
  "fas fa-ticket-alt": "\uf3ff",
  "fas fa-times": "\uf00d",
  "fas fa-times-circle": "\uf057",
  "fas fa-tint": "\uf043",
  "fas fa-toggle-off": "\uf204",
  "fas fa-toggle-on": "\uf205",
  "fas fa-trademark": "\uf25c",
  "fas fa-train": "\uf238",
  "fas fa-transgender": "\uf224",
  "fas fa-transgender-alt": "\uf225",
  "fas fa-trash": "\uf1f8",
  "fas fa-trash-alt": "\uf2ed",
  "fas fa-tree": "\uf1bb",
  "fas fa-trophy": "\uf091",
  "fas fa-truck": "\uf0d1",
  "fas fa-truck-loading": "\uf4de",
  "fas fa-truck-moving": "\uf4df",
  "fas fa-tty": "\uf1e4",
  "fas fa-tv": "\uf26c",
  "fas fa-umbrella": "\uf0e9",
  "fas fa-underline": "\uf0cd",
  "fas fa-undo": "\uf0e2",
  "fas fa-undo-alt": "\uf2ea",
  "fas fa-universal-access": "\uf29a",
  "fas fa-university": "\uf19c",
  "fas fa-unlink": "\uf127",
  "fas fa-unlock": "\uf09c",
  "fas fa-unlock-alt": "\uf13e",
  "fas fa-upload": "\uf093",
  "fas fa-user": "\uf007",
  "fas fa-user-circle": "\uf2bd",
  "fas fa-user-md": "\uf0f0",
  "fas fa-user-plus": "\uf234",
  "fas fa-user-secret": "\uf21b",
  "fas fa-user-times": "\uf235",
  "fas fa-user-friends": "\uf500",
  "fas fa-users": "\uf0c0",
  "fas fa-utensil-spoon": "\uf2e5",
  "fas fa-utensils": "\uf2e7",
  "fas fa-venus": "\uf221",
  "fas fa-venus-double": "\uf226",
  "fas fa-venus-mars": "\uf228",
  "fas fa-vial": "\uf492",
  "fas fa-vials": "\uf493",
  "fas fa-video": "\uf03d",
  "fas fa-video-slash": "\uf4e2",
  "fas fa-volleyball-ball": "\uf45f",
  "fas fa-volume-down": "\uf027",
  "fas fa-volume-off": "\uf026",
  "fas fa-volume-up": "\uf028",
  "fas fa-weight": "\uf496",
  "fas fa-wheelchair": "\uf193",
  "fas fa-wifi": "\uf1eb",
  "fas fa-window-close": "\uf410",
  "fas fa-window-maximize": "\uf2d0",
  "fas fa-window-minimize": "\uf2d1",
  "fas fa-window-restore": "\uf2d2",
  "fas fa-wine-glass": "\uf4e3",
  "fas fa-won-sign": "\uf159",
  "fas fa-wrench": "\uf0ad",
  "fas fa-x-ray": "\uf497",
  "fas fa-yen-sign": "\uf157",
  "fab fa-500px": "\uf26e",
  "fab fa-accessible-icon": "\uf368",
  "fab fa-accusoft": "\uf369",
  "fab fa-adn": "\uf170",
  "fab fa-adversal": "\uf36a",
  "fab fa-affiliatetheme": "\uf36b",
  "fab fa-algolia": "\uf36c",
  "fab fa-amazon": "\uf270",
  "fab fa-amazon-pay": "\uf42c",
  "fab fa-amilia": "\uf36d",
  "fab fa-android": "\uf17b",
  "fab fa-angellist": "\uf209",
  "fab fa-angrycreative": "\uf36e",
  "fab fa-angular": "\uf420",
  "fab fa-app-store": "\uf36f",
  "fab fa-app-store-ios": "\uf370",
  "fab fa-apper": "\uf371",
  "fab fa-apple": "\uf179",
  "fab fa-apple-pay": "\uf415",
  "fab fa-asymmetrik": "\uf372",
  "fab fa-audible": "\uf373",
  "fab fa-autoprefixer": "\uf41c",
  "fab fa-avianex": "\uf374",
  "fab fa-aviato": "\uf421",
  "fab fa-aws": "\uf375",
  "fab fa-bandcamp": "\uf2d5",
  "fab fa-behance": "\uf1b4",
  "fab fa-behance-square": "\uf1b5",
  "fab fa-bimobject": "\uf378",
  "fab fa-bitbucket": "\uf171",
  "fab fa-bitcoin": "\uf379",
  "fab fa-bity": "\uf37a",
  "fab fa-black-tie": "\uf27e",
  "fab fa-blackberry": "\uf37b",
  "fab fa-blogger": "\uf37c",
  "fab fa-blogger-b": "\uf37d",
  "fab fa-bluetooth": "\uf293",
  "fab fa-bluetooth-b": "\uf294",
  "fab fa-btc": "\uf15a",
  "fab fa-buromobelexperte": "\uf37f",
  "fab fa-buysellads": "\uf20d",
  "fab fa-cc-amazon-pay": "\uf42d",
  "fab fa-cc-amex": "\uf1f3",
  "fab fa-cc-apple-pay": "\uf416",
  "fab fa-cc-diners-club": "\uf24c",
  "fab fa-cc-discover": "\uf1f2",
  "fab fa-cc-jcb": "\uf24b",
  "fab fa-cc-mastercard": "\uf1f1",
  "fab fa-cc-paypal": "\uf1f4",
  "fab fa-cc-stripe": "\uf1f5",
  "fab fa-cc-visa": "\uf1f0",
  "fab fa-centercode": "\uf380",
  "fab fa-chrome": "\uf268",
  "fab fa-cloudscale": "\uf383",
  "fab fa-cloudsmith": "\uf384",
  "fab fa-cloudversify": "\uf385",
  "fab fa-codepen": "\uf1cb",
  "fab fa-codiepie": "\uf284",
  "fab fa-connectdevelop": "\uf20e",
  "fab fa-contao": "\uf26d",
  "fab fa-cpanel": "\uf388",
  "fab fa-creative-commons": "\uf25e",
  "fab fa-css3": "\uf13c",
  "fab fa-css3-alt": "\uf38b",
  "fab fa-cuttlefish": "\uf38c",
  "fab fa-d-and-d": "\uf38d",
  "fab fa-dashcube": "\uf210",
  "fab fa-delicious": "\uf1a5",
  "fab fa-deploydog": "\uf38e",
  "fab fa-deskpro": "\uf38f",
  "fab fa-deviantart": "\uf1bd",
  "fab fa-digg": "\uf1a6",
  "fab fa-digital-ocean": "\uf391",
  "fab fa-discord": "\uf392",
  "fab fa-discourse": "\uf393",
  "fab fa-dochub": "\uf394",
  "fab fa-docker": "\uf395",
  "fab fa-draft2digital": "\uf396",
  "fab fa-dribbble": "\uf17d",
  "fab fa-dribbble-square": "\uf397",
  "fab fa-dropbox": "\uf16b",
  "fab fa-drupal": "\uf1a9",
  "fab fa-dyalog": "\uf399",
  "fab fa-earlybirds": "\uf39a",
  "fab fa-edge": "\uf282",
  "fab fa-elementor": "\uf430",
  "fab fa-ember": "\uf423",
  "fab fa-empire": "\uf1d1",
  "fab fa-envira": "\uf299",
  "fab fa-erlang": "\uf39d",
  "fab fa-ethereum": "\uf42e",
  "fab fa-etsy": "\uf2d7",
  "fab fa-expeditedssl": "\uf23e",
  "fab fa-facebook": "\uf09a",
  "fab fa-facebook-f": "\uf39e",
  "fab fa-facebook-messenger": "\uf39f",
  "fab fa-facebook-square": "\uf082",
  "fab fa-firefox": "\uf269",
  "fab fa-first-order": "\uf2b0",
  "fab fa-firstdraft": "\uf3a1",
  "fab fa-flickr": "\uf16e",
  "fab fa-flipboard": "\uf44d",
  "fab fa-fly": "\uf417",
  "fab fa-font-awesome": "\uf2b4",
  "fab fa-font-awesome-alt": "\uf35c",
  "fab fa-font-awesome-flag": "\uf425",
  "fab fa-fonticons": "\uf280",
  "fab fa-fonticons-fi": "\uf3a2",
  "fab fa-fort-awesome": "\uf286",
  "fab fa-fort-awesome-alt": "\uf3a3",
  "fab fa-forumbee": "\uf211",
  "fab fa-foursquare": "\uf180",
  "fab fa-free-code-camp": "\uf2c5",
  "fab fa-freebsd": "\uf3a4",
  "fab fa-get-pocket": "\uf265",
  "fab fa-gg": "\uf260",
  "fab fa-gg-circle": "\uf261",
  "fab fa-git": "\uf1d3",
  "fab fa-git-square": "\uf1d2",
  "fab fa-github": "\uf09b",
  "fab fa-github-alt": "\uf113",
  "fab fa-github-square": "\uf092",
  "fab fa-gitkraken": "\uf3a6",
  "fab fa-gitlab": "\uf296",
  "fab fa-gitter": "\uf426",
  "fab fa-glide": "\uf2a5",
  "fab fa-glide-g": "\uf2a6",
  "fab fa-gofore": "\uf3a7",
  "fab fa-goodreads": "\uf3a8",
  "fab fa-goodreads-g": "\uf3a9",
  "fab fa-google": "\uf1a0",
  "fab fa-google-drive": "\uf3aa",
  "fab fa-google-play": "\uf3ab",
  "fab fa-google-plus": "\uf2b3",
  "fab fa-google-plus-g": "\uf0d5",
  "fab fa-google-plus-square": "\uf0d4",
  "fab fa-google-wallet": "\uf1ee",
  "fab fa-gratipay": "\uf184",
  "fab fa-grav": "\uf2d6",
  "fab fa-gripfire": "\uf3ac",
  "fab fa-grunt": "\uf3ad",
  "fab fa-gulp": "\uf3ae",
  "fab fa-hacker-news": "\uf1d4",
  "fab fa-hacker-news-square": "\uf3af",
  "fab fa-hips": "\uf452",
  "fab fa-hire-a-helper": "\uf3b0",
  "fab fa-hooli": "\uf427",
  "fab fa-hotjar": "\uf3b1",
  "fab fa-houzz": "\uf27c",
  "fab fa-html5": "\uf13b",
  "fab fa-hubspot": "\uf3b2",
  "fab fa-imdb": "\uf2d8",
  "fab fa-instagram": "\uf16d",
  "fab fa-internet-explorer": "\uf26b",
  "fab fa-ioxhost": "\uf208",
  "fab fa-itunes": "\uf3b4",
  "fab fa-itunes-note": "\uf3b5",
  "fab fa-java": "\uf4e4",
  "fab fa-jenkins": "\uf3b6",
  "fab fa-joget": "\uf3b7",
  "fab fa-joomla": "\uf1aa",
  "fab fa-js": "\uf3b8",
  "fab fa-js-square": "\uf3b9",
  "fab fa-jsfiddle": "\uf1cc",
  "fab fa-keycdn": "\uf3ba",
  "fab fa-kickstarter": "\uf3bb",
  "fab fa-kickstarter-k": "\uf3bc",
  "fab fa-korvue": "\uf42f",
  "fab fa-laravel": "\uf3bd",
  "fab fa-lastfm": "\uf202",
  "fab fa-lastfm-square": "\uf203",
  "fab fa-leanpub": "\uf212",
  "fab fa-less": "\uf41d",
  "fab fa-line": "\uf3c0",
  "fab fa-linkedin": "\uf08c",
  "fab fa-linkedin-in": "\uf0e1",
  "fab fa-linode": "\uf2b8",
  "fab fa-linux": "\uf17c",
  "fab fa-lyft": "\uf3c3",
  "fab fa-magento": "\uf3c4",
  "fab fa-maxcdn": "\uf136",
  "fab fa-medapps": "\uf3c6",
  "fab fa-medium": "\uf23a",
  "fab fa-medium-m": "\uf3c7",
  "fab fa-medrt": "\uf3c8",
  "fab fa-meetup": "\uf2e0",
  "fab fa-microsoft": "\uf3ca",
  "fab fa-mix": "\uf3cb",
  "fab fa-mixcloud": "\uf289",
  "fab fa-mizuni": "\uf3cc",
  "fab fa-modx": "\uf285",
  "fab fa-monero": "\uf3d0",
  "fab fa-napster": "\uf3d2",
  "fab fa-nintendo-switch": "\uf418",
  "fab fa-node": "\uf419",
  "fab fa-node-js": "\uf3d3",
  "fab fa-npm": "\uf3d4",
  "fab fa-ns8": "\uf3d5",
  "fab fa-nutritionix": "\uf3d6",
  "fab fa-odnoklassniki": "\uf263",
  "fab fa-odnoklassniki-square": "\uf264",
  "fab fa-opencart": "\uf23d",
  "fab fa-openid": "\uf19b",
  "fab fa-opera": "\uf26a",
  "fab fa-optin-monster": "\uf23c",
  "fab fa-osi": "\uf41a",
  "fab fa-page4": "\uf3d7",
  "fab fa-pagelines": "\uf18c",
  "fab fa-palfed": "\uf3d8",
  "fab fa-patreon": "\uf3d9",
  "fab fa-paypal": "\uf1ed",
  "fab fa-periscope": "\uf3da",
  "fab fa-phabricator": "\uf3db",
  "fab fa-phoenix-framework": "\uf3dc",
  "fab fa-php": "\uf457",
  "fab fa-pied-piper": "\uf2ae",
  "fab fa-pied-piper-alt": "\uf1a8",
  "fab fa-pied-piper-hat": "\uf4e5",
  "fab fa-pied-piper-pp": "\uf1a7",
  "fab fa-pinterest": "\uf0d2",
  "fab fa-pinterest-p": "\uf231",
  "fab fa-pinterest-square": "\uf0d3",
  "fab fa-playstation": "\uf3df",
  "fab fa-product-hunt": "\uf288",
  "fab fa-pushed": "\uf3e1",
  "fab fa-python": "\uf3e2",
  "fab fa-qq": "\uf1d6",
  "fab fa-quinscape": "\uf459",
  "fab fa-quora": "\uf2c4",
  "fab fa-ravelry": "\uf2d9",
  "fab fa-react": "\uf41b",
  "fab fa-readme": "\uf4d5",
  "fab fa-rebel": "\uf1d0",
  "fab fa-red-river": "\uf3e3",
  "fab fa-reddit": "\uf1a1",
  "fab fa-reddit-alien": "\uf281",
  "fab fa-reddit-square": "\uf1a2",
  "fab fa-rendact": "\uf3e4",
  "fab fa-renren": "\uf18b",
  "fab fa-replyd": "\uf3e6",
  "fab fa-resolving": "\uf3e7",
  "fab fa-rocketchat": "\uf3e8",
  "fab fa-rockrms": "\uf3e9",
  "fab fa-safari": "\uf267",
  "fab fa-sass": "\uf41e",
  "fab fa-schlix": "\uf3ea",
  "fab fa-scribd": "\uf28a",
  "fab fa-searchengin": "\uf3eb",
  "fab fa-sellcast": "\uf2da",
  "fab fa-sellsy": "\uf213",
  "fab fa-servicestack": "\uf3ec",
  "fab fa-shirtsinbulk": "\uf214",
  "fab fa-simplybuilt": "\uf215",
  "fab fa-sistrix": "\uf3ee",
  "fab fa-skyatlas": "\uf216",
  "fab fa-skype": "\uf17e",
  "fab fa-slack": "\uf198",
  "fab fa-slack-hash": "\uf3ef",
  "fab fa-slideshare": "\uf1e7",
  "fab fa-snapchat": "\uf2ab",
  "fab fa-snapchat-ghost": "\uf2ac",
  "fab fa-snapchat-square": "\uf2ad",
  "fab fa-soundcloud": "\uf1be",
  "fab fa-speakap": "\uf3f3",
  "fab fa-spotify": "\uf1bc",
  "fab fa-stack-exchange": "\uf18d",
  "fab fa-stack-overflow": "\uf16c",
  "fab fa-staylinked": "\uf3f5",
  "fab fa-steam": "\uf1b6",
  "fab fa-steam-square": "\uf1b7",
  "fab fa-steam-symbol": "\uf3f6",
  "fab fa-sticker-mule": "\uf3f7",
  "fab fa-strava": "\uf428",
  "fab fa-stripe": "\uf429",
  "fab fa-stripe-s": "\uf42a",
  "fab fa-studiovinari": "\uf3f8",
  "fab fa-stumbleupon": "\uf1a4",
  "fab fa-stumbleupon-circle": "\uf1a3",
  "fab fa-superpowers": "\uf2dd",
  "fab fa-supple": "\uf3f9",
  "fab fa-telegram": "\uf2c6",
  "fab fa-telegram-plane": "\uf3fe",
  "fab fa-tencent-weibo": "\uf1d5",
  "fab fa-themeisle": "\uf2b2",
  "fab fa-trello": "\uf181",
  "fab fa-tripadvisor": "\uf262",
  "fab fa-tumblr": "\uf173",
  "fab fa-tumblr-square": "\uf174",
  "fab fa-twitch": "\uf1e8",
  "fab fa-twitter": "\uf099",
  "fab fa-twitter-square": "\uf081",
  "fab fa-typo3": "\uf42b",
  "fab fa-uber": "\uf402",
  "fab fa-uikit": "\uf403",
  "fab fa-uniregistry": "\uf404",
  "fab fa-untappd": "\uf405",
  "fab fa-usb": "\uf287",
  "fab fa-ussunnah": "\uf407",
  "fab fa-vaadin": "\uf408",
  "fab fa-viacoin": "\uf237",
  "fab fa-viadeo": "\uf2a9",
  "fab fa-viadeo-square": "\uf2aa",
  "fab fa-viber": "\uf409",
  "fab fa-vimeo": "\uf40a",
  "fab fa-vimeo-square": "\uf194",
  "fab fa-vimeo-v": "\uf27d",
  "fab fa-vine": "\uf1ca",
  "fab fa-vk": "\uf189",
  "fab fa-vnv": "\uf40b",
  "fab fa-vuejs": "\uf41f",
  "fab fa-weibo": "\uf18a",
  "fab fa-weixin": "\uf1d7",
  "fab fa-whatsapp": "\uf232",
  "fab fa-whatsapp-square": "\uf40c",
  "fab fa-whmcs": "\uf40d",
  "fab fa-wikipedia-w": "\uf266",
  "fab fa-windows": "\uf17a",
  "fab fa-wordpress": "\uf19a",
  "fab fa-wordpress-simple": "\uf411",
  "fab fa-wpbeginner": "\uf297",
  "fab fa-wpexplorer": "\uf2de",
  "fab fa-wpforms": "\uf298",
  "fab fa-xbox": "\uf412",
  "fab fa-xing": "\uf168",
  "fab fa-xing-square": "\uf169",
  "fab fa-y-combinator": "\uf23b",
  "fab fa-yahoo": "\uf19e",
  "fab fa-yandex": "\uf413",
  "fab fa-yandex-international": "\uf414",
  "fab fa-yelp": "\uf1e9",
  "fab fa-yoast": "\uf2b1",
  "fab fa-youtube": "\uf167",
  "fab fa-youtube-square": "\uf431"
};

var FontAwe$1 = FontAwe;

var Vis;

Vis = class Vis {
  static translate(x0, y0) {
    Util$1.checkTypes('number', {
      x0: x0,
      y0: y0
    });
    return ` translate( ${x0}, ${y0} )`;
  }

  static scale(sx, sy) {
    Util$1.checkTypes('number', {
      sx: sx,
      sy: sy
    });
    return ` scale( ${sx}, ${sy} )`;
  }

  static rotate(a, x, y) {
    Util$1.checkTypes('number', {
      a: a,
      x: x,
      y: y
    });
    return ` rotate(${a} ${x} ${y} )`;
  }

  static translateScale(x0, y0, sx, sy) {
    Util$1.checkTypes('number', {
      x0: x0,
      y0: y0
    });
    Util$1.checkTypes('number', {
      sx: sx,
      sy: sy
    });
    return ` translate( ${x0}, ${y0} ) scale( ${sx}, ${sy} )`;
  }

  static rad(deg) {
    return deg * Math.PI / 180;
  }

  static deg(rad) {
    return rad * 180 / Math.PI;
  }

  static sin(deg) {
    return Math.sin(Vis.rad(deg));
  }

  static cos(deg) {
    return Math.cos(Vis.rad(deg));
  }

  static rot(deg, ang) {
    var a;
    a = deg + ang;
    if (a < 0) {
      a = a + 360;
    }
    return a;
  }

  static toRadian(h, hueIsRygb = false) {
    var hue, radian;
    hue = hueIsRygb ? Vis.toHueRygb(h) : h;
    radian = 2 * Math.PI * (90 - hue) / 360; // Correction for MathBox polar coordinate system
    if (radian < 0) {
      radian = 2 * Math.PI + radian;
    }
    return radian;
  }

  static svgDeg(deg) {
    return 360 - deg;
  }

  static svgRad(rad) {
    return 2 * Math.PI - rad;
  }

  static radSvg(deg) {
    return Vis.rad(360 - deg);
  }

  static degSvg(rad) {
    return Vis.deg(2 * Math.PI - rad);
  }

  static sinSvg(deg) {
    return Math.sin(Vis.radSvg(deg));
  }

  static cosSvg(deg) {
    return Math.cos(Vis.radSvg(deg));
  }

  //hexCss:( hex ) -> """##{hex.toString(16)}""" # For orthogonality
  static rgbCss(rgb) {
    return `rgb(${rgb.r},${rgb.g},${rgb.b})`;
  }

  static hslCss(hsl) {
    return `hsl(${hsl.h},${hsl.s * 100}%,${hsl.l * 100}%)`;
  }

  static cssHex(str) {
    return parseInt(str.substr(1), 16);
  }

  static rndRgb(rgb) {
    return {
      r: Math.round(rgb.r),
      g: Math.round(rgb.g),
      b: Math.round(rgb.b)
    };
  }

  static hexRgb(hex) {
    return Vis.rndRgb({
      r: (hex & 0xFF0000) >> 16,
      g: (hex & 0x00FF00) >> 8,
      b: hex & 0x0000FF
    });
  }

  static rgbHex(rgb) {
    return rgb.r * 4096 + rgb.g * 256 + rgb.b;
  }

  static interpolateHexRgb(hex1, r1, hex2, r2) {
    return Vis.interpolateRgb(Vis.hexRgb(hex1), r1, Vis.hexRgb(hex2), r2);
  }

  static interpolateRgb(rgb1, r1, rgb2, r2) {
    return {
      r: rgb1.r * r1 + rgb2.r * r2,
      g: rgb1.g * r1 + rgb2.g * r2,
      b: rgb1.b * r1 + rgb2.b * r2
    };
  }

  static toRgbHsvStr(hsv) {
    var i, j, rgba, str;
    rgba = Vis.toRgbHsvSigmoidal(hsv[0], hsv[1], hsv[2] * 255, true);
    for (i = j = 0; j < 3; i = ++j) {
      rgba[i] = Math.round(rgba[i]);
    }
    str = `rgba(${rgba[0]},${rgba[1]},${rgba[2]},${rgba[3]})`;
    //console.log( "Vis.toRgbHsvStr()", {h:hsv[0],s:hsv[1],v:hsv[2]}, str )
    return str;
  }

  static toRgbaHsv(hsv) {
    var i, j, rgba, str;
    rgba = Vis.toRgbHsvSigmoidal(hsv[0], hsv[1], hsv[2] * 255, true);
    for (i = j = 0; j < 3; i = ++j) {
      rgba[i] = Math.round(rgba[i]);
    }
    str = `rgba(${rgba[0]},${rgba[1]},${rgba[2]},${rgba[3]})`;
    //console.log( "Vis.toRgbaHsv()", {h:hsv[0],s:hsv[1],v:hsv[2]}, str )
    return str;
  }

  static toRgbHsv(H, C, V, toRygb = true) {
    return Vis.toRgbHsvSigmoidal(H, C, V, toRygb);
  }

  static toRgbHsvSigmoidal(H, C, V, toRygb = true) {
    var b, c, d, f, g, h, i, r, v, x, y, z;
    h = toRygb ? Vis.toHueRgb(H) : H;
    d = C * 0.01;
    c = Vis.sigmoidal(d, 2, 0.25);
    v = V * 0.01;
    i = Math.floor(h / 60);
    f = h / 60 - i;
    x = 1 - c;
    y = 1 - f * c;
    z = 1 - (1 - f) * c;
    r = 1;
    g = 1;
    b = 1;
    [r, g, b] = (function() {
      switch (i % 6) {
        case 0:
          return [1, z, x, 1];
        case 1:
          return [y, 1, x, 1];
        case 2:
          return [x, 1, z, 1];
        case 3:
          return [x, y, 1, 1];
        case 4:
          return [z, x, 1, 1];
        case 5:
          return [1, x, y, 1];
      }
    })();
    return [r * v, g * v, b * v, 1];
  }

  static hsvToRgb(hsv) {
    var f, i, p, q, rgb, t, v;
    i = Math.floor(hsv.h / 60);
    f = hsv.h / 60 - i;
    p = hsv.v * (1 - hsv.s);
    q = hsv.v * (1 - f * hsv.s);
    t = hsv.v * (1 - (1 - f) * hsv.s);
    v = hsv.v;
    rgb = (function() {
      switch (i % 6) {
        case 0:
          return {
            r: v,
            g: t,
            b: p
          };
        case 1:
          return {
            r: q,
            g: v,
            b: p
          };
        case 2:
          return {
            r: p,
            g: v,
            b: t
          };
        case 3:
          return {
            r: p,
            g: q,
            b: v
          };
        case 4:
          return {
            r: t,
            g: p,
            b: v
          };
        case 5:
          return {
            r: v,
            g: p,
            b: q
          };
        default:
          console.error('Vis.hsvToRgb()');
          return {
            r: v,
            g: t,
            b: p // Should never happend
          };
      }
    })();
    return Vis.roundRgb(rgb, 255);
  }

  static roundRgb(rgb, f = 1.0) {
    return {
      r: Math.round(rgb.r * f),
      g: Math.round(rgb.g * f),
      b: Math.round(rgb.b * f)
    };
  }

  static sigmoidal(x, k, x0 = 0.5, L = 1) {
    return L / (1 + Math.exp(-k * (x - x0)));
  }

  // ransform RyGB to RGB hueT
  static toHueRgb(hue) {
    var hRgb;
    hRgb = 0;
    if (0 <= hue && hue < 90) {
      hRgb = hue * 60 / 90;
    } else if (90 <= hue && hue < 180) {
      hRgb = 60 + (hue - 90) * 60 / 90;
    } else if (180 <= hue && hue < 270) {
      hRgb = 120 + (hue - 180) * 120 / 90;
    } else if (270 <= hue && hue < 360) {
      hRgb = 240 + (hue - 270) * 120 / 90;
    }
    return hRgb;
  }

  static toRgba(study) {
    var hsv;
    hsv = study.hsv != null ? study.hsv : [90, 90, 90];
    return Vis.toRgbHsv(hsv[0], hsv[1], hsv[2]);
  }

  static toRgbSphere(hue, phi, rad) {
    return Vis.toRgbHsv(Vis.rot(hue, 90), 100 * Vis.sin(phi), 100 * rad);
  }

  // Key algorithm from HCI for converting RGB to HCS  h 360 c 100 s 100 a special color system
  static toHcsRgb(R, G, B, toRygb = true) {
    var H, a, b, c, g, h, r, s, sum;
    sum = R + G + B;
    r = R / sum;
    g = G / sum;
    b = B / sum;
    s = sum / 3;
    c = R === G && G === B ? 0 : 1 - 3 * Math.min(r, g, b); // Center Grayscale
    a = Vis.deg(Math.acos((r - 0.5 * (g + b)) / Math.sqrt((r - g) * (r - g) + (r - b) * (g - b))));
    h = b <= g ? a : 360 - a;
    if (c === 0) {
      h = 0;
    }
    H = toRygb ? Vis.toHueRgb(h) : h;
    return [H, c * 100, s / 2.55];
  }

  static sScale(hue, c, s) {
    var ch, m120, m60, s60, ss;
    ss = 1.0;
    m60 = hue % 60;
    m120 = hue % 120;
    s60 = m60 / 60;
    ch = c / 100;
    ss = m120 < 60 ? 3.0 - 1.5 * s60 : 1.5 + 1.5 * s60;
    return s * (1 - ch) + s * ch * ss;
  }

  static sScaleCf(hue, c, s) {
    var cf, cosd, cosu, m120, m60, ss;
    ss = Vis.sScale(hue, c, s);
    m60 = hue % 60;
    m120 = hue % 120;
    cosu = (1 - Vis.cos(m60)) * 100.00;
    cosd = (1 - Vis.cos(60 - m60)) * 100.00;
    cf = m120 < 60 ? cosu : cosd;
    return ss - cf;
  }

  static floor(x, dx) {
    var dr;
    dr = Math.round(dx);
    return Math.floor(x / dr) * dr;
  }

  static ceil(x, dx) {
    var dr;
    dr = Math.round(dx);
    return Math.ceil(x / dr) * dr;
  }

  static within(beg, deg, end) {
    return beg <= deg && deg <= end; // Closed interval with <=
  }

  static isZero(v) {
    return -0.01 < v && v < 0.01;
  }

  static unicode(icon) {
    var uc;
    uc = FontAwe$1.icons[icon];
    if (uc == null) {
      console.error('Vis.unicode() missing icon in Vis.FontAwesomeUnicodes for', icon);
      uc = "\uf111"; // Circle
    }
    return uc;
  }

};

var Vis$1 = Vis;

var MBox;

MBox = class MBox {
  constructor(elem) {
    var THREE;
    THREE = window['THREE'];
    this.mathbox = mathBox({
      element: elem,
      plugins: ['core', 'controls', 'cursor', 'stats'],
      controls: {
        klass: THREE.OrbitControls // TrackballControls  OrbitControls
      }
    });
    if (this.mathbox.fallback) {
      console.error('mathbox WebGL not supported');
    }
    this.three = this.mathbox.three;
    this.three.renderer.setClearColor(new THREE.Color(0x000000), 1.0);
    //@mathbox.set( { focus:3, scale: 720 } )
    Util$1.time = 0;
    this.setupTime();
  }

  setupTime() {
    this.three.on('update', function() {
      return Util$1.time = this.three.Time.clock;
    });
    Util$1.noop();
  }

  pv1v2(p, v1, v2) {
    var i, j, p1, p2, v3;
    p1 = p * 0.01;
    p2 = 1.0 - p1;
    v3 = [0, 0, 0];
    for (i = j = 0; j < 3; i = ++j) {
      v3[i] = v1[i] * p1 + v2[i] * p2;
    }
    return v3;
  }

  toRad(i, n) {
    var hue;
    hue = (i * 360 / n) % 360;
    return Vis$1.toRadian(hue);
  }

  toHue(i, n) {
    var h;
    h = (i * 360 / n) % 360;
    return Util$1.toInt(h);
  }

  sin9(x, y) {
    return 0.5 + 0.25 * Math.sin(12 * x + Util$1.time * 0.3) + 0.25 * Math.sin(12 * y + Util$1.time * 0.3);
  }

  sin12(x, y) {
    return 0.5 + 0.50 * Math.sin(12 * x + Util$1.time * 0.3) + 0.50 * Math.sin(12 * y + Util$1.time * 0.3);
  }

  sinNorm(x, y) {
    return Math.sin(12 * x + Util$1.time * 0.3) + Math.sin(12 * y + Util$1.time * 0.3);
  }

  sin9Pq(a, r) {
    return 0.5 + 0.25 * Math.sin(12 * (r + a) + Util$1.time * 1.2 + π / 12) + 0.25 * Math.cos(12 * a);
  }

  sin9P(a, r) {
    return 0.5 * Math.sin(12 * (a + r) + Util$1.time * 1.2 + π / 12) + 0.5 * Math.cos(12 * a);
  }

  sin9R(a, r) {
    return 0.5 + 0.25 * Math.sin(12 * r * a + Util$1.time * 1.2) + 0.25 * Math.sin(6 * a);
  }

  sin9P(a, r) {
    return 0.5 + 0.25 * Math.sin(12 * r + Util$1.time * 0.3 + π / 12) + 0.25 * Math.sin(12 * a + π / 12);
  }

  sin9PJan(a, r) {
    return 0.5 * Math.sin(12 * (a + r) + Util$1.time * 1.2 + π / 12) + 0.50 * Math.cos(12 * a);
  }

  sin9QJan(a, r) {
    return 0.5 + 0.25 * Math.sin(12 * r + Util$1.time * 0.3 + π / 12) + 0.25 * Math.sin(12 * a + π / 12);
  }

  sin12P(a, r) {
    return 0.5 * Math.sin(12 * (r + a) + Util$1.time * 1.2) + 0.5 * Math.cos(12 * a);
  }

  sin12R(a, r) {
    return .5 + 0.25 * Math.sin(r + a) + 0.25 * Math.cos(r + a * Util$1.time * 0.5);
  }

  sin12PMar(a, r) {
    return .5 + .5 * Math.sin(12 * (r + a) + Util$1.time) * Math.sin(9 * a + Util$1.time);
  }

  sin12CMar(a, r) {
    return .5 + .5 * Math.sin(12 * (r + a) + Util$1.time) * Math.sin(9 * a + Util$1.time) * Math.cos(r);
  }

  sin09PMar(a, r) {
    return .5 + .5 * Math.sin(9 * (r + a) + Util$1.time) * Math.sin(9 * a + Util$1.time);
  }

  sin01Oct(a, r) {
    return .5 + .5 * Math.sin(a + Util$1.time) * Math.sin(r + Util$1.time);
  }

  sin09Oct(a, r) {
    return .5 + .5 * Math.sin(9 * a + Util$1.time) * Math.sin(9 * r + Util$1.time);
  }

  sin12Oct(a, r) {
    return .5 + .5 * Math.sin(12 * a + Util$1.time) * Math.sin(12 * r + Util$1.time);
  }

  cos01Oct(a, r) {
    return .5 + .5 * Math.cos(a + Util$1.time) * Math.cos(r + Util$1.time);
  }

  sin12AMay(a) {
    return .5 + .50 * Math.cos(12 * a + Util$1.time);
  }

  sin12RMay(a, r) {
    return .5 + .50 * Math.cos(12 * r + Util$1.time);
  }

  sin12MMay(a, r) {
    return .5 + .50 * Math.cos(12 * a + Util$1.time) * Math.cos(12 * r + Util$1.time);
  }

  sin12PMay(a, r) {
    return .5 + .25 * Math.cos(12 * a + Util$1.time) + .25 * Math.cos(12 * r + Util$1.time);
  }

  sin12QMay(a, r) {
    return .5 + .25 * Math.cos(12 * a + Util$1.time) + .25 * Math.cos(12 * r + Util$1.time);
  }

  sin12QJan(a, r) {
    return .50 + .50 * Math.sin(12 * (r + a) + Util$1.time * 1.2);
  }

  sin12AJan(a) {
    return .50 + .50 * Math.sin(12 * a + Util$1.time * 1.2);
  }

  sin06AJan(a) {
    return .50 + .50 * Math.sin(3 * a + Util$1.time * 1.2); // Keep
  }

  sin06B(a) {
    return .55 + .45 * Math.sin(3 * a + Util$1.time);
  }

  sin06C(a) {
    return .60 + .40 * Math.sin(3 * a + Util$1.time);
  }

  sin03D(a, r) {
    return .60 + .40 * Math.sin(3 * a + Util$1.time) * Math.sin(r * 0.11 + Util$1.time);
  }

  sin06D(a, r) {
    return .60 + .40 * Math.sin(6 * a + Util$1.time) * Math.sin(r * 0.11 + Util$1.time);
  }

  sin06E(a, r) {
    return .60 + .40 * Math.sin(6 * a + Util$1.time) * Math.sin(r / 12 + Util$1.time);
  }

  sin06F(a, r) {
    return .60 + .40 * Math.sin(6 * a + Util$1.time) * Math.sin(r / 8 + Util$1.time);
  }

  sigmoidal(x, k, x0 = 0.5) {
    return 1 / (1 + Math.exp(-k * (x - x0)));
  }

  depth() {
    return Math.abs(Math.cos(Util$1.time * 0.5));
  }

  toDep(a, r) {
    return Math.abs(Math.cos(6 * (r + a) + Util$1.time * 0.5));
  }

};

var MBox$1 = MBox;

var Coord;

Coord = class Coord {
  constructor(mbox, width1, height, depth = 10) {
    this.cylLookup = this.cylLookup.bind(this);
    this.mbox = mbox;
    this.width = width1;
    this.height = height;
    this.depth = depth;
    this.mathbox = this.mbox.mathbox;
    this.npoints = 24 * this.width;
  }

  // [[-100,100],[0,100],[-100,100]]
  cartesian(range = [[0, 1], [0, 1], [0, 1]], scale = [2, 1, 2], divide = [10, 10]) {
    var view;
    this.mathbox.camera({
      position: [2.4, 2.4, 2.4],
      proxy: true
    });
    view = this.mathbox.cartesian({
      range: range,
      scale: scale
    });
    this.axesXYZ(view, 8, 0xFFFFFF);
    this.gridXYZ(view, 4, 0xFFFFFF, divide[0], 0.7, '10');
    this.tickXYZ(view, 64, 0xFFFFFF, divide[1], 2);
    return view;
  }

  polar(range = [[0, 2 * π], [0, 100], [0, 100]], scale = [2, 1.5, 0.75]) {
    var view;
    this.mathbox.camera({
      position: [0, 0, 4],
      proxy: true // 2*π
    });
    view = this.mathbox.polar({
      range: range,
      scale: scale
    });
    //@tick(  view, 64, 0xFFFFFF, 12, 3, 1 )
    view.transform({
      position: [0, 100, 0]
    }).grid({
      unitX: π / 12,
      baseX: 2,
      zWrite: false,
      detailX: 81,
      divideX: 12,
      divideY: 10,
      axes: 'xz',
      blending: 'add',
      color: 0x00F0B0,
      width: this.width,
      opacity: 1
    });
    this.radPolar(view);
    return view;
  }

  sphere(range = [[0, 2 * π], [0, 2 * π], [0, 1]], scale = [1, 1, 1]) {
    var view;
    this.mathbox.camera({
      position: [0, 0, 4],
      proxy: true // 2*π
    });
    view = this.mathbox.spherical({
      range: range,
      scale: scale
    });
    return view;
  }

  axesXYZ(view, width, color) {
    return view.axis({
      axis: 1,
      width: width,
      color: color,
      end: false
    }).axis({
      axis: 2,
      width: width,
      color: color,
      end: false
    }).axis({
      axis: 3,
      width: width,
      color: color,
      end: false
    });
  }

  gridXYZ(view, width, color, divide, opacity, id) {
    return view.grid({
      axes: [1, 2],
      width: width,
      color: color,
      divideX: divide,
      divideY: divide,
      opacity: opacity,
      id: `gridXY${id}`
    }).grid({
      axes: [2, 3],
      width: width,
      color: color,
      divideX: divide,
      divideY: divide,
      opacity: opacity,
      id: `gridYZ${id}`
    }).grid({
      axes: [3, 1],
      width: width,
      color: color,
      divideX: divide,
      divideY: divide,
      opacity: opacity,
      id: `gridZX${id}`
    });
  }

  tickXYZ(view, size, color, divide, digits) {
    this.tick(view, size, color, divide, digits, 1);
    this.tick(view, size, color, divide, digits, 2);
    return this.tick(view, size, color, divide, digits, 3);
  }

  tick(view, size, color, divide, digits, axis) {
    var offset;
    offset = axis === 2 ? [0, 0.06] : [0.0];
    return view.scale({
      axis: axis,
      divide: divide
    }).ticks({
      zBias: axis,
      width: 5,
      size: size * 0.25,
      color: color
    }).format({
      digits: digits,
      font: "Arial"
    }).label({
      size: size,
      depth: 1,
      color: color,
      outline: 1,
      offset: offset
    });
  }

  radPolar(view) {
    var points;
    points = view.area(this.angPolar());
    return view.vector({
      points: points,
      color: 'white',
      width: 10
    });
  }

  angPolar() {
    var obj;
    obj = {
      id: "angPolar",
      axes: [1, 2],
      width: 13,
      height: 1,
      items: 2,
      channels: 3
    };
    obj.expr = (emit, a, r) => {
      Util$1.noop(r);
      emit(0, 0, 1);
      emit(a, 1, 1);
    };
    return obj;
  }

  cartData(range = [[0, 1], [0, 1], [0, 1]]) {
    var array, dx, dy, dz, k, l, m, ref, ref1, ref2, ref3, ref4, ref5, ref6, ref7, ref8, x, y, z;
    array = [];
    dx = (range[0][1] - range[0][0]) / (this.width - 1);
    dy = (range[1][1] - range[1][0]) / (this.height - 1);
    dz = (range[2][1] - range[2][0]) / (this.depth - 1);
    for (x = k = ref = range[0][0], ref1 = range[0][1], ref2 = dx; ref2 !== 0 && (ref2 > 0 ? k <= ref1 : k >= ref1); x = k += ref2) {
      for (y = l = ref3 = range[1][0], ref4 = range[1][1], ref5 = dy; ref5 !== 0 && (ref5 > 0 ? l <= ref4 : l >= ref4); y = l += ref5) {
        for (z = m = ref6 = range[2][0], ref7 = range[2][1], ref8 = dz; ref8 !== 0 && (ref8 > 0 ? m <= ref7 : m >= ref7); z = m += ref8) {
          array.push([x, y, z, 1]);
        }
      }
    }
    return {
      data: array,
      items: 1,
      channels: 4,
      live: false,
      id: 'cartData',
      width: this.width * this.height * this.depth
    };
  }

  cartPoints(id = "cartPoints") {
    var obj;
    obj = {
      id: id,
      width: this.width,
      height: this.height,
      depth: this.depth,
      items: 1,
      channels: 4
    };
    obj.expr = (emit, x, y, z) => {
      return emit(x, y, z, 1);
    };
    return obj;
  }

  cartColors(toRgb, id = "cartColors") {
    var obj;
    obj = {
      id: id,
      width: this.width,
      height: this.height,
      depth: this.depth,
      channels: 4 
    };
    obj.expr = (emit, x, y, z) => {
      var b, g, r;
      [r, g, b] = toRgb(x, y, z);
      return emit(r, g, b, 1);
    };
    return obj;
  }

  point(size = 40, pid = "points", cid = "colors") {
    return {
      points: '#' + pid,
      colors: '#' + cid,
      color: 0xffffff,
      size: size
    };
  }

  cartVolume(view, toRgb) {
    view.volume(this.cartPoints());
    view.volume(this.cartColors(toRgb));
    return view.point(this.point(40, "cartPoints", "cartColors"));
  }

  cartArray(view) {
    view.array(this.cartData());
    return view.point(this.point(40, "cartData", "cartData"));
  }

  cartSurfPoints(toZ, id = "cartSurfPoints") {
    var obj;
    obj = {
      id: id,
      width: this.width,
      height: this.height,
      axes: [1, 3],
      channels: 3
    };
    obj.expr = (emit, x, y) => {
      return emit(x, toZ(x, y), y);
    };
    return obj;
  }

  cartSurfColors(toRgb, id = "cartSurfColors") {
    var obj;
    obj = {
      id: id,
      width: this.width,
      height: this.height,
      channels: 4,
      axes: [
        1,
        2 
      ]
    };
    obj.expr = (emit, x, y) => {
      var b, g, r;
      [r, g, b] = toRgb(x, y);
      return emit(r, g, b, 1);
    };
    return obj;
  }

  cartSurface(view, toDep, toRgb) {
    var colors, points;
    points = view.area(this.cartSurfPoints(toDep));
    colors = view.area(this.cartSurfColors(toRgb));
    return view.surface({
      points: points,
      colors: colors,
      color: 0xffffff,
      shaded: false,
      opacity: 1.0,
      lineX: true,
      lineY: true,
      width: 5
    });
  }

  cylData(range = [[0, 2 * π], [0, 100], [0, 100]]) {
    var array, c, dx, dy, dz, h, k, l, m, ref, ref1, ref2, ref3, ref4, ref5, ref6, ref7, ref8, s;
    array = [];
    dx = (range[0][1] - range[0][0]) / this.width;
    dy = (range[1][1] - range[1][0]) / this.height;
    dz = (range[2][1] - range[2][0]) / this.depth;
    for (h = k = ref = range[0][0], ref1 = range[0][1], ref2 = dx; ref2 !== 0 && (ref2 > 0 ? k <= ref1 : k >= ref1); h = k += ref2) {
      for (c = l = ref3 = range[1][0], ref4 = range[1][1], ref5 = dy; ref5 !== 0 && (ref5 > 0 ? l <= ref4 : l >= ref4); c = l += ref5) {
        for (s = m = ref6 = range[2][0], ref7 = range[2][1], ref8 = dz; ref8 !== 0 && (ref8 > 0 ? m <= ref7 : m >= ref7); s = m += ref8) {
          array.push([h, c, s]);
        }
      }
    }
    return {
      data: array,
      items: 1,
      channels: 4,
      live: false,
      id: 'hcss',
      width: this.width * this.height * this.depth
    };
  }

  // Cylindrical ang, rad, dep
  cylPoints(id = "cylPoints") {
    var obj;
    obj = {
      id: id,
      width: this.width,
      height: this.height,
      depth: this.depth,
      items: 1,
      channels: 4
    };
    obj.expr = (emit, ang, rad, dep, i) => {
      var radian;
      radian = this.mbox.toRad(i, this.width);
      return emit(radian, rad, dep, 1);
    };
    return obj;
  }

  // Cylindrical ang, rad, dep  
  cylColors(toRgb, id = "cylColors") {
    var obj;
    obj = {
      id: id,
      width: this.width,
      height: this.height,
      depth: this.depth,
      channels: 4 
    };
    obj.expr = (emit, ang, rad, dep, i) => {
      var b, g, hue, r;
      hue = this.mbox.toHue(i, this.width);
      [r, g, b] = toRgb(hue, rad, dep); // HCS
      return emit(r, g, b, 1);
    };
    return obj;
  }

  cylVolume(view, toRgb) {
    view.volume(this.cylPoints());
    view.volume(this.cylColors(toRgb));
    return view.point(this.point(40, "cylPoints", "cylColors"));
  }

  cylLookup(view, hcss, rgbs) {
    view.array({
      data: hcss,
      id: "hcss",
      items: 1,
      channels: 4,
      live: false,
      width: hcss.length
    });
    view.array({
      data: rgbs,
      id: "rgbs",
      items: 1,
      channels: 4,
      live: false,
      width: rgbs.length
    });
    return view.point({
      points: '#' + "hcss",
      colors: '#' + "rgbs",
      color: 0xffffff,
      size: 40
    });
  }

  cylSurfPoints(toDep, id = "cylSurfPoints") {
    var obj;
    obj = {
      id: id,
      width: this.npoints + 1,
      height: this.height,
      axes: [1, 2],
      channels: 3 // Need @npoints+1 to complete rotation
    };
    obj.expr = (emit, ang, rad, i) => {
      var radian;
      radian = this.mbox.toRad(i, this.npoints);
      return emit(radian, rad, 100 * toDep(radian, rad));
    };
    return obj;
  }

  cylSurfColors(toDep, toRgb, id = "cylSurfColors") {
    var obj;
    obj = {
      id: id,
      width: this.npoints + 1,
      height: this.height,
      channels: 4,
      axes: [
        1,
        2 // Need @npoints+1 to complete rotation
      ]
    };
    obj.expr = (emit, ang, rad, i) => {
      var b, g, hue, r, radian;
      hue = this.mbox.toHue(i, this.npoints);
      radian = this.mbox.toRad(i, this.npoints);
      [r, g, b] = toRgb(hue, rad, toDep(radian, rad) * 100);
      return emit(r, g, b, 1);
    };
    return obj;
  }

  cylSurface(view, toRgb, toDep) {
    var colors, points;
    points = view.area(this.cylSurfPoints(toDep));
    colors = view.area(this.cylSurfColors(toDep, toRgb));
    return view.surface({
      points: points,
      colors: colors,
      color: 0xffffff,
      shaded: false,
      opacity: 1.0,
      lineX: true,
      lineY: true,
      width: 5
    });
  }

  // Spherical Points
  sphPoints(id = "sphPoints") {
    var obj;
    obj = {
      id: id,
      width: this.width,
      height: this.height,
      depth: this.depth,
      items: 1,
      channels: 4
    };
    obj.expr = (emit, ang1, ang2, rad, i, j) => {
      return emit(i * π * 2 / this.width, j * π * 2 / this.height, rad, 1); //if j*π*2/@height <= π
    };
    return obj;
  }

  sphColors(toRgb, id = "sphColors") {
    var obj;
    obj = {
      id: id,
      width: this.width,
      height: this.height,
      depth: this.depth,
      channels: 4 
    };
    obj.expr = (emit, ang1, ang2, rad, i, j) => {
      var b, g, r;
      [r, g, b] = toRgb(i * 360 / this.width, j * 360 / this.height, rad);
      return emit(r, g, b, 1);
    };
    return obj;
  }

  sphVolume(view, toRgb) {
    view.volume(this.sphPoints());
    view.volume(this.sphColors(toRgb));
    return view.point(this.point(40, "sphPoints", "sphColors"));
  }

  domeColors() {
    var obj;
    obj = {
      id: 'domeColors',
      width: this.width,
      height: this.height,
      depth: this.depth,
      channels: 4 
    };
    obj.expr = (emit, ang1, ang2, rad, i, j) => {
      var b, g, r;
      if (j * 360 / this.height <= 180) {
        [r, g, b] = Vis$1.toRgbHsv(i * 360 / this.width, j * 360 / this.height, rad);
        return emit(r, g, b, 1);
      } else {
        return emit(0, 0, 0, 0);
      }
    };
    return obj;
  }

};

var Coord$1 = Coord;

var Color;

Color = class Color {
  constructor(mbox) {
    this.toRygbFromHue = this.toRygbFromHue.bind(this);
    this.toRgbFromHue = this.toRgbFromHue.bind(this);
    this.genWithVecs = this.genWithVecs.bind(this);
    this.genWithVecsRgb = this.genWithVecsRgb.bind(this);
    this.genPolarRgbs = this.genPolarRgbs.bind(this);
    //genPolarSurf(   view, hcss, rgbs )
    this.genPolarSurf = this.genPolarSurf.bind(this);
    this.mbox = mbox;
    this.spaces = ['hci', 'rgb', 'hsi', 'hsl', 'hsv', 'lab', 'lch', 'hcl', 'cmyk', 'gl'];
  }

  addARgb(a, r, g, b) {
    return [r + a, g + a, b + a];
  }

  mulSRgb(s, r, g, b) {
    return [r * s, g * s, b * s];
  }

  addARygb(a, r, y, g, b) {
    return [r + a, y + a, g + a, b + a];
  }

  mulSRygb(s, r, y, g, b) {
    return [r * s, y * s, g * s, b * s];
  }

  addRygbs(rygb1, rygb2) {
    var i, j, rygb3;
    rygb3 = [0, 0, 0, 0];
    for (i = j = 0; j < 4; i = ++j) {
      rygb3[i] = rygb1[i] + rygb2[i];
    }
    return rygb3;
  }

  toRygbFromHue(hue) {
    var b, cos, g, r, rygb, sin, y;
    cos = Math.abs(Vis$1.cos(hue));
    sin = Math.abs(Vis$1.sin(hue));
    [r, y, g, b] = [cos, sin, cos, sin];
    rygb = [0, 0, 0, 0];
    if (0 <= hue && hue < 90) {
      rygb = [r, y, 0, 0];
    } else if (90 <= hue && hue < 180) {
      rygb = [0, y, g, 0];
    } else if (180 <= hue && hue < 270) {
      rygb = [0, 0, g, b];
    } else if (270 <= hue && hue < 360) {
      rygb = [r, 0, 0, b];
    }
    return rygb;
  }

  toRgbFromHue(hue) {
    var B, G, R, cos, rgb;
    cos = function(h) {
      return Math.abs(Vis$1.cos(h * 90 / 120));
    };
    R = 0;
    G = 0;
    B = 0;
    [R, G, B] = [cos(hue), cos(hue - 120), cos(hue - 240), 1];
    rgb = [0, 0, 0];
    if (0 <= hue && hue < 120) {
      rgb = [R, G, 0];
    } else if (120 <= hue && hue < 240) {
      rgb = [0, G, B];
    } else if (240 <= hue && hue < 360) {
      rgb = [R, 0, B];
    }
    return rgb;
  }

  genWithVecs(coord, view) {
    var hcss, rgbs;
    hcss = 0;
    rgbs = 0;
    [hcss, rgbs] = this.genVecs();
    return coord.cylLookup(view, hcss, rgbs);
  }

  genWithVecsRgb(coord, view, see) {
    var hcss, rgbs;
    hcss = 0;
    rgbs = 0;
    [hcss, rgbs] = this.genVecsRgb(see);
    return coord.cylLookup(view, hcss, rgbs);
  }

  genPolarRgbs(coord, view, scale) {
    var hcss, rgbs;
    hcss = 0;
    rgbs = 0;
    [hcss, rgbs] = this.genPolarRgb(scale);
    console.log('genPolarRgbs', hcss.length, rgbs.length);
    return coord.cylLookup(view, hcss, rgbs);
  }

  genPolarSurf(view, hcss, rgbs) {
    var colors, i, j, k, len, points, pts, ref, ref1, results, rgs, s, sh;
    ref = [90];
    //[0,10,20,30,40,50,60,70,80,90]
    results = [];
    for (j = 0, len = ref.length; j < len; j++) {
      s = ref[j];
      //view.play( { delay:1, speed:1000 } )
      points = [];
      colors = [];
      for (i = k = 0, ref1 = hcss.length; (0 <= ref1 ? k < ref1 : k > ref1); i = 0 <= ref1 ? ++k : --k) {
        sh = hcss[i][2];
        if (s <= sh && sh < s + 10) {
          points.push(hcss[i]);
          colors.push(rgbs[i]);
        }
      }
      pts = view.area({
        data: points,
        width: points.length,
        height: 1,
        axes: [1, 2],
        channels: 3
      });
      rgs = view.area({
        data: colors,
        width: colors.length,
        height: 1,
        axes: [1, 2],
        channels: 3
      });
      results.push(view.surface({
        points: pts,
        colors: rgs,
        color: 0xffffff,
        shaded: false,
        opacity: 1.0,
        lineX: true,
        lineY: true,
        width: 5
      }));
    }
    return results;
  }

  toHue(C1, N) { // ,C2
    var hue, n;
    n = 100 - N;
    hue = n;
    if (C1 === 'Y') {
      hue = n;
    } else if (C1 === 'G') {
      hue = n + 100;
    } else if (C1 === 'B') {
      hue = n + 200;
    } else if (C1 === 'R') {
      hue = n + 300;
    } else if (C1 === ' ') {
      hue = 0;
    }
    hue = hue * 0.9;
    if (hue === 360) {
      hue = 0;
    }
    return hue;
  }

  scsPts(colors) {
    var color, key, pts;
    pts = [];
    for (key in colors) {
      color = colors[key];
      pts.push([Vis$1.toRadian(color.hue - 2), color.c, 100 - color.s, 1]);
      pts.push([Vis$1.toRadian(color.hue + 2), color.c, 100 - color.s, 1]);
    }
    return pts;
  }

  scsRgbs(colors) {
    var color, key, rgbs, s;
    rgbs = [];
    s = 1 / 255;
    for (key in colors) {
      color = colors[key];
      rgbs.push([color.r * s, color.g * s, color.b * s, 1]);
      rgbs.push([color.R * s, color.G * s, color.B * s, 1]);
    }
    return rgbs;
  }

  genVecsCompare() {
    var c, hcss, hue, j, k, l, len, len1, ref, ref1, rgbs, s;
    hcss = [];
    rgbs = [];
    for (hue = j = 0; j < 360; hue = j += 15) {
      ref = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
      for (k = 0, len = ref.length; k < len; k++) {
        c = ref[k];
        ref1 = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
        for (l = 0, len1 = ref1.length; l < len1; l++) {
          s = ref1[l];
          hcss.push([Vis$1.toRadian(hue - 3), c, s, 1]);
          hcss.push([Vis$1.toRadian(hue), c, s, 1]);
          hcss.push([Vis$1.toRadian(hue + 3), c, s, 1]);
          rgbs.push(Vis$1.toRgbHcs(hue, c, s, true));
          rgbs.push(Vis$1.toRgbHcs2(hue, c, s, true));
          rgbs.push(Vis$1.toRgbHsv(hue, c, s, true));
        }
      }
    }
    return [hcss, rgbs];
  }

  genVecs() {
    var c, hcss, hue, j, k, l, len, len1, ref, ref1, rgbs, s;
    hcss = [];
    rgbs = [];
    for (hue = j = 0; j < 360; hue = j += 15) {
      ref = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
      for (k = 0, len = ref.length; k < len; k++) {
        c = ref[k];
        ref1 = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
        for (l = 0, len1 = ref1.length; l < len1; l++) {
          s = ref1[l];
          hcss.push([Vis$1.toRadian(hue), c, s, 1]);
          rgbs.push(Vis$1.toRgbHsv(hue, c, s, true));
        }
      }
    }
    return [hcss, rgbs];
  }

  genVecsRgb(see) {
    var b, c, g, h, hcss, hue, j, k, l, len, len1, m, o, p, r, ref, ref1, rgbs, s, sf, ss;
    hcss = [];
    rgbs = [];
    sf = 1 / 255;
    if (see === 'two' || see === 'rgb') {
      for (r = j = 0; j <= 255; r = j += 15) {
        for (g = k = 0; k <= 255; g = k += 15) {
          for (b = l = 0; l <= 255; b = l += 15) {
            [h, c, s] = Vis$1.toHcvRgb(r, g, b);
            if (h % 15 <= 2 || h % 15 >= 13) {
              ss = Vis$1.sScale(h, c, s);
              hcss.push([Vis$1.toRadian(h - 2, false), c, ss, 1]);
              rgbs.push([r * sf, g * sf, b * sf, 1]);
            }
          }
        }
      }
    }
    if (see === 'two' || see === 'hsv') {
      for (hue = m = 0; m < 360; hue = m += 15) {
        ref = [0, 16, 32, 48, 64, 80, 100];
        for (o = 0, len = ref.length; o < len; o++) {
          c = ref[o];
          ref1 = [0, 16, 32, 48, 64, 80, 100];
          for (p = 0, len1 = ref1.length; p < len1; p++) {
            s = ref1[p];
            hcss.push([Vis$1.toRadian(hue + 2), c, s, 1]);
            rgbs.push(Vis$1.toRgbHsvSigmoidal(hue, c, s, false));
          }
        }
      }
    }
    return [hcss, rgbs];
  }

  // console.log( 'gpr', { r:r, g:g, b:b, hue:hue, c:Math.round(c), s:Math.round(s) } ) if c is 0
  // hRygb = h # @hueRygb( hue )
  genPolarRgb(scale = false) {
    var b, c, g, h, hcss, j, k, l, r, rgbs, s, sf, ss;
    hcss = [];
    rgbs = [];
    sf = 1 / 255;
    for (r = j = 0; j <= 255; r = j += 15) {
      for (g = k = 0; k <= 255; g = k += 15) {
        for (b = l = 0; l <= 255; b = l += 15) {
          h = 0;
          c = 0;
          s = 0;
          [h, c, s] = Vis$1.toHcsRgb(r, g, b); // Hcs is a special color system
          ss = scale ? Vis$1.sScale(h, c, s) : s;
          hcss.push([Vis$1.toRadian(h, false), c, ss, 1]);
          rgbs.push([r * sf, g * sf, b * sf, 1]);
        }
      }
    }
    return [hcss, rgbs];
  }

  // Hue in RYGB
  vecs(hue) {
    var c, s, v1, v2, y;
    v1 = [1, 1, 1];
    v2 = [1, 1, 1];
    c = Math.abs(Vis$1.cos(hue));
    s = Math.abs(Vis$1.sin(hue));
    y = Math.max(c, s);
    if (0 <= hue && hue < 90) {
      v2 = [y, s, 0];
    } else if (90 <= hue && hue < 180) {
      v2 = [c, y, 0];
    } else if (180 <= hue && hue < 270) {
      v2 = [0, c, s];
    } else if (270 <= hue && hue < 360) {
      v2 = [c, 0, s];
    }
    return [v1, v2];
  }

  csvec(c, s, v1, v2) {
    var c1, c2, i, j, v3;
    c1 = 0.0001 * s * (100 - c);
    c2 = 0.0001 * s * c;
    v3 = [0, 0, 0, 1];
    for (i = j = 0; j < 3; i = ++j) {
      v3[i] = v1[i] * c1 + v2[i] * c2;
    }
    return v3;
  }

  rgbPc(r, g, b, R, G, B) {
    var bd, gd, pc, rd;
    pc = function(f) {
      return Util$1.toInt(f * 100);
    };
    rd = r !== 0 ? r : -R;
    gd = g !== 0 ? g : -G;
    bd = b !== 0 ? b : -B;
    return [pc(R / rd), pc(G / gd), pc(B / bd)];
  }

};

var Color$1 = Color;

var Regress;

Regress = class Regress {
  constructor(mbox) {
    this.mbox = mbox;
    this.width = 100;
    this.height = 100;
    this.mathbox = this.mbox.mathbox;
    this.coord = new Coord$1(this.mbox, this.width, this.height);
  }

  viewLinearRegress() {
    var points, slope, yInter;
    this.x = this.toArray(this.data02(), 0);
    this.y = this.toArray(this.data02(), 1);
    this.n = Math.min(this.x.length, this.y.length);
    [slope, yInter] = this.slopeYInter(this.n, this.x, this.y);
    Util$1.alert({
      slope: slope,
      yInter: yInter
    });
    this.view = this.coord.cartesian([[0, 4], [0, 500], [0, 4]]);
    points = this.view.area(this.areaRegress(this.n, this.x, this.y));
    return this.view.surface({
      points: points,
      color: 0x5090FF,
      shaded: true,
      opacity: 1.0,
      lineX: true,
      lineY: true,
      width: 2
    });
  }

  areaRegress(n, x, y) {
    var obj;
    obj = {
      id: 'areaRegress',
      width: this.width,
      height: this.height,
      axes: [1, 3],
      channels: 3
    };
    obj.expr = (emit, slope, yInter, i, j) => {
      Util$1.noop(i, j);
      return emit(slope, this.rss(n, x, y, slope, yInter), yInter);
    };
    return obj;
  }

  rss(n, x, y, slope, yInter) {
    var i, k, ref, sum, term;
    sum = 0.0;
    for (i = k = 0, ref = n; (0 <= ref ? k < ref : k > ref); i = 0 <= ref ? ++k : --k) {
      term = y[i] - yInter - slope * x[i];
      sum = sum + term * term;
    }
    //console.log( Util.toFixed(sum,1), Util.toFixed(slope,1), Util.toFixed(yInter,1) )
    return sum;
  }

  data01() {
    return [[0, 2], [1, 4], [2, 3], [3, 5], [4, 8], [5, 9], [6, 10], [7, 11]];
  }

  data02() {
    return [[0.0, 2.1], [1.0, 3.9], [2, 5.2], [3, 7.9], [4.0, 10.3], [5, 11.7], [6, 14.1], [7, 15.9]];
  }

  toArray(data, index) {
    var d, k, len, x;
    x = [];
    for (k = 0, len = data.length; k < len; k++) {
      d = data[k];
      x.push(d[index]);
    }
    return x;
  }

  slopeYInter(n, x, y) {
    var denom, numer, slope, xmean, yInter, ymean;
    xmean = this.mean(n, x);
    ymean = this.mean(n, y);
    numer = this.sumProducts(n, x, y, xmean, ymean);
    denom = this.sumSquares(n, x, xmean);
    slope = numer / denom;
    yInter = ymean - slope * xmean;
    return [slope, yInter];
  }

  sumProducts(n, x, y, xmean, ymean) {
    var i, k, ref, sum;
    sum = 0.0;
    for (i = k = 0, ref = n; (0 <= ref ? k < ref : k > ref); i = 0 <= ref ? ++k : --k) {
      sum = sum + (x[i] - xmean) * (y[i] - ymean);
    }
    return sum;
  }

  sumSquares(n, x, xmean) {
    var i, k, ref, sum;
    sum = 0.0;
    for (i = k = 0, ref = n; (0 <= ref ? k < ref : k > ref); i = 0 <= ref ? ++k : --k) {
      sum = sum + (x[i] - xmean) * (x[i] - xmean);
    }
    return sum;
  }

  mean(n, x) {
    var i, k, ref, sum;
    sum = 0;
    for (i = k = 0, ref = n; (0 <= ref ? k < ref : k > ref); i = 0 <= ref ? ++k : --k) {
      sum = sum + x[i];
    }
    return sum / n;
  }

};

var MRegress = Regress;

var Box;

Box = class Box {
  static init() {
    return Util$1.ready(function() {
      var elem;
      elem = document.querySelector('#App');
      Box.doApp('Color', elem);
    });
  }

  static doApp(name, elem) {
    switch (name) {
      case 'Color':
        Box.doColor(elem);
        break;
      case 'Rgbs':
        Box.doRgbs(elem);
        break;
      case 'Polar':
        Box.doPolar(elem);
        break;
      case 'Vecs':
        Box.doVecs(elem, 'hsv');
        break;
      case 'Sphere':
        Box.doSphere(elem);
        break;
      case 'Regress':
        Box.doRegress(elem);
        break;
      case 'Color':
        Box.doColor(elem);
    }
  }

  static doRgbs(elem) {
    var coord, mbox, view;
    mbox = new MBox$1(elem);
    coord = new Coord$1(mbox, 11, 11, 11);
    view = coord.cartesian();
    return coord.cartArray(view);
  }

  static doColor(elem) {
    var coord, mbox, view;
    mbox = new MBox$1(elem);
    coord = new Coord$1(mbox, 8, 20, 20);
    view = coord.polar();
    coord.cylVolume(view, Vis$1.toRgbHsv);
    return coord.cylSurface(view, Vis$1.toRgbHsv, mbox.sin06F);
  }

  static doRegress(elem) {
    var mbox, regress;
    mbox = new MBox$1(elem);
    regress = new MRegress(mbox);
    return regress.viewLinearRegress();
  }

  static doSphere(elem) {
    var coord, mbox, view;
    mbox = new MBox$1(elem);
    coord = new Coord$1(mbox, 12, 60, 10);
    view = coord.sphere();
    return coord.sphVolume(view, Vis$1.toRgbSphere);
  }

  static doHcs(elem) {
    var color, coord, mbox, view;
    mbox = new MBox$1(elem);
    coord = new Coord$1(mbox, 12, 10, 10);
    color = new Color$1(mbox);
    view = coord.polar();
    color.genWithHcs(coord, view);
    return coord.cylSurface(view, Vis$1.toRgbHsv, mbox.sin06F);
  }

  static doVecs(elem, see) {
    var color, coord, mbox, view;
    mbox = new MBox$1(elem);
    coord = new Coord$1(mbox, 12, 9, 9);
    color = new Color$1(mbox);
    view = coord.polar();
    return color.genWithVecsRgb(coord, view, see);
  }

  static doPolar(elem) {
    var color, coord, mbox, view;
    mbox = new MBox$1(elem);
    coord = new Coord$1(mbox, 12, 9, 9);
    color = new Color$1(mbox);
    view = coord.polar();
    return color.genPolarRgbs(coord, view, false);
  }

  static doScaleRgb(elem) {
    var color, coord, mbox, view;
    mbox = new MBox$1(elem);
    coord = new Coord$1(mbox, 12, 9, 9);
    color = new Color$1(mbox);
    view = coord.polar();
    return color.genPolarRgbs(coord, view, true);
  }

  static doRgbHcv() {
    var c, hue, i, j, len, len1, ref, ref1, results, s;
    s = 100;
    c = 100;
    ref = [0, 60, 120, 180, 240, 300];
    for (i = 0, len = ref.length; i < len; i++) {
      hue = ref[i];
      console.log('RgbHsv', {
        hue: hue,
        c: c,
        s: s
      }, Vis$1.toRgbHsv(hue, c, s));
    }
    ref1 = [0, 60, 120, 180, 240, 300];
    results = [];
    for (j = 0, len1 = ref1.length; j < len1; j++) {
      hue = ref1[j];
      results.push((function() {
        var k, len2, ref2, results1;
        ref2 = [0, 20, 40, 60, 80, 100];
        results1 = [];
        for (k = 0, len2 = ref2.length; k < len2; k++) {
          c = ref2[k];
          results1.push(console.log('RgbHsv', {
            hue: hue,
            c: c,
            s: s
          }, Vis$1.toRgbHsv(hue, c, s)));
        }
        return results1;
      })());
    }
    return results;
  }

};

// Box.init()
var Box$1 = Box;

//

let Hues = {

  components:{ 'd-tabs':Tabs },

  data() {
    return { route:'Hues', pageKey:'Hues', pages:{
        Color:   { title:'Color',   key:'Color',   show:false },
        Rgbs:    { title:'Rgbs',    key:'Rgbs',    show:false },
        Polar:   { title:'Polar',   key:'Polar',   show:false },
        Vecs:    { title:'Vecs',    key:'Vecs',    show:false },
        Sphere:  { title:'Sphere',  key:'Sphere',  show:false },
        Regress: { title:'Regress', key:'Regress', show:false } } } },

  methods: {

    isPage: function(pageKey) {
      return this.pageKey === pageKey; },

    onNav: function(obj) {
      if( this.nav().isMyNav( obj, this.route ) ) {
          this.pageKey = this.nav().getPageKey('Hues','None'); // No default
          if( this.pageKey !== 'None') {
              this.doApp( this.pageKey ); } } },

    size: function() {
      let sz   = {};
      sz.compWidth  = this.$refs['Hues']['clientWidth' ];
      sz.compHeight = this.$refs['Hues']['clientHeight'];
      sz.elemWidth  = this.$refs['Hues']['clientWidth' ];
      sz.elemHeight = this.$refs['Hues']['clientHeight'];
      return sz; },

    doApp: function( pageKey ) {
        this.$nextTick( function() {
          let elem = this.$refs[pageKey][0];
          if( this.isDef(elem) ) {
            Box$1.doApp(pageKey,elem); } } ); } },

  mounted: function () {
    this.subscribe(  'Nav', 'Hues.vue', (obj) => {
      this.onNav(obj); } ); }
};

/* script */
const __vue_script__$1 = Hues;

/* template */
var __vue_render__$1 = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c(
    "div",
    { ref: "Hues", staticClass: "hues-pane" },
    [
      _c("d-tabs", {
        attrs: { route: "Hues", pages: _vm.pages, defn: "None" }
      }),
      _vm._v(" "),
      _vm.pageKey === "Hues"
        ? _c("h1", [_vm._v("Hues with MathBox")])
        : _vm._e(),
      _vm._v(" "),
      _vm._l(_vm.pages, function(page) {
        return [
          page.show
            ? _c("div", {
                key: page.key,
                ref: page.key,
                refInFor: true,
                staticClass: "hues-page"
              })
            : _vm._e()
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
    inject("data-v-46ac1802_0", { source: ".theme-h1 {\n  font-size: 8vmin;\n  margin: 2vmin 0 2vmin 0;\n  display: grid;\n  justify-self: center;\n  align-self: center;\n  text-align: center;\n}\n.theme-h2 {\n  font-size: 6.4vmin;\n  margin: 1.6vmin 0 1.6vmin 0;\n  display: grid;\n  justify-self: center;\n  align-self: center;\n  text-align: center;\n}\n.theme-h3 {\n  font-size: 5.12vmin;\n  margin: 1.28vmin 0 1.28vmin 0;\n  display: grid;\n  justify-self: center;\n  align-self: center;\n  text-align: center;\n}\n.theme-h4 {\n  font-size: 4vmin;\n  margin: 1.024vmin 0 1.024vmin 0;\n  display: grid;\n  justify-self: center;\n  align-self: center;\n  text-align: center;\n}\n.theme-h5 {\n  font-size: 3.2vmin;\n  margin: 0.82vmin 0 0.82vmin 0;\n  display: grid;\n  justify-self: center;\n  align-self: center;\n  text-align: center;\n}\n.theme-h6 {\n  font-size: 2.56vmin;\n  margin: 0.656vmin 0 0.656vmin 0;\n  display: grid;\n  justify-self: center;\n  align-self: center;\n  text-align: center;\n}\n.theme-p {\n  font-size: 2vmin;\n  margin: 0.524vmin 0 0.524vmin 0;\n  display: grid;\n  justify-self: start;\n  align-self: center;\n  text-align: left;\n}\n.theme-article {\n  position: absolute;\n  left: 0;\n  top: 0;\n  width: 100%;\n  height: 100%;\n}\n.theme-header {\n  position: absolute;\n  left: 0;\n  top: 0;\n  width: 100%;\n  height: 20%;\n}\n.theme-section {\n  position: absolute;\n  left: 0;\n  top: 20%;\n  width: 100%;\n  height: 60%;\n}\n.theme-footer {\n  position: absolute;\n  left: 0;\n  top: 80%;\n  width: 100%;\n  height: 20%;\n}\n.theme-ul {\n  font-size: 4vmin;\n  padding: 0;\n  margin: 0;\n  list-style: none;\n  font-weight: bold;\n}\n.theme-ul li {\n  margin: 0.25vmin 0.25vmin 0.25vmin 0.25vmin;\n}\n.theme-ul li ul {\n  font-size: 3.5vmin;\n  padding: 0;\n  margin: 0;\n  list-style: none;\n}\n.theme-ul li ul li {\n  padding-left: 1vmin;\n  margin: 0.25vmin 0.25vmin 0.25vmin 0.25vmin;\n}\n.theme-ul li ul li ul {\n  font-size: 3vmin;\n  padding: 0;\n  margin: 0;\n  list-style: none;\n}\n.theme-ul li ul li ul li {\n  padding-left: 1vmin;\n  margin: 0.25vmin 0.25vmin 0.25vmin 0.25vmin;\n}\n.hues-pane {\n  position: absolute;\n  left: 0;\n  top: 0;\n  width: 100%;\n  height: 100%;\n  display: grid;\n  background-color: black;\n  font-family: Roboto, sans-serif;\n}\n.hues-pane h1 {\n@theme-h 1;\n  color: wheat;\n}\n.hues-pane .hues-page {\n  position: absolute;\n  left: 0;\n  top: 5%;\n  width: 100%;\n  height: 95%;\n}\n", map: {"version":3,"sources":["Hues.vue","/Users/ax/Documents/prj/aug/vue/draw/Hues.vue"],"names":[],"mappings":"AAAA;EACE,gBAAgB;EAChB,uBAAuB;EACvB,aAAa;EACb,oBAAoB;EACpB,kBAAkB;EAClB,kBAAkB;AACpB;AACA;EACE,kBAAkB;EAClB,2BAA2B;EAC3B,aAAa;EACb,oBAAoB;EACpB,kBAAkB;EAClB,kBAAkB;AACpB;AACA;EACE,mBAAmB;EACnB,6BAA6B;EAC7B,aAAa;EACb,oBAAoB;EACpB,kBAAkB;EAClB,kBAAkB;AACpB;AACA;EACE,gBAAgB;EAChB,+BAA+B;EAC/B,aAAa;EACb,oBAAoB;EACpB,kBAAkB;EAClB,kBAAkB;AACpB;AACA;EACE,kBAAkB;EAClB,6BAA6B;EAC7B,aAAa;EACb,oBAAoB;EACpB,kBAAkB;EAClB,kBAAkB;AACpB;AACA;EACE,mBAAmB;EACnB,+BAA+B;EAC/B,aAAa;EACb,oBAAoB;EACpB,kBAAkB;EAClB,kBAAkB;AACpB;AACA;EACE,gBAAgB;EAChB,+BAA+B;EAC/B,aAAa;EACb,mBAAmB;EACnB,kBAAkB;EAClB,gBAAgB;AAClB;AACA;EACE,kBAAkB;EAClB,OAAO;EACP,MAAM;EACN,WAAW;EACX,YAAY;AACd;AACA;EACE,kBAAkB;EAClB,OAAO;ECCT,MAAA;EDCE,WAAW;ECCb,WAAA;AACA;AACA;EACA,kBAAA;EDCE,OAAO;EACP,QAAQ;EACR,WAAW;EACX,WAAW;AACb;AACA;EACE,kBAAkB;EAClB,OAAO;EACP,QAAQ;EACR,WAAW;EACX,WAAW;AACb;AACA;EACE,gBAAgB;EAChB,UAAU;EACV,SAAS;EACT,gBAAgB;EAChB,iBAAiB;AACnB;AACA;EACE,2CAA2C;AAC7C;AACA;EACE,kBAAkB;EAClB,UAAU;EACV,SAAS;EACT,gBAAgB;AAClB;AACA;EACE,mBAAmB;EACnB,2CAA2C;AAC7C;AACA;EACE,gBAAgB;EAChB,UAAU;EACV,SAAS;EACT,gBAAgB;AAClB;AACA;EACE,mBAAmB;EACnB,2CAA2C;AAC7C;AACA;EACE,kBAAkB;EAClB,OAAO;EACP,MAAM;EACN,WAAW;EACX,YAAY;EACZ,aAAa;EACb,uBAAuB;EACvB,+BAA+B;AACjC;AACA;AACE,UAAU;EACV,YAAY;AACd;AACA;EACE,kBAAkB;EAClB,OAAO;EACP,OAAO;EACP,WAAW;EACX,WAAW;AACb","file":"Hues.vue","sourcesContent":[".theme-h1 {\n  font-size: 8vmin;\n  margin: 2vmin 0 2vmin 0;\n  display: grid;\n  justify-self: center;\n  align-self: center;\n  text-align: center;\n}\n.theme-h2 {\n  font-size: 6.4vmin;\n  margin: 1.6vmin 0 1.6vmin 0;\n  display: grid;\n  justify-self: center;\n  align-self: center;\n  text-align: center;\n}\n.theme-h3 {\n  font-size: 5.12vmin;\n  margin: 1.28vmin 0 1.28vmin 0;\n  display: grid;\n  justify-self: center;\n  align-self: center;\n  text-align: center;\n}\n.theme-h4 {\n  font-size: 4vmin;\n  margin: 1.024vmin 0 1.024vmin 0;\n  display: grid;\n  justify-self: center;\n  align-self: center;\n  text-align: center;\n}\n.theme-h5 {\n  font-size: 3.2vmin;\n  margin: 0.82vmin 0 0.82vmin 0;\n  display: grid;\n  justify-self: center;\n  align-self: center;\n  text-align: center;\n}\n.theme-h6 {\n  font-size: 2.56vmin;\n  margin: 0.656vmin 0 0.656vmin 0;\n  display: grid;\n  justify-self: center;\n  align-self: center;\n  text-align: center;\n}\n.theme-p {\n  font-size: 2vmin;\n  margin: 0.524vmin 0 0.524vmin 0;\n  display: grid;\n  justify-self: start;\n  align-self: center;\n  text-align: left;\n}\n.theme-article {\n  position: absolute;\n  left: 0;\n  top: 0;\n  width: 100%;\n  height: 100%;\n}\n.theme-header {\n  position: absolute;\n  left: 0;\n  top: 0;\n  width: 100%;\n  height: 20%;\n}\n.theme-section {\n  position: absolute;\n  left: 0;\n  top: 20%;\n  width: 100%;\n  height: 60%;\n}\n.theme-footer {\n  position: absolute;\n  left: 0;\n  top: 80%;\n  width: 100%;\n  height: 20%;\n}\n.theme-ul {\n  font-size: 4vmin;\n  padding: 0;\n  margin: 0;\n  list-style: none;\n  font-weight: bold;\n}\n.theme-ul li {\n  margin: 0.25vmin 0.25vmin 0.25vmin 0.25vmin;\n}\n.theme-ul li ul {\n  font-size: 3.5vmin;\n  padding: 0;\n  margin: 0;\n  list-style: none;\n}\n.theme-ul li ul li {\n  padding-left: 1vmin;\n  margin: 0.25vmin 0.25vmin 0.25vmin 0.25vmin;\n}\n.theme-ul li ul li ul {\n  font-size: 3vmin;\n  padding: 0;\n  margin: 0;\n  list-style: none;\n}\n.theme-ul li ul li ul li {\n  padding-left: 1vmin;\n  margin: 0.25vmin 0.25vmin 0.25vmin 0.25vmin;\n}\n.hues-pane {\n  position: absolute;\n  left: 0;\n  top: 0;\n  width: 100%;\n  height: 100%;\n  display: grid;\n  background-color: black;\n  font-family: Roboto, sans-serif;\n}\n.hues-pane h1 {\n  @theme-h 1;\n  color: wheat;\n}\n.hues-pane .hues-page {\n  position: absolute;\n  left: 0;\n  top: 5%;\n  width: 100%;\n  height: 95%;\n}\n","\n\n<template>\n  <div class=\"hues-pane\" ref=\"Hues\">\n    <d-tabs route=\"Hues\" :pages=\"pages\" defn=\"None\"></d-tabs>\n    <h1 v-if=\"pageKey==='Hues'\">Hues with MathBox</h1>\n    <template v-for=\"page in pages\">\n      <div :ref=\"page.key\" v-if=\"page.show\" class=\"hues-page\" :key=\"page.key\"></div>\n    </template>\n  </div>\n</template>\n\n<script type=\"module\">\n\n  import Tabs from '../elem/Tabs.vue';\n  import Box  from '../../pub/math/mbox/Box.js'\n\n  let Hues = {\n\n    components:{ 'd-tabs':Tabs },\n\n    data() {\n      return { route:'Hues', pageKey:'Hues', pages:{\n          Color:   { title:'Color',   key:'Color',   show:false },\n          Rgbs:    { title:'Rgbs',    key:'Rgbs',    show:false },\n          Polar:   { title:'Polar',   key:'Polar',   show:false },\n          Vecs:    { title:'Vecs',    key:'Vecs',    show:false },\n          Sphere:  { title:'Sphere',  key:'Sphere',  show:false },\n          Regress: { title:'Regress', key:'Regress', show:false } } } },\n\n    methods: {\n\n      isPage: function(pageKey) {\n        return this.pageKey === pageKey; },\n\n      onNav: function(obj) {\n        if( this.nav().isMyNav( obj, this.route ) ) {\n            this.pageKey = this.nav().getPageKey('Hues','None'); // No default\n            if( this.pageKey !== 'None') {\n                this.doApp( this.pageKey ); } } },\n\n      size: function() {\n        let sz   = {}\n        sz.compWidth  = this.$refs['Hues']['clientWidth' ];\n        sz.compHeight = this.$refs['Hues']['clientHeight'];\n        sz.elemWidth  = this.$refs['Hues']['clientWidth' ];\n        sz.elemHeight = this.$refs['Hues']['clientHeight'];\n        return sz; },\n\n      doApp: function( pageKey ) {\n          this.$nextTick( function() {\n            let elem = this.$refs[pageKey][0];\n            if( this.isDef(elem) ) {\n              Box.doApp(pageKey,elem); } } ) } },\n\n    mounted: function () {\n      this.subscribe(  'Nav', 'Hues.vue', (obj) => {\n        this.onNav(obj); } ); }\n  }\n\n  export default Hues;\n\n</script>\n\n<style lang=\"less\">\n  \n  @import '../../pub/css/themes/theme.less';\n  \n  .hues-pane {   position:absolute; left:0; top:0; width:100%; height:100%; display:grid;\n    background-color:@theme-back; font-family:@theme-font-family;\n    h1    { @theme-h1; color:@theme-fore;  }\n    .hues-page { position:absolute; left:0; top:@theme-tabs-height; width:100%; height:100%-@theme-tabs-height  } }\n  \n</style>"]}, media: undefined });

  };
  /* scoped */
  const __vue_scope_id__$1 = undefined;
  /* module identifier */
  const __vue_module_identifier__$1 = undefined;
  /* functional template */
  const __vue_is_functional_template__$1 = false;
  /* style inject SSR */
  

  
  var Hues$1 = normalizeComponent_1(
    { render: __vue_render__$1, staticRenderFns: __vue_staticRenderFns__$1 },
    __vue_inject_styles__$1,
    __vue_script__$1,
    __vue_scope_id__$1,
    __vue_is_functional_template__$1,
    __vue_module_identifier__$1,
    browser,
    undefined
  );

export default Hues$1;
