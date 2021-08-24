<template>
  <div ref="DnDStart" class="dnd-pane">

    <div class="initiate" @drop="onDrop($event)"
        @dragenter.prevent @dragover.prevent><p class="name">Initiate</p>
      <div class="drag" draggable="true"
          @dragstart="onDrag($event)"><p class="text">Architect</p></div>
      <div class="drag" draggable="true"
          @dragstart="onDrag($event)"><p class="text">Design</p></div>
      <div class="drag" draggable="true"
          @dragstart="onDrag($event)"><p class="text">Construct</p></div>
    </div>
    <div class="progress" @drop="onDrop($event)"
        @dragenter.prevent @dragover.prevent><p class="name">Progress</p></div>
    <div class="finished" @drop="onDrop($event)"
        @dragenter.prevent @dragover.prevent><p class="name">Finished</p></div>

  </div>
</template>

<script type="module">

import { ref } from 'vue';

  let DnD = {

    setup(props) {

      const DnDStart  = ref(null);
      let   childDrag = null;

      const onDrag = function(event) {
        event.dataTransfer.effectAllowed='move';
        childDrag = event.target;
        event.dataTransfer.setDragImage(event.target,0,0); }

      const onDrop = function(event)  {
        childDrag = childDrag.parentNode.removeChild( childDrag );
        event.target.appendChild( childDrag );
        event.stopPropagation(); }

      return { onDrag, onDrop, DnDStart } }
  }

  export default DnD;

</script>

<style lang="less">
@import '../../../lib/css/themes/theme.less';
@dndFS:@themeFS*2.0;
.dnd-pane { position:absolute; left:0; top:0; width:100%; height:100%;
  color:@theme-fore; background-color:@theme-back; font-size:@dndFS;
  .drag     { background-color:black; width:80%; height:20%; margin:10%;color:wheat; display:grid; }
  .text     {  color:wheat; justify-self:center; align-self:center; }
  .initiate { background-color:gold;  position:absolute; left: 6%; top:10%; width:24%; height:80%; color:black; }
  .progress { background-color:brown; position:absolute; left:36%; top:10%; width:24%; height:80%; color:black; }
  .finished { background-color:tan;   position:absolute; left:70%; top:10%; width:24%; height:80%; color:black; }
  .name     { text-align:center; margin-top:3%; }
}
</style>
