

<template>
  <div class="sect-pane">
    <div v-if="hasProp('banner')" class="sect-banner" :sectObj="pracObj">{{sectObj.banner}}</div>
    <div v-if="hasProp('title')" class="sect-title" :sectObj="pracObj">{{sectObj.title}}</div>
    <div v-if="hasProp('author')" class="sect-author" :sectObj="pracObj">{{sectObj.author}}</div>
    <div v-if="hasProp('desc')" class="sect-desc" :sectObj="pracObj">{{sectObj.desc}}</div>

  </div>
</template>

<script type="module">

  let Sect = {

    components:{  },

    data() { return { sectObj:null, dataObj:null } },

    methods: {

      show: function(type) {
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

  export default Sect;

</script>

<style lang="less">
  
  @import '../../pub/css/themes/theme.less';
  
  @sectFS:2.0*@themeFS;
  
  .sect-pane   { position:absolute; left:0; top:0; width:100%; height:100%;
    background-color:@theme-gray; font-size:@sectFS; border-radius:0.5*@sectFS;
    .sect-banner {}
    .sect-author {}
    .sect-title  {}
    .sect-desc   {}
    .sect-prac   {}
    .sect-disp   {}
  
  }

</style>

