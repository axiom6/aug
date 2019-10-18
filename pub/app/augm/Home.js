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


// import Data from '../../pub/base/util/Data.js'

var script = {

  props: { name:String, btns:Object },

  methods: {
    pubBtn: function (btn) {
      this.choose(  this.name, btn.name );
      btn.checked = this.choosen( this.name, btn.name );
      // console.log( 'Btns.pubBtn()', this.name, btn.name,  btn.checked );
      this.publish( this.name, btn.name ); },
  //onWatch: function() {
  //    console.log( 'Btns.onWatch()' ); },
    aspect: function() {  // Only call in mounted
      let w = this.$refs['Btns']['clientWidth' ];
      let h = this.$refs['Btns']['clientHeight'];
      return h/w; },
    styleBlock: function(p) {
      let sy = 1.0;
      let p2 = p[2]===0 ? p[3] : p[2];
      return { position:'absolute', left:sy*p[0]+'%', top:sy*p[1]+'%', width:sy*p2+'%', height:sy*p[3]+'%',
      fontSize:(p[3]*0.08)+'em' } },
    styleBtn: function (btn) {
      let back = this.toRgbaHsv( btn.hsv );
      return { color:'black', backgroundColor:back }; },
    classCheck: function (btn) {
      btn.checked = this.choosen( this.name, btn.name );
      // console.log( 'Btns.classCheck()', { checked:btn.checked, name:this.name, choice:btn.name } );
      return btn.checked ? 'check far fa-check-square' : 'check far fa-square'; },
    classIcons: function (btn) {
      return 'icons ' + btn.icon },
    titleRef: function (btn) {
      return 'Title' + btn.name },
    img: function (btn) {
      return '../../css/' + btn.img },
    adjustWidths: function() {
       let names = Object.keys(this.btns);
       for( let name of names ) {
         let btn = this.btns[name];
         if( btn.pos[2]===0 ) {
           let wt     = this.$refs[this.titleRef(btn)][0]['clientWidth'];
           btn.elem   = this.$refs[btn.name][0];
           let wb     = btn.elem['clientWidth'];
           btn.pos[2] = btn.pos[3]*2.4*wt/wb;
           // console.log( 'Adj', { wt:wt, wb:wb, w:btn.pos[2], h:btn.pos[3] } ) }
           btn.elem.style.width = btn.pos[2]+'%'; } }
    } },

  mounted: function () {
    this.asp = this.aspect();
    this.adjustWidths(); }

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
    { ref: "Btns", staticClass: "btns-pane" },
    [
      _vm._l(_vm.btns, function(btn) {
        return [
          _c(
            "div",
            { ref: btn.name, refInFor: true, style: _vm.styleBlock(btn.pos) },
            [
              _c("div", { staticClass: "btns-center" }, [
                _c(
                  "div",
                  {
                    staticClass: "btns-btn",
                    style: _vm.styleBtn(btn),
                    on: {
                      click: function($event) {
                        return _vm.pubBtn(btn)
                      }
                    }
                  },
                  [
                    btn.check
                      ? _c("span", { class: _vm.classCheck(btn) })
                      : _vm._e(),
                    _vm._v(" "),
                    btn.icon
                      ? _c("i", { class: _vm.classIcons(btn) })
                      : _vm._e(),
                    _vm._v(" "),
                    btn.img
                      ? _c("img", {
                          staticClass: "image",
                          attrs: { src: _vm.img(btn), alt: "" }
                        })
                      : _vm._e(),
                    _vm._v(" "),
                    btn.title
                      ? _c(
                          "span",
                          {
                            ref: _vm.titleRef(btn),
                            refInFor: true,
                            staticClass: "title"
                          },
                          [_vm._v(_vm._s(btn.title))]
                        )
                      : _vm._e()
                  ]
                )
              ])
            ]
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
    inject("data-v-4ca947e2_0", { source: ".theme-desc {\n  font-size: 1rem;\n  background-color: #333;\n  border-radius: 0.7em;\n  width: 90%;\n  height: 90%;\n}\n.btns-pane {\n  font-size: 2.8vmin;\n  font-weight: bold;\n  position: absolute;\n  left: 0;\n  top: 0;\n  right: 0;\n  bottom: 0;\n}\n.btns-center {\n  display: grid;\n  width: 100%;\n  height: 100%;\n}\n.btns-btn {\n  display: grid;\n  grid-template-columns: 20fr 24fr 56fr;\n  grid-template-areas: \"check icons label\";\n  justify-self: center;\n  align-self: center;\n  width: 80%;\n  height: 80%;\n  font-size: inherit;\n  font-family: Roboto, sans-serif;\n  cursor: pointer;\n  border-radius: 16px;\n  border: solid black 1px;\n}\n.btn .check {\n  grid-area: check;\n  justify-self: center;\n  align-self: center;\n}\n.btn .icons {\n  grid-area: icons;\n  justify-self: center;\n  align-self: center;\n}\n.btn .image {\n  grid-area: icons;\n  justify-self: left;\n  align-self: center;\n  border-radius: 8px;\n  border: solid black 1px;\n  max-height: 1.5em;\n}\n.btn .title {\n  grid-area: label;\n  justify-self: left;\n  align-self: center;\n  text-align: left;\n}\n.image-radius {\n  border-radius: 8px;\n  border: solid black 1px;\n}\n", map: {"version":3,"sources":["Btns.vue"],"names":[],"mappings":"AAAA;EACE,eAAe;EACf,sBAAsB;EACtB,oBAAoB;EACpB,UAAU;EACV,WAAW;AACb;AACA;EACE,kBAAkB;EAClB,iBAAiB;EACjB,kBAAkB;EAClB,OAAO;EACP,MAAM;EACN,QAAQ;EACR,SAAS;AACX;AACA;EACE,aAAa;EACb,WAAW;EACX,YAAY;AACd;AACA;EACE,aAAa;EACb,qCAAqC;EACrC,wCAAwC;EACxC,oBAAoB;EACpB,kBAAkB;EAClB,UAAU;EACV,WAAW;EACX,kBAAkB;EAClB,+BAA+B;EAC/B,eAAe;EACf,mBAAmB;EACnB,uBAAuB;AACzB;AACA;EACE,gBAAgB;EAChB,oBAAoB;EACpB,kBAAkB;AACpB;AACA;EACE,gBAAgB;EAChB,oBAAoB;EACpB,kBAAkB;AACpB;AACA;EACE,gBAAgB;EAChB,kBAAkB;EAClB,kBAAkB;EAClB,kBAAkB;EAClB,uBAAuB;EACvB,iBAAiB;AACnB;AACA;EACE,gBAAgB;EAChB,kBAAkB;EAClB,kBAAkB;EAClB,gBAAgB;AAClB;AACA;EACE,kBAAkB;EAClB,uBAAuB;AACzB","file":"Btns.vue","sourcesContent":[".theme-desc {\n  font-size: 1rem;\n  background-color: #333;\n  border-radius: 0.7em;\n  width: 90%;\n  height: 90%;\n}\n.btns-pane {\n  font-size: 2.8vmin;\n  font-weight: bold;\n  position: absolute;\n  left: 0;\n  top: 0;\n  right: 0;\n  bottom: 0;\n}\n.btns-center {\n  display: grid;\n  width: 100%;\n  height: 100%;\n}\n.btns-btn {\n  display: grid;\n  grid-template-columns: 20fr 24fr 56fr;\n  grid-template-areas: \"check icons label\";\n  justify-self: center;\n  align-self: center;\n  width: 80%;\n  height: 80%;\n  font-size: inherit;\n  font-family: Roboto, sans-serif;\n  cursor: pointer;\n  border-radius: 16px;\n  border: solid black 1px;\n}\n.btn .check {\n  grid-area: check;\n  justify-self: center;\n  align-self: center;\n}\n.btn .icons {\n  grid-area: icons;\n  justify-self: center;\n  align-self: center;\n}\n.btn .image {\n  grid-area: icons;\n  justify-self: left;\n  align-self: center;\n  border-radius: 8px;\n  border: solid black 1px;\n  max-height: 1.5em;\n}\n.btn .title {\n  grid-area: label;\n  justify-self: left;\n  align-self: center;\n  text-align: left;\n}\n.image-radius {\n  border-radius: 8px;\n  border: solid black 1px;\n}\n"]}, media: undefined });

  };
  /* scoped */
  const __vue_scope_id__ = undefined;
  /* module identifier */
  const __vue_module_identifier__ = undefined;
  /* functional template */
  const __vue_is_functional_template__ = false;
  /* style inject SSR */
  

  
  var Btns = normalizeComponent_1(
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


let Navd = {
  
  name: 'navd',
  
  methods: {
    doDir: function( dir ) {
      if( this.isDir() ) {
          this.dir().touch( dir ); }
      else if( this.isNav() ) {
          this.nav().dir( dir ); }
      else {
        console.error( 'NavddoDir() no direction navigator' ); } } },
  
  mounted: function () {}
};

/* script */
const __vue_script__$1 = Navd;

/* template */
var __vue_render__$1 = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c("div", { staticClass: "navd-pane" }, [
    _c("div", { ref: "navd", staticClass: "navd-navd" }, [
      _c(
        "div",
        {
          ref: "west",
          staticClass: "navd-west",
          on: {
            click: function($event) {
              return _vm.doDir("west")
            }
          }
        },
        [_c("i", { staticClass: "fas fa-angle-left" })]
      ),
      _vm._v(" "),
      _c(
        "div",
        {
          ref: "north",
          staticClass: "navd-north",
          on: {
            click: function($event) {
              return _vm.doDir("north")
            }
          }
        },
        [_c("i", { staticClass: "fas fa-angle-up" })]
      ),
      _vm._v(" "),
      _c(
        "div",
        {
          ref: "next",
          staticClass: "navd-next",
          on: {
            click: function($event) {
              return _vm.doDir("next")
            }
          }
        },
        [_c("i", { staticClass: "fas fa-plus-circle" })]
      ),
      _vm._v(" "),
      _c(
        "div",
        {
          ref: "prev",
          staticClass: "navd-prev",
          on: {
            click: function($event) {
              return _vm.doDir("prev")
            }
          }
        },
        [_c("i", { staticClass: "fas fa-minus-circle" })]
      ),
      _vm._v(" "),
      _c(
        "div",
        {
          ref: "east",
          staticClass: "navd-east",
          on: {
            click: function($event) {
              return _vm.doDir("east")
            }
          }
        },
        [_c("i", { staticClass: "fas fa-angle-right" })]
      ),
      _vm._v(" "),
      _c(
        "div",
        {
          ref: "south",
          staticClass: "navd-south",
          on: {
            click: function($event) {
              return _vm.doDir("south")
            }
          }
        },
        [_c("i", { staticClass: "fas fa-angle-down" })]
      )
    ])
  ])
};
var __vue_staticRenderFns__$1 = [];
__vue_render__$1._withStripped = true;

  /* style */
  const __vue_inject_styles__$1 = function (inject) {
    if (!inject) return
    inject("data-v-146f0664_0", { source: ".theme-desc {\n  font-size: 1rem;\n  background-color: #333;\n  border-radius: 0.7em;\n  width: 90%;\n  height: 90%;\n}\n.navd-pane {\n  background-color: black;\n}\n.navd-navd {\n  background-color: black;\n  color: wheat;\n  position: relative;\n  left: 15%;\n  top: 0;\n  width: 70%;\n  height: 100%;\n}\n.navd-navd .navd-west {\n  position: absolute;\n  left: 0;\n  top: 33%;\n  width: 25%;\n  height: 33%;\n  font-size: 5.2vmin;\n}\n.navd-navd .navd-north {\n  position: absolute;\n  left: 37.5%;\n  top: 0;\n  width: 25%;\n  height: 33%;\n  font-size: 5.2vmin;\n}\n.navd-navd .navd-next {\n  position: absolute;\n  left: 25%;\n  top: 42%;\n  width: 25%;\n  height: 33%;\n  font-size: 3.2vmin;\n}\n.navd-navd .navd-prev {\n  position: absolute;\n  left: 50%;\n  top: 42%;\n  width: 25%;\n  height: 33%;\n  font-size: 3.2vmin;\n}\n.navd-navd .navd-east {\n  position: absolute;\n  left: 75%;\n  top: 33%;\n  width: 25%;\n  height: 33%;\n  font-size: 5.2vmin;\n}\n.navd-navd .navd-south {\n  position: absolute;\n  left: 37.5%;\n  top: 66%;\n  width: 25%;\n  height: 33%;\n  font-size: 5.2vmin;\n}\n.navd-navd div {\n  display: grid;\n}\n.navd-navd div i {\n  justify-self: center;\n  align-self: center;\n}\n", map: {"version":3,"sources":["Navd.vue","/Users/ax/Documents/prj/aug/vue/dash/Navd.vue"],"names":[],"mappings":"AAAA;EACE,eAAe;EACf,sBAAsB;EACtB,oBAAoB;EACpB,UAAU;EACV,WAAW;AACb;AACA;EACE,uBAAuB;AACzB;AACA;EACE,uBAAuB;EACvB,YAAY;EACZ,kBAAkB;EAClB,SAAS;EACT,MAAM;EACN,UAAU;EACV,YAAY;AACd;AACA;EACE,kBAAkB;EAClB,OAAO;EACP,QAAQ;EACR,UAAU;EACV,WAAW;EACX,kBAAkB;AACpB;AACA;EACE,kBAAkB;EAClB,WAAW;EACX,MAAM;EACN,UAAU;EACV,WAAW;EACX,kBAAkB;AACpB;AACA;EACE,kBAAkB;EAClB,SAAS;ECCX,QAAA;EDCE,UAAU;ECCZ,WAAA;EDCE,kBAAkB;ACCpB;ADCA;ECCA,kBAAA;EACA,SAAA;EACA,QAAA;EACA,UAAA;EACA,WAAA;EACA,kBAAA;AACA;AACA;EACA,kBAAA;EACA,SAAA;EDCE,QAAQ;EACR,UAAU;EACV,WAAW;EACX,kBAAkB;AACpB;AACA;EACE,kBAAkB;EAClB,WAAW;EACX,QAAQ;EACR,UAAU;EACV,WAAW;EACX,kBAAkB;AACpB;AACA;EACE,aAAa;AACf;AACA;EACE,oBAAoB;EACpB,kBAAkB;AACpB","file":"Navd.vue","sourcesContent":[".theme-desc {\n  font-size: 1rem;\n  background-color: #333;\n  border-radius: 0.7em;\n  width: 90%;\n  height: 90%;\n}\n.navd-pane {\n  background-color: black;\n}\n.navd-navd {\n  background-color: black;\n  color: wheat;\n  position: relative;\n  left: 15%;\n  top: 0;\n  width: 70%;\n  height: 100%;\n}\n.navd-navd .navd-west {\n  position: absolute;\n  left: 0;\n  top: 33%;\n  width: 25%;\n  height: 33%;\n  font-size: 5.2vmin;\n}\n.navd-navd .navd-north {\n  position: absolute;\n  left: 37.5%;\n  top: 0;\n  width: 25%;\n  height: 33%;\n  font-size: 5.2vmin;\n}\n.navd-navd .navd-next {\n  position: absolute;\n  left: 25%;\n  top: 42%;\n  width: 25%;\n  height: 33%;\n  font-size: 3.2vmin;\n}\n.navd-navd .navd-prev {\n  position: absolute;\n  left: 50%;\n  top: 42%;\n  width: 25%;\n  height: 33%;\n  font-size: 3.2vmin;\n}\n.navd-navd .navd-east {\n  position: absolute;\n  left: 75%;\n  top: 33%;\n  width: 25%;\n  height: 33%;\n  font-size: 5.2vmin;\n}\n.navd-navd .navd-south {\n  position: absolute;\n  left: 37.5%;\n  top: 66%;\n  width: 25%;\n  height: 33%;\n  font-size: 5.2vmin;\n}\n.navd-navd div {\n  display: grid;\n}\n.navd-navd div i {\n  justify-self: center;\n  align-self: center;\n}\n","\n<template>\n  <div     class=\"navd-pane\">\n    <div   class=\"navd-navd\"  ref=\"navd\">\n      <div class=\"navd-west\"  ref=\"west\"  @click=\"doDir('west' )\"><i class=\"fas fa-angle-left\"  ></i></div>\n      <div class=\"navd-north\" ref=\"north\" @click=\"doDir('north')\"><i class=\"fas fa-angle-up\"    ></i></div>\n      <div class=\"navd-next\"  ref=\"next\"  @click=\"doDir('next')\" ><i class=\"fas fa-plus-circle\" ></i></div>\n      <div class=\"navd-prev\"  ref=\"prev\"  @click=\"doDir('prev')\" ><i class=\"fas fa-minus-circle\"></i></div>\n      <div class=\"navd-east\"  ref=\"east\"  @click=\"doDir('east' )\"><i class=\"fas fa-angle-right\" ></i></div>\n      <div class=\"navd-south\" ref=\"south\" @click=\"doDir('south')\"><i class=\"fas fa-angle-down\"  ></i></div>\n    </div>\n  </div>\n</template>\n\n<script type=\"module\">\n  \n  let Navd = {\n    \n    name: 'navd',\n    \n    methods: {\n      doDir: function( dir ) {\n        if( this.isDir() ) {\n            this.dir().touch( dir ); }\n        else if( this.isNav() ) {\n            this.nav().dir( dir ); }\n        else {\n          console.error( 'NavddoDir() no direction navigator' ); } } },\n    \n    mounted: function () {}\n  };\n\n  export default Navd;\n  \n</script>\n\n<style lang=\"less\">\n  \n  @import '../../pub/css/themes/theme.less';\n  \n  @navdFS:2*@themeFS;\n  \n  .navd-pane { background-color:@theme-back; }\n  \n  .navd-navd { background-color:@theme-back; color:@theme-fore;\n                  position:relative; left:15.0%; top:0;   width:70%; height:100%;\n    .navd-west  { position:absolute; left:0;     top:33%; width:25%; height: 33%; font-size:1.3*@navdFS; }\n    .navd-north { position:absolute; left:37.5%; top:0;   width:25%; height: 33%; font-size:1.3*@navdFS; }\n    .navd-next  { position:absolute; left:25.0%; top:42%; width:25%; height: 33%; font-size:0.8*@navdFS; }\n    .navd-prev  { position:absolute; left:50.0%; top:42%; width:25%; height: 33%; font-size:0.8*@navdFS; }\n    .navd-east  { position:absolute; left:75.0%; top:33%; width:25%; height: 33%; font-size:1.3*@navdFS; }\n    .navd-south { position:absolute; left:37.5%; top:66%; width:25%; height: 33%; font-size:1.3*@navdFS; }\n    div    { display:grid;\n      i    { justify-self:center; align-self:center; } } }\n  \n</style>\n"]}, media: undefined });

  };
  /* scoped */
  const __vue_scope_id__$1 = undefined;
  /* module identifier */
  const __vue_module_identifier__$1 = undefined;
  /* functional template */
  const __vue_is_functional_template__$1 = false;
  /* style inject SSR */
  

  
  var Navd$1 = normalizeComponent_1(
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


let Tocs = {
  
  data: function() {
    return { komps:{}, compPracs:{}, compKey:'Home', pracKey:'None', dispKey:'None' } },
  
  methods: {
    myPracs: function(compKey) {
      let pracs = {};
      if(      this.isDef(this.compPracs[compKey]) ) { pracs = this.compPracs[compKey];   }
      else if( this.isDef(this.komps[compKey])     ) { pracs = this.komps[compKey].pracs; }
      // console.log( 'Tocs.myPrac()', compKey, pracs );
      return pracs; },
    myKomp: function(kompKey) {
      return kompKey===this.compKey || ( kompKey==='Info' && this.compKey==='Data' ) },
    doComp: function(compKey) {
      this.compKey = compKey;
      let  kompKey = this.isMuse() && compKey==='Data'  ? 'Info' : compKey;
      let  route   = this.komps[kompKey].route;
      this.pub( { route:route, compKey:compKey, source:'Toc' } ); },
    doPrac: function(pracKey) {
      this.pracKey = pracKey;
      let route    = this.isMuse() ? 'Prac' : pracKey;
      this.pub( { route:route, pracKey:pracKey, source:'Toc' } ); },
    doDisp: function(dispKey) {
      this.dispKey = dispKey;
      this.pub( { route:'Disp', dispKey:dispKey, source:'Toc' } ); },
    pub: function(obj) {
      this.nav().dirTabs = false;
      this.nav().pub(obj); },
    onNav:  function (obj) {
      if( obj.source !== 'Toc' ) {
        if( this.compKey !== obj.compKey ) { this.compKey = obj.compKey; }
        if( this.pracKey !== obj.pracKey ) { this.pracKey = obj.pracKey; }
        if( this.dispKey !== obj.dispKey ) { this.dispKey = obj.dispKey; } } },
    styleComp: function( kompKey ) {
      return this.myKomp(kompKey) ? { backgroundColor:'wheat', color:'black', borderRadius:'0 24px 24px 0' }
                                  : { backgroundColor:'#333',  color:'wheat', borderRadius:'0 24px 24px 0' }; },
    style: function( ikwObj ) {
      return this.styleObj(ikwObj); },
    filterPracs: function(pracs,compKey) {
      let filt = {};
      for( let key in pracs ) {
        let prac = pracs[key];
        if( prac.row !== 'Dim' || compKey === 'Prin' ) {
          filt[key] = prac; } }
      return filt; },
    },

  beforeMount: function () {
    this.komps = this.kompsTocs();
    for( let key in this.komps ) {
      let komp = this.komps[key];
      if( komp.ikw ) {
          komp.pracs = this.filterPracs( this.pracs(key), key ); } }
    if( this.isPageKeyComp('Data') ) {
      this.compPracs['Data'] = this.filterPracs( this.pracs('Data'),'Data'); } },
  
  mounted: function () {
    this.subscribe( 'Nav', 'Tocs.vue', (obj) => {
      this.onNav(obj); } ); }
};

/* script */
const __vue_script__$2 = Tocs;

/* template */
var __vue_render__$2 = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c("div", { staticClass: "tocs-pane" }, [
    _c(
      "ul",
      [
        _vm._l(_vm.komps, function(komp) {
          return [
            _c("li", { key: komp.key }, [
              _c(
                "div",
                {
                  on: {
                    click: function($event) {
                      return _vm.doComp(komp.key)
                    }
                  }
                },
                [
                  _c("div", { style: _vm.styleComp(komp.key) }, [
                    _c("i", { class: komp.icon }),
                    _vm._v(_vm._s(komp.title))
                  ])
                ]
              ),
              _vm._v(" "),
              _vm.myKomp(komp.key)
                ? _c(
                    "ul",
                    [
                      _vm._l(_vm.myPracs(_vm.compKey), function(prac) {
                        return [
                          _c(
                            "li",
                            {
                              key: prac.name,
                              style: _vm.style(prac),
                              on: {
                                click: function($event) {
                                  return _vm.doPrac(prac.name)
                                }
                              }
                            },
                            [
                              _c("i", { class: prac.icon }),
                              _vm._v(" "),
                              _c("span", [_vm._v(_vm._s(prac.name))]),
                              _vm._v(" "),
                              _c(
                                "ul",
                                {
                                  directives: [
                                    {
                                      name: "show",
                                      rawName: "v-show",
                                      value: _vm.pracKey === prac.name,
                                      expression: "pracKey===prac.name"
                                    }
                                  ]
                                },
                                [
                                  _vm._l(prac.disps, function(disp) {
                                    return [
                                      _c(
                                        "li",
                                        {
                                          key: disp.name,
                                          style: _vm.style(disp),
                                          on: {
                                            click: function($event) {
                                              $event.stopPropagation();
                                              return _vm.doDisp(disp.name)
                                            }
                                          }
                                        },
                                        [
                                          _c("i", { class: disp.icon }),
                                          _vm._v(_vm._s(disp.name))
                                        ]
                                      )
                                    ]
                                  })
                                ],
                                2
                              )
                            ]
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
var __vue_staticRenderFns__$2 = [];
__vue_render__$2._withStripped = true;

  /* style */
  const __vue_inject_styles__$2 = function (inject) {
    if (!inject) return
    inject("data-v-561ef40b_0", { source: ".theme-desc {\n  font-size: 1rem;\n  background-color: #333;\n  border-radius: 0.7em;\n  width: 90%;\n  height: 90%;\n}\n.tocs-pane {\n  font-family: Roboto, sans-serif;\n}\n.tocs-pane ul {\n  font-size: 4vmin;\n  padding: 0;\n  margin: 0;\n  list-style: none;\n  align-self: start;\n  display: grid;\n}\n.tocs-pane ul li {\n  background-color: #333;\n  padding-left: 0.25rem;\n  align-self: start;\n  border-radius: 0 24px 24px 0;\n  margin: 0.2rem 0.2rem 0.2rem 0.2rem;\n}\n.tocs-pane ul li i {\n  margin-right: 0.4rem;\n}\n.tocs-pane ul li div {\n  color: wheat;\n  text-decoration: none;\n}\n.tocs-pane ul li ul {\n  font-size: 2.4vmin;\n  font-weight: bold;\n  padding: 0;\n  margin: 0;\n}\n.tocs-pane ul li ul li {\n  border-radius: 0 12px 12px 0;\n  color: black;\n  margin: 0.2rem 0.2rem 0.2rem 0.2rem;\n}\n.tocs-pane ul li ul li i {\n  margin-right: 0.3rem;\n}\n.tocs-pane ul li ul li a {\n  color: black;\n}\n.tocs-pane ul li ul li ul {\n  font-size: 2vmin;\n  padding: 0;\n  margin: 0 0 0 0.2rem;\n}\n.tocs-pane ul li ul li ul li {\n  border-radius: 0 12px 12px 0;\n  color: black;\n  margin: 0.2rem 0.2rem 0.2rem 0.2rem;\n}\n.tocs-pane ul li ul li ul li i {\n  margin-right: 0.25rem;\n}\n.tocs-pane ul li ul li ul li:hover {\n  background-color: black !important;\n  color: white !important;\n}\n", map: {"version":3,"sources":["Tocs.vue"],"names":[],"mappings":"AAAA;EACE,eAAe;EACf,sBAAsB;EACtB,oBAAoB;EACpB,UAAU;EACV,WAAW;AACb;AACA;EACE,+BAA+B;AACjC;AACA;EACE,gBAAgB;EAChB,UAAU;EACV,SAAS;EACT,gBAAgB;EAChB,iBAAiB;EACjB,aAAa;AACf;AACA;EACE,sBAAsB;EACtB,qBAAqB;EACrB,iBAAiB;EACjB,4BAA4B;EAC5B,mCAAmC;AACrC;AACA;EACE,oBAAoB;AACtB;AACA;EACE,YAAY;EACZ,qBAAqB;AACvB;AACA;EACE,kBAAkB;EAClB,iBAAiB;EACjB,UAAU;EACV,SAAS;AACX;AACA;EACE,4BAA4B;EAC5B,YAAY;EACZ,mCAAmC;AACrC;AACA;EACE,oBAAoB;AACtB;AACA;EACE,YAAY;AACd;AACA;EACE,gBAAgB;EAChB,UAAU;EACV,oBAAoB;AACtB;AACA;EACE,4BAA4B;EAC5B,YAAY;EACZ,mCAAmC;AACrC;AACA;EACE,qBAAqB;AACvB;AACA;EACE,kCAAkC;EAClC,uBAAuB;AACzB","file":"Tocs.vue","sourcesContent":[".theme-desc {\n  font-size: 1rem;\n  background-color: #333;\n  border-radius: 0.7em;\n  width: 90%;\n  height: 90%;\n}\n.tocs-pane {\n  font-family: Roboto, sans-serif;\n}\n.tocs-pane ul {\n  font-size: 4vmin;\n  padding: 0;\n  margin: 0;\n  list-style: none;\n  align-self: start;\n  display: grid;\n}\n.tocs-pane ul li {\n  background-color: #333;\n  padding-left: 0.25rem;\n  align-self: start;\n  border-radius: 0 24px 24px 0;\n  margin: 0.2rem 0.2rem 0.2rem 0.2rem;\n}\n.tocs-pane ul li i {\n  margin-right: 0.4rem;\n}\n.tocs-pane ul li div {\n  color: wheat;\n  text-decoration: none;\n}\n.tocs-pane ul li ul {\n  font-size: 2.4vmin;\n  font-weight: bold;\n  padding: 0;\n  margin: 0;\n}\n.tocs-pane ul li ul li {\n  border-radius: 0 12px 12px 0;\n  color: black;\n  margin: 0.2rem 0.2rem 0.2rem 0.2rem;\n}\n.tocs-pane ul li ul li i {\n  margin-right: 0.3rem;\n}\n.tocs-pane ul li ul li a {\n  color: black;\n}\n.tocs-pane ul li ul li ul {\n  font-size: 2vmin;\n  padding: 0;\n  margin: 0 0 0 0.2rem;\n}\n.tocs-pane ul li ul li ul li {\n  border-radius: 0 12px 12px 0;\n  color: black;\n  margin: 0.2rem 0.2rem 0.2rem 0.2rem;\n}\n.tocs-pane ul li ul li ul li i {\n  margin-right: 0.25rem;\n}\n.tocs-pane ul li ul li ul li:hover {\n  background-color: black !important;\n  color: white !important;\n}\n"]}, media: undefined });

  };
  /* scoped */
  const __vue_scope_id__$2 = undefined;
  /* module identifier */
  const __vue_module_identifier__$2 = undefined;
  /* functional template */
  const __vue_is_functional_template__$2 = false;
  /* style inject SSR */
  

  
  var Tocs$1 = normalizeComponent_1(
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


// import Touch from '../../pub/base/nav/Touch.js'

var script$1 = {

  data() { return { touch:null, elem:null, rviews:this.views() }; },
  
  methods:{
    show:function() {
      return this.$route.name===null } },
  
  mounted: function () {
    this.$nextTick( function() {  // Enable touch events inside all views
      // this.touch = new Touch( this.stream(), this.dir() );
      // this.elem  = this.$refs['View'];
      // this.touch.onDir( this.elem );
    } ); }
    
  };

/* script */
const __vue_script__$3 = script$1;

/* template */
var __vue_render__$3 = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c(
    "div",
    { ref: "View", staticClass: "view-pane" },
    [
      _vm._l(_vm.rviews, function(view) {
        return [_c("router-view", { attrs: { name: view } })]
      })
    ],
    2
  )
};
var __vue_staticRenderFns__$3 = [];
__vue_render__$3._withStripped = true;

  /* style */
  const __vue_inject_styles__$3 = undefined;
  /* scoped */
  const __vue_scope_id__$3 = undefined;
  /* module identifier */
  const __vue_module_identifier__$3 = undefined;
  /* functional template */
  const __vue_is_functional_template__$3 = false;
  /* style inject */
  
  /* style inject SSR */
  

  
  var View = normalizeComponent_1(
    { render: __vue_render__$3, staticRenderFns: __vue_staticRenderFns__$3 },
    __vue_inject_styles__$3,
    __vue_script__$3,
    __vue_scope_id__$3,
    __vue_is_functional_template__$3,
    __vue_module_identifier__$3,
    undefined,
    undefined
  );

//

let Dash = {
    name: 'dash',
    components: { 'd-navd':Navd$1, 'd-tocs':Tocs$1, 'd-view':View } };

/* script */
const __vue_script__$4 = Dash;

/* template */
var __vue_render__$4 = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c(
    "div",
    { staticClass: "dash-pane" },
    [
      _c("d-navd", { attrs: { id: "navd" } }),
      _vm._v(" "),
      _c("d-tocs", { attrs: { id: "tocs" } }),
      _vm._v(" "),
      _c("d-view", { attrs: { id: "view" } })
    ],
    1
  )
};
var __vue_staticRenderFns__$4 = [];
__vue_render__$4._withStripped = true;

  /* style */
  const __vue_inject_styles__$4 = function (inject) {
    if (!inject) return
    inject("data-v-89c47114_0", { source: ".theme-desc {\n  font-size: 1rem;\n  background-color: #333;\n  border-radius: 0.7em;\n  width: 90%;\n  height: 90%;\n}\nhtml {\n  font-size: calc(1em + 1vmin);\n}\nbody {\n  background-color: black;\n  margin: 0;\n}\n.dash-pane {\n  font-family: Roboto, sans-serif;\n  position: absolute;\n  left: 0;\n  top: 0;\n  width: 100%;\n  height: 100%;\n  overflow: hidden;\n}\n.dash-pane #navd {\n  position: absolute;\n  left: 0;\n  top: 0;\n  width: 10%;\n  height: 10%;\n}\n.dash-pane #tocs {\n  position: absolute;\n  left: 0;\n  top: 10%;\n  width: 10%;\n  height: 90%;\n}\n.dash-pane #view {\n  position: absolute;\n  left: 10%;\n  top: 0;\n  width: 90%;\n  height: 100%;\n}\n", map: {"version":3,"sources":["Dash.vue","/Users/ax/Documents/prj/aug/vue/dash/Dash.vue"],"names":[],"mappings":"AAAA;EACE,eAAe;EACf,sBAAsB;EACtB,oBAAoB;EACpB,UAAU;EACV,WAAW;AACb;AACA;EACE,4BAA4B;AAC9B;AACA;EACE,uBAAuB;EACvB,SAAS;AACX;AACA;EACE,+BAA+B;EAC/B,kBAAkB;EAClB,OAAO;EACP,MAAM;EACN,WAAW;EACX,YAAY;EACZ,gBAAgB;AAClB;AACA;EACE,kBAAkB;ECCpB,OAAA;EDCE,MAAM;ECCR,UAAA;EACA,WAAA;ADCA;ACCA;EACA,kBAAA;EACA,OAAA;EACA,QAAA;EACA,UAAA;EDCE,WAAW;AACb;AACA;EACE,kBAAkB;EAClB,SAAS;EACT,MAAM;EACN,UAAU;EACV,YAAY;AACd","file":"Dash.vue","sourcesContent":[".theme-desc {\n  font-size: 1rem;\n  background-color: #333;\n  border-radius: 0.7em;\n  width: 90%;\n  height: 90%;\n}\nhtml {\n  font-size: calc(1em + 1vmin);\n}\nbody {\n  background-color: black;\n  margin: 0;\n}\n.dash-pane {\n  font-family: Roboto, sans-serif;\n  position: absolute;\n  left: 0;\n  top: 0;\n  width: 100%;\n  height: 100%;\n  overflow: hidden;\n}\n.dash-pane #navd {\n  position: absolute;\n  left: 0;\n  top: 0;\n  width: 10%;\n  height: 10%;\n}\n.dash-pane #tocs {\n  position: absolute;\n  left: 0;\n  top: 10%;\n  width: 10%;\n  height: 90%;\n}\n.dash-pane #view {\n  position: absolute;\n  left: 10%;\n  top: 0;\n  width: 90%;\n  height: 100%;\n}\n","\n<template>\n  <div class=\"dash-pane\">\n    <d-navd id=\"navd\"></d-navd>\n    <d-tocs id=\"tocs\"></d-tocs>\n    <d-view id=\"view\"></d-view>\n  </div>\n</template>\n\n<script type=\"module\">\n  \n  import Navd from '../dash/Navd.vue';\n  import Tocs from '../dash/Tocs.vue';\n  import View from '../dash/View.vue';\n  \n  let Dash = {\n      name: 'dash',\n      components: { 'd-navd':Navd, 'd-tocs':Tocs, 'd-view':View } };\n  \n  export default Dash;\n  \n</script>\n\n<style lang=\"less\">\n  \n  @import '../../pub/css/themes/theme.less';\n  \n  html { font-size:calc(1em + 1vmin); }\n  body { background-color:@theme-back; margin:0; }\n\n  .dash-pane { font-family:@theme-font-family;\n            position:absolute; left:0; top:0;                  width:100%;              height:100%; overflow:hidden;\n    #navd { position:absolute; left:0; top:0;                  width:@theme-navd-width; height:@theme-navd-height; }\n    #tocs { position:absolute; left:0; top:@theme-navd-height; width:@theme-navd-width; height:@theme-view-height; }\n    #view { position:absolute; left:@theme-navd-width; top:0;  width:@theme-view-width; height:100%; } }\n  \n</style>\n\n"]}, media: undefined });

  };
  /* scoped */
  const __vue_scope_id__$4 = undefined;
  /* module identifier */
  const __vue_module_identifier__$4 = undefined;
  /* functional template */
  const __vue_is_functional_template__$4 = false;
  /* style inject SSR */
  

  
  var Dash$1 = normalizeComponent_1(
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
//
//
//
//
//
//
//
//
//


let Math = {

  data() { return { route:'Math',
    maths:[
      { title:'MathML', key:'ML' },
      { title:'MathEQ', key:'EQ' } ] } },

  mounted: function () {} 

};

/* script */
const __vue_script__$5 = Math;

/* template */
var __vue_render__$5 = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c(
    "div",
    { ref: "Math", staticClass: "math-pane" },
    [
      _vm.route === "Math" ? _c("h1", [_vm._v("Mathematics")]) : _vm._e(),
      _vm._v(" "),
      _vm._l(_vm.maths, function(math) {
        return [_c("router-view", { attrs: { name: _vm.route + math.key } })]
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
    inject("data-v-cad46834_0", { source: ".theme-desc {\n  font-size: 1rem;\n  background-color: #333;\n  border-radius: 0.7em;\n  width: 90%;\n  height: 90%;\n}\n.math-pane {\n  position: absolute;\n  left: 0;\n  top: 0;\n  width: 100%;\n  height: 100%;\n  background-color: black;\n  display: grid;\n}\n.math-pane h1 {\n  justify-self: center;\n  align-self: center;\n  text-align: center;\n  color: wheat;\n  font-size: 2vmin;\n}\n", map: {"version":3,"sources":["Math.vue"],"names":[],"mappings":"AAAA;EACE,eAAe;EACf,sBAAsB;EACtB,oBAAoB;EACpB,UAAU;EACV,WAAW;AACb;AACA;EACE,kBAAkB;EAClB,OAAO;EACP,MAAM;EACN,WAAW;EACX,YAAY;EACZ,uBAAuB;EACvB,aAAa;AACf;AACA;EACE,oBAAoB;EACpB,kBAAkB;EAClB,kBAAkB;EAClB,YAAY;EACZ,gBAAgB;AAClB","file":"Math.vue","sourcesContent":[".theme-desc {\n  font-size: 1rem;\n  background-color: #333;\n  border-radius: 0.7em;\n  width: 90%;\n  height: 90%;\n}\n.math-pane {\n  position: absolute;\n  left: 0;\n  top: 0;\n  width: 100%;\n  height: 100%;\n  background-color: black;\n  display: grid;\n}\n.math-pane h1 {\n  justify-self: center;\n  align-self: center;\n  text-align: center;\n  color: wheat;\n  font-size: 2vmin;\n}\n"]}, media: undefined });

  };
  /* scoped */
  const __vue_scope_id__$5 = undefined;
  /* module identifier */
  const __vue_module_identifier__$5 = undefined;
  /* functional template */
  const __vue_is_functional_template__$5 = false;
  /* style inject SSR */
  

  
  var Math$1 = normalizeComponent_1(
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
//
//
//
//
//
//
//


let Geom = {

  data() { return { comp:'Geom',
    geoms:[
      { title:'Geom2D', key:'2D' },
      { title:'Geom3D', key:'3D' },
      { title:'Geom4D', key:'4D' } ] } },

  mounted: function () {}

};

/* script */
const __vue_script__$6 = Geom;

/* template */
var __vue_render__$6 = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c(
    "div",
    { staticClass: "geom-pane" },
    [
      _vm.comp === "Geom" ? _c("h1", [_vm._v("Geometric Algebra")]) : _vm._e(),
      _vm._v(" "),
      _vm._l(_vm.geoms, function(geom) {
        return [_c("router-view", { attrs: { name: _vm.comp + geom.key } })]
      })
    ],
    2
  )
};
var __vue_staticRenderFns__$6 = [];
__vue_render__$6._withStripped = true;

  /* style */
  const __vue_inject_styles__$6 = function (inject) {
    if (!inject) return
    inject("data-v-04132593_0", { source: ".theme-desc {\n  font-size: 1rem;\n  background-color: #333;\n  border-radius: 0.7em;\n  width: 90%;\n  height: 90%;\n}\n.geom-pane {\n  position: absolute;\n  left: 0;\n  top: 0;\n  width: 100%;\n  height: 100%;\n  background-color: black;\n  display: grid;\n}\n.geom-pane h1 {\n  justify-self: center;\n  align-self: center;\n  text-align: center;\n  color: wheat;\n  font-size: 2vmin;\n}\n", map: {"version":3,"sources":["Geom.vue"],"names":[],"mappings":"AAAA;EACE,eAAe;EACf,sBAAsB;EACtB,oBAAoB;EACpB,UAAU;EACV,WAAW;AACb;AACA;EACE,kBAAkB;EAClB,OAAO;EACP,MAAM;EACN,WAAW;EACX,YAAY;EACZ,uBAAuB;EACvB,aAAa;AACf;AACA;EACE,oBAAoB;EACpB,kBAAkB;EAClB,kBAAkB;EAClB,YAAY;EACZ,gBAAgB;AAClB","file":"Geom.vue","sourcesContent":[".theme-desc {\n  font-size: 1rem;\n  background-color: #333;\n  border-radius: 0.7em;\n  width: 90%;\n  height: 90%;\n}\n.geom-pane {\n  position: absolute;\n  left: 0;\n  top: 0;\n  width: 100%;\n  height: 100%;\n  background-color: black;\n  display: grid;\n}\n.geom-pane h1 {\n  justify-self: center;\n  align-self: center;\n  text-align: center;\n  color: wheat;\n  font-size: 2vmin;\n}\n"]}, media: undefined });

  };
  /* scoped */
  const __vue_scope_id__$6 = undefined;
  /* module identifier */
  const __vue_module_identifier__$6 = undefined;
  /* functional template */
  const __vue_is_functional_template__$6 = false;
  /* style inject SSR */
  

  
  var Geom$1 = normalizeComponent_1(
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
//
//
//
//


var script$2 = {

  props: { route:String, pages:Object, defn:{ default:'null', type:String }, position:{ default:'full', type:String } },
  
  data() { return { pageKey:'None', pageObj:null,
    positions:{ left:{ left:0, width:'50%' }, right:{ left:'50%', width:'50%' }, full:{ left:0, width:'100%' } } } },
  
  methods: {
    onPage: function (key) {
      if( key !== 'None') {
        this.pageKey = key;
        this.nav().setPageKey( this.route, key ); } },
    doPage: function (key) {
        this.onPage( key );
        this.nav().pub( { source:'Tabs', route:this.route, pageKey:key } ); },
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

/* script */
const __vue_script__$7 = script$2;

/* template */
var __vue_render__$7 = function() {
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
var __vue_staticRenderFns__$7 = [];
__vue_render__$7._withStripped = true;

  /* style */
  const __vue_inject_styles__$7 = function (inject) {
    if (!inject) return
    inject("data-v-76f3c7e0_0", { source: ".theme-desc {\n  font-size: 1rem;\n  background-color: #333;\n  border-radius: 0.7em;\n  width: 90%;\n  height: 90%;\n}\n.tabs-pane {\n  background-color: black;\n  font-size: 3.4vmin;\n  position: absolute;\n  left: 0;\n  top: 0;\n  width: 50%;\n  height: 5%;\n}\n.tabs-pane .tabs-tab {\n  display: inline-block;\n  margin-left: 2rem;\n  padding: 0.2rem 0.3rem 0.1rem 0.3rem;\n  border-radius: 12px 12px 0 0;\n  border-left: wheat solid thin;\n  border-top: wheat solid thin;\n  border-right: wheat solid thin;\n  background-color: black;\n  color: wheat;\n}\n.tabs-pane .tabs-tab:hover {\n  background-color: wheat;\n  color: black;\n}\n.tabs-pane .tabs-tab-active {\n  display: inline-block;\n  margin-left: 2rem;\n  padding: 0.2rem 0.3rem 0.1rem 0.3rem;\n  border-radius: 12px 12px 0 0;\n  border-left: wheat solid thin;\n  border-top: wheat solid thin;\n  border-right: wheat solid thin;\n  background-color: black;\n  color: wheat;\n  background-color: wheat;\n  color: black;\n}\n", map: {"version":3,"sources":["Tabs.vue"],"names":[],"mappings":"AAAA;EACE,eAAe;EACf,sBAAsB;EACtB,oBAAoB;EACpB,UAAU;EACV,WAAW;AACb;AACA;EACE,uBAAuB;EACvB,kBAAkB;EAClB,kBAAkB;EAClB,OAAO;EACP,MAAM;EACN,UAAU;EACV,UAAU;AACZ;AACA;EACE,qBAAqB;EACrB,iBAAiB;EACjB,oCAAoC;EACpC,4BAA4B;EAC5B,6BAA6B;EAC7B,4BAA4B;EAC5B,8BAA8B;EAC9B,uBAAuB;EACvB,YAAY;AACd;AACA;EACE,uBAAuB;EACvB,YAAY;AACd;AACA;EACE,qBAAqB;EACrB,iBAAiB;EACjB,oCAAoC;EACpC,4BAA4B;EAC5B,6BAA6B;EAC7B,4BAA4B;EAC5B,8BAA8B;EAC9B,uBAAuB;EACvB,YAAY;EACZ,uBAAuB;EACvB,YAAY;AACd","file":"Tabs.vue","sourcesContent":[".theme-desc {\n  font-size: 1rem;\n  background-color: #333;\n  border-radius: 0.7em;\n  width: 90%;\n  height: 90%;\n}\n.tabs-pane {\n  background-color: black;\n  font-size: 3.4vmin;\n  position: absolute;\n  left: 0;\n  top: 0;\n  width: 50%;\n  height: 5%;\n}\n.tabs-pane .tabs-tab {\n  display: inline-block;\n  margin-left: 2rem;\n  padding: 0.2rem 0.3rem 0.1rem 0.3rem;\n  border-radius: 12px 12px 0 0;\n  border-left: wheat solid thin;\n  border-top: wheat solid thin;\n  border-right: wheat solid thin;\n  background-color: black;\n  color: wheat;\n}\n.tabs-pane .tabs-tab:hover {\n  background-color: wheat;\n  color: black;\n}\n.tabs-pane .tabs-tab-active {\n  display: inline-block;\n  margin-left: 2rem;\n  padding: 0.2rem 0.3rem 0.1rem 0.3rem;\n  border-radius: 12px 12px 0 0;\n  border-left: wheat solid thin;\n  border-top: wheat solid thin;\n  border-right: wheat solid thin;\n  background-color: black;\n  color: wheat;\n  background-color: wheat;\n  color: black;\n}\n"]}, media: undefined });

  };
  /* scoped */
  const __vue_scope_id__$7 = undefined;
  /* module identifier */
  const __vue_module_identifier__$7 = undefined;
  /* functional template */
  const __vue_is_functional_template__$7 = false;
  /* style inject SSR */
  

  
  var Tabs = normalizeComponent_1(
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

let Note = {
  
  components:{ 'n-tabs':Tabs },

  data() {
    return { route:'Note', tab:'Stand', pages:{
        Stand: { title:'Stand', key:'Stand', show:false, route:'Stand' },
        Embed: { title:'Embed', key:'Embed', show:false, route:'Embed' },
        Maths: { title:'Maths', key:'Maths', show:false, route:'Maths' },
        Ganja: { title:'Ganja', key:'Ganja', show:false, route:'Ganja' },
      } } },
  
  methods: {
    myRoute: function() {
      this.isRoute('Note'); } }
  
};

/* script */
const __vue_script__$8 = Note;

/* template */
var __vue_render__$8 = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c(
    "div",
    { staticClass: "note-pane" },
    [
      _c("n-tabs", {
        attrs: { route: "Note", pages: _vm.pages, defn: "None" }
      }),
      _vm._v(" "),
      _vm.myRoute() ? _c("h1", [_vm._v("Notebooks")]) : _vm._e(),
      _vm._v(" "),
      _vm._l(_vm.pages, function(page) {
        return [_c("router-view", { attrs: { name: page.key } })]
      })
    ],
    2
  )
};
var __vue_staticRenderFns__$8 = [];
__vue_render__$8._withStripped = true;

  /* style */
  const __vue_inject_styles__$8 = function (inject) {
    if (!inject) return
    inject("data-v-4f4657a5_0", { source: ".theme-desc {\n  font-size: 1rem;\n  background-color: #333;\n  border-radius: 0.7em;\n  width: 90%;\n  height: 90%;\n}\n.note-pane {\n  position: absolute;\n  left: 0;\n  top: 0;\n  width: 100%;\n  height: 100%;\n  background-color: black;\n  display: grid;\n}\n.note-pane h1 {\n  justify-self: center;\n  align-self: center;\n  text-align: center;\n  color: wheat;\n  font-size: 2vmin;\n}\n", map: {"version":3,"sources":["Note.vue"],"names":[],"mappings":"AAAA;EACE,eAAe;EACf,sBAAsB;EACtB,oBAAoB;EACpB,UAAU;EACV,WAAW;AACb;AACA;EACE,kBAAkB;EAClB,OAAO;EACP,MAAM;EACN,WAAW;EACX,YAAY;EACZ,uBAAuB;EACvB,aAAa;AACf;AACA;EACE,oBAAoB;EACpB,kBAAkB;EAClB,kBAAkB;EAClB,YAAY;EACZ,gBAAgB;AAClB","file":"Note.vue","sourcesContent":[".theme-desc {\n  font-size: 1rem;\n  background-color: #333;\n  border-radius: 0.7em;\n  width: 90%;\n  height: 90%;\n}\n.note-pane {\n  position: absolute;\n  left: 0;\n  top: 0;\n  width: 100%;\n  height: 100%;\n  background-color: black;\n  display: grid;\n}\n.note-pane h1 {\n  justify-self: center;\n  align-self: center;\n  text-align: center;\n  color: wheat;\n  font-size: 2vmin;\n}\n"]}, media: undefined });

  };
  /* scoped */
  const __vue_scope_id__$8 = undefined;
  /* module identifier */
  const __vue_module_identifier__$8 = undefined;
  /* functional template */
  const __vue_is_functional_template__$8 = false;
  /* style inject SSR */
  

  
  var Note$1 = normalizeComponent_1(
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


let Data = {

  data() { return { route:'Data', datas:[
    { title:'Tables', key:'Tables' },
    { title:'Pivots', key:'Pivots' } ] } },

  methods: {
    isData: function() {
      return this.comp === 'Data'; } },

  mounted: function () {}

};

/* script */
const __vue_script__$9 = Data;

/* template */
var __vue_render__$9 = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c(
    "div",
    { ref: "Data", staticClass: "data" },
    [
      _c("h1", { attrs: { "v-if": _vm.isData() } }, [_vm._v("Data")]),
      _vm._v(" "),
      _vm._l(_vm.datas, function(dat) {
        return [_c("router-view", { attrs: { name: dat.key } })]
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
    inject("data-v-5a02105c_0", { source: ".theme-desc {\n  font-size: 1rem;\n  background-color: #333;\n  border-radius: 0.7em;\n  width: 90%;\n  height: 90%;\n}\n.data {\n  position: absolute;\n  left: 0;\n  top: 0;\n  width: 100%;\n  height: 100%;\n  background-color: black;\n  display: grid;\n}\n.data h1 {\n  justify-self: center;\n  align-self: center;\n  text-align: center;\n  color: wheat;\n  font-size: 2vmin;\n}\n", map: {"version":3,"sources":["Data.vue"],"names":[],"mappings":"AAAA;EACE,eAAe;EACf,sBAAsB;EACtB,oBAAoB;EACpB,UAAU;EACV,WAAW;AACb;AACA;EACE,kBAAkB;EAClB,OAAO;EACP,MAAM;EACN,WAAW;EACX,YAAY;EACZ,uBAAuB;EACvB,aAAa;AACf;AACA;EACE,oBAAoB;EACpB,kBAAkB;EAClB,kBAAkB;EAClB,YAAY;EACZ,gBAAgB;AAClB","file":"Data.vue","sourcesContent":[".theme-desc {\n  font-size: 1rem;\n  background-color: #333;\n  border-radius: 0.7em;\n  width: 90%;\n  height: 90%;\n}\n.data {\n  position: absolute;\n  left: 0;\n  top: 0;\n  width: 100%;\n  height: 100%;\n  background-color: black;\n  display: grid;\n}\n.data h1 {\n  justify-self: center;\n  align-self: center;\n  text-align: center;\n  color: wheat;\n  font-size: 2vmin;\n}\n"]}, media: undefined });

  };
  /* scoped */
  const __vue_scope_id__$9 = undefined;
  /* module identifier */
  const __vue_module_identifier__$9 = undefined;
  /* functional template */
  const __vue_is_functional_template__$9 = false;
  /* style inject SSR */
  

  
  var Data$1 = normalizeComponent_1(
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

 let Home = {
  
  components:{ 'h-btns':Btns },

data() { return { comp:'Draw', key:'Axes', btns:{
  Axes:    { title:'Axes',    key:'Axes',    obj:null, pos:[ 5,10,0,10], back:'primary',   check:true              },
  Chord:   { title:'Chord',   key:'Chord',   obj:null, pos:[30,10,0,20], back:'secondary', img:'brew/AutoDrip.jpg' },
  Cluster: { title:'Cluster', key:'Cluster', obj:null, pos:[50,10,0,10], back:'success',   icon:'fas fa-circle'    },
  Link:    { title:'Link',    key:'Link',    obj:null, pos:[ 5,25,0,20], back:'info',      check:true              },
  Radar:   { title:'Radar',   key:'Radar',   obj:null, pos:[ 5,40,0,10], back:'warning',   icon:'fas fa-circle'    },
  Radial:  { title:'Radial',  key:'Radial',  obj:null, pos:[ 5,55,0,20], back:'danger',    img:'brew/AutoDrip.jpg' },
  Tree:    { title:'Tree',    key:'Tree',    obj:null, pos:[40,40,0,30], back:'light',     icon:'fas fa-circle'    },
  Wheel:   { title:'Wheel',   key:'Wheel',   obj:null, pos:[60,60,0,30], back:'success',   img:'brew/AutoDrip.jpg' }
  } } },

 mounted: function () {
     this.publish( 'Tocs', 'Close' ); }
 
};

Home.Dash = Dash$1;
Home.Math = Math$1;
Home.Geom = Geom$1;
Home.Note = Note$1;
Home.Data = Data$1;

/* script */
const __vue_script__$a = Home;

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
    return _c("div", { staticClass: "home" }, [
      _c("div", { staticClass: "head" }, [
        _c("div", [
          _c("h1", [_vm._v("Welcome to Augmentation Home Page")]),
          _vm._v(" "),
          _c("h2", [_vm._v("Choose an Application Component on the Left")])
        ])
      ]),
      _vm._v(" "),
      _c("div", { staticClass: "midd" }),
      _vm._v(" "),
      _c("div", { staticClass: "foot" }, [
        _c("div", [_c("h1", [_vm._v("Axiom Architectures")])])
      ])
    ])
  }
];
__vue_render__$a._withStripped = true;

  /* style */
  const __vue_inject_styles__$a = function (inject) {
    if (!inject) return
    inject("data-v-f6ee76a6_0", { source: ".theme-desc {\n  font-size: 1rem;\n  background-color: #333;\n  border-radius: 0.7em;\n  width: 90%;\n  height: 90%;\n}\n.home {\n  display: grid;\n  grid-template-columns: 1fr;\n  grid-template-rows: 30fr 40fr 30fr;\n  grid-template-areas: \"head\" \"midd\" \"foot\";\n  position: relative;\n  left: 0;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  background-color: black;\n  color: wheat;\n}\n.home .head {\n  grid-area: head;\n  display: grid;\n  justify-items: center;\n  align-items: center;\n  text-align: center;\n  justify-self: stretch;\n  align-self: stretch;\n}\n.home .head h1 {\n  font-size: 2vmin;\n}\n.home .midd {\n  grid-area: midd;\n  display: grid;\n  justify-items: center;\n  align-items: center;\n  text-align: center;\n  justify-self: stretch;\n  align-self: stretch;\n}\n.home .midd h1 {\n  font-size: 2vmin;\n}\n.home .foot {\n  grid-area: foot;\n  display: grid;\n  justify-items: center;\n  align-items: center;\n  text-align: center;\n  justify-self: stretch;\n  align-self: stretch;\n}\n.home .foot h1 {\n  font-size: 2vmin;\n}\n", map: {"version":3,"sources":["Home.vue"],"names":[],"mappings":"AAAA;EACE,eAAe;EACf,sBAAsB;EACtB,oBAAoB;EACpB,UAAU;EACV,WAAW;AACb;AACA;EACE,aAAa;EACb,0BAA0B;EAC1B,kCAAkC;EAClC,yCAAyC;EACzC,kBAAkB;EAClB,OAAO;EACP,MAAM;EACN,QAAQ;EACR,SAAS;EACT,uBAAuB;EACvB,YAAY;AACd;AACA;EACE,eAAe;EACf,aAAa;EACb,qBAAqB;EACrB,mBAAmB;EACnB,kBAAkB;EAClB,qBAAqB;EACrB,mBAAmB;AACrB;AACA;EACE,gBAAgB;AAClB;AACA;EACE,eAAe;EACf,aAAa;EACb,qBAAqB;EACrB,mBAAmB;EACnB,kBAAkB;EAClB,qBAAqB;EACrB,mBAAmB;AACrB;AACA;EACE,gBAAgB;AAClB;AACA;EACE,eAAe;EACf,aAAa;EACb,qBAAqB;EACrB,mBAAmB;EACnB,kBAAkB;EAClB,qBAAqB;EACrB,mBAAmB;AACrB;AACA;EACE,gBAAgB;AAClB","file":"Home.vue","sourcesContent":[".theme-desc {\n  font-size: 1rem;\n  background-color: #333;\n  border-radius: 0.7em;\n  width: 90%;\n  height: 90%;\n}\n.home {\n  display: grid;\n  grid-template-columns: 1fr;\n  grid-template-rows: 30fr 40fr 30fr;\n  grid-template-areas: \"head\" \"midd\" \"foot\";\n  position: relative;\n  left: 0;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  background-color: black;\n  color: wheat;\n}\n.home .head {\n  grid-area: head;\n  display: grid;\n  justify-items: center;\n  align-items: center;\n  text-align: center;\n  justify-self: stretch;\n  align-self: stretch;\n}\n.home .head h1 {\n  font-size: 2vmin;\n}\n.home .midd {\n  grid-area: midd;\n  display: grid;\n  justify-items: center;\n  align-items: center;\n  text-align: center;\n  justify-self: stretch;\n  align-self: stretch;\n}\n.home .midd h1 {\n  font-size: 2vmin;\n}\n.home .foot {\n  grid-area: foot;\n  display: grid;\n  justify-items: center;\n  align-items: center;\n  text-align: center;\n  justify-self: stretch;\n  align-self: stretch;\n}\n.home .foot h1 {\n  font-size: 2vmin;\n}\n"]}, media: undefined });

  };
  /* scoped */
  const __vue_scope_id__$a = undefined;
  /* module identifier */
  const __vue_module_identifier__$a = undefined;
  /* functional template */
  const __vue_is_functional_template__$a = false;
  /* style inject SSR */
  

  
  var Home$1 = normalizeComponent_1(
    { render: __vue_render__$a, staticRenderFns: __vue_staticRenderFns__$a },
    __vue_inject_styles__$a,
    __vue_script__$a,
    __vue_scope_id__$a,
    __vue_is_functional_template__$a,
    __vue_module_identifier__$a,
    browser,
    undefined
  );

export default Home$1;
