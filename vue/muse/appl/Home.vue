
<template>
  <div class="home-pane">
    <div class="home-header">
      <div>
        <h1 class="theme-h1">Welcome to Muse Home Page</h1>
        <h2 class="theme-h2">Choose an Application Component on the Left</h2>
      </div>
    </div>
    <div class="home-footer">
      <div>
        <h1 class="theme-h1">Humanistic Practices</h1>
        <h1 class="theme-h1">Axiom Architectures</h1>
      </div>
    </div>
  </div>
</template>

<script type="module">

  import { inject, onMounted } from 'vue';
  
  let Home = {

    setup( {} ) {
      const nav = inject( 'nav' );
      onMounted( function () {
        nav.publish( 'Tocs', 'Close' ); } ) }
  }
  
  export default Home;
  
</script>

<style lang="less">

  @import '../../../lib/css/font/roboto/Roboto.css';
  @import '../../../node_modules/@fortawesome/fontawesome-free/css/all.css';
  @import '../../../lib/css/themes/theme.less';
  
  @homeFS:2.0*@themeFS;
  
  .home-pane { position:absolute; left:0; top:0; width:100%; height:100%;
    background-color:@theme-back; color:@theme-fore;

    .home-head { position:absolute; left:0; top:20%;   width:100%; height:20%; .themeCenterItems(); }
    
    .home-midd { position:absolute; left:0; top:40%; width:100%; height:10%; .themeCenterItems(); }
    
    .home-list { .themeCenterSelf(); }
  
    .home-foot { position:absolute; left:0; top:50%; width:100%; height:20%; .themeCenterItems(); }
  

 }
 
</style>
