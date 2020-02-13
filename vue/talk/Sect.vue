

<template>
  <div      v-if="hasSect()"               class="sect-pane">
    <div    v-if="hasProp('icon')"    class="sect-icon"><i :class="sectObj.icon"></i></div>
    <div    v-if="hasProp('banner')"  class="sect-banner"  ><div>{{sectObj.banner}}</div></div>
    <div    v-if="hasProp('title')"   class="sect-title"   >{{sectObj.title}}</div>
    <div    v-if="hasProp('caption')" class="sect-caption" >{{sectObj.caption}}</div>
    <div    v-if="hasProp('img')"     class="sect-img"  v-html="htmlImg( sectObj.img )"></div>
    <div    v-if="hasProp('imgs')"    class="sect-imgs" v-html="htmlImgs(sectObj['imgs'])"></div>
    <div    v-if="hasProp('desc')"    class="sect-desc"  >{{sectObj.desc}}</div>
 <!--t-prac v-if="isType('Prac')"    class="sect-prac" :sectObj="sectObj" :pracObj="dataObj"></t-prac-->
 <!--t-disp v-if="isType('Disp')"    class="sect-disp" :sectObj="sectObj" :dispObj="dataObj"></t-disp-->
    <div    v-if="hasProp('author')" class="sect-author" >{{sectObj.author}}</div>
  </div>
</template>
    
    <script type="module">
    
      import Prac from './Prac.vue';
      import Disp from './Disp.vue';
    
      let Sect = {
    
        components:{ 't-prac':Prac, 't-disp':Disp },
        
        props: { sectObj:Object, dataObj:Object, imgsObj:Object },
    
        data() { return { imgsIdx:0 } },
    
        methods: {
    
          isType: function(type) {
            return type===this.sectObj.type; },
          
          htmlImg: function(src) {
            return `<img src="${src}" alt="x"/>`; },

          htmlImgs: function(imgs) {
            let pics = this.imgsObj[imgs]['pics'];
            let idx  = this.sectObj.imgsIdx;
            let num  = pics.length;
            this.mix().nav().imgsNum = num;
            let src = "../../data/imgs/" + this.imgsObj[imgs]['dir'] + pics[idx].src;
            console.log( 'sect.htmlImgs', { pics:pics, pic:pics[idx], src:src, idx:idx, num:num, sectObj:this.sectObj } );
            return `<img src="${src}" alt="x"/>`; },

          hasSect: function() {
            return this.mix().isDef(this.sectObj); },
          
          hasProp: function(prop) {
            return this.mix().isDef(this.sectObj[prop]) }, // || this.isDef(this.dataObj[prop]); },
          
        }
      }
    
      export default Sect;
    
    </script>
    
    <style lang="less">
      
      @import '../../pub/css/themes/theme.less';
      
      @sectFS:2.0*@themeFS;  //  border-radius:0.5*@sectFS;
      
      .sect-pane   { position:absolute; left:0; top:0; width:100%; height:100%;
        background-color:@theme-back; font-size:@sectFS;
        .sect-icon   { position:absolute; left:0;   top:0;   width: 10%; height:10%; font-size:5.0*@sectFS;
          i { .themeCenterItems(); } }
        .sect-banner { position:absolute; left:35%; top:40%; width: 40%; height:20%; font-size:5.0*@sectFS;
          div { .themeCenterItems(); } }
        .sect-title  { position:absolute; left:0;   top:10%; width:100%; height:10%; font-size:3.0*@sectFS;
          div { .themeCenterItems(); } }
        .sect-caption  { position:absolute; left:0; top:0;   width:100%; height:10%; font-size:1.5*@sectFS;
          div { .themeCenterItems(); } }
        .sect-img    { position:absolute; left:10%; top:10%; width: 80%; height:80%; font-size:1.0*@sectFS;
          img { width:100%; height:100%; } }
        .sect-imgs   { position:absolute; left:10%; top:10%; width: 80%; height:80%; font-size:1.0*@sectFS;
          img { width:100%; height:100%; } }
        .sect-desc   { position:absolute; left:0;   top:20%; width:100%; height:80%; font-size:1.0*@sectFS;
          div { .themeCenterItems(); } }
        .sect-prac   { position:absolute; left:10%; top:10%; width: 80%; height:80%; font-size:1.0*@sectFS;  }
        .sect-disp   { position:absolute; left:10%; top:10%; width: 80%; height:80%; font-size:1.0*@sectFS;  }
        .sect-author { position:absolute; left:70%; top:95%; width: 30%; height: 5%; font-size:1.0*@sectFS;
          div { .themeCenterItems(); } }
      }
    
    </style>
