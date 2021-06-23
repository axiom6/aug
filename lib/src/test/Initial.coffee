
import { tester } from './Tester.js'

import Stream from '../base/util/Stream.js'

# git remote set-url origin 'https://axiom-muse:Axiom66#@github.com/axiom6-muse/viz.git'

class Initial

  Initial.appName = 'Initial'
  Initial.debug   = false

  Initial.start = (href) ->
    console.log( "Initial.start()", href )
    Initial.href = href
    Initial.init()
    return

  Initial.init =   () ->
    subjects        = ["Nav","Test"]
    streamLog       = { subscribe:false, publish:false, subjects:subjects }
    Initial.stream  = new Stream( subjects, streamLog )

    # Tester exports { test, unit, tester }
    tester.setOptions( { testing:true, archive:true, verbose:false, debug:false } )
    tester.injectStream( Initial.stream )
    inViteJS = tester.isDef(`import.meta.env`)
    if inViteJS
      modulesLib = `import.meta.glob("/lib/**/*-unit.js")`
      Initial.runUnitTestsViteJS( modulesLib )
      modulesPub = `import.meta.glob("/pub/**/*-unit.js")`
      Initial.runUnitTestsViteJS( modulesPub )
    else
      paths = ["/lib/pub/test/Tester-unit.js","/lib/pub/base/draw/Vis-unit.js"]
      tester.runUnitTests( paths )
    return

  # This is vite.js dependent with import.meta.glob() and its dynamic await importer
  # Can't pass glob patterns like "/pub/xx/x-unit.js"
  Initial.runUnitTestsViteJS = ( modules ) ->
    globPtn = "/lib/**/*-unit.js"
    console.log( "Tester.runUnitTestsViteJS()", modules, globPtn ) if @debug
    count = 0
    total = Object.keys(modules).length
    for own path, importer of modules
      modules[path]().then( (importer) =>
        console.log( path,   importer ) if @debug
        await importer
        count++
        tester.log( tester.summary() ) if count is total
        return )

export default Initial
