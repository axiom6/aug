var TripD3,
  hasProp = {}.hasOwnProperty;

import {
  vis
} from '../../../lib/pub/draw/Vis.js';

import MilePosts from '../../../data/exit/Mileposts.json';

TripD3 = class TripD3 {
  constructor(svgMgr) {
    this.svgMgr = svgMgr;
    this.d3 = this.svgMgr.d3;
    this.svg = this.svgMgr.svg;
    this.g = this.svgMgr.g;
    this.segs = this.createSeqs();
    this.debug = true;
  }

  createSeqs() {
    var i, key, obj, segs;
    segs = [];
    i = 1;
    for (key in Mileposts) {
      if (!hasProp.call(Mileposts, key)) continue;
      obj = Mileposts[key];
      if (i === 1) {
        segs[0] = obj.Beg;
      }
      segs[i] = obj.End;
      i++;
    }
    return seqs;
  }

  draw() {
    var beg, end, fill, h, i, j, ref, thick, w, x, y;
    d3.select('#' + this.gId).selectAll("*").remove();
    this.mileBeg = this.segs[0];
    this.mileEnd = this.segs[this.segs.length - 1];
    this.distance = Math.abs(this.mileBeg - this.mileEnd);
    if (this.debug) {
      console.log('TripD3.draw() 1', {
        mileBeg: this.mileBeg,
        mileEnd: this.mileEnd,
        distance: this.distance
      });
    }
    thick = 1;
    x = 0;
    y = this.barTop();
    w = this.svgWidth();
    h = this.barHeight();
    this.createTravelTime(trip, this.g, x, y, w, h);
    this.rect(trip, this.g, trip.segments[0], this.role + 'Border', x, y, w, h, 'transparent', 'white', thick * 4, '');
    for (i = j = 0, ref = this.segs.lenght - 1; (0 <= ref ? j < ref : j > ref); i = 0 <= ref ? ++j : --j) {
      beg = w * Math.abs(this.segs[i] - this.mileBeg) / this.distance;
      end = w * Math.abs(this.segs[i + 1] - this.mileBeg) / this.distance;
      fill = this.fillCondition(seg.segId, trip.conditions);
      if (this.debug) {
        console.log('TripD3.draw() 2', {
          segId: seg.segId,
          beg: beg,
          end: end,
          w: Math.abs(end - beg)
        });
      }
      this.rect(trip, this.g, seg, seg.segId, beg, y, Math.abs(end - beg), h, fill, 'black', thick, '');
    }
    this.created = true;
  }

};

export default TripD3;

//# sourceMappingURL=TripD3.js.map
