
import Type     from '../test/Type.js'
import FontAwe  from './FontAwe.js'
import chroma   from 'chroma-js'

class Vis extends Type

  constructor:() ->
    super()
    @skipReady   = false
    @time        = 0
    @uniqueIdExt = ''
    @chroma      = chroma
    @debug       = false
    @distribution10s = [0, 5,10,15,20,25,30,35,40,45,50,55,60,65,70,75,80,85,90,95,100]
    @distributionPri = [0,20,30,40,50,54,58,62,65,68,71,74,75,76,82,88,88,91,94,97,100]
    @distributionSec = [0,20,30,40,50,54,58,62,65,68,71,74,75,76,82,88,88,91,94,97,100]
  
  # --- Color Spaces  ---
  # RGB - that also works a RGBa with a:1.0 as a default or can be provided in objects or arrays
  # HSV - recogized as input by Vis.rga(arg) with either rgb or rygb hues
  # HSL - standalone
  # LCH - not implemented yet
  # LAB - not implemented yet

  # @rgb is the conversion work horse that is used by the other functions
  # Always returns an rgb object like { r:255, b:255, b:255, a:1.0 } rounded to from 0 to 255
  #   When arg is an object then just return rgb object with a or alpha defaulted or added
  #   When arg is an array with length === 3 then it is assumed values are hsv with hue in RYGB
  #     hue 360, saturation 100, v for intensity 100
  #     with hue as RYGB red=0deg, yellow=90deg green=180deg and blue=270deg
  #   When arg is an array with length === 4 then it is assumed values  are hsv
  #     with hue as RGB red=0deg, green=120deg and blue=240deg
  #   When arg is a number the range expressed hex is 0x000000 to 0xFFFFFF
  # console.log( 'Vis.rgb()', { arg:arg, rgb:rgb, isRYGB:isRYGB } ) if @debug
  rgb:( arg ) ->
    rgb = { r:255, g:255, b:255, a:1.0 } # default is white with alpha = 1.0 opaque
    if @isObject(arg)
      rgb   = arg
      rgb.a = if arg.a? then arg.a else 1.0
    else if @isArray(arg)
      type  = if arg.length is 4 then arg[3] else "HSV"
      rgb   = @rgbCyl( arg, type )
      rgb.a = 1
    else if @isNumber(arg)
      rgb = { r:(arg & 0xFF0000) >> 16,   g:(arg & 0x00FF00) >> 8,  b:arg & 0x0000FF }
      rgb.a = 1.0
    @round(rgb)

  # Returns an rgb array with an alpha or full opacity of 1
  rgba:( arg ) ->
    rgb   = @rgb( arg )
    rgb.a = 1.0 if not rgb.a?
    [ rgb.r, rgb.g, rgb.b, rgb.a ]

  # Returns a number that is interpreted as hex like 0xFFFFFF
  #   Recommended for most libraries like Three.js
  # 65536 is 16 to the fourth power and 256 is 16 squared
  # Need to figure out how to generate an actual value not string in hex
  hex:( arg ) ->
    rgb = @rgb( arg )
    rgb.r * 65536 + rgb.g * 256 + rgb.b

  # Returns a number in hex format like '0xFFFFFF'
  # Good for debugging
  # Only use for hex strings.
  # Do not use for hex values in style
  str:( arg ) ->
    rgb  = @rgb( arg )
    str  = '0x'
    str += @strHex(rgb.r)
    str += @strHex(rgb.g)
    str += @strHex(rgb.b)
    str

  # returns a css string in rgb format
  # Recommended for all style in Vue and Svg
  css:( arg  ) ->
    rgb  = @rgb( arg )
    """rgb(#{rgb.r},#{rgb.g},#{rgb.b})"""

  # Returns hsv when toRYGB=false or ysv when toRYGB=true
  cyl:( arg, toRYGB=false ) ->
    rgb  = @rgb( arg )
    R = rgb.r
    G = rgb.g
    B = rgb.b
    sum = R + G + B
    r = R/sum; g = G/sum; b = B/sum
    v = sum / 3
    s = if R is G and G is B then 0 else 1 - 3 * Math.min(r,g,b) # Center Grayscale
    a = @deg( Math.acos( ( r - 0.5*(g+b) ) / Math.sqrt((r-g)*(r-g)+(r-b)*(g-b)) ) )
    h = if b <= g then a else 360 - a
    h = 0 if s is 0
    H = if toRYGB then @rygbHue(h) else h
    [ H, s*100, v/2.55 ]

  hsv:( arg ) ->
    @cyl( arg, false )

  # Returns an  array with hue in rygb coords
  # RYGB red=0deg, yellow=90deg green=180deg and blue=270deg
  ysv:( arg ) ->
    @cyl( arg, true )

  # Need to chech output format
  sphere:( hue, phi, rad ) ->
    @rgba( [@rot(hue,90), 100*@sin(phi), 100*rad ] )

  # Uses ` ` to fake out CoffeeScript code inspector
  strHex:( num ) ->
    str = `num.toString(16).toUpperCase()`
    switch
      when num is  0 then '00'
      when num <  16 then '0' + str
      else                str

  # Adjust rgb values to stay in range
  adj:( v ) ->
    a = Math.round(v)
    a = if a <   0 then   0 else a
    a = if a > 255 then 255 else a
    a

  # Rounds and scales rgb value amd limits ints between 0 to 255
  round:( rgb, scale=1, add=0 ) ->
    rgb.a = if rgb.a? then rgb.a else 1.0
    { r:@adj((rgb.r+add)*scale), g:@adj((rgb.g+add)*scale), b:@adj((rgb.b+add)*scale), a:rgb.a }

  # Converts hues in 'ysv' RYGB range to 'hsv' and 'hsl' rgb hue
  #   'rygb' has red=0deg, yellow=90deg green=180deg and blue=270deg
  #   'rgb'  has red=0deg,              green=120deg and blue=240deg
  rgbHue:( rygbHue ) ->
    rgbHue = 0
    if        0 <= rygbHue and rygbHue <  90 then rgbHue =        rygbHue      *  60 / 90
    else if  90 <= rygbHue and rygbHue < 180 then rgbHue =  60 + (rygbHue- 90) *  60 / 90
    else if 180 <= rygbHue and rygbHue < 270 then rgbHue = 120 + (rygbHue-180) * 120 / 90
    else if 270 <= rygbHue and rygbHue < 360 then rgbHue = 240 + (rygbHue-270) * 120 / 90
    rgbHue

  # Converts hues in 'hsv' or 'hsl' RGB hue to 'tsv' RYGB range
  #   'rgb'  has red=0deg,              green=120deg and blue=240deg
  #   'rygb' has red=0deg, yellow=90deg green=180deg and blue=270deg
  rygbHue:( rgbHue ) ->
    rygbHue = 0
    if        0 <= rgbHue and rgbHue < 120 then rygbHue =        rgbHue      *  90 /  60
    else if 120 <= rgbHue and rgbHue < 240 then rygbHue = 180 + (rgbHue-120) *  90 / 120
    else if 240 <= rgbHue and rgbHue < 360 then rygbHue = 270 + (rgbHue-240) *  90 / 120
    rygbHue

  ###
  black:      { in: [0,0,0],     out: [0,0,0,1]},
  white:      { in: [0,0,1],     out: [255,255,255,1]},
  gray:       { in: [0,0,0.5],   out: [127.5,127.5,127.5,1]},
  red:        { in: [0,1,0.5],   out: [255,0,0,1]},
  yellow:     { in: [60,1,0.5],  out: [255,255,0,1]},
  green:      { in: [120,1,0.5], out: [0,255,0,1]},
  cyan:       { in: [180,1,0.5], out: [0,255,255,1]},
  blue:       { in: [240,1,0.5], out: [0,0,255,1]},
  magenta:    { in: [300,1,0.5], out: [255,0,255,1]},
  chorma.hsv()
  ###

  rgbCyl:( a, type ) ->
    isRYGB = not ( type.length is 4 and type.charAt(3) is 'R' )
    h = if isRYGB then @rgbHue(a[0]) else a[0]
    s = a[1]
    v = a[2]
    switch type
      when 'HSV', 'HSVR' then @rgbHsv( h, s, v )
      when 'HMI', 'HMIR' then @rgbHmi( h, s, v )
      when 'HWV', 'HWVR' then @rgbHwv( h, s, v )
      when 'HSC', 'HSCR' then @rgbHsc( h, s, v ) # HSC means use chroma for HSV
      when 'HSI', 'HSIR' then @rgbHsi( h, s, v )
      when 'HCI', 'HCIR' then @rgbHci( h, s, v ) # HCI is a more saturated HSI
      when 'HSL', 'HSLR' then @rgbHsl( h, s, v )
      else
        console.log( "Vis.rgbCyl() #{type} unknown" )
        @rbgHsv( h, s, v )

  rgbHsc:( H, S, V ) ->
    h = H
    c = chroma.hsv( h, S*0.01, V*0.01 )
    a = c._rgb
    rgb = { r:a[0], g:a[1], b:a[2], a:1 }
    rgb = @round( rgb, 1.0 )
    console.log( "Vis.rgbHsc()", rgb, h, S, V ) if @debug
    rgb

  # toRygb=true is 'ysc' while
  ###
    var i = floor$1(h);
    var f = h - i;
    var p = v * (1 - s);
    var q = v * (1 - s * f);
    var t = v * (1 - s * (1 - f));
  ###
  rgbHsv:( H, S, V ) ->
    h = H
    d = S * 0.01
    c = d # @sigmoidal( d, 2, 0.25 )
    i = Math.floor( h / 60 )
    f = h / 60 - i
    x = 1 - c
    y = 1 - f * c
    z = 1 - (1 - f) * c
    rgb = switch i % 6
      when 0 then { r:1, g:z, b:x }
      when 1 then { r:y, g:1, b:x }
      when 2 then { r:x, g:1, b:z }
      when 3 then { r:x, g:y, b:1 }
      when 4 then { r:z, g:x, b:1 }
      when 5 then { r:1, g:x, b:y }
    @round( rgb, 255 * V / 100 )

  rgbHwv:( h, S, V ) ->
    s = S * 0.01
    v = V * 0.01
    f = (n) =>
      k = ( n + h / 60 ) % 6
      v = v - v * s * Math.max( 0, Math.min( k, 4-k, 1 ) )
    rgb = { r:f(5), g:f(3), b:f(1) }
    rgb = @round( rgb, 255 )
    console.log( "Vis.rgbHwv()", rgb, h, S, V ) # if @debug
    rgb

  rgbHmi:( h, S, I ) ->
    look   = @lookUpSat( S )
    sat    = look * 0.01
    desat  = 1 - sat
    bright = I * 0.01
    r = 0
    g = 0
    b = 0
    boost = true
    pri = ( val, max ) ->
      if boost then val / max else val
    sec = ( val, max ) ->
      if boost then desat + ( sat * val / max ) else desat + sat * val
    rem = ( q, n ) =>
      q/n - Math.floor(q/n)
    fwd = rem(h,120)
    bak = 1 - fwd
    if        0 <= h and h <  60  # red   pri green sec
      r = pri( bak, bak )
      g = sec( fwd, bak )
      b = desat
    else if  60 <= h and h < 120  # green pri red   sec
      g = pri( fwd, fwd )
      r = sec( bak, fwd )
      b = desat
    else if 120 <= h and h < 180  # green pri blue  sec
      g = pri( bak, bak )
      b = sec( fwd, bak )
      r = desat
    else if 180 <= h and h < 240  # blue   pri green sec
      b = pri( fwd, fwd )
      g = sec( bak, fwd )
      r = desat
    else if  240 <= h and h < 300 # blue  pri red   sec
      b = pri( bak, bak )
      r = sec( fwd, bak )
      g = desat
    else if  300 <= h and h < 360 # red   pri blue  sec
      r = pri( fwd, fwd )
      b = sec( bak, fwd )
      g = desat
    rgb = @round( { r:r, g:g, b:b }, 255 * bright )
    console.log( "Vis.rgbHmi()", { rgb:rgb, h:h, S:look, I:I } ) if @debug
    rgb

  # From chroma.js
  rgbHsi:( Hue, Rad, Val ) ->
    hue  = Hue
    h = hue / 360
    s = Rad * 0.01
    i = Val * 0.01
    if h < 1/3
      b = (1-s)/3
      r = (1+s*@cos(hue)/@cos(120-hue))/3
      g = 1 - (b+r)
    else if h < 2/3
      h -= 1/3;
      r = (1-s)/3;
      g = (1+s*@cos(hue)/@cos(120-hue))/3;
      b = 1 - (r+g);
    else
      h -= 2/3
      g = (1-s)/3
      b = (1+s*@cos(hue)/@cos(120-hue))/3
      r = 1 - (g+b)
    @round( { r:r, g:g, b:b }, 255 * i * 3 ) # * 3

  # toRygb=true is 'ysc'
  # hue is converted to red=0deg, green=120deg and blue=240deg
  rgbHci:( Hue, Rad, Val ) ->
    hue  = Hue
    rad  = 0.01 * Rad
    val  = 0.01 * Val
    hq   = Math.floor( hue-1 / 60 )
    z    = 1 - Math.abs( hq % 2 )
    c    = ( 3 * val * rad ) / ( 1 + z )
    x    = c * z
    add  = val * ( 1 - rad )
    rgb  = switch hq % 6
      when 0 then { r:c, g:x, b:0 }  #   0 -  60  red
      when 1 then { r:x, g:c, b:0 }  #  60 - 120  green
      when 2 then { r:0, g:c, b:x }  # 120 - 180  green
      when 3 then { r:0, g:x, b:c }  # 180 - 240  blue
      when 4 then { r:x, g:0, b:c }  # 240 - 300  blue
      when 5 then { r:c, g:0, b:x }  # 300 - 360  red
    @round( rgb, 100, add )

  # Standalone since HSV is not detected by @rgb( arg )
  rgbHsl:( H, s, l ) ->
    h = H
    i = Math.floor( h / 60 )
    f = h / 60 - i
    p = l * (1 - s)
    q = l * (1 - f * s)
    t = l * (1 - (1 - f) * s)
    v = l
    rgb = switch i % 6
      when 0 then { r:v, g:t, b:p }
      when 1 then { r:q, g:v, b:p }
      when 2 then { r:p, g:v, b:t }
      when 3 then { r:p, g:q, b:v }
      when 4 then { r:t, g:p, b:v }
      when 5 then { r:v, g:p, b:q }
    @round( rgb, 255 )

  sigmoidal:( x, k, x0=0.5, L=1 ) ->
    L / ( 1 + Math.exp(-k*(x-x0)) )

  interpolateRgb:( rgb1, r1, rgb2, r2 ) ->
    { r:rgb1.r * r1 + rgb2.r * r2, g:rgb1.g * r1 + rgb2.g * r2, b:rgb1.b * r1 + rgb2.b * r2 }

  hue:( pageKey, isRYGB ) ->
    toRYGB = ( rygb, rgb ) ->
      if isRYGB then rygb else rgb
    switch pageKey
      when 'Red'     then 0
      when 'Orange'  then toRYGB(  45,  30 )
      when 'Yellow'  then toRYGB(  90,  60 )
      when 'Lime'    then toRYGB( 135,  90 )
      when 'Green'   then toRYGB( 180, 120 )
      when 'Teal'    then toRYGB( 203, 150 )
      when 'Cyan'    then toRYGB( 225, 180 )
      when 'Blue'    then toRYGB( 270, 240 )
      when 'Magenta' then toRYGB( 315, 300 )
      else
        console.log( 'Vis.hue() unknown pageKey', pageKey )
        0
        
  lookUpSat:( sat ) =>
    len = @distribution10s.length
    idx = @distribution10s.indexOf(sat)
    val = if 0 <= idx and idx < len then @distributionPri[idx] else 100
    console.log( "Vis.lookUpSat(sat)", { sat:sat, idx:idx, val:val } ) if @debug
    val

  even:( val ) =>
    val

# Create a distributed array of values
  #  by default it returns [0,10,20,30,40,50,60,70,80,90,100] a closed range of 11 values
  distribution:( func=@even, interval=10, min=0, max=100 ) =>
    array = []
    array.push( func(val) ) for val in [min..max] by interval
    array

  # --- Degrees and Radians ---
  #  The svg functions deal with the svg convention where the y 90 degree axis points down

  rad:( deg )     -> deg * Math.PI / 180
  deg:( rad )     -> rad * 180 / Math.PI
  sin:( deg )     -> Math.sin(@rad(deg))
  cos:( deg )     -> Math.cos(@rad(deg))
  abs:( val )     -> Math.abs( val  )
  max:( args... ) -> Math.max( args )
  min:( args... ) -> Math.min( args )

  rot:( deg, ang ) ->
    a = deg+ang
    a = a + 360 if a < 0
    a

  svgDeg:( deg ) -> 360-deg
  svgRad:( rad ) -> 2*Math.PI-rad

  radSvg:( deg ) -> @rad(360-deg)
  degSvg:( rad ) -> @deg(2*Math.PI-rad)
  sinSvg:( deg ) -> Math.sin(@radSvg(deg))
  cosSvg:( deg ) -> Math.cos(@radSvg(deg))

  # --- Math Utilities ---

  floor:( x, dx )          ->  dr = Math.round(dx); Math.floor( x / dr ) * dr
  ceil:(  x, dx )          ->  dr = Math.round(dx); Math.ceil(  x / dr ) * dr
  isZero:( v )             -> -0.01 <  v    and v  <  0.01
  within:(min,val,max)     -> min   <= val  and val <= max  # Closed interval with <=

  hasGlobal:( global, issue=true ) ->
    has = window[global]?
    console.error( "Vis.hasGlobal() #{global} not present" )  if not has and issue
    has

  getGlobal:( global, issue=true ) ->
    if @hasGlobal( global, issue ) then window[global] else null

  ready:( fn ) ->
    switch fn
     when  not @isFunction( fn )  then return               # Sanity check
     when  @skipReady            then fn()
     when  document.readyState is 'complete' then fn() # If document is already loaded, run method
     else  document.addEventListener( 'DOMContentLoaded', fn, false )
    return

  getHtmlId:( name, type='', ext='' ) ->
    id = name + type + ext + @uniqueIdExt
    id.replace( /[ \.]/g, "" )

  cssNameType:( name, type='' ) -> name + type

  # --- Css Transforms ---  

  translate:( x0, y0 ) ->
    if @isInTypeKeyArgs('number',x0,y0)
      " translate( #{x0}, #{y0} )"
    else
      # toWarn(...)
      " translate( #{0}, #{0} )"

  scale:( sx, sy )  ->
    if @isInTypeKeyArgs('number',sx, sy)
      " s( #{sx}, #{sy} )"
    else
      # toWarn(...)
      " s( #{1}, #{1} )"

  rotate:( a, x, y ) ->
    if @isInTypeKeyArgs('number',a, x, y )
      " rotate(#{a} #{x} #{y} )"
    else
      # toWarn(...)
      " rotate(#{0} #{0} #{0} )"

  translateScale:( x0, y0, sx, sy ) ->
    if @isInTypeKeyArgs('number',x0, y0, sx, sy)
      " translate( #{x0}, #{y0} ) s( #{sx}, #{sy} )"
    else
      # toWarn(...)
      " translate( #{0}, #{0} ) s( #{1}, #{1} )"

  # Font Awesome Unicode lookup
  unicode:( icon ) ->
    uc    = FontAwe.icons[icon]
    if not uc?
      console.error( 'Vis.unicode() missing icon in Vis.FontAwesomeUnicodes for', icon )
      uc = "\uf111" # Circle
    uc

export vis = new Vis()

###
  hcl:( arg ) ->
    rgb  = @rgb( arg )
    R = rgb.r
    G = rgb.g
    B = rgb.b
    a   = 3 * ( Math.min(R,G,B) / Math.max(R,G,B) ) / 100
    q    = Math.exp( a )
    h180   = @deg( Math.atan2( G - B, R - G ) )
    H   = if h180 < 0 then 360 + h180 else h180
    C   = q * ( Math.abs(R−G) + Math.abs(G−B) + Math.abs(B−R) ) / 3
    L   = q *Math.max(R,G,B) + (1-q) * Math.min(R, G,B)  / 2
    [ H. C, L ]

HCL
  a   = 3 * ( Min(R,G,B) / Max(R,G,B) ) / 100
  q    = Math.exp( a )
  h180   = @deg( Math.atan2( G − B, R - G ) )
  H   = if h180 < 0 then 360 + h180 else h180
  C   = q * ( Math.abs(R−G) + Math.abs(G−B) + Math.abs(B−R) ) / 3
  L   = q*Math.max(R,G,B) + (1 − q)*Math.mim(R, G,B)  / 2

###
