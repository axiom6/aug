
import { Color } from 'three'
import {vis} from '../../../lib/pub/draw/Vis.js'

class Cartesian

  constructor:( @main ) ->
    @klass  = @constructor.name
    @opts   = @main.opts
    @aspect = @main.aspectRatio
    @xmin   = if @opts.xmin?   then @opts.xmin?   else   0
    @xmax   = if @opts.xmax?   then @opts.xmax?   else 100
    @ymin   = if @opts.ymin?   then @opts.ymin?   else   0
    @ymax   = if @opts.ymax?   then @opts.ymax?   else 100
    @zmin   = if @opts.zmin?   then @opts.zmin?   else   0
    @zmax   = if @opts.zmax?   then @opts.zmax?   else 100
    @dist   = if @opts.dist?   then @opts.dist?   else 100
    @xd     = @xmax-@xmin
    @yd     = @ymax-@ymin
    @zd     = @zmax-@zmin
    @xc     = @xd * 0.5
    @yc     = @yd * 0.5
    @zc     = @zd * 0.5
    @xtick1 = if @opts.xtick1? then @opts.xtick1? else @xd * 0.10
    @xtick2 = if @opts.xtick2? then @opts.xtick2? else @xd * 0.01
    @ytick1 = if @opts.ytick1? then @opts.ytick1? else @yd * 0.10
    @ytick2 = if @opts.ytick2? then @opts.ytick2? else @yd * 0.01
    @ztick1 = if @opts.ztick1? then @opts.ztick1? else @zd * 0.10
    @ztick2 = if @opts.ztick2? then @opts.ztick2? else @zd * 0.01
    @main.log( @klass+'()', @ )

  hex:( orient ) ->
    switch  orient
      when 'XY' then new Color( 0x880F0F )
      when 'XZ' then new Color( 0x0F880F )
      when 'YZ' then new Color( 0x0F0F88 )
      else           new Color( 0x888888 )

  hex2:( orient ) ->
    switch  orient
      when 'XY' then vis.hex( [ 60,30,40] )
      when 'XZ' then vis.hex( [150,90,90] )
      when 'YZ' then vis.hex( [270,90,90] )
      else           vis.hex( [330,90,90] )


  rad:( deg ) ->
    vis.rad(deg)

export default Cartesian

# str = "rgb(#{Math.round(rgb[0]*255)}, #{Math.round(rgb[1]*255)}, #{Math.round(rgb[2]*255)})"