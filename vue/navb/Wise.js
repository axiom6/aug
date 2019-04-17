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
//

var script = {
  data() { return { prac:"None", all:true } },
  methods: {
    isPrac: function (prac) {
      return this.prac===prac || this.all },
    onPrac: function (prac) {
      // console.log( 'Wise.onPrac', { all:this.all, prac:this.prac } );
      if( prac==='Wise' ) { this.all=true; } else { this.all=false; this.prac=prac; } },
    klass: function(klas) {
      return !this.all ? 'all' : klas; } },
  mounted: function () {
    // console.log( 'Wise.vue', 'mounted' );
    this.subscribe( 'Wise', 'Wise.vue', (prac) => this.onPrac(prac) ); }
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
  return _c("div", { staticClass: "view" }, [
    _vm.isPrac("Trust")
      ? _c("div", { class: _vm.klass("nw"), attrs: { id: "Trust" } }, [
          _vm._m(0)
        ])
      : _vm._e(),
    _vm._v(" "),
    _vm.isPrac("Nature")
      ? _c("div", { class: _vm.klass("north"), attrs: { id: "Nature" } }, [
          _vm._m(1)
        ])
      : _vm._e(),
    _vm._v(" "),
    _vm.isPrac("Truth")
      ? _c("div", { class: _vm.klass("ne"), attrs: { id: "Truth" } }, [
          _vm._m(2)
        ])
      : _vm._e(),
    _vm._v(" "),
    _vm.isPrac("Explore")
      ? _c("div", { class: _vm.klass("west"), attrs: { id: "Explore" } }, [
          _vm._m(3)
        ])
      : _vm._e(),
    _vm._v(" "),
    _vm.isPrac("Create")
      ? _c("div", { class: _vm.klass("cen"), attrs: { id: "Create" } }, [
          _vm._m(4)
        ])
      : _vm._e(),
    _vm._v(" "),
    _vm.isPrac("Mind")
      ? _c("div", { class: _vm.klass("east"), attrs: { id: "Mind" } }, [
          _vm._m(5)
        ])
      : _vm._e(),
    _vm._v(" "),
    _vm.isPrac("Emerge")
      ? _c("div", { class: _vm.klass("sw"), attrs: { id: "Emerge" } }, [
          _vm._m(6)
        ])
      : _vm._e(),
    _vm._v(" "),
    _vm.isPrac("Inspire")
      ? _c("div", { class: _vm.klass("south"), attrs: { id: "Inspire" } }, [
          _vm._m(7)
        ])
      : _vm._e(),
    _vm._v(" "),
    _vm.isPrac("Actual")
      ? _c("div", { class: _vm.klass("se"), attrs: { id: "Actual" } }, [
          _vm._m(8)
        ])
      : _vm._e()
  ])
};
var __vue_staticRenderFns__ = [
  function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c("div", { staticClass: "pane" }, [
      _c("div", { staticClass: "cen" }, [_c("div", [_vm._v("Trust")])])
    ])
  },
  function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c("div", { staticClass: "pane" }, [
      _c("div", { staticClass: "cen" }, [_c("div", [_vm._v("Nature")])])
    ])
  },
  function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c("div", { staticClass: "pane" }, [
      _c("div", { staticClass: "cen" }, [_c("div", [_vm._v("Truth")])])
    ])
  },
  function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c("div", { staticClass: "pane" }, [
      _c("div", { staticClass: "cen" }, [_c("div", [_vm._v("Explore")])])
    ])
  },
  function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c("div", { staticClass: "pane" }, [
      _c("div", { staticClass: "cen" }, [_c("div", [_vm._v("Create")])])
    ])
  },
  function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c("div", { staticClass: "pane" }, [
      _c("div", { staticClass: "cen" }, [_c("div", [_vm._v("Mind")])])
    ])
  },
  function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c("div", { staticClass: "pane" }, [
      _c("div", { staticClass: "cen" }, [_c("div", [_vm._v("Emerge")])])
    ])
  },
  function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c("div", { staticClass: "pane" }, [
      _c("div", { staticClass: "cen" }, [_c("div", [_vm._v("Inspire")])])
    ])
  },
  function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c("div", { staticClass: "pane" }, [
      _c("div", { staticClass: "cen" }, [_c("div", [_vm._v("Actual")])])
    ])
  }
];
__vue_render__._withStripped = true;

  /* style */
  const __vue_inject_styles__ = function (inject) {
    if (!inject) return
    inject("data-v-b2e315cc_0", { source: ".view {\n  background-color: black;\n  display: grid;\n  position: relative;\n  grid-template-columns: 33%  33% 34%;\n  grid-template-rows: 33%  33% 34%;\n  grid-template-areas: \"nw   north ne\" \"west cen   east\" \"sw   south se\";\n  justify-items: center;\n  align-items: center;\n}\n.view .nw {\n  grid-area: nw;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n}\n.view .north {\n  grid-area: north;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n}\n.view .ne {\n  grid-area: ne;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n}\n.view .west {\n  grid-area: west;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n}\n.view .cen {\n  grid-area: cen;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n}\n.view .east {\n  grid-area: east;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n}\n.view .sw {\n  grid-area: sw;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n}\n.view .south {\n  grid-area: south;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n}\n.view .se {\n  grid-area: se;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n}\n.view .pane {\n  width: 90%;\n  height: 80%;\n  background-color: #603;\n  justify-self: center;\n  align-self: center;\n  display: grid;\n  border-radius: 0.5em;\n  font-size: 3vh;\n  font-weight: bold;\n  grid-template-columns: 33%  33% 34%;\n  grid-template-rows: 33%  33% 34%;\n  grid-template-areas: \"nw   north ne\" \"west cen   east\" \"sw   south se\";\n}\n.view .pane .name {\n  font-size: 2em;\n  background-color: tan;\n  text-align: center;\n  justify-self: center;\n  align-self: center;\n}\n.view .pane .cen {\n  grid-area: cen;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n  background: coral;\n  border-radius: 36px;\n  font-size: 4vh;\n}\n.view .pane .west {\n  grid-area: west;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n  background: springgreen;\n  border-radius: 36px;\n}\n.view .pane .north {\n  grid-area: north;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n  background: gold;\n  border-radius: 36px;\n}\n.view .pane .east {\n  grid-area: east;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n  background: salmon;\n  border-radius: 36px;\n}\n.view .pane .south {\n  grid-area: south;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n  background: peru;\n  border-radius: 36px;\n}\n.view .pane div div {\n  text-align: center;\n  justify-self: center;\n  align-self: center;\n}\n.view .all {\n  position: absolute;\n  left: 3%;\n  top: 6%;\n  right: 3%;\n  bottom: 6%;\n  display: grid;\n}\n.view .all .pane {\n  font-size: 1.5em;\n  width: 100%;\n  height: 100%;\n  background-color: #603;\n  justify-self: center;\n  align-self: center;\n  display: grid;\n  border-radius: 0.5em;\n}\n.view .all .pane .name {\n  font-size: 2em;\n  background-color: tan;\n  justify-self: center;\n  align-self: center;\n  text-align: center;\n}\n", map: {"version":3,"sources":["Wise.vue","/Users/ax/Documents/prj/aug/vue/muse/Wise.vue"],"names":[],"mappings":"AAAA;EACE,uBAAuB;EACvB,aAAa;EACb,kBAAkB;EAClB,mCAAmC;EACnC,gCAAgC;EAChC,sEAAsE;EACtE,qBAAqB;EACrB,mBAAmB;AACrB;AACA;EACE,aAAa;EACb,qBAAqB;EACrB,mBAAmB;EACnB,aAAa;AACf;AACA;EACE,gBAAgB;EAChB,qBAAqB;EACrB,mBAAmB;EACnB,aAAa;AACf;AACA;EACE,aAAa;EACb,qBAAqB;EACrB,mBAAmB;EACnB,aAAa;AACf;AACA;EACE,eAAe;EACf,qBAAqB;EACrB,mBAAmB;EACnB,aAAa;AACf;AACA;EACE,cAAc;EACd,qBAAqB;EACrB,mBAAmB;EACnB,aAAa;AACf;AACA;EACE,eAAe;ECCjB,qBAAA;EDCE,mBAAmB;EACnB,aAAa;AACf;AACA;EACE,aAAa;EACb,qBAAqB;EACrB,mBAAmB;EACnB,aAAa;AACf;AACA;EACE,gBAAgB;EAChB,qBAAqB;EACrB,mBAAmB;EACnB,aAAa;AACf;AACA;EACE,aAAa;EACb,qBAAqB;EACrB,mBAAmB;EACnB,aAAa;AACf;AACA;EACE,UAAU;EACV,WAAW;EACX,sBAAsB;EACtB,oBAAoB;EACpB,kBAAkB;EAClB,aAAa;EACb,oBAAoB;EACpB,cAAc;EACd,iBAAiB;EACjB,mCAAmC;EACnC,gCAAgC;EAChC,sEAAsE;AACxE;AACA;EACE,cAAc;EACd,qBAAqB;EACrB,kBAAkB;EAClB,oBAAoB;EACpB,kBAAkB;AACpB;AACA;EACE,cAAc;EACd,qBAAqB;EACrB,mBAAmB;EACnB,aAAa;EACb,iBAAiB;EACjB,mBAAmB;EACnB,cAAc;AAChB;AACA;EACE,eAAe;EACf,qBAAqB;EACrB,mBAAmB;EACnB,aAAa;EACb,uBAAuB;EACvB,mBAAmB;AACrB;AACA;EACE,gBAAgB;EAChB,qBAAqB;EACrB,mBAAmB;EACnB,aAAa;EACb,gBAAgB;EAChB,mBAAmB;AACrB;AACA;EACE,eAAe;EACf,qBAAqB;EACrB,mBAAmB;EACnB,aAAa;EACb,kBAAkB;EAClB,mBAAmB;AACrB;AACA;EACE,gBAAgB;EAChB,qBAAqB;EACrB,mBAAmB;EACnB,aAAa;EACb,gBAAgB;EAChB,mBAAmB;AACrB;AACA;EACE,kBAAkB;EAClB,oBAAoB;EACpB,kBAAkB;AACpB;AACA;EACE,kBAAkB;EAClB,QAAQ;EACR,OAAO;EACP,SAAS;EACT,UAAU;EACV,aAAa;AACf;AACA;EACE,gBAAgB;EAChB,WAAW;EACX,YAAY;EACZ,sBAAsB;EACtB,oBAAoB;EACpB,kBAAkB;EAClB,aAAa;EACb,oBAAoB;AACtB;AACA;EACE,cAAc;EACd,qBAAqB;EACrB,oBAAoB;EACpB,kBAAkB;EAClB,kBAAkB;AACpB","file":"Wise.vue","sourcesContent":[".view {\n  background-color: black;\n  display: grid;\n  position: relative;\n  grid-template-columns: 33%  33% 34%;\n  grid-template-rows: 33%  33% 34%;\n  grid-template-areas: \"nw   north ne\" \"west cen   east\" \"sw   south se\";\n  justify-items: center;\n  align-items: center;\n}\n.view .nw {\n  grid-area: nw;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n}\n.view .north {\n  grid-area: north;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n}\n.view .ne {\n  grid-area: ne;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n}\n.view .west {\n  grid-area: west;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n}\n.view .cen {\n  grid-area: cen;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n}\n.view .east {\n  grid-area: east;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n}\n.view .sw {\n  grid-area: sw;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n}\n.view .south {\n  grid-area: south;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n}\n.view .se {\n  grid-area: se;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n}\n.view .pane {\n  width: 90%;\n  height: 80%;\n  background-color: #603;\n  justify-self: center;\n  align-self: center;\n  display: grid;\n  border-radius: 0.5em;\n  font-size: 3vh;\n  font-weight: bold;\n  grid-template-columns: 33%  33% 34%;\n  grid-template-rows: 33%  33% 34%;\n  grid-template-areas: \"nw   north ne\" \"west cen   east\" \"sw   south se\";\n}\n.view .pane .name {\n  font-size: 2em;\n  background-color: tan;\n  text-align: center;\n  justify-self: center;\n  align-self: center;\n}\n.view .pane .cen {\n  grid-area: cen;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n  background: coral;\n  border-radius: 36px;\n  font-size: 4vh;\n}\n.view .pane .west {\n  grid-area: west;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n  background: springgreen;\n  border-radius: 36px;\n}\n.view .pane .north {\n  grid-area: north;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n  background: gold;\n  border-radius: 36px;\n}\n.view .pane .east {\n  grid-area: east;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n  background: salmon;\n  border-radius: 36px;\n}\n.view .pane .south {\n  grid-area: south;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n  background: peru;\n  border-radius: 36px;\n}\n.view .pane div div {\n  text-align: center;\n  justify-self: center;\n  align-self: center;\n}\n.view .all {\n  position: absolute;\n  left: 3%;\n  top: 6%;\n  right: 3%;\n  bottom: 6%;\n  display: grid;\n}\n.view .all .pane {\n  font-size: 1.5em;\n  width: 100%;\n  height: 100%;\n  background-color: #603;\n  justify-self: center;\n  align-self: center;\n  display: grid;\n  border-radius: 0.5em;\n}\n.view .all .pane .name {\n  font-size: 2em;\n  background-color: tan;\n  justify-self: center;\n  align-self: center;\n  text-align: center;\n}\n","\n<template>\n  <div class=\"view\">\n    <div id=\"Trust\"   v-if=\"isPrac('Trust')\" :class=\"klass('nw')\"    >\n      <div class=\"pane\"><div class=\"cen\"><div>Trust</div></div></div></div>\n    <div id=\"Nature\"  v-if=\"isPrac('Nature')\" :class=\"klass('north')\" >\n      <div class=\"pane\"><div class=\"cen\"><div>Nature</div></div></div></div>\n    <div id=\"Truth\"   v-if=\"isPrac('Truth')\" :class=\"klass('ne')\"    >\n      <div class=\"pane\"><div class=\"cen\"><div>Truth</div></div></div></div>\n    <div id=\"Explore\" v-if=\"isPrac('Explore')\" :class=\"klass('west')\"  >\n      <div class=\"pane\"><div class=\"cen\"><div>Explore</div></div></div></div>\n    <div id=\"Create\"  v-if=\"isPrac('Create')\" :class=\"klass('cen')\"   >\n      <div class=\"pane\"><div class=\"cen\"><div>Create</div></div></div></div>\n    <div id=\"Mind\"    v-if=\"isPrac('Mind')\" :class=\"klass('east')\"  >\n      <div class=\"pane\"><div class=\"cen\"><div>Mind</div></div></div></div>\n    <div id=\"Emerge\"  v-if=\"isPrac('Emerge')\" :class=\"klass('sw')\"    >\n      <div class=\"pane\"><div class=\"cen\"><div>Emerge</div></div></div></div>\n    <div id=\"Inspire\" v-if=\"isPrac('Inspire')\" :class=\"klass('south')\" >\n      <div class=\"pane\"><div class=\"cen\"><div>Inspire</div></div></div></div>\n    <div id=\"Actual\"  v-if=\"isPrac('Actual')\" :class=\"klass('se')\"    >\n      <div class=\"pane\"><div class=\"cen\"><div>Actual</div></div></div></div>\n  </div>\n</template>\n\n<script type=\"module\">\n  export default {\n    data() { return { prac:\"None\", all:true } },\n    methods: {\n      isPrac: function (prac) {\n        return this.prac===prac || this.all },\n      onPrac: function (prac) {\n        // console.log( 'Wise.onPrac', { all:this.all, prac:this.prac } );\n        if( prac==='Wise' ) { this.all=true; } else { this.all=false; this.prac=prac; } },\n      klass: function(klas) {\n        return !this.all ? 'all' : klas; } },\n    mounted: function () {\n      // console.log( 'Wise.vue', 'mounted' );\n      this.subscribe( 'Wise', 'Wise.vue', (prac) => this.onPrac(prac) ); }\n  }\n</script>\n\n<style lang=\"less\">\n  @import \"View.less\";\n</style>\n\n"]}, media: undefined });

  };
  /* scoped */
  const __vue_scope_id__ = undefined;
  /* module identifier */
  const __vue_module_identifier__ = undefined;
  /* functional template */
  const __vue_is_functional_template__ = false;
  /* style inject SSR */
  

  
  var Wise = normalizeComponent_1(
    { render: __vue_render__, staticRenderFns: __vue_staticRenderFns__ },
    __vue_inject_styles__,
    __vue_script__,
    __vue_scope_id__,
    __vue_is_functional_template__,
    __vue_module_identifier__,
    browser,
    undefined
  );

export default Wise;
