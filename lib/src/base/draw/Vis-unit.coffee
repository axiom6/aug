
import { unit } from '../../test/Tester.js'
import   Vis    from './Vis.js'

unit().describe("Vis", "rgb")
unit( "Vis.rgb(0xFFFFFF)",            Vis.rgb(0xFFFFFF), {r:255,g:255,b:255}   )
unit( "Vis.hex({r:255,g:255,b:255})", Vis.hex({r:255,g:255,b:255}),  0xFFFFFF  ) # Appears as 16777215 in decimal
unit( "Vis.str({r:255,g:255,b:255})", Vis.str({r:255,g:255,b:255}), "0xFFFFFF" )
unit( "Vis.hex([255,255,255])",       Vis.hex([255,255,255]),        0xFFFFFF  ) # Appears as 16777215 in decimal
unit( "Vis.str([255,255,255])",       Vis.str([255,255,255]),       "0xFFFFFF" )

unit().describe("Vis", "ysv")
unit( "Vis.hex([  0,100,100],'ysv')", Vis.hex([  0,100,100],'ysv'),  0xFFFFFF  ) # Appears as 16777215 in decimal
unit( "Vis.str([  0,100,100],'ysv')", Vis.str([  0,100,100],'ysv'), "0xFFFFFF" )
unit( "Vis.hex([  0,  0,  0],'ysv')", Vis.hex([  0,100,100],'ysv'),  0x000000  ) # Appears as 0        in decimal
unit( "Vis.str([  0,  0,  0],'ysv')", Vis.str([  0,100,100],'ysv'), "0x000000" )

unit().summary("Vis")