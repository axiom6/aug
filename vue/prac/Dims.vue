
<template>
  <div  :class="dispClass()" :style="style(dispObj)">
    <div   class="dims-head" @click="doClick(dispObj.name)">
      <div class="dims-title">
        <i   :class="dispObj.icon"></i>
        <span class="dims-name">{{dispObj.name}}</span>
      </div>
    </div>
    <div  :class="gridClass()">
      <template v-for="ddObj in dispObj.dims">
        <div   :class="ddObj.klass">
          <i   :class="ddObj.icon"></i>
          <span class="dims-name">{{ddObj.name}}</span>
        </div>
      </template>
    </div>
  </div>
</template>

<script type="module">
  
  let Dims = {

    props: { dispObj:Object, from:String },

    methods: {
      doClick: function (key) {
        if( this.isDef(this.dispObj.column) ) { this.doPrac(key) }
        else                                  { this.doDisp(key) } },
      gridClass: function() {
        return this.dispObj.column==="Innovate" ? 'dd-4x4' : 'dd-4x3'; },
      doDisp:  function (dispKey) {
        let obj = { route:"Disp", dispKey:dispKey }; // pracKey:this.pracObj.name,
        this.nav().pub( obj ); },
      doPrac: function (pracKey) {
        let obj = { route:"Prac", pracKey:pracKey };
        this.nav().pub( obj ); },
      dispClass: function() {
        return this.from==='Disp' ? 'dims-disp' : 'dims-dirs';
      },
      style: function( ikwObj ) {
        let fontSize = this.from==='Disp' ? 2.0 : 1.0;
        return this.styleObj(ikwObj,fontSize); } },
  }

  export default Dims;

</script>

<style lang="less">
  
  @import '../../pub/css/themes/theme.less';

  @dimsFS:1.3*@themeFS;

  .dims-grid4x3() { display:grid; grid-template-columns:1fr 1fr 1fr; grid-template-rows:1fr 1fr 1fr 1fr;
    grid-template-areas: "pi pk pw" "li lk lw" "di dk dw" "si sk sw"; }

  .dims-grid4x4() { display:grid; grid-template-columns:1fr 1fr 1fr 1fr; grid-template-rows:1fr 1fr 1fr 1fr;
    grid-template-areas: "pi pd pk pw" "li ld lk lw" "di dd dk dw" "si sd sk sw"; }
  
  .dims-disp { font-size:2.0*@dimsFS; border-radius:0.5*@dimsFS;
    position:absolute; left:0; top:@theme-tabs-height; right:0; bottom:0; }

  .dims-dirs { font-size:@dimsFS; border-radius:36px; }

  .dims-head    { display:grid; justify-self:center; align-self:center; text-align:center; font-size:2.3*@dimsFS;
    .dims-title { display:inline;
    i           { display:inline-block;  margin-right:0.25*@dimsFS; }
    .dims-name  { display:inline-block; } } }

  .plane( @area ) { display:inline; grid-area:@area; font-size:1.2*@dimsFS; text-align:left;
    i             { display:inline-block;  margin-right: 0.25rem; }
    .dims-name    { display:inline-block; } }

  .study( @area ) { display:inline; grid-area:@area; font-size:0.9*@dimsFS; text-align:left;
    i             { display:inline-block;  margin-right:0.25*@dimsFS; }
    .dims-name    { display:inline-block; } }

  .dd-4x3 { .dims-grid4x3(); margin-left:@dimsFS;
    .pi { .plane(pi); }  .pk { .plane(pk); }  .pw { .plane(pw); }
    .li { .study(li); }  .lk { .study(lk); }  .lw { .study(lw); }
    .di { .study(di); }  .dk { .study(dk); }  .dw { .study(dw); }
    .si { .study(si); }  .sk { .study(sk); }  .sw { .study(sw); } }
  
  .dd-4x4 { .dims-grid4x4(); margin-left:@dimsFS;
    .pi { .plane(pi); }  .pd { .plane(pd); } .pk { .plane(pk); }  .pw { .plane(pw); }
    .li { .study(li); }  .ld { .study(ld); } .lk { .study(lk); }  .lw { .study(lw); }
    .di { .study(di); }  .dd { .study(dd); } .dk { .study(dk); }  .dw { .study(dw); }
    .si { .study(si); }  .sd { .study(sd); } .sk { .study(sk); }  .sw { .study(sw); } }

</style>