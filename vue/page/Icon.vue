
<template>
  <div v-show="isPage()" class="icon" prac="prac" @click="doPrac(prac)">
    <i  :class="prac.icon"></i>
    <div class="name">{{prac.name}}</div>
  </div>
</template>

<script type="module">
  
  let Icon = {
    
    props: { comp:String, prac:Object },
    
    data() { return { page:"Icon"} },
    
    methods: {
      
      isPage:  function () {
        return this.page === 'Icon'; },
      onPage:  function (page) {
        return this.page = page; },
      doPrac: function (name) {
        publish( this.comp, name ); } },
        
    mounted: function () {
      this.subscribe( 'Page', 'Icon.vue', (page) => this.onPage(page) ); }
  }

  export default Icon;
  
</script>

<style lang="less">
  @import '../../pub/css/themes/theme.less';
  .icon { display:grid; align-self:stretch; justify-self:stretch; align-items:center; justify-items:center;
    background-color:@theme-back; color:@theme-color; font-size:@theme-icon-size; text-align:center; .theme-icon;
    .name { font-size:@theme-name-size; text-align:center; } }
</style>