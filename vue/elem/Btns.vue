
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
        return this.btn===btn.key ? 'btn-active' : 'btn'; },
      classIco: function (btn) {
        return 'icons ' + btn.icon },
      src: function (btn) {
        return '../../css/' + btn.src } },

    mounted: function () {}

  }

</script>

<style lang="less">
  
  .btns-horz { position:absolute; left:0; top:0; width:100%; height:5%; background-color:black; }

  .btns-vert { position:absolute; left:0; top:0; width:5%; height:100%; background-color:black; }
  

  
  
  .btn-font{ font-family:Roboto, sans-serif;}

  @hue:330; @sat:40%; @lit:40%; @inc:12%;


  // Hue Saturation background palette in 5% lightness increments
  @back00:hsl(@hue,@sat,00%); @back05:hsl(@hue,@sat, 5%); @back10:hsl(@hue,@sat,10%); @back15:hsl(@hue,@sat,15%);
  @back20:hsl(@hue,@sat,20%); @back25:hsl(@hue,@sat,25%); @back30:hsl(@hue,@sat,30%); @back35:hsl(@hue,@sat,35%);
  @back40:hsl(@hue,@sat,40%); @back45:hsl(@hue,@sat,45%); @back50:hsl(@hue,@sat,50%); @back55:hsl(@hue,@sat,55%);
  @back60:hsl(@hue,@sat,60%); @back65:hsl(@hue,@sat,65%); @back70:hsl(@hue,@sat,70%); @back75:hsl(@hue,@sat,75%);
  @back80:hsl(@hue,@sat,80%); @back85:hsl(@hue,@sat,85%); @back90:hsl(@hue,@sat,90%); @back95:hsl(@hue,@sat,95%);

  @btn-top:    @back70; @btn-bot:    @back80; @btn-color:    black;
  @btn-hov-top:@back60; @btn-hov-bot:@back70; @btn-hov-color:black;
  @btn-bord:@back50;

  @btn-unit:1vmin;
  @btn-size:              @btn-unit*6;
  @btn-size-before:       @btn-unit*4;
  @btn-font-size:         @btn-unit*1.9;
  @btn-font-size-before:  @btn-font-size*0.7;
  @btn-line-height:       @btn-unit*4;
  @btn-pad:               @btn-unit*2;
  @btn-pad-two:           @btn-pad*2;
  @btn-pad-top:           @btn-pad*0.5;
  @btn-pad-bottom:        @btn-pad*0.5;
  @btn-margin-left:       @btn-unit*10;
  @btn-top-active:        @btn-unit*0.6;
  @btn-border-radius:     @btn-unit*1.7;
  @btn-border-radius-img: @btn-unit;
  @btn-border-thin:       @btn-unit*0.2;
  @btn-shadow:            @btn-unit;
  @btn-shadow-active:     @btn-shadow*0.2;

  .btn-font{ font-family:Roboto, sans-serif;}

  .block-horz { position:relative; top: 0; width: 10%; height:100%; display:inline-block; }
  .block-vert { position:relative; left:0; width:100%; height: 10%; display:block;        }

  .btn {
    transition: all 0s ease-out;
    .btn-font;
    font-size: @btn-font-size;
    color: #000;
    text-decoration: none;
    text-align: center;
    text-shadow: 0 -@btn-border-thin 0 rgba(0,0,0,0.4);
    padding-left:@btn-pad*1.5;
    padding-top:@btn-pad-top;
    padding-bottom:@btn-pad-bottom;
    cursor: pointer;
    border: solid black 1px;
    border-radius:@btn-border-radius;
    border-left:  solid @btn-border-thin #2E4476;
    background: #3B5999;
    box-shadow: @btn-unit @btn-unit 0 0 #2E4476;
    width: 100%;
    height: 90%;
    display: flex;  align-items:center;  justify-content:center;
  }

  .btn:active, .btn-active { top: @btn-top-active; left:@btn-top-active;
    box-shadow: @btn-shadow-active @btn-shadow-active 0 0 #2E4476; }

  .btn::before { position:absolute; left:@btn-pad; content: " "; }
  
  .btn:active::before, .btn--active::before {  content: "\2713"; }
  
  .image-radius { border-radius:@btn-border-radius-img; border:solid black 1px; }

  .btn .image { float:left; align-self:center; margin-right: @btn-pad; .image-radius; }
  .btn .icons { float:left; align-self:center; padding-right:@btn-pad; } // font-family: "font-awesome" serif;
  .btn .label { float:left; align-self:center; padding-right:@btn-pad; }

  .btn-tall::before { padding-top:@btn-pad; }
  

</style>