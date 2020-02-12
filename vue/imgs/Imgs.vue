
<template>
  <div class="imgs-pane">
    <i-carousel :data="panels"></i-carousel>
  </div>
</template>

<script type="module">

  import Carousel from '../../pub/lib/vue/vue-carousel.esm.js';

  let Imgs = {

    components:{ 'i-carousel':Carousel },

    data() { return {
      imgsObj:null,
      panels: [
              '<div class="panel">Slide 1</div>',
              '<div class="panel">Slide 2</div>',
              '<div class="panel">Slide 3</div>' ] }; },

    methods: {

     onImgs: function ( pracKey, dispKey, pageKey ) {},

      onNav: function (obj) {
        if( this.mix().nav().isMyNav( obj, 'Imgs' ) ) {
          this.onImgs( obj.pracKey, obj.dispKey, obj.pageKey ); } },
      
      },

    beforeMount: function() {
      // this.imgsObj = this.mix().compObject('Imgs');
      },

    mounted: function () {
      this.mix().subscribe(  "Nav", 'Imgs.vue', (obj) => {
        this.onNav( obj ); } ); }

  }

  export default Imgs;

</script>

<style lang="less">
  
  @import '../../pub/css/themes/theme.less';
  
  @imgsFS:2.0*@themeFS;
  
  .imgs-pane   { position:absolute; left:5%; top:5%; width:90%; height:90%;
    color:@theme-fore; background-color:@theme-back; font-size:@imgsFS; .themeCenterItems();
    
    .panel { display: flex; align-items:center; background-color:#666; color:#999; font-size:@imgsFS;
        justify-content: center;min-height: 10rem; width:100%; height:100%; }
  }

</style>
