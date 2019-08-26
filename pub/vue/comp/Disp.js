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

  props: { comp:String, pages:Array },
  
  data() { return { page:"" } },
  
  methods: {
    onPage: function (obj) {
      this.page = obj.page; },
    doPage: function (page) {
      this.nav().pub( { page:page.page } ); },
    clPage: function (page) {
      return this.page===page ? 'tab-active' : 'tab'; } },
  
  mounted: function() {
    this.subscribe(  "Nav", 'Page', (obj) => {
      this.onPage(obj); } ); }
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
    { staticClass: "tabs" },
    [
      _vm._l(_vm.pages, function(page) {
        return [
          _c(
            "div",
            {
              class: _vm.clPage(page.page),
              on: {
                click: function($event) {
                  return _vm.doPage(page)
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
    inject("data-v-5a6329eb_0", { source: ".theme-logo {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-menu {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-find {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-tocs {\n  background-color: black;\n  font-size: 2.5rem;\n}\n.theme-view {\n  font-size: 1.5rem;\n}\n.theme-side {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-pref {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-foot {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-trak {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-prac {\n  background-color: #603;\n  font-size: 2rem;\n}\n.theme-icon {\n  background-color: #333;\n  border-radius: 36px;\n  width: 80%;\n  height: 90%;\n}\n.tabs {\n  position: absolute;\n  left: 0;\n  top: 0;\n  width: 100%;\n  height: 5%;\n  background-color: black;\n  font-size: 1.5rem;\n}\n.tabs .tab {\n  display: inline-block;\n  margin-left: 2rem;\n  padding: 0.2rem 0.3rem 0.1rem 0.3rem;\n  border-radius: 12px 12px 0 0;\n  border-left: wheat solid thin;\n  border-top: wheat solid thin;\n  border-right: wheat solid thin;\n  background-color: black;\n  color: wheat;\n}\n.tabs .tab:hover {\n  background-color: wheat;\n  color: black;\n}\n.tabs .tab-active {\n  display: inline-block;\n  margin-left: 2rem;\n  padding: 0.2rem 0.3rem 0.1rem 0.3rem;\n  border-radius: 12px 12px 0 0;\n  border-left: wheat solid thin;\n  border-top: wheat solid thin;\n  border-right: wheat solid thin;\n  background-color: black;\n  color: wheat;\n  background-color: wheat;\n  color: black;\n}\n", map: {"version":3,"sources":["Tabs.vue","/Users/ax/Documents/prj/aug/vue/elem/Tabs.vue"],"names":[],"mappings":"AAAA;EACE,uBAAuB;EACvB,iBAAiB;AACnB;AACA;EACE,uBAAuB;EACvB,iBAAiB;AACnB;AACA;EACE,uBAAuB;EACvB,iBAAiB;AACnB;AACA;EACE,uBAAuB;EACvB,iBAAiB;AACnB;AACA;EACE,iBAAiB;AACnB;AACA;EACE,uBAAuB;EACvB,iBAAiB;AACnB;AACA;EACE,uBAAuB;EACvB,iBAAiB;AACnB;AACA;EACE,uBAAuB;EACvB,iBAAiB;AACnB;AACA;EACE,uBAAuB;EACvB,iBAAiB;ACCnB;ADCA;ECCA,sBAAA;EACA,eAAA;AACA;AACA;EACA,sBAAA;EACA,mBAAA;EACA,UAAA;EACA,WAAA;ADCA;AACA;EACE,kBAAkB;EAClB,OAAO;EACP,MAAM;EACN,WAAW;EACX,UAAU;EACV,uBAAuB;EACvB,iBAAiB;AACnB;AACA;EACE,qBAAqB;EACrB,iBAAiB;EACjB,oCAAoC;EACpC,4BAA4B;EAC5B,6BAA6B;EAC7B,4BAA4B;EAC5B,8BAA8B;EAC9B,uBAAuB;EACvB,YAAY;AACd;AACA;EACE,uBAAuB;EACvB,YAAY;AACd;AACA;EACE,qBAAqB;EACrB,iBAAiB;EACjB,oCAAoC;EACpC,4BAA4B;EAC5B,6BAA6B;EAC7B,4BAA4B;EAC5B,8BAA8B;EAC9B,uBAAuB;EACvB,YAAY;EACZ,uBAAuB;EACvB,YAAY;AACd","file":"Tabs.vue","sourcesContent":[".theme-logo {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-menu {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-find {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-tocs {\n  background-color: black;\n  font-size: 2.5rem;\n}\n.theme-view {\n  font-size: 1.5rem;\n}\n.theme-side {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-pref {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-foot {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-trak {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-prac {\n  background-color: #603;\n  font-size: 2rem;\n}\n.theme-icon {\n  background-color: #333;\n  border-radius: 36px;\n  width: 80%;\n  height: 90%;\n}\n.tabs {\n  position: absolute;\n  left: 0;\n  top: 0;\n  width: 100%;\n  height: 5%;\n  background-color: black;\n  font-size: 1.5rem;\n}\n.tabs .tab {\n  display: inline-block;\n  margin-left: 2rem;\n  padding: 0.2rem 0.3rem 0.1rem 0.3rem;\n  border-radius: 12px 12px 0 0;\n  border-left: wheat solid thin;\n  border-top: wheat solid thin;\n  border-right: wheat solid thin;\n  background-color: black;\n  color: wheat;\n}\n.tabs .tab:hover {\n  background-color: wheat;\n  color: black;\n}\n.tabs .tab-active {\n  display: inline-block;\n  margin-left: 2rem;\n  padding: 0.2rem 0.3rem 0.1rem 0.3rem;\n  border-radius: 12px 12px 0 0;\n  border-left: wheat solid thin;\n  border-top: wheat solid thin;\n  border-right: wheat solid thin;\n  background-color: black;\n  color: wheat;\n  background-color: wheat;\n  color: black;\n}\n","\n<template>\n  <div class=\"tabs\">\n    <template v-for=\"page in pages\">\n      <div :class=\"clPage(page.page)\" @click=\"doPage(page)\">{{page.title}}</div>\n    </template>\n  </div>\n</template>\n\n<script type=\"module\">\n\n  export default {\n\n    props: { comp:String, pages:Array },\n    \n    data() { return { page:\"\" } },\n    \n    methods: {\n      onPage: function (obj) {\n        this.page = obj.page; },\n      doPage: function (page) {\n        this.nav().pub( { page:page.page } ); },\n      clPage: function (page) {\n        return this.page===page ? 'tab-active' : 'tab'; } },\n    \n    mounted: function() {\n      this.subscribe(  \"Nav\", 'Page', (obj) => {\n        this.onPage(obj); } ); }\n    }\n  \n</script>\n\n<style lang=\"less\">\n  \n  @import '../../pub/css/themes/theme.less';\n  \n  .tabs { position:absolute; left:0; top:0; width:100%; height:5%;\n          background-color:@theme-back; font-size:@theme-tab-size;\n    .tab { display:inline-block; margin-left:2.0rem; padding:0.2rem 0.3rem 0.1rem 0.3rem;\n      border-radius:12px 12px 0 0; border-left: @theme-color solid thin;\n      border-top:@theme-color solid thin; border-right:@theme-color solid thin;\n                  background-color:@theme-back;  color:@theme-color;}\n    .tab:hover  {         background-color:@theme-color; color:@theme-back; }\n    .tab-active { .tab(); background-color:@theme-color; color:@theme-back; } }\n  \n</style>"]}, media: undefined });

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

//
//
//
//
//
//
//
//


let Icon = {
  
  props: { comp:String, prac:Object },
  
  data() { return { } },
  
  methods: {
    
    isPage:  function () {
      return this.nav().page === 'Icon'; },
    doPrac: function (name) {
      publish( this.comp, name ); } },
      
  mounted: function () {} };

/* script */
const __vue_script__$1 = Icon;

/* template */
var __vue_render__$1 = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c(
    "div",
    {
      staticClass: "icon",
      attrs: { prac: "prac" },
      on: {
        click: function($event) {
          return _vm.doPrac(_vm.prac)
        }
      }
    },
    [
      _c("i", { class: _vm.prac.icon }),
      _vm._v(" "),
      _c("div", { staticClass: "name" }, [_vm._v(_vm._s(_vm.prac.name))])
    ]
  )
};
var __vue_staticRenderFns__$1 = [];
__vue_render__$1._withStripped = true;

  /* style */
  const __vue_inject_styles__$1 = function (inject) {
    if (!inject) return
    inject("data-v-5ec5ded0_0", { source: ".theme-logo {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-menu {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-find {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-tocs {\n  background-color: black;\n  font-size: 2.5rem;\n}\n.theme-view {\n  font-size: 1.5rem;\n}\n.theme-side {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-pref {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-foot {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-trak {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-prac {\n  background-color: #603;\n  font-size: 2rem;\n}\n.theme-icon {\n  background-color: #333;\n  border-radius: 36px;\n  width: 80%;\n  height: 90%;\n}\n.icon {\n  display: grid;\n  align-self: stretch;\n  justify-self: stretch;\n  align-items: center;\n  justify-items: center;\n  background-color: black;\n  color: wheat;\n  font-size: 7rem;\n  text-align: center;\n  background-color: #333;\n  border-radius: 36px;\n  width: 80%;\n  height: 90%;\n}\n.icon .name {\n  font-size: 1.4rem;\n  text-align: center;\n}\n", map: {"version":3,"sources":["Icon.vue","/Users/ax/Documents/prj/aug/vue/comp/Icon.vue"],"names":[],"mappings":"AAAA;EACE,uBAAuB;EACvB,iBAAiB;AACnB;AACA;EACE,uBAAuB;EACvB,iBAAiB;AACnB;AACA;EACE,uBAAuB;EACvB,iBAAiB;AACnB;AACA;EACE,uBAAuB;EACvB,iBAAiB;AACnB;AACA;EACE,iBAAiB;AACnB;AACA;EACE,uBAAuB;EACvB,iBAAiB;AACnB;AACA;EACE,uBAAuB;EACvB,iBAAiB;AACnB;AACA;EACE,uBAAuB;EACvB,iBAAiB;ACCnB;AACA;EACA,uBAAA;EACA,iBAAA;ADCA;AACA;EACE,sBAAsB;EACtB,eAAe;AACjB;AACA;EACE,sBAAsB;EACtB,mBAAmB;EACnB,UAAU;EACV,WAAW;AACb;AACA;EACE,aAAa;EACb,mBAAmB;EACnB,qBAAqB;EACrB,mBAAmB;EACnB,qBAAqB;EACrB,uBAAuB;EACvB,YAAY;EACZ,eAAe;EACf,kBAAkB;EAClB,sBAAsB;EACtB,mBAAmB;EACnB,UAAU;EACV,WAAW;AACb;AACA;EACE,iBAAiB;EACjB,kBAAkB;AACpB","file":"Icon.vue","sourcesContent":[".theme-logo {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-menu {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-find {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-tocs {\n  background-color: black;\n  font-size: 2.5rem;\n}\n.theme-view {\n  font-size: 1.5rem;\n}\n.theme-side {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-pref {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-foot {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-trak {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-prac {\n  background-color: #603;\n  font-size: 2rem;\n}\n.theme-icon {\n  background-color: #333;\n  border-radius: 36px;\n  width: 80%;\n  height: 90%;\n}\n.icon {\n  display: grid;\n  align-self: stretch;\n  justify-self: stretch;\n  align-items: center;\n  justify-items: center;\n  background-color: black;\n  color: wheat;\n  font-size: 7rem;\n  text-align: center;\n  background-color: #333;\n  border-radius: 36px;\n  width: 80%;\n  height: 90%;\n}\n.icon .name {\n  font-size: 1.4rem;\n  text-align: center;\n}\n","\n<template>\n  <div  class=\"icon\" prac=\"prac\" @click=\"doPrac(prac)\">\n    <i  :class=\"prac.icon\"></i>\n    <div class=\"name\">{{prac.name}}</div>\n  </div>\n</template>\n\n<script type=\"module\">\n  \n  let Icon = {\n    \n    props: { comp:String, prac:Object },\n    \n    data() { return { } },\n    \n    methods: {\n      \n      isPage:  function () {\n        return this.nav().page === 'Icon'; },\n      doPrac: function (name) {\n        publish( this.comp, name ); } },\n        \n    mounted: function () {} }\n\n  export default Icon;\n  \n</script>\n\n<style lang=\"less\">\n  @import '../../pub/css/themes/theme.less';\n  .icon { display:grid; align-self:stretch; justify-self:stretch; align-items:center; justify-items:center;\n    background-color:@theme-back; color:@theme-color; font-size:@theme-icon-size; text-align:center; .theme-icon;\n    .name { font-size:@theme-name-size; text-align:center; } }\n</style>"]}, media: undefined });

  };
  /* scoped */
  const __vue_scope_id__$1 = undefined;
  /* module identifier */
  const __vue_module_identifier__$1 = undefined;
  /* functional template */
  const __vue_is_functional_template__$1 = false;
  /* style inject SSR */
  

  
  var Icon$1 = normalizeComponent_1(
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


let Dirs = {

  props: { comp:String, prac:Object },

  data() { return { disp:"All" } },

  methods: {

    isPage:  function () {
      return this.nav().page === 'Dirs'; },
    isDisp: function (disp) {
      return this.disp===disp || this.disp==='All' },
    doPrac: function (prac) {
      publish( this.comp, prac ); },
    doDisp: function (prac,disp) {
      this.publish( this.comp, { prac:prac, disp:disp } ); },
    pracDir: function(dir) {
      return this.prac==='All' ? dir : 'pracFull'; },
    dispDir: function(dir) {
      return this.disp==='All' ? dir : 'dispFull'; },
    areaDir: function() {
      return this.prac==='All' ? 'none' : 'area' },
    style: function( hsv ) {
      return { backgroundColor:this.toRgbaHsv(hsv) }; } },

  mounted: function () {}
};

/* script */
const __vue_script__$2 = Dirs;

/* template */
var __vue_render__$2 = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c(
    "div",
    { staticClass: "dirs", attrs: { prac: "prac" } },
    [
      _c("div", { class: _vm.dispDir("cen"), style: _vm.style(_vm.prac.hsv) }, [
        _c(
          "div",
          {
            staticClass: "disp",
            on: {
              click: function($event) {
                return _vm.doPrac(_vm.prac)
              }
            }
          },
          [
            _c("i", { class: _vm.prac.icon }),
            _vm._v(" "),
            _c("span", { staticClass: "name" }, [
              _vm._v(_vm._s(_vm.prac.name))
            ]),
            _vm._v(" "),
            _c("span", { staticClass: "desc" }, [_vm._v(_vm._s(_vm.prac.desc))])
          ]
        )
      ]),
      _vm._v(" "),
      _vm._l(_vm.prac.disps, function(disp) {
        return [
          _c(
            "div",
            {
              directives: [
                {
                  name: "show",
                  rawName: "v-show",
                  value: _vm.isDisp(disp.name),
                  expression: "isDisp(disp.name)"
                }
              ],
              ref: disp.name,
              refInFor: true,
              class: _vm.dispDir(disp.dir),
              style: _vm.style(disp.hsv),
              attrs: { title: disp.name }
            },
            [
              _c(
                "div",
                {
                  staticClass: "disp",
                  on: {
                    click: function($event) {
                      return _vm.doDisp(_vm.prac.name, disp.name)
                    }
                  }
                },
                [
                  _c("i", { class: disp.icon }),
                  _vm._v(" "),
                  _c("span", { staticClass: "name" }, [
                    _vm._v(_vm._s(disp.name))
                  ]),
                  _vm._v(" "),
                  _c("span", { staticClass: "desc" }, [
                    _vm._v(_vm._s(disp.desc))
                  ])
                ]
              )
            ]
          )
        ]
      })
    ],
    2
  )
};
var __vue_staticRenderFns__$2 = [];
__vue_render__$2._withStripped = true;

  /* style */
  const __vue_inject_styles__$2 = function (inject) {
    if (!inject) return
    inject("data-v-0953c155_0", { source: ".theme-logo {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-menu {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-find {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-tocs {\n  background-color: black;\n  font-size: 2.5rem;\n}\n.theme-view {\n  font-size: 1.5rem;\n}\n.theme-side {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-pref {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-foot {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-trak {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-prac {\n  background-color: #603;\n  font-size: 2rem;\n}\n.theme-icon {\n  background-color: #333;\n  border-radius: 36px;\n  width: 80%;\n  height: 90%;\n}\n.dirs {\n  align-self: stretch;\n  justify-self: stretch;\n  align-items: center;\n  justify-items: center;\n  background-color: black;\n  color: wheat;\n  text-align: center;\n  border-radius: 36px;\n  width: 90%;\n  height: 80%;\n  font-weight: bold;\n  background-color: #603;\n  font-size: 2rem;\n  display: grid;\n  grid-template-columns: 1fr 1fr 1fr;\n  grid-template-rows: 1fr 1fr 1fr;\n  grid-template-areas: \"nw north ne\" \"west cen east\" \"sw south se\";\n}\n.dirs .north {\n  display: grid;\n  grid-area: north;\n  justify-self: stretch;\n  align-self: stretch;\n  border-radius: 36px;\n}\n.dirs .west {\n  display: grid;\n  grid-area: west;\n  justify-self: stretch;\n  align-self: stretch;\n  border-radius: 36px;\n}\n.dirs .cen {\n  display: grid;\n  grid-area: cen;\n  justify-self: stretch;\n  align-self: stretch;\n  border-radius: 36px;\n}\n.dirs .east {\n  display: grid;\n  grid-area: east;\n  justify-self: stretch;\n  align-self: stretch;\n  border-radius: 36px;\n}\n.dirs .south {\n  display: grid;\n  grid-area: south;\n  justify-self: stretch;\n  align-self: stretch;\n  border-radius: 36px;\n}\n.dirs .cen {\n  font-size: 1.6rem;\n}\n.disp {\n  display: inline;\n  justify-self: center;\n  align-self: center;\n  text-align: center;\n  font-size: 1.6rem;\n}\n.disp i {\n  display: inline-block;\n  margin-right: 0.25rem;\n}\n.disp .name {\n  display: inline-block;\n}\n.disp .desc {\n  display: none;\n  margin: 0.5rem 0.5rem 0.5rem 0.5rem;\n  text-align: left;\n}\n.pracFull {\n  position: absolute;\n  left: 3%;\n  top: 6%;\n  right: 3%;\n  bottom: 6%;\n  display: grid;\n}\n.pracFull .prac {\n  font-size: 2.5rem;\n  width: 100%;\n  height: 100%;\n  justify-self: center;\n  align-self: center;\n  display: grid;\n  border-radius: 0.5rem;\n}\n.pracFull .prac div {\n  padding-bottom: 2rem;\n}\n.pracFull .prac div .disp {\n  padding-bottom: 0;\n}\n.pracFull .prac div .disp i {\n  font-size: 1.6rem;\n}\n.pracFull .prac div .disp .name {\n  font-size: 1.6rem;\n}\n.pracFull .prac div .disp .desc {\n  font-size: 1.6rem;\n  display: block;\n}\n.pracFull .prac .area {\n  padding-bottom: 0;\n}\n.dispFull {\n  position: absolute;\n  left: 3%;\n  top: 6%;\n  right: 3%;\n  bottom: 6%;\n  display: grid;\n  border-radius: 72px;\n}\n.dispFull .disp {\n  justify-self: center;\n  margin: 0;\n}\n.dispFull .disp i {\n  font-size: 1.6rem !important;\n}\n.dispFull .disp .name {\n  font-size: 1.6rem !important;\n}\n.dispFull .disp .desc {\n  font-size: 1.6rem !important;\n  display: block;\n}\n.dispFull .area {\n  font-size: 1.6rem !important;\n  padding-bottom: 0;\n}\n", map: {"version":3,"sources":["Dirs.vue","/Users/ax/Documents/prj/aug/vue/comp/Dirs.vue"],"names":[],"mappings":"AAAA;EACE,uBAAuB;EACvB,iBAAiB;AACnB;AACA;EACE,uBAAuB;EACvB,iBAAiB;AACnB;AACA;EACE,uBAAuB;EACvB,iBAAiB;AACnB;AACA;EACE,uBAAuB;EACvB,iBAAiB;AACnB;AACA;EACE,iBAAiB;AACnB;AACA;EACE,uBAAuB;EACvB,iBAAiB;AACnB;AACA;EACE,uBAAuB;EACvB,iBAAiB;AACnB;AACA;EACE,uBAAuB;EACvB,iBAAiB;AACnB;AACA;EACE,uBAAuB;EACvB,iBAAiB;AACnB;AACA;EACE,sBAAsB;EACtB,eAAe;AACjB;AACA;EACE,sBAAsB;EACtB,mBAAmB;EACnB,UAAU;EACV,WAAW;AACb;AACA;EACE,mBAAmB;EACnB,qBAAqB;EACrB,mBAAmB;EACnB,qBAAqB;EACrB,uBAAuB;EACvB,YAAY;EACZ,kBAAkB;EAClB,mBAAmB;EACnB,UAAU;EACV,WAAW;EACX,iBAAiB;EACjB,sBAAsB;EACtB,eAAe;ECCjB,aAAA;EDCE,kCAAkC;EAClC,+BAA+B;EAC/B,gEAAgE;ACClE;AACA;EDCE,aAAa;ECCf,gBAAA;EDCE,qBAAqB;ECCvB,mBAAA;EACA,mBAAA;AACA;ADCA;ECCA,aAAA;EACA,eAAA;EACA,qBAAA;EACA,mBAAA;EACA,mBAAA;ADCA;ACCA;EACA,aAAA;EACA,cAAA;EACA,qBAAA;EDCE,mBAAmB;EACnB,mBAAmB;ACCrB;AACA;EACA,aAAA;EACA,eAAA;EACA,qBAAA;EACA,mBAAA;EACA,mBAAA;AACA;AACA;EACA,aAAA;EDCE,gBAAgB;ECClB,qBAAA;EACA,mBAAA;EACA,mBAAA;AACA;AACA;EACA,iBAAA;AACA;AACA;EDCE,eAAe;EACf,oBAAoB;EACpB,kBAAkB;EAClB,kBAAkB;EAClB,iBAAiB;AACnB;AACA;EACE,qBAAqB;EACrB,qBAAqB;AACvB;AACA;EACE,qBAAqB;AACvB;AACA;EACE,aAAa;EACb,mCAAmC;EACnC,gBAAgB;AAClB;AACA;EACE,kBAAkB;EAClB,QAAQ;EACR,OAAO;EACP,SAAS;EACT,UAAU;EACV,aAAa;AACf;AACA;EACE,iBAAiB;EACjB,WAAW;EACX,YAAY;EACZ,oBAAoB;EACpB,kBAAkB;EAClB,aAAa;EACb,qBAAqB;AACvB;AACA;EACE,oBAAoB;AACtB;AACA;EACE,iBAAiB;AACnB;AACA;EACE,iBAAiB;AACnB;AACA;EACE,iBAAiB;AACnB;AACA;EACE,iBAAiB;EACjB,cAAc;AAChB;AACA;EACE,iBAAiB;AACnB;AACA;EACE,kBAAkB;EAClB,QAAQ;EACR,OAAO;EACP,SAAS;EACT,UAAU;EACV,aAAa;EACb,mBAAmB;AACrB;AACA;EACE,oBAAoB;EACpB,SAAS;AACX;AACA;EACE,4BAA4B;AAC9B;AACA;EACE,4BAA4B;AAC9B;AACA;EACE,4BAA4B;EAC5B,cAAc;AAChB;AACA;EACE,4BAA4B;EAC5B,iBAAiB;AACnB","file":"Dirs.vue","sourcesContent":[".theme-logo {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-menu {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-find {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-tocs {\n  background-color: black;\n  font-size: 2.5rem;\n}\n.theme-view {\n  font-size: 1.5rem;\n}\n.theme-side {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-pref {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-foot {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-trak {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-prac {\n  background-color: #603;\n  font-size: 2rem;\n}\n.theme-icon {\n  background-color: #333;\n  border-radius: 36px;\n  width: 80%;\n  height: 90%;\n}\n.dirs {\n  align-self: stretch;\n  justify-self: stretch;\n  align-items: center;\n  justify-items: center;\n  background-color: black;\n  color: wheat;\n  text-align: center;\n  border-radius: 36px;\n  width: 90%;\n  height: 80%;\n  font-weight: bold;\n  background-color: #603;\n  font-size: 2rem;\n  display: grid;\n  grid-template-columns: 1fr 1fr 1fr;\n  grid-template-rows: 1fr 1fr 1fr;\n  grid-template-areas: \"nw north ne\" \"west cen east\" \"sw south se\";\n}\n.dirs .north {\n  display: grid;\n  grid-area: north;\n  justify-self: stretch;\n  align-self: stretch;\n  border-radius: 36px;\n}\n.dirs .west {\n  display: grid;\n  grid-area: west;\n  justify-self: stretch;\n  align-self: stretch;\n  border-radius: 36px;\n}\n.dirs .cen {\n  display: grid;\n  grid-area: cen;\n  justify-self: stretch;\n  align-self: stretch;\n  border-radius: 36px;\n}\n.dirs .east {\n  display: grid;\n  grid-area: east;\n  justify-self: stretch;\n  align-self: stretch;\n  border-radius: 36px;\n}\n.dirs .south {\n  display: grid;\n  grid-area: south;\n  justify-self: stretch;\n  align-self: stretch;\n  border-radius: 36px;\n}\n.dirs .cen {\n  font-size: 1.6rem;\n}\n.disp {\n  display: inline;\n  justify-self: center;\n  align-self: center;\n  text-align: center;\n  font-size: 1.6rem;\n}\n.disp i {\n  display: inline-block;\n  margin-right: 0.25rem;\n}\n.disp .name {\n  display: inline-block;\n}\n.disp .desc {\n  display: none;\n  margin: 0.5rem 0.5rem 0.5rem 0.5rem;\n  text-align: left;\n}\n.pracFull {\n  position: absolute;\n  left: 3%;\n  top: 6%;\n  right: 3%;\n  bottom: 6%;\n  display: grid;\n}\n.pracFull .prac {\n  font-size: 2.5rem;\n  width: 100%;\n  height: 100%;\n  justify-self: center;\n  align-self: center;\n  display: grid;\n  border-radius: 0.5rem;\n}\n.pracFull .prac div {\n  padding-bottom: 2rem;\n}\n.pracFull .prac div .disp {\n  padding-bottom: 0;\n}\n.pracFull .prac div .disp i {\n  font-size: 1.6rem;\n}\n.pracFull .prac div .disp .name {\n  font-size: 1.6rem;\n}\n.pracFull .prac div .disp .desc {\n  font-size: 1.6rem;\n  display: block;\n}\n.pracFull .prac .area {\n  padding-bottom: 0;\n}\n.dispFull {\n  position: absolute;\n  left: 3%;\n  top: 6%;\n  right: 3%;\n  bottom: 6%;\n  display: grid;\n  border-radius: 72px;\n}\n.dispFull .disp {\n  justify-self: center;\n  margin: 0;\n}\n.dispFull .disp i {\n  font-size: 1.6rem !important;\n}\n.dispFull .disp .name {\n  font-size: 1.6rem !important;\n}\n.dispFull .disp .desc {\n  font-size: 1.6rem !important;\n  display: block;\n}\n.dispFull .area {\n  font-size: 1.6rem !important;\n  padding-bottom: 0;\n}\n","\n<template>\n  <div class=\"dirs\" prac=\"prac\">\n    <div :class=\"dispDir('cen')\" :style=\"style(prac.hsv)\">\n      <div class=\"disp\" @click=\"doPrac(prac)\">\n        <i   :class=\"prac.icon\"></i>\n        <span class=\"name\">{{prac.name}}</span>\n        <span class=\"desc\">{{prac.desc}}</span>\n      </div>\n    </div>\n    <template  v-for=\"disp in prac.disps\">\n      <div v-show=\"isDisp(disp.name)\" :class=\"dispDir(disp.dir)\" :style=\"style(disp.hsv)\"\n        :ref=\"disp.name\" :title=\"disp.name\">\n        <div class=\"disp\" @click=\"doDisp(prac.name,disp.name)\">\n          <i   :class=\"disp.icon\"></i>\n          <span class=\"name\">{{disp.name}}</span>\n          <span class=\"desc\">{{disp.desc}}</span>\n        </div>\n      </div>\n    </template>\n  </div>\n</template>\n\n<script type=\"module\">\n\n  let Dirs = {\n\n    props: { comp:String, prac:Object },\n\n    data() { return { disp:\"All\" } },\n\n    methods: {\n\n      isPage:  function () {\n        return this.nav().page === 'Dirs'; },\n      isDisp: function (disp) {\n        return this.disp===disp || this.disp==='All' },\n      doPrac: function (prac) {\n        publish( this.comp, prac ); },\n      doDisp: function (prac,disp) {\n        this.publish( this.comp, { prac:prac, disp:disp } ); },\n      pracDir: function(dir) {\n        return this.prac==='All' ? dir : 'pracFull'; },\n      dispDir: function(dir) {\n        return this.disp==='All' ? dir : 'dispFull'; },\n      areaDir: function() {\n        return this.prac==='All' ? 'none' : 'area' },\n      style: function( hsv ) {\n        return { backgroundColor:this.toRgbaHsv(hsv) }; } },\n\n    mounted: function () {}\n  }\n\n  export default Dirs;\n\n</script>\n\n<style lang=\"less\">\n  \n  @import '../../pub/css/themes/theme.less';\n  \n  \n\n  .grid3x3() { display:grid; grid-template-columns:1fr 1fr 1fr; grid-template-rows:1fr 1fr 1fr;\n    grid-template-areas: \"nw north ne\" \"west cen east\" \"sw south se\"; }\n\n  .ddir( @dir ) { display:grid; grid-area:@dir; justify-self:stretch; align-self:stretch; border-radius:36px; }\n  \n  .dirs { display:grid; align-self:stretch; justify-self:stretch; align-items:center; justify-items:center;\n    background-color:@theme-back; color:@theme-color; text-align:center;\n    border-radius:36px; width:90%; height:80%; font-weight:bold; .theme-prac();\n    \n      .grid3x3(); // The 4 Displine plus Practiice name Grid\n                             .north { .ddir(north); }\n      .west { .ddir(west); } .cen   { .ddir(cen);   } .east { .ddir(east); }\n                             .south { .ddir(south); }\n      .cen  { font-size:@theme-cen-size; } }\n\n    .disp {   display:inline; justify-self:center; align-self:center; text-align:center; font-size:@theme-disp-size;\n      i     { display:inline-block;  margin-right: 0.25rem; }\n      .name { display:inline-block; }\n      .desc { display:none; margin:0.5rem 0.5rem 0.5rem 0.5rem; text-align:left; } }\n\n   \n    // Placed one level above .prac at the 9 Practices Grid Direction\n    .pracFull { position:absolute; left:3%; top:6%; right:3%; bottom:6%; display:grid;\n      .prac { font-size:@theme-full-size; width:100%; height:100%;\n        justify-self:center; align-self:center; display:grid; border-radius:0.5rem;\n        div {     padding-bottom:2rem;\n          .disp { padding-bottom:0;\n            i     { font-size:@theme-disp-size; }\n            .name { font-size:@theme-disp-size; }\n            .desc { font-size:@theme-disp-size; display:block; } } }  // Turns on .disp .desc\n        .area { padding-bottom:0; } } }\n    \n    // May not belong here\n    // Placed one level above .dir at the 4 Disipline plus Practice name Grid Direction\n    .dispFull { position:absolute; left:3%; top:6%; right:3%; bottom:6%; display:grid; border-radius:72px;\n      .disp { justify-self:center; margin:0;\n        i     { font-size:@theme-area-icon-size !important; }\n        .name { font-size:@theme-area-name-size !important; }\n        .desc { font-size:@theme-area-desc-size !important; display:block; } }  // Turns on .disp .desc\n      .area {   font-size:@theme-area-area-size !important; padding-bottom:0; } }\n  \n</style>"]}, media: undefined });

  };
  /* scoped */
  const __vue_scope_id__$2 = undefined;
  /* module identifier */
  const __vue_module_identifier__$2 = undefined;
  /* functional template */
  const __vue_is_functional_template__$2 = false;
  /* style inject SSR */
  

  
  var Dirs$1 = normalizeComponent_1(
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


let Summ = {

  props: { comp:String, prac:Object },

  data() { return {} },

  methods: {

    isPage:  function () {
      return this.nav().page === 'Summ'; },
    doPrac: function (name) {
      publish( this.comp, name ); } },

  mounted: function () {}
};

/* script */
const __vue_script__$3 = Summ;

/* template */
var __vue_render__$3 = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c(
    "div",
    {
      staticClass: "summ",
      attrs: { prac: "prac" },
      on: {
        click: function($event) {
          return _vm.doPrac(_vm.prac)
        }
      }
    },
    [_c("i", { class: _vm.prac.icon })]
  )
};
var __vue_staticRenderFns__$3 = [];
__vue_render__$3._withStripped = true;

  /* style */
  const __vue_inject_styles__$3 = function (inject) {
    if (!inject) return
    inject("data-v-ab683efe_0", { source: ".theme-logo {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-menu {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-find {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-tocs {\n  background-color: black;\n  font-size: 2.5rem;\n}\n.theme-view {\n  font-size: 1.5rem;\n}\n.theme-side {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-pref {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-foot {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-trak {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-prac {\n  background-color: #603;\n  font-size: 2rem;\n}\n.theme-icon {\n  background-color: #333;\n  border-radius: 36px;\n  width: 80%;\n  height: 90%;\n}\n.summ {\n  display: grid;\n  align-self: stretch;\n  justify-self: stretch;\n  align-items: center;\n  justify-items: center;\n  background-color: black;\n  color: wheat;\n  font-size: 2rem;\n  text-align: center;\n}\n", map: {"version":3,"sources":["Summ.vue","/Users/ax/Documents/prj/aug/vue/comp/Summ.vue"],"names":[],"mappings":"AAAA;EACE,uBAAuB;EACvB,iBAAiB;AACnB;AACA;EACE,uBAAuB;EACvB,iBAAiB;AACnB;AACA;EACE,uBAAuB;EACvB,iBAAiB;AACnB;AACA;EACE,uBAAuB;EACvB,iBAAiB;AACnB;AACA;EACE,iBAAiB;AACnB;AACA;EACE,uBAAuB;EACvB,iBAAiB;AACnB;AACA;EACE,uBAAuB;EACvB,iBAAiB;AACnB;AACA;EACE,uBAAuB;EACvB,iBAAiB;ACCnB;AACA;EACA,uBAAA;EDCE,iBAAiB;AACnB;AACA;EACE,sBAAsB;EACtB,eAAe;AACjB;AACA;EACE,sBAAsB;EACtB,mBAAmB;EACnB,UAAU;EACV,WAAW;AACb;AACA;EACE,aAAa;EACb,mBAAmB;EACnB,qBAAqB;EACrB,mBAAmB;EACnB,qBAAqB;EACrB,uBAAuB;EACvB,YAAY;EACZ,eAAe;EACf,kBAAkB;AACpB","file":"Summ.vue","sourcesContent":[".theme-logo {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-menu {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-find {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-tocs {\n  background-color: black;\n  font-size: 2.5rem;\n}\n.theme-view {\n  font-size: 1.5rem;\n}\n.theme-side {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-pref {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-foot {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-trak {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-prac {\n  background-color: #603;\n  font-size: 2rem;\n}\n.theme-icon {\n  background-color: #333;\n  border-radius: 36px;\n  width: 80%;\n  height: 90%;\n}\n.summ {\n  display: grid;\n  align-self: stretch;\n  justify-self: stretch;\n  align-items: center;\n  justify-items: center;\n  background-color: black;\n  color: wheat;\n  font-size: 2rem;\n  text-align: center;\n}\n","\n<template>\n  <div class=\"summ\" prac=\"prac\" @click=\"doPrac(prac)\">\n    <i :class=\"prac.icon\"></i>\n  </div>\n</template>\n\n<script type=\"module\">\n\n  let Summ = {\n\n    props: { comp:String, prac:Object },\n\n    data() { return {} },\n\n    methods: {\n\n      isPage:  function () {\n        return this.nav().page === 'Summ'; },\n      doPrac: function (name) {\n        publish( this.comp, name ); } },\n\n    mounted: function () {}\n  }\n\n  export default Summ;\n\n</script>\n\n<style lang=\"less\">\n  @import '../../pub/css/themes/theme.less';\n  .summ { display:grid; align-self:stretch; justify-self:stretch; align-items:center; justify-items:center;\n    background-color:@theme-back; color:@theme-color; font-size:@theme-h1-size; text-align:center; }\n</style>"]}, media: undefined });

  };
  /* scoped */
  const __vue_scope_id__$3 = undefined;
  /* module identifier */
  const __vue_module_identifier__$3 = undefined;
  /* functional template */
  const __vue_is_functional_template__$3 = false;
  /* style inject SSR */
  

  
  var Summ$1 = normalizeComponent_1(
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


let Desc = {

  props: { comp:String, prac:Object },

  data() { return { page:"Desc"} },

  methods: {

    isPage:  function() {
      return this.nav().page === 'Desc'; },
    doPrac: function(name) {
      publish( this.comp, name ); } },

  mounted: function () {} };

/* script */
const __vue_script__$4 = Desc;

/* template */
var __vue_render__$4 = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c(
    "div",
    {
      staticClass: "desc",
      attrs: { prac: "prac" },
      on: {
        click: function($event) {
          return _vm.doPrac(_vm.prac)
        }
      }
    },
    [_c("i", { class: _vm.prac.icon })]
  )
};
var __vue_staticRenderFns__$4 = [];
__vue_render__$4._withStripped = true;

  /* style */
  const __vue_inject_styles__$4 = function (inject) {
    if (!inject) return
    inject("data-v-2160faa7_0", { source: ".theme-logo {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-menu {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-find {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-tocs {\n  background-color: black;\n  font-size: 2.5rem;\n}\n.theme-view {\n  font-size: 1.5rem;\n}\n.theme-side {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-pref {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-foot {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-trak {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-prac {\n  background-color: #603;\n  font-size: 2rem;\n}\n.theme-icon {\n  background-color: #333;\n  border-radius: 36px;\n  width: 80%;\n  height: 90%;\n}\n.desc {\n  display: grid;\n  align-self: stretch;\n  justify-self: stretch;\n  align-items: center;\n  justify-items: center;\n  background-color: black;\n  color: wheat;\n  font-size: 2rem;\n  text-align: center;\n}\n", map: {"version":3,"sources":["Desc.vue","/Users/ax/Documents/prj/aug/vue/comp/Desc.vue"],"names":[],"mappings":"AAAA;EACE,uBAAuB;EACvB,iBAAiB;AACnB;AACA;EACE,uBAAuB;EACvB,iBAAiB;AACnB;AACA;EACE,uBAAuB;EACvB,iBAAiB;AACnB;AACA;EACE,uBAAuB;EACvB,iBAAiB;AACnB;AACA;EACE,iBAAiB;AACnB;AACA;EACE,uBAAuB;EACvB,iBAAiB;AACnB;AACA;EACE,uBAAuB;EACvB,iBAAiB;AACnB;AACA;EACE,uBAAuB;ECCzB,iBAAA;AACA;AACA;EDCE,uBAAuB;EACvB,iBAAiB;AACnB;AACA;EACE,sBAAsB;EACtB,eAAe;AACjB;AACA;EACE,sBAAsB;EACtB,mBAAmB;EACnB,UAAU;EACV,WAAW;AACb;AACA;EACE,aAAa;EACb,mBAAmB;EACnB,qBAAqB;EACrB,mBAAmB;EACnB,qBAAqB;EACrB,uBAAuB;EACvB,YAAY;EACZ,eAAe;EACf,kBAAkB;AACpB","file":"Desc.vue","sourcesContent":[".theme-logo {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-menu {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-find {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-tocs {\n  background-color: black;\n  font-size: 2.5rem;\n}\n.theme-view {\n  font-size: 1.5rem;\n}\n.theme-side {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-pref {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-foot {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-trak {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-prac {\n  background-color: #603;\n  font-size: 2rem;\n}\n.theme-icon {\n  background-color: #333;\n  border-radius: 36px;\n  width: 80%;\n  height: 90%;\n}\n.desc {\n  display: grid;\n  align-self: stretch;\n  justify-self: stretch;\n  align-items: center;\n  justify-items: center;\n  background-color: black;\n  color: wheat;\n  font-size: 2rem;\n  text-align: center;\n}\n","\n<template>\n  <div class=\"desc\" prac=\"prac\" @click=\"doPrac(prac)\">\n    <i :class=\"prac.icon\"></i>\n  </div>\n</template>\n\n<script type=\"module\">\n\n  let Desc = {\n\n    props: { comp:String, prac:Object },\n\n    data() { return { page:\"Desc\"} },\n\n    methods: {\n\n      isPage:  function() {\n        return this.nav().page === 'Desc'; },\n      doPrac: function(name) {\n        publish( this.comp, name ); } },\n\n    mounted: function () {} }\n\n  export default Desc;\n\n</script>\n\n<style lang=\"less\">\n  @import '../../pub/css/themes/theme.less';\n  .desc { display:grid; align-self:stretch; justify-self:stretch; align-items:center; justify-items:center;\n    background-color:@theme-back; color:@theme-color; font-size:@theme-h1-size; text-align:center; }\n</style>"]}, media: undefined });

  };
  /* scoped */
  const __vue_scope_id__$4 = undefined;
  /* module identifier */
  const __vue_module_identifier__$4 = undefined;
  /* functional template */
  const __vue_is_functional_template__$4 = false;
  /* style inject SSR */
  

  
  var Desc$1 = normalizeComponent_1(
    { render: __vue_render__$4, staticRenderFns: __vue_staticRenderFns__$4 },
    __vue_inject_styles__$4,
    __vue_script__$4,
    __vue_scope_id__$4,
    __vue_is_functional_template__$4,
    __vue_module_identifier__$4,
    browser,
    undefined
  );

//

let Disp = {

  components:{ 'b-tabs':Tabs, 'p-icon':Icon$1, 'p-dirs':Dirs$1, 'p-summ':Summ$1, 'p-desc':Desc$1 },
  
  props: { pcomp:{ type:String, default:'None' } },
  
  data() { return {
    comp:'None', prac:'All', disp:'All', practices:{},
    pages:[
      { title:'Icon', view:'Page', page:'Icon' },
      { title:'Dirs', view:'Page', page:'Dirs' },
      { title:'Summ', view:'Page', page:'Summ' },
      { title:'Desc', view:'Page', page:'Desc' } ],
    rows: {
      Learn:{ name:'Learn', dir:'le', icon:"fas fa-graduation-cap" },
      Do:{    name:'Do',    dir:'do', icon:"fas fas fa-cog" },
      Share:{ name:'Share', dir:'sh', icon:"fas fa-share-alt-square" } } } },
  
  methods: {
    isPrac: function (prac) {
      return this.prac===prac || this.prac==='All' },
    isDisp: function (disp) {
      return this.disp===disp || this.disp==='All' },
    isRows: function () {
      return this.prac==='All' },
    doPrac: function (prac) {
      this.publish( this.comp, { prac:prac, disp:'All' } ); },
    doDisp: function (prac,disp) {
      this.publish( this.comp, { prac:prac, disp:disp  } ); },
    onComp: function (comp) {
      this.comp = comp; this.prac = 'All'; this.disp='All'; },
    onPrac: function (prac) {
      this.prac = prac; this.disp='All'; },
    onDisp: function (prac,disp) {
      this.prac = prac; this.disp=disp; },
    onPage: function (obj)    {
      console.log( 'Page.onPrac()', obj ); },
    onNone: function (obj) {
      console.error( 'Page Nav Error', { obj:obj } ); },
    onNav:  function (obj) {
      switch( obj.level ) {
        case 'Comp' : this.onComp(obj.comp);          break;
        case 'Prac' : this.onPrac(obj.prac);          break;
        case 'Disp' : this.onDisp(obj.prac,obj.disp); break;
        default     : this.onNone(obj); } },
    pracDir: function(dir) {
      return this.prac==='All' ? dir : 'pracFull'; },
    dispDir: function(dir) {
      return this.disp==='All' ? dir : 'dispFull'; },
    areaDir: function() {
      return this.prac==='All' ? 'none' : 'area' },
    style: function( hsv ) {
      return { backgroundColor:this.toRgbaHsv(hsv) }; },
    elems: function() { // Add DON elements. Must be called within $nextTick for $refs
      this.infoElem = this.$refs['Disp'];
      let pracs = this.conns(this.comp); // We access conns because col practices have been filtered out
      for( let pkey in pracs ) {
        let prac = pracs[pkey];
        prac.elem = this.$refs[prac.name][0];
        this.touch.events( prac.elem );
        let disps = this.disps(this.comp,prac.name);
        for( let dkey in disps ) {
          let disp = disps[dkey];
          disp.elem = this.$refs[disp.name][0]; } } }  // this.touch.events( disp.elem );
    },

  beforeMount: function() {
    this.comp = this.nav().comp; },

  mounted: function () {
    this.practices = this.pracs(this.comp); // 'Cols'
    this.subscribe(  this.comp, this.comp+'.vue', (obj) => {
       if( obj.disp==='All' ) { this.onPrac(obj.prac); }
       else                   { this.onDisp(obj.prac,obj.disp); } } );
    this.subscribe(  "Nav",     this.comp+'.vue', (obj) => {
      this.onNav(obj); } ); }
};

/* script */
const __vue_script__$5 = Disp;

/* template */
var __vue_render__$5 = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c(
    "div",
    { ref: "Disp", staticClass: "comp", attrs: { title: "Disp" } },
    [
      _c("b-tabs", { attrs: { comp: _vm.comp, pages: _vm.pages } }),
      _vm._v(" "),
      _vm._l(_vm.practices, function(prac) {
        return [
          _c(
            "div",
            {
              directives: [
                {
                  name: "show",
                  rawName: "v-show",
                  value: _vm.isPrac(prac.name),
                  expression: "isPrac(prac.name)"
                }
              ],
              key: prac.name,
              ref: prac.name,
              refInFor: true,
              class: _vm.pracDir(prac.dir),
              attrs: { title: prac.name }
            },
            [
              _c("p-icon", { attrs: { comp: _vm.comp, prac: prac } }),
              _vm._v(" "),
              _c("p-dirs", { attrs: { comp: _vm.comp, prac: prac } }),
              _vm._v(" "),
              _c("p-summ", { attrs: { comp: _vm.comp, prac: prac } }),
              _vm._v(" "),
              _c("p-desc", { attrs: { comp: _vm.comp, prac: prac } })
            ],
            1
          )
        ]
      }),
      _vm._v(" "),
      _vm._l(_vm.rows, function(row) {
        return [
          _c(
            "div",
            {
              directives: [
                {
                  name: "show",
                  rawName: "v-show",
                  value: _vm.isRows(),
                  expression: "isRows()"
                }
              ],
              key: row.name,
              class: row.dir
            },
            [_c("p-icon", { attrs: { comp: _vm.comp, prac: row } })],
            1
          )
        ]
      })
    ],
    2
  )
};
var __vue_staticRenderFns__$5 = [];
__vue_render__$5._withStripped = true;

  /* style */
  const __vue_inject_styles__$5 = function (inject) {
    if (!inject) return
    inject("data-v-57a503ba_0", { source: ".theme-logo {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-menu {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-find {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-tocs {\n  background-color: black;\n  font-size: 2.5rem;\n}\n.theme-view {\n  font-size: 1.5rem;\n}\n.theme-side {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-pref {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-foot {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-trak {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-prac {\n  background-color: #603;\n  font-size: 2rem;\n}\n.theme-icon {\n  background-color: #333;\n  border-radius: 36px;\n  width: 80%;\n  height: 90%;\n}\n.comp {\n  position: relative;\n  left: 0;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  font-size: 2rem;\n  background-color: black;\n  color: black;\n  display: grid;\n  grid-template-columns: 13fr 29fr 29fr 29fr;\n  grid-template-rows: 8fr 24fr 24fr 24fr 24fr;\n  grid-template-areas: \"tabs tabs tabs tabs\" \"cm em in en\" \"le nw north ne\" \"do west cen east\" \"sh sw south se\";\n  justify-items: center;\n  align-items: center;\n}\n.comp .tabs {\n  grid-area: tabs;\n  display: inline;\n  color: wheat;\n  font-size: 1.5rem;\n  justify-self: start;\n  align-self: center;\n  text-align: left;\n}\n.comp .cm {\n  display: grid;\n  grid-area: cm;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n}\n.comp .em {\n  display: grid;\n  grid-area: em;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n}\n.comp .in {\n  display: grid;\n  grid-area: in;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n}\n.comp .en {\n  display: grid;\n  grid-area: en;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n}\n.comp .le {\n  display: grid;\n  grid-area: le;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n}\n.comp .nw {\n  display: grid;\n  grid-area: nw;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n}\n.comp .north {\n  display: grid;\n  grid-area: north;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n}\n.comp .ne {\n  display: grid;\n  grid-area: ne;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n}\n.comp .do {\n  display: grid;\n  grid-area: do;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n}\n.comp .west {\n  display: grid;\n  grid-area: west;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n}\n.comp .cen {\n  display: grid;\n  grid-area: cen;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n}\n.comp .east {\n  display: grid;\n  grid-area: east;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n}\n.comp .sh {\n  display: grid;\n  grid-area: sh;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n}\n.comp .sw {\n  display: grid;\n  grid-area: sw;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n}\n.comp .south {\n  display: grid;\n  grid-area: south;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n}\n.comp .se {\n  display: grid;\n  grid-area: se;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n}\n.comp .prac {\n  background-color: #603;\n  border-radius: 36px;\n  width: 90%;\n  height: 80%;\n  font-size: 2rem;\n  font-weight: bold;\n  display: grid;\n  grid-template-columns: 1fr 1fr 1fr;\n  grid-template-rows: 1fr 1fr 1fr;\n  grid-template-areas: \"nw north ne\" \"west cen east\" \"sw south se\";\n}\n.comp .prac .north {\n  display: grid;\n  grid-area: north;\n  justify-self: stretch;\n  align-self: stretch;\n  border-radius: 36px;\n}\n.comp .prac .west {\n  display: grid;\n  grid-area: west;\n  justify-self: stretch;\n  align-self: stretch;\n  border-radius: 36px;\n}\n.comp .prac .cen {\n  display: grid;\n  grid-area: cen;\n  justify-self: stretch;\n  align-self: stretch;\n  border-radius: 36px;\n}\n.comp .prac .east {\n  display: grid;\n  grid-area: east;\n  justify-self: stretch;\n  align-self: stretch;\n  border-radius: 36px;\n}\n.comp .prac .south {\n  display: grid;\n  grid-area: south;\n  justify-self: stretch;\n  align-self: stretch;\n  border-radius: 36px;\n}\n.comp .prac .cen {\n  font-size: 1.6rem;\n}\n.comp .prac div {\n  font-size: 1.4rem;\n}\n.comp .disp {\n  display: inline;\n  justify-self: center;\n  align-self: center;\n  text-align: center;\n  font-size: 1.6rem;\n}\n.comp .disp i {\n  display: inline-block;\n  margin-right: 0.25rem;\n}\n.comp .disp .name {\n  display: inline-block;\n}\n.comp .disp .desc {\n  display: none;\n  margin: 0.5rem 0.5rem 0.5rem 0.5rem;\n  text-align: left;\n}\n.comp .area {\n  display: grid;\n  grid-template-columns: 6fr 22fr 72fr;\n  grid-template-areas: \"icon name desc\";\n  justify-self: start;\n  align-self: center;\n  text-align: left;\n  margin-left: 1.5em;\n  width: 90%;\n  height: auto;\n  font-size: 1.5rem;\n}\n.comp .area i {\n  grid-area: icon;\n}\n.comp .area .name {\n  grid-area: name;\n  font-weight: 900;\n}\n.comp .area .desc {\n  grid-area: desc;\n}\n.comp .none {\n  display: none;\n}\n.comp .pracFull {\n  position: absolute;\n  left: 3%;\n  top: 6%;\n  right: 3%;\n  bottom: 6%;\n  display: grid;\n}\n.comp .pracFull .prac {\n  font-size: 2.5rem;\n  width: 100%;\n  height: 100%;\n  justify-self: center;\n  align-self: center;\n  display: grid;\n  border-radius: 0.5rem;\n}\n.comp .pracFull .prac div {\n  padding-bottom: 2rem;\n}\n.comp .pracFull .prac div .disp {\n  padding-bottom: 0;\n}\n.comp .pracFull .prac div .disp i {\n  font-size: 1.6rem;\n}\n.comp .pracFull .prac div .disp .name {\n  font-size: 1.6rem;\n}\n.comp .pracFull .prac div .disp .desc {\n  font-size: 1.6rem;\n  display: block;\n}\n.comp .pracFull .prac .area {\n  padding-bottom: 0;\n}\n.comp .dispFull {\n  position: absolute;\n  left: 3%;\n  top: 6%;\n  right: 3%;\n  bottom: 6%;\n  display: grid;\n  border-radius: 72px;\n}\n.comp .dispFull .disp {\n  justify-self: center;\n  margin: 0;\n}\n.comp .dispFull .disp i {\n  font-size: 1.6rem !important;\n}\n.comp .dispFull .disp .name {\n  font-size: 1.6rem !important;\n}\n.comp .dispFull .disp .desc {\n  font-size: 1.6rem !important;\n  display: block;\n}\n.comp .dispFull .area {\n  font-size: 1.6rem !important;\n  padding-bottom: 0;\n}\n.comp .em .prac .cen,\n.comp .in .prac .cen,\n.comp .en .prac .cen {\n  font-size: 1.6rem;\n}\n.comp .row {\n  background-color: #603;\n  border-radius: 36px;\n  margin-left: 10%;\n  width: 80%;\n  height: 80%;\n  font-size: 1.6rem;\n  font-weight: bold;\n  display: grid;\n}\n.comp .row div {\n  text-align: center;\n  justify-self: center;\n  align-self: center;\n  font-size: 1.6rem;\n  color: wheat;\n}\n.comp .row i {\n  margin-bottom: 0.2rem;\n  display: block;\n}\n", map: {"version":3,"sources":["Disp.vue","/Users/ax/Documents/prj/aug/vue/comp/Disp.vue"],"names":[],"mappings":"AAAA;EACE,uBAAuB;EACvB,iBAAiB;AACnB;AACA;EACE,uBAAuB;EACvB,iBAAiB;AACnB;AACA;EACE,uBAAuB;EACvB,iBAAiB;AACnB;AACA;EACE,uBAAuB;EACvB,iBAAiB;AACnB;AACA;EACE,iBAAiB;AACnB;AACA;EACE,uBAAuB;EACvB,iBAAiB;AACnB;AACA;EACE,uBAAuB;EACvB,iBAAiB;AACnB;AACA;EACE,uBAAuB;EACvB,iBAAiB;AACnB;AACA;EACE,uBAAuB;EACvB,iBAAiB;AACnB;AACA;EACE,sBAAsB;EACtB,eAAe;AACjB;AACA;EACE,sBAAsB;EACtB,mBAAmB;EACnB,UAAU;EACV,WAAW;AACb;AACA;EACE,kBAAkB;EAClB,OAAO;EACP,MAAM;EACN,QAAQ;EACR,SAAS;EACT,eAAe;EACf,uBAAuB;EACvB,YAAY;EACZ,aAAa;EACb,0CAA0C;EAC1C,2CAA2C;EAC3C,6GAA6G;EAC7G,qBAAqB;EACrB,mBAAmB;AACrB;AACA;EACE,eAAe;EACf,eAAe;EACf,YAAY;EACZ,iBAAiB;EACjB,mBAAmB;EACnB,kBAAkB;EAClB,gBAAgB;AAClB;AACA;EACE,aAAa;EACb,aAAa;EACb,qBAAqB;EACrB,mBAAmB;EACnB,qBAAqB;EACrB,mBAAmB;AACrB;AACA;EACE,aAAa;EACb,aAAa;EACb,qBAAqB;EACrB,mBAAmB;EACnB,qBAAqB;EACrB,mBAAmB;AACrB;AACA;EACE,aAAa;EACb,aAAa;EACb,qBAAqB;EACrB,mBAAmB;EACnB,qBAAqB;EACrB,mBAAmB;AACrB;AACA;EACE,aAAa;EACb,aAAa;EACb,qBAAqB;EACrB,mBAAmB;EACnB,qBAAqB;EACrB,mBAAmB;AACrB;AACA;EACE,aAAa;EACb,aAAa;EACb,qBAAqB;EACrB,mBAAmB;EACnB,qBAAqB;EACrB,mBAAmB;AACrB;AACA;EACE,aAAa;EACb,aAAa;EACb,qBAAqB;ECCvB,mBAAA;EDCE,qBAAqB;ECCvB,mBAAA;AACA;ADCA;ECCA,aAAA;EACA,gBAAA;EDCE,qBAAqB;ECCvB,mBAAA;EDCE,qBAAqB;ECCvB,mBAAA;AACA;ADCA;ECCA,aAAA;EDCE,aAAa;ECCf,qBAAA;EACA,mBAAA;EDCE,qBAAqB;ECCvB,mBAAA;AACA;AACA;EACA,aAAA;EACA,aAAA;EACA,qBAAA;EACA,mBAAA;EACA,qBAAA;EACA,mBAAA;ADCA;ACCA;EACA,aAAA;EACA,eAAA;EACA,qBAAA;EACA,mBAAA;EACA,qBAAA;EACA,mBAAA;AACA;AACA;EDCE,aAAa;ECCf,cAAA;EACA,qBAAA;EACA,mBAAA;EACA,qBAAA;EDCE,mBAAmB;ACCrB;AACA;EACA,aAAA;EACA,eAAA;EACA,qBAAA;EDCE,mBAAmB;ECCrB,qBAAA;EDCE,mBAAmB;ACCrB;AACA;EACA,aAAA;EACA,aAAA;EACA,qBAAA;EACA,mBAAA;EACA,qBAAA;EACA,mBAAA;AACA;AACA;EDCE,aAAa;ECCf,aAAA;EACA,qBAAA;EACA,mBAAA;EACA,qBAAA;EACA,mBAAA;AACA;AACA;EDCE,aAAa;ECCf,gBAAA;EDCE,qBAAqB;ECCvB,mBAAA;EACA,qBAAA;EACA,mBAAA;AACA;ADCA;EACE,aAAa;ECCf,aAAA;EDCE,qBAAqB;EACrB,mBAAmB;EACnB,qBAAqB;EACrB,mBAAmB;AACrB;AACA;EACE,sBAAsB;EACtB,mBAAmB;EACnB,UAAU;EACV,WAAW;EACX,eAAe;EACf,iBAAiB;EACjB,aAAa;EACb,kCAAkC;EAClC,+BAA+B;EAC/B,gEAAgE;AAClE;AACA;EACE,aAAa;EACb,gBAAgB;EAChB,qBAAqB;EACrB,mBAAmB;EACnB,mBAAmB;AACrB;AACA;EACE,aAAa;EACb,eAAe;EACf,qBAAqB;EACrB,mBAAmB;EACnB,mBAAmB;AACrB;AACA;EACE,aAAa;EACb,cAAc;EACd,qBAAqB;EACrB,mBAAmB;EACnB,mBAAmB;AACrB;AACA;EACE,aAAa;EACb,eAAe;EACf,qBAAqB;EACrB,mBAAmB;EACnB,mBAAmB;AACrB;AACA;EACE,aAAa;EACb,gBAAgB;EAChB,qBAAqB;EACrB,mBAAmB;EACnB,mBAAmB;AACrB;AACA;EACE,iBAAiB;AACnB;AACA;EACE,iBAAiB;AACnB;AACA;EACE,eAAe;EACf,oBAAoB;EACpB,kBAAkB;EAClB,kBAAkB;EAClB,iBAAiB;AACnB;AACA;EACE,qBAAqB;EACrB,qBAAqB;AACvB;AACA;EACE,qBAAqB;AACvB;AACA;EACE,aAAa;EACb,mCAAmC;EACnC,gBAAgB;AAClB;AACA;EACE,aAAa;EACb,oCAAoC;EACpC,qCAAqC;EACrC,mBAAmB;EACnB,kBAAkB;EAClB,gBAAgB;EAChB,kBAAkB;EAClB,UAAU;EACV,YAAY;EACZ,iBAAiB;AACnB;AACA;EACE,eAAe;AACjB;AACA;EACE,eAAe;EACf,gBAAgB;AAClB;AACA;EACE,eAAe;AACjB;AACA;EACE,aAAa;AACf;AACA;EACE,kBAAkB;EAClB,QAAQ;EACR,OAAO;EACP,SAAS;EACT,UAAU;EACV,aAAa;AACf;AACA;EACE,iBAAiB;EACjB,WAAW;EACX,YAAY;EACZ,oBAAoB;EACpB,kBAAkB;EAClB,aAAa;EACb,qBAAqB;AACvB;AACA;EACE,oBAAoB;AACtB;AACA;EACE,iBAAiB;AACnB;AACA;EACE,iBAAiB;AACnB;AACA;EACE,iBAAiB;AACnB;AACA;EACE,iBAAiB;EACjB,cAAc;AAChB;AACA;EACE,iBAAiB;AACnB;AACA;EACE,kBAAkB;EAClB,QAAQ;EACR,OAAO;EACP,SAAS;EACT,UAAU;EACV,aAAa;EACb,mBAAmB;AACrB;AACA;EACE,oBAAoB;EACpB,SAAS;AACX;AACA;EACE,4BAA4B;AAC9B;AACA;EACE,4BAA4B;AAC9B;AACA;EACE,4BAA4B;EAC5B,cAAc;AAChB;AACA;EACE,4BAA4B;EAC5B,iBAAiB;AACnB;AACA;;;EAGE,iBAAiB;AACnB;AACA;EACE,sBAAsB;EACtB,mBAAmB;EACnB,gBAAgB;EAChB,UAAU;EACV,WAAW;EACX,iBAAiB;EACjB,iBAAiB;EACjB,aAAa;AACf;AACA;EACE,kBAAkB;EAClB,oBAAoB;EACpB,kBAAkB;EAClB,iBAAiB;EACjB,YAAY;AACd;AACA;EACE,qBAAqB;EACrB,cAAc;AAChB","file":"Disp.vue","sourcesContent":[".theme-logo {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-menu {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-find {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-tocs {\n  background-color: black;\n  font-size: 2.5rem;\n}\n.theme-view {\n  font-size: 1.5rem;\n}\n.theme-side {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-pref {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-foot {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-trak {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-prac {\n  background-color: #603;\n  font-size: 2rem;\n}\n.theme-icon {\n  background-color: #333;\n  border-radius: 36px;\n  width: 80%;\n  height: 90%;\n}\n.comp {\n  position: relative;\n  left: 0;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  font-size: 2rem;\n  background-color: black;\n  color: black;\n  display: grid;\n  grid-template-columns: 13fr 29fr 29fr 29fr;\n  grid-template-rows: 8fr 24fr 24fr 24fr 24fr;\n  grid-template-areas: \"tabs tabs tabs tabs\" \"cm em in en\" \"le nw north ne\" \"do west cen east\" \"sh sw south se\";\n  justify-items: center;\n  align-items: center;\n}\n.comp .tabs {\n  grid-area: tabs;\n  display: inline;\n  color: wheat;\n  font-size: 1.5rem;\n  justify-self: start;\n  align-self: center;\n  text-align: left;\n}\n.comp .cm {\n  display: grid;\n  grid-area: cm;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n}\n.comp .em {\n  display: grid;\n  grid-area: em;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n}\n.comp .in {\n  display: grid;\n  grid-area: in;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n}\n.comp .en {\n  display: grid;\n  grid-area: en;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n}\n.comp .le {\n  display: grid;\n  grid-area: le;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n}\n.comp .nw {\n  display: grid;\n  grid-area: nw;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n}\n.comp .north {\n  display: grid;\n  grid-area: north;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n}\n.comp .ne {\n  display: grid;\n  grid-area: ne;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n}\n.comp .do {\n  display: grid;\n  grid-area: do;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n}\n.comp .west {\n  display: grid;\n  grid-area: west;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n}\n.comp .cen {\n  display: grid;\n  grid-area: cen;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n}\n.comp .east {\n  display: grid;\n  grid-area: east;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n}\n.comp .sh {\n  display: grid;\n  grid-area: sh;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n}\n.comp .sw {\n  display: grid;\n  grid-area: sw;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n}\n.comp .south {\n  display: grid;\n  grid-area: south;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n}\n.comp .se {\n  display: grid;\n  grid-area: se;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n}\n.comp .prac {\n  background-color: #603;\n  border-radius: 36px;\n  width: 90%;\n  height: 80%;\n  font-size: 2rem;\n  font-weight: bold;\n  display: grid;\n  grid-template-columns: 1fr 1fr 1fr;\n  grid-template-rows: 1fr 1fr 1fr;\n  grid-template-areas: \"nw north ne\" \"west cen east\" \"sw south se\";\n}\n.comp .prac .north {\n  display: grid;\n  grid-area: north;\n  justify-self: stretch;\n  align-self: stretch;\n  border-radius: 36px;\n}\n.comp .prac .west {\n  display: grid;\n  grid-area: west;\n  justify-self: stretch;\n  align-self: stretch;\n  border-radius: 36px;\n}\n.comp .prac .cen {\n  display: grid;\n  grid-area: cen;\n  justify-self: stretch;\n  align-self: stretch;\n  border-radius: 36px;\n}\n.comp .prac .east {\n  display: grid;\n  grid-area: east;\n  justify-self: stretch;\n  align-self: stretch;\n  border-radius: 36px;\n}\n.comp .prac .south {\n  display: grid;\n  grid-area: south;\n  justify-self: stretch;\n  align-self: stretch;\n  border-radius: 36px;\n}\n.comp .prac .cen {\n  font-size: 1.6rem;\n}\n.comp .prac div {\n  font-size: 1.4rem;\n}\n.comp .disp {\n  display: inline;\n  justify-self: center;\n  align-self: center;\n  text-align: center;\n  font-size: 1.6rem;\n}\n.comp .disp i {\n  display: inline-block;\n  margin-right: 0.25rem;\n}\n.comp .disp .name {\n  display: inline-block;\n}\n.comp .disp .desc {\n  display: none;\n  margin: 0.5rem 0.5rem 0.5rem 0.5rem;\n  text-align: left;\n}\n.comp .area {\n  display: grid;\n  grid-template-columns: 6fr 22fr 72fr;\n  grid-template-areas: \"icon name desc\";\n  justify-self: start;\n  align-self: center;\n  text-align: left;\n  margin-left: 1.5em;\n  width: 90%;\n  height: auto;\n  font-size: 1.5rem;\n}\n.comp .area i {\n  grid-area: icon;\n}\n.comp .area .name {\n  grid-area: name;\n  font-weight: 900;\n}\n.comp .area .desc {\n  grid-area: desc;\n}\n.comp .none {\n  display: none;\n}\n.comp .pracFull {\n  position: absolute;\n  left: 3%;\n  top: 6%;\n  right: 3%;\n  bottom: 6%;\n  display: grid;\n}\n.comp .pracFull .prac {\n  font-size: 2.5rem;\n  width: 100%;\n  height: 100%;\n  justify-self: center;\n  align-self: center;\n  display: grid;\n  border-radius: 0.5rem;\n}\n.comp .pracFull .prac div {\n  padding-bottom: 2rem;\n}\n.comp .pracFull .prac div .disp {\n  padding-bottom: 0;\n}\n.comp .pracFull .prac div .disp i {\n  font-size: 1.6rem;\n}\n.comp .pracFull .prac div .disp .name {\n  font-size: 1.6rem;\n}\n.comp .pracFull .prac div .disp .desc {\n  font-size: 1.6rem;\n  display: block;\n}\n.comp .pracFull .prac .area {\n  padding-bottom: 0;\n}\n.comp .dispFull {\n  position: absolute;\n  left: 3%;\n  top: 6%;\n  right: 3%;\n  bottom: 6%;\n  display: grid;\n  border-radius: 72px;\n}\n.comp .dispFull .disp {\n  justify-self: center;\n  margin: 0;\n}\n.comp .dispFull .disp i {\n  font-size: 1.6rem !important;\n}\n.comp .dispFull .disp .name {\n  font-size: 1.6rem !important;\n}\n.comp .dispFull .disp .desc {\n  font-size: 1.6rem !important;\n  display: block;\n}\n.comp .dispFull .area {\n  font-size: 1.6rem !important;\n  padding-bottom: 0;\n}\n.comp .em .prac .cen,\n.comp .in .prac .cen,\n.comp .en .prac .cen {\n  font-size: 1.6rem;\n}\n.comp .row {\n  background-color: #603;\n  border-radius: 36px;\n  margin-left: 10%;\n  width: 80%;\n  height: 80%;\n  font-size: 1.6rem;\n  font-weight: bold;\n  display: grid;\n}\n.comp .row div {\n  text-align: center;\n  justify-self: center;\n  align-self: center;\n  font-size: 1.6rem;\n  color: wheat;\n}\n.comp .row i {\n  margin-bottom: 0.2rem;\n  display: block;\n}\n","\n<template>\n  <div class=\"comp\" ref=\"Disp\" title=\"Disp\">\n    <b-tabs :comp=\"comp\" :pages=\"pages\"></b-tabs>\n    <template v-for=\"prac in practices\">\n      <div v-show=\"isPrac(prac.name)\" :class=\"pracDir(prac.dir)\" :key=\"prac.name\" :ref=\"prac.name\" :title=\"prac.name\">\n        <p-icon :comp=\"comp\" :prac=\"prac\"></p-icon>\n        <p-dirs :comp=\"comp\" :prac=\"prac\"></p-dirs>\n        <p-summ :comp=\"comp\" :prac=\"prac\"></p-summ>\n        <p-desc :comp=\"comp\" :prac=\"prac\"></p-desc>\n      </div>\n    </template>\n    <template v-for=\"row in rows\">\n      <div v-show=\"isRows()\" :class=\"row.dir\" :key=\"row.name\">\n        <p-icon :comp=\"comp\" :prac=\"row\"></p-icon>\n      </div>\n      <!--div v-show=\"isRows()\" :class=\"row.dir\" :key=\"row.name\"><div class=\"row\">\n        <div><i :class=\"row.icon\"></i>{{row.name}}</div></div></div-->\n    </template>\n  </div>\n</template>\n\n<script type=\"module\">\n\n  import Tabs from '../elem/Tabs.vue';\n  import Icon from './Icon.vue';\n  import Dirs from './Dirs.vue';\n  import Summ from './Summ.vue';\n  import Desc from './Desc.vue';\n  \n  let Disp = {\n\n    components:{ 'b-tabs':Tabs, 'p-icon':Icon, 'p-dirs':Dirs, 'p-summ':Summ, 'p-desc':Desc },\n    \n    props: { pcomp:{ type:String, default:'None' } },\n    \n    data() { return {\n      comp:'None', prac:'All', disp:'All', practices:{},\n      pages:[\n        { title:'Icon', view:'Page', page:'Icon' },\n        { title:'Dirs', view:'Page', page:'Dirs' },\n        { title:'Summ', view:'Page', page:'Summ' },\n        { title:'Desc', view:'Page', page:'Desc' } ],\n      rows: {\n        Learn:{ name:'Learn', dir:'le', icon:\"fas fa-graduation-cap\" },\n        Do:{    name:'Do',    dir:'do', icon:\"fas fas fa-cog\" },\n        Share:{ name:'Share', dir:'sh', icon:\"fas fa-share-alt-square\" } } } },\n    \n    methods: {\n      isPrac: function (prac) {\n        return this.prac===prac || this.prac==='All' },\n      isDisp: function (disp) {\n        return this.disp===disp || this.disp==='All' },\n      isRows: function () {\n        return this.prac==='All' },\n      doPrac: function (prac) {\n        this.publish( this.comp, { prac:prac, disp:'All' } ); },\n      doDisp: function (prac,disp) {\n        this.publish( this.comp, { prac:prac, disp:disp  } ); },\n      onComp: function (comp) {\n        this.comp = comp; this.prac = 'All'; this.disp='All'; },\n      onPrac: function (prac) {\n        this.prac = prac; this.disp='All'; },\n      onDisp: function (prac,disp) {\n        this.prac = prac; this.disp=disp; },\n      onPage: function (obj)    {\n        console.log( 'Page.onPrac()', obj ); },\n      onNone: function (obj) {\n        console.error( 'Page Nav Error', { obj:obj } ); },\n      onNav:  function (obj) {\n        switch( obj.level ) {\n          case 'Comp' : this.onComp(obj.comp);          break;\n          case 'Prac' : this.onPrac(obj.prac);          break;\n          case 'Disp' : this.onDisp(obj.prac,obj.disp); break;\n          default     : this.onNone(obj); } },\n      pracDir: function(dir) {\n        return this.prac==='All' ? dir : 'pracFull'; },\n      dispDir: function(dir) {\n        return this.disp==='All' ? dir : 'dispFull'; },\n      areaDir: function() {\n        return this.prac==='All' ? 'none' : 'area' },\n      style: function( hsv ) {\n        return { backgroundColor:this.toRgbaHsv(hsv) }; },\n      elems: function() { // Add DON elements. Must be called within $nextTick for $refs\n        this.infoElem = this.$refs['Disp']\n        let pracs = this.conns(this.comp); // We access conns because col practices have been filtered out\n        for( let pkey in pracs ) {\n          let prac = pracs[pkey];\n          prac.elem = this.$refs[prac.name][0];\n          this.touch.events( prac.elem );\n          let disps = this.disps(this.comp,prac.name)\n          for( let dkey in disps ) {\n            let disp = disps[dkey];\n            disp.elem = this.$refs[disp.name][0]; } } }  // this.touch.events( disp.elem );\n      },\n\n    beforeMount: function() {\n      this.comp = this.nav().comp; },\n\n    mounted: function () {\n      this.practices = this.pracs(this.comp); // 'Cols'\n      this.subscribe(  this.comp, this.comp+'.vue', (obj) => {\n         if( obj.disp==='All' ) { this.onPrac(obj.prac); }\n         else                   { this.onDisp(obj.prac,obj.disp); } } );\n      this.subscribe(  \"Nav\",     this.comp+'.vue', (obj) => {\n        this.onNav(obj); } ); }\n  }\n  \n  export default Disp;\n  \n</script>\n\n<style lang=\"less\">\n  \n  @import '../../pub/css/themes/theme.less';\n  \n  .grid3x3() { display:grid; grid-template-columns:1fr 1fr 1fr; grid-template-rows:1fr 1fr 1fr;\n               grid-template-areas: \"nw north ne\" \"west cen east\" \"sw south se\"; }\n\n  .grid5x4() { display:grid; grid-template-columns:13fr 29fr 29fr 29fr; grid-template-rows:8fr 24fr 24fr 24fr 24fr;\n    grid-template-areas: \"tabs tabs tabs tabs\" \"cm em in en\" \"le nw north ne\" \"do west cen east\" \"sh sw south se\"; }\n\n  .grid1x3() { display:grid; grid-template-columns:6fr 22fr 72fr; grid-template-areas: \"icon name desc\"; }\n  \n  .pdir( @dir ) { display:grid; grid-area:@dir; justify-self:stretch; align-self:stretch;\n                  justify-items:center; align-items:center; }\n  \n  .ddir( @dir ) { display:grid; grid-area:@dir; justify-self:stretch; align-self:stretch; border-radius:36px; }\n  \n  .bgc( @bg )\n    { background-color:@bg; } // top | right | bottom | left\n  \n  .comp { position:relative; left:0; top:0; right:0; bottom:0; font-size:@theme-prac-size;\n          background-color:@theme-back; color:@theme-color-prac;\n    .grid5x4(); justify-items:center; align-items:center; // The 5x4 Tabs + Dim + Per + 9 Practices Grid\n      .tabs{ grid-area:tabs; display:inline; color:@theme-color; font-size:@theme-tab-size;\n             justify-self:start; align-self:center; text-align:left; }\n      .cm { .pdir(cm); } .em   { .pdir(em);   } .in    { .pdir(in); }    .en   { .pdir(en);   }\n      .le { .pdir(le); } .nw   { .pdir(nw);   } .north { .pdir(north); } .ne   { .pdir(ne);   }\n      .do { .pdir(do); } .west { .pdir(west); } .cen   { .pdir(cen);   } .east { .pdir(east); }\n      .sh { .pdir(sh); } .sw   { .pdir(sw);   } .south { .pdir(south); } .se   { .pdir(se);   }\n    \n      // Placed one level below the 9 Practices Grid   - Check on background-color:#603;\n    .prac { background-color:#603; border-radius:36px; width:90%; height:80%; font-size:@theme-prac-size;\n      font-weight:bold;\n      .grid3x3(); // The 4 Displine plus Practiice name Grid\n                             .north { .ddir(north); }\n      .west { .ddir(west); } .cen   { .ddir(cen);   } .east { .ddir(east); }\n                             .south { .ddir(south); }\n      .cen  { font-size:@theme-cen-size; }\n      div   { font-size:@theme-dir-size; } }\n  \n    .disp {   display:inline; justify-self:center; align-self:center; text-align:center; font-size:@theme-disp-size;\n      i     { display:inline-block;  margin-right: 0.25rem; }\n      .name { display:inline-block; }\n      .desc { display:none; margin:0.5rem 0.5rem 0.5rem 0.5rem; text-align:left; } }\n  \n    .area { .grid1x3(); justify-self:start; align-self:center; text-align:left; margin-left:1.5em;\n      width:90%; height:auto; font-size:@theme-area-size;\n      i     { grid-area:icon; }\n      .name { grid-area:name; font-weight:900; }\n      .desc { grid-area:desc; } }\n  \n    .none { display:none; }\n    \n    // Placed one level above .prac at the 9 Practices Grid Direction\n    .pracFull { position:absolute; left:3%; top:6%; right:3%; bottom:6%; display:grid;\n      .prac { font-size:@theme-full-size; width:100%; height:100%;\n              justify-self:center; align-self:center; display:grid; border-radius:0.5rem;\n        div {     padding-bottom:2rem;\n          .disp { padding-bottom:0;\n            i     { font-size:@theme-disp-size; }\n            .name { font-size:@theme-disp-size; }\n            .desc { font-size:@theme-disp-size; display:block; } } }  // Turns on .disp .desc\n          .area { padding-bottom:0; } } }\n  \n    // Placed one level above .dir at the 4 Disipline plus Practice name Grid Direction\n    .dispFull { position:absolute; left:3%; top:6%; right:3%; bottom:6%; display:grid; border-radius:72px;\n       .disp { justify-self:center; margin:0;\n         i     { font-size:@theme-area-icon-size !important; }\n         .name { font-size:@theme-area-name-size !important; }\n         .desc { font-size:@theme-area-desc-size !important; display:block; } }  // Turns on .disp .desc\n       .area {   font-size:@theme-area-area-size !important; padding-bottom:0; } }\n    \n    .em, .in, .en { .prac .cen { font-size:@theme-row-size; } } // Font size columns\n  \n    .row { background-color:#603; border-radius:36px; margin-left:10%; width:80%; height:80%; font-size:@theme-row-size;\n      font-weight:bold; display:grid;\n      div { text-align:center; justify-self:center;  align-self:center; font-size:@theme-row-size; color:@theme-color; }\n      i { margin-bottom: 0.2rem; display:block; } }\n    \n    \n  }\n  \n</style>\n\n"]}, media: undefined });

  };
  /* scoped */
  const __vue_scope_id__$5 = undefined;
  /* module identifier */
  const __vue_module_identifier__$5 = undefined;
  /* functional template */
  const __vue_is_functional_template__$5 = false;
  /* style inject SSR */
  

  
  var Disp$1 = normalizeComponent_1(
    { render: __vue_render__$5, staticRenderFns: __vue_staticRenderFns__$5 },
    __vue_inject_styles__$5,
    __vue_script__$5,
    __vue_scope_id__$5,
    __vue_is_functional_template__$5,
    __vue_module_identifier__$5,
    browser,
    undefined
  );

export default Disp$1;
