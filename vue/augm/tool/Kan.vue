
<template>
  <div class="kan-pane">

    <div id="Initiate" ref="Initiate" class="initiate" @drop="onDrop($event)"
        @dragenter.prevent @dragover.prevent><p class="title">Initiate</p>
      <div id="Architect" ref="Architect" class="drag" draggable="true"
        @dragstart="onDrag($event)"><p class="text">Architect</p></div>
      <div id="Design"    ref="Design" class="drag" draggable="true"
        @dragstart="onDrag($event)"><p class="text">Design</p></div>
      <div id="Construct" ref="Construct" class="drag" draggable="true"
        @dragstart="onDrag($event)"><p class="text">Construct</p></div>
    </div>
    <div id="Progress" ref="Progress" class="progress" @drop="onDrop($event)"
        @dragenter.prevent @dragover.prevent><p class="title">Progress</p></div>
    <div id="Finished" ref="Finished" class="finished" @drop="onDrop($event)"
        @dragenter.prevent @dragover.prevent><p class="title">Finished</p></div>

  </div>
</template>

<script>

import { inject, ref } from 'vue';

let Kan = {

setup() {

  const mix = inject('mix');

  const onDrag = function(event) {
    event.dataTransfer.effectAllowed='move';
    let cid = event.target.getAttribute('id');
    let pid = event.target.parentNode.getAttribute('id');
    console.log( 'DnD.onDrag()', { cid:cid, pid:pid } );
    event.dataTransfer.setData("cid", cid );
    event.dataTransfer.setData("pid", pid );
    event.dataTransfer.setDragImage(event.target,0,0);
    return true; }
  
  const onDrop = function(event)  {
    let cid      = event.dataTransfer.getData("cid");
    let pid      = event.dataTransfer.getData("pid");
    let tid      = event.target.getAttribute('id');
    let child    = document.getElementById(cid);
    let parent   = document.getElementById(pid);
    let isParent = mix.isDef(parent)
    let isSame   = parent.isSameNode(child.parentNode)
    if( isParent ) {
      child = child.parentNode.removeChild( child );
      event.target.appendChild(   child );
      console.log( 'DnD.onDrop() success', { cid:cid, pid:pid, tid:tid } ); }
    else {
      console.log( 'DnD.onDrop() failure', { cid:cid, pid:pid, tid:tid, isParent:isParent, isSame:isSame } ); }

    event.stopPropagation();
    return false; }

  return { onDrag, onDrop } }
}

export default Kan;

</script>

<style lang="less">

@import '../../../css/themes/theme.less';

@dndFS:@themeFS*2.0;

.kan-pane { position:absolute; left:0; top:0; width:100%; height:100%;
  color:@theme-fore; background-color:@theme-back; font-size:@dndFS;

  .drag     { background-color:black; width:80%; height:20%; margin:10%;color:wheat; display:grid; }
  .text     {  color:wheat; justify-self:center; align-self:center; }
  .initiate { background-color:gold;  position:absolute; left: 6%; top:10%; width:24%; height:80%; color:black; }
  .progress { background-color:brown; position:absolute; left:36%; top:10%; width:24%; height:80%; color:black; }
  .finished { background-color:tan;   position:absolute; left:70%; top:10%; width:24%; height:80%; color:black; }
  .title    { text-align:center; margin-top:3%; }
}

</style>

<!--
  const onEnter = function(event)  {
    let cid    = event.dataTransfer.getData("cid");
    let pid    = event.dataTransfer.getData("pid");
    let child  = document.getElementById(cid);
    let parent = document.getElementById(pid);
    if( mix.isDef(parent) ) {
      child = parent.removeChild( child ); }
    else {
      console.log( 'DnD.onDrop() remove parent null' ); }
    event.target.appendChild( child );
    event.preventDefault();
  }

    <div id="boxB" class="drop"
        @ondragenter="dragEnter(e)" @drop="onDrop(e)" @ondragover="dragOver(e)">Drop</div>

  const dragEnter = (event) => {
    event.preventDefault();
    return true; }

  const dragOver = (event) => {
    event.preventDefault();
    return false; }
-->