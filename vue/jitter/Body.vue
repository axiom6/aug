
<template>
  <div class="body">
    <h-btns comp="Home" :btns="btns" init="Thick" back="#3B5999" active="tan"></h-btns>
  </div>
</template>

<script type="module">

  import Btns from '../../vue/elem/Btns.vue';

  let Body = {

    components:{ 'h-btns':Btns },

    data() { return { comp:'Body',  btns:{
      Thick:  { title:'Thick',  key:'Thick',  obj:null, pos:[17, 5,50,15], back:'primary',   check:true },
      Full:   { title:'Full',   key:'Full',   obj:null, pos:[17,25,50,15], back:'secondary', check:true },
      Creamy: { title:'Creamy', key:'Creamy', obj:null, pos:[17,45,50,15], back:'success',   check:true },
      Milky:  { title:'Milky',  key:'Milky',  obj:null, pos:[17,65,50,15], back:'info',      check:true },
      Silky:  { title:'Silky',  key:'Silky',  obj:null, pos:[17,85,50,15], back:'warning',   check:true }
    } } },
    
    mounted: function () {
      this.publish( 'Nav', 'Body' ); }

  }

  export default Body;

</script>

<style lang="less">
  
  @import '../../pub/css/themes/theme.less';
  
  .body { position:absolute; left:0; top:0; width:100%; height:100%;
          background-color:@theme-back; color:@theme-color; }

</style>
