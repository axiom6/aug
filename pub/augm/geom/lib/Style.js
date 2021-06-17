var Style;

Style = class Style {
  constructor(elem) {
    this.process = this.process.bind(this);
    this.elem = elem;
    this.width = elem['clientWidth'];
    this.height = elem['clientHeight'];
  }

  process(key, graph) {
    var context, style;
    if (key === 'Objects') {
      this.width * 0.25;
    }
    style = `width:${this.width}px; height:${this.height}px; background:#000000;`;
    graph.setAttribute('style', style);
    if (graph.tagName === 'CANVAS') {
      context = graph.getContext('webgl');
      context.fillStyle = '#000000';
    }
    this.elem.appendChild(graph);
  }

};

export default Style;

//# sourceMappingURL=Style.js.map
