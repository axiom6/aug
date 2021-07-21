import {
  test
} from '../test/Tester.js';

import {
  vis
} from './Vis.js';

test().module("Visualization Utility").on();

test().describe("Visualization Utility").on();

test("rgb(0xFFFFFF)", vis.rgb(0xFFFFFF), {
  r: 255,
  g: 255,
  b: 255,
  a: 1.0
});

test("hex({r:255,g:255,b:255})", vis.hex({
  r: 255,
  g: 255,
  b: 255
}), 0xFFFFFF); // Appears as 16777215 in decimal

test("str({r:255,g:255,b:255})", vis.str({
  r: 255,
  g: 255,
  b: 255
}), "0xFFFFFF");

test("strHex(255)", vis.strHex(255), "FF");

test("rgbHue(  0) red", vis.rgbHue(0), 0);

test("rgbHue( 90) yellow", vis.rgbHue(90), 60);

test("rgbHue(180) green", vis.rgbHue(180), 120);

test("rgbHue(270) blue", vis.rgbHue(270), 240);

test("rygbHue(  0) red", vis.rygbHue(0), 0);

test("rygbHue( 60) yellow", vis.rygbHue(60), 90);

test("rygbHue(120) green", vis.rygbHue(120), 180);

test("rygbHue(240) blue", vis.rygbHue(240), 270);

test("rgb([  0,100,100]) red", vis.rgb([0, 100, 100]), {
  r: 255,
  g: 0,
  b: 0,
  a: 1.0
});

test("rgb([180,100,100]) green", vis.rgb([180, 100, 100]), {
  r: 0,
  g: 255,
  b: 0,
  a: 1.0
});

test("rgb([270,100,100]) blue", vis.rgb([270, 100, 100]), {
  r: 0,
  g: 0,
  b: 255,
  a: 1.0
});

test("str([  0,  0,  0]) black", vis.str([0, 0, 0]), "0x000000");

test("str([  0,  0, 50]) gray", vis.str([0, 0, 50]), "0x808080");

test("str([  0,  0,100]) white", vis.str([0, 0, 100]), "0xFFFFFF");

test("str([  0,100,100]) red", vis.str([0, 100, 100]), "0xFF0000");

test("str([ 45,100,100]) orange", vis.str([45, 100, 100]), "0xFF8000");

test("str([ 90,100,100]) yellow", vis.str([90, 100, 100]), "0xFFFF00");

test("str([135,100,100]) lime", vis.str([135, 100, 100]), "0x80FF00");

test("str([180,100,100]) green", vis.str([180, 100, 100]), "0x00FF00");

test("str([225,100,100]) cyan", vis.str([225, 100, 100]), "0x00FFFF");

test("str([270,100,100]) blue", vis.str([270, 100, 100]), "0x0000FF");

test("str([315,100,100]) magenta", vis.str([315, 100, 100]), "0xFF00FF");

// Log the current block of tests and then the summary for 'Vis'
test().log(test().summary());

//# sourceMappingURL=Vis-unit.js.map
