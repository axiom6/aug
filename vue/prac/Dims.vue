
<template>
  <div>
    <div class="ddisp" @click="doClick(dispObj.name)">
      <i   :class="dispObj.icon"></i>
      <span class="dname">{{dispObj.name}}</span>
    </div>
    <div  :class="gridClass()">
      <template v-for="ddObj in dispObj.dims">
        <div   :class="ddObj.klass">
          <i   :class="ddObj.icon"></i>
          <span class="ddname">{{ddObj.name}}</span>
        </div>
      </template>
    </div>
  </div>
</template>

<script type="module">
  
  let Dims = {

    props: { dispObj:Object },

    methods: {
      doClick: function (key) {
        if( this.isDef(this.dispObj.column) ) {
          this.doPrac(key) }
        else {
          this.doDisp(key) } },
      gridClass: function() {
        console.log( 'Dims.gridClass', this.dispObj.column )
        return this.dispObj.column==="Innovate" ? 'dd-3x4' : 'dd-3x3'; },
      doDisp:  function (dispKey) {
        let obj = { route:"Disp", dispKey:dispKey }; // pracKey:this.pracObj.name,
        this.nav().pub( obj ); },
      doPrac: function (pracKey) {
        let obj = { route:"Prac", pracKey:pracKey };
        this.nav().pub( obj ); } },
  }

  export default Dims;

</script>

<style lang="less">
  
  @import '../../pub/css/themes/theme.less';

  .grid3x3() { display:grid; grid-template-columns:1fr 1fr 1fr; grid-template-rows:1fr 1fr 1fr;
    grid-template-areas: "li lk lw" "di dk dw" "si sk sw"; }

  .grid3x4() { display:grid; grid-template-columns:1fr 1fr 1fr 1fr; grid-template-rows:1fr 1fr 1fr;
    grid-template-areas: "li ld lk lw" "di dd dk dw" "si sd sk sw"; }

  .ddisp {   display:inline; justify-self:center; align-self:center; text-align:center; font-size:@theme-disp-size*3;
    i      { display:inline-block;  margin-right: 0.25rem; }
    .ddname { display:inline-block; } }

  .area( @area ) { display:inline; grid-area:@area; font-size:@theme-disp-size*1.1; text-align:left;
    i          { display:inline-block;  margin-right: 0.25rem; }
    .ddname    { display:inline-block; } }

  .dd-3x3 { .grid3x3(); margin-left:@theme-disp-size;
    .li { .area(li); }  .lk { .area(lk); }  .lw { .area(lw); }
    .di { .area(di); }  .dk { .area(dk); }  .dw { .area(dw); }
    .si { .area(si); }  .sk { .area(sk); }  .sw { .area(sw); } }
  
  .dd-3x4 { .grid3x4(); margin-left:@theme-disp-size;
    .li { .area(li); }  .ld { .area(ld); } .lk { .area(lk); }  .lw { .area(lw); }
    .di { .area(di); }  .dd { .area(dd); } .dk { .area(dk); }  .dw { .area(dw); }
    .si { .area(si); }  .sd { .area(sd); } .sk { .area(sk); }  .sw { .area(sw); } }

</style>