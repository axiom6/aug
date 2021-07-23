
<template>
  <div class="spot-pane" ref="elem"></div>
</template>

<script type="module">

  import SpotJS   from '../../../pub/vizu/spot/Spot.js'
  import { inject, ref, onMounted, onUnmounted, nextTick } from 'vue';
  
  let Cube = {

    setup() {

      const nav    = inject('nav');
      const elem   = ref(null)
      let   spotJS = null

      onMounted( () => {
        nextTick( () => {
          spotJS = new SpotJS( elem['value'], nav ); } ) } )

      onUnmounted( () => {
        nextTick(  () => {
          spotJS.dispose();
          nav.removeElem( elem['value'] ); } ) } )
      
    return { elem }; }
  }

  export default Cube;
</script>


<style lang="less">
  .spot-pane { position:absolute; left:0; top:0; width:100%; height:100%; }

  body {
    margin: 0;
    background-color: #000;
    color: #fff;
    font-family: monospace;
    font-size: 13px;
    line-height: 24px;
    overscroll-behavior: none;
  }

  a {
    color: #ff0;
    text-decoration: none;
  }

  a:hover {
    text-decoration: underline;
  }

  button {
    cursor: pointer;
    text-transform: uppercase;
  }

  #info {
    position: absolute;
    top: 0;
    width: 100%;
    padding: 10px;
    box-sizing: border-box;
    text-align: center;
    -moz-user-select: none;
    -webkit-user-select: none;
    -ms-user-select: none;
    user-select: none;
    pointer-events: none;
    z-index: 1; /* Solve this in HTML */
  }

  a, button, input, select {
    pointer-events: auto;
  }

  .dg.ac {
    -moz-user-select: none;
    -webkit-user-select: none;
    -ms-user-select: none;
    user-select: none;
    z-index: 2 !important; /* Solve this in HTML */
  }

  #overlay {
    position: absolute;
    font-size: 16px;
    z-index: 2;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    background: rgba(0,0,0,0.7);
  }

  #overlay button {
    background: transparent;
    /* border: 0; */
    border: 1px solid rgb(255, 255, 255);
    border-radius: 4px;
    color: #ffffff;
    padding: 12px 18px;
    text-transform: uppercase;
    cursor: pointer;
  }

  #notSupported {
    width: 50%;
    background-color: #f00;
    margin: 20px auto auto;
    padding: 10px;
  }


</style>