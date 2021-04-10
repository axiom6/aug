
<template>
  <div class="dash-pane">
    <div :class="classOrient()">
      <d-view id="dashview"></d-view>
      <d-navd id="dashnavd"></d-navd>
    </div>
  </div>
</template>

<script type="module">

  import { inject, ref, onMounted } from 'vue';
  import View from './View.vue';
  import Navd from './Navd.vue';
  
  let Dash = {
      name: 'dash',

      components: { 'd-view':View, 'd-navd':Navd },

    setup() {

      const mix    = inject('mix');
      const orient = ref('portrait');

      const classOrient = function() {
        return orient.value; }

      const onOrient = function( orient ) {
        orient.value = orient; }

      onMounted( function () {
        mix.publish( 'Nav', 'Dash' ); } )

    return { classOrient, onOrient }; }
    
  };
  
  export default Dash;
  
</script>

<style lang="less">
  
  @import '../../../css/themes/theme.less';
  
  @portrait: "../../css/phone/portrait.png";
  @landscape:"../../css/phone/landscape.png";
  
  @dashFS:@themeFS;
  @dash-theme: { font-size:@dashFS; background-color:@theme-back; border-radius:2.0*@dashFS; }

  .dash-pane {   position:absolute; left:0; top:0; right:0; bottom:0; font-family:@theme-font-family;
    
    .portrait {  background-image:url(@portrait);  background-repeat: no-repeat;
                  position:absolute; left: 0;    top:0;     width:432px; height:864px;
      #dashview { position:absolute; left: 33px; top:108px; width:365px; height:658px; @dash-theme(); }
      #dashnavd { position:absolute; left:146px; top:770px; width:140px; height: 90px; @dash-theme();
        font-size:1.0rem;              border-radius:36px; } }
    
    .landscape { background-image:url(@landscape); background-repeat: no-repeat;
              position:absolute; left:0;     top:0;    width:864px; height:432px;
      #dashview { position:absolute; left:108px; top: 33px; width:658px; height:365px; @dash-theme(); }
      #dashlogo { position:absolute; left:760px; top:166px; width:120px; height: 90px; @dash-theme(); } }
    
 }
  
</style>

