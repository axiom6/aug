
<template>
  <div>
    <div class="ddisp" @click="doClick(dispObj.name)">
      <i   :class="dispObj.icon"></i>
      <span class="dname">{{dispObj.name}}</span>
    </div>
    <div  class="dd-grid">
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
      doDisp:  function (dispKey) {
        let obj = { route:"Disp", dispKey:dispKey }; // pracKey:this.pracObj.name,
        this.nav.pub( obj ); },
      doPrac: function (pracKey) {
        let obj = { route:"Prac", pracKey:pracKey };
        this.nav.pub( obj ); } },
  }

  export default Dims;

</script>

<style lang="less">
  
  @import '../../pub/css/themes/theme.less';

  .grid3x3() { display:grid; grid-template-columns:1fr 1fr 1fr; grid-template-rows:1fr 1fr 1fr;
    grid-template-areas: "li lk lw" "di dk dw" "si sk sw"; }

  .ddisp {   display:inline; justify-self:center; align-self:center; text-align:center; font-size:@theme-disp-size*3;
    i     { display:inline-block;  margin-right: 0.25rem; }
    .dname { display:inline-block; } }

  .dd( @area ) { display:inline; grid-area:@area; font-size:@theme-disp-size*1; text-align:left;
    i          { display:inline-block;  margin-right: 0.25rem; }
    .ddname    { display:inline-block; } }
  
  .dd-grid { .grid3x3(); margin-left:@theme-disp-size;
    .li { .dd(li); }   .lk { .dd(lk); }  .lw { .dd(lw); }
    .di { .dd(di); }   .dk { .dd(dk); }  .dw { .dd(dw); }
    .si { .dd(si); }   .sk { .dd(sk); }  .sw { .dd(sw); } }

</style>