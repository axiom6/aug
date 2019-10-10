
<template>
  <div   class="desdp">
    <div class="cen" @click="doPrac(pracObj.name)" :style="style(pracObj)">
      <div class="deadp"><d-icon :icon="pracObj.icon" :name="pracObj.name" :size="3.0" ></d-icon></div>
      <div class="summp">{{pracObj.desc}}</div>
    </div>
    <template v-for="dispObj in pracObj.disps">
      <div   :class="dispObj.dir" @click="doDisp(dispObj.name)" :style="style(dispObj)">
        <div class="desp">
          <d-icon class="iconp" :icon="dispObj.icon" :name="dispObj.name" :size="2.5" ></d-icon>
          <div    class="summp">{{dispObj.desc}}</div>
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
        let  klass = 'areb'+this.iarea;
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
  
  .grid3x3() { display:grid; grid-template-columns:1fr 1fr 1fr; grid-template-rows:1fr 1fr 1fr;
    grid-template-areas: "nw north ne" "west cen east" "sw south se"; }

  .grid2x1() { display:grid;  grid-template-columns:1fr; grid-template-rows:20fr 80fr;
    grid-template-areas: "dead" "summ"; }

  .ddir( @dir ) { display:grid; grid-area:@dir; justify-self:stretch; align-self:stretch; border-radius:36px; }
  
  .desdp { position:absolute; left:0; top:0; right:0; bottom:0; .grid3x3(); color:black;
    
    .cen { .ddir(cen); .grid2x1();
      .deadp { grid-area:dead; }
      .summp { grid-area:summ; display:grid; align-self:start;  justify-self:start; text-align:left;
        margin:0.5rem 0.5rem 0.5rem 0.5rem; font-size:@theme-desc-size; } }
    
    .west  { .ddir(west);  }
    .north { .ddir(north); }
    .east  { .ddir(east);  }
    .south { .ddir(south); }
  
    .grid5x1() { display:grid;  grid-template-columns:1fr; grid-template-rows:20fr 20fr 20fr 20fr 20fr;
      grid-template-areas: "iconq" "summq""area1" "area2" "area3"; }
  
    .desp { .grid5x1(); color:black;
      .iconp { grid-area:iconq; }
      .summp { grid-area:summq; margin-left:@theme-disp-size;font-size:@theme-prac-area-size; }
      .areb1 { grid-area:area1; }
      .areb2 { grid-area:area2; }
      .areb3 { grid-area:area3; } }
  }
  
</style>