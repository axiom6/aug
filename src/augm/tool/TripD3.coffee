
import {vis}     from '../../../lib/pub/draw/Vis.js'
import MilePosts from '../../../data/exit/Mileposts.json'

class TripD3

  constructor:( @svgMgr ) ->
    @d3    = @svgMgr.d3
    @svg   = @svgMgr.svg
    @g     = @svgMgr.g
    @debug = true

  draw:() ->
    @d3.select('#'+@gId).selectAll("*").remove()
    mileBeg  = MilePosts[0].mile
    mileEnd  = MilePosts[MilePosts.length-1].mile
    distance = Math.abs( mileBeg - mileEnd  )
    console.log( 'TripD3.draw() 1', { mileBeg:mileBeg, mileEnd:mileEnd, distance:distance } ) if @debug
    thick    = 1
    x        = 0
    y        = @barTop()
    w        = @svgWidth()
    h        = @barHeight()
    @createTravelTime( trip, @g, x, y, w, h )
    @rect( trip, @g, trip.segments[0], @role+'Border', x, y, w, h, 'transparent', 'white', thick*4, '' )
    beg = w * Math.abs( MilePosts[0].mile - mileBeg ) / distance
    end = 0
    for i in [1...MilePosts.lenght]
      end   = w * Math.abs( MilePosts[i].milw - mileBeg ) / distance
      fill  = @fillCondition( seg.segId, trip.conditions )
      console.log( 'TripD3.draw() 2', { segId:seg.segId, beg:beg, end:end,  w:Math.abs(end-beg) } ) if @debug
      @rect( trip, @g, seg, seg.segId, beg, y, Math.abs(end-beg), h, fill, 'black', thick, '' )
      beg = end
    @created  = true
    return

export default TripD3