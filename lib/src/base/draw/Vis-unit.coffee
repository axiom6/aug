
import { unit } from '../../test/Tester.js'
import   Vis    from './Vis.js'

unit().describe("Vis", "rgb")

unit( "rgb(0xFFFFFF)",            Vis.rgb(0xFFFFFF), {r:255,g:255,b:255, a:1.0 }   )
unit( "hex({r:255,g:255,b:255})", Vis.hex({r:255,g:255,b:255}),  0xFFFFFF  ) # Appears as 16777215 in decimal
unit( "str({r:255,g:255,b:255})", Vis.str({r:255,g:255,b:255}), "0xFFFFFF" )

unit().describe("Vis", "ysv")
unit( "strHex(255)", Vis.strHex(255), "FF" )

unit( "rgbHue(  0) red",    Vis.rgbHue(  0),   0 )
unit( "rgbHue( 90) yellow", Vis.rgbHue( 90),  60 )
unit( "rgbHue(180) green",  Vis.rgbHue(180), 120 )
unit( "rgbHue(270) blue",   Vis.rgbHue(270), 240 )

unit( "rygbHue(  0) red",    Vis.rygbHue(  0),   0 )
unit( "rygbHue( 60) yellow", Vis.rygbHue( 60),  90 )
unit( "rygbHue(120) green",  Vis.rygbHue(120), 180 )
unit( "rygbHue(240) blue",   Vis.rygbHue(240), 270 )

unit( "rgb([  0,100,100]) red",   Vis.rgb([  0,100,100]), {r:255,g:0,b:0,a:1.0} )
unit( "rgb([180,100,100]) green", Vis.rgb([180,100,100]), {r:0,g:255,b:0,a:1.0} )
unit( "rgb([270,100,100]) blue",  Vis.rgb([270,100,100]), {r:0,g:0,b:255,a:1.0} )

unit( "str([  0,  0,  0]) black",   Vis.str([  0,  0,  0]), "0x000000" )
unit( "str([  0,  0, 50]) gray",    Vis.str([  0,  0, 50]), "0x808080" )
unit( "str([  0,  0,100]) white",   Vis.str([  0,  0,100]), "0xFFFFFF" )

unit( "str([  0,100,100]) red",     Vis.str([  0,100,100]), "0xFF0000" )
unit( "str([ 45,100,100]) orange",  Vis.str([ 45,100,100]), "0xFF8000" )
unit( "str([ 90,100,100]) yellow",  Vis.str([ 90,100,100]), "0xFFFF00" )
unit( "str([135,100,100]) lime",    Vis.str([135,100,100]), "0x80FF00" )
unit( "str([180,100,100]) green",   Vis.str([180,100,100]), "0x00FF00" )
unit( "str([225,100,100]) cyan",    Vis.str([225,100,100]), "0x00FFFF" )
unit( "str([270,100,100]) blue",    Vis.str([270,100,100]), "0x0000FF" )
unit( "str([315,100,100]) magenta", Vis.str([315,100,100]), "0xFF00FF" )

# Log the current block of tests and then the summary for 'Vis'
console.log( unit().summary('Vis') )