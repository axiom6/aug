var Wheel;

Wheel = class Wheel {
  constructor(svgMgr, choice, oneLevel) {
    this.setChoosen = this.setChoosen.bind(this);
    this.xc = this.xc.bind(this);
    this.yc = this.yc.bind(this);
    this.adjustRadius = this.adjustRadius.bind(this);
    this.adjustAngles = this.adjustAngles.bind(this);
    this.isParentOf = this.isParentOf.bind(this);
    this.fill = this.fill.bind(this);
    this.doTexts = this.doTexts.bind(this);
    // eventType is click mouseover mouseout
    this.onEvent = this.onEvent.bind(this);
    this.fontSize = this.fontSize.bind(this);
    // eventType is click mouseover mouseout
    // This publish function is supplied to the constructor
    // d.chosen is true/false for add/del
    // d.data.name is the flavor
    // @publish( d.chosen, d.data.name )
    this.doChoiceResize = this.doChoiceResize.bind(this);
    this.textTransform = this.textTransform.bind(this);
    this.displayAllLeaves = this.displayAllLeaves.bind(this);
    this.svgMgr = svgMgr;
    this.choice = choice;
    this.oneLevel = oneLevel;
    this.svg = this.svgMgr.svg;
    this.g = this.svgMgr.g;
    this.d3 = this.svgMgr.d3;
    this.name = this.svgMgr.name;
    this.width = this.svgMgr.size.w;
    this.height = this.svgMgr.size.h;
    this.opacity = 1.0;
    this.showAllLeaves = false;
    this.scale = 1.2;
    this.radiusFactorChoice = 1.3;
    this.radiusFactorChild = 1.0;
    this.nodes = null;
    this.callPub = true;
    this.ready();
  }

  setChoosen(d) {
    if (d.data == null) {
      console.log('Wheel.setChoosen() missing d.data'.d);
    } else if (this.choice.choosen('Flavor', d.data.name)) {
      // console.log( 'Wheel.setChoosen()', d.data.name, @mix.choosen('Flavor',d.data.name) )
      this.callPub = false;
      this.onEvent({}, d, 'click');
      this.callPub = true;
    }
  }

  x0(d) {
    if (d.m0 != null) {
      return d.m0;
    } else {
      return d.x0;
    }
  }

  x1(d) {
    if (d.m1 != null) {
      return d.m1;
    } else {
      return d.x1;
    }
  }

  y0(d) {
    if (d.n0 != null) {
      return d.n0;
    } else {
      return d.y0;
    }
  }

  y1(d) {
    if (d.n1 != null) {
      return d.n1;
    } else {
      return d.y1;
    }
  }

  xc(d) {
    return (this.x0(d) + this.x1(d)) / 2;
  }

  yc(d) {
    return (this.y0(d) + this.y1(d)) / 2;
  }

  centerText() {
    return this.g.append("text").text("Flavors").attr('x', -32).attr('y', 12).style('stroke', 'wheat').style("font-size", "3vmin");
  }

  ready() {
    var xc, yc;
    this.json = this.choice.flavorJson();
    this.radius = Math.min(this.width, this.height) * this.scale / 2;
    this.xx = this.d3.scaleLinear().domain([0, 1]).range([0, 2 * Math.PI]);
    this.yy = this.d3.scalePow().exponent(1.4).domain([0, 1]).range([0, this.radius]);
    this.padding = 0;
    this.duration = 300;
    xc = this.width / 2;
    yc = this.height / 2;
    this.g = this.svg.append("g").attr("transform", `translate(${xc},${yc}) scale(1,1)`);
    this.centerText();
    this.partition = this.d3.partition();
    this.arc = this.d3.arc().startAngle((d) => {
      return Math.max(0, Math.min(2 * Math.PI, this.xx(this.x0(d))));
    }).endAngle((d) => {
      return Math.max(0, Math.min(2 * Math.PI, this.xx(this.x1(d))));
    }).innerRadius((d) => {
      return Math.max(0, this.yy(this.y0(d)));
    }).outerRadius((d) => {
      return Math.max(0, this.yy(this.y1(d)));
    });
    if (this.oneLevel) {
      this.json.children = this.removeBranches(this.json.children, ['Rich', 'Fruit']);
    }
    this.root = this.d3.hierarchy(this.json);
    this.root.sum((d) => {
      d.chosen = false;
      d.hide = this.isLeaf(d);
      if (this.isBranch(d)) {
        return 0;
      } else {
        return 1;
      }
    });
    this.nodes = this.partition(this.root).descendants();
    this.adjustRadius(this.root);
    if (this.oneLevel) {
      this.adjustAngles(this.root, this.nodes);
    }
    this.doPaths(this.nodes);
    this.doTexts(this.nodes);
    this.d3.select(self.frameElement).style("height", this.height + "px");
  }

  doPaths(nodes) {
    return this.g.selectAll("path").data(nodes).enter().append("path").attr("id", function(d, i) {
      if (d != null) {
        return "path-" + i;
      } else {
        return "path-" + i;
      }
    }).attr("d", this.arc).attr("fill-rule", "evenodd").style("fill", (d) => {
      return this.fill(d);
    }).style("opacity", this.opacity).style("stroke", 'black').style("stroke-width", '2').style("display", function(d) {
      if (d.data.hide) {
        return "none";
      } else {
        return "block";
      }
    }).on("click", (e, d) => {
      return this.onEvent(e, d, 'click');
    }).on("mouseover", (e, d) => {
      return this.onEvent(e, d, 'mouseover');
    }).on("mouseout", (e, d) => {
      return this.onEvent(e, d, 'mouseout');
    });
  }

  removeBranches(children1, branches) {
    var child, children2, j, len;
    if (children1 == null) {
      return;
    }
    children2 = [];
    for (j = 0, len = children1.length; j < len; j++) {
      child = children1[j];
      if (this.inChildren(child, branches)) {
        Array.prototype.push.apply(children2, this.removeBranches(child.children, branches));
      } else {
        children2.push(child);
      }
    }
    return children2;
  }

  inChildren(child, branches) {
    var branch, j, len;
    for (j = 0, len = branches.length; j < len; j++) {
      branch = branches[j];
      if (branch === child.name) {
        return true;
      }
    }
    return false;
  }

  adjustRadius(d) {
    var dy, sc;
    sc = d['data'].scale != null ? d['data'].scale : d.children == null ? 0.8 : 1.0;
    dy = (d.y1 - d.y0) * sc;
    if (d.parent != null) {
      d.y0 = d.parent.y1;
    }
    d.y1 = d.y0 + dy;
    if (d.children != null) {
      d.children.forEach((child) => {
        return this.adjustRadius(child);
      });
    }
  }

  adjustAngles(root, nodes) {
    var dx, j, len, node, x0;
    dx = 1.0 / root.children.length;
    x0 = 0.0;
    for (j = 0, len = nodes.length; j < len; j++) {
      node = nodes[j];
      if (!(node.depth === 1)) {
        continue;
      }
      node.x0 = x0;
      node.x1 = x0 + dx;
      x0 = x0 + dx;
    }
  }

  sameNode(a, b) {
    return (a != null ? a.data.name : void 0) === (b != null ? b.data.name : void 0);
  }

  inBranch(branch, d) {
    var child, j, len, ref;
    if ((branch != null ? branch.data.name : void 0) === (d != null ? d.data.name : void 0)) {
      return true;
    }
    if (branch.children != null) {
      ref = branch != null ? branch.children : void 0;
      for (j = 0, len = ref.length; j < len; j++) {
        child = ref[j];
        if ((child != null ? child.data.name : void 0) === (d != null ? d.data.name : void 0)) {
          return true;
        }
      }
    }
    return false;
  }

  isBranch(d) {
    return d.children != null;
  }

  isLeaf(d) {
    return d.children == null;
  }

  isParentOf(p, c) {
    if (p === c) {
      return true;
    }
    if (p.children != null) {
      return p.children.some((d) => {
        return this.isParentOf(d, c);
      });
    }
    return false;
  }

  fill(d) {
    var a, b, colours;
    if ((d.data.fill != null) && (d.children != null)) {
      return d.data.fill;
    } else if ((d.data.fill != null) && (d.children == null) && (d.parent != null) && (d.parent.data.fill != null)) {
      return d.parent.data.fill;
    } else if (d.children != null) {
      colours = d.children.map(this.fill);
      a = this.d3.hsl(colours[0]);
      b = this.d3.hsl(colours[1]);
      // L*a*b* might be better here...
      return this.d3.hsl((a.h + b.h) / 2, a.s * 1.2, a.l / 1.2);
    } else {
      return '#666666';
    }
  }

  doTexts(nodes) {
    var angle, xem;
    this.text = this.g.selectAll('text').data(nodes);
    this.textEnter = this.text.enter().append('text').data(nodes).on("click", (e, d) => {
      return this.onEvent(e, d, 'click');
    }).on("mouseover", (e, d) => {
      return this.onEvent(e, d, 'mouseover');
    }).on("mouseout", (e, d) => {
      return this.onEvent(e, d, 'mouseout');
    }).style("font-size", (t) => {
      return this.fontSize(t);
    //style('fill',       (d) => if @brightness( @d3.rgb( @fill(d.data) ) ) < 125 then '#eee' else '#000' )
    }).style('font-weight', 900).style('opacity', 1).style('fill', '#000000').style("display", function(d) {
      if (d.data.hide) {
        return "none";
      } else {
        return "block";
      }
    }).attr('text-anchor', (d) => {
      if (this.xx(this.xc(d)) > Math.PI) {
        return 'end';
      } else {
        return 'start';
      }
    }).attr('dy', '.2em').attr('transform', (d) => {
      return this.textTransform(d);
    });
    angle = (d) => {
      return this.xx(this.xc(d)) * 180 / Math.PI;
    };
    xem = function(d) {
      if (angle(d) <= 180) {
        return '1.2em';
      } else {
        return '-1.2em';
      }
    };
    this.textEnter.append('tspan').attr('x', function(d) {
      return xem(d);
    }).text(function(d) {
      if (d.depth) {
        return d.data.name.split(' ')[0];
      } else {
        return '';
      }
    });
    this.textEnter.append('tspan').attr('x', function(d) {
      return xem(d);
    }).attr('dy', '1em').text(function(d) {
      if ((d.depth != null) && (d.data.name != null)) {
        return d.data.name.split(' ')[1] || '';
      } else {
        return '';
      }
    }).attr("d", (d) => {
      return this.setChoosen(d);
    });
  }

  noData(d, eventType) {
    var missing;
    missing = false;
    if (d.data == null) {
      console.error('Wheel.onEvent() missing d.data', d);
      missing = true;
    } else if ((d.parent == null) && eventType === 'click') {
      this.displayAllLeaves();
    }
    if (!d.data['can']) {
      missing = true;
    }
    return missing;
  }

  onEvent(e, d, eventType) {
    var cy0, py0, py1, resize;
    if (this.noData(d, eventType)) {
      return;
    }
    py0 = d.y0;
    py1 = d.y0 + (d.y1 - d.y0) * this.radiusFactorChoice;
    resize = this.doChoiceResize(d, eventType, d.x0, py0, d.x1, py1);
    cy0 = resize ? py1 : d.y1;
    if (d.children != null) {
      if (!this.oneLevel || e.depth < 2) {
        this.resizeChild(d, resize, cy0);
      }
    } else {
      this.resizeElem(d, resize, d['x0'], cy0, d['x1'], d['y1']);
    }
    this.reDisplayPaths(d);
    this.reDisplayTexts(d);
  }

  resizeChild(d, resize, cy0) {
    d.children.forEach((child) => {
      var cy1;
      if (child != null) {
        child.data.hide = resize;
      }
      cy1 = cy0 + (child['y1'] - child['y0']) * this.radiusFactorChild;
      return this.resizeElem(child, resize, child['x0'], cy0, child['x1'], cy1);
    });
  }

  reDisplayPaths(d) {
    this.g.selectAll('path').data(this.nodes).filter((f) => {
      return this.inBranch(d, f);
    }).transition().duration(this.duration).style("display", function(d) {
      if (d.data.hide) {
        return "none";
      } else {
        return "block";
      }
    }).attr("d", this.arc);
  }

  reDisplayTexts(d) {
    this.g.selectAll('text').data(this.nodes).filter((f) => {
      return this.inBranch(d, f);
    }).transition().duration(this.duration).attr("transform", (t) => {
      return this.textTransform(t);
    }).style("font-size", (t) => {
      return this.fontSize(t, d);
    }).style("font-weight", '900').style("display", function(d) {
      if (d.data.hide) {
        return "none";
      } else {
        return "block";
      }
    });
  }

  fontSize(t, d = null) {
    if ((d != null) && this.sameNode(t, d) && (t.m0 != null)) {
      return '1.2rem';
    } else {
      if (t.children != null) {
        return '1.1rem';
      } else {
        return '1.0rem';
      }
    }
  }

  doChoiceResize(d, eventType, x0, y0, x1, y1) {
    var resize;
    resize = true;
    if (eventType === 'click') {
      d.chosen = !d.chosen; // @mix.choosen( 'Flavor', d.data.name )
      this.resizeElem(d, d.chosen, x0, y0, x1, y1);
      if (this.callPub) {
        this.choice.onChoice("Flavor", d.data.name, d.chosen);
      }
      resize = d.chosen;
    } else if (!d.chosen && (eventType === 'mouseover' || eventType === 'mouseout')) {
      resize = eventType === 'mouseover';
      this.resizeElem(d, resize, x0, y0, x1, y1);
    }
    return resize;
  }

  resizeElem(d, resize, x0, y0, x1, y1) {
    if (d.data == null) {
      console.error('Wheel.resizeElem() missing d.data', d);
    } else if (resize) {
      d.m0 = x0;
      d.m1 = x1;
      d.n0 = y0;
      d.n1 = y1;
      d.data.hide = false;
    } else {
      d.m0 = void 0;
      d.m1 = void 0;
      d.n0 = void 0;
      d.n1 = void 0;
      d.data.hide = !((d.data.children != null) || this.showAllLeaves) ? true : false;
    }
  }

  textTransform(d) {
    var angle, multiline, rotate;
    multiline = (d.data.name || '').split(' ').length > 1;
    angle = this.xx(this.xc(d)) * 180 / Math.PI - 90;
    rotate = angle + (multiline ? -.5 : 0);
    return 'rotate(' + rotate + ')translate(' + this.yy(this.y0(d)) + this.padding + ')rotate(' + (angle > 90 ? -180 : 0) + ')';
  }

  displayAllLeaves() {
    this.showAllLeaves = !this.showAllLeaves;
    this.g.selectAll("path").style("display", (d) => {
      if (this.isLeaf(d) && !this.showAllLeaves && !d.parent.chosen) {
        return "none";
      } else {
        return "block";
      }
    });
    this.g.selectAll('text').style("display", (d) => {
      if (this.isLeaf(d) && !this.showAllLeaves && !d.parent.chosen) {
        return "none";
      } else {
        return "block";
      }
    });
  }

};

export default Wheel;

//# sourceMappingURL=Wheel.js.map
