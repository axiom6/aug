
<template>
  <div class="btns-horz">
    <template v-for="btn in pages">
      <div                       class="block-horz">
        <button                 :class="classBtn(btn)" @click="pubBtn(btn)">
          <i    v-if="btn.icon" :class="classIco(btn)"></i>
          <img  v-if="btn.src"   class="image" :src="src(btn)" alt=""/>
          <span v-if="btn.title" class="title">{{btn.title}}</span>
        </button>
      </div>
    </template>
  </div>
</template>

<script type="module">

  export default {

    props: { comp:String, pages:Object, klass:String, init:String },

    data() { return { key:this.init } },

    methods: {
      pubBtn: function (btn) {
        this.key = btn.key;
        this.publish( this.comp, btn.key ); },
      classBtn: function (btn) {
        return this.key===btn.key ? 'btn' : 'btn'; },
      classIco: function (btn) {
        return 'icons ' + btn.icon },
      src: function (btn) {
        return '../../css/' + btn.src } },

    mounted: function () {}

  }

</script>

<style lang="less">
  
  .btns-horz  { position:absolute; left:0; top:0; width:100%; height:100%; background-color:black; }
  .btns-vert  { position:absolute; left:0; top:0; width:5%;   height:100%; background-color:black; }
  .block-horz { position:relative; top: 0; width: 10%; height:100%; display:inline-block; }
  .block-vert { position:relative; left:0; width:100%; height: 10%; display:block;        }

  .grid1x3() { display:grid; grid-template-columns:25% 25% 50%; grid-template-areas:"icons image label"; }

  .btn { .grid1x3(); justify-self:center; align-self:center;
    width:90%; height:60%; font-size:1em; font-family:Roboto, sans-serif;
    background:#3B5999; color:#000; cursor:pointer;
    border-radius:0.2em; border: solid black 1px; border-left:  solid #2E4476 1px;
    
  }
  
  .btn .icons { grid-area:icons; justify-self:center; align-self:center; } // font-family: "font-awesome" serif;
  .btn .image { grid-area:image; justify-self:center; align-self:center; .image-radius; height:100%; }
  .btn .label { grid-area:label; justify-self:center; align-self:center; text-align:left; }

  .image-radius { border-radius:0.1em; border:solid black 1px; }
//.btn::before { position:absolute; left:0.2em; content:" "; }
//.btn:active::before, .btn-active::before { content:"\2713"; }

</style>