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

  
//import Touch from '../../pub/base/util/Touch.js';

  var script = {
    
    props: { pcomp:{ type:String, default:'None' } },
    
    data() { return {
      comp:'None', prac:'All', disp:'All', practices:{},
      rows: {
        Learn:{ name:'Learn', dir:'le', icon:"fas fa-graduation-cap" },
        Do:{    name:'Do',    dir:'do', icon:"fas fas fa-cogs" },
        Share:{ name:'Share', dir:'sh', icon:"fas fa-share-alt-square" } } } },
    
    methods: {
      isPrac: function (prac) {
        return this.prac===prac || this.prac==='All' },
      isDisp: function (disp) {
        return this.disp===disp || this.disp==='All' },
      isRows: function () {
        return this.prac==='All' },
      pubPrac: function (prac) {
        this.publish( this.comp, { prac:prac, disp:'All' } ); },
      pubDisp: function (prac,disp) {
        this.publish( this.comp, { prac:prac, disp:disp  } ); },
      onPrac: function (prac) {
        this.prac = prac; this.disp='All'; },
      onDisp: function (prac,disp) {
        this.prac = prac; this.disp=disp; },
      onTabs: function ()    {}, // Does nothing
      onNone: function (obj) {
        console.error( 'Prac Nav Error', { obj:obj } ); },
      onNav:  function (obj) {
        switch( obj.level ) {
          case 'Prac' : this.onPrac(obj.prac);          break;
          case 'Disp' : this.onDisp(obj.prac,obj.disp); break;
          case 'Tabs' : this.onTabs();                  break;
          default     : this.onNone(obj); } },
      pracDir: function(dir) {
        return this.prac==='All' ? dir : 'fullPracDir'; },
      dispDir: function(dir) {
        return this.disp==='All' ? dir : 'fullDispDir'; },
      areaDir: function() {
        return this.prac==='All' ? 'none' : 'area' },
      style: function( hsv ) {
        return { backgroundColor:this.toRgbaHsv(hsv) }; },
      elems: function() { // Add DON elements. Must be called within $nextTick for $refs
        this.infoElem = this.$refs['Info'];
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
      this.comp = this.$route.name.substring(0,4);  },
      // console.log( 'Prac.beforeMount()', this.$route.name, this.comp, this.pcomp  );

    mounted: function () {
    //this.touch     = new Touch();
      this.practices = this.pracs(this.comp); // 'Cols'
      this.subscribe(  this.comp, this.comp+'.vue', (obj) => {
         if( obj.disp==='All' ) { this.onPrac(obj.prac); }
         else                   { this.onDisp(obj.prac,obj.disp); } } );
      this.subscribe(  "Nav",     this.comp+'.vue', (obj) => {
        this.onNav(obj); } );
      this.$nextTick( function() {
        if( this.nav().queued ) {
          this.onNav( this.nav().que('Prac',false) ); } } ); }
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
    { ref: "Info", staticClass: "comp", attrs: { title: "Info" } },
    [
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
              _c(
                "div",
                { staticClass: "prac" },
                [
                  _c(
                    "div",
                    {
                      directives: [
                        {
                          name: "show",
                          rawName: "v-show",
                          value: _vm.isDisp(prac.name),
                          expression: "isDisp(prac.name)"
                        }
                      ],
                      class: _vm.dispDir("cen"),
                      style: _vm.style(prac.hsv)
                    },
                    [
                      _c(
                        "div",
                        {
                          staticClass: "disp",
                          on: {
                            click: function($event) {
                              return _vm.pubPrac(prac.name)
                            }
                          }
                        },
                        [
                          _c("i", { class: prac.icon }),
                          _vm._v(" "),
                          _c("span", { staticClass: "name" }, [
                            _vm._v(_vm._s(prac.name))
                          ]),
                          _vm._v(" "),
                          _c("span", { staticClass: "desc" }, [
                            _vm._v(_vm._s(prac.desc))
                          ])
                        ]
                      )
                    ]
                  ),
                  _vm._v(" "),
                  _vm._l(prac.disps, function(disp) {
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
                                  return _vm.pubDisp(prac.name, disp.name)
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
                          ),
                          _vm._v(" "),
                          _vm._l(disp.areas, function(area) {
                            return [
                              _c("div", { class: _vm.areaDir() }, [
                                _c("i", { class: area.icon }),
                                _vm._v(" "),
                                _c("span", { staticClass: "name" }, [
                                  _vm._v(_vm._s(area.name))
                                ]),
                                _vm._v(" "),
                                _c("span", { staticClass: "desc" }, [
                                  _vm._v(_vm._s(area.desc))
                                ])
                              ])
                            ]
                          })
                        ],
                        2
                      )
                    ]
                  })
                ],
                2
              )
            ]
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
            [
              _c("div", { staticClass: "row" }, [
                _c("div", [
                  _c("i", { class: row.icon }),
                  _vm._v(_vm._s(row.name))
                ])
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
    inject("data-v-bf37cd16_0", { source: ".theme-logo {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-menu {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-find {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-tocs {\n  background-color: black;\n  font-size: 2.5rem;\n}\n.theme-view {\n  font-size: 1.5rem;\n}\n.theme-side {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-pref {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-foot {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-trak {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-prac {\n  background-color: #603;\n  font-size: 2rem;\n}\n.theme-icon {\n  background-color: #333;\n  border-radius: 36px;\n  width: 80%;\n  height: 90%;\n}\n.comp {\n  position: absolute;\n  left: 0;\n  top: 5%;\n  right: 0;\n  bottom: 0;\n  font-size: 2rem;\n  background-color: black;\n  color: black;\n  display: grid;\n  grid-template-columns: 7fr 31fr 31fr 31fr;\n  grid-template-rows: 7fr 12fr 27fr 27fr 27fr;\n  grid-template-areas: \"tabs tabs tabs tabs\" \"cm em in en\" \"le nw north ne\" \"do west cen east\" \"sh sw south se\";\n  justify-items: center;\n  align-items: center;\n}\n.comp .tabs {\n  grid-area: tabs;\n  display: inline;\n  color: wheat;\n  font-size: 1.5rem;\n  justify-self: start;\n  align-self: center;\n  text-align: left;\n}\n.comp .cm {\n  display: grid;\n  grid-area: cm;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n}\n.comp .em {\n  display: grid;\n  grid-area: em;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n}\n.comp .in {\n  display: grid;\n  grid-area: in;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n}\n.comp .en {\n  display: grid;\n  grid-area: en;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n}\n.comp .le {\n  display: grid;\n  grid-area: le;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n}\n.comp .nw {\n  display: grid;\n  grid-area: nw;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n}\n.comp .north {\n  display: grid;\n  grid-area: north;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n}\n.comp .ne {\n  display: grid;\n  grid-area: ne;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n}\n.comp .do {\n  display: grid;\n  grid-area: do;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n}\n.comp .west {\n  display: grid;\n  grid-area: west;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n}\n.comp .cen {\n  display: grid;\n  grid-area: cen;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n}\n.comp .east {\n  display: grid;\n  grid-area: east;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n}\n.comp .sh {\n  display: grid;\n  grid-area: sh;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n}\n.comp .sw {\n  display: grid;\n  grid-area: sw;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n}\n.comp .south {\n  display: grid;\n  grid-area: south;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n}\n.comp .se {\n  display: grid;\n  grid-area: se;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n}\n.comp .prac {\n  background-color: #603;\n  border-radius: 36px;\n  width: 90%;\n  height: 80%;\n  font-size: 2rem;\n  font-weight: bold;\n  display: grid;\n  grid-template-columns: 1fr 1fr 1fr;\n  grid-template-rows: 1fr 1fr 1fr;\n  grid-template-areas: \"nw north ne\" \"west cen east\" \"sw south se\";\n}\n.comp .prac .north {\n  display: grid;\n  grid-area: north;\n  justify-self: stretch;\n  align-self: stretch;\n  border-radius: 36px;\n}\n.comp .prac .west {\n  display: grid;\n  grid-area: west;\n  justify-self: stretch;\n  align-self: stretch;\n  border-radius: 36px;\n}\n.comp .prac .cen {\n  display: grid;\n  grid-area: cen;\n  justify-self: stretch;\n  align-self: stretch;\n  border-radius: 36px;\n}\n.comp .prac .east {\n  display: grid;\n  grid-area: east;\n  justify-self: stretch;\n  align-self: stretch;\n  border-radius: 36px;\n}\n.comp .prac .south {\n  display: grid;\n  grid-area: south;\n  justify-self: stretch;\n  align-self: stretch;\n  border-radius: 36px;\n}\n.comp .prac .cen {\n  font-size: 1.6rem;\n}\n.comp .prac div {\n  font-size: 1.4rem;\n}\n.comp .disp {\n  display: inline;\n  justify-self: center;\n  align-self: center;\n  text-align: center;\n  font-size: 1.6rem;\n}\n.comp .disp i {\n  display: inline-block;\n  margin-right: 0.25rem;\n}\n.comp .disp .name {\n  display: inline-block;\n}\n.comp .disp .desc {\n  display: none;\n  margin: 0.5rem 0.5rem 0.5rem 0.5rem;\n  text-align: left;\n}\n.comp .area {\n  display: grid;\n  grid-template-columns: 6fr 22fr 72fr;\n  grid-template-areas: \"icon name desc\";\n  justify-self: start;\n  align-self: center;\n  text-align: left;\n  margin-left: 1.5em;\n  width: 90%;\n  height: auto;\n  font-size: 1.5rem;\n}\n.comp .area i {\n  grid-area: icon;\n}\n.comp .area .name {\n  grid-area: name;\n  font-weight: 900;\n}\n.comp .area .desc {\n  grid-area: desc;\n}\n.comp .none {\n  display: none;\n}\n.comp .fullDispDir {\n  position: absolute;\n  left: 3%;\n  top: 6%;\n  right: 3%;\n  bottom: 6%;\n  display: grid;\n  border-radius: 72px;\n}\n.comp .fullDispDir .disp {\n  justify-self: center;\n  margin: 0;\n}\n.comp .fullDispDir .disp i {\n  font-size: 1.6rem !important;\n}\n.comp .fullDispDir .disp .name {\n  font-size: 1.6rem !important;\n}\n.comp .fullDispDir .disp .desc {\n  font-size: 1.6rem !important;\n  display: block;\n}\n.comp .fullDispDir .area {\n  font-size: 1.6rem !important;\n  padding-bottom: 0;\n}\n.comp .none {\n  display: none;\n}\n.comp .fullPracDir {\n  position: absolute;\n  left: 3%;\n  top: 6%;\n  right: 3%;\n  bottom: 6%;\n  display: grid;\n}\n.comp .fullPracDir .prac {\n  font-size: 2.5rem;\n  width: 100%;\n  height: 100%;\n  justify-self: center;\n  align-self: center;\n  display: grid;\n  border-radius: 0.5rem;\n}\n.comp .fullPracDir .prac div {\n  padding-bottom: 2rem;\n}\n.comp .fullPracDir .prac div .disp {\n  padding-bottom: 0;\n}\n.comp .fullPracDir .prac div .disp i {\n  font-size: 1.6rem;\n}\n.comp .fullPracDir .prac div .disp .name {\n  font-size: 1.6rem;\n}\n.comp .fullPracDir .prac div .disp .desc {\n  font-size: 1.6rem;\n  display: block;\n}\n.comp .fullPracDir .prac .area {\n  padding-bottom: 0;\n}\n.comp .fullDispDir {\n  position: absolute;\n  left: 3%;\n  top: 6%;\n  right: 3%;\n  bottom: 6%;\n  display: grid;\n  border-radius: 72px;\n}\n.comp .fullDispDir .disp {\n  justify-self: center;\n  margin: 0;\n}\n.comp .fullDispDir .disp i {\n  font-size: 1.6rem !important;\n}\n.comp .fullDispDir .disp .name {\n  font-size: 1.6rem !important;\n}\n.comp .fullDispDir .disp .desc {\n  font-size: 1.6rem !important;\n  display: block;\n}\n.comp .fullDispDir .area {\n  font-size: 1.6rem !important;\n  padding-bottom: 0;\n}\n.comp .em .prac .cen,\n.comp .in .prac .cen,\n.comp .en .prac .cen {\n  font-size: 1.6rem;\n}\n.comp .row {\n  background-color: #603;\n  border-radius: 36px;\n  margin-left: 10%;\n  width: 80%;\n  height: 80%;\n  font-size: 1.6rem;\n  font-weight: bold;\n  display: grid;\n}\n.comp .row div {\n  text-align: center;\n  justify-self: center;\n  align-self: center;\n  font-size: 1.6rem;\n  color: wheat;\n}\n.comp .row i {\n  margin-bottom: 0.2rem;\n  display: block;\n}\n", map: {"version":3,"sources":["Prac.vue","/Users/ax/Documents/prj/aug/vue/prac/Prac.vue"],"names":[],"mappings":"AAAA;EACE,uBAAuB;EACvB,iBAAiB;AACnB;AACA;EACE,uBAAuB;EACvB,iBAAiB;AACnB;AACA;EACE,uBAAuB;EACvB,iBAAiB;AACnB;AACA;EACE,uBAAuB;EACvB,iBAAiB;AACnB;AACA;EACE,iBAAiB;AACnB;AACA;EACE,uBAAuB;EACvB,iBAAiB;AACnB;AACA;EACE,uBAAuB;EACvB,iBAAiB;AACnB;AACA;EACE,uBAAuB;EACvB,iBAAiB;AACnB;AACA;EACE,uBAAuB;EACvB,iBAAiB;AACnB;AACA;EACE,sBAAsB;EACtB,eAAe;AACjB;AACA;EACE,sBAAsB;EACtB,mBAAmB;EACnB,UAAU;EACV,WAAW;AACb;AACA;EACE,kBAAkB;EAClB,OAAO;EACP,OAAO;EACP,QAAQ;EACR,SAAS;EACT,eAAe;EACf,uBAAuB;EACvB,YAAY;EACZ,aAAa;EACb,yCAAyC;EACzC,2CAA2C;EAC3C,6GAA6G;EAC7G,qBAAqB;EACrB,mBAAmB;AACrB;AACA;EACE,eAAe;EACf,eAAe;EACf,YAAY;EACZ,iBAAiB;EACjB,mBAAmB;EACnB,kBAAkB;EAClB,gBAAgB;AAClB;AACA;EACE,aAAa;EACb,aAAa;EACb,qBAAqB;EACrB,mBAAmB;EACnB,qBAAqB;EACrB,mBAAmB;AACrB;AACA;EACE,aAAa;EACb,aAAa;EACb,qBAAqB;EACrB,mBAAmB;EACnB,qBAAqB;EACrB,mBAAmB;AACrB;AACA;EACE,aAAa;EACb,aAAa;EACb,qBAAqB;EACrB,mBAAmB;EACnB,qBAAqB;EACrB,mBAAmB;AACrB;AACA;EACE,aAAa;EACb,aAAa;EACb,qBAAqB;EACrB,mBAAmB;EACnB,qBAAqB;EACrB,mBAAmB;AACrB;AACA;EACE,aAAa;EACb,aAAa;EACb,qBAAqB;EACrB,mBAAmB;EACnB,qBAAqB;EACrB,mBAAmB;AACrB;AACA;EACE,aAAa;EACb,aAAa;EACb,qBAAqB;EACrB,mBAAmB;EACnB,qBAAqB;EACrB,mBAAmB;AACrB;AACA;EACE,aAAa;EACb,gBAAgB;EAChB,qBAAqB;ECCvB,mBAAA;EDCE,qBAAqB;ECCvB,mBAAA;AACA;ADCA;ECCA,aAAA;EACA,aAAA;EDCE,qBAAqB;ECCvB,mBAAA;EACA,qBAAA;EDCE,mBAAmB;ACCrB;ADCA;ECCA,aAAA;EACA,aAAA;EDCE,qBAAqB;ECCvB,mBAAA;EDCE,qBAAqB;ECCvB,mBAAA;AACA;ADCA;ECCA,aAAA;EACA,eAAA;EACA,qBAAA;EACA,mBAAA;EACA,qBAAA;EACA,mBAAA;AACA;AACA;EACA,aAAA;EDCE,cAAc;ECChB,qBAAA;EACA,mBAAA;EACA,qBAAA;EACA,mBAAA;AACA;AACA;EACA,aAAA;EACA,eAAA;EACA,qBAAA;EDCE,mBAAmB;ECCrB,qBAAA;EACA,mBAAA;AACA;AACA;EDCE,aAAa;ECCf,aAAA;EACA,qBAAA;EACA,mBAAA;EACA,qBAAA;EACA,mBAAA;ADCA;ACCA;EDCE,aAAa;ECCf,aAAA;EACA,qBAAA;EACA,mBAAA;EACA,qBAAA;EACA,mBAAA;AACA;AACA;EDCE,aAAa;ECCf,gBAAA;EDCE,qBAAqB;ECCvB,mBAAA;EACA,qBAAA;EACA,mBAAA;AACA;AACA;EACA,aAAA;EACA,aAAA;EACA,qBAAA;EACA,mBAAA;EACA,qBAAA;EDCE,mBAAmB;ACCrB;AACA;EACA,sBAAA;EACA,mBAAA;EACA,UAAA;EACA,WAAA;EACA,eAAA;EDCE,iBAAiB;ECCnB,aAAA;EDCE,kCAAkC;ECCpC,+BAAA;EACA,gEAAA;AACA;AACA;EDCE,aAAa;EACb,gBAAgB;ECClB,qBAAA;EDCE,mBAAmB;EACnB,mBAAmB;AACrB;AACA;EACE,aAAa;EACb,eAAe;EACf,qBAAqB;EACrB,mBAAmB;EACnB,mBAAmB;AACrB;AACA;EACE,aAAa;EACb,cAAc;EACd,qBAAqB;EACrB,mBAAmB;EACnB,mBAAmB;AACrB;AACA;EACE,aAAa;EACb,eAAe;EACf,qBAAqB;EACrB,mBAAmB;EACnB,mBAAmB;AACrB;AACA;EACE,aAAa;EACb,gBAAgB;EAChB,qBAAqB;EACrB,mBAAmB;EACnB,mBAAmB;AACrB;AACA;EACE,iBAAiB;AACnB;AACA;EACE,iBAAiB;AACnB;AACA;EACE,eAAe;EACf,oBAAoB;EACpB,kBAAkB;EAClB,kBAAkB;EAClB,iBAAiB;AACnB;AACA;EACE,qBAAqB;EACrB,qBAAqB;AACvB;AACA;EACE,qBAAqB;AACvB;AACA;EACE,aAAa;EACb,mCAAmC;EACnC,gBAAgB;AAClB;AACA;EACE,aAAa;EACb,oCAAoC;EACpC,qCAAqC;EACrC,mBAAmB;EACnB,kBAAkB;EAClB,gBAAgB;EAChB,kBAAkB;EAClB,UAAU;EACV,YAAY;EACZ,iBAAiB;AACnB;AACA;EACE,eAAe;AACjB;AACA;EACE,eAAe;EACf,gBAAgB;AAClB;AACA;EACE,eAAe;AACjB;AACA;EACE,aAAa;AACf;AACA;EACE,kBAAkB;EAClB,QAAQ;EACR,OAAO;EACP,SAAS;EACT,UAAU;EACV,aAAa;EACb,mBAAmB;AACrB;AACA;EACE,oBAAoB;EACpB,SAAS;AACX;AACA;EACE,4BAA4B;AAC9B;AACA;EACE,4BAA4B;AAC9B;AACA;EACE,4BAA4B;EAC5B,cAAc;AAChB;AACA;EACE,4BAA4B;EAC5B,iBAAiB;AACnB;AACA;EACE,aAAa;AACf;AACA;EACE,kBAAkB;EAClB,QAAQ;EACR,OAAO;EACP,SAAS;EACT,UAAU;EACV,aAAa;AACf;AACA;EACE,iBAAiB;EACjB,WAAW;EACX,YAAY;EACZ,oBAAoB;EACpB,kBAAkB;EAClB,aAAa;EACb,qBAAqB;AACvB;AACA;EACE,oBAAoB;AACtB;AACA;EACE,iBAAiB;AACnB;AACA;EACE,iBAAiB;AACnB;AACA;EACE,iBAAiB;AACnB;AACA;EACE,iBAAiB;EACjB,cAAc;AAChB;AACA;EACE,iBAAiB;AACnB;AACA;EACE,kBAAkB;EAClB,QAAQ;EACR,OAAO;EACP,SAAS;EACT,UAAU;EACV,aAAa;EACb,mBAAmB;AACrB;AACA;EACE,oBAAoB;EACpB,SAAS;AACX;AACA;EACE,4BAA4B;AAC9B;AACA;EACE,4BAA4B;AAC9B;AACA;EACE,4BAA4B;EAC5B,cAAc;AAChB;AACA;EACE,4BAA4B;EAC5B,iBAAiB;AACnB;AACA;;;EAGE,iBAAiB;AACnB;AACA;EACE,sBAAsB;EACtB,mBAAmB;EACnB,gBAAgB;EAChB,UAAU;EACV,WAAW;EACX,iBAAiB;EACjB,iBAAiB;EACjB,aAAa;AACf;AACA;EACE,kBAAkB;EAClB,oBAAoB;EACpB,kBAAkB;EAClB,iBAAiB;EACjB,YAAY;AACd;AACA;EACE,qBAAqB;EACrB,cAAc;AAChB","file":"Prac.vue","sourcesContent":[".theme-logo {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-menu {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-find {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-tocs {\n  background-color: black;\n  font-size: 2.5rem;\n}\n.theme-view {\n  font-size: 1.5rem;\n}\n.theme-side {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-pref {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-foot {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-trak {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-prac {\n  background-color: #603;\n  font-size: 2rem;\n}\n.theme-icon {\n  background-color: #333;\n  border-radius: 36px;\n  width: 80%;\n  height: 90%;\n}\n.comp {\n  position: absolute;\n  left: 0;\n  top: 5%;\n  right: 0;\n  bottom: 0;\n  font-size: 2rem;\n  background-color: black;\n  color: black;\n  display: grid;\n  grid-template-columns: 7fr 31fr 31fr 31fr;\n  grid-template-rows: 7fr 12fr 27fr 27fr 27fr;\n  grid-template-areas: \"tabs tabs tabs tabs\" \"cm em in en\" \"le nw north ne\" \"do west cen east\" \"sh sw south se\";\n  justify-items: center;\n  align-items: center;\n}\n.comp .tabs {\n  grid-area: tabs;\n  display: inline;\n  color: wheat;\n  font-size: 1.5rem;\n  justify-self: start;\n  align-self: center;\n  text-align: left;\n}\n.comp .cm {\n  display: grid;\n  grid-area: cm;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n}\n.comp .em {\n  display: grid;\n  grid-area: em;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n}\n.comp .in {\n  display: grid;\n  grid-area: in;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n}\n.comp .en {\n  display: grid;\n  grid-area: en;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n}\n.comp .le {\n  display: grid;\n  grid-area: le;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n}\n.comp .nw {\n  display: grid;\n  grid-area: nw;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n}\n.comp .north {\n  display: grid;\n  grid-area: north;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n}\n.comp .ne {\n  display: grid;\n  grid-area: ne;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n}\n.comp .do {\n  display: grid;\n  grid-area: do;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n}\n.comp .west {\n  display: grid;\n  grid-area: west;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n}\n.comp .cen {\n  display: grid;\n  grid-area: cen;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n}\n.comp .east {\n  display: grid;\n  grid-area: east;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n}\n.comp .sh {\n  display: grid;\n  grid-area: sh;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n}\n.comp .sw {\n  display: grid;\n  grid-area: sw;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n}\n.comp .south {\n  display: grid;\n  grid-area: south;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n}\n.comp .se {\n  display: grid;\n  grid-area: se;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n}\n.comp .prac {\n  background-color: #603;\n  border-radius: 36px;\n  width: 90%;\n  height: 80%;\n  font-size: 2rem;\n  font-weight: bold;\n  display: grid;\n  grid-template-columns: 1fr 1fr 1fr;\n  grid-template-rows: 1fr 1fr 1fr;\n  grid-template-areas: \"nw north ne\" \"west cen east\" \"sw south se\";\n}\n.comp .prac .north {\n  display: grid;\n  grid-area: north;\n  justify-self: stretch;\n  align-self: stretch;\n  border-radius: 36px;\n}\n.comp .prac .west {\n  display: grid;\n  grid-area: west;\n  justify-self: stretch;\n  align-self: stretch;\n  border-radius: 36px;\n}\n.comp .prac .cen {\n  display: grid;\n  grid-area: cen;\n  justify-self: stretch;\n  align-self: stretch;\n  border-radius: 36px;\n}\n.comp .prac .east {\n  display: grid;\n  grid-area: east;\n  justify-self: stretch;\n  align-self: stretch;\n  border-radius: 36px;\n}\n.comp .prac .south {\n  display: grid;\n  grid-area: south;\n  justify-self: stretch;\n  align-self: stretch;\n  border-radius: 36px;\n}\n.comp .prac .cen {\n  font-size: 1.6rem;\n}\n.comp .prac div {\n  font-size: 1.4rem;\n}\n.comp .disp {\n  display: inline;\n  justify-self: center;\n  align-self: center;\n  text-align: center;\n  font-size: 1.6rem;\n}\n.comp .disp i {\n  display: inline-block;\n  margin-right: 0.25rem;\n}\n.comp .disp .name {\n  display: inline-block;\n}\n.comp .disp .desc {\n  display: none;\n  margin: 0.5rem 0.5rem 0.5rem 0.5rem;\n  text-align: left;\n}\n.comp .area {\n  display: grid;\n  grid-template-columns: 6fr 22fr 72fr;\n  grid-template-areas: \"icon name desc\";\n  justify-self: start;\n  align-self: center;\n  text-align: left;\n  margin-left: 1.5em;\n  width: 90%;\n  height: auto;\n  font-size: 1.5rem;\n}\n.comp .area i {\n  grid-area: icon;\n}\n.comp .area .name {\n  grid-area: name;\n  font-weight: 900;\n}\n.comp .area .desc {\n  grid-area: desc;\n}\n.comp .none {\n  display: none;\n}\n.comp .fullDispDir {\n  position: absolute;\n  left: 3%;\n  top: 6%;\n  right: 3%;\n  bottom: 6%;\n  display: grid;\n  border-radius: 72px;\n}\n.comp .fullDispDir .disp {\n  justify-self: center;\n  margin: 0;\n}\n.comp .fullDispDir .disp i {\n  font-size: 1.6rem !important;\n}\n.comp .fullDispDir .disp .name {\n  font-size: 1.6rem !important;\n}\n.comp .fullDispDir .disp .desc {\n  font-size: 1.6rem !important;\n  display: block;\n}\n.comp .fullDispDir .area {\n  font-size: 1.6rem !important;\n  padding-bottom: 0;\n}\n.comp .none {\n  display: none;\n}\n.comp .fullPracDir {\n  position: absolute;\n  left: 3%;\n  top: 6%;\n  right: 3%;\n  bottom: 6%;\n  display: grid;\n}\n.comp .fullPracDir .prac {\n  font-size: 2.5rem;\n  width: 100%;\n  height: 100%;\n  justify-self: center;\n  align-self: center;\n  display: grid;\n  border-radius: 0.5rem;\n}\n.comp .fullPracDir .prac div {\n  padding-bottom: 2rem;\n}\n.comp .fullPracDir .prac div .disp {\n  padding-bottom: 0;\n}\n.comp .fullPracDir .prac div .disp i {\n  font-size: 1.6rem;\n}\n.comp .fullPracDir .prac div .disp .name {\n  font-size: 1.6rem;\n}\n.comp .fullPracDir .prac div .disp .desc {\n  font-size: 1.6rem;\n  display: block;\n}\n.comp .fullPracDir .prac .area {\n  padding-bottom: 0;\n}\n.comp .fullDispDir {\n  position: absolute;\n  left: 3%;\n  top: 6%;\n  right: 3%;\n  bottom: 6%;\n  display: grid;\n  border-radius: 72px;\n}\n.comp .fullDispDir .disp {\n  justify-self: center;\n  margin: 0;\n}\n.comp .fullDispDir .disp i {\n  font-size: 1.6rem !important;\n}\n.comp .fullDispDir .disp .name {\n  font-size: 1.6rem !important;\n}\n.comp .fullDispDir .disp .desc {\n  font-size: 1.6rem !important;\n  display: block;\n}\n.comp .fullDispDir .area {\n  font-size: 1.6rem !important;\n  padding-bottom: 0;\n}\n.comp .em .prac .cen,\n.comp .in .prac .cen,\n.comp .en .prac .cen {\n  font-size: 1.6rem;\n}\n.comp .row {\n  background-color: #603;\n  border-radius: 36px;\n  margin-left: 10%;\n  width: 80%;\n  height: 80%;\n  font-size: 1.6rem;\n  font-weight: bold;\n  display: grid;\n}\n.comp .row div {\n  text-align: center;\n  justify-self: center;\n  align-self: center;\n  font-size: 1.6rem;\n  color: wheat;\n}\n.comp .row i {\n  margin-bottom: 0.2rem;\n  display: block;\n}\n","\n<template>\n  <div class=\"comp\" ref=\"Info\" title=\"Info\" >\n    <template v-for=\"prac in practices\">\n      <div v-show=\"isPrac(prac.name)\" :class=\"pracDir(prac.dir)\" :key=\"prac.name\"\n        :ref=\"prac.name\" :title=\"prac.name\">\n        <div class=\"prac\">\n          <div v-show=\"isDisp(prac.name)\" :class=\"dispDir('cen')\" :style=\"style(prac.hsv)\">\n            <div class=\"disp\" @click=\"pubPrac(prac.name)\">\n              <i   :class=\"prac.icon\"></i>\n              <span class=\"name\">{{prac.name}}</span>\n              <span class=\"desc\">{{prac.desc}}</span>\n            </div>\n          </div>\n          <template  v-for=\"disp in prac.disps\">\n            <div v-show=\"isDisp(disp.name)\" :class=\"dispDir(disp.dir)\" :style=\"style(disp.hsv)\"\n              :ref=\"disp.name\" :title=\"disp.name\">\n            <div class=\"disp\" @click=\"pubDisp(prac.name,disp.name)\">\n              <i   :class=\"disp.icon\"></i>\n              <span class=\"name\">{{disp.name}}</span>\n              <span class=\"desc\">{{disp.desc}}</span>\n            </div>\n            <template v-for=\"area in disp.areas\">\n              <div :class=\"areaDir()\">\n                <i :class=\"area.icon\"></i>\n                <span class=\"name\">{{area.name}}</span>\n                <span class=\"desc\">{{area.desc}}</span>\n              </div>\n            </template>\n          </div>\n          </template>\n        </div>\n      </div>\n    </template>\n    <template v-for=\"row in rows\">\n      <div v-show=\"isRows()\" :class=\"row.dir\" :key=\"row.name\"><div class=\"row\">\n        <div><i :class=\"row.icon\"></i>{{row.name}}</div></div></div>\n    </template>\n  </div>  \n</template>\n\n<script type=\"module\">\n  \n//import Touch from '../../pub/base/util/Touch.js';\n\n  export default {\n    \n    props: { pcomp:{ type:String, default:'None' } },\n    \n    data() { return {\n      comp:'None', prac:'All', disp:'All', practices:{},\n      rows: {\n        Learn:{ name:'Learn', dir:'le', icon:\"fas fa-graduation-cap\" },\n        Do:{    name:'Do',    dir:'do', icon:\"fas fas fa-cogs\" },\n        Share:{ name:'Share', dir:'sh', icon:\"fas fa-share-alt-square\" } } } },\n    \n    methods: {\n      isPrac: function (prac) {\n        return this.prac===prac || this.prac==='All' },\n      isDisp: function (disp) {\n        return this.disp===disp || this.disp==='All' },\n      isRows: function () {\n        return this.prac==='All' },\n      pubPrac: function (prac) {\n        this.publish( this.comp, { prac:prac, disp:'All' } ); },\n      pubDisp: function (prac,disp) {\n        this.publish( this.comp, { prac:prac, disp:disp  } ); },\n      onPrac: function (prac) {\n        this.prac = prac; this.disp='All'; },\n      onDisp: function (prac,disp) {\n        this.prac = prac; this.disp=disp; },\n      onTabs: function ()    {}, // Does nothing\n      onNone: function (obj) {\n        console.error( 'Prac Nav Error', { obj:obj } ); },\n      onNav:  function (obj) {\n        switch( obj.level ) {\n          case 'Prac' : this.onPrac(obj.prac);          break;\n          case 'Disp' : this.onDisp(obj.prac,obj.disp); break;\n          case 'Tabs' : this.onTabs();                  break;\n          default     : this.onNone(obj); } },\n      pracDir: function(dir) {\n        return this.prac==='All' ? dir : 'fullPracDir'; },\n      dispDir: function(dir) {\n        return this.disp==='All' ? dir : 'fullDispDir'; },\n      areaDir: function() {\n        return this.prac==='All' ? 'none' : 'area' },\n      style: function( hsv ) {\n        return { backgroundColor:this.toRgbaHsv(hsv) }; },\n      elems: function() { // Add DON elements. Must be called within $nextTick for $refs\n        this.infoElem = this.$refs['Info']\n        let pracs = this.conns(this.comp); // We access conns because col practices have been filtered out\n        for( let pkey in pracs ) {\n          let prac = pracs[pkey];\n          prac.elem = this.$refs[prac.name][0];\n          this.touch.events( prac.elem );\n          let disps = this.disps(this.comp,prac.name)\n          for( let dkey in disps ) {\n            let disp = disps[dkey];\n            disp.elem = this.$refs[disp.name][0]; } } }  // this.touch.events( disp.elem );\n      },\n\n    beforeMount: function() {\n      this.comp = this.$route.name.substring(0,4);  },\n      // console.log( 'Prac.beforeMount()', this.$route.name, this.comp, this.pcomp  );\n\n    mounted: function () {\n    //this.touch     = new Touch();\n      this.practices = this.pracs(this.comp); // 'Cols'\n      this.subscribe(  this.comp, this.comp+'.vue', (obj) => {\n         if( obj.disp==='All' ) { this.onPrac(obj.prac); }\n         else                   { this.onDisp(obj.prac,obj.disp); } } );\n      this.subscribe(  \"Nav\",     this.comp+'.vue', (obj) => {\n        this.onNav(obj); } );\n      this.$nextTick( function() {\n        if( this.nav().queued ) {\n          this.onNav( this.nav().que('Prac',false) ) } } ); }\n  }\n         \n</script>\n\n<style lang=\"less\">\n  \n  @import '../../pub/css/themes/theme.less';\n  \n  .grid3x3() { display:grid; grid-template-columns:1fr 1fr 1fr; grid-template-rows:1fr 1fr 1fr;\n               grid-template-areas: \"nw north ne\" \"west cen east\" \"sw south se\"; }\n  \n  .grid4x4() { display:grid; grid-template-columns:7fr 31fr 31fr 31fr; grid-template-rows:13vh 29fr 29fr 29fr;\n    grid-template-areas: \"cm em in en\" \"le nw north ne\" \"do west cen east\" \"sh sw south se\"; }\n\n  .grid5x4() { display:grid; grid-template-columns:7fr 31fr 31fr 31fr; grid-template-rows:7fr 12fr 27fr 27fr 27fr;\n    grid-template-areas: \"tabs tabs tabs tabs\" \"cm em in en\" \"le nw north ne\" \"do west cen east\" \"sh sw south se\"; }\n\n  .grid1x3() { display:grid; grid-template-columns:6fr 22fr 72fr; grid-template-areas: \"icon name desc\"; }\n  \n  .pdir( @dir ) { display:grid; grid-area:@dir; justify-self:stretch; align-self:stretch;\n                  justify-items:center; align-items:center; }\n  \n  .ddir( @dir ) { display:grid; grid-area:@dir; justify-self:stretch; align-self:stretch; border-radius:36px; }\n  \n  .bgc( @bg )\n    { background-color:@bg; } // top | right | bottom | left\n  \n  .comp { position:absolute; left:0; top:5%; right:0; bottom:0; font-size:@theme-prac-size;\n          background-color:@theme-back; color:@theme-color-prac;\n    .grid5x4(); justify-items:center; align-items:center; // The 5x4 Tabs + Dim + Per + 9 Practices Grid\n      .tabs{ grid-area:tabs; display:inline; color:@theme-color; font-size:@theme-tab-size;\n             justify-self:start; align-self:center; text-align:left; }\n      .cm { .pdir(cm); } .em   { .pdir(em);   } .in    { .pdir(in); }    .en   { .pdir(en);   }\n      .le { .pdir(le); } .nw   { .pdir(nw);   } .north { .pdir(north); } .ne   { .pdir(ne);   }\n      .do { .pdir(do); } .west { .pdir(west); } .cen   { .pdir(cen);   } .east { .pdir(east); }\n      .sh { .pdir(sh); } .sw   { .pdir(sw);   } .south { .pdir(south); } .se   { .pdir(se);   }\n    \n      // Placed one level below the 9 Practices Grid   - Check on background-color:#603;\n    .prac { background-color:#603; border-radius:36px; width:90%; height:80%; font-size:@theme-prac-size;\n      font-weight:bold;\n      .grid3x3(); // The 4 Displine plus Practiice name Grid\n                             .north { .ddir(north); }\n      .west { .ddir(west); } .cen   { .ddir(cen);   } .east { .ddir(east); }\n                             .south { .ddir(south); }\n      .cen  { font-size:@theme-cen-size; }\n      div   { font-size:@theme-dir-size; } }\n  \n    .disp {   display:inline; justify-self:center; align-self:center; text-align:center; font-size:@theme-disp-size;\n      i     { display:inline-block;  margin-right: 0.25rem; }\n      .name { display:inline-block; }\n      .desc { display:none; margin:0.5rem 0.5rem 0.5rem 0.5rem; text-align:left; } }\n  \n    .area { .grid1x3(); justify-self:start; align-self:center; text-align:left; margin-left:1.5em;\n      width:90%; height:auto; font-size:@theme-area-size;\n      i     { grid-area:icon; }\n      .name { grid-area:name; font-weight:900; }\n      .desc { grid-area:desc; } }\n  \n    .none { display:none; }\n  \n    // Placed one level above .dir at the 4 Disipline plus Practice name Grid Direction\n    .fullDispDir { position:absolute; left:3%; top:6%; right:3%; bottom:6%; display:grid; border-radius:72px;\n      .disp { justify-self:center; margin:0;\n        i     { font-size:@theme-area-icon-size !important; }\n        .name { font-size:@theme-area-name-size !important; }\n        .desc { font-size:@theme-area-desc-size !important; display:block; } }  // Turns on .disp .desc\n      .area {   font-size:@theme-area-area-size !important; padding-bottom:0; } }\n  \n    .none { display:none; }\n    \n    // Placed one level above .prac at the 9 Practices Grid Direction\n    .fullPracDir { position:absolute; left:3%; top:6%; right:3%; bottom:6%; display:grid;\n      .prac { font-size:@theme-full-size; width:100%; height:100%;\n              justify-self:center; align-self:center; display:grid; border-radius:0.5rem;\n        div {     padding-bottom:2rem;\n          .disp { padding-bottom:0;\n            i     { font-size:@theme-disp-size; }\n            .name { font-size:@theme-disp-size; }\n            .desc { font-size:@theme-disp-size; display:block; } } }  // Turns on .disp .desc\n          .area { padding-bottom:0; } } }\n  \n    // Placed one level above .dir at the 4 Disipline plus Practice name Grid Direction\n    .fullDispDir { position:absolute; left:3%; top:6%; right:3%; bottom:6%; display:grid; border-radius:72px;\n       .disp { justify-self:center; margin:0;\n         i     { font-size:@theme-area-icon-size !important; }\n         .name { font-size:@theme-area-name-size !important; }\n         .desc { font-size:@theme-area-desc-size !important; display:block; } }  // Turns on .disp .desc\n       .area {   font-size:@theme-area-area-size !important; padding-bottom:0; } }\n    \n    .em, .in, .en { .prac .cen { font-size:@theme-row-size; } } // Font size columns\n  \n    .row { background-color:#603; border-radius:36px; margin-left:10%; width:80%; height:80%; font-size:@theme-row-size;\n      font-weight:bold; display:grid;\n      div { text-align:center; justify-self:center;  align-self:center; font-size:@theme-row-size; color:@theme-color; }\n      i { margin-bottom: 0.2rem; display:block; } }\n    \n    \n  }\n  \n</style>\n"]}, media: undefined });

  };
  /* scoped */
  const __vue_scope_id__ = undefined;
  /* module identifier */
  const __vue_module_identifier__ = undefined;
  /* functional template */
  const __vue_is_functional_template__ = false;
  /* style inject SSR */
  

  
  var Prac = normalizeComponent_1(
    { render: __vue_render__, staticRenderFns: __vue_staticRenderFns__ },
    __vue_inject_styles__,
    __vue_script__,
    __vue_scope_id__,
    __vue_is_functional_template__,
    __vue_module_identifier__,
    browser,
    undefined
  );

export default Prac;
