var Shapes,
  hasProp = {}.hasOwnProperty;

import Util from '../../../lib/pub/base/util/Util.js';

import Vis from '../../../lib/pub/base/draw/Vis.js';

import Convey from './Convey.js';

import * as d3 from 'd3';

Shapes = class Shapes {
  constructor(stream) {
    this.stream = stream;
    this.cos30 = 0.86602540378;
    //@cos15 = Vis.cos(15)
    this.fontText = "Roboto";
  }

  rectGrad(g, defs, xc, yc, w, h, fill, stroke, text) {
    this.rectCenter(g, xc, yc, w * 1.5, h * 1.5, fill, stroke, 0.1);
    this.rectCenter(g, xc, yc, w * 1.4, h * 1.4, fill, stroke, 0.2);
    this.rectCenter(g, xc, yc, w * 1.3, h * 1.3, fill, stroke, 0.3);
    this.rectCenter(g, xc, yc, w * 1.2, h * 1.2, fill, stroke, 0.4);
    this.rectCenter(g, xc, yc, w * 1.1, h * 1.1, fill, stroke, 0.5);
    this.rectCenter(g, xc, yc, w, h, fill, stroke, 0.6, text);
  }

  rectCenter(g, xc, yc, w, h, fill, stroke, opacity, text = '') {
    this.rect(g, xc - w * 0.5, yc - h * 0.5, w, h, fill, stroke, opacity, text);
  }

  toFill(studyPrac, darken = false) {
    var hsv;
    hsv = (studyPrac.hsv != null) && studyPrac.hsv.length === 3 ? studyPrac.hsv : [50, 50, 50];
    hsv = darken ? [hsv[0], hsv[1], hsv[2] * 0.75] : hsv; // [hsv[0],60,30]
    // console.log( 'Shapes.toFill()', studyPrac.hsv, hsv ) if darken
    if ((studyPrac.hsv != null) && studyPrac.hsv.length === 3) {
      return Vis.str(hsv);
    } else {
      console.error('Shapes.toFill() unknown fill code', {
        name: studyPrac.name,
        fill: studyPrac.fill,
        spec: studyPrac
      });
      return '#888888';
    }
  }

  arrange(prac) {
    var dir, i, len, ref, studies;
    studies = {};
    ref = ['north', 'west', 'east', 'south'];
    for (i = 0, len = ref.length; i < len; i++) {
      dir = ref[i];
      studies[this.key(prac, dir)] = this.obj(prac, dir);
    }
    return studies;
  }

  key(prac, dir) {
    var key, study;
    for (key in prac) {
      study = prac[key];
      if (Util.isChild(key) && study.dir === dir) {
        return key;
      }
    }
    return '???';
  }

  obj(prac, dir) {
    var key, study;
    for (key in prac) {
      study = prac[key];
      if (Util.isChild(key) && study.dir === dir) {
        return study;
      }
    }
    return {};
  }

  htmlId(pracName, contentName) {
    return Util.getHtmlId(pracName, 'Info', contentName); // @ui.plane.id
  }

  size(obj) {
    if (obj != null) {
      return Object.keys(obj).length;
    } else {
      return 0;
    }
  }

  isWest(col) {
    return col === 'Embrace';
  }

  layout(size, col, ns, ni) {
    var lay;
    lay = {}; // Layout ob
    lay.dir = (this.isWest(col)) ? 1 : -1; // convey direction
    lay.xc = size.xc; // x center
    lay.yc = size.yc; // y center
    lay.w = size.w; // pane width
    lay.h = size.h; // pane height
    lay.hk = lay.h / 8; // height keyhole rect
    lay.xk = (this.isWest(col)) ? lay.w : 0; // x keyhole rect
    lay.yk = lay.yc - lay.hk; // y keyhole rect
    lay.rs = lay.yc * 0.85; // Outer  study section radius
    lay.ro = lay.rs - lay.hk; // Inner  study section radius
    lay.ri = lay.ro - lay.hk / 4; // Icon   intersction   radius
    lay.yt = lay.yc + lay.ro + lay.rs * 0.65; // y for practice text
    lay.a1 = (this.isWest(col)) ? 60 : 120; // Begin  study section angle
    lay.a2 = (this.isWest(col)) ? 300 : -120; // Ending study section angle
    lay.ns = ns; // Number of studies
    lay.da = (lay.a1 - lay.a2) / lay.ns; // Angle of each section
    lay.ds = lay.da / 12; // Link angle dif
    lay.li = lay.ds / 2; // Link begin inset
    lay.wr = 8; // Width  study rect  24
    lay.hr = lay.ri / lay.ns; // Height study rect
    lay.xr = lay.xc + lay.dir * (lay.rs / 2 + lay.wr); // x orgin study rect
    lay.yr = lay.yc - lay.ri / 2; // r orgin study rect
    lay.dl = lay.hr / 12; // link dif on study rect
    lay.xl = lay.xr + lay.wr; // x link   on study rect
    lay.yl = lay.yr + lay.dl / 2; // y link   on study rect
    lay.ni = ni; // Number of innovative studies
    lay.xi = 0; // x innovative study rects
    lay.yi = lay.yc - lay.ri / 2; // y innovative study rects
    lay.wi = lay.wr; // w innovative study rects
    lay.hi = lay.ri / lay.ni; // h innovative study rects
    lay.thick = 1; // line thickness
    lay.stroke = 'none'; // line stroke
    // console.log( 'Shapes.layout()', col, size, lay )
    return lay;
  }

  click(path, text) {
    if (text === false) {
      ({});
    }
    path.style('z-index', '4'); //.style("pointer-events","all").style("visibility", "visible" )
    path.on("click", () => {
      var select;
      //console.log( 'Shape.click',  text )
      select = {}; // UI.toTopic(  text, 'Shapes', UI.SelectStudy )
      return this.stream.publish('Select', select);
    });
  }

  wedge(g, r1, r2, a1, a2, x0, y0, fill, text, wedgeId, fontSize, level) {
    var arc;
    arc = d3.arc().innerRadius(r1).outerRadius(r2).startAngle(this.radD3(a1)).endAngle(this.radD3(a2));
    //console.log( 'Shape.wedge()', { x0:x0, y0:y0 } )
    g.append("svg:path").attr("d", arc).attr("fill", fill).attr("stroke", "none").attr("transform", Vis.translate(x0, y0));
    this.wedgeText(g, r1, r2, a1, a2, x0, y0, fill, text, wedgeId, fontSize, level);
  }

  wedgeText(g, r1, r2, a1, a2, x0, y0, fill, text, wedgeId, fontSize, level = 'None') {
    var as, at, path, rt, sc, th, x, y;
    Util.noop(wedgeId);
    th = 14;
    at = (a1 + a2) / 2;
    rt = (r1 + r2) / 2;
    sc = 0.50;
    if ((210 <= at && at <= 330) || (-150 <= at && at <= -30)) {
      sc = level === 'Prac' ? 0.30 : 0.25; // level is a hack
      rt = (r1 + r2) / 2 + th * sc;
      as = 270 - at;
    } else {
      // console.log( 'Shapes.wedgeText() 1', text, level, sc , rt )
      sc = level === 'Prac' ? 1.25 : 0.50; // level is a hack
      rt = (r1 + r2) / 2 - th * sc;
      as = 90 - at;
    }
    // console.log( 'Shapes.wedgeText() 2', text, level, sc, rt )
    x = x0 + rt * this.cos(at);
    y = y0 + rt * this.sin(at);
    path = g.append("svg:text").text(text).attr("x", x).attr("y", y).attr("transform", Vis.rotate(as, x, y)).attr("text-anchor", "middle").attr("font-size", fontSize).attr("font-family", this.fontText).attr("font-weight", "bold").attr('fill', '#000000'); // @textFill(fill))
    this.click(path, text);
  }

  // "font-family: Arial, Font Awesome\ 5 Free; font-weight: 900;
  icon(g, x0, y0, name, iconId, color, size, uc) {
    var path;
    path = g.append("svg:text").text(uc).attr("x", x0).attr("y", y0).attr("id", iconId).attr("text-anchor", "middle").attr("font-size", size).attr("fill", color).attr("font-family", "Arial, Font Awesome\\ 5 Free").attr("font-weight", "900");
    this.click(path, name);
  }

  text(g, x0, y0, name, textId, color, size, anchor = "middle") {
    var path;
    path = g.append("svg:text").text(name).attr("x", x0).attr("y", y0).attr("id", textId).attr("fill", color).attr("text-anchor", anchor).attr("font-size", size).attr("font-family", this.fontText).attr("font-weight", "bold");
    this.click(path, name);
  }

  link(g, a, ra, rb, xc, yc, xd, yd, xe, ye, stroke, thick) {
    var data, xa, xb, ya, yb;
    xa = xc + ra * this.cos(a);
    ya = yc + ra * this.sin(a);
    xb = xc + rb * this.cos(a);
    yb = yc + rb * this.sin(a);
    data = `M${xa},${ya} C${xb},${yb} ${xd},${yd} ${xe},${ye}`;
    this.curve(g, data, stroke, thick);
  }

  curve(g, data, stroke, thick) {
    g.append("svg:path").attr("d", data).attr("stroke-linejoin", "round").attr("fill", "none").attr("stroke", stroke).attr("stroke-width", thick);
  }

  keyHole(g, xc, yc, xs, ys, ro, ri, fill, stroke = 'none', thick = 0) {
    var a, data, h, isweep, osweep, rh, rx;
    h = yc - ys;
    a = Math.asin(h / ro);
    rx = Math.cos(a) * ro;
    rh = ri;
    osweep = 0; // Negative
    isweep = 1; // Positive
    if (xs < xc) {
      rx = -rx;
      rh = -ri;
      osweep = 1; // Positive
      isweep = 0; // Negative
    }
    data = `M${xs},   ${ys}`;
    data += `L${xc + rx},${ys} A${ro},${ro} 0, 1,${osweep} ${xc + rx},${yc + h}`;
    data += `L${xs},   ${yc + h} L${xs},${ys}`;
    data += `M${xc + rh},${yc} A${ri},${ri} 0, 1,${isweep} ${xc + rh},${yc - 0.001}`;
    //console.log( 'Shapes.keyhole()', { xc:xc, yc:yc, xs:xs, ys:ys, ro:ro, ri:ri, h:h, a:a, rx:rx } )
    this.poly(g, data, fill, stroke, thick);
  }

  poly(g, data, fill) {
    g.append("svg:path").attr("d", data).attr("stroke-linejoin", "round").attr("fill", fill);
  }

  // svg:rect x="0" y="0" width="0" height="0" rx="0" ry="0"
  rect(g, x0, y0, w, h, fill, stroke, opacity = 1.0, text = '', size = '2em') {
    g.append("svg:rect").attr("x", x0).attr("y", y0).attr("width", w).attr("height", h).attr("fill", fill).attr("stroke", stroke).style("opacity", opacity);
    if (opacity < 1.0) {
      g.style('background', '#000000');
    }
    if (text !== '') {
      g.append("svg:text").text(text).attr("x", x0 + w / 2).attr("y", y0 + h / 2 + 14).attr('fill', 'wheat').attr("text-anchor", "middle").attr("font-size", size).attr("font-family", this.fontText).attr("font-weight", "bold");
    }
  }

  round(g, x0, y0, w, h, rx, ry, fill, stroke) {
    g.append("svg:rect").attr("x", x0).attr("y", y0).attr("width", w).attr("height", h).attr("rx", rx).attr("ry", ry).attr("fill", fill).attr("stroke", stroke);
  }

  // svg:ellipse cx="0" cy="0" rx="0" ry="0"
  ellipse(g, cx, cy, rx, ry, fill, stroke) {
    g.append("svg:ellipse").attr("cx", cx).attr("cy", cy).attr("rx", rx).attr("ry", ry).attr("fill", fill).attr("stroke", stroke);
  }

  // svg:ellipse cx="0" cy="0" rx="0" ry="0"
  circle(g, cx, cy, r, fill, stroke) {
    g.append("svg:ellipse").attr("cx", cx).attr("cy", cy).attr("r", r).attr("fill", fill).attr("stroke", stroke);
  }

  nodesLinks(studies, innovs) {
    var iK, iKey, innov, key, links, nodes, sK, sKey, study;
    nodes = [];
    for (key in studies) {
      if (!hasProp.call(studies, key)) continue;
      study = studies[key];
      nodes.push({
        name: key,
        color: this.toFill(study)
      });
    }
    for (key in innovs) {
      if (!hasProp.call(innovs, key)) continue;
      innov = innovs[key];
      nodes.push({
        name: key,
        color: this.toFill(innov)
      });
    }
    links = [];
    sK = 0;
    for (sKey in studies) {
      if (!hasProp.call(studies, sKey)) continue;
      study = studies[sKey];
      iK = 4;
      for (iKey in innovs) {
        if (!hasProp.call(innovs, iKey)) continue;
        innov = innovs[iKey];
        links.push({
          source: sK,
          target: iK,
          value: 1 // sourceName:sKey, targetName:iKey,
        });
        iK++;
      }
      sK++;
    }
    return {
      //console.log( 'Shape.nodesLinks', nodes, links )
      nodes: nodes,
      links: links
    };
  }

  conveySankey(col, defs, g, studies, innovs, x, y, w, h) {
    var convey, nodesLinks;
    //console.log( { col:col, studies:studies, innovs:innovs, x:x, y:y, w:w, h:h } )
    convey = new Convey(this, defs, g, x, y, w, h);
    nodesLinks = {};
    if (col === "Embrace") {
      nodesLinks = this.nodesLinks(studies, innovs);
    } else if (col === "Encourage") {
      nodesLinks = this.nodesLinks(innovs, studies);
    }
    convey.doData(nodesLinks);
  }

  // All flows are colored the north color of yellow [[90,90.90]
  practiceFlow(g, size, spec) {
    if (spec.row == null) {
      return;
    }
    switch (spec.row) {
      case 'Learn':
        this.flow(g, size, [90, 90, 90], 'south');
        break;
      case 'Do':
        this.flow(g, size, [90, 90, 90], 'north');
        this.flow(g, size, [90, 90, 90], 'south');
        break;
      case 'Share':
        this.flow(g, size, [90, 90, 90], 'sorth');
        break;
      case 'Dim':
        break;
      default:
        console.error('Shapes.practiceFlow() unknown spec row ', spec.name, spec.row);
        this.flow(g, size, [90, 90, 90], 'south');
    }
  }

  flow(g, size, hsv, dir, h) {
    var fill, w, x0, y0;
    w = size.level === 'Comp' ? size.ringSize * 0.75 : size.ringSize * 0.8;
    h = size.level === 'Comp' ? size.ringSize * 0.55 : size.ringSize * 1.3;
    x0 = size.xc - w * 0.5;
    y0 = dir === 'south' ? size.h - h : 0;
    fill = Vis.str(hsv);
    this.rect(g, x0, y0, w, h, fill, 'none');
  }

  // Convert degress to radians and make angle counter clockwise
  rad(deg) {
    return (360 - deg) * Math.PI / 180.0;
  }

  //degSVG:( deg ) -> 360-deg
  radD3(deg) {
    return (450 - deg) * Math.PI / 180.0;
  }

  //degD3:( rad )  -> -rad * 180.0 / Math.PI
  cos(deg) {
    return Vis.cosSvg(deg);
  }

  sin(deg) {
    return Vis.sinSvg(deg);
  }

  gradientDef(defs, id, color1, color2, x1 = '0%', x2 = '100%', y1 = '0%', y2 = '100%') {
    var grad;
    grad = defs.append("svg:linearGradient");
    grad.attr("id", id).attr("x1", x1).attr("y1", y1).attr("x2", x2).attr("y2", y2);
    grad.append("svg:stop").attr("offset", "10%").attr("stop-color", color1);
    grad.append("svg:stop").attr("offset", "90%").attr("stop-color", color2);
  }

  pathPlot(g, stroke, thick, d) {
    g.append('svg:path').attr('d', d).attr('stroke', stroke).attr('stroke-width', thick).attr('fill', 'none').attr("stroke-linejoin", 'round');
  }

  textFill(hex, dark = '#000000', light = '#FFFFFF') {
    if (hex > 0x888888) {
      return dark;
    } else {
      return light;
    }
  }

  saveSvg(name, id) {
    var downloadLink, fileName, svgBlob, svgData, svgUrl;
    fileName = name + '.svg';
    svgData = $('#' + id)[0].outerHTML;
    svgBlob = new Blob([svgData], {
      type: "image/svg+xml;charset=utf-8"
    });
    svgUrl = window['URL'].createObjectURL(svgBlob);
    downloadLink = document.createElement("a");
    downloadLink.href = svgUrl;
    downloadLink.download = fileName;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  }

};

export default Shapes;

//# sourceMappingURL=Shapes.js.map
