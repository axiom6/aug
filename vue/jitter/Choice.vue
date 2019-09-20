
<template>
  <div   class="choice">
    <div class="csumm">
      <h-summ :name="name" ></h-summ>
    </div>
    <div class="cbtns">
      <h-btns :name="name" :btns="btns"></h-btns>
    </div>
  </div>
</template>

<script type="module">

  import Summ from './Summ.vue';
  import Btns from '../../vue/elem/Btns.vue';

  let Choice = {

    components:{ 'h-summ':Summ, 'h-btns':Btns },

    data() { return { name:'None', btns:{} } },
    
  }

  export default Choice;

</script>

<style lang="less">
  
  @import '../../pub/css/themes/theme.less';
  
  .choice { position:absolute; left:0; top:0; width:100%; height:100%;
    background-color:@theme-back; color:@theme-color;
    
    .csumm { position:absolute; left:0; top:0;   width:100%; height:15%; }
    
    .cbtns { position:absolute; left:0; top:15%; width:100%; height:85%;
             background-color:@theme-back; color:@theme-color;  border:1px solid @theme-color; }
  }

</style>
