
import Local  from '../store/Local.js'

class TestMgr

  constructor:( @nav ) ->
    @local  = new Local( @nav.stream, 'Test' )

  saveReplay:(  name, id ) ->
    @local.add( name, id, @nav.replays )
    return

export default TestMgr