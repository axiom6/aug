
<template>
  <div class="home">
    <div class="elem">
      <h-btns comp="Home" :pages="pages" init="Axes"></h-btns>
    </div>
    <div class="head">
      <div>
        <h1>Welcome to Augmentation Home Page</h1>
        <h2>Choose an Application Component on the Left</h2>
      </div>
    </div>
  </div>
</template>

<script type="module">

  import Btns from '../elem/Btns.vue'
  
  export default {
    
    components:{ 'h-btns':Btns },

    data() { return { comp:'Draw', key:'Axes', pages:{
      Axes:    { title:'Axes',    key:'Axes',    obj:null, icon:'fas fa-circle', src:'brew/AutoDrip.jpg' },
      Chord:   { title:'Chord',   key:'Chord',   obj:null, icon:'fas fa-circle', src:'brew/AutoDrip.jpg' },
      Cluster: { title:'Cluster', key:'Cluster', obj:null, icon:'fas fa-circle', src:'brew/AutoDrip.jpg' },
      Link:    { title:'Link',    key:'Link',    obj:null, icon:'fas fa-circle', src:'brew/AutoDrip.jpg' },
      Radar:   { title:'Radar',   key:'Radar',   obj:null, icon:'fas fa-circle', src:'brew/AutoDrip.jpg' },
      Radial:  { title:'Radial',  key:'Radial',  obj:null, icon:'fas fa-circle', src:'brew/AutoDrip.jpg' },
      Tree:    { title:'Tree',    key:'Tree',    obj:null, icon:'fas fa-circle', src:'brew/AutoDrip.jpg' },
      Wheel:   { title:'Wheel',   key:'Wheel',   obj:null, icon:'fas fa-circle', src:'brew/AutoDrip.jpg' } } } },
  }
</script>

<style lang="less">
  
  .home {  }
  
  .elem { position:relative; left:0; top:0; right:0; height:5%; }
  
  .head { justify-items:center; align-items:center; text-align:center; display:grid;
          justify-self:stretch; align-self:stretch; background-color:black; color:wheat; }
  
</style>