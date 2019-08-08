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
  constructor() {
    this.tocca = Tocca();
    this.dirs = ['up', 'down', 'left', 'right'];
    this.evts = ['tap', 'dbltap', 'longtap', 'swipeleft', 'swipeup', 'swiperight', 'swipedown'];
  }

  onNav(elem, nav) {
    this.tap(elem, function(e) {
      return nav.dir('next', e);
    });
    this.dbl(elem, function(e) {
      return nav.dir('next', e);
    });
    this.hold(elem, function(e) {
      return nav.dir('prev', e);
    });
    this.right(elem, function(e) {
      return nav.dir('west', e); // All directions reversed
    });
    this.down(elem, function(e) {
      return nav.dir('north', e);
    });
    this.left(elem, function(e) {
      return nav.dir('east', e);
    });
    this.up(elem, function(e) {
      return nav.dir('south', e);
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
      this.touch = new Touch$1();
      this.elem  = this.$refs['View'];
      this.touch.onNav( this.elem, this.nav() );
      this.nav().set( { $router:this.$router } );
    } ); }
    
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

/* script */
const __vue_script__ = script;

/* template */
var __vue_render__ = function() {
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
var __vue_staticRenderFns__ = [];
__vue_render__._withStripped = true;

  /* style */
  const __vue_inject_styles__ = undefined;
  /* scoped */
  const __vue_scope_id__ = undefined;
  /* module identifier */
  const __vue_module_identifier__ = undefined;
  /* functional template */
  const __vue_is_functional_template__ = false;
  /* style inject */
  
  /* style inject SSR */
  

  
  var View = normalizeComponent_1(
    { render: __vue_render__, staticRenderFns: __vue_staticRenderFns__ },
    __vue_inject_styles__,
    __vue_script__,
    __vue_scope_id__,
    __vue_is_functional_template__,
    __vue_module_identifier__,
    undefined,
    undefined
  );

//

let Dash = {
    name: 'dash',
    components: {'d-view':View },
  
  data() { return { comp:'Dash', orient:'portrait' } },
  
  methods: {
    classOrient: function() {
      return this.orient; },
    onOrient: function( orient ) {
      this.orient = orient; } },

  mounted: function () {
    this.publish( 'Nav', 'Dash' ); }




};

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
const __vue_script__$1 = Dash;

/* template */
var __vue_render__$1 = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c("div", { staticClass: "dash" }, [
    _c(
      "div",
      { class: _vm.classOrient() },
      [_c("d-view", { attrs: { id: "view" } })],
      1
    )
  ])
};
var __vue_staticRenderFns__$1 = [];
__vue_render__$1._withStripped = true;

  /* style */
  const __vue_inject_styles__$1 = function (inject) {
    if (!inject) return
    inject("data-v-91583d56_0", { source: ".theme-logo {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-menu {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-find {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-tocs {\n  background-color: black;\n  font-size: 2.5rem;\n}\n.theme-view {\n  font-size: 1.5rem;\n}\n.theme-side {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-pref {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-foot {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-trak {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.dash {\n  position: absolute;\n  left: 0;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  font-family: Roboto, sans-serif;\n}\n.dash .portrait {\n  background-image: url(../../../aug/pub/css/phone/portrait.png);\n  background-repeat: no-repeat;\n  position: absolute;\n  left: 0;\n  top: 0;\n  width: 432px;\n  height: 864px;\n}\n.dash .portrait #view {\n  position: absolute;\n  left: 33px;\n  top: 108px;\n  width: 365px;\n  height: 658px;\n  font-size: 1.5rem;\n}\n.dash .landscape {\n  background-image: url(../../../aug/pub/css/phone/landscape.png);\n  background-repeat: no-repeat;\n  position: absolute;\n  left: 0;\n  top: 0;\n  width: 864px;\n  height: 432px;\n}\n.dash .landscape #view {\n  position: absolute;\n  left: 108px;\n  top: 33px;\n  width: 658px;\n  height: 365px;\n  font-size: 1.5rem;\n}\n", map: {"version":3,"sources":["Dash.vue","/Users/ax/Documents/prj/aug/vue/jitter/Dash.vue"],"names":[],"mappings":"AAAA;EACE,uBAAuB;EACvB,iBAAiB;AACnB;AACA;EACE,uBAAuB;EACvB,iBAAiB;AACnB;AACA;EACE,uBAAuB;EACvB,iBAAiB;AACnB;AACA;EACE,uBAAuB;EACvB,iBAAiB;AACnB;AACA;EACE,iBAAiB;AACnB;AACA;EACE,uBAAuB;EACvB,iBAAiB;AACnB;AACA;EACE,uBAAuB;EACvB,iBAAiB;AACnB;AACA;EACE,uBAAuB;EACvB,iBAAiB;AACnB;AACA;EACE,uBAAuB;EACvB,iBAAiB;AACnB;AACA;EACE,kBAAkB;EAClB,OAAO;EACP,MAAM;ECCR,QAAA;EDCE,SAAS;ECCX,+BAAA;ADCA;ACCA;EACA,8DAAA;EACA,4BAAA;EDCE,kBAAkB;ECCpB,OAAA;EACA,MAAA;EACA,YAAA;EDCE,aAAa;ACCf;ADCA;EACE,kBAAkB;EAClB,UAAU;EACV,UAAU;EACV,YAAY;EACZ,aAAa;EACb,iBAAiB;AACnB;AACA;EACE,+DAA+D;EAC/D,4BAA4B;EAC5B,kBAAkB;EAClB,OAAO;EACP,MAAM;EACN,YAAY;EACZ,aAAa;AACf;AACA;EACE,kBAAkB;EAClB,WAAW;EACX,SAAS;EACT,YAAY;EACZ,aAAa;EACb,iBAAiB;AACnB","file":"Dash.vue","sourcesContent":[".theme-logo {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-menu {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-find {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-tocs {\n  background-color: black;\n  font-size: 2.5rem;\n}\n.theme-view {\n  font-size: 1.5rem;\n}\n.theme-side {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-pref {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-foot {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-trak {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.dash {\n  position: absolute;\n  left: 0;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  font-family: Roboto, sans-serif;\n}\n.dash .portrait {\n  background-image: url(../../../aug/pub/css/phone/portrait.png);\n  background-repeat: no-repeat;\n  position: absolute;\n  left: 0;\n  top: 0;\n  width: 432px;\n  height: 864px;\n}\n.dash .portrait #view {\n  position: absolute;\n  left: 33px;\n  top: 108px;\n  width: 365px;\n  height: 658px;\n  font-size: 1.5rem;\n}\n.dash .landscape {\n  background-image: url(../../../aug/pub/css/phone/landscape.png);\n  background-repeat: no-repeat;\n  position: absolute;\n  left: 0;\n  top: 0;\n  width: 864px;\n  height: 432px;\n}\n.dash .landscape #view {\n  position: absolute;\n  left: 108px;\n  top: 33px;\n  width: 658px;\n  height: 365px;\n  font-size: 1.5rem;\n}\n","\n<template>\n  <div class=\"dash\">\n    <div :class=\"classOrient()\">\n      <d-view id=\"view\"></d-view>\n    </div>\n  </div>\n</template>\n\n<script type=\"module\">\n  \n  import View from './View.vue';\n  \n  let Dash = {\n      name: 'dash',\n      components: {'d-view':View },\n    \n    data() { return { comp:'Dash', orient:'portrait' } },\n    \n    methods: {\n      classOrient: function() {\n        return this.orient; },\n      onOrient: function( orient ) {\n        this.orient = orient; } },\n\n    mounted: function () {\n      this.publish( 'Nav', 'Dash' ); }\n\n\n  \n  \n  };\n  \n  export default Dash;\n  \n</script>\n\n<style lang=\"less\">\n  \n  @import '../../pub/css/themes/theme.less';\n\n  .dash {   position:absolute; left:0; top:0; right:0; bottom:0; font-family:@theme-font-family;\n    \n    .portrait {  background-image:url(../../../aug/pub/css/phone/portrait.png);  background-repeat: no-repeat;\n              position:absolute; left:0;     top:0;     width:432px; height:864px;\n      #view { position:absolute; left:33px;  top:108px; width:365px; height:658px;  .theme-view; } }\n    \n    .landscape { background-image:url(../../../aug/pub/css/phone/landscape.png); background-repeat: no-repeat;\n              position:absolute; left:0;     top:0;    width:864px; height:432px;\n      #view { position:absolute; left:108px; top:33px; width:658px; height:365px;  .theme-view; } }\n    \n }\n  \n</style>\n\n"]}, media: undefined });

  };
  /* scoped */
  const __vue_scope_id__$1 = undefined;
  /* module identifier */
  const __vue_module_identifier__$1 = undefined;
  /* functional template */
  const __vue_is_functional_template__$1 = false;
  /* style inject SSR */
  

  
  var Dash$1 = normalizeComponent_1(
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


let Home = {

data() { return { comp:'Home' } },

methods:{
  route: function( comp ) {
      this.nav().route( comp, {} ); } },

 mounted: function () {
     this.publish( 'Nav', 'Home' ); }
};

Home.Dash = Dash$1;

/* script */
const __vue_script__$2 = Home;

/* template */
var __vue_render__$2 = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c("div", { staticClass: "home" }, [
    _vm._m(0),
    _vm._v(" "),
    _c("div", { staticClass: "summary" }, [
      _c(
        "div",
        {
          staticClass: "r1c1",
          on: {
            click: function($event) {
              return _vm.route("Flavor")
            }
          }
        },
        [_vm._v("Flavor:")]
      ),
      _vm._v(" "),
      _c("div", { staticClass: "r1c2" }, [_vm._v("F1")]),
      _c("div", { staticClass: "r1c3" }, [_vm._v("F2")]),
      _c("div", { staticClass: "r1c4" }, [_vm._v("F3")]),
      _vm._v(" "),
      _c(
        "div",
        {
          staticClass: "r2c1",
          on: {
            click: function($event) {
              return _vm.route("Roast")
            }
          }
        },
        [_vm._v("Roast: ")]
      ),
      _vm._v(" "),
      _c("div", { staticClass: "r2c2" }, [_vm._v("R1")]),
      _c("div", { staticClass: "r2c3" }, [_vm._v("R2")]),
      _c("div", { staticClass: "r2c4" }, [_vm._v("R3")]),
      _vm._v(" "),
      _c(
        "div",
        {
          staticClass: "r3c1",
          on: {
            click: function($event) {
              return _vm.route("Brew")
            }
          }
        },
        [_vm._v("Brew:  ")]
      ),
      _vm._v(" "),
      _c("div", { staticClass: "r3c2" }, [_vm._v("B1")]),
      _c("div", { staticClass: "r3c3" }, [_vm._v("B2")]),
      _c("div", { staticClass: "r3c4" }, [_vm._v("B3")]),
      _vm._v(" "),
      _c(
        "div",
        {
          staticClass: "r4c1",
          on: {
            click: function($event) {
              return _vm.route("Drink")
            }
          }
        },
        [_vm._v("Drink: ")]
      ),
      _vm._v(" "),
      _c("div", { staticClass: "r4c2" }, [_vm._v("D1")]),
      _c("div", { staticClass: "r4c3" }, [_vm._v("D2")]),
      _c("div", { staticClass: "r4c4" }, [_vm._v("D3")]),
      _vm._v(" "),
      _c(
        "div",
        {
          staticClass: "r5c1",
          on: {
            click: function($event) {
              return _vm.route("Body")
            }
          }
        },
        [_vm._v("Body:  ")]
      ),
      _vm._v(" "),
      _c("div", { staticClass: "r5c2" }, [_vm._v("S1")]),
      _c("div", { staticClass: "r5c3" }, [_vm._v("S2")]),
      _c("div", { staticClass: "r5c4" }, [_vm._v("S3")])
    ])
  ])
};
var __vue_staticRenderFns__$2 = [
  function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c("div", { staticClass: "head" }, [
      _c("h1", [_vm._v("Welcome to the Jitter Mobile App")])
    ])
  }
];
__vue_render__$2._withStripped = true;

  /* style */
  const __vue_inject_styles__$2 = function (inject) {
    if (!inject) return
    inject("data-v-affc97e2_0", { source: ".theme-logo {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-menu {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-find {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-tocs {\n  background-color: black;\n  font-size: 2.5rem;\n}\n.theme-view {\n  font-size: 1.5rem;\n}\n.theme-side {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-pref {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-foot {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-trak {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.home {\n  position: absolute;\n  left: 0;\n  top: 0;\n  width: 100%;\n  height: 100%;\n  background-color: black;\n  color: wheat;\n}\n.home .head {\n  position: absolute;\n  left: 0;\n  top: 0;\n  width: 100%;\n  height: 20%;\n  display: grid;\n  justify-items: center;\n  align-items: center;\n  text-align: center;\n}\n.home .head h1 {\n  font-size: 2rem;\n}\n.home .head h2 {\n  font-size: 1.5rem;\n}\n.home .summary {\n  display: grid;\n  grid-template-rows: 20fr 20fr 20fr 20fr 20fr;\n  grid-template-columns: 40fr 20fr 20fr 20fr;\n  grid-template-areas: \"r1c1 r1c2 r1c3 r1c4\" \"r2c1 r2c2 r2c3 r2c4\" \"r3c1 r3c2 r3c3 r3c4\" \"r4c1 r4c2 r4c3 r4c4\" \"r5c1 r5c2 r5c3 r5c4\";\n  position: absolute;\n  left: 0;\n  top: 20%;\n  width: 100%;\n  height: 80%;\n}\n.home .summary .r1c1 {\n  display: grid;\n  grid-area: r1c1;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n  background-color: black;\n  color: wheat;\n  border: solid thin wheat;\n}\n.home .summary .r1c2 {\n  display: grid;\n  grid-area: r1c2;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n  background-color: black;\n  color: wheat;\n  border: solid thin wheat;\n}\n.home .summary .r1c3 {\n  display: grid;\n  grid-area: r1c3;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n  background-color: black;\n  color: wheat;\n  border: solid thin wheat;\n}\n.home .summary .r1c4 {\n  display: grid;\n  grid-area: r1c4;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n  background-color: black;\n  color: wheat;\n  border: solid thin wheat;\n}\n.home .summary .r2c1 {\n  display: grid;\n  grid-area: r2c1;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n  background-color: black;\n  color: wheat;\n  border: solid thin wheat;\n}\n.home .summary .r2c2 {\n  display: grid;\n  grid-area: r2c2;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n  background-color: black;\n  color: wheat;\n  border: solid thin wheat;\n}\n.home .summary .r2c3 {\n  display: grid;\n  grid-area: r2c3;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n  background-color: black;\n  color: wheat;\n  border: solid thin wheat;\n}\n.home .summary .r2c4 {\n  display: grid;\n  grid-area: r2c4;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n  background-color: black;\n  color: wheat;\n  border: solid thin wheat;\n}\n.home .summary .r3c1 {\n  display: grid;\n  grid-area: r3c1;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n  background-color: black;\n  color: wheat;\n  border: solid thin wheat;\n}\n.home .summary .r3c2 {\n  display: grid;\n  grid-area: r3c2;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n  background-color: black;\n  color: wheat;\n  border: solid thin wheat;\n}\n.home .summary .r3c3 {\n  display: grid;\n  grid-area: r3c3;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n  background-color: black;\n  color: wheat;\n  border: solid thin wheat;\n}\n.home .summary .r3c4 {\n  display: grid;\n  grid-area: r3c4;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n  background-color: black;\n  color: wheat;\n  border: solid thin wheat;\n}\n.home .summary .r4c1 {\n  display: grid;\n  grid-area: r4c1;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n  background-color: black;\n  color: wheat;\n  border: solid thin wheat;\n}\n.home .summary .r4c2 {\n  display: grid;\n  grid-area: r4c2;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n  background-color: black;\n  color: wheat;\n  border: solid thin wheat;\n}\n.home .summary .r4c3 {\n  display: grid;\n  grid-area: r4c3;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n  background-color: black;\n  color: wheat;\n  border: solid thin wheat;\n}\n.home .summary .r4c4 {\n  display: grid;\n  grid-area: r4c4;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n  background-color: black;\n  color: wheat;\n  border: solid thin wheat;\n}\n.home .summary .r5c1 {\n  display: grid;\n  grid-area: r5c1;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n  background-color: black;\n  color: wheat;\n  border: solid thin wheat;\n}\n.home .summary .r5c2 {\n  display: grid;\n  grid-area: r5c2;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n  background-color: black;\n  color: wheat;\n  border: solid thin wheat;\n}\n.home .summary .r5c3 {\n  display: grid;\n  grid-area: r5c3;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n  background-color: black;\n  color: wheat;\n  border: solid thin wheat;\n}\n.home .summary .r5c4 {\n  display: grid;\n  grid-area: r5c4;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n  background-color: black;\n  color: wheat;\n  border: solid thin wheat;\n}\n", map: {"version":3,"sources":["Home.vue","/Users/ax/Documents/prj/aug/vue/jitter/Home.vue"],"names":[],"mappings":"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","file":"Home.vue","sourcesContent":[".theme-logo {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-menu {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-find {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-tocs {\n  background-color: black;\n  font-size: 2.5rem;\n}\n.theme-view {\n  font-size: 1.5rem;\n}\n.theme-side {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-pref {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-foot {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-trak {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.home {\n  position: absolute;\n  left: 0;\n  top: 0;\n  width: 100%;\n  height: 100%;\n  background-color: black;\n  color: wheat;\n}\n.home .head {\n  position: absolute;\n  left: 0;\n  top: 0;\n  width: 100%;\n  height: 20%;\n  display: grid;\n  justify-items: center;\n  align-items: center;\n  text-align: center;\n}\n.home .head h1 {\n  font-size: 2rem;\n}\n.home .head h2 {\n  font-size: 1.5rem;\n}\n.home .summary {\n  display: grid;\n  grid-template-rows: 20fr 20fr 20fr 20fr 20fr;\n  grid-template-columns: 40fr 20fr 20fr 20fr;\n  grid-template-areas: \"r1c1 r1c2 r1c3 r1c4\" \"r2c1 r2c2 r2c3 r2c4\" \"r3c1 r3c2 r3c3 r3c4\" \"r4c1 r4c2 r4c3 r4c4\" \"r5c1 r5c2 r5c3 r5c4\";\n  position: absolute;\n  left: 0;\n  top: 20%;\n  width: 100%;\n  height: 80%;\n}\n.home .summary .r1c1 {\n  display: grid;\n  grid-area: r1c1;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n  background-color: black;\n  color: wheat;\n  border: solid thin wheat;\n}\n.home .summary .r1c2 {\n  display: grid;\n  grid-area: r1c2;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n  background-color: black;\n  color: wheat;\n  border: solid thin wheat;\n}\n.home .summary .r1c3 {\n  display: grid;\n  grid-area: r1c3;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n  background-color: black;\n  color: wheat;\n  border: solid thin wheat;\n}\n.home .summary .r1c4 {\n  display: grid;\n  grid-area: r1c4;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n  background-color: black;\n  color: wheat;\n  border: solid thin wheat;\n}\n.home .summary .r2c1 {\n  display: grid;\n  grid-area: r2c1;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n  background-color: black;\n  color: wheat;\n  border: solid thin wheat;\n}\n.home .summary .r2c2 {\n  display: grid;\n  grid-area: r2c2;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n  background-color: black;\n  color: wheat;\n  border: solid thin wheat;\n}\n.home .summary .r2c3 {\n  display: grid;\n  grid-area: r2c3;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n  background-color: black;\n  color: wheat;\n  border: solid thin wheat;\n}\n.home .summary .r2c4 {\n  display: grid;\n  grid-area: r2c4;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n  background-color: black;\n  color: wheat;\n  border: solid thin wheat;\n}\n.home .summary .r3c1 {\n  display: grid;\n  grid-area: r3c1;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n  background-color: black;\n  color: wheat;\n  border: solid thin wheat;\n}\n.home .summary .r3c2 {\n  display: grid;\n  grid-area: r3c2;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n  background-color: black;\n  color: wheat;\n  border: solid thin wheat;\n}\n.home .summary .r3c3 {\n  display: grid;\n  grid-area: r3c3;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n  background-color: black;\n  color: wheat;\n  border: solid thin wheat;\n}\n.home .summary .r3c4 {\n  display: grid;\n  grid-area: r3c4;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n  background-color: black;\n  color: wheat;\n  border: solid thin wheat;\n}\n.home .summary .r4c1 {\n  display: grid;\n  grid-area: r4c1;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n  background-color: black;\n  color: wheat;\n  border: solid thin wheat;\n}\n.home .summary .r4c2 {\n  display: grid;\n  grid-area: r4c2;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n  background-color: black;\n  color: wheat;\n  border: solid thin wheat;\n}\n.home .summary .r4c3 {\n  display: grid;\n  grid-area: r4c3;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n  background-color: black;\n  color: wheat;\n  border: solid thin wheat;\n}\n.home .summary .r4c4 {\n  display: grid;\n  grid-area: r4c4;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n  background-color: black;\n  color: wheat;\n  border: solid thin wheat;\n}\n.home .summary .r5c1 {\n  display: grid;\n  grid-area: r5c1;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n  background-color: black;\n  color: wheat;\n  border: solid thin wheat;\n}\n.home .summary .r5c2 {\n  display: grid;\n  grid-area: r5c2;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n  background-color: black;\n  color: wheat;\n  border: solid thin wheat;\n}\n.home .summary .r5c3 {\n  display: grid;\n  grid-area: r5c3;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n  background-color: black;\n  color: wheat;\n  border: solid thin wheat;\n}\n.home .summary .r5c4 {\n  display: grid;\n  grid-area: r5c4;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n  background-color: black;\n  color: wheat;\n  border: solid thin wheat;\n}\n","\n<template>\n  <div class=\"home\">\n    <div class=\"head\"><h1>Welcome to the Jitter Mobile App</h1></div>\n    <div class=\"summary\">\n      <div class=\"r1c1\" @click=\"route('Flavor')\">Flavor:</div>\n        <div class=\"r1c2\">F1</div><div class=\"r1c3\">F2</div><div class=\"r1c4\">F3</div>\n      <div class=\"r2c1\"  @click=\"route('Roast')\" >Roast: </div>\n        <div class=\"r2c2\">R1</div><div class=\"r2c3\">R2</div><div class=\"r2c4\">R3</div>\n      <div class=\"r3c1\" @click=\"route('Brew')\"  >Brew:  </div>\n        <div class=\"r3c2\">B1</div><div class=\"r3c3\">B2</div><div class=\"r3c4\">B3</div>\n      <div class=\"r4c1\" @click=\"route('Drink')\" >Drink: </div>\n        <div class=\"r4c2\">D1</div><div class=\"r4c3\">D2</div><div class=\"r4c4\">D3</div>\n      <div class=\"r5c1\" @click=\"route('Body')\"  >Body:  </div>\n        <div class=\"r5c2\">S1</div><div class=\"r5c3\">S2</div><div class=\"r5c4\">S3</div>\n    </div>\n  </div>\n</template>\n\n<script type=\"module\">\n  \n  let Home = {\n\n  data() { return { comp:'Home' } },\n  \n  methods:{\n    route: function( comp ) {\n        this.nav().route( comp, {} ); } },\n\n   mounted: function () {\n       this.publish( 'Nav', 'Home' ); }\n  }\n\n  import Dash from './Dash.vue';\n\n  Home.Dash = Dash;\n  \n  export default Home;\n  \n</script>\n\n<style lang=\"less\">\n  \n  @import '../../pub/css/themes/theme.less';\n  \n  .grid5x4(){ display:grid; grid-template-rows: 20fr 20fr 20fr 20fr 20fr; grid-template-columns:40fr 20fr 20fr 20fr;\n    grid-template-areas:   \"r1c1 r1c2 r1c3 r1c4\" \"r2c1 r2c2 r2c3 r2c4\"\n     \"r3c1 r3c2 r3c3 r3c4\" \"r4c1 r4c2 r4c3 r4c4\" \"r5c1 r5c2 r5c3 r5c4\"; }\n\n  .c( @rc ) { display:grid; grid-area:@rc; justify-self:stretch; align-self:stretch;\n    justify-items:center; align-items:center; background-color:@theme-back; color:@theme-color;\n    border:solid thin @theme-color; }\n  \n  .home { position:absolute; left:0; top:0; width:100%; height:100%;\n    background-color:@theme-back; color:@theme-color;\n\n    .head { position:absolute; left:0; top:0; width:100%; height:20%;\n            display:grid;justify-items:center; align-items:center; text-align:center;\n      h1 { font-size:@theme-h1-size; }\n      h2 { font-size:@theme-h2-size; } }\n      \n    .summary {  .grid5x4(); position:absolute; left:0; top:20%; width:100%; height:80%;\n      .r1c1{.c(r1c1)}; .r1c2{.c(r1c2)}; .r1c3{.c(r1c3)}; .r1c4{.c(r1c4)};\n      .r2c1{.c(r2c1)}; .r2c2{.c(r2c2)}; .r2c3{.c(r2c3)}; .r2c4{.c(r2c4)};\n      .r3c1{.c(r3c1)}; .r3c2{.c(r3c2)}; .r3c3{.c(r3c3)}; .r3c4{.c(r3c4)};\n      .r4c1{.c(r4c1)}; .r4c2{.c(r4c2)}; .r4c3{.c(r4c3)}; .r4c4{.c(r4c4)};\n      .r5c1{.c(r5c1)}; .r5c2{.c(r5c2)}; .r5c3{.c(r5c3)}; .r5c4{.c(r5c4)};\n    }\n  }\n\n\n\n</style>"]}, media: undefined });

  };
  /* scoped */
  const __vue_scope_id__$2 = undefined;
  /* module identifier */
  const __vue_module_identifier__$2 = undefined;
  /* functional template */
  const __vue_is_functional_template__$2 = false;
  /* style inject SSR */
  

  
  var Home$1 = normalizeComponent_1(
    { render: __vue_render__$2, staticRenderFns: __vue_staticRenderFns__$2 },
    __vue_inject_styles__$2,
    __vue_script__$2,
    __vue_scope_id__$2,
    __vue_is_functional_template__$2,
    __vue_module_identifier__$2,
    browser,
    undefined
  );

export default Home$1;
