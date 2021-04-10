
<template>
  <div class="prac-pane">
    <p-dirs v-if="show('Dirs')" :pracObj="pracObj"></p-dirs>
    <p-conn v-if="show('Conn')" :pracObj="pracObj" level="Prac"></p-conn>
    <p-desc v-if="show('Desc')" :pracObj="pracObj"></p-desc>
  </div>
</template>

<script type="module">
  
  import Dirs from '../../muse/prac/Dirs.vue';
  import Conn from '../../muse/comp/Conn.vue';
  import Desc from '../../muse/prac/Desc.vue';
  
  let Prac = {

    components:{ 'p-dirs':Dirs, 'p-conn':Conn, 'p-desc':Desc },

    props: { sectObj:Object, pracObj:Object },
    
    data() { return {  type:'Dirs' } },
    
    methods: {
      
      show:function( type ) {
        return type===this.type; },
      
      }
  }
  
  export default Prac;
  
</script>

<style lang="less">
  
  @import '../../../css/themes/theme.less';

  @pracFS:2.0*@themeFS;
  
  .prac-pane   { position:absolute; left:0; top:0; width:100%; height:100%;
    background-color:@theme-gray; font-size:@pracFS; border-radius:0.5*@pracFS; }
  
</style>

