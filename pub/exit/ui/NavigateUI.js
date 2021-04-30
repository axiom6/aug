var NavigateUI;

import Util from '../util/Util.js';

NavigateUI = class NavigateUI {
  constructor(stream) {
    this.stream = stream;
  }

  ready() {
    this.htmlId = Util.id('NavigateUI');
    this.$ = $(this.html(this.htmlId));
    this.$img = this.$.find('img');
  }

  position(screen) {
    ({
      onScreen: screen
    });
    this.subscribe();
  }

  subscribe() {
    this.stream.subscribe('Screen', 'NavigateUI', (screen) => {
      return this.onScreen(screen);
    });
  }

  onScreen(screen) {
    var src;
    src = screen.orientation === 'Landscape' ? "/assets/Nav.Land.png" : "/assets/Nav.Port.png";
    this.$img.attr('src', src);
  }

  html(htmlId) {
    return `<div id="${htmlId}" class="${Util.css('NavigateUI')}">
  <img src="/assets/Nav.Port.png" alt="Navigate"/>
</div>`;
  }

  show() {
    return this.$.show();
  }

  hide() {
    return this.$.hide();
  }

};

export default NavigateUI;
