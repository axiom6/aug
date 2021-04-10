var Icon;

import Util from '../util/Util.js';

import Vis from '../util/Vis.js';

Icon = class Icon {
  constructor(stream, ui, pane) {
    this.stream = stream;
    this.ui = ui;
    this.pane = pane;
    this.name = this.pane.name;
    this.spec = this.pane.spec;
  }

  ready(cname) {
    var fill, style;
    Util.noop(cname);
    fill = Vis.toRgbHsvStr(this.spec.hsv);
    style = `style="background-color:${fill}; border-radius:12px; color:black;" `;
    return $(`<div   class="ui-pane-center">
  <div class="ui-pane-center-div" ${style}><i style="font-size:6vmin;" class="${this.spec.icon}"></i>
     <div class="ui-pane-text">${this.name}</div>
  </div>
</div>`);
  }

  layout() {}

};

export default Icon;
