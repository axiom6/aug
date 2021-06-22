import {
  unit
} from '../../test/Tester.js';

import Vis from './Vis.js';

unit().describe("Vis", "rgb");

unit("Vis.rgb(0xFFFFFF)", Vis.rgb(0xFFFFFF), {
  r: 255,
  g: 255,
  b: 255,
  a: 1.0
});

unit("Vis.hex({r:255,g:255,b:255})", Vis.hex({
  r: 255,
  g: 255,
  b: 255
}), 0xFFFFFF); // Appears as 16777215 in decimal

unit("Vis.str({r:255,g:255,b:255})", Vis.str({
  r: 255,
  g: 255,
  b: 255
}), "0xFFFFFF");

console.log(unit().status());

unit().describe("Vis", "ysv");

unit("Vis.strHex(255)", Vis.strHex(255), "FF");

unit("Vis.rgbHue(  0) red", Vis.rgbHue(0), 0);

unit("Vis.rgbHue( 90) yellow", Vis.rgbHue(90), 60);

unit("Vis.rgbHue(180) green", Vis.rgbHue(180), 120);

unit("Vis.rgbHue(270) blue", Vis.rgbHue(270), 240);

unit("Vis.rygbHue(  0) red", Vis.rygbHue(0), 0);

unit("Vis.rygbHue( 60) yellow", Vis.rygbHue(60), 90);

unit("Vis.rygbHue(120) green", Vis.rygbHue(120), 180);

unit("Vis.rygbHue(240) blue", Vis.rygbHue(240), 270);

unit("Vis.rgb([  0,100,100]) red", Vis.rgb([0, 100, 100]), {
  r: 255,
  g: 0,
  b: 0,
  a: 1.0
});

unit("Vis.rgb([180,100,100]) green", Vis.rgb([180, 100, 100]), {
  r: 0,
  g: 255,
  b: 0,
  a: 1.0
});

unit("Vis.rgb([270,100,100]) blue", Vis.rgb([270, 100, 100]), {
  r: 0,
  g: 0,
  b: 255,
  a: 1.0
});

unit("Vis.str([  0,  0,  0]) black", Vis.str([0, 0, 0]), "0x000000");

unit("Vis.str([  0,  0, 50]) gray", Vis.str([0, 0, 50]), "0x808080");

unit("Vis.str([  0,  0,100]) white", Vis.str([0, 0, 100]), "0xFFFFFF");

unit("Vis.str([  0,100,100]) red", Vis.str([0, 100, 100]), "0xFF0000");

unit("Vis.str([ 45,100,100]) orange", Vis.str([45, 100, 100]), "0xFF8000"); // ???

unit("Vis.str([ 90,100,100]) yellow", Vis.str([90, 100, 100]), "0xFFFF00");

unit("Vis.str([135,100,100]) lime", Vis.str([135, 100, 100]), "0x80FF00"); // ???

unit("Vis.str([180,100,100]) green", Vis.str([180, 100, 100]), "0x00FF00");

unit("Vis.str([225,100,100]) cyan", Vis.str([225, 100, 100]), "0x00FFFF");

unit("Vis.str([270,100,100]) blue", Vis.str([270, 100, 100]), "0x0000FF");

unit("Vis.str([315,100,100]) magenta", Vis.str([315, 100, 100]), "0xFF00FF");

// Log the current block of tests and then the summary for 'Vis'
console.log(unit().summary('Vis'));

//# sourceMappingURL=Vis-unit.js.map
