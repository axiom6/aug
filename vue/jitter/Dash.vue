
<template>
  <div class="dash">
    <div :class="classOrient()">
      <d-view id="view"></d-view>
      <d-logo id="logo"></d-logo>
    </div>
  </div>
</template>

<script type="module">
  
  import View from './View.vue';
  import Logo from '../dash/Logo.vue';
  
  let Dash = {
      name: 'dash',
      components: { 'd-view':View, 'd-logo':Logo },
    
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
  
  @portrait: "../../css/phone/portrait.png";
  @landscape:"../../css/phone/landscape.png";

  .dash {   position:absolute; left:0; top:0; right:0; bottom:0; font-family:@theme-font-family;
    
    .portrait {  background-image:url(@portrait);  background-repeat: no-repeat;
              position:absolute; left: 0;     top:0;     width:432px; height:864px;
      #view { position:absolute; left: 33px;  top:108px; width:365px; height:658px; .theme-view; }
      #logo { position:absolute; left:146px;  top:770px; width:140px; height: 90px; .theme-logo; border-radius:36px; } }
    
    .landscape { background-image:url(@landscape); background-repeat: no-repeat;
              position:absolute; left:0;     top:0;    width:864px; height:432px;
      #view { position:absolute; left:108px; top:33px; width:658px; height:365px;  .theme-view; }
      #logo { position:absolute; left:760px; top:166px; width:120px; height: 90px; .theme-logo; border-radius:36px; } }
    
 }
  
</style>

