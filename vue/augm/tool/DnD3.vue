
<template>
  <div class="dnd-pane">
    <h2>Drag and drop HTML5 demo</h2>
    <div>Try to move the purple box into the pink box.</div>
    <div id="boxA" class="drag" draggable="true" @dragstart="onDrag($event)"><p>Drag</p></div>
    <div id="boxB" class="drop" @drop="onDrop($event)" @dragenter.prevent @dragover.prevent>Drop</div>
  </div>
</template>

<script>

let DnD = {

setup() {

  const onDrag = function(event) {
    event.dataTransfer.effectAllowed='move';
    let id = event.target.getAttribute('id');
    console.log( 'DnD.onDrag()', id );
    event.dataTransfer.setData("id", id );
    event.dataTransfer.setDragImage(event.target,0,0);
    return true; }

  const onDrop = function(event)  {
    let id = event.dataTransfer.getData("id");
    console.log( 'DnD.onDrop()', id );
    event.target.appendChild(document.getElementById(id));
    event.stopPropagation();
    return false; }

  return { onDrag, onDrop } }
}

export default DnD;

</script>

<style lang="less">

@import '../../../css/themes/theme.less';

@dndFS:@themeFS;

.dnd-pane { position:absolute; left:0; top:0; width:100%; height:100%;
  color:@theme-fore; background-color:@theme-back; font-size:@dndFS;

  .drag { background-color:pink;   position:absolute; left:10%; top:20%; width:20%; height:20%; color:black; }
  .drop { background-color:purple; position:absolute; left:40%; top:20%; width:30%; height:30%;}
}

</style>

<!--
    <div id="boxB" class="drop"
        @ondragenter="dragEnter(e)" @drop="onDrop(e)" @ondragover="dragOver(e)">Drop</div>

  const dragEnter = (event) => {
    event.preventDefault();
    return true; }

  const dragOver = (event) => {
    event.preventDefault();
    return false; }
-->