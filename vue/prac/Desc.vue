
<template>
  <div     class="prac-desc-pane">
    <div   class="prac-desc-cent" @click="doPrac(pracObj.name)" :style="style(pracObj)">
      <div class="prac-desc-head"><d-icon :icon="pracObj.icon" :name="pracObj.name" :size="3.0" ></d-icon></div>
      <div class="prac-desc-summ">{{pracObj.desc}}</div>
    </div>
    <template v-for="dispObj in pracObj.disps">
      <div   :class="dispObj.dir" @click="doDisp(dispObj.name)" :style="style(dispObj)">
        <div      class="prac-desc-desc">
          <d-icon class="prac-desc-icon" :icon="dispObj.icon" :name="dispObj.name" :size="2.5" ></d-icon>
          <div    class="prac-desc-summ">{{dispObj.desc}}</div>
          <template v-for="areaObj in dispObj.areas">
            <d-icon :class="clArea" :icon="areaObj.icon" :name="areaObj.name" :summ="tsSumm(areaObj.desc)"
              :size="1.3"></d-icon>
          </template>
        </div>
      </div>
    </template>
  </div>
</template>

<script type="module">
  
  import Icon from "../elem/Icon.vue"

  let Desc = {
    
    components: { 'd-icon':Icon },

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

  .prac-desc-grid2x1() { display:grid;  grid-template-columns:1fr; grid-template-rows:20fr 80fr;
    grid-template-areas: "head" "summ"; }

  .ddir( @dir ) { display:grid; grid-area:@dir; justify-self:stretch; align-self:stretch; border-radius:36px; }
  
  .prac-desc-pane { position:absolute; left:0; top:0; right:0; bottom:0; .prac-desc-grid3x3(); color:black;
    
    .prac-desc-cent { .ddir(cen); .prac-desc-grid2x1();
      .prac-desc-head { grid-area:head; }
      .prac-desc-summ { grid-area:summ; display:grid; align-self:start;  justify-self:start; text-align:left;
        margin:0.5rem 0.5rem 0.5rem 0.5rem; font-size:1.6*@descFS; } }
    
    .west  { .ddir(west);  }
    .north { .ddir(north); }
    .east  { .ddir(east);  }
    .south { .ddir(south); }
  
    .grid5x1() { display:grid;  grid-template-columns:1fr; grid-template-rows:20fr 20fr 20fr 20fr 20fr;
      grid-template-areas: "iconq" "summq""area1" "area2" "area3"; }
  
    .prac-desc-desc { .grid5x1(); color:black;
      .prac-desc-iconp { grid-area:iconq; }
      .prac-desc-summp { grid-area:summq; margin-left:1.2em;font-size:1.5*@descFS; }
      .prac-desc-area1 { grid-area:area1; }
      .prac-desc-area2 { grid-area:area2; }
      .prac-desc-area3 { grid-area:area3; } }
  }
  
</style>