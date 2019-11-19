


<template>
  <div class="talk-pane">
  </div>
</template>

<script type="module">

  import Sect from './Sect.vue';

  let Talk = {

    components:{ 't-prac':Prac, 't-disp':Disp },

    data() { return { sectObj:null, dataObj:null, type:"Sect" } },

    methods: {

      isType: function(type) {
        return type===this.type; },

      hasProp: function(prop) {
        this.isDef(this.sectObj[prop]) || this.isDef(this.dataObj[prop]); },

      getProp: function(prop) {
        return this.isDef(this.sectObj[prop]) ? this.sectObj[prop] : this.dataObj[prop]; },

      onNav: function( obj ) { }

    },

    mounted: function () {
      this.subscribe(  "Talk", 'Prac.vue', (obj) => {
        this.onNav(obj); } ); }
  }

  export default Talk;

</script>

<style lang="less">
  
  @import '../../pub/css/themes/theme.less';
  
  @sectFS:2.0*@themeFS;
  
  .talk-pane   { position:absolute; left:0; top:0; width:100%; height:100%;
    background-color:@theme-back; font-size:@sectFS; border-radius:0.5*@sectFS; }

</style>
