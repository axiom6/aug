
<template>
  <div class="dash">
    <div :class="classOrient()">
      <d-view id="view"></d-view>
    </div>
  </div>
</template>

<script type="module">
  
  import View from './View.vue';
  
  let Dash = {
      name: 'dash',
      components: {'d-view':View },
    
    data() { return { comp:'Dash', orient:'portrait' } },
    
    methods: {
      classOrient: function() {
        return this.orient; },
      onOrient: function( orient ) {
        this.orient = orient; } },

    mounted: function () {
      this.publish( 'Nav', 'Dash' ); }
    
  };
  
  export default Dash;
  
</script>

<style lang="less">
  
  @import '../../pub/css/themes/theme.less';

  .dash {   position:absolute; left:0; top:0; right:0; bottom:0; font-family:@theme-font-family;
    
    .portrait {  background-image:url(../../pub/css/phone/portrait.png);  background-repeat: no-repeat;
              position:absolute; left:0;     top:0;     width:432px; height:864px;
      #view { position:absolute; left:33px;  top:108px; width:365px; height:658px;  .theme-view; } }
    
    .landscape { background-image:url(../../pub/css/phone/landscape.png); background-repeat: no-repeat;
              position:absolute; left:0;     top:0;    width:864px; height:432px;
      #view { position:absolute; left:108px; top:33px; width:658px; height:365px;  .theme-view; } }
    
 }
  
</style>

