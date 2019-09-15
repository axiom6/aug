
import C2 from '../versor.C2.esm.js';

let C2Canvas = function(canvas) {
  let ctx = canvas.getContext("2d");
  ctx.fillStyle = "black";
  ctx.strokeStyle = "black";
  let bounds = {
    x: [-4, 4],
    y: [-4, 4]
  };

  function mapx(x) {
    return canvas.width*(x-bounds.x[0])/(bounds.x[1] - bounds.x[0]);
  }

  function mapy(y) {
    return canvas.height*(y-bounds.y[0])/(bounds.y[1] - bounds.y[0]);
  }

  function inversemapx(x) {
    return x*(bounds.x[1] - bounds.x[0])/canvas.width + bounds.x[0];
  }

  function inversemapy(y) {
    return y*(bounds.y[1] - bounds.y[0])/canvas.height + bounds.y[0];
  }

  function scale(r) {
    return canvas.width/(bounds.x[1] - bounds.x[0])*r;
  }
  
  function triangle(x1, y1, x2, y2, x3, y3) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.lineTo(x3, y3);
    ctx.closePath();
    ctx.fill();
  }

  let pointRadius = 2;
  let lineCapSize = 10;

  let dispatch = {
    Vec2: function(el) {
      let x1 = mapx(el[0]);
      let y1 = mapy(el[1]);
      let normalizedEl = C2.unit(el);
      let normal = C2.duale(el);
      let pointOffset = normalizedEl.gp(lineCapSize);
      let offset = normal.gp(lineCapSize);
    
      ctx.beginPath();
      ctx.moveTo(mapx(0), mapy(0));
      ctx.lineTo(x1, y1);
      ctx.stroke();
      
      triangle(
        x1+offset[0], y1+offset[1],
        x1+pointOffset[0], y1+pointOffset[1],
        x1-offset[0], y1-offset[1]
      );
    },
    Vec: function(el) {
      let rsquared = C2.Ro.size(el);

      let center = C2.Ro.cen(el);

      let x = mapx(center[0]);
      let y = mapy(center[1]);
      let r = scale(Math.sqrt(Math.abs(rsquared)));
      if (r === 0) r = pointRadius;

      ctx.beginPath();
      if (rsquared > 0) {
        ctx.strokeStyle = "blue";
      } else if (rsquared < 0) {
        ctx.strokeStyle = "red";
      }
      circle(x,y,r);
      ctx.stroke();
    },
    Biv: function (el) {
      let size = C2.Ro.size(el);

      let points = C2.Ro.split(el);

      let x1 = mapx(points[0][0]);
      let y1 = mapy(points[0][1]);
      let x2 = mapx(points[1][0]);
      let y2 = mapy(points[1][1]);

      ctx.beginPath();
      if (size > 0) {
        ctx.strokeStyle = "blue";
      } else if (size < 0) {
        ctx.strokeStyle = "red";
      }
      //TODO If the size is 0, this is a tangent. How do we want to represent that?
      circle(x1, y1, pointRadius);
      ctx.moveTo(x2, y2 + pointRadius);
      circle(x2, y2, pointRadius);
      ctx.stroke();

      ctx.beginPath();
      // Want to draw this dashed, but dashed lines aren't widely supported yet.
      ctx.strokeStyle = "#888";
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    },
    Tri: function (el) {
      return dispatch.Vec(C2.dual(el));
    },
    Lin: function (el) {
      // Points traverse bounds clockwise from top left
      let p1 = C2.Ro.point(bounds.x[0], bounds.y[0]);
      let p2 = C2.Ro.point(bounds.x[1], bounds.y[0]);
      let p3 = C2.Ro.point(bounds.x[1], bounds.y[1]);
      let p4 = C2.Ro.point(bounds.x[0], bounds.y[1]);

      let dualEl = C2.dual(el);

      let topIntersection = C2.Ro.point.normalize(dualEl.ip(p1.op(p2).op(C2.Inf)));
      let rightIntersection = C2.Ro.point.normalize(dualEl.ip(p2.op(p3).op(C2.Inf)));
      let bottomIntersection = C2.Ro.point.normalize(dualEl.ip(p3.op(p4).op(C2.Inf)));
      let leftIntersection = C2.Ro.point.normalize(dualEl.ip(p4.op(p1).op(C2.Inf)));

      let displayIntersections = [];
      if (bounds.x[0] <= topIntersection[0] && topIntersection[0] < bounds.x[1]) {
        displayIntersections.push(topIntersection);
      }
      if (bounds.y[0] <= rightIntersection[1] && rightIntersection[1] < bounds.y[1]) {
        displayIntersections.push(rightIntersection);
      }
      if (bounds.x[0] <= bottomIntersection[0] && bottomIntersection[0] < bounds.x[1]) {
        displayIntersections.push(bottomIntersection);
      }
      if (bounds.y[0] <= leftIntersection[1] && leftIntersection[1] < bounds.y[1]) {
        displayIntersections.push(leftIntersection);
      }

      if (displayIntersections.length < 2) return;

      ctx.beginPath();
      ctx.moveTo(mapx(displayIntersections[0][0]), mapy(displayIntersections[0][1]));
      ctx.lineTo(mapx(displayIntersections[1][0]), mapy(displayIntersections[1][1]));
      ctx.stroke();
    },
    Dll: function (el) {
      // could render as a different style
      let del = C2.dual(el);
      dispatch[del.type](del);
    },
    Drv: function(el) {
      let del = C2.Dr.elem(el);
      dispatch[del.type](del);
    },
    Tnv: function(el) {
    	let dir = C2.Ta.dir(el);
    	let loc = C2.Ta.loc(el);
    	dispatch[dir.type](dir);
    	dispatch[loc.type](loc);
    }
  };

  let dispatchPriority = [
    'Vec2',
    'Dll',
    'Vec',
    'Biv',
    'Lin',
    'Drv',
    'Tri'
  ];

  let draw = function(els) {
    if (els.length) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < els.length; i++) draw(els[i]);
      return;
    }
    ctx.save();

    if (dispatch.hasOwnProperty(els.type)) {
      dispatch[els.type](els);
    } else {
      for (let j = 0; j < dispatchPriority.length; j++) {
        let type = dispatchPriority[j];
        if (C2.isSubType(type, els.type)) {
          dispatch[type](C2[type](els));
          break;
        }
      }
    }
    
    ctx.restore();
  };

  draw.bounds = function(value) {
    if (!arguments.length) return bounds;
    bounds = value;

    // Adjust y bounds so that the bounds have the same aspect ratio as the canvas.
    // Otherwise our map functions don't work correctly.
 // let xc = 0.5*(bounds.x[0] + bounds.x[1]);
    let yc = 0.5*(bounds.y[0] + bounds.y[1]);
    let xrange = bounds.x[1] - bounds.x[0];
    bounds.y[0] = yc - 0.5*canvas.height/canvas.width*xrange;
    bounds.y[1] = yc + 0.5*canvas.height/canvas.width*xrange;

    return draw;
  };

  function circle(x,y,r) {
    ctx.arc(x,y,r,0,2*Math.PI);
  }

  draw.mapx = mapx;
  draw.mapy = mapy;
  draw.inversemapx = inversemapx;
  draw.inversemapy = inversemapy;
  draw.scale = scale;

  return draw;
};

export default C2Canvas;
