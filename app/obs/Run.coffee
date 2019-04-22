

import {Inspector, Runtime} from 'https://unpkg.com/@observablehq/notebook-runtime@1?module'
#mport notebook from '../../html/download/standard.js';

class Run

  constructor:() ->
    if @req is false then {}

  run:( htmlId, notebook ) ->
    Runtime.load( notebook, Inspector['into']( document.querySelector('#'+htmlId ) ) )

  # Dynamic import not working
  dyn:( htmlId, notebookURL ) ->
    if htmlId is false && notebookURL is false then {}
    `import( notebookURL ).then( (notebook) =>
      Runtime.load( notebook, Inspector['into']( document.querySelector('#'+htmlId ) ) ) );`

  # Node.js require not working
  req:( htmlId, notebookURL ) ->
    rnotebook = d3.require( notebookURL )
    Runtime.load( rnotebook, Inspector['into']( document.querySelector('#'+htmlId ) ) )

export default Run