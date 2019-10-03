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
    { ref: "Btns", staticClass: "btns" },
    [
      _vm._l(_vm.btns, function(btn) {
        return [
          _c(
            "div",
            { ref: btn.name, refInFor: true, style: _vm.styleBlock(btn.pos) },
            [
              _c("div", { staticClass: "btn-center" }, [
                _c(
                  "div",
                  {
                    staticClass: "btn",
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
    inject("data-v-464d58ac_0", { source: ".theme-prac {\n  background-color: #333;\n  border-radius: 36px;\n  width: 90%;\n  height: 90%;\n  font-size: 2rem;\n}\n.theme-comp-icon {\n  background-color: #333;\n  border-radius: 36px;\n  width: 90%;\n  height: 90%;\n}\n.theme-comp-dirs {\n  background-color: #333;\n  border-radius: 36px;\n  width: 90%;\n  height: 90%;\n  font-size: 1.3rem;\n}\n.theme-comp-conn {\n  background-color: #333;\n  border-radius: 36px;\n  width: 90%;\n  height: 90%;\n}\n.theme-comp-desc {\n  background-color: #333;\n}\n.theme-prac-dirs {\n  background-color: #333;\n  border-radius: 36px;\n  font-size: 1.3rem;\n}\n.theme-prac-conn {\n  background-color: #333;\n  border-radius: 36px;\n}\n.theme-prac-desc {\n  background-color: #333;\n}\n.theme-disp-desc {\n  background-color: #333;\n}\n.theme-logo {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-menu {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-find {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-tocs {\n  background-color: black;\n  font-size: 2rem;\n}\n.theme-view {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-side {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-pref {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-foot {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-trak {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.btns {\n  font-size: 1.4rem;\n  font-weight: bold;\n  position: absolute;\n  left: 0;\n  top: 0;\n  right: 0;\n  bottom: 0;\n}\n.btn-center {\n  display: grid;\n  width: 100%;\n  height: 100%;\n}\n.btn {\n  display: grid;\n  grid-template-columns: 20fr 24fr 56fr;\n  grid-template-areas: \"check icons label\";\n  justify-self: center;\n  align-self: center;\n  width: 80%;\n  height: 80%;\n  font-size: inherit;\n  font-family: Roboto, sans-serif;\n  cursor: pointer;\n  border-radius: 16px;\n  border: solid black 1px;\n}\n.btn .check {\n  grid-area: check;\n  justify-self: center;\n  align-self: center;\n}\n.btn .icons {\n  grid-area: icons;\n  justify-self: center;\n  align-self: center;\n}\n.btn .image {\n  grid-area: icons;\n  justify-self: left;\n  align-self: center;\n  border-radius: 8px;\n  border: solid black 1px;\n  max-height: 1.5em;\n}\n.btn .title {\n  grid-area: label;\n  justify-self: left;\n  align-self: center;\n  text-align: left;\n}\n.image-radius {\n  border-radius: 8px;\n  border: solid black 1px;\n}\n", map: {"version":3,"sources":["Btns.vue","/Users/ax/Documents/prj/aug/vue/elem/Btns.vue"],"names":[],"mappings":"AAAA;EACE,sBAAsB;EACtB,mBAAmB;EACnB,UAAU;EACV,WAAW;EACX,eAAe;AACjB;AACA;EACE,sBAAsB;EACtB,mBAAmB;EACnB,UAAU;EACV,WAAW;AACb;AACA;EACE,sBAAsB;EACtB,mBAAmB;EACnB,UAAU;EACV,WAAW;EACX,iBAAiB;AACnB;AACA;EACE,sBAAsB;EACtB,mBAAmB;EACnB,UAAU;EACV,WAAW;AACb;AACA;EACE,sBAAsB;AACxB;AACA;EACE,sBAAsB;EACtB,mBAAmB;EACnB,iBAAiB;AACnB;AACA;EACE,sBAAsB;EACtB,mBAAmB;AACrB;AACA;EACE,sBAAsB;AACxB;AACA;EACE,sBAAsB;AACxB;AACA;EACE,uBAAuB;EACvB,iBAAiB;AACnB;AACA;EACE,uBAAuB;EACvB,iBAAiB;AACnB;AACA;EACE,uBAAuB;EACvB,iBAAiB;AACnB;AACA;EACE,uBAAuB;EACvB,eAAe;AACjB;AACA;EACE,uBAAuB;EACvB,iBAAiB;AACnB;AACA;EACE,uBAAuB;EACvB,iBAAiB;AACnB;AACA;EACE,uBAAuB;EACvB,iBAAiB;AACnB;AACA;EACE,uBAAuB;EACvB,iBAAiB;AACnB;AACA;EACE,uBAAuB;EACvB,iBAAiB;ACCnB;ADCA;ECCA,iBAAA;EDCE,iBAAiB;ECCnB,kBAAA;EDCE,OAAO;ECCT,MAAA;EDCE,QAAQ;ECCV,SAAA;AACA;AACA;EDCE,aAAa;ECCf,WAAA;EACA,YAAA;AACA;AACA;EDCE,aAAa;ECCf,qCAAA;EDCE,wCAAwC;EACxC,oBAAoB;EACpB,kBAAkB;EAClB,UAAU;EACV,WAAW;EACX,kBAAkB;EAClB,+BAA+B;EAC/B,eAAe;EACf,mBAAmB;EACnB,uBAAuB;AACzB;AACA;EACE,gBAAgB;EAChB,oBAAoB;EACpB,kBAAkB;AACpB;AACA;EACE,gBAAgB;EAChB,oBAAoB;EACpB,kBAAkB;AACpB;AACA;EACE,gBAAgB;EAChB,kBAAkB;EAClB,kBAAkB;EAClB,kBAAkB;EAClB,uBAAuB;EACvB,iBAAiB;AACnB;AACA;EACE,gBAAgB;EAChB,kBAAkB;EAClB,kBAAkB;EAClB,gBAAgB;AAClB;AACA;EACE,kBAAkB;EAClB,uBAAuB;AACzB","file":"Btns.vue","sourcesContent":[".theme-prac {\n  background-color: #333;\n  border-radius: 36px;\n  width: 90%;\n  height: 90%;\n  font-size: 2rem;\n}\n.theme-comp-icon {\n  background-color: #333;\n  border-radius: 36px;\n  width: 90%;\n  height: 90%;\n}\n.theme-comp-dirs {\n  background-color: #333;\n  border-radius: 36px;\n  width: 90%;\n  height: 90%;\n  font-size: 1.3rem;\n}\n.theme-comp-conn {\n  background-color: #333;\n  border-radius: 36px;\n  width: 90%;\n  height: 90%;\n}\n.theme-comp-desc {\n  background-color: #333;\n}\n.theme-prac-dirs {\n  background-color: #333;\n  border-radius: 36px;\n  font-size: 1.3rem;\n}\n.theme-prac-conn {\n  background-color: #333;\n  border-radius: 36px;\n}\n.theme-prac-desc {\n  background-color: #333;\n}\n.theme-disp-desc {\n  background-color: #333;\n}\n.theme-logo {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-menu {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-find {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-tocs {\n  background-color: black;\n  font-size: 2rem;\n}\n.theme-view {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-side {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-pref {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-foot {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-trak {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.btns {\n  font-size: 1.4rem;\n  font-weight: bold;\n  position: absolute;\n  left: 0;\n  top: 0;\n  right: 0;\n  bottom: 0;\n}\n.btn-center {\n  display: grid;\n  width: 100%;\n  height: 100%;\n}\n.btn {\n  display: grid;\n  grid-template-columns: 20fr 24fr 56fr;\n  grid-template-areas: \"check icons label\";\n  justify-self: center;\n  align-self: center;\n  width: 80%;\n  height: 80%;\n  font-size: inherit;\n  font-family: Roboto, sans-serif;\n  cursor: pointer;\n  border-radius: 16px;\n  border: solid black 1px;\n}\n.btn .check {\n  grid-area: check;\n  justify-self: center;\n  align-self: center;\n}\n.btn .icons {\n  grid-area: icons;\n  justify-self: center;\n  align-self: center;\n}\n.btn .image {\n  grid-area: icons;\n  justify-self: left;\n  align-self: center;\n  border-radius: 8px;\n  border: solid black 1px;\n  max-height: 1.5em;\n}\n.btn .title {\n  grid-area: label;\n  justify-self: left;\n  align-self: center;\n  text-align: left;\n}\n.image-radius {\n  border-radius: 8px;\n  border: solid black 1px;\n}\n","\n<template>\n  <div ref=\"Btns\" class=\"btns\">\n    <template v-for=\"btn in btns\">\n      <div        :ref=\"btn.name\"  :style=\"styleBlock(btn.pos)\">\n        <div   class=\"btn-center\">\n          <div class=\"btn\" :style=\"styleBtn(btn)\" @click=\"pubBtn(btn)\">\n            <span v-if=\"btn.check\" :class=\"classCheck(btn)\"></span>\n            <i    v-if=\"btn.icon\"  :class=\"classIcons(btn)\"></i>\n            <img  v-if=\"btn.img\"    class=\"image\" :src=\"img(btn)\" alt=\"\"/>\n            <span v-if=\"btn.title\"  class=\"title\" :ref=\"titleRef(btn)\">{{btn.title}}</span>\n          </div>\n        </div>\n      </div>\n    </template>\n  </div>\n</template>\n\n<script type=\"module\">\n  \n  // import Data from '../../pub/base/util/Data.js'\n\n  export default {\n\n    props: { name:String, btns:Object },\n\n    methods: {\n      pubBtn: function (btn) {\n        this.choose(  this.name, btn.name );\n        btn.checked = this.choosen( this.name, btn.name );\n        // console.log( 'Btns.pubBtn()', this.name, btn.name,  btn.checked );\n        this.publish( this.name, btn.name ); },\n    //onWatch: function() {\n    //    console.log( 'Btns.onWatch()' ); },\n      aspect: function() {  // Only call in mounted\n        let w = this.$refs['Btns']['clientWidth' ];\n        let h = this.$refs['Btns']['clientHeight'];\n        return h/w; },\n      styleBlock: function(p) {\n        let sy = 1.0\n        let p2 = p[2]===0 ? p[3] : p[2];\n        return { position:'absolute', left:sy*p[0]+'%', top:sy*p[1]+'%', width:sy*p2+'%', height:sy*p[3]+'%',\n        fontSize:(p[3]*0.08)+'em' } },\n      styleBtn: function (btn) {\n        let back = this.toRgbaHsv( btn.hsv );\n        return { color:'black', backgroundColor:back }; },\n      classCheck: function (btn) {\n        btn.checked = this.choosen( this.name, btn.name );\n        // console.log( 'Btns.classCheck()', { checked:btn.checked, name:this.name, choice:btn.name } );\n        return btn.checked ? 'check far fa-check-square' : 'check far fa-square'; },\n      classIcons: function (btn) {\n        return 'icons ' + btn.icon },\n      titleRef: function (btn) {\n        return 'Title' + btn.name },\n      img: function (btn) {\n        return '../../css/' + btn.img },\n      adjustWidths: function() {\n         let names = Object.keys(this.btns)\n         for( let name of names ) {\n           let btn = this.btns[name];\n           if( btn.pos[2]===0 ) {\n             let wt     = this.$refs[this.titleRef(btn)][0]['clientWidth']\n             btn.elem   = this.$refs[btn.name][0]\n             let wb     = btn.elem['clientWidth']\n             btn.pos[2] = btn.pos[3]*2.4*wt/wb\n             // console.log( 'Adj', { wt:wt, wb:wb, w:btn.pos[2], h:btn.pos[3] } ) }\n             btn.elem.style.width = btn.pos[2]+'%' } }\n      } },\n\n    mounted: function () {\n      this.asp = this.aspect();\n      this.adjustWidths(); }\n\n  }\n\n</script>\n\n<style lang=\"less\">\n  \n  @import '../../pub/css/themes/theme.less';\n  \n  .btns { font-size:@theme-btn-size; font-weight:bold; position:absolute; left:0; top:0; right:0; bottom:0; }\n  \n  .btn-center { display:grid;  width:100%; height:100%; } // A surrounding div for centering button\n\n  .grid1x3() { display:grid; grid-template-columns:20fr 24fr 56fr; grid-template-areas:\"check icons label\"; }\n\n  .btn { .grid1x3(); justify-self:center; align-self:center;\n    width:80%; height:80%; font-size:inherit; font-family:@theme-font-family;\n    cursor:pointer; border-radius:16px; border: solid @theme-back 1px; }\n\n  .btn .check { grid-area:check; justify-self:center; align-self:center; }\n  .btn .icons { grid-area:icons; justify-self:center; align-self:center; } // font-family: \"font-awesome\" serif;\n  .btn .image { grid-area:icons; justify-self:left;   align-self:center; .image-radius; max-height:1.5em; }\n  .btn .title { grid-area:label; justify-self:left;   align-self:center; text-align:left; }\n\n  .image-radius { border-radius:8px; border:solid @theme-back 1px; }\n\n\n</style>"]}, media: undefined });

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


let Logo = {
  
  name: 'logo',
  
  methods: {
    doDir: function( dir ) {
      if( this.isDir() ) {
          this.dir().touch( dir ); }
      else if( this.isNav() ) {
          this.nav().dir( dir ); }
      else {
        console.error( 'Logo.vue.doDir() no direction navigator' ); } } },
  
  mounted: function () {}
};

/* script */
const __vue_script__$1 = Logo;

/* template */
var __vue_render__$1 = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c("div", { staticClass: "logo" }, [
    _c("div", { ref: "navd", staticClass: "navd" }, [
      _c(
        "div",
        {
          ref: "west",
          staticClass: "west",
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
          staticClass: "north",
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
          staticClass: "next",
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
          staticClass: "prev",
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
          staticClass: "east",
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
          staticClass: "south",
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
    inject("data-v-af86230c_0", { source: ".theme-prac {\n  background-color: #333;\n  border-radius: 36px;\n  width: 90%;\n  height: 90%;\n  font-size: 2rem;\n}\n.theme-comp-icon {\n  background-color: #333;\n  border-radius: 36px;\n  width: 90%;\n  height: 90%;\n}\n.theme-comp-dirs {\n  background-color: #333;\n  border-radius: 36px;\n  width: 90%;\n  height: 90%;\n  font-size: 1.3rem;\n}\n.theme-comp-conn {\n  background-color: #333;\n  border-radius: 36px;\n  width: 90%;\n  height: 90%;\n}\n.theme-comp-desc {\n  background-color: #333;\n}\n.theme-prac-dirs {\n  background-color: #333;\n  border-radius: 36px;\n  font-size: 1.3rem;\n}\n.theme-prac-conn {\n  background-color: #333;\n  border-radius: 36px;\n}\n.theme-prac-desc {\n  background-color: #333;\n}\n.theme-disp-desc {\n  background-color: #333;\n}\n.theme-logo {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-menu {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-find {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-tocs {\n  background-color: black;\n  font-size: 2rem;\n}\n.theme-view {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-side {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-pref {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-foot {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-trak {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.logo {\n  background-color: black;\n}\n.navd {\n  background-color: black;\n  color: wheat;\n  position: relative;\n  left: 15%;\n  top: 0;\n  width: 70%;\n  height: 100%;\n}\n.navd .west {\n  position: absolute;\n  left: 0;\n  top: 33%;\n  width: 25%;\n  height: 33%;\n  font-size: 1.3rem;\n}\n.navd .north {\n  position: absolute;\n  left: 37.5%;\n  top: 0;\n  width: 25%;\n  height: 33%;\n  font-size: 1.3rem;\n}\n.navd .next {\n  position: absolute;\n  left: 25%;\n  top: 33%;\n  width: 25%;\n  height: 33%;\n  font-size: 1.2rem;\n}\n.navd .prev {\n  position: absolute;\n  left: 50%;\n  top: 33%;\n  width: 25%;\n  height: 33%;\n  font-size: 1.2rem;\n}\n.navd .east {\n  position: absolute;\n  left: 75%;\n  top: 33%;\n  width: 25%;\n  height: 33%;\n  font-size: 1.3rem;\n}\n.navd .south {\n  position: absolute;\n  left: 37.5%;\n  top: 66%;\n  width: 25%;\n  height: 33%;\n  font-size: 1.3rem;\n}\n.navd div {\n  display: grid;\n}\n.navd div i {\n  justify-self: center;\n  align-self: center;\n}\n", map: {"version":3,"sources":["Logo.vue","/Users/ax/Documents/prj/aug/vue/dash/Logo.vue"],"names":[],"mappings":"AAAA;EACE,sBAAsB;EACtB,mBAAmB;EACnB,UAAU;EACV,WAAW;EACX,eAAe;AACjB;AACA;EACE,sBAAsB;EACtB,mBAAmB;EACnB,UAAU;EACV,WAAW;AACb;AACA;EACE,sBAAsB;EACtB,mBAAmB;EACnB,UAAU;EACV,WAAW;EACX,iBAAiB;AACnB;AACA;EACE,sBAAsB;EACtB,mBAAmB;EACnB,UAAU;EACV,WAAW;AACb;AACA;EACE,sBAAsB;AACxB;AACA;EACE,sBAAsB;EACtB,mBAAmB;EACnB,iBAAiB;AACnB;AACA;EACE,sBAAsB;EACtB,mBAAmB;AACrB;ACCA;EDCE,sBAAsB;ACCxB;ADCA;ECCA,sBAAA;AACA;AACA;EACA,uBAAA;EACA,iBAAA;AACA;AACA;EACA,uBAAA;EACA,iBAAA;AACA;ADCA;EACE,uBAAuB;EACvB,iBAAiB;AACnB;AACA;EACE,uBAAuB;EACvB,eAAe;AACjB;AACA;EACE,uBAAuB;EACvB,iBAAiB;AACnB;AACA;EACE,uBAAuB;EACvB,iBAAiB;AACnB;AACA;EACE,uBAAuB;EACvB,iBAAiB;AACnB;AACA;EACE,uBAAuB;EACvB,iBAAiB;AACnB;AACA;EACE,uBAAuB;EACvB,iBAAiB;AACnB;AACA;EACE,uBAAuB;AACzB;AACA;EACE,uBAAuB;EACvB,YAAY;EACZ,kBAAkB;EAClB,SAAS;EACT,MAAM;EACN,UAAU;EACV,YAAY;AACd;AACA;EACE,kBAAkB;EAClB,OAAO;EACP,QAAQ;EACR,UAAU;EACV,WAAW;EACX,iBAAiB;AACnB;AACA;EACE,kBAAkB;EAClB,WAAW;EACX,MAAM;EACN,UAAU;EACV,WAAW;EACX,iBAAiB;AACnB;AACA;EACE,kBAAkB;EAClB,SAAS;EACT,QAAQ;EACR,UAAU;EACV,WAAW;EACX,iBAAiB;AACnB;AACA;EACE,kBAAkB;EAClB,SAAS;EACT,QAAQ;EACR,UAAU;EACV,WAAW;EACX,iBAAiB;AACnB;AACA;EACE,kBAAkB;EAClB,SAAS;EACT,QAAQ;EACR,UAAU;EACV,WAAW;EACX,iBAAiB;AACnB;AACA;EACE,kBAAkB;EAClB,WAAW;EACX,QAAQ;EACR,UAAU;EACV,WAAW;EACX,iBAAiB;AACnB;AACA;EACE,aAAa;AACf;AACA;EACE,oBAAoB;EACpB,kBAAkB;AACpB","file":"Logo.vue","sourcesContent":[".theme-prac {\n  background-color: #333;\n  border-radius: 36px;\n  width: 90%;\n  height: 90%;\n  font-size: 2rem;\n}\n.theme-comp-icon {\n  background-color: #333;\n  border-radius: 36px;\n  width: 90%;\n  height: 90%;\n}\n.theme-comp-dirs {\n  background-color: #333;\n  border-radius: 36px;\n  width: 90%;\n  height: 90%;\n  font-size: 1.3rem;\n}\n.theme-comp-conn {\n  background-color: #333;\n  border-radius: 36px;\n  width: 90%;\n  height: 90%;\n}\n.theme-comp-desc {\n  background-color: #333;\n}\n.theme-prac-dirs {\n  background-color: #333;\n  border-radius: 36px;\n  font-size: 1.3rem;\n}\n.theme-prac-conn {\n  background-color: #333;\n  border-radius: 36px;\n}\n.theme-prac-desc {\n  background-color: #333;\n}\n.theme-disp-desc {\n  background-color: #333;\n}\n.theme-logo {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-menu {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-find {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-tocs {\n  background-color: black;\n  font-size: 2rem;\n}\n.theme-view {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-side {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-pref {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-foot {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-trak {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.logo {\n  background-color: black;\n}\n.navd {\n  background-color: black;\n  color: wheat;\n  position: relative;\n  left: 15%;\n  top: 0;\n  width: 70%;\n  height: 100%;\n}\n.navd .west {\n  position: absolute;\n  left: 0;\n  top: 33%;\n  width: 25%;\n  height: 33%;\n  font-size: 1.3rem;\n}\n.navd .north {\n  position: absolute;\n  left: 37.5%;\n  top: 0;\n  width: 25%;\n  height: 33%;\n  font-size: 1.3rem;\n}\n.navd .next {\n  position: absolute;\n  left: 25%;\n  top: 33%;\n  width: 25%;\n  height: 33%;\n  font-size: 1.2rem;\n}\n.navd .prev {\n  position: absolute;\n  left: 50%;\n  top: 33%;\n  width: 25%;\n  height: 33%;\n  font-size: 1.2rem;\n}\n.navd .east {\n  position: absolute;\n  left: 75%;\n  top: 33%;\n  width: 25%;\n  height: 33%;\n  font-size: 1.3rem;\n}\n.navd .south {\n  position: absolute;\n  left: 37.5%;\n  top: 66%;\n  width: 25%;\n  height: 33%;\n  font-size: 1.3rem;\n}\n.navd div {\n  display: grid;\n}\n.navd div i {\n  justify-self: center;\n  align-self: center;\n}\n","\n<template>\n  <div class=\"logo\">\n    <div   class=\"navd\"  ref=\"navd\">\n      <div class=\"west\"  ref=\"west\"  @click=\"doDir('west' )\"><i class=\"fas fa-angle-left\"  ></i></div>\n      <div class=\"north\" ref=\"north\" @click=\"doDir('north')\"><i class=\"fas fa-angle-up\"    ></i></div>\n      <div class=\"next\"  ref=\"next\"  @click=\"doDir('next')\" ><i class=\"fas fa-plus-circle\" ></i></div>\n      <div class=\"prev\"  ref=\"prev\"  @click=\"doDir('prev')\" ><i class=\"fas fa-minus-circle\"></i></div>\n      <div class=\"east\"  ref=\"east\"  @click=\"doDir('east' )\"><i class=\"fas fa-angle-right\" ></i></div>\n      <div class=\"south\" ref=\"south\" @click=\"doDir('south')\"><i class=\"fas fa-angle-down\"  ></i></div>\n    </div>\n  </div>\n</template>\n\n<script type=\"module\">\n  \n  let Logo = {\n    \n    name: 'logo',\n    \n    methods: {\n      doDir: function( dir ) {\n        if( this.isDir() ) {\n            this.dir().touch( dir ); }\n        else if( this.isNav() ) {\n            this.nav().dir( dir ); }\n        else {\n          console.error( 'Logo.vue.doDir() no direction navigator' ); } } },\n    \n    mounted: function () {}\n  };\n\n  export default Logo;\n  \n</script>\n\n<style lang=\"less\">\n  \n  @import '../../pub/css/themes/theme.less';\n  \n  .logo { background-color:@theme-back; }\n  \n  .navd { background-color:@theme-back; color:@theme-color;\n             position:relative; left:15.0%; top:0;   width:70%; height:100%;\n    .west  { position:absolute; left:0;     top:33%; width:25%; height: 33%; font-size:@theme-dirs-size; }\n    .north { position:absolute; left:37.5%; top:0;   width:25%; height: 33%; font-size:@theme-dirs-size; }\n    .next  { position:absolute; left:25.0%; top:33%; width:25%; height: 33%; font-size:@theme-navd-size; }\n    .prev  { position:absolute; left:50.0%; top:33%; width:25%; height: 33%; font-size:@theme-navd-size; }\n    .east  { position:absolute; left:75.0%; top:33%; width:25%; height: 33%; font-size:@theme-dirs-size; }\n    .south { position:absolute; left:37.5%; top:66%; width:25%; height: 33%; font-size:@theme-dirs-size; }\n    div    { display:grid;\n      i    { justify-self:center; align-self:center; } } }\n  \n</style>\n"]}, media: undefined });

  };
  /* scoped */
  const __vue_scope_id__$1 = undefined;
  /* module identifier */
  const __vue_module_identifier__$1 = undefined;
  /* functional template */
  const __vue_is_functional_template__$1 = false;
  /* style inject SSR */
  

  
  var Logo$1 = normalizeComponent_1(
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
  
  data: function() { return { komps:{}, compKey:'Home', pracKey:'None', dispKey:'None' } },
  
  methods: {
    doComp: function(compKey) {
      this.compKey = compKey;
      let route    = this.komps[compKey].route;
      this.pub( { route:route, compKey:compKey, source:'Toc' } ); },
    doPrac: function(pracKey) {
      this.pracKey = pracKey;
      let route    = this.app()==='Muse' ? 'Prac' : pracKey;
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
    styleComp: function( compKey ) {
      return compKey===this.compKey ? { backgroundColor:'wheat', color:'black', borderRadius:'0 24px 24px 0' }
                                    : { backgroundColor:'#333',  color:'wheat', borderRadius:'0 24px 24px 0' }; },
    style: function( ikwObj ) {
      return this.styleHsv(ikwObj); },
    filterPracs: function(pracs,kompKey) {
      let filt = {};
      for( let key in pracs ) {
        let prac = pracs[key];
        if( prac.row !== 'Dim' || kompKey === 'Prin' ) {
          filt[key] = prac; } }
      return filt;
    } },
  
  mounted: function () {
    this.komps = this.kompsTocs();
    for( let key in this.komps ) {
      let komp = this.komps[key];
      if( komp.ikw ) {
        // console.log( 'Tocs.mounted()', komp.key, komp );
        komp.pracs = this.filterPracs( this.pracs(komp.key), komp.key ); } }
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
  return _c("div", { staticClass: "tocs" }, [
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
              _vm.compKey === komp.key
                ? _c(
                    "ul",
                    [
                      _vm._l(_vm.komps[komp.key].pracs, function(prac) {
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
    inject("data-v-ad7b4130_0", { source: ".theme-prac {\n  background-color: #333;\n  border-radius: 36px;\n  width: 90%;\n  height: 90%;\n  font-size: 2rem;\n}\n.theme-comp-icon {\n  background-color: #333;\n  border-radius: 36px;\n  width: 90%;\n  height: 90%;\n}\n.theme-comp-dirs {\n  background-color: #333;\n  border-radius: 36px;\n  width: 90%;\n  height: 90%;\n  font-size: 1.3rem;\n}\n.theme-comp-conn {\n  background-color: #333;\n  border-radius: 36px;\n  width: 90%;\n  height: 90%;\n}\n.theme-comp-desc {\n  background-color: #333;\n}\n.theme-prac-dirs {\n  background-color: #333;\n  border-radius: 36px;\n  font-size: 1.3rem;\n}\n.theme-prac-conn {\n  background-color: #333;\n  border-radius: 36px;\n}\n.theme-prac-desc {\n  background-color: #333;\n}\n.theme-disp-desc {\n  background-color: #333;\n}\n.theme-logo {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-menu {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-find {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-tocs {\n  background-color: black;\n  font-size: 2rem;\n}\n.theme-view {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-side {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-pref {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-foot {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-trak {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.tocs {\n  font-family: Roboto, sans-serif;\n}\n.tocs ul {\n  padding: 0;\n  margin: 0;\n  list-style: none;\n  align-self: start;\n  display: grid;\n}\n.tocs ul li {\n  background-color: #333;\n  padding-left: 0.25rem;\n  align-self: start;\n  border-radius: 0 24px 24px 0;\n  margin: 0.2rem 0.2rem 0.2rem 0.2rem;\n}\n.tocs ul li i {\n  margin-right: 0.4rem;\n}\n.tocs ul li div {\n  color: wheat;\n  text-decoration: none;\n}\n.tocs ul li ul {\n  font-size: 1.6rem;\n  font-weight: bold;\n  padding: 0;\n  margin: 0;\n}\n.tocs ul li ul li {\n  border-radius: 0 12px 12px 0;\n  color: black;\n  margin: 0.2rem 0.2rem 0.2rem 0.2rem;\n}\n.tocs ul li ul li i {\n  margin-right: 0.3rem;\n}\n.tocs ul li ul li a {\n  color: black;\n}\n.tocs ul li ul li ul {\n  font-size: 1.3rem;\n  padding: 0;\n  margin: 0 0 0 0.2rem;\n}\n.tocs ul li ul li ul li {\n  border-radius: 0 12px 12px 0;\n  color: black;\n  margin: 0.2rem 0.2rem 0.2rem 0.2rem;\n}\n.tocs ul li ul li ul li i {\n  margin-right: 0.25rem;\n}\n.tocs ul li ul li ul li:hover {\n  background-color: black !important;\n  color: white !important;\n}\n", map: {"version":3,"sources":["Tocs.vue","/Users/ax/Documents/prj/aug/vue/dash/Tocs.vue"],"names":[],"mappings":"AAAA;EACE,sBAAsB;EACtB,mBAAmB;EACnB,UAAU;EACV,WAAW;EACX,eAAe;AACjB;AACA;EACE,sBAAsB;EACtB,mBAAmB;EACnB,UAAU;EACV,WAAW;AACb;AACA;EACE,sBAAsB;EACtB,mBAAmB;EACnB,UAAU;EACV,WAAW;EACX,iBAAiB;AACnB;AACA;EACE,sBAAsB;EACtB,mBAAmB;EACnB,UAAU;EACV,WAAW;AACb;AACA;EACE,sBAAsB;AACxB;AACA;EACE,sBAAsB;EACtB,mBAAmB;EACnB,iBAAiB;AACnB;AACA;EACE,sBAAsB;EACtB,mBAAmB;AACrB;AACA;EACE,sBAAsB;AACxB;AACA;EACE,sBAAsB;AACxB;AACA;EACE,uBAAuB;EACvB,iBAAiB;AACnB;AACA;EACE,uBAAuB;EACvB,iBAAiB;AACnB;AACA;EACE,uBAAuB;EACvB,iBAAiB;AACnB;AACA;EACE,uBAAuB;EACvB,eAAe;AACjB;AACA;EACE,uBAAuB;EACvB,iBAAiB;AACnB;AACA;EACE,uBAAuB;EACvB,iBAAiB;AACnB;AACA;EACE,uBAAuB;EACvB,iBAAiB;AACnB;AACA;EACE,uBAAuB;EACvB,iBAAiB;AACnB;AACA;EACE,uBAAuB;EACvB,iBAAiB;AACnB;ACCA;EDCE,+BAA+B;ACCjC;AACA;EACA,UAAA;EACA,SAAA;EACA,gBAAA;EACA,iBAAA;EACA,aAAA;AACA;AACA;EACA,sBAAA;EACA,qBAAA;EACA,iBAAA;EACA,4BAAA;EACA,mCAAA;ADCA;AACA;EACE,oBAAoB;AACtB;AACA;EACE,YAAY;EACZ,qBAAqB;AACvB;AACA;EACE,iBAAiB;EACjB,iBAAiB;EACjB,UAAU;EACV,SAAS;AACX;AACA;EACE,4BAA4B;EAC5B,YAAY;EACZ,mCAAmC;AACrC;AACA;EACE,oBAAoB;AACtB;AACA;EACE,YAAY;AACd;AACA;EACE,iBAAiB;EACjB,UAAU;EACV,oBAAoB;AACtB;AACA;EACE,4BAA4B;EAC5B,YAAY;EACZ,mCAAmC;AACrC;AACA;EACE,qBAAqB;AACvB;AACA;EACE,kCAAkC;EAClC,uBAAuB;AACzB","file":"Tocs.vue","sourcesContent":[".theme-prac {\n  background-color: #333;\n  border-radius: 36px;\n  width: 90%;\n  height: 90%;\n  font-size: 2rem;\n}\n.theme-comp-icon {\n  background-color: #333;\n  border-radius: 36px;\n  width: 90%;\n  height: 90%;\n}\n.theme-comp-dirs {\n  background-color: #333;\n  border-radius: 36px;\n  width: 90%;\n  height: 90%;\n  font-size: 1.3rem;\n}\n.theme-comp-conn {\n  background-color: #333;\n  border-radius: 36px;\n  width: 90%;\n  height: 90%;\n}\n.theme-comp-desc {\n  background-color: #333;\n}\n.theme-prac-dirs {\n  background-color: #333;\n  border-radius: 36px;\n  font-size: 1.3rem;\n}\n.theme-prac-conn {\n  background-color: #333;\n  border-radius: 36px;\n}\n.theme-prac-desc {\n  background-color: #333;\n}\n.theme-disp-desc {\n  background-color: #333;\n}\n.theme-logo {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-menu {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-find {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-tocs {\n  background-color: black;\n  font-size: 2rem;\n}\n.theme-view {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-side {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-pref {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-foot {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-trak {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.tocs {\n  font-family: Roboto, sans-serif;\n}\n.tocs ul {\n  padding: 0;\n  margin: 0;\n  list-style: none;\n  align-self: start;\n  display: grid;\n}\n.tocs ul li {\n  background-color: #333;\n  padding-left: 0.25rem;\n  align-self: start;\n  border-radius: 0 24px 24px 0;\n  margin: 0.2rem 0.2rem 0.2rem 0.2rem;\n}\n.tocs ul li i {\n  margin-right: 0.4rem;\n}\n.tocs ul li div {\n  color: wheat;\n  text-decoration: none;\n}\n.tocs ul li ul {\n  font-size: 1.6rem;\n  font-weight: bold;\n  padding: 0;\n  margin: 0;\n}\n.tocs ul li ul li {\n  border-radius: 0 12px 12px 0;\n  color: black;\n  margin: 0.2rem 0.2rem 0.2rem 0.2rem;\n}\n.tocs ul li ul li i {\n  margin-right: 0.3rem;\n}\n.tocs ul li ul li a {\n  color: black;\n}\n.tocs ul li ul li ul {\n  font-size: 1.3rem;\n  padding: 0;\n  margin: 0 0 0 0.2rem;\n}\n.tocs ul li ul li ul li {\n  border-radius: 0 12px 12px 0;\n  color: black;\n  margin: 0.2rem 0.2rem 0.2rem 0.2rem;\n}\n.tocs ul li ul li ul li i {\n  margin-right: 0.25rem;\n}\n.tocs ul li ul li ul li:hover {\n  background-color: black !important;\n  color: white !important;\n}\n","\n<template><div class=\"tocs\">\n  <ul>\n    <template v-for=\"komp in komps\">\n      <li :key=\"komp.key\">\n        <div   v-on:click=\"doComp(komp.key)\">\n          <div  :style=\"styleComp(komp.key)\"><i :class=\"komp.icon\"></i>{{komp.title}}</div>\n        </div>\n        <ul v-if=\"compKey===komp.key\"><template v-for=\"prac in komps[komp.key].pracs\" >\n          <li v-on:click=\"doPrac(prac.name)\" :style=\"style(prac)\" :key=\"prac.name\">\n            <i :class=\"prac.icon\"></i>\n            <span>{{prac.name}}</span>\n            <ul v-show=\"pracKey===prac.name\"><template v-for=\"disp in prac.disps\">\n              <li v-on:click.stop=\"doDisp(disp.name)\" :style=\"style(disp)\" :key=\"disp.name\">\n                <i :class=\"disp.icon\"></i>{{disp.name}}</li>\n            </template></ul>\n          </li>\n        </template></ul>\n      </li>\n    </template>\n  </ul>\n</div></template>\n\n<script type=\"module\">\n  \n  let Tocs = {\n    \n    data: function() { return { komps:{}, compKey:'Home', pracKey:'None', dispKey:'None' } },\n    \n    methods: {\n      doComp: function(compKey) {\n        this.compKey = compKey;\n        let route    = this.komps[compKey].route;\n        this.pub( { route:route, compKey:compKey, source:'Toc' } ); },\n      doPrac: function(pracKey) {\n        this.pracKey = pracKey;\n        let route    = this.app()==='Muse' ? 'Prac' : pracKey;\n        this.pub( { route:route, pracKey:pracKey, source:'Toc' } ); },\n      doDisp: function(dispKey) {\n        this.dispKey = dispKey;\n        this.pub( { route:'Disp', dispKey:dispKey, source:'Toc' } ); },\n      pub: function(obj) {\n        this.nav().dirTabs = false;\n        this.nav().pub(obj); },\n      onNav:  function (obj) {\n        if( obj.source !== 'Toc' ) {\n          if( this.compKey !== obj.compKey ) { this.compKey = obj.compKey; }\n          if( this.pracKey !== obj.pracKey ) { this.pracKey = obj.pracKey; }\n          if( this.dispKey !== obj.dispKey ) { this.dispKey = obj.dispKey; } } },\n      styleComp: function( compKey ) {\n        return compKey===this.compKey ? { backgroundColor:'wheat', color:'black', borderRadius:'0 24px 24px 0' }\n                                      : { backgroundColor:'#333',  color:'wheat', borderRadius:'0 24px 24px 0' }; },\n      style: function( ikwObj ) {\n        return this.styleHsv(ikwObj); },\n      filterPracs: function(pracs,kompKey) {\n        let filt = {}\n        for( let key in pracs ) {\n          let prac = pracs[key];\n          if( prac.row !== 'Dim' || kompKey === 'Prin' ) {\n            filt[key] = prac; } }\n        return filt;\n      } },\n    \n    mounted: function () {\n      this.komps = this.kompsTocs();\n      for( let key in this.komps ) {\n        let komp = this.komps[key];\n        if( komp.ikw ) {\n          // console.log( 'Tocs.mounted()', komp.key, komp );\n          komp.pracs = this.filterPracs( this.pracs(komp.key), komp.key ); } }\n      this.subscribe( 'Nav', 'Tocs.vue', (obj) => {\n        this.onNav(obj); } ); }\n  }\n  \n   export default Tocs;\n   \n</script>\n\n<style lang=\"less\">\n  \n  @import '../../pub/css/themes/theme.less';\n  \n  .tocs { font-family:@theme-font-family;\n    ul { padding:0; margin:0; list-style:none; align-self:start; display:grid;\n      li  { background-color:@theme-back-tocs-comp; padding-left:0.25rem; align-self:start;   // Comp\n            border-radius:0 24px 24px 0; margin:0.2rem 0.2rem 0.2rem 0.2rem;\n         i   { margin-right: 0.4rem; }\n         div { color:@theme-color; text-decoration:none; }\n         ul { font-size:@theme-tocs-size*0.80; font-weight:bold; padding:0; margin:0;\n           li { border-radius:0 12px 12px 0; color:@theme-back; margin:0.2rem 0.2rem 0.2rem 0.2rem;            // Prac\n             i { margin-right: 0.3rem; }\n             a { color:@theme-high; }\n             ul { font-size:@theme-tocs-size*0.65; padding:0; margin:0 0 0 0.2rem;\n               li { border-radius:0 12px 12px 0; color:@theme-back; margin:0.2rem 0.2rem 0.2rem 0.2rem;       // Disp\n                 i { margin-right: 0.25rem; } }\n               li:hover { background-color:@theme-back!important; color:@theme-color-tocs-disp!important; } } } } } } }\n</style>\n"]}, media: undefined });

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

/**
 *
 * Author: Gianluca Guarini
 * Contact: gianluca.guarini@gmail.com
 * Website: http://www.gianlucaguarini.com/
 * Twitter: @gianlucaguarini
 *
 * Copyright (c) Gianluca Guarini
 *
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without
 * restriction, including without limitation the rights to use,
 * copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following
 * conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 **/

//

var script$1 = {

  data() { return { touch:null, elem:null, rviews:this.views() }; },
  
  methods:{
    show:function() {
      return this.$route.name===null } },
  
  mounted: function () {
    this.$nextTick( function() {  // Enable touch events inside all views
      // this.touch = new Touch();
      // this.elem  = this.$refs['View'];
      // this.touch.onNav( this.elem, this.nav() );
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
    { ref: "View" },
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
    components: { 'd-logo':Logo$1, 'd-tocs':Tocs$1, 'd-view':View } };

/* script */
const __vue_script__$4 = Dash;

/* template */
var __vue_render__$4 = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c(
    "div",
    { staticClass: "dash" },
    [
      _c("d-logo", { attrs: { id: "logo" } }),
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
    inject("data-v-0ac7bc58_0", { source: ".theme-prac {\n  background-color: #333;\n  border-radius: 36px;\n  width: 90%;\n  height: 90%;\n  font-size: 2rem;\n}\n.theme-comp-icon {\n  background-color: #333;\n  border-radius: 36px;\n  width: 90%;\n  height: 90%;\n}\n.theme-comp-dirs {\n  background-color: #333;\n  border-radius: 36px;\n  width: 90%;\n  height: 90%;\n  font-size: 1.3rem;\n}\n.theme-comp-conn {\n  background-color: #333;\n  border-radius: 36px;\n  width: 90%;\n  height: 90%;\n}\n.theme-comp-desc {\n  background-color: #333;\n}\n.theme-prac-dirs {\n  background-color: #333;\n  border-radius: 36px;\n  font-size: 1.3rem;\n}\n.theme-prac-conn {\n  background-color: #333;\n  border-radius: 36px;\n}\n.theme-prac-desc {\n  background-color: #333;\n}\n.theme-disp-desc {\n  background-color: #333;\n}\n.theme-logo {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-menu {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-find {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-tocs {\n  background-color: black;\n  font-size: 2rem;\n}\n.theme-view {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-side {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-pref {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-foot {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-trak {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.dash {\n  font-family: Roboto, sans-serif;\n  position: absolute;\n  left: 0;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  display: grid;\n  overflow: hidden;\n  grid-template-columns: 10fr 90fr;\n  grid-template-rows: 10fr 90fr;\n  grid-template-areas: \"logo view\" \"tocs view\";\n}\n.dash #logo {\n  grid-area: logo;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n  background-color: black;\n  font-size: 1.5rem;\n}\n.dash #tocs {\n  grid-area: tocs;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n  background-color: black;\n  font-size: 2rem;\n  padding-bottom: 1rem;\n}\n.dash #view {\n  grid-area: view;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n  background-color: black;\n  font-size: 1.5rem;\n  padding: 1rem;\n}\n", map: {"version":3,"sources":["Dash.vue","/Users/ax/Documents/prj/aug/vue/dash/Dash.vue"],"names":[],"mappings":"AAAA;EACE,sBAAsB;EACtB,mBAAmB;EACnB,UAAU;EACV,WAAW;EACX,eAAe;AACjB;AACA;EACE,sBAAsB;EACtB,mBAAmB;EACnB,UAAU;EACV,WAAW;AACb;AACA;EACE,sBAAsB;EACtB,mBAAmB;EACnB,UAAU;EACV,WAAW;EACX,iBAAiB;AACnB;AACA;EACE,sBAAsB;EACtB,mBAAmB;EACnB,UAAU;EACV,WAAW;ACCb;ADCA;ECCA,sBAAA;AACA;AACA;EACA,sBAAA;EACA,mBAAA;EACA,iBAAA;AACA;ADCA;ECCA,sBAAA;EACA,mBAAA;AACA;ADCA;EACE,sBAAsB;AACxB;AACA;EACE,sBAAsB;AACxB;AACA;EACE,uBAAuB;EACvB,iBAAiB;AACnB;AACA;EACE,uBAAuB;EACvB,iBAAiB;AACnB;AACA;EACE,uBAAuB;EACvB,iBAAiB;AACnB;AACA;EACE,uBAAuB;EACvB,eAAe;AACjB;AACA;EACE,uBAAuB;EACvB,iBAAiB;AACnB;AACA;EACE,uBAAuB;EACvB,iBAAiB;AACnB;AACA;EACE,uBAAuB;EACvB,iBAAiB;AACnB;AACA;EACE,uBAAuB;EACvB,iBAAiB;AACnB;AACA;EACE,uBAAuB;EACvB,iBAAiB;AACnB;AACA;EACE,+BAA+B;EAC/B,kBAAkB;EAClB,OAAO;EACP,MAAM;EACN,QAAQ;EACR,SAAS;EACT,aAAa;EACb,gBAAgB;EAChB,gCAAgC;EAChC,6BAA6B;EAC7B,4CAA4C;AAC9C;AACA;EACE,eAAe;EACf,qBAAqB;EACrB,mBAAmB;EACnB,aAAa;EACb,uBAAuB;EACvB,iBAAiB;AACnB;AACA;EACE,eAAe;EACf,qBAAqB;EACrB,mBAAmB;EACnB,aAAa;EACb,uBAAuB;EACvB,eAAe;EACf,oBAAoB;AACtB;AACA;EACE,eAAe;EACf,qBAAqB;EACrB,mBAAmB;EACnB,aAAa;EACb,uBAAuB;EACvB,iBAAiB;EACjB,aAAa;AACf","file":"Dash.vue","sourcesContent":[".theme-prac {\n  background-color: #333;\n  border-radius: 36px;\n  width: 90%;\n  height: 90%;\n  font-size: 2rem;\n}\n.theme-comp-icon {\n  background-color: #333;\n  border-radius: 36px;\n  width: 90%;\n  height: 90%;\n}\n.theme-comp-dirs {\n  background-color: #333;\n  border-radius: 36px;\n  width: 90%;\n  height: 90%;\n  font-size: 1.3rem;\n}\n.theme-comp-conn {\n  background-color: #333;\n  border-radius: 36px;\n  width: 90%;\n  height: 90%;\n}\n.theme-comp-desc {\n  background-color: #333;\n}\n.theme-prac-dirs {\n  background-color: #333;\n  border-radius: 36px;\n  font-size: 1.3rem;\n}\n.theme-prac-conn {\n  background-color: #333;\n  border-radius: 36px;\n}\n.theme-prac-desc {\n  background-color: #333;\n}\n.theme-disp-desc {\n  background-color: #333;\n}\n.theme-logo {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-menu {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-find {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-tocs {\n  background-color: black;\n  font-size: 2rem;\n}\n.theme-view {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-side {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-pref {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-foot {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-trak {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.dash {\n  font-family: Roboto, sans-serif;\n  position: absolute;\n  left: 0;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  display: grid;\n  overflow: hidden;\n  grid-template-columns: 10fr 90fr;\n  grid-template-rows: 10fr 90fr;\n  grid-template-areas: \"logo view\" \"tocs view\";\n}\n.dash #logo {\n  grid-area: logo;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n  background-color: black;\n  font-size: 1.5rem;\n}\n.dash #tocs {\n  grid-area: tocs;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n  background-color: black;\n  font-size: 2rem;\n  padding-bottom: 1rem;\n}\n.dash #view {\n  grid-area: view;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n  background-color: black;\n  font-size: 1.5rem;\n  padding: 1rem;\n}\n","\n<template>\n  <div class=\"dash\">\n    <d-logo id=\"logo\"></d-logo>\n    <d-tocs id=\"tocs\"></d-tocs>\n    <d-view id=\"view\"></d-view>\n  </div>\n</template>\n\n<script type=\"module\">\n  \n  import Logo from '../dash/Logo.vue';\n  import Tocs from '../dash/Tocs.vue';\n  import View from '../dash/View.vue';\n  \n  let Dash = {\n      name: 'dash',\n      components: { 'd-logo':Logo, 'd-tocs':Tocs, 'd-view':View } };\n  \n  export default Dash;\n  \n</script>\n\n<style lang=\"less\">\n  \n  @import '../../pub/css/themes/theme.less';\n\n  .dash { font-family:@theme-font-family;\n     position:absolute; left:0; top:0; right:0; bottom:0; display:grid; overflow:hidden;\n     grid-template-columns: 10fr 90fr;\n     grid-template-rows:    10fr 90fr;\n     grid-template-areas:\n       \"logo view\"\n       \"tocs view\";\n  \n  #logo { grid-area:logo; justify-self:stretch; align-self:stretch; display:grid; .theme-logo; }\n  #tocs { grid-area:tocs; justify-self:stretch; align-self:stretch; display:grid; .theme-tocs; padding-bottom:1rem; }\n  #view { grid-area:view; justify-self:stretch; align-self:stretch; display:grid; .theme-view; padding:       1rem; } }\n  \n</style>\n\n"]}, media: undefined });

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
    { ref: "Math", staticClass: "math" },
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
    inject("data-v-ebecbed0_0", { source: ".theme-prac {\n  background-color: #333;\n  border-radius: 36px;\n  width: 90%;\n  height: 90%;\n  font-size: 2rem;\n}\n.theme-comp-icon {\n  background-color: #333;\n  border-radius: 36px;\n  width: 90%;\n  height: 90%;\n}\n.theme-comp-dirs {\n  background-color: #333;\n  border-radius: 36px;\n  width: 90%;\n  height: 90%;\n  font-size: 1.3rem;\n}\n.theme-comp-conn {\n  background-color: #333;\n  border-radius: 36px;\n  width: 90%;\n  height: 90%;\n}\n.theme-comp-desc {\n  background-color: #333;\n}\n.theme-prac-dirs {\n  background-color: #333;\n  border-radius: 36px;\n  font-size: 1.3rem;\n}\n.theme-prac-conn {\n  background-color: #333;\n  border-radius: 36px;\n}\n.theme-prac-desc {\n  background-color: #333;\n}\n.theme-disp-desc {\n  background-color: #333;\n}\n.theme-logo {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-menu {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-find {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-tocs {\n  background-color: black;\n  font-size: 2rem;\n}\n.theme-view {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-side {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-pref {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-foot {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-trak {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.math {\n  position: relative;\n  left: 0;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  background-color: black;\n  display: grid;\n}\n.math h1 {\n  justify-self: center;\n  align-self: center;\n  text-align: center;\n  color: wheat;\n  font-size: 2rem;\n}\n", map: {"version":3,"sources":["Math.vue","/Users/ax/Documents/prj/aug/vue/math/Math.vue"],"names":[],"mappings":"AAAA;EACE,sBAAsB;EACtB,mBAAmB;EACnB,UAAU;EACV,WAAW;EACX,eAAe;AACjB;AACA;EACE,sBAAsB;EACtB,mBAAmB;EACnB,UAAU;EACV,WAAW;AACb;AACA;EACE,sBAAsB;EACtB,mBAAmB;EACnB,UAAU;EACV,WAAW;EACX,iBAAiB;AACnB;AACA;EACE,sBAAsB;EACtB,mBAAmB;EACnB,UAAU;EACV,WAAW;AACb;AACA;EACE,sBAAsB;AACxB;ACCA;EDCE,sBAAsB;ECCxB,mBAAA;EACA,iBAAA;ADCA;AACA;EACE,sBAAsB;EACtB,mBAAmB;AACrB;AACA;EACE,sBAAsB;AACxB;AACA;EACE,sBAAsB;AACxB;AACA;EACE,uBAAuB;EACvB,iBAAiB;AACnB;AACA;EACE,uBAAuB;EACvB,iBAAiB;AACnB;AACA;EACE,uBAAuB;EACvB,iBAAiB;AACnB;AACA;EACE,uBAAuB;EACvB,eAAe;AACjB;AACA;EACE,uBAAuB;EACvB,iBAAiB;AACnB;AACA;EACE,uBAAuB;EACvB,iBAAiB;AACnB;AACA;EACE,uBAAuB;EACvB,iBAAiB;AACnB;AACA;EACE,uBAAuB;EACvB,iBAAiB;AACnB;AACA;EACE,uBAAuB;EACvB,iBAAiB;AACnB;AACA;EACE,kBAAkB;EAClB,OAAO;EACP,MAAM;EACN,QAAQ;EACR,SAAS;EACT,uBAAuB;EACvB,aAAa;AACf;AACA;EACE,oBAAoB;EACpB,kBAAkB;EAClB,kBAAkB;EAClB,YAAY;EACZ,eAAe;AACjB","file":"Math.vue","sourcesContent":[".theme-prac {\n  background-color: #333;\n  border-radius: 36px;\n  width: 90%;\n  height: 90%;\n  font-size: 2rem;\n}\n.theme-comp-icon {\n  background-color: #333;\n  border-radius: 36px;\n  width: 90%;\n  height: 90%;\n}\n.theme-comp-dirs {\n  background-color: #333;\n  border-radius: 36px;\n  width: 90%;\n  height: 90%;\n  font-size: 1.3rem;\n}\n.theme-comp-conn {\n  background-color: #333;\n  border-radius: 36px;\n  width: 90%;\n  height: 90%;\n}\n.theme-comp-desc {\n  background-color: #333;\n}\n.theme-prac-dirs {\n  background-color: #333;\n  border-radius: 36px;\n  font-size: 1.3rem;\n}\n.theme-prac-conn {\n  background-color: #333;\n  border-radius: 36px;\n}\n.theme-prac-desc {\n  background-color: #333;\n}\n.theme-disp-desc {\n  background-color: #333;\n}\n.theme-logo {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-menu {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-find {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-tocs {\n  background-color: black;\n  font-size: 2rem;\n}\n.theme-view {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-side {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-pref {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-foot {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-trak {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.math {\n  position: relative;\n  left: 0;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  background-color: black;\n  display: grid;\n}\n.math h1 {\n  justify-self: center;\n  align-self: center;\n  text-align: center;\n  color: wheat;\n  font-size: 2rem;\n}\n","\n<template>\n  <div class=\"math\" ref=\"Math\">\n    <h1 v-if=\"route==='Math'\">Mathematics</h1>\n    <template v-for=\"math in maths\">\n      <router-view :name=\"route+math.key\"></router-view>\n    </template>\n  </div>\n</template>\n\n<script type=\"module\">\n\n  let Math = {\n\n    data() { return { route:'Math',\n      maths:[\n        { title:'MathML', key:'ML' },\n        { title:'MathEQ', key:'EQ' } ] } },\n\n    mounted: function () {} \n\n  }\n\n  export default Math;\n\n</script>\n\n<style lang=\"less\">\n  \n  @import '../../pub/css/themes/theme.less';\n  \n  .math {   position:relative; left:0; top:0; right:0; bottom:0; background-color:@theme-back; display:grid;\n    h1    { justify-self:center; align-self:center; text-align:center; color:@theme-color; font-size:@theme-h1-size; } }\n\n</style>"]}, media: undefined });

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
    { ref: "Geom", staticClass: "geom" },
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
    inject("data-v-1ff515c3_0", { source: ".theme-prac {\n  background-color: #333;\n  border-radius: 36px;\n  width: 90%;\n  height: 90%;\n  font-size: 2rem;\n}\n.theme-comp-icon {\n  background-color: #333;\n  border-radius: 36px;\n  width: 90%;\n  height: 90%;\n}\n.theme-comp-dirs {\n  background-color: #333;\n  border-radius: 36px;\n  width: 90%;\n  height: 90%;\n  font-size: 1.3rem;\n}\n.theme-comp-conn {\n  background-color: #333;\n  border-radius: 36px;\n  width: 90%;\n  height: 90%;\n}\n.theme-comp-desc {\n  background-color: #333;\n}\n.theme-prac-dirs {\n  background-color: #333;\n  border-radius: 36px;\n  font-size: 1.3rem;\n}\n.theme-prac-conn {\n  background-color: #333;\n  border-radius: 36px;\n}\n.theme-prac-desc {\n  background-color: #333;\n}\n.theme-disp-desc {\n  background-color: #333;\n}\n.theme-logo {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-menu {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-find {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-tocs {\n  background-color: black;\n  font-size: 2rem;\n}\n.theme-view {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-side {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-pref {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-foot {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-trak {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.geom {\n  position: relative;\n  left: 0;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  background-color: black;\n  display: grid;\n}\n.geom h1 {\n  justify-self: center;\n  align-self: center;\n  text-align: center;\n  color: wheat;\n  font-size: 2rem;\n}\n", map: {"version":3,"sources":["Geom.vue","/Users/ax/Documents/prj/aug/vue/geom/Geom.vue"],"names":[],"mappings":"AAAA;EACE,sBAAsB;EACtB,mBAAmB;EACnB,UAAU;EACV,WAAW;EACX,eAAe;AACjB;AACA;EACE,sBAAsB;EACtB,mBAAmB;EACnB,UAAU;EACV,WAAW;AACb;AACA;EACE,sBAAsB;EACtB,mBAAmB;EACnB,UAAU;EACV,WAAW;EACX,iBAAiB;AACnB;AACA;EACE,sBAAsB;EACtB,mBAAmB;EACnB,UAAU;EACV,WAAW;AACb;AACA;EACE,sBAAsB;AACxB;AACA;EACE,sBAAsB;EACtB,mBAAmB;ECCrB,iBAAA;ADCA;ACCA;EACA,sBAAA;EDCE,mBAAmB;AACrB;AACA;EACE,sBAAsB;AACxB;AACA;EACE,sBAAsB;AACxB;AACA;EACE,uBAAuB;EACvB,iBAAiB;AACnB;AACA;EACE,uBAAuB;EACvB,iBAAiB;AACnB;AACA;EACE,uBAAuB;EACvB,iBAAiB;AACnB;AACA;EACE,uBAAuB;EACvB,eAAe;AACjB;AACA;EACE,uBAAuB;EACvB,iBAAiB;AACnB;AACA;EACE,uBAAuB;EACvB,iBAAiB;AACnB;AACA;EACE,uBAAuB;EACvB,iBAAiB;AACnB;AACA;EACE,uBAAuB;EACvB,iBAAiB;AACnB;AACA;EACE,uBAAuB;EACvB,iBAAiB;AACnB;AACA;EACE,kBAAkB;EAClB,OAAO;EACP,MAAM;EACN,QAAQ;EACR,SAAS;EACT,uBAAuB;EACvB,aAAa;AACf;AACA;EACE,oBAAoB;EACpB,kBAAkB;EAClB,kBAAkB;EAClB,YAAY;EACZ,eAAe;AACjB","file":"Geom.vue","sourcesContent":[".theme-prac {\n  background-color: #333;\n  border-radius: 36px;\n  width: 90%;\n  height: 90%;\n  font-size: 2rem;\n}\n.theme-comp-icon {\n  background-color: #333;\n  border-radius: 36px;\n  width: 90%;\n  height: 90%;\n}\n.theme-comp-dirs {\n  background-color: #333;\n  border-radius: 36px;\n  width: 90%;\n  height: 90%;\n  font-size: 1.3rem;\n}\n.theme-comp-conn {\n  background-color: #333;\n  border-radius: 36px;\n  width: 90%;\n  height: 90%;\n}\n.theme-comp-desc {\n  background-color: #333;\n}\n.theme-prac-dirs {\n  background-color: #333;\n  border-radius: 36px;\n  font-size: 1.3rem;\n}\n.theme-prac-conn {\n  background-color: #333;\n  border-radius: 36px;\n}\n.theme-prac-desc {\n  background-color: #333;\n}\n.theme-disp-desc {\n  background-color: #333;\n}\n.theme-logo {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-menu {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-find {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-tocs {\n  background-color: black;\n  font-size: 2rem;\n}\n.theme-view {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-side {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-pref {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-foot {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-trak {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.geom {\n  position: relative;\n  left: 0;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  background-color: black;\n  display: grid;\n}\n.geom h1 {\n  justify-self: center;\n  align-self: center;\n  text-align: center;\n  color: wheat;\n  font-size: 2rem;\n}\n","\n\n\n<template>\n  <div class=\"geom\" ref=\"Geom\">\n    <h1 v-if=\"comp==='Geom'\">Geometric Algebra</h1>\n    <template v-for=\"geom in geoms\">\n      <router-view :name=\"comp+geom.key\"></router-view>\n    </template>\n  </div>\n</template>\n\n<script type=\"module\">\n  \n  let Geom = {\n\n    data() { return { comp:'Geom',\n      geoms:[\n        { title:'Geom2D', key:'2D' },\n        { title:'Geom3D', key:'3D' },\n        { title:'Geom4D', key:'4D' } ] } },\n\n    mounted: function () {}\n\n  }\n\n  export default Geom;\n\n</script>\n\n<style lang=\"less\">\n  \n  @import '../../pub/css/themes/theme.less';\n  \n  .geom {   position:relative; left:0; top:0; right:0; bottom:0; background-color:@theme-back; display:grid;\n    h1    { justify-self:center; align-self:center; text-align:center; color:@theme-color; font-size:@theme-h1-size; } }\n  \n</style>;"]}, media: undefined });

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

  props: { route:String, pages:Object },
  
  data() { return { tabsKey:'None', pageKey:'None', pageObj:null } },
  
  methods: {
    onPage: function (tabsKey) {
      if( tabsKey !== 'None') {
        this.pageKey = tabsKey; } },
    doPage: function (pageKey) {
      this.nav().dirTabs = this.app() !== 'Muse';
      if( pageKey !== 'None') {
        this.onPage( pageKey );
        this.nav().setPageKey( this.route, pageKey );
        this.nav().pub( this.pubObj(pageKey) ); } },
    pubObj: function (pageKey) {
      let obj   = {};
          obj.route   = this.route;
          obj.pageKey = pageKey;
      let poute = this.pages[pageKey].route;
      if( this.isDef(poute) ) {
          obj.poute = poute; }
      return obj; },
    classTab: function (pageKey) {
      return this.pageKey===pageKey ? 'tab-active' : 'tab'; } },

  beforeMount: function () {  // We want to set the routes pages asap
    this.tabsKey = this.nav().setPages( this.route, this.pages ); },

  mounted: function() {
    this.onPage(this.tabsKey);
    this.subscribe(  "Nav", 'Tabs.vue.'+this.route, (obj) => {
      if( obj.source !== 'Tabs' && obj.route === this.route ) {
        this.onPage( this.nav().getPageKey(this.route) ); } } ); }
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
    { staticClass: "tabs" },
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
    inject("data-v-85274166_0", { source: ".theme-prac {\n  background-color: #333;\n  border-radius: 36px;\n  width: 90%;\n  height: 90%;\n  font-size: 2rem;\n}\n.theme-comp-icon {\n  background-color: #333;\n  border-radius: 36px;\n  width: 90%;\n  height: 90%;\n}\n.theme-comp-dirs {\n  background-color: #333;\n  border-radius: 36px;\n  width: 90%;\n  height: 90%;\n  font-size: 1.3rem;\n}\n.theme-comp-conn {\n  background-color: #333;\n  border-radius: 36px;\n  width: 90%;\n  height: 90%;\n}\n.theme-comp-desc {\n  background-color: #333;\n}\n.theme-prac-dirs {\n  background-color: #333;\n  border-radius: 36px;\n  font-size: 1.3rem;\n}\n.theme-prac-conn {\n  background-color: #333;\n  border-radius: 36px;\n}\n.theme-prac-desc {\n  background-color: #333;\n}\n.theme-disp-desc {\n  background-color: #333;\n}\n.theme-logo {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-menu {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-find {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-tocs {\n  background-color: black;\n  font-size: 2rem;\n}\n.theme-view {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-side {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-pref {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-foot {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-trak {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.tabs {\n  position: absolute;\n  left: 0;\n  top: 0;\n  width: 100%;\n  height: 5%;\n  background-color: black;\n  font-size: 1.5rem;\n}\n.tabs .tab {\n  display: inline-block;\n  margin-left: 2rem;\n  padding: 0.2rem 0.3rem 0.1rem 0.3rem;\n  border-radius: 12px 12px 0 0;\n  border-left: wheat solid thin;\n  border-top: wheat solid thin;\n  border-right: wheat solid thin;\n  background-color: black;\n  color: wheat;\n}\n.tabs .tab:hover {\n  background-color: wheat;\n  color: black;\n}\n.tabs .tab-active {\n  display: inline-block;\n  margin-left: 2rem;\n  padding: 0.2rem 0.3rem 0.1rem 0.3rem;\n  border-radius: 12px 12px 0 0;\n  border-left: wheat solid thin;\n  border-top: wheat solid thin;\n  border-right: wheat solid thin;\n  background-color: black;\n  color: wheat;\n  background-color: wheat;\n  color: black;\n}\n", map: {"version":3,"sources":["Tabs.vue","/Users/ax/Documents/prj/aug/vue/elem/Tabs.vue"],"names":[],"mappings":"AAAA;EACE,sBAAsB;EACtB,mBAAmB;EACnB,UAAU;EACV,WAAW;EACX,eAAe;AACjB;AACA;EACE,sBAAsB;EACtB,mBAAmB;EACnB,UAAU;EACV,WAAW;AACb;AACA;EACE,sBAAsB;EACtB,mBAAmB;EACnB,UAAU;EACV,WAAW;EACX,iBAAiB;AACnB;AACA;EACE,sBAAsB;EACtB,mBAAmB;EACnB,UAAU;EACV,WAAW;AACb;AACA;EACE,sBAAsB;AACxB;AACA;EACE,sBAAsB;EACtB,mBAAmB;EACnB,iBAAiB;AACnB;AACA;EACE,sBAAsB;EACtB,mBAAmB;AACrB;AACA;EACE,sBAAsB;AACxB;AACA;EACE,sBAAsB;AACxB;AACA;EACE,uBAAuB;EACvB,iBAAiB;AACnB;AACA;EACE,uBAAuB;EACvB,iBAAiB;AACnB;ACCA;EDCE,uBAAuB;ECCzB,iBAAA;AACA;AACA;EACA,uBAAA;EACA,eAAA;AACA;AACA;EACA,uBAAA;EDCE,iBAAiB;AACnB;AACA;EACE,uBAAuB;EACvB,iBAAiB;AACnB;AACA;EACE,uBAAuB;EACvB,iBAAiB;AACnB;AACA;EACE,uBAAuB;EACvB,iBAAiB;AACnB;AACA;EACE,uBAAuB;EACvB,iBAAiB;AACnB;AACA;EACE,kBAAkB;EAClB,OAAO;EACP,MAAM;EACN,WAAW;EACX,UAAU;EACV,uBAAuB;EACvB,iBAAiB;AACnB;AACA;EACE,qBAAqB;EACrB,iBAAiB;EACjB,oCAAoC;EACpC,4BAA4B;EAC5B,6BAA6B;EAC7B,4BAA4B;EAC5B,8BAA8B;EAC9B,uBAAuB;EACvB,YAAY;AACd;AACA;EACE,uBAAuB;EACvB,YAAY;AACd;AACA;EACE,qBAAqB;EACrB,iBAAiB;EACjB,oCAAoC;EACpC,4BAA4B;EAC5B,6BAA6B;EAC7B,4BAA4B;EAC5B,8BAA8B;EAC9B,uBAAuB;EACvB,YAAY;EACZ,uBAAuB;EACvB,YAAY;AACd","file":"Tabs.vue","sourcesContent":[".theme-prac {\n  background-color: #333;\n  border-radius: 36px;\n  width: 90%;\n  height: 90%;\n  font-size: 2rem;\n}\n.theme-comp-icon {\n  background-color: #333;\n  border-radius: 36px;\n  width: 90%;\n  height: 90%;\n}\n.theme-comp-dirs {\n  background-color: #333;\n  border-radius: 36px;\n  width: 90%;\n  height: 90%;\n  font-size: 1.3rem;\n}\n.theme-comp-conn {\n  background-color: #333;\n  border-radius: 36px;\n  width: 90%;\n  height: 90%;\n}\n.theme-comp-desc {\n  background-color: #333;\n}\n.theme-prac-dirs {\n  background-color: #333;\n  border-radius: 36px;\n  font-size: 1.3rem;\n}\n.theme-prac-conn {\n  background-color: #333;\n  border-radius: 36px;\n}\n.theme-prac-desc {\n  background-color: #333;\n}\n.theme-disp-desc {\n  background-color: #333;\n}\n.theme-logo {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-menu {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-find {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-tocs {\n  background-color: black;\n  font-size: 2rem;\n}\n.theme-view {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-side {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-pref {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-foot {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-trak {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.tabs {\n  position: absolute;\n  left: 0;\n  top: 0;\n  width: 100%;\n  height: 5%;\n  background-color: black;\n  font-size: 1.5rem;\n}\n.tabs .tab {\n  display: inline-block;\n  margin-left: 2rem;\n  padding: 0.2rem 0.3rem 0.1rem 0.3rem;\n  border-radius: 12px 12px 0 0;\n  border-left: wheat solid thin;\n  border-top: wheat solid thin;\n  border-right: wheat solid thin;\n  background-color: black;\n  color: wheat;\n}\n.tabs .tab:hover {\n  background-color: wheat;\n  color: black;\n}\n.tabs .tab-active {\n  display: inline-block;\n  margin-left: 2rem;\n  padding: 0.2rem 0.3rem 0.1rem 0.3rem;\n  border-radius: 12px 12px 0 0;\n  border-left: wheat solid thin;\n  border-top: wheat solid thin;\n  border-right: wheat solid thin;\n  background-color: black;\n  color: wheat;\n  background-color: wheat;\n  color: black;\n}\n","\n<template>\n  <div class=\"tabs\">\n    <template v-for=\"pageObj in pages\">\n      <div :class=\"classTab(pageObj.key)\" @click=\"doPage(pageObj.key)\">{{pageObj.title}}</div>\n    </template>\n  </div>\n</template>\n\n<script type=\"module\">\n\n  export default {\n\n    props: { route:String, pages:Object },\n    \n    data() { return { tabsKey:'None', pageKey:'None', pageObj:null } },\n    \n    methods: {\n      onPage: function (tabsKey) {\n        if( tabsKey !== 'None') {\n          this.pageKey = tabsKey; } },\n      doPage: function (pageKey) {\n        this.nav().dirTabs = this.app() !== 'Muse';\n        if( pageKey !== 'None') {\n          this.onPage( pageKey );\n          this.nav().setPageKey( this.route, pageKey );\n          this.nav().pub( this.pubObj(pageKey) ); } },\n      pubObj: function (pageKey) {\n        let obj   = {}\n            obj.route   = this.route;\n            obj.pageKey = pageKey;\n        let poute = this.pages[pageKey].route;\n        if( this.isDef(poute) ) {\n            obj.poute = poute; }\n        return obj; },\n      classTab: function (pageKey) {\n        return this.pageKey===pageKey ? 'tab-active' : 'tab'; } },\n\n    beforeMount: function () {  // We want to set the routes pages asap\n      this.tabsKey = this.nav().setPages( this.route, this.pages ); },\n\n    mounted: function() {\n      this.onPage(this.tabsKey);\n      this.subscribe(  \"Nav\", 'Tabs.vue.'+this.route, (obj) => {\n        if( obj.source !== 'Tabs' && obj.route === this.route ) {\n          this.onPage( this.nav().getPageKey(this.route) ); } } ); }\n    }\n  \n</script>\n\n<style lang=\"less\">\n  \n  @import '../../pub/css/themes/theme.less';\n  \n  .tabs { position:absolute; left:0; top:0; width:100%; height:5%;\n          background-color:@theme-back; font-size:@theme-tab-size;\n    .tab { display:inline-block; margin-left:2.0rem; padding:0.2rem 0.3rem 0.1rem 0.3rem;\n      border-radius:12px 12px 0 0; border-left: @theme-color solid thin;\n      border-top:@theme-color solid thin; border-right:@theme-color solid thin;\n                  background-color:@theme-back;  color:@theme-color;}\n    .tab:hover  {         background-color:@theme-color; color:@theme-back; }\n    .tab-active { .tab(); background-color:@theme-color; color:@theme-back; } }\n  \n</style>"]}, media: undefined });

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
    { staticClass: "note" },
    [
      _c("n-tabs", { attrs: { route: "Note", pages: _vm.pages } }),
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
    inject("data-v-3cbafaf1_0", { source: ".theme-prac {\n  background-color: #333;\n  border-radius: 36px;\n  width: 90%;\n  height: 90%;\n  font-size: 2rem;\n}\n.theme-comp-icon {\n  background-color: #333;\n  border-radius: 36px;\n  width: 90%;\n  height: 90%;\n}\n.theme-comp-dirs {\n  background-color: #333;\n  border-radius: 36px;\n  width: 90%;\n  height: 90%;\n  font-size: 1.3rem;\n}\n.theme-comp-conn {\n  background-color: #333;\n  border-radius: 36px;\n  width: 90%;\n  height: 90%;\n}\n.theme-comp-desc {\n  background-color: #333;\n}\n.theme-prac-dirs {\n  background-color: #333;\n  border-radius: 36px;\n  font-size: 1.3rem;\n}\n.theme-prac-conn {\n  background-color: #333;\n  border-radius: 36px;\n}\n.theme-prac-desc {\n  background-color: #333;\n}\n.theme-disp-desc {\n  background-color: #333;\n}\n.theme-logo {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-menu {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-find {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-tocs {\n  background-color: black;\n  font-size: 2rem;\n}\n.theme-view {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-side {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-pref {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-foot {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-trak {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.note {\n  position: relative;\n  left: 0;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  background-color: black;\n  display: grid;\n}\n.note h1 {\n  justify-self: center;\n  align-self: center;\n  text-align: center;\n  color: wheat;\n  font-size: 2rem;\n}\n", map: {"version":3,"sources":["Note.vue","/Users/ax/Documents/prj/aug/vue/note/Note.vue"],"names":[],"mappings":"AAAA;EACE,sBAAsB;EACtB,mBAAmB;EACnB,UAAU;EACV,WAAW;EACX,eAAe;AACjB;AACA;EACE,sBAAsB;EACtB,mBAAmB;EACnB,UAAU;EACV,WAAW;AACb;AACA;EACE,sBAAsB;EACtB,mBAAmB;EACnB,UAAU;EACV,WAAW;EACX,iBAAiB;AACnB;AACA;EACE,sBAAsB;EACtB,mBAAmB;EACnB,UAAU;EACV,WAAW;AACb;AACA;EACE,sBAAsB;AACxB;AACA;EACE,sBAAsB;EACtB,mBAAmB;EACnB,iBAAiB;AACnB;AACA;EACE,sBAAsB;EACtB,mBAAmB;AACrB;AACA;ECCA,sBAAA;AACA;AACA;EDCE,sBAAsB;AACxB;AACA;EACE,uBAAuB;EACvB,iBAAiB;AACnB;AACA;EACE,uBAAuB;EACvB,iBAAiB;AACnB;AACA;EACE,uBAAuB;EACvB,iBAAiB;AACnB;AACA;EACE,uBAAuB;EACvB,eAAe;AACjB;AACA;EACE,uBAAuB;EACvB,iBAAiB;AACnB;AACA;EACE,uBAAuB;EACvB,iBAAiB;AACnB;AACA;EACE,uBAAuB;EACvB,iBAAiB;AACnB;AACA;EACE,uBAAuB;EACvB,iBAAiB;AACnB;AACA;EACE,uBAAuB;EACvB,iBAAiB;AACnB;AACA;EACE,kBAAkB;EAClB,OAAO;EACP,MAAM;EACN,QAAQ;EACR,SAAS;EACT,uBAAuB;EACvB,aAAa;AACf;AACA;EACE,oBAAoB;EACpB,kBAAkB;EAClB,kBAAkB;EAClB,YAAY;EACZ,eAAe;AACjB","file":"Note.vue","sourcesContent":[".theme-prac {\n  background-color: #333;\n  border-radius: 36px;\n  width: 90%;\n  height: 90%;\n  font-size: 2rem;\n}\n.theme-comp-icon {\n  background-color: #333;\n  border-radius: 36px;\n  width: 90%;\n  height: 90%;\n}\n.theme-comp-dirs {\n  background-color: #333;\n  border-radius: 36px;\n  width: 90%;\n  height: 90%;\n  font-size: 1.3rem;\n}\n.theme-comp-conn {\n  background-color: #333;\n  border-radius: 36px;\n  width: 90%;\n  height: 90%;\n}\n.theme-comp-desc {\n  background-color: #333;\n}\n.theme-prac-dirs {\n  background-color: #333;\n  border-radius: 36px;\n  font-size: 1.3rem;\n}\n.theme-prac-conn {\n  background-color: #333;\n  border-radius: 36px;\n}\n.theme-prac-desc {\n  background-color: #333;\n}\n.theme-disp-desc {\n  background-color: #333;\n}\n.theme-logo {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-menu {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-find {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-tocs {\n  background-color: black;\n  font-size: 2rem;\n}\n.theme-view {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-side {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-pref {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-foot {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-trak {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.note {\n  position: relative;\n  left: 0;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  background-color: black;\n  display: grid;\n}\n.note h1 {\n  justify-self: center;\n  align-self: center;\n  text-align: center;\n  color: wheat;\n  font-size: 2rem;\n}\n","\n\n<template>\n  <div class=\"note\">\n    <n-tabs route=\"Note\" :pages=\"pages\"></n-tabs>  <!-- init=\"Stand\" -->\n    <h1 v-if=\"myRoute()\">Notebooks</h1>\n    <template v-for=\"page in pages\">\n      <router-view :name=\"page.key\"></router-view>\n    </template>\n  </div>\n</template>\n\n<script type=\"module\">\n\n  import Tabs  from '../elem/Tabs.vue';\n  \n  let Note = {\n    \n    components:{ 'n-tabs':Tabs },\n\n    data() {\n      return { route:'Note', tab:'Stand', pages:{\n          Stand: { title:'Stand', key:'Stand', show:false, route:'Stand' },\n          Embed: { title:'Embed', key:'Embed', show:false, route:'Embed' },\n          Maths: { title:'Maths', key:'Maths', show:false, route:'Maths' },\n          Ganja: { title:'Ganja', key:'Ganja', show:false, route:'Ganja' },\n        } } },\n    \n    methods: {\n      myRoute: function() {\n        this.isRoute('Note'); } }\n    \n  }\n  \n  export default Note;\n  \n</script>\n\n<style lang=\"less\">\n  @import '../../pub/css/themes/theme.less';\n  .note { position:relative; left:0; top:0; right:0; bottom:0; background-color:@theme-back; display:grid;\n    h1    { justify-self:center; align-self:center; text-align:center; color:@theme-color; font-size:@theme-h1-size; } }\n</style>"]}, media: undefined });

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
    inject("data-v-e434ea98_0", { source: ".theme-prac {\n  background-color: #333;\n  border-radius: 36px;\n  width: 90%;\n  height: 90%;\n  font-size: 2rem;\n}\n.theme-comp-icon {\n  background-color: #333;\n  border-radius: 36px;\n  width: 90%;\n  height: 90%;\n}\n.theme-comp-dirs {\n  background-color: #333;\n  border-radius: 36px;\n  width: 90%;\n  height: 90%;\n  font-size: 1.3rem;\n}\n.theme-comp-conn {\n  background-color: #333;\n  border-radius: 36px;\n  width: 90%;\n  height: 90%;\n}\n.theme-comp-desc {\n  background-color: #333;\n}\n.theme-prac-dirs {\n  background-color: #333;\n  border-radius: 36px;\n  font-size: 1.3rem;\n}\n.theme-prac-conn {\n  background-color: #333;\n  border-radius: 36px;\n}\n.theme-prac-desc {\n  background-color: #333;\n}\n.theme-disp-desc {\n  background-color: #333;\n}\n.theme-logo {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-menu {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-find {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-tocs {\n  background-color: black;\n  font-size: 2rem;\n}\n.theme-view {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-side {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-pref {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-foot {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-trak {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.data {\n  position: relative;\n  left: 0;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  background-color: black;\n  display: grid;\n}\n.data h1 {\n  justify-self: center;\n  align-self: center;\n  text-align: center;\n  color: wheat;\n  font-size: 2rem;\n}\n", map: {"version":3,"sources":["Data.vue","/Users/ax/Documents/prj/aug/vue/data/Data.vue"],"names":[],"mappings":"AAAA;EACE,sBAAsB;EACtB,mBAAmB;EACnB,UAAU;EACV,WAAW;EACX,eAAe;AACjB;AACA;EACE,sBAAsB;EACtB,mBAAmB;EACnB,UAAU;EACV,WAAW;AACb;AACA;EACE,sBAAsB;EACtB,mBAAmB;EACnB,UAAU;EACV,WAAW;EACX,iBAAiB;AACnB;AACA;EACE,sBAAsB;EACtB,mBAAmB;EACnB,UAAU;EACV,WAAW;AACb;AACA;EACE,sBAAsB;AACxB;AACA;EACE,sBAAsB;EACtB,mBAAmB;EACnB,iBAAiB;ACCnB;ADCA;ECCA,sBAAA;EACA,mBAAA;ADCA;AACA;EACE,sBAAsB;AACxB;AACA;EACE,sBAAsB;AACxB;AACA;EACE,uBAAuB;EACvB,iBAAiB;AACnB;AACA;EACE,uBAAuB;EACvB,iBAAiB;AACnB;AACA;EACE,uBAAuB;EACvB,iBAAiB;AACnB;AACA;EACE,uBAAuB;EACvB,eAAe;AACjB;AACA;EACE,uBAAuB;EACvB,iBAAiB;AACnB;AACA;EACE,uBAAuB;EACvB,iBAAiB;AACnB;AACA;EACE,uBAAuB;EACvB,iBAAiB;AACnB;AACA;EACE,uBAAuB;EACvB,iBAAiB;AACnB;AACA;EACE,uBAAuB;EACvB,iBAAiB;AACnB;AACA;EACE,kBAAkB;EAClB,OAAO;EACP,MAAM;EACN,QAAQ;EACR,SAAS;EACT,uBAAuB;EACvB,aAAa;AACf;AACA;EACE,oBAAoB;EACpB,kBAAkB;EAClB,kBAAkB;EAClB,YAAY;EACZ,eAAe;AACjB","file":"Data.vue","sourcesContent":[".theme-prac {\n  background-color: #333;\n  border-radius: 36px;\n  width: 90%;\n  height: 90%;\n  font-size: 2rem;\n}\n.theme-comp-icon {\n  background-color: #333;\n  border-radius: 36px;\n  width: 90%;\n  height: 90%;\n}\n.theme-comp-dirs {\n  background-color: #333;\n  border-radius: 36px;\n  width: 90%;\n  height: 90%;\n  font-size: 1.3rem;\n}\n.theme-comp-conn {\n  background-color: #333;\n  border-radius: 36px;\n  width: 90%;\n  height: 90%;\n}\n.theme-comp-desc {\n  background-color: #333;\n}\n.theme-prac-dirs {\n  background-color: #333;\n  border-radius: 36px;\n  font-size: 1.3rem;\n}\n.theme-prac-conn {\n  background-color: #333;\n  border-radius: 36px;\n}\n.theme-prac-desc {\n  background-color: #333;\n}\n.theme-disp-desc {\n  background-color: #333;\n}\n.theme-logo {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-menu {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-find {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-tocs {\n  background-color: black;\n  font-size: 2rem;\n}\n.theme-view {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-side {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-pref {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-foot {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-trak {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.data {\n  position: relative;\n  left: 0;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  background-color: black;\n  display: grid;\n}\n.data h1 {\n  justify-self: center;\n  align-self: center;\n  text-align: center;\n  color: wheat;\n  font-size: 2rem;\n}\n","\n\n<template>\n  <div class=\"data\" ref=\"Data\">\n    <h1 :v-if=\"isData()\">Data</h1>\n    <template v-for=\"dat in datas\">\n      <router-view :name=\"dat.key\"></router-view>\n    </template>\n  </div>\n</template>\n\n<script type=\"module\">\n  \n  let Data = {\n\n    data() { return { route:'Data', datas:[\n      { title:'Tables', key:'Tables' },\n      { title:'Pivots', key:'Pivots' } ] } },\n\n    methods: {\n      isData: function() {\n        return this.comp === 'Data'; } },\n\n    mounted: function () {}\n\n  }\n\n  export default Data;\n\n</script>\n\n<style lang=\"less\">\n  \n  @import '../../pub/css/themes/theme.less';\n  \n  .data {   position:relative; left:0; top:0; right:0; bottom:0; background-color:@theme-back; display:grid;\n    h1    { justify-self:center; align-self:center; text-align:center; color:@theme-color; font-size:@theme-h1-size; } }\n  \n</style>;"]}, media: undefined });

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
    inject("data-v-48fbca00_0", { source: ".theme-prac {\n  background-color: #333;\n  border-radius: 36px;\n  width: 90%;\n  height: 90%;\n  font-size: 2rem;\n}\n.theme-comp-icon {\n  background-color: #333;\n  border-radius: 36px;\n  width: 90%;\n  height: 90%;\n}\n.theme-comp-dirs {\n  background-color: #333;\n  border-radius: 36px;\n  width: 90%;\n  height: 90%;\n  font-size: 1.3rem;\n}\n.theme-comp-conn {\n  background-color: #333;\n  border-radius: 36px;\n  width: 90%;\n  height: 90%;\n}\n.theme-comp-desc {\n  background-color: #333;\n}\n.theme-prac-dirs {\n  background-color: #333;\n  border-radius: 36px;\n  font-size: 1.3rem;\n}\n.theme-prac-conn {\n  background-color: #333;\n  border-radius: 36px;\n}\n.theme-prac-desc {\n  background-color: #333;\n}\n.theme-disp-desc {\n  background-color: #333;\n}\n.theme-logo {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-menu {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-find {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-tocs {\n  background-color: black;\n  font-size: 2rem;\n}\n.theme-view {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-side {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-pref {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-foot {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-trak {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.home {\n  display: grid;\n  grid-template-columns: 1fr;\n  grid-template-rows: 30fr 40fr 30fr;\n  grid-template-areas: \"head\" \"midd\" \"foot\";\n  position: relative;\n  left: 0;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  background-color: black;\n  color: wheat;\n}\n.home .head {\n  grid-area: head;\n  display: grid;\n  justify-items: center;\n  align-items: center;\n  text-align: center;\n  justify-self: stretch;\n  align-self: stretch;\n}\n.home .head h1 {\n  font-size: 2rem;\n}\n.home .midd {\n  grid-area: midd;\n  display: grid;\n  justify-items: center;\n  align-items: center;\n  text-align: center;\n  justify-self: stretch;\n  align-self: stretch;\n}\n.home .midd h1 {\n  font-size: 2rem;\n}\n.home .foot {\n  grid-area: foot;\n  display: grid;\n  justify-items: center;\n  align-items: center;\n  text-align: center;\n  justify-self: stretch;\n  align-self: stretch;\n}\n.home .foot h1 {\n  font-size: 2rem;\n}\n", map: {"version":3,"sources":["Home.vue","/Users/ax/Documents/prj/aug/pub/app/augm/Home.vue"],"names":[],"mappings":"AAAA;EACE,sBAAsB;EACtB,mBAAmB;EACnB,UAAU;EACV,WAAW;EACX,eAAe;AACjB;AACA;EACE,sBAAsB;EACtB,mBAAmB;EACnB,UAAU;EACV,WAAW;AACb;AACA;EACE,sBAAsB;EACtB,mBAAmB;EACnB,UAAU;EACV,WAAW;EACX,iBAAiB;AACnB;AACA;EACE,sBAAsB;EACtB,mBAAmB;EACnB,UAAU;EACV,WAAW;AACb;AACA;EACE,sBAAsB;AACxB;AACA;EACE,sBAAsB;EACtB,mBAAmB;EACnB,iBAAiB;AACnB;AACA;EACE,sBAAsB;EACtB,mBAAmB;AACrB;AACA;EACE,sBAAsB;AACxB;AACA;EACE,sBAAsB;AACxB;AACA;EACE,uBAAuB;EACvB,iBAAiB;AACnB;AACA;EACE,uBAAuB;EACvB,iBAAiB;AACnB;AACA;EACE,uBAAuB;EACvB,iBAAiB;AACnB;AACA;EACE,uBAAuB;EACvB,eAAe;AACjB;AACA;EACE,uBAAuB;ECCzB,iBAAA;ADCA;ACCA;EACA,uBAAA;EDCE,iBAAiB;ACCnB;AACA;EDCE,uBAAuB;ECCzB,iBAAA;AACA;ADCA;ECCA,uBAAA;EACA,iBAAA;ADCA;ACCA;EACA,uBAAA;EDCE,iBAAiB;ACCnB;ADCA;EACE,aAAa;EACb,0BAA0B;EAC1B,kCAAkC;EAClC,yCAAyC;EACzC,kBAAkB;EAClB,OAAO;EACP,MAAM;EACN,QAAQ;EACR,SAAS;EACT,uBAAuB;EACvB,YAAY;AACd;AACA;EACE,eAAe;EACf,aAAa;EACb,qBAAqB;EACrB,mBAAmB;EACnB,kBAAkB;EAClB,qBAAqB;EACrB,mBAAmB;AACrB;AACA;EACE,eAAe;AACjB;AACA;EACE,eAAe;EACf,aAAa;EACb,qBAAqB;EACrB,mBAAmB;EACnB,kBAAkB;EAClB,qBAAqB;EACrB,mBAAmB;AACrB;AACA;EACE,eAAe;AACjB;AACA;EACE,eAAe;EACf,aAAa;EACb,qBAAqB;EACrB,mBAAmB;EACnB,kBAAkB;EAClB,qBAAqB;EACrB,mBAAmB;AACrB;AACA;EACE,eAAe;AACjB","file":"Home.vue","sourcesContent":[".theme-prac {\n  background-color: #333;\n  border-radius: 36px;\n  width: 90%;\n  height: 90%;\n  font-size: 2rem;\n}\n.theme-comp-icon {\n  background-color: #333;\n  border-radius: 36px;\n  width: 90%;\n  height: 90%;\n}\n.theme-comp-dirs {\n  background-color: #333;\n  border-radius: 36px;\n  width: 90%;\n  height: 90%;\n  font-size: 1.3rem;\n}\n.theme-comp-conn {\n  background-color: #333;\n  border-radius: 36px;\n  width: 90%;\n  height: 90%;\n}\n.theme-comp-desc {\n  background-color: #333;\n}\n.theme-prac-dirs {\n  background-color: #333;\n  border-radius: 36px;\n  font-size: 1.3rem;\n}\n.theme-prac-conn {\n  background-color: #333;\n  border-radius: 36px;\n}\n.theme-prac-desc {\n  background-color: #333;\n}\n.theme-disp-desc {\n  background-color: #333;\n}\n.theme-logo {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-menu {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-find {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-tocs {\n  background-color: black;\n  font-size: 2rem;\n}\n.theme-view {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-side {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-pref {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-foot {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-trak {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.home {\n  display: grid;\n  grid-template-columns: 1fr;\n  grid-template-rows: 30fr 40fr 30fr;\n  grid-template-areas: \"head\" \"midd\" \"foot\";\n  position: relative;\n  left: 0;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  background-color: black;\n  color: wheat;\n}\n.home .head {\n  grid-area: head;\n  display: grid;\n  justify-items: center;\n  align-items: center;\n  text-align: center;\n  justify-self: stretch;\n  align-self: stretch;\n}\n.home .head h1 {\n  font-size: 2rem;\n}\n.home .midd {\n  grid-area: midd;\n  display: grid;\n  justify-items: center;\n  align-items: center;\n  text-align: center;\n  justify-self: stretch;\n  align-self: stretch;\n}\n.home .midd h1 {\n  font-size: 2rem;\n}\n.home .foot {\n  grid-area: foot;\n  display: grid;\n  justify-items: center;\n  align-items: center;\n  text-align: center;\n  justify-self: stretch;\n  align-self: stretch;\n}\n.home .foot h1 {\n  font-size: 2rem;\n}\n","\n<template>\n  <div class=\"home\">\n    <div class=\"head\">\n      <div>\n        <h1>Welcome to Augmentation Home Page</h1>\n        <h2>Choose an Application Component on the Left</h2>\n      </div>\n    </div>\n    <div class=\"midd\">\n      <!--h-btns comp=\"Home\" :btns=\"btns\" init=\"Axes\" back=\"#3B5999\" active=\"tan\"></h-btns-->\n    </div>\n    <div class=\"foot\">\n      <div>\n        <h1>Axiom Architectures</h1>\n      </div>\n    </div>\n  </div>\n</template>\n\n<script type=\"module\">\n\n  import Btns from '../../../vue/elem/Btns.vue';\n  \n   let Home = {\n    \n    components:{ 'h-btns':Btns },\n\n  data() { return { comp:'Draw', key:'Axes', btns:{\n    Axes:    { title:'Axes',    key:'Axes',    obj:null, pos:[ 5,10,0,10], back:'primary',   check:true              },\n    Chord:   { title:'Chord',   key:'Chord',   obj:null, pos:[30,10,0,20], back:'secondary', img:'brew/AutoDrip.jpg' },\n    Cluster: { title:'Cluster', key:'Cluster', obj:null, pos:[50,10,0,10], back:'success',   icon:'fas fa-circle'    },\n    Link:    { title:'Link',    key:'Link',    obj:null, pos:[ 5,25,0,20], back:'info',      check:true              },\n    Radar:   { title:'Radar',   key:'Radar',   obj:null, pos:[ 5,40,0,10], back:'warning',   icon:'fas fa-circle'    },\n    Radial:  { title:'Radial',  key:'Radial',  obj:null, pos:[ 5,55,0,20], back:'danger',    img:'brew/AutoDrip.jpg' },\n    Tree:    { title:'Tree',    key:'Tree',    obj:null, pos:[40,40,0,30], back:'light',     icon:'fas fa-circle'    },\n    Wheel:   { title:'Wheel',   key:'Wheel',   obj:null, pos:[60,60,0,30], back:'success',   img:'brew/AutoDrip.jpg' }\n    } } },\n\n   mounted: function () {\n       this.publish( 'Tocs', 'Close' ); }\n   \n  }\n\n  import Dash from '../../../vue/dash/Dash.vue';\n  import Math from '../../../vue/math/Math.vue';\n  import Geom from '../../../vue/geom/Geom.vue';\n  import Note from '../../../vue/note/Note.vue';\n  import Data from '../../../vue/data/Data.vue';\n\n  Home.Dash = Dash;\n  Home.Math = Math;\n  Home.Geom = Geom;\n  Home.Note = Note;\n  Home.Data = Data;\n  \n  export default Home;\n  \n</script>\n\n<style lang=\"less\">\n  \n  @import '../../../pub/css/themes/theme.less';\n  \n  .grid3x1() { display:grid; grid-template-columns:1fr; grid-template-rows:30fr 40fr 30fr;\n      grid-template-areas:\"head\" \"midd\" \"foot\"; }\n  \n  .home { .grid3x1(); position:relative; left:0; top:0; right:0; bottom:0;\n    background-color:@theme-back; color:@theme-color;\n\n    .head { grid-area:head; .themeCenterItems(); justify-self:stretch; align-self:stretch;\n      h1 { font-size:@theme-h1-size; } }\n    \n    .midd { grid-area:midd; .themeCenterItems(); justify-self:stretch; align-self:stretch;\n      h1 { font-size:@theme-h1-size; } }\n  \n    .foot { grid-area:foot; .themeCenterItems(); justify-self:stretch; align-self:stretch;\n      h1 { font-size:@theme-h1-size; } }\n    \n  }\n  \n</style>"]}, media: undefined });

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
