
<template>
  <div class="dash-pane">
    <div :class="classOrient()">
      <d-view id="dashview"></d-view>
      <d-navd id="dashnavd" v-if="!nav.isMobile()"></d-navd>
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

      const nav    = inject('nav');
      const orient = ref('portrait');

      const classOrient = function() {
        let klass = orient.value;
        if( nav.isMobile() ) { klass += '-mobile'; } else { klass += '-desktop'; }
        return klass; }

      const onOrient = function( orient ) {
        orient.value = orient; }

      onMounted( function () {
        nav.publish( 'Nav', 'Dash' ); } )

    return { classOrient, onOrient, nav }; }
    
  };
  
  export default Dash;
  
</script>

<style lang="less">
  
  @import '../../../lib/css/themes/theme.less';
  
  @portrait: "../../assets/portrait.png";
  @landscape:"../../assets/landscape.png";
  
  @dashFS:@themeFS;
  @dash-theme: { background-color:@theme-back; border-radius:2.0*@dashFS; }

  body { margin:0; overflow:hidden; }

  .dash-pane {   position:absolute; left:0; top:0; right:0; bottom:0; font-family:@theme-font-family;
    
    .portrait-desktop {  background-image:url(@portrait);  background-repeat: no-repeat; font-size:@dashFS*0.7;
      position:absolute; left: 0;    top:0;     width:432px; height:864px;
      #dashview { position:absolute; left: 33px; top:108px; width:365px; height:658px; @dash-theme(); }
      #dashnavd { position:absolute; left:146px; top:770px; width:140px; height: 90px; @dash-theme();
        font-size:1.0rem;  border-radius:36px; } }
    
    .landscape-desktop { background-image:url(@landscape); background-repeat: no-repeat; font-size:@dashFS*0.7;
                  position:absolute; left:0;     top:0;     width:864px; height:432px;
      #dashview { position:absolute; left:108px; top: 33px; width:658px; height:365px; @dash-theme(); }
      #dashlogo { position:absolute; left:760px; top:166px; width:120px; height: 90px; @dash-theme(); } }

    .portrait-mobile {
                  position:absolute; left: 0; top:0; width:100%; height:100%;  font-size:@dashFS*1.2;
      #dashview { position:absolute; left: 0; top:0; width:100%; height:100%; @dash-theme(); } }

    .landscape-mobile {
                  position:absolute; left:0;     top:0;     width:100%; height:100%; font-size:@dashFS*1.2;
      #dashview { position:absolute; left:108px; top: 33px; width:100%; height:100%; @dash-theme(); } }
    
 }
  
</style>

