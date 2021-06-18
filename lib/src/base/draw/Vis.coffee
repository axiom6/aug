
import Util     from '../../base/util/Util.js'
import FontAwe  from './FontAwe.js'

class Vis

  Vis.debug = false
  
  # --- Color ---

  # @rgb is the conversion work horse that is used by the other functions
  # Always returns an rgb object like { r:255, b:255, b:255 } scaled to from 0 to 255
  #   For type equal to 'rgb' their is conditional scaling
  #      scale = 255  implies multiply by 255  for nomalized range 0.0 to   1.0
  #      scale = 2.55 implies multiply by 2,55 for percent   range 0%  to 100%
  #      scale = 1    implies standard  0 to 255 range
  #   For type equal to 'ysv' the ranges are always
  #      hue 360, saturation 100, v for intensity 100
  #      'ysv' uses rygb color system with red=0deg, yellow=90deg green=180deg and blue=270deg
  #      'ysv' is the default type because it provides the best color balance 
  #   For type equal to 'hsv' the ranges are always
  #      hue 360, saturation 100, v for intensity 100
  #      'hsv' has red=0deg, green=120deg and blue=240deg
  #   For type equal to 'hsl' the ranges are always
  #      hue 360, saturation 100, lightness 100
  #      'hsl' has red=0deg, green=120deg and blue=240deg

  @rgb:( arg, type="ysv", scale=1 ) ->
    rgb = { r:255, g:255, b:255 } # default is white
    if Util.isArray(arg)
      rgb = switch type
        when 'rgb' then { r:arg[0]*scale, g:arg[1]*scale, b:arg[2]*scale }
        when 'ysv' then Vis.rgbHsv( arg[0], arg[1], arg[2], 'ysv' )
        when 'hsv' then Vis.rgbHsv( arg[0], arg[1], arg[2], 'hsv' )
        when 'hsl' then Vis.rgbHsl( arg[0], arg[1], arg[2]        )
    else if Util.isObj(arg)
      rgb = switch type
        when 'rgb' then { r:arg.r*scale, g:arg.g*scale, b:arg.b*scale }
        when 'ysv' then Vis.rgbHsv( arg.h, arg.s, arg.v, 'ysv' )
        when 'hsv' then Vis.rgbHsv( arg.h, arg.s, arg.v, 'hsv' )
        when 'hsl' then Vis.rgbHsl( arg.h, arg.s, arg.l )
    else if Util.isNum(arg)
      rgb = { r:(arg & 0xFF0000) >> 16,   g:(arg & 0x00FF00) >> 8,  b:arg & 0x0000FF }
    Vis.round(rgb)

  # Returns an rgb array with an alpha 1
  @rgba:( arg, type="ysv", scale=1 ) ->
    rgb = Vis.rgb( arg, type, scale )
    [ rgb.r, rgb.g, rgb.b,1 ]

  # Returns a number that is interpreted as hex like 0xFFFFFF
  #   Recommended for most libraries like Three.js
  @hex:( arg, type="rgb", scale=1 ) ->
    rgb = Vis.rgb( arg, type, scale )
    rgb.r * 65536 + rgb.g * 256 + rgb.b # 65536 is 16 to the fourth power and 256 is 16 squared

  # Returns a number in hex format like '0xFFFFFF'. Go for debugging
  @str:( arg, type="ysv", scale=1 ) ->
    rgb  = Vis.rgb( arg, type, scale )
    str  = '0x'
    str += if rgb.r is 0 then '00' else Vis.strHex(rgb.r).toUpperCase()
    str += if rgb.g is 0 then '00' else Vis.strHex(rgb.g).toUpperCase()
    str += if rgb.b is 0 then '00' else Vis.strHex(rgb.b).toUpperCase()
    str

  # Key algorithm from HCI for converting RGB to HCS  h 360 c 100 s 100 a special color system
  @hsv:( arg, type="ysv", scale=1 ) =>
    rgb  = Vis.rgb( arg, type, scale )
    R = rgb.r
    G = rgb.g
    B = rgb.b
    sum = R + G + B
    r = R/sum; g = G/sum; b = B/sum
    s = sum / 3
    c = if R is G and G is B then 0 else 1 - 3 * Math.min(r,g,b) # Center Grayscale
    a = Vis.deg( Math.acos( ( r - 0.5*(g+b) ) / Math.sqrt((r-g)*(r-g)+(r-b)*(g-b)) ) )
    h = if b <= g then a else 360 - a
    h = 0 if c is 0
    H = if type is 'ysc' then Vis.ysvHue(h) else h
    [ H, c*100, s/2.55 ]

# returns a css string in rgb format
  @css:( arg, type="ysv", scale=1  ) ->
    rgb  = Vis.rgb( arg, type, scale )
    """rgb(#{rgb.r},#{rgb.g},#{rgb.b})"""

  # Need to chech output format
  @sphere:( hue, phi, rad ) ->
    Vis.rgba( [Vis.rot(hue,90), 100*Vis.sin(phi), 100*rad ] )
    
  @strHex:( num ) ->
    `num.toString(16)` # Uses ` ` to fake out CoffeeScript code inspector

  # Rounds and scales rgb value to ints between 0 to 255
  @round:( rgb, scale=1 ) ->
    { r:Math.round(rgb.r*scale), g:Math.round(rgb.g*scale), b:Math.round(rgb.b*scale) }

  # Converts hues in 'ysv' RYGB range to 'hsv' and 'hsl' rgb hue
  #   'ysv'       has red=0deg, yellow=90deg green=180deg and blue=270deg
  #   'hsv' 'hsl' has red=0deg,              green=120deg and blue=240deg
  @hsvHue:( ysvHue ) ->
    hsvHue = 0
    if        0 <= ysvHue and ysvHue <  90 then hsvHue =        ysvHue      *  60 / 90
    else if  90 <= ysvHue and ysvHue < 180 then hsvHue =  60 + (ysvHue- 90) *  60 / 90
    else if 180 <= ysvHue and ysvHue < 270 then hsvHue = 120 + (ysvHue-180) * 120 / 90
    else if 270 <= ysvHue and ysvHue < 360 then hsvHue = 240 + (ysvHue-270) * 120 / 90
    hsvHue

  # Converts hues in 'hsv' or 'hsl' RGB hue to 'tsv' RYGB range
  #   'hsv' 'hsl' has red=0deg,              green=120deg and blue=240deg
  #   'ysv'       has red=0deg, yellow=90deg green=180deg and blue=270deg
  @ysvHue:( hueHsv ) ->
    ysvHue = 0
    if        0 <= hueHsv and hueHsv < 120 then ysvHue =        hueHsv      * 180 / 120
    else if 120 <= hueHsv and hueHsv < 240 then ysvHue = 180 + (hueHsv-120) * 180 / 120
    else if 240 <= hueHsv and hueHsv < 360 then ysvHue = 270 + (hueHsv-240) * 180 / 120
    ysvHue

# --- Degrees and Radians ---
  #  The svg functions deal with the svg convention where the y 90 degree axis points down

  @rad:( deg ) -> deg * Math.PI / 180
  @deg:( rad ) -> rad * 180 / Math.PI
  @sin:( deg ) -> Math.sin(Vis.rad(deg))
  @cos:( deg ) -> Math.cos(Vis.rad(deg))

  @rot:( deg, ang ) ->
    a = deg+ang
    a = a + 360 if a < 0
    a

  @svgDeg:( deg ) -> 360-deg
  @svgRad:( rad ) -> 2*Math.PI-rad

  @radSvg:( deg ) -> Vis.rad(360-deg)
  @degSvg:( rad ) -> Vis.deg(2*Math.PI-rad)
  @sinSvg:( deg ) -> Math.sin(Vis.radSvg(deg))
  @cosSvg:( deg ) -> Math.cos(Vis.radSvg(deg))

  # --- Math Utilities ---

  @floor:( x, dx )          ->  dr = Math.round(dx); Math.floor( x / dr ) * dr
  @ceil:(  x, dx )          ->  dr = Math.round(dx); Math.ceil(  x / dr ) * dr
  @within:( beg, deg, end ) -> beg   <= deg and deg <= end # Closed interval with <=
  @isZero:( v )             -> -0.01 <  v   and v   <  0.01

  # --- Css Transforms ---  

  @translate:( x0, y0 ) ->
    Util.checkTypes('number',{x0:x0,y0:y0})
    " translate( #{x0}, #{y0} )"

  @scale:( sx, sy )  ->
    Util.checkTypes('number',{sx:sx,sy:sy})
    " s( #{sx}, #{sy} )"

  @rotate:( a, x, y ) ->
    Util.checkTypes('number',{a:a,x:x,y:y})
    " rotate(#{a} #{x} #{y} )"

  @translateScale:( x0, y0, sx, sy ) ->
    Util.checkTypes('number',{x0:x0,y0:y0})
    Util.checkTypes('number',{sx:sx,sy:sy})
    " translate( #{x0}, #{y0} ) s( #{sx}, #{sy} )"

  # --- Color Utilities ---

  # toRygb=true is 'ysc' while 
  @rgbHsv:( H, C, V, hueSys='ysv' ) ->
    h = if hueSys is 'ysv' then Vis.hsvHue(H) else H
    d = C * 0.01
    c = Vis.sigmoidal( d, 2, 0.25 )
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
    console.log( 'Vis.rgbHsv()', { rgb:rgb, hcv:[H,C,V], sys:hueSys } ) if Vis.debug
    Vis.round( rgb, 255 * V / 100 )

  @rgbHsl:( H, s, l, hueSys='ysc' ) ->
    h = if hueSys is 'ysv' then Vis.hsvHue(H) else H
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
    Vis.round( rgb, 255 )

  @sigmoidal:( x, k, x0=0.5, L=1 ) ->
    L / ( 1 + Math.exp(-k*(x-x0)) )

  @interpolateRgb:( rgb1, r1, rgb2, r2 ) ->
    { r:rgb1.r * r1 + rgb2.r * r2, g:rgb1.g * r1 + rgb2.g * r2, b:rgb1.b * r1 + rgb2.b * r2 }

  # Font Awesome Unicode lookup
  @unicode:( icon ) ->
    uc    = FontAwe.icons[icon]
    if not uc?
      console.error( 'Vis.unicode() missing icon in Vis.FontAwesomeUnicodes for', icon )
      uc = "\uf111" # Circle
    uc

export default Vis
