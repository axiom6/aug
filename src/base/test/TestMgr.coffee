
import Local  from '../store/Local.js'

class TestMgr

  constructor:( @nav ) ->
    @dbName = 'Test'
    @local  = new Local( @nav.stream, @dbName )

  doReplay:() =>                      # CoffeeScript implicitly makes doReplay()
    for own key,obj of @nav.replays   #  async when in encounters await
      await @nav.sleep( 1000 )
      obj.source = 'Replay'
      @nav.pub( obj, true )
    return

  saveReplay:( id ) ->
    @local.add( @dbName, id, @nav.replays )
    return

export default TestMgr