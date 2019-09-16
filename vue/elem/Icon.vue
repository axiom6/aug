
<template>
  <div>
    <div :class="icClass()" :style="style()" @click="doClick()">
      <i   :class="icon"></i>
      <span class="name">{{name}}</span>
      <span v-if="hasSumm()" class="summ">{{summ}}</span>
    </div>
  </div>
</template>

<script type="module">
  
  let IconName = {

    props: { icon:String, name:String, summ:String, size:Number, fnClick:Function },
    
    methods: {
      
      hasSumm: function() {
        return this.isDef(this.summ); },
      
      icClass:function() {
        return this.hasSumm() ? 'icon-summ' : 'icon-name'; },
      
      doClick: function() {
        if( this.isDef(this.fnClick) ) {
          this.fnClick(this.name); } },
      
      style: function() {
        return { fontSize:this.size+'rem' }; }

    }
    
  }
  
  export default IconName;
  
</script>

<style lang="less">
  
  @import '../../pub/css/themes/theme.less';
  
  .grid1x2() { display:grid; grid-template-columns:30fr 10fr 30fr 30fr;
    grid-template-areas:"nleft nicon nname nright"; }
  
  .icon-name { .grid1x2(); align-self:center;  justify-self:center; height:100%;
    i     { grid-area:nicon; .themeCenterItems(); }
    .name { grid-area:nname; .themeCenterItems(); } }

  .grid1x4() { display:grid; grid-template-columns:5fr 5fr 15fr 75fr; grid-template-areas:"sleft sicon sname ssumm"; }

  .icon-summ { .grid1x4(); align-self:start;  justify-self:center;
    i     { grid-area:sicon; .themeLeftSelf(); }
    .name { grid-area:sname; .themeLeftSelf(); font-weight:900; }
    .summ { grid-area:ssumm; .themeLeftSelf(); } }
  
</style>