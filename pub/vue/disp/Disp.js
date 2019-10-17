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

  props: { route:String, pages:Object, position:String },
  
  data() { return { pageKey:'None', pageObj:null } },
  
  methods: {
    onPage: function (key) {
      if( key !== 'None') {
        this.pageKey = key;
        this.nav().setPageKey( this.route, key ); } },
    doPage: function (key) {
        this.onPage( key );
        this.nav().pub( { source:'Tabs', route:this.route, pageKey:key } ); },
    stylePos: function () {
      return this.position==='right' ? { left:'50%' } : { left:0 }; },
    classTab: function (pageKey) {
      return this.pageKey===pageKey ? 'tabs-tab-active' : 'tabs-tab'; } },

  beforeMount: function () {  // We want to set the routes pages asap
    this.onPage( this.nav().setPages( this.route, this.pages ) ); },

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
    inject("data-v-fb25520c_0", { source: ".theme-desc {\n  font-size: 1rem;\n  background-color: #333;\n  border-radius: 0.7em;\n  width: 90%;\n  height: 90%;\n}\n.tabs-pane {\n  background-color: black;\n  font-size: 3.4vmin;\n  position: absolute;\n  left: 0;\n  top: 0;\n  width: 50%;\n  height: 5%;\n}\n.tabs-pane .tabs-tab {\n  display: inline-block;\n  margin-left: 2rem;\n  padding: 0.2rem 0.3rem 0.1rem 0.3rem;\n  border-radius: 12px 12px 0 0;\n  border-left: wheat solid thin;\n  border-top: wheat solid thin;\n  border-right: wheat solid thin;\n  background-color: black;\n  color: wheat;\n}\n.tabs-pane .tabs-tab:hover {\n  background-color: wheat;\n  color: black;\n}\n.tabs-pane .tabs-tab-active {\n  display: inline-block;\n  margin-left: 2rem;\n  padding: 0.2rem 0.3rem 0.1rem 0.3rem;\n  border-radius: 12px 12px 0 0;\n  border-left: wheat solid thin;\n  border-top: wheat solid thin;\n  border-right: wheat solid thin;\n  background-color: black;\n  color: wheat;\n  background-color: wheat;\n  color: black;\n}\n", map: {"version":3,"sources":["Tabs.vue","/Users/ax/Documents/prj/aug/vue/elem/Tabs.vue"],"names":[],"mappings":"AAAA;EACE,eAAe;EACf,sBAAsB;EACtB,oBAAoB;EACpB,UAAU;EACV,WAAW;AACb;AACA;EACE,uBAAuB;EACvB,kBAAkB;EAClB,kBAAkB;EAClB,OAAO;EACP,MAAM;EACN,UAAU;EACV,UAAU;AACZ;AACA;EACE,qBAAqB;EACrB,iBAAiB;EACjB,oCAAoC;EACpC,4BAA4B;EAC5B,6BAA6B;EAC7B,4BAA4B;EAC5B,8BAA8B;EAC9B,uBAAuB;EACvB,YAAY;AACd;AACA;EACE,uBAAuB;EACvB,YAAY;AACd;AACA;EACE,qBAAqB;EACrB,iBAAiB;EACjB,oCAAoC;EACpC,4BAA4B;EAC5B,6BAA6B;EAC7B,4BAA4B;EAC5B,8BAA8B;EAC9B,uBAAuB;EACvB,YAAY;EACZ,uBAAuB;EACvB,YAAY;ACCd","file":"Tabs.vue","sourcesContent":[".theme-desc {\n  font-size: 1rem;\n  background-color: #333;\n  border-radius: 0.7em;\n  width: 90%;\n  height: 90%;\n}\n.tabs-pane {\n  background-color: black;\n  font-size: 3.4vmin;\n  position: absolute;\n  left: 0;\n  top: 0;\n  width: 50%;\n  height: 5%;\n}\n.tabs-pane .tabs-tab {\n  display: inline-block;\n  margin-left: 2rem;\n  padding: 0.2rem 0.3rem 0.1rem 0.3rem;\n  border-radius: 12px 12px 0 0;\n  border-left: wheat solid thin;\n  border-top: wheat solid thin;\n  border-right: wheat solid thin;\n  background-color: black;\n  color: wheat;\n}\n.tabs-pane .tabs-tab:hover {\n  background-color: wheat;\n  color: black;\n}\n.tabs-pane .tabs-tab-active {\n  display: inline-block;\n  margin-left: 2rem;\n  padding: 0.2rem 0.3rem 0.1rem 0.3rem;\n  border-radius: 12px 12px 0 0;\n  border-left: wheat solid thin;\n  border-top: wheat solid thin;\n  border-right: wheat solid thin;\n  background-color: black;\n  color: wheat;\n  background-color: wheat;\n  color: black;\n}\n","\n<template>\n  <div class=\"tabs-pane\" :style=\"stylePos()\">\n    <template v-for=\"pageObj in pages\">\n      <div :class=\"classTab(pageObj.key)\" @click=\"doPage(pageObj.key)\">{{pageObj.title}}</div>\n    </template>\n  </div>\n</template>\n\n<script type=\"module\">\n\n  export default {\n\n    props: { route:String, pages:Object, position:String },\n    \n    data() { return { pageKey:'None', pageObj:null } },\n    \n    methods: {\n      onPage: function (key) {\n        if( key !== 'None') {\n          this.pageKey = key;\n          this.nav().setPageKey( this.route, key ); } },\n      doPage: function (key) {\n          this.onPage( key );\n          this.nav().pub( { source:'Tabs', route:this.route, pageKey:key } ); },\n      stylePos: function () {\n        return this.position==='right' ? { left:'50%' } : { left:0 }; },\n      classTab: function (pageKey) {\n        return this.pageKey===pageKey ? 'tabs-tab-active' : 'tabs-tab'; } },\n\n    beforeMount: function () {  // We want to set the routes pages asap\n      this.onPage( this.nav().setPages( this.route, this.pages ) ); },\n\n    mounted: function() {\n      this.subscribe(  \"Nav\", 'Tabs.vue.'+this.route, (obj) => {\n        if( obj.source !== 'Tabs' && obj.route === this.route ) {\n          this.onPage( obj.pageKey ); } } ); }  // this.nav().getPageKey(this.route)\n    }\n  \n</script>\n\n<style lang=\"less\">\n  \n  @import '../../pub/css/themes/theme.less';\n  \n  @tabsFS:1.7*@themeFS;\n  \n  .tabs-pane { background-color:@theme-back; font-size:@tabsFS;\n    position:absolute; left:0; top:0; width:@theme-tabs-width; height:@theme-tabs-height;\n    \n    .tabs-tab { display:inline-block; margin-left:2.0rem; padding:0.2rem 0.3rem 0.1rem 0.3rem;\n      border-radius:12px 12px 0 0; border-left: @theme-fore solid thin;\n      border-top:@theme-fore solid thin; border-right:@theme-fore solid thin;\n                  background-color:@theme-back;  color:@theme-fore;}\n    .tabs-tab:hover  {         background-color:@theme-fore; color:@theme-back; }\n    .tabs-tab-active { .tabs-tab(); background-color:@theme-fore; color:@theme-back; } }\n  \n</style>"]}, media: undefined });

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


let Dims = {

  props: { dispObj:Object, from:String },

  methods: {
    doClick: function (key) {
      if( this.isDef(this.dispObj.column) ) { this.doPrac(key); }
      else                                  { this.doDisp(key); } },
    gridClass: function() {
      return this.dispObj.column==="Innovate" ? 'dd-4x4' : 'dd-4x3'; },
    doDisp:  function (dispKey) {
      let obj = { route:"Disp", dispKey:dispKey }; // pracKey:this.pracObj.name,
      this.nav().pub( obj ); },
    doPrac: function (pracKey) {
      let obj = { route:"Prac", pracKey:pracKey };
      this.nav().pub( obj ); },
    dispClass: function() {
      return this.from==='Disp' ? 'dims-disp' : 'dims-dirs';
    },
    style: function( ikwObj ) {
      let fontSize = this.from==='Disp' ? 2.0 : 1.0;
      return this.styleObj(ikwObj,fontSize); } },
};

/* script */
const __vue_script__$1 = Dims;

/* template */
var __vue_render__$1 = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c("div", { class: _vm.dispClass(), style: _vm.style(_vm.dispObj) }, [
    _c(
      "div",
      {
        staticClass: "dims-head",
        on: {
          click: function($event) {
            return _vm.doClick(_vm.dispObj.name)
          }
        }
      },
      [
        _c("div", { staticClass: "dims-title" }, [
          _c("i", { class: _vm.dispObj.icon }),
          _vm._v(" "),
          _c("span", { staticClass: "dims-name" }, [
            _vm._v(_vm._s(_vm.dispObj.name))
          ])
        ])
      ]
    ),
    _vm._v(" "),
    _c(
      "div",
      { class: _vm.gridClass() },
      [
        _vm._l(_vm.dispObj.dims, function(ddObj) {
          return [
            _c("div", { class: ddObj.klass }, [
              _c("i", { class: ddObj.icon }),
              _vm._v(" "),
              _c("span", { staticClass: "dims-name" }, [
                _vm._v(_vm._s(ddObj.name))
              ])
            ])
          ]
        })
      ],
      2
    )
  ])
};
var __vue_staticRenderFns__$1 = [];
__vue_render__$1._withStripped = true;

  /* style */
  const __vue_inject_styles__$1 = function (inject) {
    if (!inject) return
    inject("data-v-3768f549_0", { source: ".theme-desc {\n  font-size: 1rem;\n  background-color: #333;\n  border-radius: 0.7em;\n  width: 90%;\n  height: 90%;\n}\n.dims-disp {\n  font-size: 5.2vmin;\n  border-radius: 1.3vmin;\n  position: absolute;\n  left: 0;\n  top: 5%;\n  right: 0;\n  bottom: 0;\n}\n.dims-dirs {\n  font-size: 2.6vmin;\n  border-radius: 36px;\n}\n.dims-head {\n  display: grid;\n  justify-self: center;\n  align-self: center;\n  text-align: center;\n  font-size: 5.98vmin;\n}\n.dims-head .dims-title {\n  display: inline;\n}\n.dims-head .dims-title i {\n  display: inline-block;\n  margin-right: 0.65vmin;\n}\n.dims-head .dims-title .dims-name {\n  display: inline-block;\n}\n.dd-4x3 {\n  display: grid;\n  grid-template-columns: 1fr 1fr 1fr;\n  grid-template-rows: 1fr 1fr 1fr 1fr;\n  grid-template-areas: \"pi pk pw\" \"li lk lw\" \"di dk dw\" \"si sk sw\";\n  margin-left: 2.6vmin;\n}\n.dd-4x3 .pi {\n  display: inline;\n  grid-area: pi;\n  font-size: 3.12vmin;\n  text-align: left;\n}\n.dd-4x3 .pi i {\n  display: inline-block;\n  margin-right: 0.25rem;\n}\n.dd-4x3 .pi .dims-name {\n  display: inline-block;\n}\n.dd-4x3 .pk {\n  display: inline;\n  grid-area: pk;\n  font-size: 3.12vmin;\n  text-align: left;\n}\n.dd-4x3 .pk i {\n  display: inline-block;\n  margin-right: 0.25rem;\n}\n.dd-4x3 .pk .dims-name {\n  display: inline-block;\n}\n.dd-4x3 .pw {\n  display: inline;\n  grid-area: pw;\n  font-size: 3.12vmin;\n  text-align: left;\n}\n.dd-4x3 .pw i {\n  display: inline-block;\n  margin-right: 0.25rem;\n}\n.dd-4x3 .pw .dims-name {\n  display: inline-block;\n}\n.dd-4x3 .li {\n  display: inline;\n  grid-area: li;\n  font-size: 2.34vmin;\n  text-align: left;\n}\n.dd-4x3 .li i {\n  display: inline-block;\n  margin-right: 0.65vmin;\n}\n.dd-4x3 .li .dims-name {\n  display: inline-block;\n}\n.dd-4x3 .lk {\n  display: inline;\n  grid-area: lk;\n  font-size: 2.34vmin;\n  text-align: left;\n}\n.dd-4x3 .lk i {\n  display: inline-block;\n  margin-right: 0.65vmin;\n}\n.dd-4x3 .lk .dims-name {\n  display: inline-block;\n}\n.dd-4x3 .lw {\n  display: inline;\n  grid-area: lw;\n  font-size: 2.34vmin;\n  text-align: left;\n}\n.dd-4x3 .lw i {\n  display: inline-block;\n  margin-right: 0.65vmin;\n}\n.dd-4x3 .lw .dims-name {\n  display: inline-block;\n}\n.dd-4x3 .di {\n  display: inline;\n  grid-area: di;\n  font-size: 2.34vmin;\n  text-align: left;\n}\n.dd-4x3 .di i {\n  display: inline-block;\n  margin-right: 0.65vmin;\n}\n.dd-4x3 .di .dims-name {\n  display: inline-block;\n}\n.dd-4x3 .dk {\n  display: inline;\n  grid-area: dk;\n  font-size: 2.34vmin;\n  text-align: left;\n}\n.dd-4x3 .dk i {\n  display: inline-block;\n  margin-right: 0.65vmin;\n}\n.dd-4x3 .dk .dims-name {\n  display: inline-block;\n}\n.dd-4x3 .dw {\n  display: inline;\n  grid-area: dw;\n  font-size: 2.34vmin;\n  text-align: left;\n}\n.dd-4x3 .dw i {\n  display: inline-block;\n  margin-right: 0.65vmin;\n}\n.dd-4x3 .dw .dims-name {\n  display: inline-block;\n}\n.dd-4x3 .si {\n  display: inline;\n  grid-area: si;\n  font-size: 2.34vmin;\n  text-align: left;\n}\n.dd-4x3 .si i {\n  display: inline-block;\n  margin-right: 0.65vmin;\n}\n.dd-4x3 .si .dims-name {\n  display: inline-block;\n}\n.dd-4x3 .sk {\n  display: inline;\n  grid-area: sk;\n  font-size: 2.34vmin;\n  text-align: left;\n}\n.dd-4x3 .sk i {\n  display: inline-block;\n  margin-right: 0.65vmin;\n}\n.dd-4x3 .sk .dims-name {\n  display: inline-block;\n}\n.dd-4x3 .sw {\n  display: inline;\n  grid-area: sw;\n  font-size: 2.34vmin;\n  text-align: left;\n}\n.dd-4x3 .sw i {\n  display: inline-block;\n  margin-right: 0.65vmin;\n}\n.dd-4x3 .sw .dims-name {\n  display: inline-block;\n}\n.dd-4x4 {\n  display: grid;\n  grid-template-columns: 1fr 1fr 1fr 1fr;\n  grid-template-rows: 1fr 1fr 1fr 1fr;\n  grid-template-areas: \"pi pd pk pw\" \"li ld lk lw\" \"di dd dk dw\" \"si sd sk sw\";\n  margin-left: 2.6vmin;\n}\n.dd-4x4 .pi {\n  display: inline;\n  grid-area: pi;\n  font-size: 3.12vmin;\n  text-align: left;\n}\n.dd-4x4 .pi i {\n  display: inline-block;\n  margin-right: 0.25rem;\n}\n.dd-4x4 .pi .dims-name {\n  display: inline-block;\n}\n.dd-4x4 .pd {\n  display: inline;\n  grid-area: pd;\n  font-size: 3.12vmin;\n  text-align: left;\n}\n.dd-4x4 .pd i {\n  display: inline-block;\n  margin-right: 0.25rem;\n}\n.dd-4x4 .pd .dims-name {\n  display: inline-block;\n}\n.dd-4x4 .pk {\n  display: inline;\n  grid-area: pk;\n  font-size: 3.12vmin;\n  text-align: left;\n}\n.dd-4x4 .pk i {\n  display: inline-block;\n  margin-right: 0.25rem;\n}\n.dd-4x4 .pk .dims-name {\n  display: inline-block;\n}\n.dd-4x4 .pw {\n  display: inline;\n  grid-area: pw;\n  font-size: 3.12vmin;\n  text-align: left;\n}\n.dd-4x4 .pw i {\n  display: inline-block;\n  margin-right: 0.25rem;\n}\n.dd-4x4 .pw .dims-name {\n  display: inline-block;\n}\n.dd-4x4 .li {\n  display: inline;\n  grid-area: li;\n  font-size: 2.34vmin;\n  text-align: left;\n}\n.dd-4x4 .li i {\n  display: inline-block;\n  margin-right: 0.65vmin;\n}\n.dd-4x4 .li .dims-name {\n  display: inline-block;\n}\n.dd-4x4 .ld {\n  display: inline;\n  grid-area: ld;\n  font-size: 2.34vmin;\n  text-align: left;\n}\n.dd-4x4 .ld i {\n  display: inline-block;\n  margin-right: 0.65vmin;\n}\n.dd-4x4 .ld .dims-name {\n  display: inline-block;\n}\n.dd-4x4 .lk {\n  display: inline;\n  grid-area: lk;\n  font-size: 2.34vmin;\n  text-align: left;\n}\n.dd-4x4 .lk i {\n  display: inline-block;\n  margin-right: 0.65vmin;\n}\n.dd-4x4 .lk .dims-name {\n  display: inline-block;\n}\n.dd-4x4 .lw {\n  display: inline;\n  grid-area: lw;\n  font-size: 2.34vmin;\n  text-align: left;\n}\n.dd-4x4 .lw i {\n  display: inline-block;\n  margin-right: 0.65vmin;\n}\n.dd-4x4 .lw .dims-name {\n  display: inline-block;\n}\n.dd-4x4 .di {\n  display: inline;\n  grid-area: di;\n  font-size: 2.34vmin;\n  text-align: left;\n}\n.dd-4x4 .di i {\n  display: inline-block;\n  margin-right: 0.65vmin;\n}\n.dd-4x4 .di .dims-name {\n  display: inline-block;\n}\n.dd-4x4 .dd {\n  display: inline;\n  grid-area: dd;\n  font-size: 2.34vmin;\n  text-align: left;\n}\n.dd-4x4 .dd i {\n  display: inline-block;\n  margin-right: 0.65vmin;\n}\n.dd-4x4 .dd .dims-name {\n  display: inline-block;\n}\n.dd-4x4 .dk {\n  display: inline;\n  grid-area: dk;\n  font-size: 2.34vmin;\n  text-align: left;\n}\n.dd-4x4 .dk i {\n  display: inline-block;\n  margin-right: 0.65vmin;\n}\n.dd-4x4 .dk .dims-name {\n  display: inline-block;\n}\n.dd-4x4 .dw {\n  display: inline;\n  grid-area: dw;\n  font-size: 2.34vmin;\n  text-align: left;\n}\n.dd-4x4 .dw i {\n  display: inline-block;\n  margin-right: 0.65vmin;\n}\n.dd-4x4 .dw .dims-name {\n  display: inline-block;\n}\n.dd-4x4 .si {\n  display: inline;\n  grid-area: si;\n  font-size: 2.34vmin;\n  text-align: left;\n}\n.dd-4x4 .si i {\n  display: inline-block;\n  margin-right: 0.65vmin;\n}\n.dd-4x4 .si .dims-name {\n  display: inline-block;\n}\n.dd-4x4 .sd {\n  display: inline;\n  grid-area: sd;\n  font-size: 2.34vmin;\n  text-align: left;\n}\n.dd-4x4 .sd i {\n  display: inline-block;\n  margin-right: 0.65vmin;\n}\n.dd-4x4 .sd .dims-name {\n  display: inline-block;\n}\n.dd-4x4 .sk {\n  display: inline;\n  grid-area: sk;\n  font-size: 2.34vmin;\n  text-align: left;\n}\n.dd-4x4 .sk i {\n  display: inline-block;\n  margin-right: 0.65vmin;\n}\n.dd-4x4 .sk .dims-name {\n  display: inline-block;\n}\n.dd-4x4 .sw {\n  display: inline;\n  grid-area: sw;\n  font-size: 2.34vmin;\n  text-align: left;\n}\n.dd-4x4 .sw i {\n  display: inline-block;\n  margin-right: 0.65vmin;\n}\n.dd-4x4 .sw .dims-name {\n  display: inline-block;\n}\n", map: {"version":3,"sources":["Dims.vue","/Users/ax/Documents/prj/aug/vue/prac/Dims.vue"],"names":[],"mappings":"AAAA;EACE,eAAe;EACf,sBAAsB;EACtB,oBAAoB;EACpB,UAAU;EACV,WAAW;AACb;AACA;EACE,kBAAkB;EAClB,sBAAsB;EACtB,kBAAkB;EAClB,OAAO;EACP,OAAO;EACP,QAAQ;EACR,SAAS;AACX;AACA;EACE,kBAAkB;EAClB,mBAAmB;AACrB;AACA;EACE,aAAa;EACb,oBAAoB;EACpB,kBAAkB;EAClB,kBAAkB;EAClB,mBAAmB;AACrB;AACA;EACE,eAAe;AACjB;AACA;EACE,qBAAqB;EACrB,sBAAsB;AACxB;AACA;EACE,qBAAqB;AACvB;AACA;EACE,aAAa;EACb,kCAAkC;EAClC,mCAAmC;EACnC,gEAAgE;EAChE,oBAAoB;AACtB;AACA;EACE,eAAe;EACf,aAAa;EACb,mBAAmB;EACnB,gBAAgB;AAClB;AACA;EACE,qBAAqB;ECCvB,qBAAA;ADCA;ACCA;EDCE,qBAAqB;ACCvB;AACA;EDCE,eAAe;ECCjB,aAAA;EACA,mBAAA;EDCE,gBAAgB;ACClB;AACA;EDCE,qBAAqB;ECCvB,qBAAA;ADCA;ACCA;EACA,qBAAA;AACA;AACA;EDCE,eAAe;ECCjB,aAAA;EACA,mBAAA;EACA,gBAAA;ADCA;ACCA;EACA,qBAAA;EACA,qBAAA;ADCA;ACCA;EACA,qBAAA;AACA;AACA;EACA,eAAA;EDCE,aAAa;ECCf,mBAAA;EACA,gBAAA;AACA;AACA;EACA,qBAAA;EDCE,sBAAsB;AACxB;AACA;EACE,qBAAqB;AACvB;AACA;EACE,eAAe;EACf,aAAa;EACb,mBAAmB;EACnB,gBAAgB;AAClB;AACA;EACE,qBAAqB;EACrB,sBAAsB;AACxB;AACA;EACE,qBAAqB;AACvB;AACA;EACE,eAAe;EACf,aAAa;EACb,mBAAmB;EACnB,gBAAgB;AAClB;AACA;EACE,qBAAqB;EACrB,sBAAsB;AACxB;AACA;EACE,qBAAqB;AACvB;AACA;EACE,eAAe;EACf,aAAa;EACb,mBAAmB;EACnB,gBAAgB;AAClB;AACA;EACE,qBAAqB;EACrB,sBAAsB;AACxB;AACA;EACE,qBAAqB;AACvB;AACA;EACE,eAAe;EACf,aAAa;EACb,mBAAmB;EACnB,gBAAgB;AAClB;AACA;EACE,qBAAqB;EACrB,sBAAsB;AACxB;AACA;EACE,qBAAqB;AACvB;AACA;EACE,eAAe;EACf,aAAa;EACb,mBAAmB;EACnB,gBAAgB;AAClB;AACA;EACE,qBAAqB;EACrB,sBAAsB;AACxB;AACA;EACE,qBAAqB;AACvB;AACA;EACE,eAAe;EACf,aAAa;EACb,mBAAmB;EACnB,gBAAgB;AAClB;AACA;EACE,qBAAqB;EACrB,sBAAsB;AACxB;AACA;EACE,qBAAqB;AACvB;AACA;EACE,eAAe;EACf,aAAa;EACb,mBAAmB;EACnB,gBAAgB;AAClB;AACA;EACE,qBAAqB;EACrB,sBAAsB;AACxB;AACA;EACE,qBAAqB;AACvB;AACA;EACE,eAAe;EACf,aAAa;EACb,mBAAmB;EACnB,gBAAgB;AAClB;AACA;EACE,qBAAqB;EACrB,sBAAsB;AACxB;AACA;EACE,qBAAqB;AACvB;AACA;EACE,aAAa;EACb,sCAAsC;EACtC,mCAAmC;EACnC,4EAA4E;EAC5E,oBAAoB;AACtB;AACA;EACE,eAAe;EACf,aAAa;EACb,mBAAmB;EACnB,gBAAgB;AAClB;AACA;EACE,qBAAqB;EACrB,qBAAqB;AACvB;AACA;EACE,qBAAqB;AACvB;AACA;EACE,eAAe;EACf,aAAa;EACb,mBAAmB;EACnB,gBAAgB;AAClB;AACA;EACE,qBAAqB;EACrB,qBAAqB;AACvB;AACA;EACE,qBAAqB;AACvB;AACA;EACE,eAAe;EACf,aAAa;EACb,mBAAmB;EACnB,gBAAgB;AAClB;AACA;EACE,qBAAqB;EACrB,qBAAqB;AACvB;AACA;EACE,qBAAqB;AACvB;AACA;EACE,eAAe;EACf,aAAa;EACb,mBAAmB;EACnB,gBAAgB;AAClB;AACA;EACE,qBAAqB;EACrB,qBAAqB;AACvB;AACA;EACE,qBAAqB;AACvB;AACA;EACE,eAAe;EACf,aAAa;EACb,mBAAmB;EACnB,gBAAgB;AAClB;AACA;EACE,qBAAqB;EACrB,sBAAsB;AACxB;AACA;EACE,qBAAqB;AACvB;AACA;EACE,eAAe;EACf,aAAa;EACb,mBAAmB;EACnB,gBAAgB;AAClB;AACA;EACE,qBAAqB;EACrB,sBAAsB;AACxB;AACA;EACE,qBAAqB;AACvB;AACA;EACE,eAAe;EACf,aAAa;EACb,mBAAmB;EACnB,gBAAgB;AAClB;AACA;EACE,qBAAqB;EACrB,sBAAsB;AACxB;AACA;EACE,qBAAqB;AACvB;AACA;EACE,eAAe;EACf,aAAa;EACb,mBAAmB;EACnB,gBAAgB;AAClB;AACA;EACE,qBAAqB;EACrB,sBAAsB;AACxB;AACA;EACE,qBAAqB;AACvB;AACA;EACE,eAAe;EACf,aAAa;EACb,mBAAmB;EACnB,gBAAgB;AAClB;AACA;EACE,qBAAqB;EACrB,sBAAsB;AACxB;AACA;EACE,qBAAqB;AACvB;AACA;EACE,eAAe;EACf,aAAa;EACb,mBAAmB;EACnB,gBAAgB;AAClB;AACA;EACE,qBAAqB;EACrB,sBAAsB;AACxB;AACA;EACE,qBAAqB;AACvB;AACA;EACE,eAAe;EACf,aAAa;EACb,mBAAmB;EACnB,gBAAgB;AAClB;AACA;EACE,qBAAqB;EACrB,sBAAsB;AACxB;AACA;EACE,qBAAqB;AACvB;AACA;EACE,eAAe;EACf,aAAa;EACb,mBAAmB;EACnB,gBAAgB;AAClB;AACA;EACE,qBAAqB;EACrB,sBAAsB;AACxB;AACA;EACE,qBAAqB;AACvB;AACA;EACE,eAAe;EACf,aAAa;EACb,mBAAmB;EACnB,gBAAgB;AAClB;AACA;EACE,qBAAqB;EACrB,sBAAsB;AACxB;AACA;EACE,qBAAqB;AACvB;AACA;EACE,eAAe;EACf,aAAa;EACb,mBAAmB;EACnB,gBAAgB;AAClB;AACA;EACE,qBAAqB;EACrB,sBAAsB;AACxB;AACA;EACE,qBAAqB;AACvB;AACA;EACE,eAAe;EACf,aAAa;EACb,mBAAmB;EACnB,gBAAgB;AAClB;AACA;EACE,qBAAqB;EACrB,sBAAsB;AACxB;AACA;EACE,qBAAqB;AACvB;AACA;EACE,eAAe;EACf,aAAa;EACb,mBAAmB;EACnB,gBAAgB;AAClB;AACA;EACE,qBAAqB;EACrB,sBAAsB;AACxB;AACA;EACE,qBAAqB;AACvB","file":"Dims.vue","sourcesContent":[".theme-desc {\n  font-size: 1rem;\n  background-color: #333;\n  border-radius: 0.7em;\n  width: 90%;\n  height: 90%;\n}\n.dims-disp {\n  font-size: 5.2vmin;\n  border-radius: 1.3vmin;\n  position: absolute;\n  left: 0;\n  top: 5%;\n  right: 0;\n  bottom: 0;\n}\n.dims-dirs {\n  font-size: 2.6vmin;\n  border-radius: 36px;\n}\n.dims-head {\n  display: grid;\n  justify-self: center;\n  align-self: center;\n  text-align: center;\n  font-size: 5.98vmin;\n}\n.dims-head .dims-title {\n  display: inline;\n}\n.dims-head .dims-title i {\n  display: inline-block;\n  margin-right: 0.65vmin;\n}\n.dims-head .dims-title .dims-name {\n  display: inline-block;\n}\n.dd-4x3 {\n  display: grid;\n  grid-template-columns: 1fr 1fr 1fr;\n  grid-template-rows: 1fr 1fr 1fr 1fr;\n  grid-template-areas: \"pi pk pw\" \"li lk lw\" \"di dk dw\" \"si sk sw\";\n  margin-left: 2.6vmin;\n}\n.dd-4x3 .pi {\n  display: inline;\n  grid-area: pi;\n  font-size: 3.12vmin;\n  text-align: left;\n}\n.dd-4x3 .pi i {\n  display: inline-block;\n  margin-right: 0.25rem;\n}\n.dd-4x3 .pi .dims-name {\n  display: inline-block;\n}\n.dd-4x3 .pk {\n  display: inline;\n  grid-area: pk;\n  font-size: 3.12vmin;\n  text-align: left;\n}\n.dd-4x3 .pk i {\n  display: inline-block;\n  margin-right: 0.25rem;\n}\n.dd-4x3 .pk .dims-name {\n  display: inline-block;\n}\n.dd-4x3 .pw {\n  display: inline;\n  grid-area: pw;\n  font-size: 3.12vmin;\n  text-align: left;\n}\n.dd-4x3 .pw i {\n  display: inline-block;\n  margin-right: 0.25rem;\n}\n.dd-4x3 .pw .dims-name {\n  display: inline-block;\n}\n.dd-4x3 .li {\n  display: inline;\n  grid-area: li;\n  font-size: 2.34vmin;\n  text-align: left;\n}\n.dd-4x3 .li i {\n  display: inline-block;\n  margin-right: 0.65vmin;\n}\n.dd-4x3 .li .dims-name {\n  display: inline-block;\n}\n.dd-4x3 .lk {\n  display: inline;\n  grid-area: lk;\n  font-size: 2.34vmin;\n  text-align: left;\n}\n.dd-4x3 .lk i {\n  display: inline-block;\n  margin-right: 0.65vmin;\n}\n.dd-4x3 .lk .dims-name {\n  display: inline-block;\n}\n.dd-4x3 .lw {\n  display: inline;\n  grid-area: lw;\n  font-size: 2.34vmin;\n  text-align: left;\n}\n.dd-4x3 .lw i {\n  display: inline-block;\n  margin-right: 0.65vmin;\n}\n.dd-4x3 .lw .dims-name {\n  display: inline-block;\n}\n.dd-4x3 .di {\n  display: inline;\n  grid-area: di;\n  font-size: 2.34vmin;\n  text-align: left;\n}\n.dd-4x3 .di i {\n  display: inline-block;\n  margin-right: 0.65vmin;\n}\n.dd-4x3 .di .dims-name {\n  display: inline-block;\n}\n.dd-4x3 .dk {\n  display: inline;\n  grid-area: dk;\n  font-size: 2.34vmin;\n  text-align: left;\n}\n.dd-4x3 .dk i {\n  display: inline-block;\n  margin-right: 0.65vmin;\n}\n.dd-4x3 .dk .dims-name {\n  display: inline-block;\n}\n.dd-4x3 .dw {\n  display: inline;\n  grid-area: dw;\n  font-size: 2.34vmin;\n  text-align: left;\n}\n.dd-4x3 .dw i {\n  display: inline-block;\n  margin-right: 0.65vmin;\n}\n.dd-4x3 .dw .dims-name {\n  display: inline-block;\n}\n.dd-4x3 .si {\n  display: inline;\n  grid-area: si;\n  font-size: 2.34vmin;\n  text-align: left;\n}\n.dd-4x3 .si i {\n  display: inline-block;\n  margin-right: 0.65vmin;\n}\n.dd-4x3 .si .dims-name {\n  display: inline-block;\n}\n.dd-4x3 .sk {\n  display: inline;\n  grid-area: sk;\n  font-size: 2.34vmin;\n  text-align: left;\n}\n.dd-4x3 .sk i {\n  display: inline-block;\n  margin-right: 0.65vmin;\n}\n.dd-4x3 .sk .dims-name {\n  display: inline-block;\n}\n.dd-4x3 .sw {\n  display: inline;\n  grid-area: sw;\n  font-size: 2.34vmin;\n  text-align: left;\n}\n.dd-4x3 .sw i {\n  display: inline-block;\n  margin-right: 0.65vmin;\n}\n.dd-4x3 .sw .dims-name {\n  display: inline-block;\n}\n.dd-4x4 {\n  display: grid;\n  grid-template-columns: 1fr 1fr 1fr 1fr;\n  grid-template-rows: 1fr 1fr 1fr 1fr;\n  grid-template-areas: \"pi pd pk pw\" \"li ld lk lw\" \"di dd dk dw\" \"si sd sk sw\";\n  margin-left: 2.6vmin;\n}\n.dd-4x4 .pi {\n  display: inline;\n  grid-area: pi;\n  font-size: 3.12vmin;\n  text-align: left;\n}\n.dd-4x4 .pi i {\n  display: inline-block;\n  margin-right: 0.25rem;\n}\n.dd-4x4 .pi .dims-name {\n  display: inline-block;\n}\n.dd-4x4 .pd {\n  display: inline;\n  grid-area: pd;\n  font-size: 3.12vmin;\n  text-align: left;\n}\n.dd-4x4 .pd i {\n  display: inline-block;\n  margin-right: 0.25rem;\n}\n.dd-4x4 .pd .dims-name {\n  display: inline-block;\n}\n.dd-4x4 .pk {\n  display: inline;\n  grid-area: pk;\n  font-size: 3.12vmin;\n  text-align: left;\n}\n.dd-4x4 .pk i {\n  display: inline-block;\n  margin-right: 0.25rem;\n}\n.dd-4x4 .pk .dims-name {\n  display: inline-block;\n}\n.dd-4x4 .pw {\n  display: inline;\n  grid-area: pw;\n  font-size: 3.12vmin;\n  text-align: left;\n}\n.dd-4x4 .pw i {\n  display: inline-block;\n  margin-right: 0.25rem;\n}\n.dd-4x4 .pw .dims-name {\n  display: inline-block;\n}\n.dd-4x4 .li {\n  display: inline;\n  grid-area: li;\n  font-size: 2.34vmin;\n  text-align: left;\n}\n.dd-4x4 .li i {\n  display: inline-block;\n  margin-right: 0.65vmin;\n}\n.dd-4x4 .li .dims-name {\n  display: inline-block;\n}\n.dd-4x4 .ld {\n  display: inline;\n  grid-area: ld;\n  font-size: 2.34vmin;\n  text-align: left;\n}\n.dd-4x4 .ld i {\n  display: inline-block;\n  margin-right: 0.65vmin;\n}\n.dd-4x4 .ld .dims-name {\n  display: inline-block;\n}\n.dd-4x4 .lk {\n  display: inline;\n  grid-area: lk;\n  font-size: 2.34vmin;\n  text-align: left;\n}\n.dd-4x4 .lk i {\n  display: inline-block;\n  margin-right: 0.65vmin;\n}\n.dd-4x4 .lk .dims-name {\n  display: inline-block;\n}\n.dd-4x4 .lw {\n  display: inline;\n  grid-area: lw;\n  font-size: 2.34vmin;\n  text-align: left;\n}\n.dd-4x4 .lw i {\n  display: inline-block;\n  margin-right: 0.65vmin;\n}\n.dd-4x4 .lw .dims-name {\n  display: inline-block;\n}\n.dd-4x4 .di {\n  display: inline;\n  grid-area: di;\n  font-size: 2.34vmin;\n  text-align: left;\n}\n.dd-4x4 .di i {\n  display: inline-block;\n  margin-right: 0.65vmin;\n}\n.dd-4x4 .di .dims-name {\n  display: inline-block;\n}\n.dd-4x4 .dd {\n  display: inline;\n  grid-area: dd;\n  font-size: 2.34vmin;\n  text-align: left;\n}\n.dd-4x4 .dd i {\n  display: inline-block;\n  margin-right: 0.65vmin;\n}\n.dd-4x4 .dd .dims-name {\n  display: inline-block;\n}\n.dd-4x4 .dk {\n  display: inline;\n  grid-area: dk;\n  font-size: 2.34vmin;\n  text-align: left;\n}\n.dd-4x4 .dk i {\n  display: inline-block;\n  margin-right: 0.65vmin;\n}\n.dd-4x4 .dk .dims-name {\n  display: inline-block;\n}\n.dd-4x4 .dw {\n  display: inline;\n  grid-area: dw;\n  font-size: 2.34vmin;\n  text-align: left;\n}\n.dd-4x4 .dw i {\n  display: inline-block;\n  margin-right: 0.65vmin;\n}\n.dd-4x4 .dw .dims-name {\n  display: inline-block;\n}\n.dd-4x4 .si {\n  display: inline;\n  grid-area: si;\n  font-size: 2.34vmin;\n  text-align: left;\n}\n.dd-4x4 .si i {\n  display: inline-block;\n  margin-right: 0.65vmin;\n}\n.dd-4x4 .si .dims-name {\n  display: inline-block;\n}\n.dd-4x4 .sd {\n  display: inline;\n  grid-area: sd;\n  font-size: 2.34vmin;\n  text-align: left;\n}\n.dd-4x4 .sd i {\n  display: inline-block;\n  margin-right: 0.65vmin;\n}\n.dd-4x4 .sd .dims-name {\n  display: inline-block;\n}\n.dd-4x4 .sk {\n  display: inline;\n  grid-area: sk;\n  font-size: 2.34vmin;\n  text-align: left;\n}\n.dd-4x4 .sk i {\n  display: inline-block;\n  margin-right: 0.65vmin;\n}\n.dd-4x4 .sk .dims-name {\n  display: inline-block;\n}\n.dd-4x4 .sw {\n  display: inline;\n  grid-area: sw;\n  font-size: 2.34vmin;\n  text-align: left;\n}\n.dd-4x4 .sw i {\n  display: inline-block;\n  margin-right: 0.65vmin;\n}\n.dd-4x4 .sw .dims-name {\n  display: inline-block;\n}\n","\n<template>\n  <div  :class=\"dispClass()\" :style=\"style(dispObj)\">\n    <div   class=\"dims-head\" @click=\"doClick(dispObj.name)\">\n      <div class=\"dims-title\">\n        <i   :class=\"dispObj.icon\"></i>\n        <span class=\"dims-name\">{{dispObj.name}}</span>\n      </div>\n    </div>\n    <div  :class=\"gridClass()\">\n      <template v-for=\"ddObj in dispObj.dims\">\n        <div   :class=\"ddObj.klass\">\n          <i   :class=\"ddObj.icon\"></i>\n          <span class=\"dims-name\">{{ddObj.name}}</span>\n        </div>\n      </template>\n    </div>\n  </div>\n</template>\n\n<script type=\"module\">\n  \n  let Dims = {\n\n    props: { dispObj:Object, from:String },\n\n    methods: {\n      doClick: function (key) {\n        if( this.isDef(this.dispObj.column) ) { this.doPrac(key) }\n        else                                  { this.doDisp(key) } },\n      gridClass: function() {\n        return this.dispObj.column===\"Innovate\" ? 'dd-4x4' : 'dd-4x3'; },\n      doDisp:  function (dispKey) {\n        let obj = { route:\"Disp\", dispKey:dispKey }; // pracKey:this.pracObj.name,\n        this.nav().pub( obj ); },\n      doPrac: function (pracKey) {\n        let obj = { route:\"Prac\", pracKey:pracKey };\n        this.nav().pub( obj ); },\n      dispClass: function() {\n        return this.from==='Disp' ? 'dims-disp' : 'dims-dirs';\n      },\n      style: function( ikwObj ) {\n        let fontSize = this.from==='Disp' ? 2.0 : 1.0;\n        return this.styleObj(ikwObj,fontSize); } },\n  }\n\n  export default Dims;\n\n</script>\n\n<style lang=\"less\">\n  \n  @import '../../pub/css/themes/theme.less';\n\n  @dimsFS:1.3*@themeFS;\n\n  .dims-grid4x3() { display:grid; grid-template-columns:1fr 1fr 1fr; grid-template-rows:1fr 1fr 1fr 1fr;\n    grid-template-areas: \"pi pk pw\" \"li lk lw\" \"di dk dw\" \"si sk sw\"; }\n\n  .dims-grid4x4() { display:grid; grid-template-columns:1fr 1fr 1fr 1fr; grid-template-rows:1fr 1fr 1fr 1fr;\n    grid-template-areas: \"pi pd pk pw\" \"li ld lk lw\" \"di dd dk dw\" \"si sd sk sw\"; }\n  \n  .dims-disp { font-size:2.0*@dimsFS; border-radius:0.5*@dimsFS;\n    position:absolute; left:0; top:@theme-tabs-height; right:0; bottom:0; }\n\n  .dims-dirs { font-size:@dimsFS; border-radius:36px; }\n\n  .dims-head    { display:grid; justify-self:center; align-self:center; text-align:center; font-size:2.3*@dimsFS;\n    .dims-title { display:inline;\n    i           { display:inline-block;  margin-right:0.25*@dimsFS; }\n    .dims-name  { display:inline-block; } } }\n\n  .plane( @area ) { display:inline; grid-area:@area; font-size:1.2*@dimsFS; text-align:left;\n    i             { display:inline-block;  margin-right: 0.25rem; }\n    .dims-name    { display:inline-block; } }\n\n  .study( @area ) { display:inline; grid-area:@area; font-size:0.9*@dimsFS; text-align:left;\n    i             { display:inline-block;  margin-right:0.25*@dimsFS; }\n    .dims-name    { display:inline-block; } }\n\n  .dd-4x3 { .dims-grid4x3(); margin-left:@dimsFS;\n    .pi { .plane(pi); }  .pk { .plane(pk); }  .pw { .plane(pw); }\n    .li { .study(li); }  .lk { .study(lk); }  .lw { .study(lw); }\n    .di { .study(di); }  .dk { .study(dk); }  .dw { .study(dw); }\n    .si { .study(si); }  .sk { .study(sk); }  .sw { .study(sw); } }\n  \n  .dd-4x4 { .dims-grid4x4(); margin-left:@dimsFS;\n    .pi { .plane(pi); }  .pd { .plane(pd); } .pk { .plane(pk); }  .pw { .plane(pw); }\n    .li { .study(li); }  .ld { .study(ld); } .lk { .study(lk); }  .lw { .study(lw); }\n    .di { .study(di); }  .dd { .study(dd); } .dk { .study(dk); }  .dw { .study(dw); }\n    .si { .study(si); }  .sd { .study(sd); } .sk { .study(sk); }  .sw { .study(sw); } }\n\n</style>"]}, media: undefined });

  };
  /* scoped */
  const __vue_scope_id__$1 = undefined;
  /* module identifier */
  const __vue_module_identifier__$1 = undefined;
  /* functional template */
  const __vue_is_functional_template__$1 = false;
  /* style inject SSR */
  

  
  var Dims$1 = normalizeComponent_1(
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


let Icon = {

  props: { icon:String, name:String, summ:String, size:Number, fnClick:Function },
  
  methods: {
    
    hasSumm: function() {
      return this.isDef(this.summ); },
    
    icClass:function() {
      return this.hasSumm() ? 'icon-summ' : 'icon-name'; },
    
    doClick: function() {
      if( this.isDef(this.fnClick) ) {
        this.fnClick(this.name); } },
    
    style: function() {
      return { fontSize:this.size+'rem' }; }

  }
  
};

/* script */
const __vue_script__$2 = Icon;

/* template */
var __vue_render__$2 = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c("div", { staticClass: "icon-pane" }, [
    _c(
      "div",
      {
        class: _vm.icClass(),
        style: _vm.style(),
        on: {
          click: function($event) {
            return _vm.doClick()
          }
        }
      },
      [
        _c("i", { staticClass: "icon-icon" }),
        _vm._v(" "),
        _c("span", { staticClass: "icon-name" }, [_vm._v(_vm._s(_vm.name))]),
        _vm._v(" "),
        _vm.hasSumm()
          ? _c("span", { staticClass: "icon-summ" }, [_vm._v(_vm._s(_vm.summ))])
          : _vm._e()
      ]
    )
  ])
};
var __vue_staticRenderFns__$2 = [];
__vue_render__$2._withStripped = true;

  /* style */
  const __vue_inject_styles__$2 = function (inject) {
    if (!inject) return
    inject("data-v-13136434_0", { source: ".theme-desc {\n  font-size: 1rem;\n  background-color: #333;\n  border-radius: 0.7em;\n  width: 90%;\n  height: 90%;\n}\n.icon-name {\n  display: grid;\n  grid-template-columns: 30fr 10fr 30fr 30fr;\n  grid-template-areas: \"nleft nicon nname nright\";\n  align-self: center;\n  justify-self: center;\n  height: 100%;\n}\n.icon-name i {\n  grid-area: nicon;\n  display: grid;\n  justify-items: center;\n  align-items: center;\n  text-align: center;\n}\n.icon-name .name {\n  grid-area: nname;\n  display: grid;\n  justify-items: center;\n  align-items: center;\n  text-align: center;\n}\n.icon-summ {\n  display: grid;\n  grid-template-columns: 5fr 10fr 20fr 65fr;\n  grid-template-areas: \"sleft sicon sname ssumm\";\n  align-self: start;\n  justify-self: center;\n}\n.icon-summ i {\n  grid-area: sicon;\n  display: grid;\n  justify-self: start;\n  align-self: center;\n  text-align: left;\n}\n.icon-summ .name {\n  grid-area: sname;\n  display: grid;\n  justify-self: start;\n  align-self: center;\n  text-align: left;\n  font-weight: 900;\n}\n.icon-summ .summ {\n  grid-area: ssumm;\n  display: grid;\n  justify-self: start;\n  align-self: center;\n  text-align: left;\n}\n", map: {"version":3,"sources":["Icon.vue","/Users/ax/Documents/prj/aug/vue/elem/Icon.vue"],"names":[],"mappings":"AAAA;EACE,eAAe;EACf,sBAAsB;EACtB,oBAAoB;EACpB,UAAU;EACV,WAAW;AACb;AACA;EACE,aAAa;EACb,0CAA0C;EAC1C,+CAA+C;EAC/C,kBAAkB;EAClB,oBAAoB;EACpB,YAAY;AACd;AACA;EACE,gBAAgB;EAChB,aAAa;EACb,qBAAqB;EACrB,mBAAmB;EACnB,kBAAkB;AACpB;AACA;EACE,gBAAgB;EAChB,aAAa;EACb,qBAAqB;EACrB,mBAAmB;EACnB,kBAAkB;AACpB;AACA;EACE,aAAa;EACb,yCAAyC;EACzC,8CAA8C;EAC9C,iBAAiB;EACjB,oBAAoB;AACtB;AACA;EACE,gBAAgB;EAChB,aAAa;EACb,mBAAmB;EACnB,kBAAkB;EAClB,gBAAgB;ACClB;ADCA;ECCA,gBAAA;EACA,aAAA;EDCE,mBAAmB;ECCrB,kBAAA;EDCE,gBAAgB;ECClB,gBAAA;ADCA;ACCA;EACA,gBAAA;EACA,aAAA;EDCE,mBAAmB;ECCrB,kBAAA;EDCE,gBAAgB;ACClB","file":"Icon.vue","sourcesContent":[".theme-desc {\n  font-size: 1rem;\n  background-color: #333;\n  border-radius: 0.7em;\n  width: 90%;\n  height: 90%;\n}\n.icon-name {\n  display: grid;\n  grid-template-columns: 30fr 10fr 30fr 30fr;\n  grid-template-areas: \"nleft nicon nname nright\";\n  align-self: center;\n  justify-self: center;\n  height: 100%;\n}\n.icon-name i {\n  grid-area: nicon;\n  display: grid;\n  justify-items: center;\n  align-items: center;\n  text-align: center;\n}\n.icon-name .name {\n  grid-area: nname;\n  display: grid;\n  justify-items: center;\n  align-items: center;\n  text-align: center;\n}\n.icon-summ {\n  display: grid;\n  grid-template-columns: 5fr 10fr 20fr 65fr;\n  grid-template-areas: \"sleft sicon sname ssumm\";\n  align-self: start;\n  justify-self: center;\n}\n.icon-summ i {\n  grid-area: sicon;\n  display: grid;\n  justify-self: start;\n  align-self: center;\n  text-align: left;\n}\n.icon-summ .name {\n  grid-area: sname;\n  display: grid;\n  justify-self: start;\n  align-self: center;\n  text-align: left;\n  font-weight: 900;\n}\n.icon-summ .summ {\n  grid-area: ssumm;\n  display: grid;\n  justify-self: start;\n  align-self: center;\n  text-align: left;\n}\n","\n<template>\n  <div      class=\"icon-pane\">\n    <div   :class=\"icClass()\" :style=\"style()\" @click=\"doClick()\">\n      <i    class=\"icon-icon\"></i>\n      <span class=\"icon-name\">{{name}}</span>\n      <span class=\"icon-summ\" v-if=\"hasSumm()\">{{summ}}</span>\n    </div>\n  </div>\n</template>\n\n<script type=\"module\">\n  \n  let Icon = {\n\n    props: { icon:String, name:String, summ:String, size:Number, fnClick:Function },\n    \n    methods: {\n      \n      hasSumm: function() {\n        return this.isDef(this.summ); },\n      \n      icClass:function() {\n        return this.hasSumm() ? 'icon-summ' : 'icon-name'; },\n      \n      doClick: function() {\n        if( this.isDef(this.fnClick) ) {\n          this.fnClick(this.name); } },\n      \n      style: function() {\n        return { fontSize:this.size+'rem' }; }\n\n    }\n    \n  }\n  \n  export default Icon;\n  \n</script>\n\n<style lang=\"less\">\n  \n  @import '../../pub/css/themes/theme.less';\n  \n  .icon-grid1x2() { display:grid; grid-template-columns:30fr 10fr 30fr 30fr;\n    grid-template-areas:\"nleft nicon nname nright\"; }\n\n  .icon-pane {}\n  \n  .icon-icon {}\n  \n  .icon-name { .icon-grid1x2(); align-self:center;  justify-self:center; height:100%;\n    i     { grid-area:nicon; .themeCenterItems(); }\n    .name { grid-area:nname; .themeCenterItems(); } }\n\n  .icon-grid1x4() { display:grid; grid-template-columns:5fr 10fr 20fr 65fr; grid-template-areas:\"sleft sicon sname ssumm\"; }\n\n  .icon-summ { .icon-grid1x4(); align-self:start;  justify-self:center;\n    i     { grid-area:sicon; .themeLeftSelf(); }\n    .name { grid-area:sname; .themeLeftSelf(); font-weight:900; }\n    .summ { grid-area:ssumm; .themeLeftSelf(); } }\n  \n</style>"]}, media: undefined });

  };
  /* scoped */
  const __vue_scope_id__$2 = undefined;
  /* module identifier */
  const __vue_module_identifier__$2 = undefined;
  /* functional template */
  const __vue_is_functional_template__$2 = false;
  /* style inject SSR */
  

  
  var Icon$1 = normalizeComponent_1(
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

let Desc = {
  
  components: { 'd-icon':Icon$1 },

  props: { dispObj:Object, from:String },

  data() { return { areaObj:null, iarea:1 } },

  methods: {
    style: function (ikwObj) {
      return this.styleObj(ikwObj); },
    clArea: function() {
      let  klass = 'ddesc-area'+this.iarea;
      this.iarea = this.iarea === 3 ? 1 : this.iarea+1;
      return klass; },
    tsSumm: function(summ) {
      return this.isStr(summ) ? summ : "This is a test description"; }
  }
  
  
};

/* script */
const __vue_script__$3 = Desc;

/* template */
var __vue_render__$3 = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c(
    "div",
    { staticClass: "ddesc-pane", style: _vm.style(_vm.dispObj) },
    [
      _c("d-icon", {
        staticClass: "ddesc-icon",
        attrs: { icon: _vm.dispObj.icon, name: _vm.dispObj.name, size: 5.0 }
      }),
      _vm._v(" "),
      _c("div", { staticClass: "ddesc-summ" }, [
        _vm._v(_vm._s(_vm.dispObj.desc))
      ]),
      _vm._v(" "),
      _vm._l(_vm.dispObj.areas, function(areaObj) {
        return [
          _c("d-icon", {
            class: _vm.clArea,
            attrs: {
              icon: areaObj.icon,
              name: areaObj.name,
              summ: _vm.tsSumm(areaObj.desc),
              size: 3.0
            }
          })
        ]
      })
    ],
    2
  )
};
var __vue_staticRenderFns__$3 = [];
__vue_render__$3._withStripped = true;

  /* style */
  const __vue_inject_styles__$3 = function (inject) {
    if (!inject) return
    inject("data-v-b4614bec_0", { source: ".theme-desc {\n  font-size: 1rem;\n  background-color: #333;\n  border-radius: 0.7em;\n  width: 90%;\n  height: 90%;\n}\n.ddesc-pane {\n  display: grid;\n  grid-template-columns: 1fr;\n  grid-template-rows: 20fr 20fr 20fr 20fr 20fr;\n  grid-template-areas: \"iconq\" \"summq\" \"area1\" \"area2\" \"area3\";\n  position: absolute;\n  left: 0;\n  top: 5%;\n  width: 100%;\n  height: 100%;\n  font-size: 2vmin;\n  color: black;\n  border-radius: 4vmin;\n}\n.ddesc-pane .ddesc-iconq {\n  grid-area: iconq;\n}\n.ddesc-pane .ddesc-summq {\n  grid-area: summq;\n  margin-left: 2.4vmin;\n}\n.ddesc-pane .ddesc-area1 {\n  grid-area: area1;\n}\n.ddesc-pane .ddesc-area2 {\n  grid-area: area2;\n}\n.ddesc-pane .ddesc-area3 {\n  grid-area: area3;\n}\n", map: {"version":3,"sources":["Desc.vue"],"names":[],"mappings":"AAAA;EACE,eAAe;EACf,sBAAsB;EACtB,oBAAoB;EACpB,UAAU;EACV,WAAW;AACb;AACA;EACE,aAAa;EACb,0BAA0B;EAC1B,4CAA4C;EAC5C,4DAA4D;EAC5D,kBAAkB;EAClB,OAAO;EACP,OAAO;EACP,WAAW;EACX,YAAY;EACZ,gBAAgB;EAChB,YAAY;EACZ,oBAAoB;AACtB;AACA;EACE,gBAAgB;AAClB;AACA;EACE,gBAAgB;EAChB,oBAAoB;AACtB;AACA;EACE,gBAAgB;AAClB;AACA;EACE,gBAAgB;AAClB;AACA;EACE,gBAAgB;AAClB","file":"Desc.vue","sourcesContent":[".theme-desc {\n  font-size: 1rem;\n  background-color: #333;\n  border-radius: 0.7em;\n  width: 90%;\n  height: 90%;\n}\n.ddesc-pane {\n  display: grid;\n  grid-template-columns: 1fr;\n  grid-template-rows: 20fr 20fr 20fr 20fr 20fr;\n  grid-template-areas: \"iconq\" \"summq\" \"area1\" \"area2\" \"area3\";\n  position: absolute;\n  left: 0;\n  top: 5%;\n  width: 100%;\n  height: 100%;\n  font-size: 2vmin;\n  color: black;\n  border-radius: 4vmin;\n}\n.ddesc-pane .ddesc-iconq {\n  grid-area: iconq;\n}\n.ddesc-pane .ddesc-summq {\n  grid-area: summq;\n  margin-left: 2.4vmin;\n}\n.ddesc-pane .ddesc-area1 {\n  grid-area: area1;\n}\n.ddesc-pane .ddesc-area2 {\n  grid-area: area2;\n}\n.ddesc-pane .ddesc-area3 {\n  grid-area: area3;\n}\n"]}, media: undefined });

  };
  /* scoped */
  const __vue_scope_id__$3 = undefined;
  /* module identifier */
  const __vue_module_identifier__$3 = undefined;
  /* functional template */
  const __vue_is_functional_template__$3 = false;
  /* style inject SSR */
  

  
  var Desc$1 = normalizeComponent_1(
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

let Disp = {

  components:{ 'd-tabs':Tabs, 'd-dims':Dims$1, 'd-desc':Desc$1 },
  
  data() { return { dispObj:null, // compKey:'Desc', 
    pages:{
      Dims: { title:'Disciplines',  key:'Dims', show:true  },
      Desc: { title:'Descriptions', key:'Desc', show:false } } } },
  
  methods: {
    
    onDisp: function(dispKey) {
      this.dispObj  = this.dispObject( this.nav().compKey, this.nav().pracKey, dispKey );
      if( !this.isDef(this.dispObj) ) {
        console.error('Disp.onDisp() disp null',{comp:this.nav().compKey,prac:this.nav().pracKey,disp:dispKey});}},
    doPage: function( pageKey ) {
      this.nav().setPageKey( 'Disp', pageKey ); },
    onNav:  function (obj) {
      if( this.nav().isMyNav( obj, 'Disp' ) ) {
          this.onDisp( obj.dispKey ); } } },

  beforeMount: function() {
    this.onDisp( this.nav().dispKey ); },

  mounted: function () {
    this.doPage( this.nav().getPageKey('Disp') );
    this.subscribe(  "Nav", 'Disp.vue', (obj) => {
      this.onNav(obj); } ); }
};

/* script */
const __vue_script__$4 = Disp;

/* template */
var __vue_render__$4 = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c(
    "div",
    { staticClass: "disp-pane" },
    [
      _c("d-tabs", { attrs: { route: "Disp", pages: _vm.pages } }),
      _vm._v(" "),
      _vm.pages["Dims"].show
        ? _c("d-dims", { attrs: { dispObj: _vm.dispObj, from: "Disp" } })
        : _vm._e(),
      _vm._v(" "),
      _vm.pages["Desc"].show
        ? _c("d-desc", { attrs: { dispObj: _vm.dispObj, from: "Disp" } })
        : _vm._e()
    ],
    1
  )
};
var __vue_staticRenderFns__$4 = [];
__vue_render__$4._withStripped = true;

  /* style */
  const __vue_inject_styles__$4 = function (inject) {
    if (!inject) return
    inject("data-v-9a649ce4_0", { source: ".theme-desc {\n  font-size: 1rem;\n  background-color: #333;\n  border-radius: 0.7em;\n  width: 90%;\n  height: 90%;\n}\n.disp-pane {\n  position: absolute;\n  left: 0;\n  top: 0;\n  width: 100%;\n  height: 100%;\n  background-color: #333;\n}\n", map: {"version":3,"sources":["Disp.vue"],"names":[],"mappings":"AAAA;EACE,eAAe;EACf,sBAAsB;EACtB,oBAAoB;EACpB,UAAU;EACV,WAAW;AACb;AACA;EACE,kBAAkB;EAClB,OAAO;EACP,MAAM;EACN,WAAW;EACX,YAAY;EACZ,sBAAsB;AACxB","file":"Disp.vue","sourcesContent":[".theme-desc {\n  font-size: 1rem;\n  background-color: #333;\n  border-radius: 0.7em;\n  width: 90%;\n  height: 90%;\n}\n.disp-pane {\n  position: absolute;\n  left: 0;\n  top: 0;\n  width: 100%;\n  height: 100%;\n  background-color: #333;\n}\n"]}, media: undefined });

  };
  /* scoped */
  const __vue_scope_id__$4 = undefined;
  /* module identifier */
  const __vue_module_identifier__$4 = undefined;
  /* functional template */
  const __vue_is_functional_template__$4 = false;
  /* style inject SSR */
  

  
  var Disp$1 = normalizeComponent_1(
    { render: __vue_render__$4, staticRenderFns: __vue_staticRenderFns__$4 },
    __vue_inject_styles__$4,
    __vue_script__$4,
    __vue_scope_id__$4,
    __vue_is_functional_template__$4,
    __vue_module_identifier__$4,
    browser,
    undefined
  );

export default Disp$1;
