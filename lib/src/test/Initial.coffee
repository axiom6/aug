
import { tester } from './Tester.js'

import Stream from '../base/util/Stream.js'
import Mix    from '../base/nav/Mix.js'
import Nav    from '../base/nav/Nav.js'

# git remote set-url origin 'https://axiom-muse:Axiom66#@github.com/axiom6-muse/viz.git'

class Initial

  Initial.appName = 'Initial'
  Initial.debug   = true

  Initial.start = (href) ->
    console.log( "Initial.start()", href )
    Initial.href = href
    Initial.init()
    return

  Initial.init =   () ->
    subjects              = ["Nav","Test"]
    streamLog             = { subscribe:false, publish:false, subjects:subjects }
    Initial.stream     = new Stream( subjects, streamLog )
    Initial.mix        = new Mix( Initial )
    Initial.nav        = new Nav( Initial.stream, Initial.mix )

    # Tester does the { test, unit, log, tester } exports
    tester.setOptions( { testing:true, logToConsoie:true, archive:true, verbose:false, debug:false } )
    tester.injectStream( Initial.stream )
    tester.injectNav(    Initial.nav    )
    if tester.inViteJS                       # Can't pass glob pattern "/pub/**/*-unit.js" i.e.   into
       tester.runUnitTestModulesWithViteJS() #  the ViteJS import.meta.glob()
    else
       tester.runUnitTestModulesFromPaths( ["/pub/base/test/Tester-unit.js", "/pub/base/draw/Vis-unit.js"] )
    return

export default Initial
