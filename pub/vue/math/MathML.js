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
      this.publish( this.comp, key ); },  // Key is a page
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
    inject("data-v-b3d8073e_0", { source: ".theme-logo {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-menu {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-find {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-tocs {\n  background-color: black;\n  font-size: 2.5rem;\n}\n.theme-view {\n  font-size: 1.5rem;\n}\n.theme-side {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-pref {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-foot {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-trak {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-prac {\n  background-color: #603;\n  font-size: 2rem;\n}\n.theme-icon {\n  background-color: #333;\n  border-radius: 36px;\n  width: 80%;\n  height: 90%;\n}\n.dabs {\n  position: absolute;\n  left: 0;\n  top: 0;\n  width: 100%;\n  height: 5%;\n  background-color: black;\n}\n.dabs .tab {\n  display: inline-block;\n  margin-left: 2em;\n  padding: 0.2em 0.3em 0.1em 0.3em;\n  border-radius: 12px 12px 0 0;\n  border-left: wheat solid thin;\n  border-top: wheat solid thin;\n  border-right: wheat solid thin;\n  background-color: black;\n  color: wheat;\n}\n.dabs .tab:hover {\n  background-color: wheat;\n  color: black;\n}\n.dabs .tab-active {\n  display: inline-block;\n  margin-left: 2em;\n  padding: 0.2em 0.3em 0.1em 0.3em;\n  border-radius: 12px 12px 0 0;\n  border-left: wheat solid thin;\n  border-top: wheat solid thin;\n  border-right: wheat solid thin;\n  background-color: black;\n  color: wheat;\n  background-color: wheat;\n  color: black;\n}\n", map: {"version":3,"sources":["Dabs.vue","/Users/ax/Documents/prj/aug/vue/elem/Dabs.vue"],"names":[],"mappings":"AAAA;EACE,uBAAuB;EACvB,iBAAiB;AACnB;AACA;EACE,uBAAuB;EACvB,iBAAiB;AACnB;AACA;EACE,uBAAuB;EACvB,iBAAiB;AACnB;AACA;EACE,uBAAuB;EACvB,iBAAiB;AACnB;AACA;EACE,iBAAiB;AACnB;AACA;EACE,uBAAuB;EACvB,iBAAiB;AACnB;AACA;EACE,uBAAuB;EACvB,iBAAiB;AACnB;AACA;EACE,uBAAuB;EACvB,iBAAiB;AACnB;AACA;EACE,uBAAuB;EACvB,iBAAiB;ACCnB;ADCA;ECCA,sBAAA;EACA,eAAA;AACA;AACA;EACA,sBAAA;EACA,mBAAA;EACA,UAAA;EDCE,WAAW;AACb;AACA;EACE,kBAAkB;EAClB,OAAO;EACP,MAAM;EACN,WAAW;EACX,UAAU;EACV,uBAAuB;AACzB;AACA;EACE,qBAAqB;EACrB,gBAAgB;EAChB,gCAAgC;EAChC,4BAA4B;EAC5B,6BAA6B;EAC7B,4BAA4B;EAC5B,8BAA8B;EAC9B,uBAAuB;EACvB,YAAY;AACd;AACA;EACE,uBAAuB;EACvB,YAAY;AACd;AACA;EACE,qBAAqB;EACrB,gBAAgB;EAChB,gCAAgC;EAChC,4BAA4B;EAC5B,6BAA6B;EAC7B,4BAA4B;EAC5B,8BAA8B;EAC9B,uBAAuB;EACvB,YAAY;EACZ,uBAAuB;EACvB,YAAY;AACd","file":"Dabs.vue","sourcesContent":[".theme-logo {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-menu {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-find {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-tocs {\n  background-color: black;\n  font-size: 2.5rem;\n}\n.theme-view {\n  font-size: 1.5rem;\n}\n.theme-side {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-pref {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-foot {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-trak {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-prac {\n  background-color: #603;\n  font-size: 2rem;\n}\n.theme-icon {\n  background-color: #333;\n  border-radius: 36px;\n  width: 80%;\n  height: 90%;\n}\n.dabs {\n  position: absolute;\n  left: 0;\n  top: 0;\n  width: 100%;\n  height: 5%;\n  background-color: black;\n}\n.dabs .tab {\n  display: inline-block;\n  margin-left: 2em;\n  padding: 0.2em 0.3em 0.1em 0.3em;\n  border-radius: 12px 12px 0 0;\n  border-left: wheat solid thin;\n  border-top: wheat solid thin;\n  border-right: wheat solid thin;\n  background-color: black;\n  color: wheat;\n}\n.dabs .tab:hover {\n  background-color: wheat;\n  color: black;\n}\n.dabs .tab-active {\n  display: inline-block;\n  margin-left: 2em;\n  padding: 0.2em 0.3em 0.1em 0.3em;\n  border-radius: 12px 12px 0 0;\n  border-left: wheat solid thin;\n  border-top: wheat solid thin;\n  border-right: wheat solid thin;\n  background-color: black;\n  color: wheat;\n  background-color: wheat;\n  color: black;\n}\n","\n<template>\n  <div class=\"dabs\">\n    <template v-for=\"page in pages\">\n      <div :class=\"classTab(page.key)\" @click=\"pubTab(page.key)\">{{page.title}}</div>\n    </template>\n  </div>\n</template>\n\n<script type=\"module\">\n\n  export default {\n\n    props: { comp:String, pages:Object, init:String },\n\n    data() { return { key:this.init } },\n\n    methods: {\n      pubTab: function (key) {\n        this.key = key;\n        this.publish( this.comp, key ); },  // Key is a page\n      classTab: function (key) {\n        return this.key===key ? 'tab-active' : 'tab'; } },\n\n    mounted: function () {\n      this.subscribe( 'Geom', 'Dabs.vue', (key) => {\n        this.classTab(key) } ); }\n\n  }\n\n</script>\n\n<style lang=\"less\">\n  \n  @import '../../pub/css/themes/theme.less';\n  \n  .dabs { position:absolute; left:0; top:0; width:100%; height:5%; background-color:@theme-back;\n    .tab { display:inline-block; margin-left:2.0em; padding:0.2em 0.3em 0.1em 0.3em;\n      border-radius:12px 12px 0 0; border-left: @theme-color solid thin;\n      border-top:@theme-color solid thin; border-right:@theme-color solid thin;\n      background-color:@theme-back; color:@theme-color; }\n    .tab:hover  {         background-color:@theme-color; color:@theme-back; }\n    .tab-active { .tab(); background-color:@theme-color; color:@theme-back; } }\n\n</style>"]}, media: undefined });

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

  let MathND = {

    components:{ 'd-dabs':Dabs },

    methods: {

      isPage: function(key) {
        return this.key === key; },

      onTabs: function(key) {
        if( this.pages[key] ) {
          this.key = key;
          this.create(this.key);
          this.mathML(this.exps); } },

      create: function( key ) {
        let page = this.pages[key];
        if( page.obj===null ) {
            page.obj = new page.create(); }
        let exps = page.obj.math();
        let i    = 0;
        for( let key in exps ) {
          let exp   = exps[key];
          exp.klass = this.klass(i);
          i++; }
        this.exps = exps; },

      mathML: function ( exps ) {
        this.$nextTick( function() { // Wait for DOM to render
          for( let key in exps ){
            let exp  = exps[key];
            let elem = this.$refs[exp.klass][0];
              elem.innerHTML = exp.mathML; } } ); },

    // Generate a row column layout class
    klass: function( i ) {
      let ncol = 3;
      let mod  = i       % ncol;
      let row  = (i-mod) / ncol + 1;
      let col  = mod + 1;
      return `r${row}c${col}`; }
    },

    mounted: function () {
      this.subscribe( 'Math', this.comp+'.vue', (key) => {
        if( typeof(key)==='string' ) {
          this.onTabs( key ); } } );
      this.onTabs( this.key ); }
  };

/* script */
const __vue_script__$1 = MathND;

/* template */
var __vue_render__$1 = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c(
    "div",
    [
      _c("d-dabs", {
        attrs: { comp: "Math", pages: _vm.pages, init: _vm.key }
      }),
      _vm._v(" "),
      _c(
        "div",
        { staticClass: "comp" },
        [
          _vm._l(_vm.exps, function(exp) {
            return [
              _c("div", { ref: exp.klass, refInFor: true, class: exp.klass })
            ]
          })
        ],
        2
      )
    ],
    1
  )
};
var __vue_staticRenderFns__$1 = [];
__vue_render__$1._withStripped = true;

  /* style */
  const __vue_inject_styles__$1 = function (inject) {
    if (!inject) return
    inject("data-v-610f9bfd_0", { source: ".theme-logo {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-menu {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-find {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-tocs {\n  background-color: black;\n  font-size: 2.5rem;\n}\n.theme-view {\n  font-size: 1.5rem;\n}\n.theme-side {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-pref {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-foot {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-trak {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-prac {\n  background-color: #603;\n  font-size: 2rem;\n}\n.theme-icon {\n  background-color: #333;\n  border-radius: 36px;\n  width: 80%;\n  height: 90%;\n}\n.comp {\n  background-color: black;\n  position: absolute;\n  left: 0;\n  top: 5%;\n  right: 0;\n  bottom: 0;\n  font-size: 2.5rem;\n  display: grid;\n  grid-template-columns: 33fr 33fr 34fr;\n  grid-template-rows: 11fr 11fr 11fr 11fr 11fr 11fr 11fr 11fr 12fr;\n  grid-template-areas: \"r1c1 r1c2 r1c3\" \"r2c1 r2c2 r2c3\" \"r3c1 r3c2 r3c3\" \"r4c1 r4c2 r4c3\" \"r5c1 r5c2 r5c3\" \"r6c1 r6c2 r6c3\" \"r7c1 r7c2 r7c3\" \"r8c1 r8c2 r8c3\" \"r9c1 r9c2 r9c3\";\n  justify-items: center;\n  align-items: center;\n}\n.comp .r1c1 {\n  display: grid;\n  grid-area: r1c1;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n  background-color: black;\n  color: wheat;\n  border: solid thin wheat;\n}\n.comp .r1c2 {\n  display: grid;\n  grid-area: r1c2;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n  background-color: black;\n  color: wheat;\n  border: solid thin wheat;\n}\n.comp .r1c3 {\n  display: grid;\n  grid-area: r1c3;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n  background-color: black;\n  color: wheat;\n  border: solid thin wheat;\n}\n.comp .r2c1 {\n  display: grid;\n  grid-area: r2c1;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n  background-color: black;\n  color: wheat;\n  border: solid thin wheat;\n}\n.comp .r2c2 {\n  display: grid;\n  grid-area: r2c2;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n  background-color: black;\n  color: wheat;\n  border: solid thin wheat;\n}\n.comp .r2c3 {\n  display: grid;\n  grid-area: r2c3;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n  background-color: black;\n  color: wheat;\n  border: solid thin wheat;\n}\n.comp .r3c1 {\n  display: grid;\n  grid-area: r3c1;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n  background-color: black;\n  color: wheat;\n  border: solid thin wheat;\n}\n.comp .r3c2 {\n  display: grid;\n  grid-area: r3c2;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n  background-color: black;\n  color: wheat;\n  border: solid thin wheat;\n}\n.comp .r3c3 {\n  display: grid;\n  grid-area: r3c3;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n  background-color: black;\n  color: wheat;\n  border: solid thin wheat;\n}\n.comp .r4c1 {\n  display: grid;\n  grid-area: r4c1;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n  background-color: black;\n  color: wheat;\n  border: solid thin wheat;\n}\n.comp .r4c2 {\n  display: grid;\n  grid-area: r4c2;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n  background-color: black;\n  color: wheat;\n  border: solid thin wheat;\n}\n.comp .r4c3 {\n  display: grid;\n  grid-area: r4c3;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n  background-color: black;\n  color: wheat;\n  border: solid thin wheat;\n}\n.comp .r5c1 {\n  display: grid;\n  grid-area: r5c1;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n  background-color: black;\n  color: wheat;\n  border: solid thin wheat;\n}\n.comp .r5c2 {\n  display: grid;\n  grid-area: r5c2;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n  background-color: black;\n  color: wheat;\n  border: solid thin wheat;\n}\n.comp .r5c3 {\n  display: grid;\n  grid-area: r5c3;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n  background-color: black;\n  color: wheat;\n  border: solid thin wheat;\n}\n.comp .r6c1 {\n  display: grid;\n  grid-area: r6c1;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n  background-color: black;\n  color: wheat;\n  border: solid thin wheat;\n}\n.comp .r6c2 {\n  display: grid;\n  grid-area: r6c2;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n  background-color: black;\n  color: wheat;\n  border: solid thin wheat;\n}\n.comp .r6c3 {\n  display: grid;\n  grid-area: r6c3;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n  background-color: black;\n  color: wheat;\n  border: solid thin wheat;\n}\n.comp .r7c1 {\n  display: grid;\n  grid-area: r7c1;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n  background-color: black;\n  color: wheat;\n  border: solid thin wheat;\n}\n.comp .r7c2 {\n  display: grid;\n  grid-area: r7c2;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n  background-color: black;\n  color: wheat;\n  border: solid thin wheat;\n}\n.comp .r7c3 {\n  display: grid;\n  grid-area: r7c3;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n  background-color: black;\n  color: wheat;\n  border: solid thin wheat;\n}\n.comp .r8c1 {\n  display: grid;\n  grid-area: r8c1;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n  background-color: black;\n  color: wheat;\n  border: solid thin wheat;\n}\n.comp .r8c2 {\n  display: grid;\n  grid-area: r8c2;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n  background-color: black;\n  color: wheat;\n  border: solid thin wheat;\n}\n.comp .r8c3 {\n  display: grid;\n  grid-area: r8c3;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n  background-color: black;\n  color: wheat;\n  border: solid thin wheat;\n}\n.comp .r9c1 {\n  display: grid;\n  grid-area: r9c1;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n  background-color: black;\n  color: wheat;\n  border: solid thin wheat;\n}\n.comp .r9c2 {\n  display: grid;\n  grid-area: r9c2;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n  background-color: black;\n  color: wheat;\n  border: solid thin wheat;\n}\n.comp .r9c3 {\n  display: grid;\n  grid-area: r9c3;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n  background-color: black;\n  color: wheat;\n  border: solid thin wheat;\n}\n", map: {"version":3,"sources":["MathND.vue","/Users/ax/Documents/prj/aug/vue/math/MathND.vue"],"names":[],"mappings":"AAAA;EACE,uBAAuB;EACvB,iBAAiB;AACnB;AACA;EACE,uBAAuB;EACvB,iBAAiB;AACnB;AACA;EACE,uBAAuB;EACvB,iBAAiB;AACnB;AACA;EACE,uBAAuB;EACvB,iBAAiB;AACnB;AACA;EACE,iBAAiB;AACnB;AACA;EACE,uBAAuB;EACvB,iBAAiB;AACnB;AACA;EACE,uBAAuB;EACvB,iBAAiB;AACnB;AACA;EACE,uBAAuB;EACvB,iBAAiB;AACnB;AACA;EACE,uBAAuB;EACvB,iBAAiB;AACnB;AACA;EACE,sBAAsB;EACtB,eAAe;AACjB;AACA;EACE,sBAAsB;EACtB,mBAAmB;EACnB,UAAU;EACV,WAAW;AACb;AACA;EACE,uBAAuB;EACvB,kBAAkB;EAClB,OAAO;EACP,OAAO;EACP,QAAQ;EACR,SAAS;EACT,iBAAiB;EACjB,aAAa;EACb,qCAAqC;EACrC,gEAAgE;EAChE,6KAA6K;EAC7K,qBAAqB;EACrB,mBAAmB;AACrB;AACA;EACE,aAAa;EACb,eAAe;EACf,qBAAqB;EACrB,mBAAmB;EACnB,qBAAqB;EACrB,mBAAmB;EACnB,uBAAuB;EACvB,YAAY;EACZ,wBAAwB;AAC1B;AACA;EACE,aAAa;ECCf,eAAA;EDCE,qBAAqB;ECCvB,mBAAA;EACA,qBAAA;EACA,mBAAA;EACA,uBAAA;EACA,YAAA;EDCE,wBAAwB;ACC1B;AACA;EACA,aAAA;EDCE,eAAe;ECCjB,qBAAA;EACA,mBAAA;EDCE,qBAAqB;ECCvB,mBAAA;EACA,uBAAA;EACA,YAAA;EACA,wBAAA;AACA;AACA;EACA,aAAA;EACA,eAAA;EACA,qBAAA;EACA,mBAAA;EDCE,qBAAqB;EACrB,mBAAmB;EACnB,uBAAuB;EACvB,YAAY;EACZ,wBAAwB;AAC1B;AACA;EACE,aAAa;EACb,eAAe;EACf,qBAAqB;EACrB,mBAAmB;EACnB,qBAAqB;EACrB,mBAAmB;EACnB,uBAAuB;EACvB,YAAY;EACZ,wBAAwB;AAC1B;AACA;EACE,aAAa;EACb,eAAe;EACf,qBAAqB;EACrB,mBAAmB;EACnB,qBAAqB;EACrB,mBAAmB;EACnB,uBAAuB;EACvB,YAAY;EACZ,wBAAwB;AAC1B;AACA;EACE,aAAa;EACb,eAAe;EACf,qBAAqB;EACrB,mBAAmB;EACnB,qBAAqB;EACrB,mBAAmB;EACnB,uBAAuB;EACvB,YAAY;EACZ,wBAAwB;AAC1B;AACA;EACE,aAAa;EACb,eAAe;EACf,qBAAqB;EACrB,mBAAmB;EACnB,qBAAqB;EACrB,mBAAmB;EACnB,uBAAuB;EACvB,YAAY;EACZ,wBAAwB;AAC1B;AACA;EACE,aAAa;EACb,eAAe;EACf,qBAAqB;EACrB,mBAAmB;EACnB,qBAAqB;EACrB,mBAAmB;EACnB,uBAAuB;EACvB,YAAY;EACZ,wBAAwB;AAC1B;AACA;EACE,aAAa;EACb,eAAe;EACf,qBAAqB;EACrB,mBAAmB;EACnB,qBAAqB;EACrB,mBAAmB;EACnB,uBAAuB;EACvB,YAAY;EACZ,wBAAwB;AAC1B;AACA;EACE,aAAa;EACb,eAAe;EACf,qBAAqB;EACrB,mBAAmB;EACnB,qBAAqB;EACrB,mBAAmB;EACnB,uBAAuB;EACvB,YAAY;EACZ,wBAAwB;AAC1B;AACA;EACE,aAAa;EACb,eAAe;EACf,qBAAqB;EACrB,mBAAmB;EACnB,qBAAqB;EACrB,mBAAmB;EACnB,uBAAuB;EACvB,YAAY;EACZ,wBAAwB;AAC1B;AACA;EACE,aAAa;EACb,eAAe;EACf,qBAAqB;EACrB,mBAAmB;EACnB,qBAAqB;EACrB,mBAAmB;EACnB,uBAAuB;EACvB,YAAY;EACZ,wBAAwB;AAC1B;AACA;EACE,aAAa;EACb,eAAe;EACf,qBAAqB;EACrB,mBAAmB;EACnB,qBAAqB;EACrB,mBAAmB;EACnB,uBAAuB;EACvB,YAAY;EACZ,wBAAwB;AAC1B;AACA;EACE,aAAa;EACb,eAAe;EACf,qBAAqB;EACrB,mBAAmB;EACnB,qBAAqB;EACrB,mBAAmB;EACnB,uBAAuB;EACvB,YAAY;EACZ,wBAAwB;AAC1B;AACA;EACE,aAAa;EACb,eAAe;EACf,qBAAqB;EACrB,mBAAmB;EACnB,qBAAqB;EACrB,mBAAmB;EACnB,uBAAuB;EACvB,YAAY;EACZ,wBAAwB;AAC1B;AACA;EACE,aAAa;EACb,eAAe;EACf,qBAAqB;EACrB,mBAAmB;EACnB,qBAAqB;EACrB,mBAAmB;EACnB,uBAAuB;EACvB,YAAY;EACZ,wBAAwB;AAC1B;AACA;EACE,aAAa;EACb,eAAe;EACf,qBAAqB;EACrB,mBAAmB;EACnB,qBAAqB;EACrB,mBAAmB;EACnB,uBAAuB;EACvB,YAAY;EACZ,wBAAwB;AAC1B;AACA;EACE,aAAa;EACb,eAAe;EACf,qBAAqB;EACrB,mBAAmB;EACnB,qBAAqB;EACrB,mBAAmB;EACnB,uBAAuB;EACvB,YAAY;EACZ,wBAAwB;AAC1B;AACA;EACE,aAAa;EACb,eAAe;EACf,qBAAqB;EACrB,mBAAmB;EACnB,qBAAqB;EACrB,mBAAmB;EACnB,uBAAuB;EACvB,YAAY;EACZ,wBAAwB;AAC1B;AACA;EACE,aAAa;EACb,eAAe;EACf,qBAAqB;EACrB,mBAAmB;EACnB,qBAAqB;EACrB,mBAAmB;EACnB,uBAAuB;EACvB,YAAY;EACZ,wBAAwB;AAC1B;AACA;EACE,aAAa;EACb,eAAe;EACf,qBAAqB;EACrB,mBAAmB;EACnB,qBAAqB;EACrB,mBAAmB;EACnB,uBAAuB;EACvB,YAAY;EACZ,wBAAwB;AAC1B;AACA;EACE,aAAa;EACb,eAAe;EACf,qBAAqB;EACrB,mBAAmB;EACnB,qBAAqB;EACrB,mBAAmB;EACnB,uBAAuB;EACvB,YAAY;EACZ,wBAAwB;AAC1B;AACA;EACE,aAAa;EACb,eAAe;EACf,qBAAqB;EACrB,mBAAmB;EACnB,qBAAqB;EACrB,mBAAmB;EACnB,uBAAuB;EACvB,YAAY;EACZ,wBAAwB;AAC1B;AACA;EACE,aAAa;EACb,eAAe;EACf,qBAAqB;EACrB,mBAAmB;EACnB,qBAAqB;EACrB,mBAAmB;EACnB,uBAAuB;EACvB,YAAY;EACZ,wBAAwB;AAC1B;AACA;EACE,aAAa;EACb,eAAe;EACf,qBAAqB;EACrB,mBAAmB;EACnB,qBAAqB;EACrB,mBAAmB;EACnB,uBAAuB;EACvB,YAAY;EACZ,wBAAwB;AAC1B;AACA;EACE,aAAa;EACb,eAAe;EACf,qBAAqB;EACrB,mBAAmB;EACnB,qBAAqB;EACrB,mBAAmB;EACnB,uBAAuB;EACvB,YAAY;EACZ,wBAAwB;AAC1B","file":"MathND.vue","sourcesContent":[".theme-logo {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-menu {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-find {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-tocs {\n  background-color: black;\n  font-size: 2.5rem;\n}\n.theme-view {\n  font-size: 1.5rem;\n}\n.theme-side {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-pref {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-foot {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-trak {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-prac {\n  background-color: #603;\n  font-size: 2rem;\n}\n.theme-icon {\n  background-color: #333;\n  border-radius: 36px;\n  width: 80%;\n  height: 90%;\n}\n.comp {\n  background-color: black;\n  position: absolute;\n  left: 0;\n  top: 5%;\n  right: 0;\n  bottom: 0;\n  font-size: 2.5rem;\n  display: grid;\n  grid-template-columns: 33fr 33fr 34fr;\n  grid-template-rows: 11fr 11fr 11fr 11fr 11fr 11fr 11fr 11fr 12fr;\n  grid-template-areas: \"r1c1 r1c2 r1c3\" \"r2c1 r2c2 r2c3\" \"r3c1 r3c2 r3c3\" \"r4c1 r4c2 r4c3\" \"r5c1 r5c2 r5c3\" \"r6c1 r6c2 r6c3\" \"r7c1 r7c2 r7c3\" \"r8c1 r8c2 r8c3\" \"r9c1 r9c2 r9c3\";\n  justify-items: center;\n  align-items: center;\n}\n.comp .r1c1 {\n  display: grid;\n  grid-area: r1c1;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n  background-color: black;\n  color: wheat;\n  border: solid thin wheat;\n}\n.comp .r1c2 {\n  display: grid;\n  grid-area: r1c2;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n  background-color: black;\n  color: wheat;\n  border: solid thin wheat;\n}\n.comp .r1c3 {\n  display: grid;\n  grid-area: r1c3;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n  background-color: black;\n  color: wheat;\n  border: solid thin wheat;\n}\n.comp .r2c1 {\n  display: grid;\n  grid-area: r2c1;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n  background-color: black;\n  color: wheat;\n  border: solid thin wheat;\n}\n.comp .r2c2 {\n  display: grid;\n  grid-area: r2c2;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n  background-color: black;\n  color: wheat;\n  border: solid thin wheat;\n}\n.comp .r2c3 {\n  display: grid;\n  grid-area: r2c3;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n  background-color: black;\n  color: wheat;\n  border: solid thin wheat;\n}\n.comp .r3c1 {\n  display: grid;\n  grid-area: r3c1;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n  background-color: black;\n  color: wheat;\n  border: solid thin wheat;\n}\n.comp .r3c2 {\n  display: grid;\n  grid-area: r3c2;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n  background-color: black;\n  color: wheat;\n  border: solid thin wheat;\n}\n.comp .r3c3 {\n  display: grid;\n  grid-area: r3c3;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n  background-color: black;\n  color: wheat;\n  border: solid thin wheat;\n}\n.comp .r4c1 {\n  display: grid;\n  grid-area: r4c1;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n  background-color: black;\n  color: wheat;\n  border: solid thin wheat;\n}\n.comp .r4c2 {\n  display: grid;\n  grid-area: r4c2;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n  background-color: black;\n  color: wheat;\n  border: solid thin wheat;\n}\n.comp .r4c3 {\n  display: grid;\n  grid-area: r4c3;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n  background-color: black;\n  color: wheat;\n  border: solid thin wheat;\n}\n.comp .r5c1 {\n  display: grid;\n  grid-area: r5c1;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n  background-color: black;\n  color: wheat;\n  border: solid thin wheat;\n}\n.comp .r5c2 {\n  display: grid;\n  grid-area: r5c2;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n  background-color: black;\n  color: wheat;\n  border: solid thin wheat;\n}\n.comp .r5c3 {\n  display: grid;\n  grid-area: r5c3;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n  background-color: black;\n  color: wheat;\n  border: solid thin wheat;\n}\n.comp .r6c1 {\n  display: grid;\n  grid-area: r6c1;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n  background-color: black;\n  color: wheat;\n  border: solid thin wheat;\n}\n.comp .r6c2 {\n  display: grid;\n  grid-area: r6c2;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n  background-color: black;\n  color: wheat;\n  border: solid thin wheat;\n}\n.comp .r6c3 {\n  display: grid;\n  grid-area: r6c3;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n  background-color: black;\n  color: wheat;\n  border: solid thin wheat;\n}\n.comp .r7c1 {\n  display: grid;\n  grid-area: r7c1;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n  background-color: black;\n  color: wheat;\n  border: solid thin wheat;\n}\n.comp .r7c2 {\n  display: grid;\n  grid-area: r7c2;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n  background-color: black;\n  color: wheat;\n  border: solid thin wheat;\n}\n.comp .r7c3 {\n  display: grid;\n  grid-area: r7c3;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n  background-color: black;\n  color: wheat;\n  border: solid thin wheat;\n}\n.comp .r8c1 {\n  display: grid;\n  grid-area: r8c1;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n  background-color: black;\n  color: wheat;\n  border: solid thin wheat;\n}\n.comp .r8c2 {\n  display: grid;\n  grid-area: r8c2;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n  background-color: black;\n  color: wheat;\n  border: solid thin wheat;\n}\n.comp .r8c3 {\n  display: grid;\n  grid-area: r8c3;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n  background-color: black;\n  color: wheat;\n  border: solid thin wheat;\n}\n.comp .r9c1 {\n  display: grid;\n  grid-area: r9c1;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n  background-color: black;\n  color: wheat;\n  border: solid thin wheat;\n}\n.comp .r9c2 {\n  display: grid;\n  grid-area: r9c2;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n  background-color: black;\n  color: wheat;\n  border: solid thin wheat;\n}\n.comp .r9c3 {\n  display: grid;\n  grid-area: r9c3;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n  background-color: black;\n  color: wheat;\n  border: solid thin wheat;\n}\n","\n\n<template>\n  <div>\n    <d-dabs comp=\"Math\" :pages=\"pages\" :init=\"key\"></d-dabs>\n    <div class=\"comp\">\n      <template v-for=\"exp in exps\">\n        <div :class=\"exp.klass\" :ref=\"exp.klass\"></div>\n      </template>\n    </div>\n  </div>\n</template>\n\n<script type=\"module\">\n\n  import Dabs  from '../elem/Dabs.vue';\n\n  let MathND = {\n\n    components:{ 'd-dabs':Dabs },\n\n    methods: {\n\n      isPage: function(key) {\n        return this.key === key; },\n\n      onTabs: function(key) {\n        if( this.pages[key] ) {\n          this.key = key;\n          this.create(this.key);\n          this.mathML(this.exps); } },\n\n      create: function( key ) {\n        let page = this.pages[key];\n        if( page.obj===null ) {\n            page.obj = new page.create(); }\n        let exps = page.obj.math();\n        let i    = 0;\n        for( let key in exps ) {\n          let exp   = exps[key];\n          exp.klass = this.klass(i);\n          i++; }\n        this.exps = exps; },\n\n      mathML: function ( exps ) {\n        this.$nextTick( function() { // Wait for DOM to render\n          for( let key in exps ){\n            let exp  = exps[key];\n            let elem = this.$refs[exp.klass][0];\n              elem.innerHTML = exp.mathML; } } ) },\n\n    // Generate a row column layout class\n    klass: function( i ) {\n      let ncol = 3;\n      let mod  = i       % ncol;\n      let row  = (i-mod) / ncol + 1;\n      let col  = mod + 1;\n      return `r${row}c${col}`; }\n    },\n\n    mounted: function () {\n      this.subscribe( 'Math', this.comp+'.vue', (key) => {\n        if( typeof(key)==='string' ) {\n          this.onTabs( key ); } } );\n      this.onTabs( this.key ); }\n  }\n  \nexport default MathND;\n\n</script>\n\n<style lang=\"less\">\n  \n  @import '../../pub/css/themes/theme.less';\n  \n  .grid9x3() { display:grid; grid-template-columns:33fr 33fr 34fr; grid-template-rows:11fr 11fr 11fr 11fr 11fr 11fr 11fr 11fr 12fr;\n    grid-template-areas:\n      \"r1c1 r1c2 r1c3\" \"r2c1 r2c2 r2c3\" \"r3c1 r3c2 r3c3\"\n      \"r4c1 r4c2 r4c3\" \"r5c1 r5c2 r5c3\" \"r6c1 r6c2 r6c3\"\n      \"r7c1 r7c2 r7c3\" \"r8c1 r8c2 r8c3\" \"r9c1 r9c2 r9c3\"; }\n  \n  .c( @rc ) { display:grid; grid-area:@rc; justify-self:stretch; align-self:stretch;\n    justify-items:center; align-items:center; background-color:@theme-back; color:@theme-color;\n    border:solid thin @theme-color; }\n  \n  .comp { background-color:@theme-back; position:absolute; left:0; top:5%; right:0; bottom:0; font-size:@theme-math-size;\n    .grid9x3(); justify-items:center; align-items:center;\n    \n    .r1c1{.c(r1c1)}; .r1c2{.c(r1c2)}; .r1c3{.c(r1c3)};\n    .r2c1{.c(r2c1)}; .r2c2{.c(r2c2)}; .r2c3{.c(r2c3)};\n    .r3c1{.c(r3c1)}; .r3c2{.c(r3c2)}; .r3c3{.c(r3c3)};\n    .r4c1{.c(r4c1)}; .r4c2{.c(r4c2)}; .r4c3{.c(r4c3)};\n    .r5c1{.c(r5c1)}; .r5c2{.c(r5c2)}; .r5c3{.c(r5c3)};\n    .r6c1{.c(r6c1)}; .r6c2{.c(r6c2)}; .r6c3{.c(r6c3)};\n    .r7c1{.c(r7c1)}; .r7c2{.c(r7c2)}; .r7c3{.c(r7c3)};\n    .r8c1{.c(r8c1)}; .r8c2{.c(r8c2)}; .r8c3{.c(r8c3)};\n    .r9c1{.c(r9c1)}; .r9c2{.c(r9c2)}; .r9c3{.c(r9c3)};\n  }\n\n</style>"]}, media: undefined });

  };
  /* scoped */
  const __vue_scope_id__$1 = undefined;
  /* module identifier */
  const __vue_module_identifier__$1 = undefined;
  /* functional template */
  const __vue_is_functional_template__$1 = false;
  /* style inject SSR */
  

  
  var MathND$1 = normalizeComponent_1(
    { render: __vue_render__$1, staticRenderFns: __vue_staticRenderFns__$1 },
    __vue_inject_styles__$1,
    __vue_script__$1,
    __vue_scope_id__$1,
    __vue_is_functional_template__$1,
    __vue_module_identifier__$1,
    browser,
    undefined
  );

const PAD_VALUE = Symbol('PadValueType');
const _ = Symbol('UnderscoreType');
const TAIL = Symbol('TailType');
const REST = TAIL;


function isValue(x) {
    if (x === null || x === undefined) return true;
    const t = typeof(x);
    return t === 'number' || t === 'string' || t === 'boolean';
}


function isObject(x) {
    return x instanceof Object && !Array.isArray(x) && !isValue(x);
}


function run(action, x) {
    if (isValue(action)) {
        return action;
    }
    else if (action instanceof Function) {
        return action.apply(null, x);
    }
    else {
        throw new MatchError(`Unsupported action type ${typeof(action)} of action ${action}.`)
    }
}


function matchValue(patt, value) {
    if (patt === '_') {
        // Behaves like UnderscoreType
        return [true, [value]];
    }
    else if (patt === PAD_VALUE) {
        return [false, []];
    }
    else if (patt === String) {
        let bool = typeof(value) === 'string' || value instanceof String;
        if (bool) return [bool, [value]];
        else return [false, []];
    }
    else if (patt === Number) {
        let bool = typeof(value) === 'number' || value instanceof Number;
        if (bool) return [bool, [value]];
        else return [false, []];
    }
    else if (patt === Boolean) {
        let bool = typeof(value) === 'boolean' || value instanceof Boolean;
        if (bool) return [bool, [value]];
        else return [false, []];
    }
    else if (patt === Array) {
        if (value instanceof Array) {
            return [true, [value]];
        }
        else return [false, []];
    }
    else if (Array.isArray(patt)) {
        return matchArray(patt, value)
    }
    else if (patt === Function) {
        // console.log(`[${patt}] === Function`);
        try {
            if (value instanceof patt)
                return [true, [value]];
            return [false, []];
        }
        catch (err) {
        }
    }
    else if (isValue(patt)) {
        return [patt === value, []]
    }
    else if (patt instanceof Function) {
        // console.log(`[${patt}] instanceof Function`);
        let ret = patt(value);
        if (ret === true) return [true, [value]];
        else return [false, []];
    }
    else if (patt === _) {
        return [true, [value]];
    }
    else if (isObject(patt)) {
        return matchDict(patt, value);
    }
    else throw new MatchError(`Pattern ${patt} has unsupported type ${typeof(patt)}.`);
    return [false, []];
}


function matchArray(patt, value) {
    if (!(patt instanceof Array) || !(value instanceof Array)) {
        return [false, []];
    }
    let totalExtracted = [];
    const pairs = zipLongest(patt, value);
    for (let i = 0; i < pairs.length; i++) {
        const [pi, vi] = pairs[i];

        if (pi === TAIL) {
            if (!onlyPadValuesFollow(pairs, i + 1)) {
                throw new MatchError("TAIL/REST must be the last element of a pattern.");
            }
            else {
                totalExtracted = totalExtracted.concat([value.slice(i)]);
                break;
            }
        }
        else {
            let [matched, extracted] = matchValue(pi, vi);
            if (!matched) {
                return [false, []];
            }
            else totalExtracted = totalExtracted.concat(extracted);
        }

    }
    return [true, totalExtracted];
}


function keysSet(x) {
    let set = {};
    for (let key in x) {
      if( x.hasOwnProperty(key) ) {
      set[key] = true; } }
    return set;
}

function matchDict(patt, value) {
    if (!isObject(patt) || !isObject(value)) {
        return [false, []];
    }
    let totalExtracted = [];
    let stillUsablePatternKeys = keysSet(patt);
    let stillUsableValueKeys = keysSet(value);
    for (let pkey in patt) {
        if( !patt.hasOwnProperty(pkey) )  continue;
        if (!(pkey in stillUsablePatternKeys)) continue;
        let pval = patt[pkey];
        let matchedLeftAndRight = false;
        for (let vkey in value) {
            if( !value.hasOwnProperty(vkey) )  continue;
            if (!(vkey in stillUsableValueKeys)) continue;
            if (!(pkey in stillUsablePatternKeys)) continue;
            let vval = value[vkey];
            let [keyMatched, keyExtracted] = matchValue(pkey, vkey);
            if (keyMatched) {
                let [valMatched, valExtracted] = matchValue(pval, vval);
                if (valMatched) {
                    delete stillUsablePatternKeys[pkey];
                    delete stillUsableValueKeys[vkey];
                    totalExtracted = totalExtracted.concat(keyExtracted, valExtracted);
                    matchedLeftAndRight = true;
                }
            }
        }
        if (!matchedLeftAndRight)
            return [false, []];
    }
    return [true, totalExtracted];
}

function pairwise(args) {
    let res = [];
    for (let i = 0; i < args.length; i += 2) {
        res.push([args[i], args[i + 1]]);
    }
    return res;
}

function onlyPadValuesFollow(pairs, i) {
    for (; i < pairs.length; i++) {
        if (pairs[i][0] !== PAD_VALUE) {
            return false;
        }
    }
    return true;
}


function matchPairs(x, ...pairs) {
  if (!pairs.every(p => p.length && p.length === 2)) {
    throw new MatchError(
      'Even number of pattern-action pairs. Every pattern should have an action.'
    )
  }

  for (let i = 0; i < pairs.length; i++) {
    let [patt, action] = pairs[i];

    let [matched, extracted] = matchValue(patt, x);
    if (matched) {
      return run(action, extracted)
    }
  }
  throw new MatchError(`No _ provided, case ${x} not handled.`)
}


function match(x) {
    const args = [...arguments].slice(1);
    if (args.length % 2 !== 0) {
        throw new MatchError("Even number of pattern-action pairs. Every pattern should have an action.");
    }

    let pairs = pairwise(args);

    return matchPairs(x, ...pairs)
}

function matchAll(rows) {
    let total = [];
    for (let i = 0; i < rows.length; i++) {
        let row = rows[i];
        let pairs = [...arguments].slice(1);
        let res = match.apply(null, [row].concat(pairs));
        total.push(res);
    }
    return total;
}

function zipLongest(a, b) {
    let maxLen = Math.max(a.length, b.length);
    let res = [];
    for (let i = 0; i < maxLen; i++) {
        let ai = a[i] !== undefined ? a[i] : PAD_VALUE;
        let bi = b[i] !== undefined ? b[i] : PAD_VALUE;
        res.push([ai, bi]);
    }
    return res;
}
/*
class MatchError extends Error {
    constructor(message) {
        super(message);
        this.name = 'MatchError';
    }
}
*/
class MatchError extends Error {
  constructor(message) {
    super();
    //console.error(message);
    this.message = message;
    this.name = 'MatchError';
    if( message === false ) console.log( matchAll, REST );
  }
}

var Latex;

Latex = {
  
  //Greek letters
  alpha: {
    tag: "mi",
    uc: "\u03B1",
    ttype: "const"
  },
  beta: {
    tag: "mi",
    uc: "\u03B2",
    ttype: "const"
  },
  gamma: {
    tag: "mi",
    uc: "\u03B3",
    ttype: "const"
  },
  delta: {
    tag: "mi",
    uc: "\u03B4",
    ttype: "const"
  },
  epsilon: {
    tag: "mi",
    uc: "\u03B5",
    ttype: "const"
  },
  varepsilon: {
    tag: "mi",
    uc: "\u025B",
    ttype: "const"
  },
  zeta: {
    tag: "mi",
    uc: "\u03B6",
    ttype: "const"
  },
  eta: {
    tag: "mi",
    uc: "\u03B7",
    ttype: "const"
  },
  theta: {
    tag: "mi",
    uc: "\u03B8",
    ttype: "const"
  },
  vartheta: {
    tag: "mi",
    uc: "\u03D1",
    ttype: "const"
  },
  iota: {
    tag: "mi",
    uc: "\u03B9",
    ttype: "const"
  },
  kappa: {
    tag: "mi",
    uc: "\u03BA",
    ttype: "const"
  },
  lambda: {
    tag: "mi",
    uc: "\u03BB",
    ttype: "const"
  },
  mu: {
    tag: "mi",
    uc: "\u03BC",
    ttype: "const"
  },
  nu: {
    tag: "mi",
    uc: "\u03BD",
    ttype: "const"
  },
  xi: {
    tag: "mi",
    uc: "\u03BE",
    ttype: "const"
  },
  pi: {
    tag: "mi",
    uc: "\u03C0",
    ttype: "const"
  },
  varpi: {
    tag: "mi",
    uc: "\u03D6",
    ttype: "const"
  },
  rho: {
    tag: "mi",
    uc: "\u03C1",
    ttype: "const"
  },
  varrho: {
    tag: "mi",
    uc: "\u03F1",
    ttype: "const"
  },
  varsigma: {
    tag: "mi",
    uc: "\u03C2",
    ttype: "const"
  },
  sigma: {
    tag: "mi",
    uc: "\u03C3",
    ttype: "const"
  },
  tau: {
    tag: "mi",
    uc: "\u03C4",
    ttype: "const"
  },
  upsilon: {
    tag: "mi",
    uc: "\u03C5",
    ttype: "const"
  },
  phi: {
    tag: "mi",
    uc: "\u03C6",
    ttype: "const"
  },
  varphi: {
    tag: "mi",
    uc: "\u03D5",
    ttype: "const"
  },
  chi: {
    tag: "mi",
    uc: "\u03C7",
    ttype: "const"
  },
  psi: {
    tag: "mi",
    uc: "\u03C8",
    ttype: "const"
  },
  omega: {
    tag: "mi",
    uc: "\u03C9",
    ttype: "const"
  },
  Gamma: {
    tag: "mo",
    uc: "\u0393",
    ttype: "const"
  },
  Delta: {
    tag: "mo",
    uc: "\u0394",
    ttype: "const"
  },
  Theta: {
    tag: "mo",
    uc: "\u0398",
    ttype: "const"
  },
  Lambda: {
    tag: "mo",
    uc: "\u039B",
    ttype: "const"
  },
  Xi: {
    tag: "mo",
    uc: "\u039E",
    ttype: "const"
  },
  Pi: {
    tag: "mo",
    uc: "\u03A0",
    ttype: "const"
  },
  Sigma: {
    tag: "mo",
    uc: "\u03A3",
    ttype: "const"
  },
  Upsilon: {
    tag: "mo",
    uc: "\u03A5",
    ttype: "const"
  },
  Phi: {
    tag: "mo",
    uc: "\u03A6",
    ttype: "const"
  },
  Psi: {
    tag: "mo",
    uc: "\u03A8",
    ttype: "const"
  },
  Omega: {
    tag: "mo",
    uc: "\u03A9",
    ttype: "const"
  },
  
  //fractions
  frac12: {
    tag: "mo",
    uc: "\u00BD",
    ttype: "const"
  },
  frac14: {
    tag: "mo",
    uc: "\u00BC",
    ttype: "const"
  },
  frac34: {
    tag: "mo",
    uc: "\u00BE",
    ttype: "const"
  },
  frac13: {
    tag: "mo",
    uc: "\u2153",
    ttype: "const"
  },
  frac23: {
    tag: "mo",
    uc: "\u2154",
    ttype: "const"
  },
  frac15: {
    tag: "mo",
    uc: "\u2155",
    ttype: "const"
  },
  frac25: {
    tag: "mo",
    uc: "\u2156",
    ttype: "const"
  },
  frac35: {
    tag: "mo",
    uc: "\u2157",
    ttype: "const"
  },
  frac45: {
    tag: "mo",
    uc: "\u2158",
    ttype: "const"
  },
  frac16: {
    tag: "mo",
    uc: "\u2159",
    ttype: "const"
  },
  frac56: {
    tag: "mo",
    uc: "\u215A",
    ttype: "const"
  },
  frac18: {
    tag: "mo",
    uc: "\u215B",
    ttype: "const"
  },
  frac38: {
    tag: "mo",
    uc: "\u215C",
    ttype: "const"
  },
  frac58: {
    tag: "mo",
    uc: "\u215D",
    ttype: "const"
  },
  frac78: {
    tag: "mo",
    uc: "\u215E",
    ttype: "const"
  },
  
  //binary operation symbols
  triangleleft: {
    tag: "mo",
    uc: "\u22B2",
    ttype: "const"
  },
  triangleright: {
    tag: "mo",
    uc: "\u22B3",
    ttype: "const"
  },
  bigtriangleup: {
    tag: "mo",
    uc: "\u25B3",
    ttype: "const"
  },
  bigtriangledown: {
    tag: "mo",
    uc: "\u25BD",
    ttype: "const"
  },
  pm: {
    tag: "mo",
    uc: "\u00B1",
    ttype: "const"
  },
  mp: {
    tag: "mo",
    uc: "\u2213",
    ttype: "const"
  },
  cdot: {
    tag: "mo",
    uc: "\u22C5",
    ttype: "const"
  },
  star: {
    tag: "mo",
    uc: "\u22C6",
    ttype: "const"
  },
  ast: {
    tag: "mo",
    uc: "\u002A",
    ttype: "const"
  },
  times: {
    tag: "mo",
    uc: "\u00D7",
    ttype: "const"
  },
  div: {
    tag: "mo",
    uc: "\u00F7",
    ttype: "const"
  },
  circ: {
    tag: "mo",
    uc: "\u2218",
    ttype: "const"
  },
  bullet: {
    tag: "mo",
    uc: "\u2022",
    ttype: "const"
  },
  oplus: {
    tag: "mo",
    uc: "\u2295",
    ttype: "const"
  },
  ominus: {
    tag: "mo",
    uc: "\u2296",
    ttype: "const"
  },
  otimes: {
    tag: "mo",
    uc: "\u2297",
    ttype: "const"
  },
  bigcirc: {
    tag: "mo",
    uc: "\u25CB",
    ttype: "const"
  },
  oslash: {
    tag: "mo",
    uc: "\u2298",
    ttype: "const"
  },
  odot: {
    tag: "mo",
    uc: "\u2299",
    ttype: "const"
  },
  land: {
    tag: "mo",
    uc: "\u2227",
    ttype: "const"
  },
  wedge: {
    tag: "mo",
    uc: "\u2227",
    ttype: "const"
  },
  lor: {
    tag: "mo",
    uc: "\u2228",
    ttype: "const"
  },
  vee: {
    tag: "mo",
    uc: "\u2228",
    ttype: "const"
  },
  cap: {
    tag: "mo",
    uc: "\u2229",
    ttype: "const"
  },
  cup: {
    tag: "mo",
    uc: "\u222A",
    ttype: "const"
  },
  sqcap: {
    tag: "mo",
    uc: "\u2293",
    ttype: "const"
  },
  sqcup: {
    tag: "mo",
    uc: "\u2294",
    ttype: "const"
  },
  uplus: {
    tag: "mo",
    uc: "\u228E",
    ttype: "const"
  },
  amalg: {
    tag: "mo",
    uc: "\u2210",
    ttype: "const"
  },
  dag: {
    tag: "mo",
    uc: "\u2020",
    ttype: "const"
  },
  dagger: {
    tag: "mo",
    uc: "\u2020",
    ttype: "const"
  },
  ddag: {
    tag: "mo",
    uc: "\u2021",
    ttype: "const"
  },
  ddagger: {
    tag: "mo",
    uc: "\u2021",
    ttype: "const"
  },
  lhd: {
    tag: "mo",
    uc: "\u22B2",
    ttype: "const"
  },
  rhd: {
    tag: "mo",
    uc: "\u22B3",
    ttype: "const"
  },
  unlhd: {
    tag: "mo",
    uc: "\u22B4",
    ttype: "const"
  },
  unrhd: {
    tag: "mo",
    uc: "\u22B5",
    ttype: "const"
  },
  
  //"big" Operators
  sum: {
    tag: "mo",
    uc: "\u2211",
    ttype: "underover"
  },
  prod: {
    tag: "mo",
    uc: "\u220F",
    ttype: "underover"
  },
  bigcap: {
    tag: "mo",
    uc: "\u22C2",
    ttype: "underover"
  },
  bigcup: {
    tag: "mo",
    uc: "\u22C3",
    ttype: "underover"
  },
  bigwedge: {
    tag: "mo",
    uc: "\u22C0",
    ttype: "underover"
  },
  bigvee: {
    tag: "mo",
    uc: "\u22C1",
    ttype: "underover"
  },
  bigsqcap: {
    tag: "mo",
    uc: "\u2A05",
    ttype: "underover"
  },
  bigsqcup: {
    tag: "mo",
    uc: "\u2A06",
    ttype: "underover"
  },
  coprod: {
    tag: "mo",
    uc: "\u2210",
    ttype: "underover"
  },
  bigoplus: {
    tag: "mo",
    uc: "\u2A01",
    ttype: "underover"
  },
  bigotimes: {
    tag: "mo",
    uc: "\u2A02",
    ttype: "underover"
  },
  bigodot: {
    tag: "mo",
    uc: "\u2A00",
    ttype: "underover"
  },
  biguplus: {
    tag: "mo",
    uc: "\u2A04",
    ttype: "underover"
  },
  int: {
    tag: "mo",
    uc: "\u222B",
    ttype: "const"
  },
  oint: {
    tag: "mo",
    uc: "\u222E",
    ttype: "const"
  },
  
  //binary relation symbols
  lt: {
    tag: "mo",
    uc: "<",
    ttype: "const"
  },
  gt: {
    tag: "mo",
    uc: ">",
    ttype: "const"
  },
  ne: {
    tag: "mo",
    uc: "\u2260",
    ttype: "const"
  },
  neq: {
    tag: "mo",
    uc: "\u2260",
    ttype: "const"
  },
  le: {
    tag: "mo",
    uc: "\u2264",
    ttype: "const"
  },
  leq: {
    tag: "mo",
    uc: "\u2264",
    ttype: "const"
  },
  leqslant: {
    tag: "mo",
    uc: "\u2264",
    ttype: "const"
  },
  ge: {
    tag: "mo",
    uc: "\u2265",
    ttype: "const"
  },
  geq: {
    tag: "mo",
    uc: "\u2265",
    ttype: "const"
  },
  geqslant: {
    tag: "mo",
    uc: "\u2265",
    ttype: "const"
  },
  equiv: {
    tag: "mo",
    uc: "\u2261",
    ttype: "const"
  },
  ll: {
    tag: "mo",
    uc: "\u226A",
    ttype: "const"
  },
  gg: {
    tag: "mo",
    uc: "\u226B",
    ttype: "const"
  },
  doteq: {
    tag: "mo",
    uc: "\u2250",
    ttype: "const"
  },
  prec: {
    tag: "mo",
    uc: "\u227A",
    ttype: "const"
  },
  succ: {
    tag: "mo",
    uc: "\u227B",
    ttype: "const"
  },
  preceq: {
    tag: "mo",
    uc: "\u227C",
    ttype: "const"
  },
  succeq: {
    tag: "mo",
    uc: "\u227D",
    ttype: "const"
  },
  subset: {
    tag: "mo",
    uc: "\u2282",
    ttype: "const"
  },
  supset: {
    tag: "mo",
    uc: "\u2283",
    ttype: "const"
  },
  subseteq: {
    tag: "mo",
    uc: "\u2286",
    ttype: "const"
  },
  supseteq: {
    tag: "mo",
    uc: "\u2287",
    ttype: "const"
  },
  sqsubset: {
    tag: "mo",
    uc: "\u228F",
    ttype: "const"
  },
  sqsupset: {
    tag: "mo",
    uc: "\u2290",
    ttype: "const"
  },
  sqsubseteq: {
    tag: "mo",
    uc: "\u2291",
    ttype: "const"
  },
  sqsupseteq: {
    tag: "mo",
    uc: "\u2292",
    ttype: "const"
  },
  sim: {
    tag: "mo",
    uc: "\u223C",
    ttype: "const"
  },
  simeq: {
    tag: "mo",
    uc: "\u2243",
    ttype: "const"
  },
  approx: {
    tag: "mo",
    uc: "\u2248",
    ttype: "const"
  },
  cong: {
    tag: "mo",
    uc: "\u2245",
    ttype: "const"
  },
  Join: {
    tag: "mo",
    uc: "\u22C8",
    ttype: "const"
  },
  bowtie: {
    tag: "mo",
    uc: "\u22C8",
    ttype: "const"
  },
  in: {
    tag: "mo",
    uc: "\u2208",
    ttype: "const"
  },
  ni: {
    tag: "mo",
    uc: "\u220B",
    ttype: "const"
  },
  owns: {
    tag: "mo",
    uc: "\u220B",
    ttype: "const"
  },
  propto: {
    tag: "mo",
    uc: "\u221D",
    ttype: "const"
  },
  vdash: {
    tag: "mo",
    uc: "\u22A2",
    ttype: "const"
  },
  dashv: {
    tag: "mo",
    uc: "\u22A3",
    ttype: "const"
  },
  models: {
    tag: "mo",
    uc: "\u22A8",
    ttype: "const"
  },
  perp: {
    tag: "mo",
    uc: "\u22A5",
    ttype: "const"
  },
  smile: {
    tag: "mo",
    uc: "\u2323",
    ttype: "const"
  },
  frown: {
    tag: "mo",
    uc: "\u2322",
    ttype: "const"
  },
  asymp: {
    tag: "mo",
    uc: "\u224D",
    ttype: "const"
  },
  notin: {
    tag: "mo",
    uc: "\u2209",
    ttype: "const"
  },
  
  //matrices
  begineq: {
    input: "\\begin{eqnarray}",
    uc: "X",
    ttype: "matrix",
    invisible: true
  },
  begin: {
    input: "\\begin{array}",
    uc: "X",
    ttype: "matrix",
    invisible: true
  },
  endeq: {
    input: "\\end{eqnarray}",
    uc: " }}",
    ttype: "definition"
  },
  end: {
    input: "\\end{array}",
    uc: " }}",
    ttype: "definition"
  },
  
  //grouping and literal brackets -- ieval is for IE
  big: {
    tag: "mo",
    uc: "X",
    atval: "1.2",
    ieval: "2.2",
    ttype: "big"
  },
  Big: {
    tag: "mo",
    uc: "X",
    atval: "1.6",
    ieval: "2.6",
    ttype: "big"
  },
  bigg: {
    tag: "mo",
    uc: "X",
    atval: "2.2",
    ieval: "3.2",
    ttype: "big"
  },
  Bigg: {
    tag: "mo",
    uc: "X",
    atval: "2.9",
    ieval: "3.9",
    ttype: "big"
  },
  left: {
    tag: "mo",
    uc: "X",
    ttype: "leftbracket"
  },
  right: {
    tag: "mo",
    uc: "X",
    ttype: "rightbracket"
  },
  leftbracket: {
    uc: "{",
    ttype: "leftbracket",
    invisible: true
  },
  rightbracket: {
    uc: " }",
    ttype: "rightbracket",
    invisible: true
  },
  lbrack: {
    tag: "mo",
    uc: "[",
    atval: "1",
    ttype: "stretchy"
  },
  lbrace: {
    tag: "mo",
    uc: "{",
    atval: "1",
    ttype: "stretchy"
  },
  langle: {
    tag: "mo",
    uc: "\u2329",
    atval: "1",
    ttype: "stretchy"
  },
  lfloor: {
    tag: "mo",
    uc: "\u230A",
    atval: "1",
    ttype: "stretchy"
  },
  lceil: {
    tag: "mo",
    uc: "\u2308",
    atval: "1",
    ttype: "stretchy"
  },
  
  // rtag:"mi" causes space to be inserted before a following sin, cos, etc.
  // (see function LMparseExpr() )
  rbrack: {
    tag: "mo",
    uc: "]",
    rtag: "mi",
    atval: "1",
    ttype: "stretchy"
  },
  rbrace: {
    tag: "mo",
    uc: " }",
    rtag: "mi",
    atval: "1",
    ttype: "stretchy"
  },
  rangle: {
    tag: "mo",
    uc: "\u232A",
    rtag: "mi",
    atval: "1",
    ttype: "stretchy"
  },
  rfloor: {
    tag: "mo",
    uc: "\u230B",
    rtag: "mi",
    atval: "1",
    ttype: "stretchy"
  },
  rceil: {
    tag: "mo",
    uc: "\u2309",
    rtag: "mi",
    atval: "1",
    ttype: "stretchy"
  },
  
  // "|", "\\|", "\\vert" and "\\Vert" modified later: lspace = rspace = 0em
  vert: {
    tag: "mo",
    uc: "\u2223",
    atval: "1",
    ttype: "stretchy"
  },
  Vert: {
    tag: "mo",
    uc: "\u2225",
    atval: "1",
    ttype: "stretchy"
  },
  mid: {
    tag: "mo",
    uc: "\u2223",
    atval: "1",
    ttype: "stretchy"
  },
  parallel: {
    tag: "mo",
    uc: "\u2225",
    atval: "1",
    ttype: "stretchy"
  },
  backslash: {
    tag: "mo",
    uc: "\u2216",
    atval: "1",
    ttype: "stretchy"
  },
  setminus: {
    tag: "mo",
    uc: "\\",
    ttype: "const"
  },
  
  //miscellaneous symbols
  quad: {
    tag: "mspace",
    atname: "width",
    atval: "1em",
    ttype: "space"
  },
  qquad: {
    tag: "mspace",
    atname: "width",
    atval: "2em",
    ttype: "space"
  },
  prime: {
    tag: "mo",
    uc: "\u2032",
    ttype: "const"
  },
  ldots: {
    tag: "mo",
    uc: "\u2026",
    ttype: "const"
  },
  cdots: {
    tag: "mo",
    uc: "\u22EF",
    ttype: "const"
  },
  vdots: {
    tag: "mo",
    uc: "\u22EE",
    ttype: "const"
  },
  ddots: {
    tag: "mo",
    uc: "\u22F1",
    ttype: "const"
  },
  forall: {
    tag: "mo",
    uc: "\u2200",
    ttype: "const"
  },
  exists: {
    tag: "mo",
    uc: "\u2203",
    ttype: "const"
  },
  Re: {
    tag: "mo",
    uc: "\u211C",
    ttype: "const"
  },
  Im: {
    tag: "mo",
    uc: "\u2111",
    ttype: "const"
  },
  aleph: {
    tag: "mo",
    uc: "\u2135",
    ttype: "const"
  },
  hbar: {
    tag: "mo",
    uc: "\u210F",
    ttype: "const"
  },
  ell: {
    tag: "mo",
    uc: "\u2113",
    ttype: "const"
  },
  wp: {
    tag: "mo",
    uc: "\u2118",
    ttype: "const"
  },
  emptyset: {
    tag: "mo",
    uc: "\u2205",
    ttype: "const"
  },
  oo: {
    tag: "mo",
    uc: "\u221E",
    ttype: "const"
  },
  infty: {
    tag: "mo",
    uc: "\u221E",
    ttype: "const"
  },
  surd: {
    tag: "mo",
    uc: "\u221A",
    ttype: "definition"
  },
  partial: {
    tag: "mo",
    uc: "\u2202",
    ttype: "const"
  },
  nabla: {
    tag: "mo",
    uc: "\u2207",
    ttype: "const"
  },
  triangle: {
    tag: "mo",
    uc: "\u25B3",
    ttype: "const"
  },
  therefore: {
    tag: "mo",
    uc: "\u2234",
    ttype: "const"
  },
  angle: {
    tag: "mo",
    uc: "\u2220",
    ttype: "const"
  },
  diamond: {
    tag: "mo",
    uc: "\u22C4",
    ttype: "const"
  },
  Diamond: {
    tag: "mo",
    uc: "\u25C7",
    ttype: "const"
  },
  neg: {
    tag: "mo",
    uc: "\u00AC",
    ttype: "const"
  },
  lnot: {
    tag: "mo",
    uc: "\u00AC",
    ttype: "const"
  },
  bot: {
    tag: "mo",
    uc: "\u22A5",
    ttype: "const"
  },
  top: {
    tag: "mo",
    uc: "\u22A4",
    ttype: "const"
  },
  square: {
    tag: "mo",
    uc: "\u25AB",
    ttype: "const"
  },
  Box: {
    tag: "mo",
    uc: "\u25A1",
    ttype: "const"
  },
  wr: {
    tag: "mo",
    uc: "\u2240",
    ttype: "const"
  },
  
  // standard functions
  // Note "underover" *must* have tag:"mo" to work properly
  arccos: {
    tag: "mi",
    uc: "arccos",
    ttype: "unary",
    func: true
  },
  arcsin: {
    tag: "mi",
    uc: "arcsin",
    ttype: "unary",
    func: true
  },
  arctan: {
    tag: "mi",
    uc: "arctan",
    ttype: "unary",
    func: true
  },
  arg: {
    tag: "mi",
    uc: "arg",
    ttype: "unary",
    func: true
  },
  cos: {
    tag: "mi",
    uc: "cos",
    ttype: "unary",
    func: true
  },
  cosh: {
    tag: "mi",
    uc: "cosh",
    ttype: "unary",
    func: true
  },
  cot: {
    tag: "mi",
    uc: "cot",
    ttype: "unary",
    func: true
  },
  coth: {
    tag: "mi",
    uc: "coth",
    ttype: "unary",
    func: true
  },
  csc: {
    tag: "mi",
    uc: "csc",
    ttype: "unary",
    func: true
  },
  deg: {
    tag: "mi",
    uc: "deg",
    ttype: "unary",
    func: true
  },
  det: {
    tag: "mi",
    uc: "det",
    ttype: "unary",
    func: true
  },
  dim: {
    tag: "mi",
    uc: "dim",
    ttype: "unary",
    func: true // "const"?
  },
  exp: {
    tag: "mi",
    uc: "exp",
    ttype: "unary",
    func: true
  },
  gcd: {
    tag: "mi",
    uc: "gcd",
    ttype: "unary",
    func: true // "const"?
  },
  hom: {
    tag: "mi",
    uc: "hom",
    ttype: "unary",
    func: true
  },
  inf: {
    tag: "mo",
    uc: "inf",
    ttype: "underover"
  },
  ker: {
    tag: "mi",
    uc: "ker",
    ttype: "unary",
    func: true
  },
  lg: {
    tag: "mi",
    uc: "lg",
    ttype: "unary",
    func: true
  },
  lim: {
    tag: "mo",
    uc: "lim",
    ttype: "underover"
  },
  liminf: {
    tag: "mo",
    uc: "liminf",
    ttype: "underover"
  },
  limsup: {
    tag: "mo",
    uc: "limsup",
    ttype: "underover"
  },
  ln: {
    tag: "mi",
    uc: "ln",
    ttype: "unary",
    func: true
  },
  log: {
    tag: "mi",
    uc: "log",
    ttype: "unary",
    func: true
  },
  max: {
    tag: "mo",
    uc: "max",
    ttype: "underover"
  },
  min: {
    tag: "mo",
    uc: "min",
    ttype: "underover"
  },
  Pr: {
    tag: "mi",
    uc: "Pr",
    ttype: "unary",
    func: true
  },
  sec: {
    tag: "mi",
    uc: "sec",
    ttype: "unary",
    func: true
  },
  sin: {
    tag: "mi",
    uc: "sin",
    ttype: "unary",
    func: true
  },
  sinh: {
    tag: "mi",
    uc: "sinh",
    ttype: "unary",
    func: true
  },
  sup: {
    tag: "mo",
    uc: "sup",
    ttype: "underover"
  },
  tan: {
    tag: "mi",
    uc: "tan",
    ttype: "unary",
    func: true
  },
  tanh: {
    tag: "mi",
    uc: "tanh",
    ttype: "unary",
    func: true
  },
  
  // arrows
  gets: {
    tag: "mo",
    uc: "\u2190",
    ttype: "const"
  },
  leftarrow: {
    tag: "mo",
    uc: "\u2190",
    ttype: "const"
  },
  to: {
    tag: "mo",
    uc: "\u2192",
    ttype: "const"
  },
  rightarrow: {
    tag: "mo",
    uc: "\u2192",
    ttype: "const"
  },
  leftrightarrow: {
    tag: "mo",
    uc: "\u2194",
    ttype: "const"
  },
  uparrow: {
    tag: "mo",
    uc: "\u2191",
    ttype: "const"
  },
  downarrow: {
    tag: "mo",
    uc: "\u2193",
    ttype: "const"
  },
  updownarrow: {
    tag: "mo",
    uc: "\u2195",
    ttype: "const"
  },
  Leftarrow: {
    tag: "mo",
    uc: "\u21D0",
    ttype: "const"
  },
  Rightarrow: {
    tag: "mo",
    uc: "\u21D2",
    ttype: "const"
  },
  Leftrightarrow: {
    tag: "mo",
    uc: "\u21D4",
    ttype: "const"
  },
  Uparrow: {
    tag: "mo",
    uc: "\u21D1",
    ttype: "const"
  },
  Downarrow: {
    tag: "mo",
    uc: "\u21D3",
    ttype: "const"
  },
  Updownarrow: {
    tag: "mo",
    uc: "\u21D5",
    ttype: "const"
  },
  mapsto: {
    tag: "mo",
    uc: "\u21A6",
    ttype: "const"
  },
  longleftarrow: {
    tag: "mo",
    uc: "\u2190",
    ttype: "long"
  },
  longrightarrow: {
    tag: "mo",
    uc: "\u2192",
    ttype: "long"
  },
  longleftrightarrow: {
    tag: "mo",
    uc: "\u2194",
    ttype: "long"
  },
  Longleftarrow: {
    tag: "mo",
    uc: "\u21D0",
    ttype: "long"
  },
  Longrightarrow: {
    tag: "mo",
    uc: "\u21D2",
    ttype: "long"
  },
  Longleftrightarrow: {
    tag: "mo",
    uc: "\u21D4",
    ttype: "long"
  },
  longmapsto: {
    tag: "mo",
    uc: "\u21A6",
    ttype: "const"
  },
  iff: {
    tag: "mo",
    uc: "~\\Longleftrightarrow~",
    ttype: "definition"
  },
  //  disaster if "long"

  // commands with argument
  // LMsqrt, LMroot, LMfrac, LMover, LMsub, LMsup, LMtext, LMmbox, LMatop, LMchoose,
  // LMdiv, LMquote,

  // diacritical marks
  acute: {
    tag: "mover",
    uc: "\u00B4",
    ttype: "unary",
    acc: true
  },
  grave: {
    tag: "mover",
    uc: "\u0060",
    ttype: "unary",
    acc: true
  },
  breve: {
    tag: "mover",
    uc: "\u02D8",
    ttype: "unary",
    acc: true
  },
  check: {
    tag: "mover",
    uc: "\u02C7",
    ttype: "unary",
    acc: true
  },
  dot: {
    tag: "mover",
    uc: ".",
    ttype: "unary",
    acc: true
  },
  ddot: {
    tag: "mover",
    uc: "..",
    ttype: "unary",
    acc: true
  },
  mathring: {
    tag: "mover",
    uc: "\u00B0",
    ttype: "unary",
    acc: true
  },
  vec: {
    tag: "mover",
    uc: "\u20D7",
    ttype: "unary",
    acc: true
  },
  overrightarrow: {
    tag: "mover",
    uc: "\u20D7",
    ttype: "unary",
    acc: true
  },
  overleftarrow: {
    tag: "mover",
    uc: "\u20D6",
    ttype: "unary",
    acc: true
  },
  hat: {
    tag: "mover",
    uc: "\u005E",
    ttype: "unary",
    acc: true
  },
  widehat: {
    tag: "mover",
    uc: "\u0302",
    ttype: "unary",
    acc: true
  },
  tilde: {
    tag: "mover",
    uc: "~",
    ttype: "unary",
    acc: true
  },
  widetilde: {
    tag: "mover",
    uc: "\u02DC",
    ttype: "unary",
    acc: true
  },
  bar: {
    tag: "mover",
    uc: "\u203E",
    ttype: "unary",
    acc: true
  },
  overbrace: {
    tag: "mover",
    uc: "\u23B4",
    ttype: "unary",
    acc: true
  },
  overline: {
    tag: "mover",
    uc: "\u00AF",
    ttype: "unary",
    acc: true
  },
  underbrace: {
    tag: "munder",
    uc: "\u23B5",
    ttype: "unary",
    acc: true
  },
  underline: {
    tag: "munder",
    uc: "\u00AF",
    ttype: "unary",
    acc: true
  },
  
  // typestyles and fonts
  displaystyle: {
    tag: "mstyle",
    atname: "displaystyle",
    atval: "true",
    ttype: "unary"
  },
  textstyle: {
    tag: "mstyle",
    atname: "displaystyle",
    atval: "false",
    ttype: "unary"
  },
  scriptstyle: {
    tag: "mstyle",
    atname: "scriptlevel",
    atval: "1",
    ttype: "unary"
  },
  scriptscriptstyle: {
    tag: "mstyle",
    atname: "scriptlevel",
    atval: "2",
    ttype: "unary"
  },
  textrm: {
    tag: "mstyle",
    uc: "\\mathrm",
    ttype: "definition"
  },
  mathbf: {
    tag: "mstyle",
    atname: "mathvariant",
    atval: "bold",
    ttype: "unary"
  },
  textbf: {
    tag: "mstyle",
    atname: "mathvariant",
    atval: "bold",
    ttype: "unary"
  },
  mathit: {
    tag: "mstyle",
    atname: "mathvariant",
    atval: "italic",
    ttype: "unary"
  },
  textit: {
    tag: "mstyle",
    atname: "mathvariant",
    atval: "italic",
    ttype: "unary"
  },
  mathtt: {
    tag: "mstyle",
    atname: "mathvariant",
    atval: "monospace",
    ttype: "unary"
  },
  texttt: {
    tag: "mstyle",
    atname: "mathvariant",
    atval: "monospace",
    ttype: "unary"
  },
  mathsf: {
    tag: "mstyle",
    atname: "mathvariant",
    atval: "sans-serif",
    ttype: "unary"
  },
  mathbb: {
    tag: "mstyle",
    atname: "mathvariant",
    atval: "double-struck",
    ttype: "unary",
    codes: "LMbbb"
  },
  mathcal: {
    tag: "mstyle",
    atname: "mathvariant",
    atval: "script",
    ttype: "unary",
    codes: "LMcal"
  },
  mathfrak: {
    tag: "mstyle",
    atname: "mathvariant",
    atval: "fraktur",
    ttype: "unary",
    codes: "LMfrk"
  }
};

var Latex$1 = Latex;

var Adt;

Adt = class Adt {
  // Geometric Algerbra
  static Dot(u, v) {
    return u(~v); // Dot product
  }

  static Wedge(u, v) {
    return u ^ v; // Wedge outer generalisze cross product
  }

  static Vee(u, v) {
    return u & v; // Meet or join
  }

  static Dual(u) {
    return u; // Dual
  }

  static Inverse(u) {
    return u; // Inverse
  }

  static Conjugate(u) {
    return u; // Conjugate
  }

  static Reverse(u) {
    return u; // Reverse
  }

  static Involute(u) {
    return u; // Involute
  }

  static Rotor(u) {
    return u; // Rotor
  }

  static Magnitude(u) {
    return u; // Magnitude
  }

  static Grade(u) {
    return u; // Grade
  }

  static Reflect(u, v) {
    return u * v * conjugate(u);
  }

  static Rotate(u, v) {
    return u * v * conjugate(u);
  }

  static GP(u, v) {
    return Adt.Dot(u, v) + Adt.Wedge(u, v); // Geometric Product
  }

  
  // Vector, Matrix, Numbers and Variables
  static Vec(f, rest) {
    return f(rest);
  }

  static Mat(f, rest) {
    return f(rest);
  }

  static Ratio(u, v) {
    return u / v;
  }

  // Arithmetic
  static Equ(u, v) {
    return u = v;
  }

  static Add(u, v) {
    return u + v;
  }

  static Sub(u, v) {
    return u - v;
  }

  static Mul(u, v) {
    return u * v;
  }

  static Div(u, v) {
    return u / v;
  }

  static Pow(u, v) {
    return u ** v;
  }

  // Unary operator high precendence
  static Neg(u) {
    return -u;
  }

  static Recip(u) {
    return 1 / u;
  }

  static Abs(u) {
    return Math.abs(u);
  }

  // Parenthesis Braces Object Array
  static Paren(u) {
    return u;
  }

  static Brace(u) {
    return {u};
  }

  // Natural Log, Log Base, Root, Square Root and e
  static Ln(u) {
    return Math.log(u); // ln(u)
  }

  static Log(u, b) {
    return Math.log(u) / Math.log(b); // log_b(u)
  }

  static Root(u, r) {
    return Math.pow(u, 1 / r); // root_b(u)
  }

  static Sqrt(u) {
    return Math.sqrt(u); // sqrt(u)
  }

  static E(u) {
    return Math.exp(u); // e**u
  }

  
  // Trigometric
  static Sin(u) {
    return Math.sin(u);
  }

  static Cos(u) {
    return Math.cos(u);
  }

  static Tan(u) {
    return Math.tan(u);
  }

  static Csc(u) {
    return 1.0 / Math.sin(u);
  }

  static Sec(u) {
    return 1.0 / Math.cos(u);
  }

  static Cot(u) {
    return 1.0 / Math.tan(u);
  }

  // Inverse Trigometric
  static Arcsin(u) {
    return Math.asin(u);
  }

  static Arccos(u) {
    return Math.acos(u);
  }

  static Arctan(u) {
    return Math.atan(u);
  }

  static Arccsc(u) {
    return Math.asin(1 / u); // ???
  }

  static Arcsec(u) {
    return Math.acos(1 / u); // ???
  }

  static Arccot(u) {
    return Math.atan(1 / u); // ???
  }

  
  // Hyperbolic  with Inverse
  static Sinh(u) {
    return Math.sinh(u);
  }

  static Cosh(u) {
    return Math.cosh(u);
  }

  static Tanh(u) {
    return Math.tanh(u);
  }

  static Arccinh(u) {
    return Math.asinh(u);
  }

  static Arccosh(u) {
    return Math.acosh(u);
  }

  static Arctanh(u) {
    return Math.atanh(u);
  }

  // Calculus, Sum and Typsetting
  static Fun(f, u) {
    return u; // f(u) Function
  }

  static D(u) {
    return u; // d(u) Differentiation
  }

  static Int(u) {
    return u; // Integration
  }

  static DefInt(a, b, u) {
    return a + b + u; // Definite Integral
  }

  static Sum(a, b, u) {
    return a + b + u; // Summation
  }

  
  // Subscripts Superscripts Limits
  static Sus(u, a) {
    return u + a; // u_a  Subscript  u^b  Superscript is Power
  }

  static Lim(a, b) {
    return a + b; //_a^b  Limit for Sum and Itg
  }

  
  // Finge
  //Obj = (k,v)  => { k:v } # ???
  static Latex(o) {
    return o;
  }

  static Sim(u) {
    return u; // sim(u) Simplify
  }

  static Not(u) {
    return u; // Not an Adt expression
  }

  static Msg(u) {
    return u; // Parsing error message
  }

  static Unk(u) {
    return u;
  }

};

Adt.Geom = [Adt.Dot, Adt.Wedge, Adt.Vee, Adt.Dual, Adt.Inverse, Adt.Conjugate, Adt.Reverse, Adt.Involute, Adt.Rotor, Adt.Magnitude, Adt.Grade, Adt.Reflect, Adt.Rotate, Adt.GP];

Adt.Arith = [Adt.Ratio, Adt.Equ, Adt.Add, Adt.Sub, Adt.Mul, Adt.Div, Adt.Pow, Adt.Neg, Adt.Recip, Adt.Abs, Adt.Paren, Adt.Brace];

Adt.Trans = [Adt.Ln, Adt.Log, Adt.Root, Adt.Sqrt, Adt.E, Adt.Sin, Adt.Cos, Adt.Tan, Adt.Csc, Adt.Sec, Adt.Cot, Adt.Arcsin, Adt.Arccos, Adt.Arctan, Adt.Arccsc, Adt.Arcsec, Adt.Arccot];

Adt.Hyper = [Adt.Sinh, Adt.Cosh, Adt.Tanh, Adt.Arccinh, Adt.Arccosh, Adt.Arctanh];

Adt.Calculus = [Adt.Fun, Adt.D, Adt.Int, Adt.DefInt, Adt.Sum, Adt.Sub, Adt.Sus, Adt.Lim];

Adt.Fringe = [Adt.Latex, Adt.Sim, Adt.Not, Adt.Msg, Adt.Unk];

var A = Adt;

/*
 * Generated by PEG.js 0.10.0.
 *
 * http://pegjs.org/
 */

function peg$subclass(child, parent) {
  function ctor() { this.constructor = child; }
  ctor.prototype = parent.prototype;
  child.prototype = new ctor();
}

function peg$SyntaxError(message, expected, found, location) {
  this.message  = message;
  this.expected = expected;
  this.found    = found;
  this.location = location;
  this.name     = "SyntaxError";

  if (typeof Error.captureStackTrace === "function") {
    Error.captureStackTrace(this, peg$SyntaxError);
  }
}

peg$subclass(peg$SyntaxError, Error);

peg$SyntaxError.buildMessage = function(expected, found) {
  var DESCRIBE_EXPECTATION_FNS = {
        literal: function(expectation) {
          return "\"" + literalEscape(expectation.text) + "\"";
        },

        "class": function(expectation) {
          var escapedParts = "",
              i;

          for (i = 0; i < expectation.parts.length; i++) {
            escapedParts += expectation.parts[i] instanceof Array
              ? classEscape(expectation.parts[i][0]) + "-" + classEscape(expectation.parts[i][1])
              : classEscape(expectation.parts[i]);
          }

          return "[" + (expectation.inverted ? "^" : "") + escapedParts + "]";
        },

        any: function(expectation) {
          return "any character";
        },

        end: function(expectation) {
          return "end of input";
        },

        other: function(expectation) {
          return expectation.description;
        }
      };

  function hex(ch) {
    return ch.charCodeAt(0).toString(16).toUpperCase();
  }

  function literalEscape(s) {
    return s
      .replace(/\\/g, '\\\\')
      .replace(/"/g,  '\\"')
      .replace(/\0/g, '\\0')
      .replace(/\t/g, '\\t')
      .replace(/\n/g, '\\n')
      .replace(/\r/g, '\\r')
      .replace(/[\x00-\x0F]/g,          function(ch) { return '\\x0' + hex(ch); })
      .replace(/[\x10-\x1F\x7F-\x9F]/g, function(ch) { return '\\x'  + hex(ch); });
  }

  function classEscape(s) {
    return s
      .replace(/\\/g, '\\\\')
      .replace(/\]/g, '\\]')
      .replace(/\^/g, '\\^')
      .replace(/-/g,  '\\-')
      .replace(/\0/g, '\\0')
      .replace(/\t/g, '\\t')
      .replace(/\n/g, '\\n')
      .replace(/\r/g, '\\r')
      .replace(/[\x00-\x0F]/g,          function(ch) { return '\\x0' + hex(ch); })
      .replace(/[\x10-\x1F\x7F-\x9F]/g, function(ch) { return '\\x'  + hex(ch); });
  }

  function describeExpectation(expectation) {
    return DESCRIBE_EXPECTATION_FNS[expectation.type](expectation);
  }

  function describeExpected(expected) {
    var descriptions = new Array(expected.length),
        i, j;

    for (i = 0; i < expected.length; i++) {
      descriptions[i] = describeExpectation(expected[i]);
    }

    descriptions.sort();

    if (descriptions.length > 0) {
      for (i = 1, j = 1; i < descriptions.length; i++) {
        if (descriptions[i - 1] !== descriptions[i]) {
          descriptions[j] = descriptions[i];
          j++;
        }
      }
      descriptions.length = j;
    }

    switch (descriptions.length) {
      case 1:
        return descriptions[0];

      case 2:
        return descriptions[0] + " or " + descriptions[1];

      default:
        return descriptions.slice(0, -1).join(", ")
          + ", or "
          + descriptions[descriptions.length - 1];
    }
  }

  function describeFound(found) {
    return found ? "\"" + literalEscape(found) + "\"" : "end of input";
  }

  return "Expected " + describeExpected(expected) + " but " + describeFound(found) + " found.";
};

function peg$parse(input, options) {
  options = options !== void 0 ? options : {};

  var peg$FAILED = {},

      peg$startRuleFunctions = { start: peg$parsestart },
      peg$startRuleFunction  = peg$parsestart,

      peg$c0 = function(u) { return `${u}` },
      peg$c1 = "=",
      peg$c2 = peg$literalExpectation("=", false),
      peg$c3 = function(u, v) { return `['Equ',${u},${v}]`; },
      peg$c4 = "+",
      peg$c5 = peg$literalExpectation("+", false),
      peg$c6 = function(u, v) { return `['Add',${u},${v}]`; },
      peg$c7 = "-",
      peg$c8 = peg$literalExpectation("-", false),
      peg$c9 = function(u, v) { return `['Sub',${u},${v}]`; },
      peg$c10 = "*",
      peg$c11 = peg$literalExpectation("*", false),
      peg$c12 = function(u, v) { return `['Mul',${u},${v}]` },
      peg$c13 = "/",
      peg$c14 = peg$literalExpectation("/", false),
      peg$c15 = function(u, v) { return `['Div',${u},${v}]` },
      peg$c16 = function(u, v) { return `['Pow',${u},${v}]` },
      peg$c17 = function(u, v) { return `['Sus',${u},${v}]` },
      peg$c18 = function(u) { return `['Neg',${u}]`   },
      peg$c19 = "\\",
      peg$c20 = peg$literalExpectation("\\", false),
      peg$c21 = function(o) { return `['Latex','${o}']` },
      peg$c22 = function(k, a, b, u) { return func3(k,a,b,u) },
      peg$c23 = function(k, a, b) { return func2(k,a,b) },
      peg$c24 = "(",
      peg$c25 = peg$literalExpectation("(", false),
      peg$c26 = ")",
      peg$c27 = peg$literalExpectation(")", false),
      peg$c28 = function(f, u) { return func1(f,u) },
      peg$c29 = function(u) { return `['Paren',${u}]`; },
      peg$c30 = "{",
      peg$c31 = peg$literalExpectation("{", false),
      peg$c32 = "}",
      peg$c33 = peg$literalExpectation("}", false),
      peg$c34 = function(u) { return `['Brace',${u}]`; },
      peg$c35 = function(head, v) { return v; },
      peg$c36 = function(head, tail) { return [head].concat(tail); },
      peg$c37 = function(vals) { return vals !== null ? `['Vec',${vals}]` : `['Vec',${[]}]`; },
      peg$c38 = function(head, tail) {  return [head].concat(tail); },
      peg$c39 = function(vecs) { return vecs !== null ? `['Mat',${vecs}]` : `['Mat',${[[]]}]`; },
      peg$c40 = /^[0-9]/,
      peg$c41 = peg$classExpectation([["0", "9"]], false, false),
      peg$c42 = ".",
      peg$c43 = peg$literalExpectation(".", false),
      peg$c44 = function(float) { let d = parseFloat(float.join("")); return `${d}`; },
      peg$c45 = function(digits) { let n = parseInt(digits.join(""), 10); return `${n}`; },
      peg$c46 = "lim",
      peg$c47 = peg$literalExpectation("lim", false),
      peg$c48 = "sum",
      peg$c49 = peg$literalExpectation("sum", false),
      peg$c50 = "int",
      peg$c51 = peg$literalExpectation("int", false),
      peg$c52 = "prod",
      peg$c53 = peg$literalExpectation("prod", false),
      peg$c54 = function(string) { return `'${string}'`; },
      peg$c55 = "_",
      peg$c56 = peg$literalExpectation("_", false),
      peg$c57 = /^[_~]/,
      peg$c58 = peg$classExpectation(["_", "~"], false, false),
      peg$c59 = "^",
      peg$c60 = peg$literalExpectation("^", false),
      peg$c61 = /^[\^~]/,
      peg$c62 = peg$classExpectation(["^", "~"], false, false),
      peg$c63 = "~",
      peg$c64 = peg$literalExpectation("~", false),
      peg$c65 = "[",
      peg$c66 = peg$literalExpectation("[", false),
      peg$c67 = "]",
      peg$c68 = peg$literalExpectation("]", false),
      peg$c69 = "[[",
      peg$c70 = peg$literalExpectation("[[", false),
      peg$c71 = ",",
      peg$c72 = peg$literalExpectation(",", false),
      peg$c73 = /^[a-zA-Z]/,
      peg$c74 = peg$classExpectation([["a", "z"], ["A", "Z"]], false, false),
      peg$c75 = function(string) { return string.join("") },
      peg$c76 = /^[ ]/,
      peg$c77 = peg$classExpectation([" "], false, false),

      peg$currPos          = 0,
      peg$posDetailsCache  = [{ line: 1, column: 1 }],
      peg$maxFailPos       = 0,
      peg$maxFailExpected  = [],
      peg$silentFails      = 0,

      peg$result;

  if ("startRule" in options) {
    if (!(options.startRule in peg$startRuleFunctions)) {
      throw new Error("Can't start parsing from rule \"" + options.startRule + "\".");
    }

    peg$startRuleFunction = peg$startRuleFunctions[options.startRule];
  }

  function peg$literalExpectation(text, ignoreCase) {
    return { type: "literal", text: text, ignoreCase: ignoreCase };
  }

  function peg$classExpectation(parts, inverted, ignoreCase) {
    return { type: "class", parts: parts, inverted: inverted, ignoreCase: ignoreCase };
  }

  function peg$endExpectation() {
    return { type: "end" };
  }

  function peg$computePosDetails(pos) {
    var details = peg$posDetailsCache[pos], p;

    if (details) {
      return details;
    } else {
      p = pos - 1;
      while (!peg$posDetailsCache[p]) {
        p--;
      }

      details = peg$posDetailsCache[p];
      details = {
        line:   details.line,
        column: details.column
      };

      while (p < pos) {
        if (input.charCodeAt(p) === 10) {
          details.line++;
          details.column = 1;
        } else {
          details.column++;
        }

        p++;
      }

      peg$posDetailsCache[pos] = details;
      return details;
    }
  }

  function peg$computeLocation(startPos, endPos) {
    var startPosDetails = peg$computePosDetails(startPos),
        endPosDetails   = peg$computePosDetails(endPos);

    return {
      start: {
        offset: startPos,
        line:   startPosDetails.line,
        column: startPosDetails.column
      },
      end: {
        offset: endPos,
        line:   endPosDetails.line,
        column: endPosDetails.column
      }
    };
  }

  function peg$fail(expected) {
    if (peg$currPos < peg$maxFailPos) { return; }

    if (peg$currPos > peg$maxFailPos) {
      peg$maxFailPos = peg$currPos;
      peg$maxFailExpected = [];
    }

    peg$maxFailExpected.push(expected);
  }

  function peg$buildStructuredError(expected, found, location) {
    return new peg$SyntaxError(
      peg$SyntaxError.buildMessage(expected, found),
      expected,
      found,
      location
    );
  }

  function peg$parsestart() {
    var s0;

    s0 = peg$parseTilde();

    return s0;
  }

  function peg$parseTilde() {
    var s0, s1, s2;

    s0 = peg$currPos;
    s1 = peg$parsetilde();
    if (s1 !== peg$FAILED) {
      s2 = peg$parseTilde();
      if (s2 !== peg$FAILED) {
        s1 = peg$c0(s2);
        s0 = s1;
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }
    if (s0 === peg$FAILED) {
      s0 = peg$parseEqu();
    }

    return s0;
  }

  function peg$parseEqu() {
    var s0, s1, s2, s3, s4;

    s0 = peg$currPos;
    s1 = peg$parseAdd();
    if (s1 !== peg$FAILED) {
      if (input.charCodeAt(peg$currPos) === 61) {
        s2 = peg$c1;
        peg$currPos++;
      } else {
        s2 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c2); }
      }
      if (s2 !== peg$FAILED) {
        s3 = peg$parsews();
        if (s3 !== peg$FAILED) {
          s4 = peg$parseEqu();
          if (s4 !== peg$FAILED) {
            s1 = peg$c3(s1, s4);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }
    if (s0 === peg$FAILED) {
      s0 = peg$parseAdd();
    }

    return s0;
  }

  function peg$parseAdd() {
    var s0, s1, s2, s3, s4;

    s0 = peg$currPos;
    s1 = peg$parseSub();
    if (s1 !== peg$FAILED) {
      if (input.charCodeAt(peg$currPos) === 43) {
        s2 = peg$c4;
        peg$currPos++;
      } else {
        s2 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c5); }
      }
      if (s2 !== peg$FAILED) {
        s3 = peg$parsews();
        if (s3 !== peg$FAILED) {
          s4 = peg$parseAdd();
          if (s4 !== peg$FAILED) {
            s1 = peg$c6(s1, s4);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }
    if (s0 === peg$FAILED) {
      s0 = peg$parseSub();
    }

    return s0;
  }

  function peg$parseSub() {
    var s0, s1, s2, s3, s4;

    s0 = peg$currPos;
    s1 = peg$parseMul();
    if (s1 !== peg$FAILED) {
      if (input.charCodeAt(peg$currPos) === 45) {
        s2 = peg$c7;
        peg$currPos++;
      } else {
        s2 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c8); }
      }
      if (s2 !== peg$FAILED) {
        s3 = peg$parsews();
        if (s3 !== peg$FAILED) {
          s4 = peg$parseSub();
          if (s4 !== peg$FAILED) {
            s1 = peg$c9(s1, s4);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }
    if (s0 === peg$FAILED) {
      s0 = peg$parseMul();
    }

    return s0;
  }

  function peg$parseMul() {
    var s0, s1, s2, s3, s4;

    s0 = peg$currPos;
    s1 = peg$parseDiv();
    if (s1 !== peg$FAILED) {
      if (input.charCodeAt(peg$currPos) === 42) {
        s2 = peg$c10;
        peg$currPos++;
      } else {
        s2 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c11); }
      }
      if (s2 !== peg$FAILED) {
        s3 = peg$parsews();
        if (s3 !== peg$FAILED) {
          s4 = peg$parseMul();
          if (s4 !== peg$FAILED) {
            s1 = peg$c12(s1, s4);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }
    if (s0 === peg$FAILED) {
      s0 = peg$parseDiv();
    }

    return s0;
  }

  function peg$parseDiv() {
    var s0, s1, s2, s3, s4;

    s0 = peg$currPos;
    s1 = peg$parsePow();
    if (s1 !== peg$FAILED) {
      if (input.charCodeAt(peg$currPos) === 47) {
        s2 = peg$c13;
        peg$currPos++;
      } else {
        s2 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c14); }
      }
      if (s2 !== peg$FAILED) {
        s3 = peg$parsews();
        if (s3 !== peg$FAILED) {
          s4 = peg$parseDiv();
          if (s4 !== peg$FAILED) {
            s1 = peg$c15(s1, s4);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }
    if (s0 === peg$FAILED) {
      s0 = peg$parsePow();
    }

    return s0;
  }

  function peg$parsePow() {
    var s0, s1, s2, s3;

    s0 = peg$currPos;
    s1 = peg$parseSus();
    if (s1 !== peg$FAILED) {
      s2 = peg$parsepower();
      if (s2 !== peg$FAILED) {
        s3 = peg$parsePow();
        if (s3 !== peg$FAILED) {
          s1 = peg$c16(s1, s3);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }
    if (s0 === peg$FAILED) {
      s0 = peg$parseSus();
    }

    return s0;
  }

  function peg$parseSus() {
    var s0, s1, s2, s3;

    s0 = peg$currPos;
    s1 = peg$parseNeg();
    if (s1 !== peg$FAILED) {
      s2 = peg$parseunder();
      if (s2 !== peg$FAILED) {
        s3 = peg$parseSus();
        if (s3 !== peg$FAILED) {
          s1 = peg$c17(s1, s3);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }
    if (s0 === peg$FAILED) {
      s0 = peg$parseNeg();
    }

    return s0;
  }

  function peg$parseNeg() {
    var s0, s1, s2;

    s0 = peg$currPos;
    if (input.charCodeAt(peg$currPos) === 45) {
      s1 = peg$c7;
      peg$currPos++;
    } else {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$c8); }
    }
    if (s1 !== peg$FAILED) {
      s2 = peg$parseNeg();
      if (s2 !== peg$FAILED) {
        s1 = peg$c18(s2);
        s0 = s1;
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }
    if (s0 === peg$FAILED) {
      s0 = peg$parseLatex();
    }

    return s0;
  }

  function peg$parseLatex() {
    var s0, s1, s2;

    s0 = peg$currPos;
    if (input.charCodeAt(peg$currPos) === 92) {
      s1 = peg$c19;
      peg$currPos++;
    } else {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$c20); }
    }
    if (s1 !== peg$FAILED) {
      s2 = peg$parsestr();
      if (s2 !== peg$FAILED) {
        s1 = peg$c21(s2);
        s0 = s1;
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }
    if (s0 === peg$FAILED) {
      s0 = peg$parseLower();
    }

    return s0;
  }

  function peg$parseLower() {
    var s0, s1, s2;

    s0 = peg$currPos;
    s1 = peg$parselower();
    if (s1 !== peg$FAILED) {
      s2 = peg$parseLower();
      if (s2 !== peg$FAILED) {
        s1 = peg$c0(s2);
        s0 = s1;
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }
    if (s0 === peg$FAILED) {
      s0 = peg$parseUpper();
    }

    return s0;
  }

  function peg$parseUpper() {
    var s0, s1, s2;

    s0 = peg$currPos;
    s1 = peg$parseupper();
    if (s1 !== peg$FAILED) {
      s2 = peg$parseUpper();
      if (s2 !== peg$FAILED) {
        s1 = peg$c0(s2);
        s0 = s1;
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }
    if (s0 === peg$FAILED) {
      s0 = peg$parseSum();
    }

    return s0;
  }

  function peg$parseSum() {
    var s0, s1, s2, s3, s4;

    s0 = peg$currPos;
    s1 = peg$parseKey();
    if (s1 !== peg$FAILED) {
      s2 = peg$parseLower();
      if (s2 !== peg$FAILED) {
        s3 = peg$parseUpper();
        if (s3 !== peg$FAILED) {
          s4 = peg$parseTilde();
          if (s4 !== peg$FAILED) {
            s1 = peg$c22(s1, s2, s3, s4);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }
    if (s0 === peg$FAILED) {
      s0 = peg$parseLim();
    }

    return s0;
  }

  function peg$parseLim() {
    var s0, s1, s2, s3;

    s0 = peg$currPos;
    s1 = peg$parseKey();
    if (s1 !== peg$FAILED) {
      s2 = peg$parseLower();
      if (s2 !== peg$FAILED) {
        s3 = peg$parseUpper();
        if (s3 !== peg$FAILED) {
          s1 = peg$c23(s1, s2, s3);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }
    if (s0 === peg$FAILED) {
      s0 = peg$parsePri();
    }

    return s0;
  }

  function peg$parsePri() {
    var s0;

    s0 = peg$parseFun();
    if (s0 === peg$FAILED) {
      s0 = peg$parseDbl();
      if (s0 === peg$FAILED) {
        s0 = peg$parseNum();
        if (s0 === peg$FAILED) {
          s0 = peg$parseKey();
          if (s0 === peg$FAILED) {
            s0 = peg$parseVar();
          }
        }
      }
    }

    return s0;
  }

  function peg$parseFun() {
    var s0, s1, s2, s3, s4, s5;

    s0 = peg$currPos;
    s1 = peg$parsestr();
    if (s1 !== peg$FAILED) {
      if (input.charCodeAt(peg$currPos) === 40) {
        s2 = peg$c24;
        peg$currPos++;
      } else {
        s2 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c25); }
      }
      if (s2 !== peg$FAILED) {
        s3 = peg$parseTilde();
        if (s3 !== peg$FAILED) {
          if (input.charCodeAt(peg$currPos) === 41) {
            s4 = peg$c26;
            peg$currPos++;
          } else {
            s4 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c27); }
          }
          if (s4 !== peg$FAILED) {
            s5 = peg$parsews();
            if (s5 !== peg$FAILED) {
              s1 = peg$c28(s1, s3);
              s0 = s1;
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }
    if (s0 === peg$FAILED) {
      s0 = peg$parsePar();
    }

    return s0;
  }

  function peg$parsePar() {
    var s0, s1, s2, s3, s4;

    s0 = peg$currPos;
    if (input.charCodeAt(peg$currPos) === 40) {
      s1 = peg$c24;
      peg$currPos++;
    } else {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$c25); }
    }
    if (s1 !== peg$FAILED) {
      s2 = peg$parseTilde();
      if (s2 !== peg$FAILED) {
        if (input.charCodeAt(peg$currPos) === 41) {
          s3 = peg$c26;
          peg$currPos++;
        } else {
          s3 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c27); }
        }
        if (s3 !== peg$FAILED) {
          s4 = peg$parsews();
          if (s4 !== peg$FAILED) {
            s1 = peg$c29(s2);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }
    if (s0 === peg$FAILED) {
      s0 = peg$parseBrc();
    }

    return s0;
  }

  function peg$parseBrc() {
    var s0, s1, s2, s3, s4;

    s0 = peg$currPos;
    if (input.charCodeAt(peg$currPos) === 123) {
      s1 = peg$c30;
      peg$currPos++;
    } else {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$c31); }
    }
    if (s1 !== peg$FAILED) {
      s2 = peg$parseBrc();
      if (s2 !== peg$FAILED) {
        if (input.charCodeAt(peg$currPos) === 125) {
          s3 = peg$c32;
          peg$currPos++;
        } else {
          s3 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c33); }
        }
        if (s3 !== peg$FAILED) {
          s4 = peg$parsews();
          if (s4 !== peg$FAILED) {
            s1 = peg$c34(s2);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }
    if (s0 === peg$FAILED) {
      s0 = peg$parseVec();
    }

    return s0;
  }

  function peg$parseVec() {
    var s0, s1, s2, s3, s4, s5, s6, s7;

    s0 = peg$currPos;
    s1 = peg$parsebegVec();
    if (s1 !== peg$FAILED) {
      s2 = peg$currPos;
      s3 = peg$parseTilde();
      if (s3 !== peg$FAILED) {
        s4 = [];
        s5 = peg$currPos;
        s6 = peg$parsecomma();
        if (s6 !== peg$FAILED) {
          s7 = peg$parseTilde();
          if (s7 !== peg$FAILED) {
            s6 = peg$c35(s3, s7);
            s5 = s6;
          } else {
            peg$currPos = s5;
            s5 = peg$FAILED;
          }
        } else {
          peg$currPos = s5;
          s5 = peg$FAILED;
        }
        while (s5 !== peg$FAILED) {
          s4.push(s5);
          s5 = peg$currPos;
          s6 = peg$parsecomma();
          if (s6 !== peg$FAILED) {
            s7 = peg$parseTilde();
            if (s7 !== peg$FAILED) {
              s6 = peg$c35(s3, s7);
              s5 = s6;
            } else {
              peg$currPos = s5;
              s5 = peg$FAILED;
            }
          } else {
            peg$currPos = s5;
            s5 = peg$FAILED;
          }
        }
        if (s4 !== peg$FAILED) {
          s3 = peg$c36(s3, s4);
          s2 = s3;
        } else {
          peg$currPos = s2;
          s2 = peg$FAILED;
        }
      } else {
        peg$currPos = s2;
        s2 = peg$FAILED;
      }
      if (s2 === peg$FAILED) {
        s2 = null;
      }
      if (s2 !== peg$FAILED) {
        s3 = peg$parseendVec();
        if (s3 !== peg$FAILED) {
          s1 = peg$c37(s2);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }
    if (s0 === peg$FAILED) {
      s0 = peg$parseMat();
    }

    return s0;
  }

  function peg$parseMec() {
    var s0, s1, s2, s3, s4, s5, s6;

    s0 = peg$currPos;
    s1 = peg$currPos;
    s2 = peg$parseTilde();
    if (s2 !== peg$FAILED) {
      s3 = [];
      s4 = peg$currPos;
      s5 = peg$parsecomma();
      if (s5 !== peg$FAILED) {
        s6 = peg$parseTilde();
        if (s6 !== peg$FAILED) {
          s5 = peg$c35(s2, s6);
          s4 = s5;
        } else {
          peg$currPos = s4;
          s4 = peg$FAILED;
        }
      } else {
        peg$currPos = s4;
        s4 = peg$FAILED;
      }
      while (s4 !== peg$FAILED) {
        s3.push(s4);
        s4 = peg$currPos;
        s5 = peg$parsecomma();
        if (s5 !== peg$FAILED) {
          s6 = peg$parseTilde();
          if (s6 !== peg$FAILED) {
            s5 = peg$c35(s2, s6);
            s4 = s5;
          } else {
            peg$currPos = s4;
            s4 = peg$FAILED;
          }
        } else {
          peg$currPos = s4;
          s4 = peg$FAILED;
        }
      }
      if (s3 !== peg$FAILED) {
        s2 = peg$c38(s2, s3);
        s1 = s2;
      } else {
        peg$currPos = s1;
        s1 = peg$FAILED;
      }
    } else {
      peg$currPos = s1;
      s1 = peg$FAILED;
    }
    if (s1 === peg$FAILED) {
      s1 = null;
    }
    if (s1 !== peg$FAILED) {
      s2 = peg$parseendVec();
      if (s2 !== peg$FAILED) {
        s1 = peg$c37(s1);
        s0 = s1;
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }

    return s0;
  }

  function peg$parseMat() {
    var s0, s1, s2, s3, s4, s5, s6, s7;

    s0 = peg$currPos;
    s1 = peg$parsebegMat();
    if (s1 !== peg$FAILED) {
      s2 = peg$currPos;
      s3 = peg$parseMec();
      if (s3 !== peg$FAILED) {
        s4 = [];
        s5 = peg$currPos;
        s6 = peg$parsecomma();
        if (s6 !== peg$FAILED) {
          s7 = peg$parseVec();
          if (s7 !== peg$FAILED) {
            s6 = peg$c35(s3, s7);
            s5 = s6;
          } else {
            peg$currPos = s5;
            s5 = peg$FAILED;
          }
        } else {
          peg$currPos = s5;
          s5 = peg$FAILED;
        }
        while (s5 !== peg$FAILED) {
          s4.push(s5);
          s5 = peg$currPos;
          s6 = peg$parsecomma();
          if (s6 !== peg$FAILED) {
            s7 = peg$parseVec();
            if (s7 !== peg$FAILED) {
              s6 = peg$c35(s3, s7);
              s5 = s6;
            } else {
              peg$currPos = s5;
              s5 = peg$FAILED;
            }
          } else {
            peg$currPos = s5;
            s5 = peg$FAILED;
          }
        }
        if (s4 !== peg$FAILED) {
          s3 = peg$c36(s3, s4);
          s2 = s3;
        } else {
          peg$currPos = s2;
          s2 = peg$FAILED;
        }
      } else {
        peg$currPos = s2;
        s2 = peg$FAILED;
      }
      if (s2 === peg$FAILED) {
        s2 = null;
      }
      if (s2 !== peg$FAILED) {
        s3 = peg$parseendVec();
        if (s3 !== peg$FAILED) {
          s1 = peg$c39(s2);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }

    return s0;
  }

  function peg$parseDbl() {
    var s0, s1, s2, s3, s4, s5;

    s0 = peg$currPos;
    s1 = peg$currPos;
    s2 = [];
    if (peg$c40.test(input.charAt(peg$currPos))) {
      s3 = input.charAt(peg$currPos);
      peg$currPos++;
    } else {
      s3 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$c41); }
    }
    while (s3 !== peg$FAILED) {
      s2.push(s3);
      if (peg$c40.test(input.charAt(peg$currPos))) {
        s3 = input.charAt(peg$currPos);
        peg$currPos++;
      } else {
        s3 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c41); }
      }
    }
    if (s2 !== peg$FAILED) {
      if (input.charCodeAt(peg$currPos) === 46) {
        s3 = peg$c42;
        peg$currPos++;
      } else {
        s3 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c43); }
      }
      if (s3 !== peg$FAILED) {
        s4 = [];
        if (peg$c40.test(input.charAt(peg$currPos))) {
          s5 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s5 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c41); }
        }
        if (s5 !== peg$FAILED) {
          while (s5 !== peg$FAILED) {
            s4.push(s5);
            if (peg$c40.test(input.charAt(peg$currPos))) {
              s5 = input.charAt(peg$currPos);
              peg$currPos++;
            } else {
              s5 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c41); }
            }
          }
        } else {
          s4 = peg$FAILED;
        }
        if (s4 !== peg$FAILED) {
          s2 = [s2, s3, s4];
          s1 = s2;
        } else {
          peg$currPos = s1;
          s1 = peg$FAILED;
        }
      } else {
        peg$currPos = s1;
        s1 = peg$FAILED;
      }
    } else {
      peg$currPos = s1;
      s1 = peg$FAILED;
    }
    if (s1 !== peg$FAILED) {
      s2 = peg$parsews();
      if (s2 !== peg$FAILED) {
        s1 = peg$c44(s1);
        s0 = s1;
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }

    return s0;
  }

  function peg$parseNum() {
    var s0, s1, s2;

    s0 = peg$currPos;
    s1 = [];
    if (peg$c40.test(input.charAt(peg$currPos))) {
      s2 = input.charAt(peg$currPos);
      peg$currPos++;
    } else {
      s2 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$c41); }
    }
    if (s2 !== peg$FAILED) {
      while (s2 !== peg$FAILED) {
        s1.push(s2);
        if (peg$c40.test(input.charAt(peg$currPos))) {
          s2 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s2 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c41); }
        }
      }
    } else {
      s1 = peg$FAILED;
    }
    if (s1 !== peg$FAILED) {
      s2 = peg$parsews();
      if (s2 !== peg$FAILED) {
        s1 = peg$c45(s1);
        s0 = s1;
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }

    return s0;
  }

  function peg$parseKey() {
    var s0;

    if (input.substr(peg$currPos, 3) === peg$c46) {
      s0 = peg$c46;
      peg$currPos += 3;
    } else {
      s0 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$c47); }
    }
    if (s0 === peg$FAILED) {
      if (input.substr(peg$currPos, 3) === peg$c48) {
        s0 = peg$c48;
        peg$currPos += 3;
      } else {
        s0 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c49); }
      }
      if (s0 === peg$FAILED) {
        if (input.substr(peg$currPos, 3) === peg$c50) {
          s0 = peg$c50;
          peg$currPos += 3;
        } else {
          s0 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c51); }
        }
        if (s0 === peg$FAILED) {
          if (input.substr(peg$currPos, 4) === peg$c52) {
            s0 = peg$c52;
            peg$currPos += 4;
          } else {
            s0 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c53); }
          }
        }
      }
    }

    return s0;
  }

  function peg$parseVar() {
    var s0, s1, s2;

    s0 = peg$currPos;
    s1 = peg$parsestr();
    if (s1 !== peg$FAILED) {
      s2 = peg$parsews();
      if (s2 !== peg$FAILED) {
        s1 = peg$c54(s1);
        s0 = s1;
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }

    return s0;
  }

  function peg$parseunder() {
    var s0, s1, s2, s3;

    s0 = peg$currPos;
    if (input.charCodeAt(peg$currPos) === 95) {
      s1 = peg$c55;
      peg$currPos++;
    } else {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$c56); }
    }
    if (s1 !== peg$FAILED) {
      s2 = peg$currPos;
      peg$silentFails++;
      if (peg$c57.test(input.charAt(peg$currPos))) {
        s3 = input.charAt(peg$currPos);
        peg$currPos++;
      } else {
        s3 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c58); }
      }
      peg$silentFails--;
      if (s3 === peg$FAILED) {
        s2 = void 0;
      } else {
        peg$currPos = s2;
        s2 = peg$FAILED;
      }
      if (s2 !== peg$FAILED) {
        s1 = [s1, s2];
        s0 = s1;
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }

    return s0;
  }

  function peg$parsepower() {
    var s0, s1, s2, s3;

    s0 = peg$currPos;
    if (input.charCodeAt(peg$currPos) === 94) {
      s1 = peg$c59;
      peg$currPos++;
    } else {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$c60); }
    }
    if (s1 !== peg$FAILED) {
      s2 = peg$currPos;
      peg$silentFails++;
      if (peg$c61.test(input.charAt(peg$currPos))) {
        s3 = input.charAt(peg$currPos);
        peg$currPos++;
      } else {
        s3 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c62); }
      }
      peg$silentFails--;
      if (s3 === peg$FAILED) {
        s2 = void 0;
      } else {
        peg$currPos = s2;
        s2 = peg$FAILED;
      }
      if (s2 !== peg$FAILED) {
        s1 = [s1, s2];
        s0 = s1;
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }

    return s0;
  }

  function peg$parselower() {
    var s0;

    if (input.charCodeAt(peg$currPos) === 95) {
      s0 = peg$c55;
      peg$currPos++;
    } else {
      s0 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$c56); }
    }

    return s0;
  }

  function peg$parseupper() {
    var s0;

    if (input.charCodeAt(peg$currPos) === 94) {
      s0 = peg$c59;
      peg$currPos++;
    } else {
      s0 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$c60); }
    }

    return s0;
  }

  function peg$parsetilde() {
    var s0;

    if (input.charCodeAt(peg$currPos) === 126) {
      s0 = peg$c63;
      peg$currPos++;
    } else {
      s0 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$c64); }
    }

    return s0;
  }

  function peg$parsebegVec() {
    var s0, s1, s2, s3, s4, s5;

    s0 = peg$currPos;
    s1 = peg$parsews();
    if (s1 !== peg$FAILED) {
      if (input.charCodeAt(peg$currPos) === 91) {
        s2 = peg$c65;
        peg$currPos++;
      } else {
        s2 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c66); }
      }
      if (s2 !== peg$FAILED) {
        s3 = peg$parsews();
        if (s3 !== peg$FAILED) {
          s4 = peg$currPos;
          peg$silentFails++;
          if (input.charCodeAt(peg$currPos) === 91) {
            s5 = peg$c65;
            peg$currPos++;
          } else {
            s5 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c66); }
          }
          peg$silentFails--;
          if (s5 === peg$FAILED) {
            s4 = void 0;
          } else {
            peg$currPos = s4;
            s4 = peg$FAILED;
          }
          if (s4 !== peg$FAILED) {
            s1 = [s1, s2, s3, s4];
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }

    return s0;
  }

  function peg$parseendVec() {
    var s0, s1, s2, s3;

    s0 = peg$currPos;
    s1 = peg$parsews();
    if (s1 !== peg$FAILED) {
      if (input.charCodeAt(peg$currPos) === 93) {
        s2 = peg$c67;
        peg$currPos++;
      } else {
        s2 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c68); }
      }
      if (s2 !== peg$FAILED) {
        s3 = peg$parsews();
        if (s3 !== peg$FAILED) {
          s1 = [s1, s2, s3];
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }

    return s0;
  }

  function peg$parsebegMat() {
    var s0, s1, s2;

    s0 = peg$currPos;
    s1 = peg$parsews();
    if (s1 !== peg$FAILED) {
      if (input.substr(peg$currPos, 2) === peg$c69) {
        s2 = peg$c69;
        peg$currPos += 2;
      } else {
        s2 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c70); }
      }
      if (s2 !== peg$FAILED) {
        s1 = [s1, s2];
        s0 = s1;
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }

    return s0;
  }

  function peg$parsecomma() {
    var s0, s1, s2, s3;

    s0 = peg$currPos;
    s1 = peg$parsews();
    if (s1 !== peg$FAILED) {
      if (input.charCodeAt(peg$currPos) === 44) {
        s2 = peg$c71;
        peg$currPos++;
      } else {
        s2 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c72); }
      }
      if (s2 !== peg$FAILED) {
        s3 = peg$parsews();
        if (s3 !== peg$FAILED) {
          s1 = [s1, s2, s3];
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }

    return s0;
  }

  function peg$parsestr() {
    var s0, s1, s2;

    s0 = peg$currPos;
    s1 = [];
    if (peg$c73.test(input.charAt(peg$currPos))) {
      s2 = input.charAt(peg$currPos);
      peg$currPos++;
    } else {
      s2 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$c74); }
    }
    if (s2 !== peg$FAILED) {
      while (s2 !== peg$FAILED) {
        s1.push(s2);
        if (peg$c73.test(input.charAt(peg$currPos))) {
          s2 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s2 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c74); }
        }
      }
    } else {
      s1 = peg$FAILED;
    }
    if (s1 !== peg$FAILED) {
      s1 = peg$c75(s1);
    }
    s0 = s1;

    return s0;
  }

  function peg$parsesp() {
    var s0, s1;

    s0 = [];
    if (peg$c76.test(input.charAt(peg$currPos))) {
      s1 = input.charAt(peg$currPos);
      peg$currPos++;
    } else {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$c77); }
    }
    if (s1 !== peg$FAILED) {
      while (s1 !== peg$FAILED) {
        s0.push(s1);
        if (peg$c76.test(input.charAt(peg$currPos))) {
          s1 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c77); }
        }
      }
    } else {
      s0 = peg$FAILED;
    }

    return s0;
  }

  function peg$parsews() {
    var s0;

    s0 = peg$parsesp();
    if (s0 === peg$FAILED) {
      s0 = null;
    }

    return s0;
  }

                                              // "d" is for Dif
    let funcs1 = ["sin","cos","tan","sec","csc","cot","arcsin","arccos","arctan","e","log","ln","int","d"];

    let funcs2 = ["root","lim"];

    let funcs3 = ["sum","prod","defint"];

    function toAdt( f ) {
      return "'" + f.charAt(0).toUpperCase() + f.substring(1) + "'"; }

    function func1( f, u ) {
      return funcs1.includes(f) ? `[${toAdt(f)},${u}]` :           `['Fun','${f}',${u}]`; }

    function func2( f, u, v ) {
      return funcs2.includes(f) ? `[${toAdt(f)},${u},${v}]` :      `['Fun','${f}',${u},${v}]`; }

    function func3( f, u, v, w ) {
      return funcs3.includes(f) ? `[${toAdt(f)},${u},${v},${w}]` : `['Fun','${f}',${u},${v},${w}]`; }


  peg$result = peg$startRuleFunction();

  if (peg$result !== peg$FAILED && peg$currPos === input.length) {
    return peg$result;
  } else {
    if (peg$result !== peg$FAILED && peg$currPos < input.length) {
      peg$fail(peg$endExpectation());
    }

    throw peg$buildStructuredError(
      peg$maxFailExpected,
      peg$maxFailPos < input.length ? input.charAt(peg$maxFailPos) : null,
      peg$maxFailPos < input.length
        ? peg$computeLocation(peg$maxFailPos, peg$maxFailPos + 1)
        : peg$computeLocation(peg$maxFailPos, peg$maxFailPos)
    );
  }
}

let Ascii = { parse:peg$parse, error:peg$SyntaxError };

var Ptn;

Ptn = class Ptn {
  static toPtn(f) {
    var a, i, j, ref;
    a = void 0;
    if (f === 'String') {
      a = String;
    } else if (f === 'Number') {
      a = Number;
    } else if (f === '_') {
      a = _;
    } else if (typeof f === 'function') {
      a = [];
      if (f.name === 'Vec' || f.name === 'Mat') {
        a.push(f.name, REST);
      } else {
        // console.log( 'Ptn.toPtn() Vec', f.name, REST )
        a.push(f.name);
        for (i = j = 0, ref = f.length; (0 <= ref ? j < ref : j > ref); i = 0 <= ref ? ++j : --j) {
          a.push(_);
        }
      }
    } else {
      console.error('Ptn.toPtn() unknown pattern', f);
    }
    //console.log( 'Ptn.toPtn()', { f:f, ft:typeof(f), fa:Array.isArray(f), a:a, at:typeof(a), aa:Array.isArray(a) } )
    return a;
  }

  static type(ptn) {
    if (Array.isArray(ptn)) {
      return 'array';
    } else {
      return typeof ptn;
    }
  }

  static toPtns(adts) {
    var i, j, ptns, ref;
    // console.log( 'Ptn.toPtns() adts', adts )
    ptns = new Array(adts.length);
    for (i = j = 0, ref = adts.length; (0 <= ref ? j < ref : j > ref); i = 0 <= ref ? ++j : --j) {
      ptns[i] = i % 2 === 0 ? Ptn.toPtn(adts[i]) : adts[i];
    }
    // for i in [0...ptns.length] by 2
    //   console.log( 'Ptn.toPtns()', { ptn:ptns[i], type:Ptn.type(ptns[i]) } )
    return ptns;
  }

  static parse(ascii) {
    var ast, e, err, sst;
    sst = "X";
    ast = [];
    err = {};
    try {
      sst = Ascii.parse(ascii);
      try {
        ast = eval(sst);
      } catch (error) {
        e = error;
        console.error('Ptn.parse() eval  error', key, e);
      }
    } catch (error) {
      e = error;
      err.found = e.found;
      err.msg = e.message;
      err.loc = e.location;
      console.error('Ptn.doParse() parse error', {
        key: key,
        ascii: ascii,
        error: err
      });
    }
    return ast;
  }

  static toSst(ast) {
    var i, j, ref, sst;
    sst = "[";
    for (i = j = 0, ref = ast.length; (0 <= ref ? j < ref : j > ref); i = 0 <= ref ? ++j : --j) {
      if (!(ast[i] != null)) {
        continue;
      }
      sst += Array.isArray(ast[i]) ? Ptn.toSst(ast[i]) : ast[i].toString();
      if (i < ast.length - 1) {
        sst += ',';
      }
    }
    sst += "]";
    return sst;
  }

};

var Ptn$1 = Ptn;

var MathML;

MathML = class MathML {
  constructor() {
    this.parse = this.parse.bind(this);
    this.markup = this.markup.bind(this);
    this.key = "";
    this.math = {};
    this.ptns = this.doPtns();
  }

  parse(ascii, key) {
    var ast;
    ast = Ptn$1.parse(ascii);
    return this.markup(ast, key);
  }

  markup(ast, key) {
    this.key = key;
    this.math[this.key] = "";
    this.app("<math>");
    this.exp(ast);
    this.app("</math>");
    return this.math[this.key];
  }

  app(...args) {
    var arg, i, len;
    for (i = 0, len = args.length; i < len; i++) {
      arg = args[i];
      this.math[this.key] += arg;
    }
  }

  beg(t) {
    this.math[this.key] += `<${t}>`;
  }

  end(t) {
    this.math[this.key] += `</${t}>`;
  }

  tag(t, v) {
    this.math[this.key] += `<${t}>${v.toString()}</${t}>`;
  }

  bin(t, u, op, v) {
    this.beg(t);
    this.exp(u);
    this.beg('mo');
    this.app(op);
    this.end('mo');
    this.exp(v);
    this.end(t);
  }

  uni(op, u) {
    this.beg('mrow');
    this.beg('mo');
    this.app(op);
    this.end('mo');
    this.exp(u);
    this.end('mrow');
  }

  sur(bop, u, eop) {
    this.beg('mo');
    this.app(bop);
    this.end('mo');
    this.exp(u);
    this.beg('mo');
    this.app(eop);
    this.end('mo');
  }

  tuv(t, u, v) {
    this.beg(t);
    this.exp(u);
    this.exp(v);
    this.end(t);
  }

  fun(f, u) {
    this.beg('mrow');
    this.tag('mi', f);
    this.fen(u);
    this.end('mrow');
  }

  fen(u) {
    this.beg('mfenced');
    this.exp(u);
    this.end('mfenced');
  }

  vec(rest) {
    var e, i, len;
    this.beg("mfenced open='[' close=']'");
// MathML takes care of commans
    for (i = 0, len = rest.length; i < len; i++) {
      e = rest[i];
      this.exp(e);
    }
    this.end("mfenced");
  }

  unk(q) {
    console.log('_ MathML Unknown', q);
  }

  noop(arg) {
  }

  sum(t, a, b, sym, u) {
    this.beg(t);
    this.tag('mo', sym);
    this.exp(a);
    this.exp(b);
    this.end(t);
    this.exp(u);
  }

  // A little off for now
  lim(t, a, b, u) {
    this.beg(t);
    this.tag('mi', u);
    this.exp(a);
    this.exp(b);
    this.end(t);
  }

  latex(o) {
    var obj, uni;
    obj = Latex$1[o];
    uni = obj != null ? obj.uc : '?';
    this.tag('mo', uni);
  }

  exp(ast) {
    var e;
    try {
      // console.log( 'MathML.exp(asa)', asa )
      match(ast, ...this.ptns);
    } catch (error) {
      e = error;
      console.error('MathML.exp()', e);
    }
  }

  doPtns() {
    return Ptn$1.toPtns([
      A.Equ,
      (u,
      v) => {
        return this.bin('mrow',
      u,
      '=',
      v);
      },
      A.Add,
      (u,
      v) => {
        return this.bin('mrow',
      u,
      '+',
      v);
      },
      A.Sub,
      (u,
      v) => {
        return this.bin('mrow',
      u,
      '-',
      v);
      },
      A.Mul,
      (u,
      v) => {
        return this.bin('mrow',
      u,
      '*',
      v);
      },
      A.Div,
      (u,
      v) => {
        return this.tuv('mfrac',
      u,
      v);
      },
      A.Pow,
      (u,
      v) => {
        return this.tuv('msup',
      u,
      v);
      },
      A.Neg,
      (u) => {
        return this.uni('-',
      u);
      },
      A.Recip,
      (v) => {
        return this.tuv('mfrac',
      1,
      v);
      },
      A.Abs,
      (u) => {
        return this.sur('|',
      u,
      '|');
      },
      A.Paren,
      (u) => {
        return this.fen(u);
      },
      A.Brace,
      (u) => {
        return this.fen(u);
      },
      A.Ln,
      (u) => {
        return this.fun('ln',
      u);
      },
      A.Log,
      (u,
      v) => {
        return u + v;
      },
      A.Root,
      (u,
      v) => {
        return u + v;
      },
      A.Sqrt,
      (u) => {
        return this.tag('msqrt',
      u);
      },
      A.E,
      (u) => {
        return this.tuv('msup',
      'e',
      v);
      },
      A.Sin,
      (u) => {
        return this.fun('sin',
      u);
      },
      A.Cos,
      (u) => {
        return this.fun('cos',
      u);
      },
      A.Tan,
      (u) => {
        return this.fun('tan',
      u);
      },
      A.Csc,
      (u) => {
        return this.fun('csc',
      u);
      },
      A.Sec,
      (u) => {
        return this.fun('sec',
      u);
      },
      A.Cot,
      (u) => {
        return this.fun('cot',
      u);
      },
      A.Arcsin,
      (u) => {
        return this.fun('arcsin',
      u);
      },
      A.Arccos,
      (u) => {
        return this.fun('arccot',
      u);
      },
      A.Arctan,
      (u) => {
        return this.fun('arctan',
      u);
      },
      A.Arccsc,
      (u) => {
        return this.fun('arccsc',
      u);
      },
      A.Arcsec,
      (u) => {
        return this.fun('arcsec',
      u);
      },
      A.Arccot,
      (u) => {
        return this.fun('arccot',
      u);
      },
      A.Fun,
      (f,
      u) => {
        return this.fun(f,
      u);
      },
      A.D,
      (u) => {
        return this.uni('d',
      u); // @dd;
      },
      A.Int,
      (u) => {
        return this.uni('\u222B',
      u);
      },
      A.DefInt,
      (a,
      b,
      u) => {
        return this.sum('msubsup',
      a,
      b,
      '\u222B',
      u);
      },
      A.Sum,
      (a,
      b,
      u) => {
        return this.sum('munderover',
      a,
      b,
      '\u2211',
      u);
      },
      A.Sus,
      (u,
      v) => {
        return this.tuv('msub',
      u,
      v);
      },
      A.Lim,
      (a,
      b) => {
        return this.lim('msubsup',
      a,
      b,
      'lim');
      },
      A.Ratio,
      (u,
      v) => {
        return this.tuv('mfrac',
      u,
      v);
      },
      A.Vec,
      (rest) => {
        return this.vec(rest);
      },
      A.Mat,
      (rest) => {
        return this.vec(rest);
      },
      A.Latex,
      (o) => {
        return this.latex(o);
      },
      'String',
      (s) => {
        return this.tag('mi',
      s); // Using String identifiers
      },
      'Number',
      (n) => {
        return this.tag('mn',
      n);
      },
      '_',
      (q) => {
        return this.unk(q);
      }
    ]);
  }

};

var MathML$1 = MathML;

var Basics, Exps,
  hasProp = {}.hasOwnProperty;

Exps = {
  Par1: {
    asc: "(a+b)*(c^2)",
    klass: "",
    mathML: ""
  },
  Trg1: {
    asc: "cos(x)+sin(x)",
    klass: "",
    mathML: ""
  },
  Sus1: {
    asc: "x_1 + x_2",
    klass: "",
    mathML: ""
  },
  Mul1: {
    asc: "(2.2+3)*(1+2)",
    klass: "",
    mathML: ""
  },
  Add2: {
    asc: "2.2*3+4*3",
    klass: "",
    mathML: ""
  },
  Tan1: {
    asc: "2.2*3+x*arctan(y)",
    klass: "",
    mathML: ""
  },
  Sub1: {
    asc: "2.2*3-x^y",
    klass: "",
    mathML: ""
  },
  Equ2: {
    asc: "2.2^3 = x/y",
    klass: "",
    mathML: ""
  },
  Sub2: {
    asc: "-2.2 * 3-x / -y",
    klass: "",
    mathML: ""
  },
  Mul3: {
    asc: "x*x*(a+b_1)",
    klass: "",
    mathML: ""
  },
  Sin2: {
    asc: "a+b*sin(\\theta)",
    klass: "",
    mathML: ""
  },
  Fun1: {
    asc: "fn(a+b)*g(theta)",
    klass: "",
    mathML: ""
  },
  Int1: {
    asc: "int(x*2)",
    klass: "",
    mathML: ""
  },
  Vec1: {
    asc: "[1,2,3]",
    klass: "",
    mathML: ""
  },
  Mat1: {
    asc: "[[1,2,3],[4,5,6]]",
    klass: "",
    mathML: ""
  },
  Lim1: {
    asc: "lim_i^n",
    klass: "",
    mathML: ""
  },
  Sum2: {
    asc: "sum_i^n~j",
    klass: "",
    mathML: ""
  },
  Sum3: {
    asc: "sum_i^n~j+1",
    klass: "",
    mathML: ""
  }
};

Basics = class Basics {
  constructor() {
    this.mathML = new MathML$1();
    this.ncol = 3;
  }

  math(exps = Exps) {
    var exp, key;
    for (key in exps) {
      if (!hasProp.call(exps, key)) continue;
      exp = exps[key];
      this.mathExp(key, exp);
    }
    return exps;
  }

  mathExp(key, exp) {
    exp.mathML = this.mathML.parse(exp.asc, key);
  }

};

var Basics$1 = Basics;

//

let MathML$2 = {

  extends: MathND$1,

  components:{ 'd-dabs':Dabs },

  data() {
    return { comp:'MathML', key:'Basics', exps:{}, pages:{
        Basics: { title:'Basics', key:'Basics', create:Basics$1, obj:null }
      } } },
  
};

/* script */
const __vue_script__$2 = MathML$2;

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
  

  
  var MathML$3 = normalizeComponent_1(
    {},
    __vue_inject_styles__$2,
    __vue_script__$2,
    __vue_scope_id__$2,
    __vue_is_functional_template__$2,
    __vue_module_identifier__$2,
    undefined,
    undefined
  );

export default MathML$3;
