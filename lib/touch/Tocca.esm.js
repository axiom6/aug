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
        ms = 'MS' + type
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
        i = eventsArray.length

      while (i--) {
        elm.addEventListener(eventsArray[i], callback, false)
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
      let customEvent = document.createEvent('Event')
      customEvent.originalEvent = originalEvent
      data = data || {}
      data.x = currX
      data.y = currY
      //data.distance = data.distance

      // jquery
      if (defaults.useJquery) {
        customEvent = jQuery.Event(eventName, {originalEvent: originalEvent})
        jQuery(elm).trigger(customEvent, data)
      }

      // addEventListener
      if (customEvent.initEvent) {
        for (let key in data) {
          customEvent[key] = data[key]
        }

        customEvent.initEvent(eventName, true, true)
        elm.dispatchEvent(customEvent)
      }

      // detect all the inline events
      // also on the parent nodes
      while (elm) {
        // inline
        if (elm['on' + eventName])
          elm['on' + eventName](customEvent)
        elm = elm.parentNode
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

      pointerId = e.pointerId

      // it looks like it was a touch event!
      if (e.type !== 'mousedown')
        wasTouch = true

      // skip this event we don't need to track it now
      if (e.type === 'mousedown' && wasTouch) return

      let pointer = getPointerEvent(e)

      // caching the current x
      cachedX = currX = pointer.pageX
      // caching the current y
      cachedY = currY = pointer.pageY

      longtapTimer = setTimeout(function() {
        sendEvent(e.target, 'longtap', e)
        target = e.target
      }, defaults.longtapThreshold)

      // we will use these variables on the touchend events
      timestamp = getTimestamp()

      tapNum++

    },
    onTouchEnd = function(e) {
      if (!isTheSameFingerId(e) || isMultipleTouches(e)) return

      pointerId = undefined

      // skip the mouse events if previously a touch event was dispatched
      // and reset the touch flag
      if (e.type === 'mouseup' && wasTouch) {
        wasTouch = false
        return
      }

      let eventsArr = [],
        now = getTimestamp(),
        deltaY = cachedY - currY,
        deltaX = cachedX - currX

      // clear the previous timer if it was set
      clearTimeout(dblTapTimer)
      // kill the long tap timer
      clearTimeout(longtapTimer)

      if (deltaX <= -defaults.swipeThreshold)
        eventsArr.push('swiperight')

      if (deltaX >= defaults.swipeThreshold)
        eventsArr.push('swipeleft')

      if (deltaY <= -defaults.swipeThreshold)
        eventsArr.push('swipedown')

      if (deltaY >= defaults.swipeThreshold)
        eventsArr.push('swipeup')

      if (eventsArr.length) {
        for (let i = 0; i < eventsArr.length; i++) {
          let eventName = eventsArr[i]
          sendEvent(e.target, eventName, e, {
            distance: {
              x: Math.abs(deltaX),
              y: Math.abs(deltaY)
            }
          })
        }
        // reset the tap counter
        tapNum = 0
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
            sendEvent(e.target, tapNum >= 2 && target === e.target ? 'dbltap' : 'tap', e)
            target= e.target
          }
        }

        // reset the tap counter
        dblTapTimer = setTimeout(function() {
          tapNum = 0
        }, defaults.dbltapThreshold)

      }
    },
    onTouchMove = function(e) {
      if (!isTheSameFingerId(e)) return
      // skip the mouse move events if the touch events were previously detected
      if (e.type === 'mousemove' && wasTouch) return

      let pointer = getPointerEvent(e)
      currX = pointer.pageX
      currY = pointer.pageY
    },

    setOptions = function(options) {   // Configure the tocca default options at any time
      for (let opt in options) {
        defaults[opt] = options[opt] }
      return defaults
    },

    tapNum = 0,
    pointerId, currX, currY, cachedX, cachedY, timestamp, target, dblTapTimer, longtapTimer

  //setting the events listeners
  // we need to debounce the callbacks because some devices multiple events are triggered at same time
  setListener( document, touchevents.touchstart + (defaults.justTouchEvents ? '' : ' mousedown'), onTouchStart )
  setListener( document, touchevents.touchend   + (defaults.justTouchEvents ? '' : ' mouseup'  ), onTouchEnd   )
  setListener( document, touchevents.touchmove  + (defaults.justTouchEvents ? '' : ' mousemove'), onTouchMove  )

  setOptions({});

}

export default Tocca;
