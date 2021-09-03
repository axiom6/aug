
import {vis}     from '../../../lib/pub/draw/Vis.js'
import MilePosts from '../../../data/exit/Mileposts.json'

class TripD3

  constructor:( @svgMgr ) ->
    @d3    = @svgMgr.d3
    @svg   = @svgMgr.svg
    @g     = @svgMgr.g
    @segs  = @createSeqs()
    @debug = true

  createSeqs:() ->
    segs = []
    i    = 1
    for own key, obj of Mileposts
      segs[0] = obj.Beg if i is 1
      segs[i] = obj.End
      i++
    seqs

  draw:() ->
    d3.select('#'+@gId).selectAll("*").remove()
    @mileBeg  = @segs[0]
    @mileEnd  = @segs[@segs.length-1]
    @distance = Math.abs( @mileBeg - @mileEnd  )
    console.log( 'TripD3.draw() 1', { mileBeg:@mileBeg, mileEnd:@mileEnd, distance:@distance } ) if @debug
    thick    = 1
    x        = 0
    y        = @barTop()
    w        = @svgWidth()
    h        = @barHeight()
    @createTravelTime( trip, @g, x, y, w, h )
    @rect( trip, @g, trip.segments[0], @role+'Border', x, y, w, h, 'transparent', 'white', thick*4, '' )
    for i in [0...@segs.lenght-1]
      beg   = w * Math.abs( @segs[i]    - @mileBeg ) / @distance
      end   = w * Math.abs( @segs[i+1]  - @mileBeg ) / @distance
      fill  = @fillCondition( seg.segId, trip.conditions )
      console.log( 'TripD3.draw() 2', { segId:seg.segId, beg:beg, end:end,  w:Math.abs(end-beg) } ) if @debug
      @rect( trip, @g, seg, seg.segId, beg, y, Math.abs(end-beg), h, fill, 'black', thick, '' )
    @created  = true
    return

export default TripD3