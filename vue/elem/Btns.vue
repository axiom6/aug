
<template>
  <div ref="Btns"                   class="btns">
    <template v-for="btn in btns">
      <div        :ref="btn.key"   :style="styleBlock(btn.pos)">
        <div                        class="btn-center">
          <div class="btn" :style="styleBtn(btn)" @click="pubBtn(btn)">
            <span v-if="btn.check" :class="classCheck(btn)"></span>
            <i    v-if="btn.icon"  :class="classIcons(btn)"></i>
            <img  v-if="btn.img"    class="image" :src="img(btn)" alt=""/>
            <span v-if="btn.title"  class="title" :ref="titleRef(btn)">{{btn.title}}</span>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script type="module">
  
  import Data from '../../pub/base/util/Data.js'

  export default {

    props: { comp:String, btns:Object, klass:String, init:String, back:String, active:String, choices:Array },

    data() { return { key:this.init, idx:-1,
      colors: { primary:'#007bff', secondary:'#6c757d', success:'#28a745', info:'#17a2b8',
                warning:'#ffc107', danger:   '#dc3545', light:  '#f8f9fa', dark:'#343a40' } } },

    methods: {
      pubBtn: function (btn) {
        this.idx = ++this.idx % this.choices.length;
        this.choices[this.idx] = btn.key;
        this.publish( this.comp, btn.key ); },
      aspect: function() {  // Only call in mounted
        let w = this.$refs['Btns']['clientWidth' ];
        let h = this.$refs['Btns']['clientHeight'];
        return h/w; },
      styleBlock: function(p) {
        let sy = 1.0
        let p2 = p[2]===0 ? p[3] : p[2];
        return { position:'absolute', left:sy*p[0]+'%', top:sy*p[1]+'%', width:sy*p2+'%', height:sy*p[3]+'%',
        fontSize:(p[3]*0.1)+'em' } },
      styleBtn: function (btn) {
        let back = this.colors[btn.back] ? this.colors[btn.back] : this.back;
        return this.key===btn.key ? { color:'black', backgroundColor:this.active }
                                  : { color:'black', backgroundColor:back }; },
      classCheck: function (btn) {
        let    checked = this.idx === -1 ? this.key === btn.key : this.choices.indexOf(btn.key) !== -1;
        return checked ? 'check far fa-check-square' : 'check far fa-square'; },
      classIcons: function (btn) {
        return 'icons ' + btn.icon },
      titleRef: function (btn) {
        return 'Title' + btn.key },
      img: function (btn) {
        return Data.cssDir + btn.img },
      adjustWidths: function() {
         let keys = Object.keys(this.btns)
         for( let key of keys ) {
           let btn = this.btns[key];
           if( btn.pos[2]===0 ) {
             let wt     = this.$refs[this.titleRef(btn)][0]['clientWidth']
             btn.elem   = this.$refs[btn.key][0]
             let wb     = btn.elem['clientWidth']
             btn.pos[2] = btn.pos[3]*2.4*wt/wb
             // console.log( 'Adj', { wt:wt, wb:wb, w:btn.pos[2], h:btn.pos[3] } ) }
             btn.elem.style.width = btn.pos[2]+'%' } }
      } },

    mounted: function () {
      this.asp = this.aspect();
      this.adjustWidths();
    }

  }

</script>

<style lang="less">
  
  @import '../../pub/css/themes/theme.less';
  
  .btns { font-size:@theme-btn-size; font-weight:bold; position:absolute; left:0; top:0; right:0; bottom:0; }
  
  .btn-center { display:grid;  width:100%; height:100%; } // A surrounding div for centering button

  .grid1x3() { display:grid; grid-template-columns:35fr 65fr; grid-template-areas:"icons label"; }

  .btn { .grid1x3(); justify-self:center; align-self:center;
    width:80%; height:80%; font-size:inherit; font-family:@theme-font-family;
    cursor:pointer; border-radius:16px; border: solid @theme-back 1px; }

  .btn .check { grid-area:icons; justify-self:center; align-self:center; }
  .btn .icons { grid-area:icons; justify-self:center; align-self:center; } // font-family: "font-awesome" serif;
  .btn .image { grid-area:icons; justify-self:center; align-self:center; .image-radius; max-height:1.0em; }
  .btn .title { grid-area:label; justify-self:left;   align-self:center; text-align:left; }

  .image-radius { border-radius:8px; border:solid @theme-back 1px; }


</style>