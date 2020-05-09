
<template>
  <div class="disp-pane">
    <d-tabs route="route" :pagesInit="'Disp'" :pages="pages"></d-tabs>
    <d-dims v-if="pages['Dims'].show" :dispObj="dispObj" from="Disp"></d-dims>
    <d-desc v-if="pages['Desc'].show" :dispObj="dispObj" from="Disp"></d-desc>
  </div>
</template>

<script type="module">

  import Tabs from '../elem/Tabs.vue';
  import Dims from '../prac/Dims.vue';
  import Desc from './Desc.vue';
  
  let Disp = {

    components:{ 'd-tabs':Tabs, 'd-dims':Dims, 'd-desc':Desc },
    
    data() { return { route:"Disp", dispObj:null, // compKey:'Desc',
      pages:{
        Dims: { title:'Disciplines',  key:'Dims', show:true  },
        Desc: { title:'Descriptions', key:'Desc', show:false } } } },
    
    methods: {
      
      onDisp: function( obj ) {
        this.mix().nav().setPages( this.route, this.pages );
        this.dispObj  = this.mix().dispObject( obj.compKey, obj.inovKey, obj.pracKey, obj.dispKey );
        if( !this.mix().isDef(this.dispObj) ) {
          console.error('Disp.onDisp() disp null',{comp:obj.compKey, prac:obj.pracKey, disp:obj.dispKey } ) } },
      onNav:  function (obj) {
        if( this.mix().nav().isMyNav( obj, 'Disp' ) ) {
            this.onDisp( obj ); } } },

    beforeMount: function() {
      this.onDisp( this.mix().nav() ); },

    mounted: function () {
      this.mix().nav().setPages( this.route, this.pages );
      this.mix().subscribe(  "Nav", 'Disp.vue', (obj) => {
        this.onNav(obj); } ); }
  }
  
  export default Disp;
  
</script>

<style lang="less">
  
  @import '../../pub/css/themes/theme.less';

  .disp-pane { position:absolute; left:0; top:0; width:100%; height:100%; background-color:@theme-gray; }
  
</style>

