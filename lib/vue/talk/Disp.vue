
<template>
  <div class="disp-pane">
    <d-dims v-if="show('Dims')" :dispObj="dispObj" from="Disp"></d-dims>
    <d-desc v-if="show('Desc')" :dispObj="dispObj" from="Disp"></d-desc>
  </div>
</template>

<script type="module">
  
  import Dims from '../../muse/prac/Dims.vue';
  import Desc from '../../muse/disp/Desc.vue';

  let Disp = {

    components:{ 'd-dims':Dims, 'd-desc':Desc },

    props: { sectObj:Object, dispObj:Object },

    data() { return {  type:'Dims' } },

    methods: {

      show:function( type ) {
        return type===this.type; },
    },
    
  }

  export default Disp;

</script>

<style lang="less">
  
  @import '../../css/themes/theme.less';
  
  .disp-pane { position:absolute; left:0; top:0; width:100%; height:100%; background-color:@theme-gray; }

</style>

