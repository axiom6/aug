var TripD3;

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
    this.debug = true;
  }

  draw() {
    var beg, distance, end, fill, h, i, j, mileBeg, mileEnd, ref, thick, w, x, y;
    this.d3.select('#' + this.gId).selectAll("*").remove();
    mileBeg = MilePosts[0].mile;
    mileEnd = MilePosts[MilePosts.length - 1].mile;
    distance = Math.abs(mileBeg - mileEnd);
    if (this.debug) {
      console.log('TripD3.draw() 1', {
        mileBeg: mileBeg,
        mileEnd: mileEnd,
        distance: distance
      });
    }
    thick = 1;
    x = 0;
    y = this.barTop();
    w = this.svgWidth();
    h = this.barHeight();
    this.createTravelTime(trip, this.g, x, y, w, h);
    this.rect(trip, this.g, trip.segments[0], this.role + 'Border', x, y, w, h, 'transparent', 'white', thick * 4, '');
    beg = w * Math.abs(MilePosts[0].mile - mileBeg) / distance;
    end = 0;
    for (i = j = 1, ref = MilePosts.lenght; (1 <= ref ? j < ref : j > ref); i = 1 <= ref ? ++j : --j) {
      end = w * Math.abs(MilePosts[i].milw - mileBeg) / distance;
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
      beg = end;
    }
    this.created = true;
  }

};

export default TripD3;

//# sourceMappingURL=TripD3.js.map
