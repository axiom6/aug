
import _           from 'underscore'
import fs          from 'fs-extra'
import path        from 'path'
import marked      from 'marked'
import commander   from 'commander'
import highlightjs from 'highlight.js'
import languages   from '../../doc/public/json/languages.json'


class Docs

  constructor:() ->

  createDoc:( options = {}, callback ) ->
    config = configure options

    fs.mkdirs config.output, () ->

      callback or= (error) -> throw error if error
      copyAsset  = (file, callback) ->
        return callback() unless fs.existsSync file
        fs.copy file, path.join(config.output, path.basename(file)), callback
      complete   = ->
        copyAsset config.css, (error) ->
          return callback error if error
          return copyAsset config.public, callback if fs.existsSync config.public
          callback()

      files = config.sources.slice()

      nextFile = () ->
        source = files.shift()
        fs.readFile source, (error, buffer) ->
          return callback error if error

          code = buffer.toString()
          sections = parse source, code, config
          format source, sections, config
          write source, sections, config
          if files.length then nextFile() else complete()

      nextFile()

  ###
  Given a string of source code, **parse** out each block of prose and the code that
  follows it — by detecting which is which, line by line — and then create an
  individual **section** for it. Each section is an object with `docsText` and
  `codeText` properties, and eventually `docsHtml` and `codeHtml` as well.
  ###
  parse:( source, code, config = {} ) ->
    lines    = code.split '\n'
    sections = []
    lang     = getLanguage( source, config )
    hasCode  = ''
    docsText = ''
    codeText = ''

    save = ->
      sections.push {docsText, codeText}
      hasCode = docsText = codeText = ''
    ###
    Our quick-and-dirty implementation of the literate programming style. Simply
    invert the prose and code relationship on a per-line basis, and then continue as
    normal below.
    ###
    if lang.literate
      isText    = yes
      maybeCode = yes
      for line, i in lines
        lines[i] = if maybeCode and match = /^([ ]{4}|[ ]{0,3}\t)/.exec line
          isText = no
          line[match[0].length..]
        else if maybeCode = /^\s*$/.test line
          if isText then lang.symbol else ''
        else
          isText = yes
          lang.symbol + ' ' + line

    for line in lines
      if line.match(lang.commentMatcher) and not line.match(lang.commentFilter)
        save() if hasCode
        docsText += (line = line.replace(lang.commentMatcher, '')) + '\n'
        save() if /^(---+|===+)$/.test line
      else
        hasCode = yes
        codeText += line + '\n'
    save()

  ###
  To **format** and highlight the now-parsed sections of code, we use **Highlight.js**
  over stdio, and run the text of their corresponding comments through
  **Markdown**, using [Marked](https://github.com/chjj/marked).
  Pass any user defined options to Marked if specified via command line option
  ###
  format:( source, sections, config ) ->
    language      = @getLanguage( source, config )
    markedOptions = { smartypants: true }
    markedOptions = config.marked if config.marked
    marked.setOptions( markedOptions )
    ###
    Tell Marked how to highlight code blocks within comments, treating that code
    as either the language specified in the code block or the language of the file
    if not specified.
    ###
    marked.setOptions {
      highlight: (code, lang) ->
        lang or= language.name
        if highlightjs.getLanguage(lang)
           highlightjs.highlight(lang, code).value
        else
           console.warn "docco: couldn't highlight code block with unknown language '#{lang}' in #{source}"
           code
    }

    for section, i in sections
      code = highlightjs.highlight(language.name, section.codeText).value
      code = code.replace(/\s+$/, '')
      section.codeHtml = "<div class='highlight'><pre>#{code}</pre></div>"
      section.docsHtml = marked(section.docsText)
  ###
  Once all of the code has finished highlighting, we can **write** the resulting
  documentation file by passing the completed HTML sections into the template,
  and rendering it to the specified output path.
  ###
  write:( source, sections, config ) ->

    destination = (file) ->
      path.join(config.output, path.dirname(file), path.basename(file, path.extname(file)) + '.html')

    relative = (file) ->
      to   = path.dirname(path.resolve(file))
      from = path.dirname(path.resolve(destination(source)))
      path.join(path.relative(from, to), path.basename(file))
    ###
    The **title** of the file is either the first heading in the prose, or the
    name of the source file.
    ###
    firstSection = _.find sections, (section) ->
      section.docsText.length > 0
    first    = marked.lexer(firstSection.docsText)[0] if firstSection
    hasTitle = first and first.type is 'heading' and first.depth is 1
    title    = if hasTitle then first.text else path.basename source
    css      = relative path.join(config.output, path.basename(config.css))

    html = config.template { sources: config.sources, css,
      title, hasTitle, sections, path, destination, relative }

    console.log "docco: #{source} -> #{destination source}"
    fs.outputFileSync destination(source), html

###
Configuration
-------------

Default configuration **options**. All of these may be extended by
user-specified options.
###

###
**Configure** this particular run of Docco. We might use a passed-in external
template, or one of the built-in **layouts**. We only attempt to process
source files for languages for which we have definitions.
###
configure = (options) ->
  config = _.extend {}, @defaults(), _.pick(options.opts(), _.keys(@defaults())...)

  config.languages = buildMatchers config.languages
  ###
  The user is able to override the layout file used with the `--template` parameter.
  In this case, it is also neccessary to explicitly specify a stylesheet file.
  These custom templates are compiled exactly like the predefined ones, but the `public` folder
  is only copied for the latter.
  ###
  if options.template
    unless options.css
      console.warn "docco: no stylesheet file specified"
    config.layout = null
  else
    dir = config.layout = path.join __dirname, 'resources', config.layout
    config.public       = path.join dir, 'public' if fs.existsSync path.join dir, 'public'
    config.template     = path.join dir, 'docco.jst'
    config.css          = options.css or path.join dir, 'docco.css'
  config.template = _.template fs.readFileSync(config.template).toString()

  if options.marked
    config.marked = JSON.parse fs.readFileSync(options.marked)

  config.sources = options.args.filter((source) ->
    lang = @getLanguage( source, config )
    console.warn "docco: skipped unknown type (#{path.basename source})" unless lang
    lang
  ).sort()

  config

  ###
  Build out the appropriate matchers and delimiters for each language.
  ###
  buildMatchers:() ->
    for ext, l of languages
      l.commentMatcher = ///^\s*#{l.symbol}\s?///
      l.commentFilter = /(^#![/]|^\s*#\{)/
      languages

  ###
  A function to get the current language we're documenting, based on the
  file extension. Detect and tag "literate" `.ext.md` variants.
  ###
  getLanguage:( source, config ) ->
    ext  = config.extension or path.extname(source) or path.basename(source)
    lang = config.languages?[ext] or languages[ext]
    if lang and lang.name is 'markdown'
      codeExt = path.extname(path.basename(source, ext))
      codeLang = config.languages?[codeExt] or languages[codeExt]
      if codeExt and codeLang
        lang = _.extend {}, codeLang, {literate: yes}
    lang

  defaults:() ->
    layout:    'parallel'
    output:    'docs'
    template:   null
    css:        null
    extension:  null
    marked:     null
    languages:  @buildMatchers()

  ###
  Command Line Interface
  ----------------------

  Finally, let's define the interface to run Docco from the command line.
  Parse options using [Commander](https://github.com/visionmedia/commander.js).
  ###
  run:( args = process.argv ) ->
    version = "1.0.0"
    c = @defaults()
    commander.version(version)
      .usage('[options] files')
      .option('-L, --languages [file]', 'use a custom languages.json', _.compose JSON.parse, fs.readFileSync)
      .option('-l, --layout [name]',    'choose a layout (parallel, linear or classic)', c.layout)
      .option('-o, --output [path]',    'output to a given folder', c.output)
      .option('-c, --css [file]',       'use a custom css file', c.css)
      .option('-t, --template [file]',  'use a custom .jst template', c.template)
      .option('-e, --extension [ext]',  'assume a file extension for all inputs', c.extension)
      .option('-m, --marked [file]',    'use custom marked options', c.marked)
      .parse(args)
      .name = "docco"
    if commander.args.length
      @createDoc( commander )
    else
      console.log commander.helpInformation()

# Docco = module.exports = {run, document, parse, format, version}

docs = new Docs()
export { docs }
