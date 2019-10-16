
import Util   from '../util/Util.js'
import Data   from '../util/Data.js'

class Build

  # ---- Class Methods for Practices ----

  @create:( data, type ) ->
    switch type
      when 'Pack' then Build.createPacks( data )
      when 'Prac' then Build.createPracs( data )
      else                                data

  @createPacks:( data ) ->
    for key, pack of data when Util.isChild(key)
      pack['name'] = key if not pack['name']?
      Build.createPracs( pack )
    data

  @createPracs:( data ) ->
    for pkey, pract of data when Util.isChild(pkey)
      pract['name']        = pkey if not pract['name']?
      for skey, study of pract  when Util.isChild(skey)
        study['name']      = skey if not study['name']?
        for tkey, topic of study  when Util.isChild(tkey)
          topic['name']    = tkey if not topic['name']?
          for ikey, item of topic when Util.isChild(ikey)
            item['name']   = ikey if not item['name']?
            for bkey, base of item when Util.isChild(bkey)
              base['name'] = bkey if not base['name']?
    data

  @colPractices:( batch ) ->
    prin = batch.Prin.data['Prin']
    for plane in ['Info', 'Know','Wise']
      batch[plane].data['Prin'] = prin
    return

  @rowPractices:( batch ) ->
    rows = batch.Rows.data['Rows']
    for plane in ['Info','Know','Wise']
      batch[plane].data['Rows'] = rows
    return

  @copyAtt:( src, des ) ->
    for own key, obj of src when not Util.isChild(key)
      des[key] = obj
    des

  # for dir in [ 'west', 'north', 'east', 'south'   ]
  # Call after all practices and studies have been read in
  # Not used because we store studies with practices in /pract
  @expandStudys:( groups, studies ) ->
    for     gkey, group of groups when Util.isChild(gkey)
      for   pkey, pract of group  when Util.isChild(pkey)
        for skey, study of pract  when Util.isChild(skey)
          pract[skey] = studies[skey] if studies[skey]?
    return

  # Call after all practices and topics have been read in
  @expandTopics:( groups, topics, log=false ) ->
    for       gkey, group of groups when Util.isChild(gkey)
      console.log(  gkey ) if log
      for     pkey, pract of group  when Util.isChild(pkey)
        console.log(  "  ", pkey ) if log
        for   skey, study of pract  when Util.isChild(skey)
          console.log(  "    ", skey ) if log
          for tkey, topic of study  when Util.isChild(tkey)
            if topics[tkey]?
              console.log( "      ", tkey, "match" ) if log
              topics[tkey]['name'] = tkey if not topics[tkey]['name']?
              study[tkey] = topics[tkey]
            else
              console.log(  "      ", tkey ) if log
    return

  # Build instance

  constructor:( @batch, @komps=null ) ->
    #@Spec   = @batch.Muse.data
    @None    = { name:"None" }
    Util.noop( @toGroups, @setAdjacents, Build.copyAtt  )

  getSpecs:(  plane ) ->
    if @batch[plane]?
       @batch[plane].data
    else
      console.error( "Build.getSpecs() #{plane}.json has not been input" )
      null

  toGroups:( groups ) ->
    for key, group of groups
      group['key']     = key
      group['name']    = if group.name? then group.name else key
      group['border']  = if group['border']? then group['border'] else '0'
    groups

  toStudies:( prac ) ->
    studies = {}
    for skey, study of prac when Util.isChild(skey)
      studies[skey] = study
    @toOrder( studies )

  toOrder:( studies, dirs=['north','west','east','south'] ) ->
    ordered = {}
    for dir in dirs
      for skey, study of studies
        ordered[skey] = study if study.dir is dir
    ordered

  combine:() ->
    obj = {}
    for arg in arguments
      for own key, val of arg
        obj[key] = val
    obj

  west:(   col ) ->
    switch col
      when 'Embrace'   then 'Encourage'
      when 'Innovate'  then 'Embrace'
      when 'Encourage' then 'Innovate'
      else
        console.error( 'Build.west() unknown col', col )
        'Embrace'

  east:(   col ) ->
    switch col
      when 'Embrace'   then 'Innovate'
      when 'Innovate'  then 'Encourage'
      when 'Encourage' then 'Embrace'
      else
        console.error( 'Build.east() unknown col', col )
        'Embrace'

  north:(  row ) ->
    switch row
      when 'Dim'   then 'Dim'
      when 'Learn' then 'Share'
      when 'Do'    then 'Learn'
      when 'Share' then 'Do'
      else
        console.error( 'Build.north() unknown row', row )
        'Learn'

  south:(  row ) ->
    switch row
      when 'Dim'   then 'Dim'
      when 'Learn' then 'Do'
      when 'Do'    then 'Share'
      when 'Share' then 'Learn'
      else
        console.error( 'Build.south() unknown row', row )
        'Learn'

  prev:(   plane ) ->
    switch plane
      when 'Info' then 'Wise'
      when 'Know' then 'Info'
      when 'Wise' then 'Know'
      else           
        console.error( 'Build.prev() unknown plane', plane )
        'None'

  next:(   plane ) ->
    switch plane
      when 'Info' then 'Know'
      when 'Know' then 'Wise'
      when 'Wise' then 'Info'
      else
        console.error( 'Build.next() unknown plane', plane )
        'None'

  adjacentPractice:( prac, dir ) ->
    # console.log( 'adjacentPractice', { prac:prac, dir:dir } )
    return @None if not prac? or not prac.name? or prac.name is 'None' or not prac.column?

    col = ""
    row = ""
    pln = ""
    [col,row,pln] = switch dir
      when 'west','nw','sw' then [@west(prac.column), prac.row,  prac.plane  ]
      when 'east','sw','se' then [@east(prac.column), prac.row,  prac.plane  ]
      when 'north'          then [prac.column, @north(prac.row), prac.plane  ]
      when 'south'          then [prac.column, @south(prac.row), prac.plane  ]
      when 'prev'           then [prac.column, prac.row,   @prev(prac.plane) ]
      when 'next'           then [prac.column, prac.row,   @next(prac.plane) ]
      else                       ["None","None","None"]


    return @None if [col,row,pln] is ["None","None","None"]
    pracs = @batch[pln].data.pracs
    for own key, adj of pracs when Util.isChild(key)
      if adj.column is col and adj.row is row and adj.plane is pln
        # console.log( 'adjacentPractice[col,row,pln]', [col,row,pln], adj )
        return adj
    console.log( 'adjacentPractice[col,row,pln]', [col,row,pln], 'adj not found' )
    @None

  adjacentStudies:( practice, dir ) ->
    adjPrac = @adjacentPractice( practice, dir )
    if adjPrac.name isnt 'None' then @toStudies(adjPrac) else {}

  connectName:( practice, dir, reverse ) ->
    adjacent = @adjacentPractice( practice, dir )
    if adjacent.name isnt 'None' then @centerBegEnd(practice.name,adjacent.name,reverse) else 'None'+'\n'+'None'

  centerBegEnd:( beg, end, reverse ) ->
    b = if end.length > beg.length then Util.indent((end.length-beg.length)/2) + beg else beg
    e = if beg.length > end.length then Util.indent((beg.length-end.length)/2) + end else end
    # console.log( 'Build.centerBegEnd()', { beg:beg, end:end, blen:beg.length, elen:end.length, b:b, e:e,be:b+'\n'+e })
    if not reverse then b+'\n'+e else e+'\n'+b

  setAdjacents:( practice ) ->
    practice.west  = @adjacentPractice( practice, 'west'  )
    practice.east  = @adjacentPractice( practice, 'east'  )
    practice.north = @adjacentPractice( practice, 'north' )
    practice.south = @adjacentPractice( practice, 'south' )
    practice.prev  = @adjacentPractice( practice, 'prev'  )
    practice.next  = @adjacentPractice( practice, 'next'  )
    return

  getPractices:( plane ) ->

    if @batch[plane]? and @batch[plane].data?
       @batch[plane].data
    else
       console.error( 'Build.getPractices()', plane )
       {}

  getPractice:( row, column, plane ) ->
    practices = @getPractices(plane)
    for own pkey, prac of practices when Util.isChild(pkey) and prac.column is column and prac.row is row
      return prac
    console.error( 'Prac.getPractice() practice not found for', { column:column, row:row, plane:plane } )
    null # Landmine

  getPracticeStudy:( row, column, dir ) ->
    practice = @getPractice( row, column, plane )
    study    = @getDir( practice, dir )
    study

  getDir:( practice, dir ) ->
    for own skey, study of practice when Util.isChild(skey)
      return study if study.dir is dir
    null

  getDim:( cname, dir ) ->
    col = @getCol(cname)
    for key, dim of col  when Util.isChild(key)
      # console.log( 'Build.getDim()', { key:key, dim:dim, col:col } )
      return dim if dim.dir is dir
    @None

  getCol:( cname ) ->
    @batch.Prin.data[cname]

  logPlanes:( planes ) ->
    console.log( '----- Beg Log Planes  ------' )
    for keyPlane in planes
      console.log( "Plane: ",    keyPlane )
      practices = @getPractices( keyPlane )
      for own keyPractice, objPractice of practices when Util.isChild(keyPractice)
        console.log( "  Practice: ", keyPractice )
        for own keyStudy, objStudy of objPractice when Util.isChild(keyStudy)
          console.log( "    Study: ", keyStudy )
          for own keyTopic, objTopic of objStudy when Util.isChild(keyTopic)
            console.log( "      Topic: ", keyTopic )
            for own keyItem, objItem of objTopic when Util.isChild(keyItem)
              console.log( "        Item: ", keyItem )
              for own keyBase, objBase of objItem when Util.isChild(keyBase)
                console.log( "          Base: ", keyBase )
    console.log( '----- End Log Planes ------' )
    return

  logBatch:( batch, comps ) ->  # ['Info','Know','Wise']
    console.log( '----- Beg Log Batch  ------' )
    for comp in comps
      console.log( "Comp: ", comp )
      pracs = batch[comp].data
      for own keyPractice, objPractice of pracs when Util.isChild(keyPractice)
        console.log( "    Prac: ", keyPractice )
        for own keyStudy, objStudy of objPractice when Util.isChild(keyStudy)
          console.log( "      Disp: ", keyStudy )
    console.log( '----- End Log Batch ------' )
    return

  logByConduit:() ->
    console.log( '----- Beg Log By Conduit  ------' )
    for   row in ['Learn','Do','Share']
      for col in ['Embrace','Innovate','Encourage']
        infop = @getPractice( row, col, 'Info' )
        knowp = @getPractice( row, col, 'Know' )
        wisep = @getPractice( row, col, 'Wise' )
        console.log( infop.name, knowp.name, wisep.name )
        for dir in ['west','north','east','south']
          infod = @getDir( infop, dir )
          knowd = @getDir( knowp, dir )
          wised = @getDir( wisep, dir )
          console.log( '    ', infod.name, knowd.name, wised.name )
    console.log( '----- End Log By Conduit  ------' )
    return

  planeIcon:( plane ) ->
    if plane is 'Data' then 'fas fa-table' else if @komps? then @komps[plane].icon else 'fas fa-circle'

  dimDisps:() ->
    for col in ['Embrace','Innovate','Encourage']
      planes = if col is  'Innovate' then ['Info','Data','Know','Wise'] else ['Info','Know','Wise']
      for dir in ['west','north','east','south']
        dim  = @getDim(col,dir)
        dim.column = col
        dim.dims = []
        for plane in planes
          dim.dims.push( { name:plane, icon:@planeIcon(plane), klass:@dimKlass('Plane',plane) } )
          for row in ['Learn','Do',   'Share']
            prac = @getPractice( row, col, plane )
            disp = @getDir( prac, dir )
            disp.klass  = @dimKlass( row, plane )
            dim.dims.push(disp)
    return

  dimKlass:( row, plane ) ->
    row.charAt(0).toLowerCase() + plane.charAt(0).toLowerCase()

  colPracs:() ->
    for cname in ['Embrace','Innovate','Encourage']
      planes = if cname is  'Innovate' then ['Info','Data','Know','Wise'] else ['Info','Know','Wise']
      col = @getCol(cname)
      col.dims = []
      for plane in planes
        col.dims.push( { name:plane, icon:@planeIcon(plane), klass:@dimKlass('Plane',plane) } )
        for row in ['Learn','Do','Share']
          prac = @getPractice( row, cname, plane )
          prac.klass = @dimKlass( row, plane )
          col.dims.push(prac)
    return

  logByColumn:() ->
    console.log( '----- Beg Log By Column  ------' )
    for cname in ['Embrace','Innovate','Encourage']
      console.log( cname )
      for dir in ['west','north','east','south' ]
        dim  = @getDim(cname,dir)
        console.log( '  ', dim.name, '------' ) # Learn', 'Do', 'Share ', dir )
        for plane in [ 'Info',  'Know', 'Wise' ]
          lprac = @getPractice( 'Learn', cname, plane )
          dprac = @getPractice( 'Do',    cname, plane )
          sprac = @getPractice( 'Share', cname, plane )
          learn = @getDir( lprac, dir )
          doit  = @getDir( dprac, dir )
          share = @getDir( sprac, dir )
          console.log( '    ', plane+':', learn.name, doit.name, share.name )
    console.log( '----- End Log By Column  ------' )
    return

  logAsTable:() ->
    console.log( '----- Beg Log As Table  ------' )
    for cname in ['Embrace','Innovate','Encourage']
      console.log( col )
      obj = {}
      for dir in ['west','north','east','south' ]
        dim  = @getDim(cname,dir)
        for plane in [ 'Info',  'Know', 'Wise' ]
          lprac = @getPractice( 'Learn', cname, plane )
          dprac = @getPractice( 'Do',    cname, plane )
          sprac = @getPractice( 'Share', cname, plane )
          learn = @getDir( lprac, dir )
          doit  = @getDir( dprac, dir )
          share = @getDir( sprac, dir )
          obj[plane] = { Dimension:dim.name, Learn:learn.name, Do:doit.name, Share:share.name }
          # data.push( [ pln, prin, learn.name, doit.name, share.name ] )
      # console.table( data, ['Plane','Principle','Learn', 'Do', 'Share'])
      console.table( obj )
    console.log( '----- End Log As Table  ------' )
    return

  saveAsHtml:( name ) ->
    htm  = """<!DOCTYPE html>\n<html lang="en">\n  <head><meta charset="utf-8">\n    <title>#{name}</title>"""
    htm += """\n    <link href="#{name}.css" rel="stylesheet" type="text/css"/>\n  </head>\n  <body>\n"""
    for col in ['Embrace','Innovate','Encourage']
      htm += """    <div class="col">#{col}</div>\n"""
      for dir in ['west','north','east','south' ]
        dim  = @getDim(col,dir)
        htm += """    <table>\n      <thead>\n        """
        htm += """<tr><th>Plane</th><th>#{dim}</th><th>Learn</th><th>Do</th><th>Share</th></tr>\n      </thead>\n      <tbody>\n"""
        for plane in [ 'Info',  'Know', 'Wise' ]

          lprac = @getPractice( 'Learn', col, plane )
          dprac = @getPractice( 'Do',    col, plane )
          sprac = @getPractice( 'Share', col, plane )
          learn = @getDir( lprac, dir )
          doit  = @getDir( dprac, dir )
          share = @getDir( sprac, dir )
          htm  += """        <tr><td>#{plane}:</td><td>#{dim}</td><td>#{learn.name}</td><td>#{doit.name}</td><td>#{share.name}</td></tr>\n"""
        htm += """      </tbody>\n    </table>\n"""
    htm += """  </body>\n</html>\n"""
    Data.saveHtml( name, htm )
    return



export default Build