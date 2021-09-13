
fetch   = require( 'node-fetch' )
cheerio = require('cheerio')
Zombie  = require('zombie') # class
Emitter = require('events');
host    = 'http://localhost:3000/' # 'https://muse-ad352.web.app/'  #

paths = [
  "Prin?page=Icons",
  "Prin?page=Topics",
  "Prin/Embrace?page=Topics",
  "Prin/Embrace?page=Graphs",
  "Prin/Embrace?page=Texts",
  "Info?page=Icons&innovate=Purpose",
  "Info?page=Topics&innovate=Purpose",
  "Info?page=Graphs&innovate=Purpose",
  "Info?page=Texts&innovate=Purpose",
  "Info?page=Texts&innovate=Software",
  "Info?page=Texts&innovate=DataScience",
  "Know?page=Texts&innovate=Product",
  "Know?page=Graphs&innovate=Product",
  "Know?page=Topics&innovate=Product",
  "Know?page=Icons&innovate=Product",
  "Know?page=Icons&innovate=Science",
  "Know?page=Icons&innovate=Math",
  "Wise?page=Icons&innovate=Conceive",
  "Wise?page=Topics&innovate=Conceive",
  "Wise?page=Graphs&innovate=Conceive",
  "Wise?page=Texts&innovate=Conceive",
  "Defs" ]

doCrawl = (paths) ->
  for path in paths
    url   = host + path
    resp  = await fetch( url )
    text  = await resp.text()
    $     = cheerio.load( text )
    console.log( 'Crawl', { url:url, muse:$('#muse').html() } )
  return

# doCrawl( paths )

sleep = (ms) ->
  new Promise( (resolve) => setTimeout( resolve, ms ) )

doVisit = ( zombie, paths, i ) ->
  zombie.visit( host+paths[i], () ->
    await sleep(1000)
    console.log( 'Path', paths[i] )
    console.log( zombie.location.href )
    console.log( zombie.html('#muse') ) )

doZombie = (paths) ->
  #ombie.localhost( hostz, 3000 )
  zombie  = new Zombie()
  emitter = new Emitter()
  emitter.setMaxListeners(paths.length)
  # for i in [0...paths.length]
  doVisit( zombie, paths, 0 )
  return

doZombie( paths )

