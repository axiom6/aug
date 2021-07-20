
import Docs       from "./Docs.js"
import commander  from 'commander'

class Main

  ###
  Command Line Interface
  ----------------------
  Finally, let's define the interface to run Docco from the command line.
  Parse options using [Commander](https://github.com/visionmedia/commander.js).
  ###
  Main.run = ( args = process.argv ) ->
    version = "1.0.0"
    docs    = new Docs()
    commander.version(version)
      .usage('[options] files')
      .option('-L, --languages [file]', 'use a custom languages.json', _.compose JSON.parse, fs.readFileSync)
      .option('-l, --layout [name]',    'choose a layout (parallel, linear or classic)', docs.layout)
      .option('-o, --output [path]',    'output to a given folder', docs.output)
      .option('-c, --css [file]',       'use a custom css file', docs.css)
      .option('-t, --template [file]',  'use a custom .jst template', docs.template)
      .option('-e, --extension [ext]',  'assume a file extension for all inputs', docs.extension)
      .option('-m, --marked [file]',    'use custom marked options', docs.marked)
      .parse(args)
      .name = "docs"
    if commander.args.length
      docs.createDoc()
    else
      console.log commander.helpInformation()
    Main.docs = docs

  ###
  **Configure** this particular run of Docs. We might use a passed-in external
  template, or one of the built-in **layouts**. We only attempt to process
  source files for languages for which we have definitions.
  ###
  Main.configure = ( options ) ->

    docs = Main.docs

    config = _.extend {}, @defaults(), _.pick(options.opts(), _.keys(@defaults())...)

    docs.languages = @buildMatchers( docs.languages )
    ###
    The user is able to override the layout file used with the `--template` parameter.
    In this case, it is also neccessary to explicitly specify a stylesheet file.
    These custom templates are compiled exactly like the predefined ones, but the `public` folder
    is only copied for the latter.
    ###
    if options.template
      unless options.css
        console.warn "docco: no stylesheet file specified"
      docs.layout = null
    else
      dir = @layout = path.join( __dirname, 'resources', @layout )
      docs.public   = path.join( dir, 'public' if fs.existsSync path.join dir, 'public' )
      docs.template = path.join(  dir, 'docco.jst' )
      docs.css      = options.css or path.join( dir, 'docco.css' )
    docs.template = _.template( fs.readFileSync(docs.template).toString() )

    if options.markedOpts
      docs.markedOpts = JSON.parse( fs.readFileSync(options.markedOpts) )

    docs.sources = options.args.filter((source) ->
      lang = @getLanguage( source )
      console.warn "docco: skipped unknown type (#{path.basename source})" unless lang
      lang
    ).sort()
    return