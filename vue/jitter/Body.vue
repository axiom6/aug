
<template>
  <div   class="choice">
    <div class="csumm">
      <h-summ name="Body" id="CBody" ></h-summ>
    </div>
    <div class="cbtns">
      <h-btns comp="Body" :btns="btns" init="None" :choices="choices" back="#3B5999" active="tan"></h-btns>
    </div>
  </div>
</template>

<script type="module">

  import Summ from './Summ.vue';
  import Btns from '../../vue/elem/Btns.vue';

  let Body = {

    components:{ 'h-summ':Summ, 'h-btns':Btns },

    data() { return { comp:'Body', choices:['','',''], btns:{
      Thick:  { title:'Thick',  key:'Thick',  obj:null, pos:[20, 5,60,14], back:'primary',   check:true },
      Full:   { title:'Full',   key:'Full',   obj:null, pos:[20,24,60,14], back:'secondary', check:true },
      Creamy: { title:'Creamy', key:'Creamy', obj:null, pos:[20,43,60,14], back:'success',   check:true },
      Milky:  { title:'Milky',  key:'Milky',  obj:null, pos:[20,62,60,14], back:'info',      check:true },
      Silky:  { title:'Silky',  key:'Silky',  obj:null, pos:[20,81,60,14], back:'warning',   check:true }
    } } },
    
    methods:{},
    
    mounted: function () { }

  }

  export default Body;

</script>

<style lang="less">
  
  @import '../../pub/css/themes/theme.less';
  
  .choice { position:absolute; left:0; top:0; width:100%; height:100%;
    background-color:@theme-back; color:@theme-color;
    
    .csumm { position:absolute; left:0; top:0; width:100%; height:15%; }
    
    .cbtns { position:absolute; left:0; top:15%; width:100%; height:85%;
             background-color:@theme-back; color:@theme-color; }
  }

</style>
