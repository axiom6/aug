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


let Summ = {

  props: { name:String },

  data() { return { c0:"-", c1:"-", c2:"-" } },

  methods:{
    
    onChoice: function( choice ) {
      let idx = this.choiceIndex( this.name, choice );
      this['c'+idx]     = choice; } },

  mounted: function () {
    this.subscribe( this.name,  this.name+'Id', this.onChoice );
    let choices = this.choices( this.name );
    for( let idx=0; idx <  choices.length; idx++ ) {
      this['c'+idx] = choices[idx]; } }

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
const __vue_script__ = Summ;

/* template */
var __vue_render__ = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c("div", { staticClass: "summ-pane" }, [
    _c("div", { staticClass: "summ-name" }, [_vm._v(_vm._s(this.name))]),
    _vm._v(" "),
    _c("div", { staticClass: "summ-choices" }, [
      _c("div", { staticClass: "c1" }, [_vm._v(_vm._s(this.c0))]),
      _vm._v(" "),
      _c("div", { staticClass: "c2" }, [_vm._v(_vm._s(this.c1))]),
      _vm._v(" "),
      _c("div", { staticClass: "c3" }, [_vm._v(_vm._s(this.c2))])
    ])
  ])
};
var __vue_staticRenderFns__ = [];
__vue_render__._withStripped = true;

  /* style */
  const __vue_inject_styles__ = function (inject) {
    if (!inject) return
    inject("data-v-2eec7b73_0", { source: ".theme-desc {\n  font-size: 1rem;\n  background-color: #333;\n  border-radius: 0.7em;\n  width: 90%;\n  height: 90%;\n}\n.summ-pane {\n  position: absolute;\n  left: 0;\n  top: 0;\n  width: 100%;\n  height: 100%;\n  background-color: black;\n  color: wheat;\n  border: 1px solid wheat;\n}\n.summ-pane .summ-name {\n  position: absolute;\n  left: 0;\n  top: 0;\n  width: 100%;\n  height: 50%;\n  font-size: 3vmin;\n  display: grid;\n  justify-items: center;\n  align-items: center;\n  text-align: center;\n}\n.summ-pane .summ-choices {\n  position: absolute;\n  left: 0;\n  top: 50%;\n  width: 100%;\n  height: 50%;\n  display: grid;\n  justify-items: center;\n  align-items: center;\n  text-align: center;\n  grid-template-rows: 100fr;\n  grid-template-columns: 33.3fr 33.3fr 33.3fr;\n  grid-template-areas: \"c1 c2 c3\";\n  font-size: 2vmin;\n}\n.summ-pane .summ-choices .c1 {\n  grid-area: c1;\n}\n.summ-pane .summ-choices .c2 {\n  grid-area: c2;\n}\n.summ-pane .summ-choices .c3 {\n  grid-area: c3;\n}\n", map: {"version":3,"sources":["Summ.vue","/Users/ax/Documents/prj/aug/vue/jitter/Summ.vue"],"names":[],"mappings":"AAAA;EACE,eAAe;EACf,sBAAsB;EACtB,oBAAoB;EACpB,UAAU;EACV,WAAW;AACb;AACA;EACE,kBAAkB;EAClB,OAAO;EACP,MAAM;EACN,WAAW;EACX,YAAY;EACZ,uBAAuB;EACvB,YAAY;EACZ,uBAAuB;AACzB;AACA;EACE,kBAAkB;EAClB,OAAO;EACP,MAAM;EACN,WAAW;EACX,WAAW;EACX,gBAAgB;EAChB,aAAa;EACb,qBAAqB;EACrB,mBAAmB;EACnB,kBAAkB;AACpB;AACA;EACE,kBAAkB;EAClB,OAAO;EACP,QAAQ;EACR,WAAW;EACX,WAAW;EACX,aAAa;EACb,qBAAqB;EACrB,mBAAmB;EACnB,kBAAkB;EAClB,yBAAyB;ECC3B,2CAAA;EDCE,+BAA+B;ECCjC,gBAAA;ADCA;ACCA;EACA,aAAA;ADCA;ACCA;EACA,aAAA;AACA;ADCA;ECCA,aAAA;AACA","file":"Summ.vue","sourcesContent":[".theme-desc {\n  font-size: 1rem;\n  background-color: #333;\n  border-radius: 0.7em;\n  width: 90%;\n  height: 90%;\n}\n.summ-pane {\n  position: absolute;\n  left: 0;\n  top: 0;\n  width: 100%;\n  height: 100%;\n  background-color: black;\n  color: wheat;\n  border: 1px solid wheat;\n}\n.summ-pane .summ-name {\n  position: absolute;\n  left: 0;\n  top: 0;\n  width: 100%;\n  height: 50%;\n  font-size: 3vmin;\n  display: grid;\n  justify-items: center;\n  align-items: center;\n  text-align: center;\n}\n.summ-pane .summ-choices {\n  position: absolute;\n  left: 0;\n  top: 50%;\n  width: 100%;\n  height: 50%;\n  display: grid;\n  justify-items: center;\n  align-items: center;\n  text-align: center;\n  grid-template-rows: 100fr;\n  grid-template-columns: 33.3fr 33.3fr 33.3fr;\n  grid-template-areas: \"c1 c2 c3\";\n  font-size: 2vmin;\n}\n.summ-pane .summ-choices .c1 {\n  grid-area: c1;\n}\n.summ-pane .summ-choices .c2 {\n  grid-area: c2;\n}\n.summ-pane .summ-choices .c3 {\n  grid-area: c3;\n}\n","\n<template>\n  <div   class=\"summ-pane\">\n    <div class=\"summ-name\">{{this.name}}</div>\n    <div class=\"summ-choices\">\n      <div class=\"c1\">{{this.c0}}</div>\n      <div class=\"c2\">{{this.c1}}</div>\n      <div class=\"c3\">{{this.c2}}</div>\n    </div>\n  </div>\n</template>\n\n<script type=\"module\">\n  \n  let Summ = {\n\n    props: { name:String },\n\n    data() { return { c0:\"-\", c1:\"-\", c2:\"-\" } },\n\n    methods:{\n      \n      onChoice: function( choice ) {\n        let idx = this.choiceIndex( this.name, choice )\n        this['c'+idx]     = choice; } },\n\n    mounted: function () {\n      this.subscribe( this.name,  this.name+'Id', this.onChoice );\n      let choices = this.choices( this.name );\n      for( let idx=0; idx <  choices.length; idx++ ) {\n        this['c'+idx] = choices[idx]; } }\n\n  }\n\n  export default Summ;\n\n</script>\n\n<style lang=\"less\">\n  \n@import '../../pub/css/themes/theme.less';\n\n@summFS:@themeFS;\n\n.summ-pane { position:absolute; left:0; top:0; width:100%; height:100%;\n        background-color:@theme-back; color:@theme-fore; border:1px solid @theme-fore;\n  \n  // .themeCenterItems() has display:grid;\n  .summ-choices(){ .themeCenterItems(); grid-template-rows:100fr; grid-template-columns:33.3fr 33.3fr 33.3fr;\n    grid-template-areas:\"c1 c2 c3\" }\n  \n  .summ-name {    position:absolute; left:0; top:0;   width:100%; height:50%; font-size:1.5*@summFS;\n    .themeCenterItems(); }\n  \n  .summ-choices { position:absolute; left:0; top:50%; width:100%; height:50%; .summ-choices(); font-size:@summFS;\n    .c1 { grid-area:c1; } .c2 { grid-area:c2; } .c3 { grid-area:c3; } }\n  }\n\n</style>\n"]}, media: undefined });

  };
  /* scoped */
  const __vue_scope_id__ = undefined;
  /* module identifier */
  const __vue_module_identifier__ = undefined;
  /* functional template */
  const __vue_is_functional_template__ = false;
  /* style inject SSR */
  

  
  var Summ$1 = normalizeComponent_1(
    { render: __vue_render__, staticRenderFns: __vue_staticRenderFns__ },
    __vue_inject_styles__,
    __vue_script__,
    __vue_scope_id__,
    __vue_is_functional_template__,
    __vue_module_identifier__,
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
/* global jQuery */
let Tocca = function() {

  if (typeof document.createEvent !== 'function') return false // no tap events here
  // helpers
  var pointerEvent = function(type) {
      let lo = type.toLowerCase(),
        ms = 'MS' + type;
      return navigator.msPointerEnabled ? ms : window.PointerEvent ? lo : false
    },
    touchEvent = function(name) {
      return 'on' + name in window ? name : false
    },
    defaults = {
      useJquery:      typeof jQuery !== 'undefined',
      swipeThreshold:    100,
      tapThreshold:      150, // range of time where a tap event could be detected
      dbltapThreshold:   300, // delay needed to detect a double tap  originall 200
      longtapThreshold: 1000, // delay needed to detect a long tap
      tapPrecision:     60 / 2, // touch events boundaries ( 60px by default )
      justTouchEvents:  false
    },
    // was initially triggered a "touchstart" event?
    wasTouch = false,
    touchevents = {
      touchstart: touchEvent('touchstart') || pointerEvent('PointerDown' ),
      touchend:   touchEvent('touchend'  ) || pointerEvent('PointerUp'   ),
      touchmove:  touchEvent('touchmove' ) || pointerEvent('PointerMove' )
    },
    isTheSameFingerId = function(e) {
      return !e.pointerId || typeof pointerId === 'undefined' || e.pointerId === pointerId
    },
    setListener = function(elm, events, callback) {
      let eventsArray = events.split(' '),
        i = eventsArray.length;

      while (i--) {
        elm.addEventListener(eventsArray[i], callback, false);
      }
    },
    getPointerEvent = function(event) {
      return event.targetTouches ? event.targetTouches[0] : event
    },
    isMultipleTouches = function(event) {
      return event.targetTouches && event.targetTouches.length > 1
    },
    getTimestamp = function () {
      return new Date().getTime()
    },
    sendEvent = function(elm, eventName, originalEvent, data) {
      let customEvent = document.createEvent('Event');
      customEvent.originalEvent = originalEvent;
      data = data || {};
      data.x = currX;
      data.y = currY;
      //data.distance = data.distance

      // jquery
      if (defaults.useJquery) {
        customEvent = jQuery.Event(eventName, {originalEvent: originalEvent});
        jQuery(elm).trigger(customEvent, data);
      }

      // addEventListener
      if (customEvent.initEvent) {
        for (let key in data) {
          customEvent[key] = data[key];
        }

        customEvent.initEvent(eventName, true, true);
        elm.dispatchEvent(customEvent);
      }

      // detect all the inline events
      // also on the parent nodes
      while (elm) {
        // inline
        if (elm['on' + eventName])
          elm['on' + eventName](customEvent);
        elm = elm.parentNode;
      }

    },

    onTouchStart = function(e) {
      /**
       * Skip all the mouse events
       * events order:
       * Chrome:
       *   touchstart
       *   touchmove
       *   touchend
       *   mousedown
       *   mousemove
       *   mouseup <- this must come always after a "touchstart"
       *
       * Safari
       *   touchstart
       *   mousedown
       *   touchmove
       *   mousemove
       *   touchend
       *   mouseup <- this must come always after a "touchstart"
       */

      if (!isTheSameFingerId(e) || isMultipleTouches(e)) return

      pointerId = e.pointerId;

      // it looks like it was a touch event!
      if (e.type !== 'mousedown')
        wasTouch = true;

      // skip this event we don't need to track it now
      if (e.type === 'mousedown' && wasTouch) return

      let pointer = getPointerEvent(e);

      // caching the current x
      cachedX = currX = pointer.pageX;
      // caching the current y
      cachedY = currY = pointer.pageY;

      longtapTimer = setTimeout(function() {
        sendEvent(e.target, 'longtap', e);
        target = e.target;
      }, defaults.longtapThreshold);

      // we will use these variables on the touchend events
      timestamp = getTimestamp();

      tapNum++;

    },
    onTouchEnd = function(e) {
      if (!isTheSameFingerId(e) || isMultipleTouches(e)) return

      pointerId = undefined;

      // skip the mouse events if previously a touch event was dispatched
      // and reset the touch flag
      if (e.type === 'mouseup' && wasTouch) {
        wasTouch = false;
        return
      }

      let eventsArr = [],
        now = getTimestamp(),
        deltaY = cachedY - currY,
        deltaX = cachedX - currX;

      // clear the previous timer if it was set
      clearTimeout(dblTapTimer);
      // kill the long tap timer
      clearTimeout(longtapTimer);

      if (deltaX <= -defaults.swipeThreshold)
        eventsArr.push('swiperight');

      if (deltaX >= defaults.swipeThreshold)
        eventsArr.push('swipeleft');

      if (deltaY <= -defaults.swipeThreshold)
        eventsArr.push('swipedown');

      if (deltaY >= defaults.swipeThreshold)
        eventsArr.push('swipeup');

      if (eventsArr.length) {
        for (let i = 0; i < eventsArr.length; i++) {
          let eventName = eventsArr[i];
          sendEvent(e.target, eventName, e, {
            distance: {
              x: Math.abs(deltaX),
              y: Math.abs(deltaY)
            }
          });
        }
        // reset the tap counter
        tapNum = 0;
      } else {

        if (
          cachedX >= currX - defaults.tapPrecision &&
          cachedX <= currX + defaults.tapPrecision &&
          cachedY >= currY - defaults.tapPrecision &&
          cachedY <= currY + defaults.tapPrecision
        ) {
          if (timestamp + defaults.tapThreshold - now >= 0)
          {
            // Here you get the Tap event
            sendEvent(e.target, tapNum >= 2 && target === e.target ? 'dbltap' : 'tap', e);
            target= e.target;
          }
        }

        // reset the tap counter
        dblTapTimer = setTimeout(function() {
          tapNum = 0;
        }, defaults.dbltapThreshold);

      }
    },
    onTouchMove = function(e) {
      if (!isTheSameFingerId(e)) return
      // skip the mouse move events if the touch events were previously detected
      if (e.type === 'mousemove' && wasTouch) return

      let pointer = getPointerEvent(e);
      currX = pointer.pageX;
      currY = pointer.pageY;
    },

    setOptions = function(options) {   // Configure the tocca default options at any time
      for (let opt in options) {
        defaults[opt] = options[opt]; }
      return defaults
    },

    tapNum = 0,
    pointerId, currX, currY, cachedX, cachedY, timestamp, target, dblTapTimer, longtapTimer;

  //setting the events listeners
  // we need to debounce the callbacks because some devices multiple events are triggered at same time
  setListener( document, touchevents.touchstart + (defaults.justTouchEvents ? '' : ' mousedown'), onTouchStart );
  setListener( document, touchevents.touchend   + (defaults.justTouchEvents ? '' : ' mouseup'  ), onTouchEnd   );
  setListener( document, touchevents.touchmove  + (defaults.justTouchEvents ? '' : ' mousemove'), onTouchMove  );

  setOptions({});

};

var Touch;

Touch = class Touch {
  constructor(stream, dir) {
    this.stream = stream;
    this.dir = dir;
    this.tocca = Tocca();
    this.dirs = ['up', 'down', 'left', 'right'];
    this.evts = ['tap', 'dbltap', 'longtap', 'swipeleft', 'swipeup', 'swiperight', 'swipedown'];
  }

  onDir(elem) {
    this.tap(elem, function(e) {
      return this.dir.touch('next', e);
    });
    this.dbl(elem, function(e) {
      return this.dir.touch('next', e);
    });
    this.hold(elem, function(e) {
      return this.dir.touch('prev', e);
    });
    this.right(elem, function(e) {
      return this.dir.touch('west', e); // All directions reversed
    });
    this.down(elem, function(e) {
      return this.dir.touch('north', e);
    });
    this.left(elem, function(e) {
      return this.dir.touch('east', e);
    });
    this.up(elem, function(e) {
      return this.dir.touch('south', e);
    });
  }

  tap(elem, onEvent) {
    elem.addEventListener('tap', onEvent);
  }

  dbl(elem, onEvent) {
    elem.addEventListener('dbltap', onEvent);
  }

  hold(elem, onEvent) {
    elem.addEventListener('longtap', onEvent);
  }

  left(elem, onEvent) {
    elem.addEventListener('swipeleft', onEvent);
  }

  up(elem, onEvent) {
    elem.addEventListener('swipeup', onEvent);
  }

  right(elem, onEvent) {
    elem.addEventListener('swiperight', onEvent);
  }

  down(elem, onEvent) {
    elem.addEventListener('swipedown', onEvent);
  }

};

var Touch$1 = Touch;

//

var script = {

  data() { return { touch:null, elem:null }; },
  
  methods:{
    show:function() {
      return this.$route.name===null } },
  
  mounted: function () {
    this.$nextTick( function() {  // Enable touch events inside all views
      this.touch = new Touch$1( this.stream(), this.dir() );
      this.elem  = this.$refs['View'];
      this.touch.onDir( this.elem );
    } ); }
    
  };

/* script */
const __vue_script__$1 = script;

/* template */
var __vue_render__$1 = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c(
    "div",
    { ref: "View" },
    [
      _c("router-view", { attrs: { name: "Home" } }),
      _vm._v(" "),
      _c("router-view", { attrs: { name: "Flavor" } }),
      _vm._v(" "),
      _c("router-view", { attrs: { name: "Roast" } }),
      _vm._v(" "),
      _c("router-view", { attrs: { name: "Brew" } }),
      _vm._v(" "),
      _c("router-view", { attrs: { name: "Drink" } }),
      _vm._v(" "),
      _c("router-view", { attrs: { name: "Body" } }),
      _vm._v(" "),
      _c("router-view", { attrs: { name: "World" } }),
      _vm._v(" "),
      _c("router-view", { attrs: { name: "Region" } })
    ],
    1
  )
};
var __vue_staticRenderFns__$1 = [];
__vue_render__$1._withStripped = true;

  /* style */
  const __vue_inject_styles__$1 = undefined;
  /* scoped */
  const __vue_scope_id__$1 = undefined;
  /* module identifier */
  const __vue_module_identifier__$1 = undefined;
  /* functional template */
  const __vue_is_functional_template__$1 = false;
  /* style inject */
  
  /* style inject SSR */
  

  
  var View = normalizeComponent_1(
    { render: __vue_render__$1, staticRenderFns: __vue_staticRenderFns__$1 },
    __vue_inject_styles__$1,
    __vue_script__$1,
    __vue_scope_id__$1,
    __vue_is_functional_template__$1,
    __vue_module_identifier__$1,
    undefined,
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
const __vue_script__$2 = Navd;

/* template */
var __vue_render__$2 = function() {
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
var __vue_staticRenderFns__$2 = [];
__vue_render__$2._withStripped = true;

  /* style */
  const __vue_inject_styles__$2 = function (inject) {
    if (!inject) return
    inject("data-v-146f0664_0", { source: ".theme-desc {\n  font-size: 1rem;\n  background-color: #333;\n  border-radius: 0.7em;\n  width: 90%;\n  height: 90%;\n}\n.navd-pane {\n  background-color: black;\n}\n.navd-navd {\n  background-color: black;\n  color: wheat;\n  position: relative;\n  left: 15%;\n  top: 0;\n  width: 70%;\n  height: 100%;\n}\n.navd-navd .navd-west {\n  position: absolute;\n  left: 0;\n  top: 33%;\n  width: 25%;\n  height: 33%;\n  font-size: 5.2vmin;\n}\n.navd-navd .navd-north {\n  position: absolute;\n  left: 37.5%;\n  top: 0;\n  width: 25%;\n  height: 33%;\n  font-size: 5.2vmin;\n}\n.navd-navd .navd-next {\n  position: absolute;\n  left: 25%;\n  top: 42%;\n  width: 25%;\n  height: 33%;\n  font-size: 3.2vmin;\n}\n.navd-navd .navd-prev {\n  position: absolute;\n  left: 50%;\n  top: 42%;\n  width: 25%;\n  height: 33%;\n  font-size: 3.2vmin;\n}\n.navd-navd .navd-east {\n  position: absolute;\n  left: 75%;\n  top: 33%;\n  width: 25%;\n  height: 33%;\n  font-size: 5.2vmin;\n}\n.navd-navd .navd-south {\n  position: absolute;\n  left: 37.5%;\n  top: 66%;\n  width: 25%;\n  height: 33%;\n  font-size: 5.2vmin;\n}\n.navd-navd div {\n  display: grid;\n}\n.navd-navd div i {\n  justify-self: center;\n  align-self: center;\n}\n", map: {"version":3,"sources":["Navd.vue","/Users/ax/Documents/prj/aug/vue/dash/Navd.vue"],"names":[],"mappings":"AAAA;EACE,eAAe;EACf,sBAAsB;EACtB,oBAAoB;EACpB,UAAU;EACV,WAAW;AACb;AACA;EACE,uBAAuB;AACzB;AACA;EACE,uBAAuB;EACvB,YAAY;EACZ,kBAAkB;EAClB,SAAS;EACT,MAAM;EACN,UAAU;EACV,YAAY;AACd;AACA;EACE,kBAAkB;EAClB,OAAO;EACP,QAAQ;EACR,UAAU;EACV,WAAW;EACX,kBAAkB;AACpB;AACA;EACE,kBAAkB;EAClB,WAAW;EACX,MAAM;EACN,UAAU;EACV,WAAW;EACX,kBAAkB;AACpB;AACA;EACE,kBAAkB;EAClB,SAAS;ECCX,QAAA;EDCE,UAAU;ECCZ,WAAA;EDCE,kBAAkB;ACCpB;ADCA;ECCA,kBAAA;EACA,SAAA;EACA,QAAA;EACA,UAAA;EACA,WAAA;EACA,kBAAA;AACA;AACA;EACA,kBAAA;EACA,SAAA;EDCE,QAAQ;EACR,UAAU;EACV,WAAW;EACX,kBAAkB;AACpB;AACA;EACE,kBAAkB;EAClB,WAAW;EACX,QAAQ;EACR,UAAU;EACV,WAAW;EACX,kBAAkB;AACpB;AACA;EACE,aAAa;AACf;AACA;EACE,oBAAoB;EACpB,kBAAkB;AACpB","file":"Navd.vue","sourcesContent":[".theme-desc {\n  font-size: 1rem;\n  background-color: #333;\n  border-radius: 0.7em;\n  width: 90%;\n  height: 90%;\n}\n.navd-pane {\n  background-color: black;\n}\n.navd-navd {\n  background-color: black;\n  color: wheat;\n  position: relative;\n  left: 15%;\n  top: 0;\n  width: 70%;\n  height: 100%;\n}\n.navd-navd .navd-west {\n  position: absolute;\n  left: 0;\n  top: 33%;\n  width: 25%;\n  height: 33%;\n  font-size: 5.2vmin;\n}\n.navd-navd .navd-north {\n  position: absolute;\n  left: 37.5%;\n  top: 0;\n  width: 25%;\n  height: 33%;\n  font-size: 5.2vmin;\n}\n.navd-navd .navd-next {\n  position: absolute;\n  left: 25%;\n  top: 42%;\n  width: 25%;\n  height: 33%;\n  font-size: 3.2vmin;\n}\n.navd-navd .navd-prev {\n  position: absolute;\n  left: 50%;\n  top: 42%;\n  width: 25%;\n  height: 33%;\n  font-size: 3.2vmin;\n}\n.navd-navd .navd-east {\n  position: absolute;\n  left: 75%;\n  top: 33%;\n  width: 25%;\n  height: 33%;\n  font-size: 5.2vmin;\n}\n.navd-navd .navd-south {\n  position: absolute;\n  left: 37.5%;\n  top: 66%;\n  width: 25%;\n  height: 33%;\n  font-size: 5.2vmin;\n}\n.navd-navd div {\n  display: grid;\n}\n.navd-navd div i {\n  justify-self: center;\n  align-self: center;\n}\n","\n<template>\n  <div     class=\"navd-pane\">\n    <div   class=\"navd-navd\"  ref=\"navd\">\n      <div class=\"navd-west\"  ref=\"west\"  @click=\"doDir('west' )\"><i class=\"fas fa-angle-left\"  ></i></div>\n      <div class=\"navd-north\" ref=\"north\" @click=\"doDir('north')\"><i class=\"fas fa-angle-up\"    ></i></div>\n      <div class=\"navd-next\"  ref=\"next\"  @click=\"doDir('next')\" ><i class=\"fas fa-plus-circle\" ></i></div>\n      <div class=\"navd-prev\"  ref=\"prev\"  @click=\"doDir('prev')\" ><i class=\"fas fa-minus-circle\"></i></div>\n      <div class=\"navd-east\"  ref=\"east\"  @click=\"doDir('east' )\"><i class=\"fas fa-angle-right\" ></i></div>\n      <div class=\"navd-south\" ref=\"south\" @click=\"doDir('south')\"><i class=\"fas fa-angle-down\"  ></i></div>\n    </div>\n  </div>\n</template>\n\n<script type=\"module\">\n  \n  let Navd = {\n    \n    name: 'navd',\n    \n    methods: {\n      doDir: function( dir ) {\n        if( this.isDir() ) {\n            this.dir().touch( dir ); }\n        else if( this.isNav() ) {\n            this.nav().dir( dir ); }\n        else {\n          console.error( 'NavddoDir() no direction navigator' ); } } },\n    \n    mounted: function () {}\n  };\n\n  export default Navd;\n  \n</script>\n\n<style lang=\"less\">\n  \n  @import '../../pub/css/themes/theme.less';\n  \n  @navdFS:2*@themeFS;\n  \n  .navd-pane { background-color:@theme-back; }\n  \n  .navd-navd { background-color:@theme-back; color:@theme-fore;\n                  position:relative; left:15.0%; top:0;   width:70%; height:100%;\n    .navd-west  { position:absolute; left:0;     top:33%; width:25%; height: 33%; font-size:1.3*@navdFS; }\n    .navd-north { position:absolute; left:37.5%; top:0;   width:25%; height: 33%; font-size:1.3*@navdFS; }\n    .navd-next  { position:absolute; left:25.0%; top:42%; width:25%; height: 33%; font-size:0.8*@navdFS; }\n    .navd-prev  { position:absolute; left:50.0%; top:42%; width:25%; height: 33%; font-size:0.8*@navdFS; }\n    .navd-east  { position:absolute; left:75.0%; top:33%; width:25%; height: 33%; font-size:1.3*@navdFS; }\n    .navd-south { position:absolute; left:37.5%; top:66%; width:25%; height: 33%; font-size:1.3*@navdFS; }\n    div    { display:grid;\n      i    { justify-self:center; align-self:center; } } }\n  \n</style>\n"]}, media: undefined });

  };
  /* scoped */
  const __vue_scope_id__$2 = undefined;
  /* module identifier */
  const __vue_module_identifier__$2 = undefined;
  /* functional template */
  const __vue_is_functional_template__$2 = false;
  /* style inject SSR */
  

  
  var Navd$1 = normalizeComponent_1(
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

let Dash = {
    name: 'dash',
    components: { 'd-view':View, 'd-navd':Navd$1 },
  
  data() { return { comp:'Dash', orient:'portrait' } },
  
  methods: {
    classOrient: function() {
      return this.orient; },
    onOrient: function( orient ) {
      this.orient = orient; } },

  mounted: function () {
    this.publish( 'Nav', 'Dash' ); }
  
};

/* script */
const __vue_script__$3 = Dash;

/* template */
var __vue_render__$3 = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c("div", { staticClass: "dash-pane" }, [
    _c(
      "div",
      { class: _vm.classOrient() },
      [
        _c("d-view", { attrs: { id: "dashview" } }),
        _vm._v(" "),
        _c("d-navd", { attrs: { id: "dashnavd" } })
      ],
      1
    )
  ])
};
var __vue_staticRenderFns__$3 = [];
__vue_render__$3._withStripped = true;

  /* style */
  const __vue_inject_styles__$3 = function (inject) {
    if (!inject) return
    inject("data-v-09c00875_0", { source: ".theme-desc {\n  font-size: 1rem;\n  background-color: #333;\n  border-radius: 0.7em;\n  width: 90%;\n  height: 90%;\n}\n.dash-pane {\n  position: absolute;\n  left: 0;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  font-family: Roboto, sans-serif;\n}\n.dash-pane .portrait {\n  background-image: url(\"../../css/phone/portrait.png\");\n  background-repeat: no-repeat;\n  position: absolute;\n  left: 0;\n  top: 0;\n  width: 432px;\n  height: 864px;\n}\n.dash-pane .portrait #dashview {\n  position: absolute;\n  left: 33px;\n  top: 108px;\n  width: 365px;\n  height: 658px;\n  font-size: 2vmin;\n  background-color: black;\n  border-radius: 4vmin;\n}\n.dash-pane .portrait #dashnavd {\n  position: absolute;\n  left: 146px;\n  top: 770px;\n  width: 140px;\n  height: 90px;\n  font-size: 2vmin;\n  background-color: black;\n  border-radius: 4vmin;\n  font-size: 1rem;\n  border-radius: 36px;\n}\n.dash-pane .landscape {\n  background-image: url(\"../../css/phone/landscape.png\");\n  background-repeat: no-repeat;\n  position: absolute;\n  left: 0;\n  top: 0;\n  width: 864px;\n  height: 432px;\n}\n.dash-pane .landscape #dashview {\n  position: absolute;\n  left: 108px;\n  top: 33px;\n  width: 658px;\n  height: 365px;\n  font-size: 2vmin;\n  background-color: black;\n  border-radius: 4vmin;\n}\n.dash-pane .landscape #dashlogo {\n  position: absolute;\n  left: 760px;\n  top: 166px;\n  width: 120px;\n  height: 90px;\n  font-size: 2vmin;\n  background-color: black;\n  border-radius: 4vmin;\n}\n", map: {"version":3,"sources":["Dash.vue","/Users/ax/Documents/prj/aug/vue/jitter/Dash.vue"],"names":[],"mappings":"AAAA;EACE,eAAe;EACf,sBAAsB;EACtB,oBAAoB;EACpB,UAAU;EACV,WAAW;AACb;AACA;EACE,kBAAkB;EAClB,OAAO;EACP,MAAM;EACN,QAAQ;EACR,SAAS;EACT,+BAA+B;AACjC;AACA;EACE,qDAAqD;EACrD,4BAA4B;EAC5B,kBAAkB;EAClB,OAAO;EACP,MAAM;EACN,YAAY;EACZ,aAAa;AACf;AACA;EACE,kBAAkB;EAClB,UAAU;EACV,UAAU;EACV,YAAY;EACZ,aAAa;EACb,gBAAgB;EAChB,uBAAuB;EACvB,oBAAoB;AACtB;AACA;EACE,kBAAkB;EAClB,WAAW;EACX,UAAU;ECCZ,YAAA;EDCE,YAAY;ECCd,gBAAA;EACA,uBAAA;EDCE,oBAAoB;ECCtB,eAAA;EACA,mBAAA;ADCA;ACCA;EDCE,sDAAsD;ECCxD,4BAAA;EACA,kBAAA;EACA,OAAA;EACA,MAAA;EACA,YAAA;EDCE,aAAa;ACCf;AACA;EACA,kBAAA;EACA,WAAA;EDCE,SAAS;ECCX,YAAA;EDCE,aAAa;EACb,gBAAgB;EAChB,uBAAuB;EACvB,oBAAoB;AACtB;AACA;EACE,kBAAkB;EAClB,WAAW;EACX,UAAU;EACV,YAAY;EACZ,YAAY;EACZ,gBAAgB;EAChB,uBAAuB;EACvB,oBAAoB;AACtB","file":"Dash.vue","sourcesContent":[".theme-desc {\n  font-size: 1rem;\n  background-color: #333;\n  border-radius: 0.7em;\n  width: 90%;\n  height: 90%;\n}\n.dash-pane {\n  position: absolute;\n  left: 0;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  font-family: Roboto, sans-serif;\n}\n.dash-pane .portrait {\n  background-image: url(\"../../css/phone/portrait.png\");\n  background-repeat: no-repeat;\n  position: absolute;\n  left: 0;\n  top: 0;\n  width: 432px;\n  height: 864px;\n}\n.dash-pane .portrait #dashview {\n  position: absolute;\n  left: 33px;\n  top: 108px;\n  width: 365px;\n  height: 658px;\n  font-size: 2vmin;\n  background-color: black;\n  border-radius: 4vmin;\n}\n.dash-pane .portrait #dashnavd {\n  position: absolute;\n  left: 146px;\n  top: 770px;\n  width: 140px;\n  height: 90px;\n  font-size: 2vmin;\n  background-color: black;\n  border-radius: 4vmin;\n  font-size: 1rem;\n  border-radius: 36px;\n}\n.dash-pane .landscape {\n  background-image: url(\"../../css/phone/landscape.png\");\n  background-repeat: no-repeat;\n  position: absolute;\n  left: 0;\n  top: 0;\n  width: 864px;\n  height: 432px;\n}\n.dash-pane .landscape #dashview {\n  position: absolute;\n  left: 108px;\n  top: 33px;\n  width: 658px;\n  height: 365px;\n  font-size: 2vmin;\n  background-color: black;\n  border-radius: 4vmin;\n}\n.dash-pane .landscape #dashlogo {\n  position: absolute;\n  left: 760px;\n  top: 166px;\n  width: 120px;\n  height: 90px;\n  font-size: 2vmin;\n  background-color: black;\n  border-radius: 4vmin;\n}\n","\n<template>\n  <div class=\"dash-pane\">\n    <div :class=\"classOrient()\">\n      <d-view id=\"dashview\"></d-view>\n      <d-navd id=\"dashnavd\"></d-navd>\n    </div>\n  </div>\n</template>\n\n<script type=\"module\">\n  \n  import View from './View.vue';\n  import Navd from '../dash/Navd.vue';\n  \n  let Dash = {\n      name: 'dash',\n      components: { 'd-view':View, 'd-navd':Navd },\n    \n    data() { return { comp:'Dash', orient:'portrait' } },\n    \n    methods: {\n      classOrient: function() {\n        return this.orient; },\n      onOrient: function( orient ) {\n        this.orient = orient; } },\n\n    mounted: function () {\n      this.publish( 'Nav', 'Dash' ); }\n    \n  };\n  \n  export default Dash;\n  \n</script>\n\n<style lang=\"less\">\n  \n  @import '../../pub/css/themes/theme.less';\n  \n  @portrait: \"../../css/phone/portrait.png\";\n  @landscape:\"../../css/phone/landscape.png\";\n  \n  @dashFS:@themeFS;\n  @dash-theme: { font-size:@dashFS; background-color:@theme-back; border-radius:2.0*@dashFS; }\n\n  .dash-pane {   position:absolute; left:0; top:0; right:0; bottom:0; font-family:@theme-font-family;\n    \n    .portrait {  background-image:url(@portrait);  background-repeat: no-repeat;\n                  position:absolute; left: 0;    top:0;     width:432px; height:864px;\n      #dashview { position:absolute; left: 33px; top:108px; width:365px; height:658px; @dash-theme(); }\n      #dashnavd { position:absolute; left:146px; top:770px; width:140px; height: 90px; @dash-theme();\n        font-size:1.0rem;              border-radius:36px; } }\n    \n    .landscape { background-image:url(@landscape); background-repeat: no-repeat;\n              position:absolute; left:0;     top:0;    width:864px; height:432px;\n      #dashview { position:absolute; left:108px; top: 33px; width:658px; height:365px; @dash-theme(); }\n      #dashlogo { position:absolute; left:760px; top:166px; width:120px; height: 90px; @dash-theme(); } }\n    \n }\n  \n</style>\n\n"]}, media: undefined });

  };
  /* scoped */
  const __vue_scope_id__$3 = undefined;
  /* module identifier */
  const __vue_module_identifier__$3 = undefined;
  /* functional template */
  const __vue_is_functional_template__$3 = false;
  /* style inject SSR */
  

  
  var Dash$1 = normalizeComponent_1(
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

let Home = {

  components:{ 'h-summ':Summ$1 },

data() { return { comp:'Home' }; },

methods:{
  route: function( comp ) {
      this.dir().doRoute( comp ); } },

 mounted: function () {}
};

Home.Dash = Dash$1;

/* script */
const __vue_script__$4 = Home;

/* template */
var __vue_render__$4 = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c("div", { staticClass: "home-pane" }, [
    _vm._m(0),
    _vm._v(" "),
    _c("div", { staticClass: "home-summ" }, [
      _c(
        "div",
        {
          staticClass: "home-flavor",
          on: {
            click: function($event) {
              return _vm.route("Flavor")
            }
          }
        },
        [_c("h-summ", { attrs: { name: "Flavor", id: "SFlavor" } })],
        1
      ),
      _vm._v(" "),
      _c(
        "div",
        {
          staticClass: "home-roast",
          on: {
            click: function($event) {
              return _vm.route("Roast")
            }
          }
        },
        [_c("h-summ", { attrs: { name: "Roast", id: "SRoast" } })],
        1
      ),
      _vm._v(" "),
      _c(
        "div",
        {
          staticClass: "home-brew",
          on: {
            click: function($event) {
              return _vm.route("Brew")
            }
          }
        },
        [_c("h-summ", { attrs: { name: "Brew", id: "SBrew" } })],
        1
      ),
      _vm._v(" "),
      _c(
        "div",
        {
          staticClass: "home-drink",
          on: {
            click: function($event) {
              return _vm.route("Drink")
            }
          }
        },
        [_c("h-summ", { attrs: { name: "Drink", id: "SDrink" } })],
        1
      ),
      _vm._v(" "),
      _c(
        "div",
        {
          staticClass: "home-body",
          on: {
            click: function($event) {
              return _vm.route("Body")
            }
          }
        },
        [_c("h-summ", { attrs: { name: "Body", id: "SBody" } })],
        1
      )
    ])
  ])
};
var __vue_staticRenderFns__$4 = [
  function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c("div", { staticClass: "home-head" }, [
      _c("h1", [_vm._v("Jitter")])
    ])
  }
];
__vue_render__$4._withStripped = true;

  /* style */
  const __vue_inject_styles__$4 = function (inject) {
    if (!inject) return
    inject("data-v-30b1ce6a_0", { source: ".theme-desc {\n  font-size: 1rem;\n  background-color: #333;\n  border-radius: 0.7em;\n  width: 90%;\n  height: 90%;\n}\n.home-pane {\n  position: absolute;\n  left: 0;\n  top: 0;\n  width: 100%;\n  height: 100%;\n  background-color: black;\n  color: wheat;\n}\n.home-pane .home-head {\n  position: absolute;\n  left: 0;\n  top: 0;\n  width: 100%;\n  height: 20%;\n  border: 1px solid wheat;\n  display: grid;\n  justify-items: center;\n  align-items: center;\n  text-align: center;\n}\n.home-pane .home-head h1 {\n  font-size: 2vmin;\n}\n.home-pane .home-head h2 {\n  font-size: 3vmin;\n}\n.home-pane .home-summ {\n  position: absolute;\n  left: 0;\n  top: 20%;\n  width: 100%;\n  height: 80%;\n}\n.home-pane .home-summ .home-flavor {\n  position: absolute;\n  left: 0;\n  top: 0;\n  width: 100%;\n  height: 20%;\n}\n.home-pane .home-summ .home-roast {\n  position: absolute;\n  left: 0;\n  top: 20%;\n  width: 100%;\n  height: 20%;\n}\n.home-pane .home-summ .home-brew {\n  position: absolute;\n  left: 0;\n  top: 40%;\n  width: 100%;\n  height: 20%;\n}\n.home-pane .home-summ .home-drink {\n  position: absolute;\n  left: 0;\n  top: 60%;\n  width: 100%;\n  height: 20%;\n}\n.home-pane .home-summ .home-body {\n  position: absolute;\n  left: 0;\n  top: 80%;\n  width: 100%;\n  height: 20%;\n}\n", map: {"version":3,"sources":["Home.vue","/Users/ax/Documents/prj/aug/vue/jitter/Home.vue"],"names":[],"mappings":"AAAA;EACE,eAAe;EACf,sBAAsB;EACtB,oBAAoB;EACpB,UAAU;EACV,WAAW;AACb;AACA;EACE,kBAAkB;EAClB,OAAO;EACP,MAAM;EACN,WAAW;EACX,YAAY;EACZ,uBAAuB;EACvB,YAAY;AACd;AACA;EACE,kBAAkB;EAClB,OAAO;EACP,MAAM;EACN,WAAW;EACX,WAAW;EACX,uBAAuB;EACvB,aAAa;EACb,qBAAqB;EACrB,mBAAmB;EACnB,kBAAkB;AACpB;AACA;EACE,gBAAgB;AAClB;AACA;EACE,gBAAgB;AAClB;AACA;EACE,kBAAkB;EAClB,OAAO;EACP,QAAQ;EACR,WAAW;EACX,WAAW;AACb;ACCA;EDCE,kBAAkB;EAClB,OAAO;ECCT,MAAA;EACA,WAAA;EDCE,WAAW;ACCb;AACA;EACA,kBAAA;EACA,OAAA;EDCE,QAAQ;ECCV,WAAA;EACA,WAAA;AACA;AACA;EACA,kBAAA;EACA,OAAA;EDCE,QAAQ;ECCV,WAAA;EDCE,WAAW;AACb;AACA;EACE,kBAAkB;EAClB,OAAO;EACP,QAAQ;EACR,WAAW;EACX,WAAW;AACb;AACA;EACE,kBAAkB;EAClB,OAAO;EACP,QAAQ;EACR,WAAW;EACX,WAAW;AACb","file":"Home.vue","sourcesContent":[".theme-desc {\n  font-size: 1rem;\n  background-color: #333;\n  border-radius: 0.7em;\n  width: 90%;\n  height: 90%;\n}\n.home-pane {\n  position: absolute;\n  left: 0;\n  top: 0;\n  width: 100%;\n  height: 100%;\n  background-color: black;\n  color: wheat;\n}\n.home-pane .home-head {\n  position: absolute;\n  left: 0;\n  top: 0;\n  width: 100%;\n  height: 20%;\n  border: 1px solid wheat;\n  display: grid;\n  justify-items: center;\n  align-items: center;\n  text-align: center;\n}\n.home-pane .home-head h1 {\n  font-size: 2vmin;\n}\n.home-pane .home-head h2 {\n  font-size: 3vmin;\n}\n.home-pane .home-summ {\n  position: absolute;\n  left: 0;\n  top: 20%;\n  width: 100%;\n  height: 80%;\n}\n.home-pane .home-summ .home-flavor {\n  position: absolute;\n  left: 0;\n  top: 0;\n  width: 100%;\n  height: 20%;\n}\n.home-pane .home-summ .home-roast {\n  position: absolute;\n  left: 0;\n  top: 20%;\n  width: 100%;\n  height: 20%;\n}\n.home-pane .home-summ .home-brew {\n  position: absolute;\n  left: 0;\n  top: 40%;\n  width: 100%;\n  height: 20%;\n}\n.home-pane .home-summ .home-drink {\n  position: absolute;\n  left: 0;\n  top: 60%;\n  width: 100%;\n  height: 20%;\n}\n.home-pane .home-summ .home-body {\n  position: absolute;\n  left: 0;\n  top: 80%;\n  width: 100%;\n  height: 20%;\n}\n","\n<template>\n  <div     class=\"home-pane\">\n    <div   class=\"home-head\"><h1>Jitter</h1></div>\n    <div   class=\"home-summ\">\n      <div class=\"home-flavor\" @click=\"route('Flavor')\"><h-summ name=\"Flavor\" id=\"SFlavor\"></h-summ></div>\n      <div class=\"home-roast\"  @click=\"route('Roast')\" ><h-summ name=\"Roast\"  id=\"SRoast\"></h-summ></div>\n      <div class=\"home-brew\"   @click=\"route('Brew')\"  ><h-summ name=\"Brew\"   id=\"SBrew\" ></h-summ></div>\n      <div class=\"home-drink\"  @click=\"route('Drink')\" ><h-summ name=\"Drink\"  id=\"SDrink\"></h-summ></div>\n      <div class=\"home-body\"   @click=\"route('Body')\"  ><h-summ name=\"Body\"   id=\"SBody\" ></h-summ></div>\n    </div>\n  </div>\n</template>\n\n<script type=\"module\">\n\n  import Summ from './Summ.vue';\n  \n  let Home = {\n\n    components:{ 'h-summ':Summ },\n\n  data() { return { comp:'Home' }; },\n  \n  methods:{\n    route: function( comp ) {\n        this.dir().doRoute( comp ); } },\n\n   mounted: function () {}\n  }\n\n  import Dash from './Dash.vue';\n\n  Home.Dash = Dash;\n  \n  export default Home;\n  \n</script>\n\n<style lang=\"less\">\n  \n  @import '../../pub/css/themes/theme.less';\n  \n  \n  .home-pane { position:absolute; left:0; top:0; width:100%; height:100%;\n    background-color:@theme-back; color:@theme-fore;\n\n    .home-head { position:absolute; left:0; top:0; width:100%; height:20%; border:1px solid @theme-fore;\n            display:grid;justify-items:center; align-items:center; text-align:center;\n      h1 { font-size:@theme-h1-FS; }\n      h2 { font-size:@theme-h2-FS; } }\n      \n    .home-summ{  position:absolute; left:0; top:20%; width:100%; height:80%;\n      .home-flavor { position:absolute; left:0; top:0;   width:100%; height:20%; }\n      .home-roast  { position:absolute; left:0; top:20%; width:100%; height:20%; }\n      .home-brew   { position:absolute; left:0; top:40%; width:100%; height:20%; }\n      .home-drink  { position:absolute; left:0; top:60%; width:100%; height:20%; }\n      .home-body   { position:absolute; left:0; top:80%; width:100%; height:20%; } }\n    \n  }\n\n</style>"]}, media: undefined });

  };
  /* scoped */
  const __vue_scope_id__$4 = undefined;
  /* module identifier */
  const __vue_module_identifier__$4 = undefined;
  /* functional template */
  const __vue_is_functional_template__$4 = false;
  /* style inject SSR */
  

  
  var Home$1 = normalizeComponent_1(
    { render: __vue_render__$4, staticRenderFns: __vue_staticRenderFns__$4 },
    __vue_inject_styles__$4,
    __vue_script__$4,
    __vue_scope_id__$4,
    __vue_is_functional_template__$4,
    __vue_module_identifier__$4,
    browser,
    undefined
  );

export default Home$1;
