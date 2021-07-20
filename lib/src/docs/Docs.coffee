
import _           from 'underscore'
import fs          from 'fs-extra'
import path        from 'path'
import marked      from 'marked'
import highlightjs from 'highlight.js'
import languages   from '../../doc/public/json/languages.json'


class Docs

  constructor:() ->
    @layout    = 'parallel'
    @output    = 'docs'
    @template   = null
    @css        = null
    @extension  = null
    @markedOpts = null
    @languages @buildMatchers()

  createDoc:(   options = {}, callback ) ->
    @configure( options )

    fs.mkdirs @output, () ->

      callback or= (error) -> throw error if error
      copyAsset  = (file, callback) ->
        return callback() unless fs.existsSync file
        fs.copy file, path.join(@output, path.basename(file)), callback
      complete   = ->
        copyAsset @css, (error) ->
          return callback error if error
          return copyAsset @public, callback if fs.existsSync @public
          callback()

      files = @sources.slice()

      nextFile = () ->
        source = files.shift()
        fs.readFile source, (error, buffer) ->
          return callback error if error

          code     = buffer.toString()
          sections = parse( source, code )
          format( source, sections )
          write(  source, sections )
          if files.length then nextFile() else complete()

      nextFile()

  ###
  Given a string of source code, **parse** out each block of prose and the code that
  follows it — by detecting which is which, line by line — and then create an
  individual **section** for it. Each section is an object with `docsText` and
  `codeText` properties, and eventually `docsHtml` and `codeHtml` as well.
  ###
  parse:( source, code ) ->
    lines    = code.split '\n'
    sections = []
    lang     = getLanguage( source )
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
  format:( source, sections ) ->
    language   = @getLanguage( source )
    markedOpts = { smartypants: true }
    markedOpts =  @markedOpts if @markedOpts
    marked.setOptions( markedOpts )
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
  write:( source, sections ) ->

    destination = (file) ->
      path.join(@output, path.dirname(file), path.basename(file, path.extname(file)) + '.html')

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
    css      = relative path.join(@output, path.basename(@css))

    html = @template { sources: @sources, css,
      title, hasTitle, sections, path, destination, relative }

    console.log "docco: #{source} -> #{destination source}"
    fs.outputFileSync destination(source), html




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
  getLanguage:( source ) ->
    ext  = @extension or path.extname(source) or path.basename(source)
    lang = @languages?[ext] or @languages[ext]
    if lang and lang.name is 'markdown'
      codeExt  = path.extname(path.basename(source, ext))
      codeLang = @languages?[codeExt] or @languages[codeExt]
      if codeExt and codeLang
        lang = _.extend {}, codeLang, {literate: yes}
    lang

export default Docs
