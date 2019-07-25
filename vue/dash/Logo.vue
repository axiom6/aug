
<template>
  <div class="logo"><d-navd id="navd"></d-navd></div>
</template>

<script type="module">
  
  import Navd from '../elem/Navd.vue';

  let Logo = {
    name: 'logo',
    components: { 'd-navd':Navd }
  };

  export default Logo;
  
</script>

<style lang="less">
  .logo     { }
</style>
