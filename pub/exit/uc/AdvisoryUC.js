var AdvisoryUC;

import $ from 'jquery';

import {
  vis
} from '../../../lib/pub/draw/Vis.js';

AdvisoryUC = class AdvisoryUC {
  constructor(stream, role, port, land) {
    this.stream = stream;
    this.role = role;
    this.port = port;
    this.land = land;
  }

  ready() {
    return this.$ = $(this.html());
  }

  position(screen) {
    this.onScreen(screen);
    return this.subscribe();
  }

  subscribe() {
    this.stream.subscribe('Location', 'AdvisoryUC', (location) => {
      return this.onLocation(location);
    });
    return this.stream.subscribe('Screen', 'AdvisoryUC', (screen) => {
      return this.onScreen(screen);
    });
  }

  onLocation(location) {
    return vis.noop('AdvisoryUC.onLocation()', this.ext, location);
  }

  onScreen(screen) {
    return vis.cssPosition(this.$, screen, this.port, this.land);
  }

  html() {
    return `<div id="${vis.htmlId('AdvisoryUC', this.role)}" class="${vis.cssNameType('AdvisoryUC')}"></div>`;
  }

};

export default AdvisoryUC;

//# sourceMappingURL=AdvisoryUC.js.map
