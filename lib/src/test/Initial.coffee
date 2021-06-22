
import { tester } from './Tester.js'

import Stream from '../base/util/Stream.js'

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
    subjects        = ["Nav","Test"]
    streamLog       = { subscribe:false, publish:false, subjects:subjects }
    Initial.stream  = new Stream( subjects, streamLog )

    # Tester does the { test, unit, log, tester } exports
    tester.setOptions( { testing:true, logToConsoie:true, archive:true, verbose:false, debug:false } )
    tester.injectStream( Initial.stream )
    paths = ["/lib/pub/test/Tester-unit.js","/lib/pub/base/draw/Vis-unit.js"]
    tester.runUnitTestModulesFromPaths( paths )
    ###
    if tester.inViteJS                       # Can't pass glob pattern "/pub/xx/x-unit.js" i.e.   into
       tester.runUnitTestModulesWithViteJS() #  the ViteJS import.meta.glob()
    else
       tester.runUnitTestModulesFromPaths( ["/lib/pub/base/test/Tester-unit.js", "/lib/pub/base/draw/Vis-unit.js"] )
    ###
    return

export default Initial
