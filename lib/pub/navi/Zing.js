var Zing;

import {
  ZingTouch as ZT
} from "zingtouch";

Zing = class Zing {
  constructor(stream, nav) {
    this.stream = stream;
    this.nav = nav;
    this.nav.zing = this;
  }

  swipe(elem) {
    var region;
    region = ZT.Region(elem);
    return region.bind(elem, "swipe", this.onSwipe);
  }

  onSwipe(event) {}

};

//# sourceMappingURL=Zing.js.map
