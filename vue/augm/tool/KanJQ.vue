
<template>
  <div ref="DnDStart" class="kan-pane">
    <div class="initiate" droppable="true"><p class="name">Initiate</p>
      <div class="drag"   draggable="true"><p class="text">Architect</p></div>
      <div class="drag"   draggable="true"><p class="text">Design</p></div>
      <div class="drag"   draggable="true"><p class="text">Construct</p></div>
    </div>
    <div class="progress" droppable="true"><p class="name">Progress</p></div>
    <div class="finished" droppable="true"><p class="name">Finished</p></div>
  </div>
</template>

<script>

import { inject, ref, onMounted, nextTick } from 'vue';
import $ from 'jquery';

let KanJQ = {

setup() {

  const mix      = inject('mix');
  let childDrag  = null;
  let DnDStart   = ref(null);

  // @click="traverseEvent($event)"
  const traverseEvent = ( event ) => {
    traverse( event.target ); }

  const traverse = ($elem) => {
    if( $elem.attr('draggable') ) {
      addDragListeners( $elem ); }
    if( $elem.attr('droppable') ) {
      addDropListeners( $elem ); }
    $elem.children().each( (index,child) =>
      traverse( $(child) ) ) }

  const addDragListeners = ($elem) => {
    $elem.on("dragstart", onDrag );
    console.log( 'KanJQ.addDrag() success', $elem ); }

  const addDropListeners = ($elem) => {
    $elem.on("drop",      onDrop  );
    $elem.on("dragenter", onEnter );
    $elem.on("dragover",  onOver  );
    console.log( 'KanJQ.addDrop() success', $elem ); }

  const onDrag = (event) => {
    event.preventDefault();
    event.dataTransfer.effectAllowed='move';
    childDrag = event.target;
    event.dataTransfer.setDragImage(event.target,0,0);
    console.log( 'KanOn.onDrag() success' ); }
  
  const onDrop = function(event)  {
    event.preventDefault();
    if( mix.isDef(childDrag) ) {
        childDrag = childDrag.parentNode.removeChild( childDrag );
        event.target.appendChild( childDrag );
        console.log( 'KanJQ.onDrop() success' ); }
    else {
        console.log( 'KanJQ.onDrop() failure' ); }
    event.stopPropagation(); }

  const onEnter = function(event)  {
    event.preventDefault(); }

  const onOver = function(event)  {
    event.preventDefault(); }

  onMounted(  function() {
    if( window.KanOnHasMounted ) { return; }
    window.KanOnHasMounted = true;
    nextTick( function() {
      let $start = $(DnDStart['value']);
      traverse( $start );  } ) } )

  return { DnDStart, traverseEvent } } // , onDrag, onDrop, onEnter, onOver
}

export default KanJQ;

</script>

<style lang="less">

@import '../../../css/themes/theme.less';

@dndFS:@themeFS*2.0;

.kan-pane { position:absolute; left:0; top:0; width:100%; height:100%;
  color:@theme-fore; background-color:@theme-back; font-size:@dndFS;

  .drag     { background-color:black; width:80%; height:20%; margin:10%;color:wheat; display:grid; }
  .text     {  color:wheat; justify-self:center; align-self:center; }
  .initiate { background-color:gold;  position:absolute; left: 6%; top:10%; width:25%; height:80%; color:black; }
  .progress { background-color:brown; position:absolute; left:37%; top:10%; width:25%; height:80%; color:black; }
  .finished { background-color:tan;   position:absolute; left:68%; top:10%; width:25%; height:80%; color:black; }
  .name     { text-align:center; margin-top:3%; }
}

</style>

<!--

console.log( 'KanOn.traverse() results', start.children );
// console.log( 'Dnd.onMounded()', start );


  const addDragListeners = (elem) => {
    elem.ondragstart = onDrag; }

  const addDropListeners = (elem) => {
    elem.ondrop      = onDrop;
    elem.ondragenter = onEnter;
    elem.ondragover  = onOver; }

  const addDragListeners = (elem) => {
    elem.addEventListener("ondragstart", onDrag ); }

  const addDropListeners = (elem) => {
    elem.addEventListener("ondrop",      onDrop  );
    elem.addEventListener("ondragenter", onEnter );
    elem.addEventListener("ondragover",  onOver  ); }

  const traverse = (elem) => {
    if( mix.isDef(elem.nodeType) && elem.nodeType === 1 ) { // is DOM Element mix.isArray(elem.attributes)
      console.log( 'KanOn.traverse()',
          { name:elem.className, draggable:elem['draggable'], droppable:elem.hasAttribute('droppable'), elem:elem } );
      if( elem['draggable'] ) {
        console.log( 'KanOn.traverse() drag', elem );
        addDragListeners( elem ); }
      if( elem.hasAttribute('droppable') ) {
        console.log( 'KanOn.traverse() drop', elem );
        addDropListeners( elem ); }
      let childs = elem.children;
      for( let i = 0; i < childs.length; i++ ) {
        console.log( 'KanOn.traverse() child', childs[i] );
        traverse( childs[i] ); } } }
-->
