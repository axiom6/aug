
<template>
  <div     class="prac-desc-pane">
    <div   class="prac-desc-cent" @click="doPrac(pracObj.name)" :style="style(pracObj)">
      <div class="prac-desc-icon"><d-icon :icon="pracObj.icon" :name="pracObj.name" :size="3.0"></d-icon></div>
      <div class="prac-desc-summ">{{pracObj['desc']}}</div>
    </div>
    <template v-for="dispObj in pracObj.disps">
      <div   :class="dispObj.dir" @click="doDisp(dispObj.name)" :style="style(dispObj)">
        <div      class="prac-disp-desc">
          <div    class="prac-disp-icon"><d-icon :icon="dispObj.icon" :name="dispObj.name" :size="2.0"></d-icon></div>
          <div    class="prac-disp-summ">{{dispObj['desc']}}</div>
          <d-area class="prac-disp-area" :areat="dispObj.areas" :size="1.1"></d-area>
        </div>
      </div>
    </template>
  </div>
</template>

<script type="module">
  
  import Icon from "../elem/Icon.vue"
  import Area from "../elem/Area.vue"

  let Desc = {
    
    components: { 'd-icon':Icon, 'd-area':Area },

    props: { pracObj:Object, from:String },

    data() { return { dispObj:null, iarea:1 } },

    watch: {
      pracObj() { this.onPrac(); } },
    
    methods: {

      onPrac: function() { }, // console.log( { pracObj:this.pracObj } );
      doPrac: function (pracKey) {
        let obj = { route:"Prac", pracKey:pracKey };
        this.nav().pub( obj ); },
      doDisp: function (dispKey) {
        let nav = this.nav();
        let obj = { route:"Disp", compObj:nav.compKey, inovKey:nav.inovKey, pracKey:this.pracObj.name, dispKey:dispKey };
        this.nav().pub( obj ); },
      style: function( ikwObj ) {
        return this.mix().styleObj(ikwObj); },
      tsSumm: function(summ) {
        return this.mix().isStr(summ) ? summ : "This is a test description"; }
    },
  }
  export default Desc;

</script>

<style lang="less">
  
  @import '../../pub/css/themes/theme.less';
  
  @descFS:@themeFS;
  
  .prac-desc-grid3x3() { display:grid; grid-template-columns:1fr 1fr 1fr; grid-template-rows:1fr 1fr 1fr;
    grid-template-areas: "nw north ne" "west cen east" "sw south se"; }

  .prac-desc-ddir( @dir ) { display:grid; grid-area:@dir; justify-self:stretch; align-self:stretch; border-radius:36px; }
  
  .prac-desc-pane { position:absolute; left:0; top:0; width:100%; height:100%; .prac-desc-grid3x3(); color:black;
    
    .prac-desc-cent { .prac-desc-ddir(cen);
                        position:relative; left:0;  top:0;    width:100%; height:100%;
      .prac-desc-icon { position:absolute; left:0;  top: 4%;  width:100%; height: 22%; }
      .prac-desc-summ { position:absolute; left:3%; top:26%;; width: 94%; height: 74%;text-align:left; font-size:1.5*@descFS; } }
    
    .west  { .prac-desc-ddir(west);  } .north { .prac-desc-ddir(north); }
    .east  { .prac-desc-ddir(east);  } .south { .prac-desc-ddir(south); }
  
    .prac-disp-desc   { position:relative; left:0;  top:0;   width:100%; height:100%; color:black;
      .prac-disp-icon { position:absolute; left:0;  top: 3%; width:100%; height: 18%; }
      .prac-disp-summ { position:absolute; left:3%; top:21%; width: 94%; height: 28%;
        text-align:left;font-size:1.35*@descFS; }
      .prac-disp-area { position:absolute; left:3%; top:49%; width: 94%; height: 51%; } }
  }
  
</style>