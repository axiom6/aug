
<template>
  <div     class="prac-desc-pane">
    <div   class="prac-desc-cent" @click="doPrac(pracObj.name)" :style="style(pracObj)">
      <d-icon :icon="pracObj.icon" :name="pracObj.name" :size="2.5"></d-icon>
      <div class="prac-desc-summ">{{pracObj['desc']}}</div>
    </div>
    <template v-for="dispObj in pracObj.disps">
      <div   :class="dispObj.dir" @click="doDisp(dispObj.name)" :style="style(dispObj)">
        <div      class="prac-desc-desc">
          <d-icon :icon="dispObj.icon" :name="dispObj.name" :size="2.0"></d-icon>
          <div    class="prac-desc-sumd">{{dispObj['desc']}}</div>
          <template v-for="areaObj in dispObj.areas">
            <d-item :class="clArea" :icon="areaObj.icon" :name="areaObj.name" :size="1.0"></d-item>
          </template>
        </div>
      </div>
    </template>
  </div>
</template>

<script type="module">
  
  import Icon from "../elem/Icon.vue"
  import Item from "../elem/Item.vue"

  let Desc = {
    
    components: { 'd-icon':Icon, 'd-item':Item },

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
        let obj = { route:"Disp", pracKey:this.pracObj.name, dispKey:dispKey };
        this.nav().pub( obj ); },
      style: function( ikwObj ) {
        return this.styleObj(ikwObj); },
      clArea: function() {
        //if( areaObj===false ) {}
        let  klass = 'prac-desc-area'+this.iarea;
        this.iarea = this.iarea === 3 ? 1 : this.iarea+1;
        return klass; },
      tsSumm: function(summ) {
        return this.isStr(summ) ? summ : "This is a test description"; }
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
      .prac-desc-summ { text-align:left; margin-left:1.2em; font-size:1.5*@descFS; } }
    
    .west  { .prac-desc-ddir(west);  } .north { .prac-desc-ddir(north); }
    .east  { .prac-desc-ddir(east);  } .south { .prac-desc-ddir(south); }
  
    .prac-desc-desc { color:black;
      .prac-desc-sumd  { text-align:left; margin-left:1.2em; font-size:1.5*@descFS; }
      .prac-desc-area1 { }
      .prac-desc-area2 { }
      .prac-desc-area3 { } }
  }
  
</style>