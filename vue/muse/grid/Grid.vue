

<template>
  <div      class="comp-grid-pane">
  </div>
</template>

<script type="module">



  let Grid = {

    props: { compObj:Object },

    name: 'Grid',

    components: { 'v-revo':Revo },

    setup() {

      const cols = [
        { prop:'practice', name:'Practice' },
        { prop:'interact', name:'Interact' },
        { prop:'guide',    name:'Guide'    },
        { prop:'convey',   name:'Convey'   },
        { prop:'produce',  name:'Produce'  } ];

      const rows = [
        { practice:'Team',    interact: 'Collab',    guide:'Expertise', convey:'Empower',   produce:'Activity'  },
        { practice:'Domain',  interact: 'Entitle',   guide:'Propose',   convey:'Empower',   produce:'Portfolio' },
        { practice:'Relate',  interact: 'Insight',   guide:'Mission',   convey:'Vision',    produce:'Relation'  },
        { practice:'Adapt',   interact: 'Feature',   guide:'Status',    convey:'Craft',     produce:'Module'    },
        { practice:'Tech',    interact: 'UX',        guide:'Service',   convey:'Database',  produce:'Cloud'     },
        { practice:'Benefit', interact: 'Interpret', guide:'Design',    convey:'Realize',   produce:'Review'    },
        { practice:'Change',  interact: 'Impact',    guide:'Test',      convey:'Leverage',  produce:'Deploy'    },
        { practice:'Deliver', interact: 'Support',   guide:'Network',   convey:'Ware',      produce:'Secure'    },
        { practice:'Govern',  interact: 'Advise',    guide:'Maturity',  convey:'Influence', produce:'Asset'     } ];

      return { cols, rows }; }

  }
  export default Grid;

</script>

<style lang="less">

  @import '../../../css/themes/theme.less';

  @gridFS:@themeFS;
  @summFS:1.4*@gridFS;

  .comp-grid-pane {   font-size:@gridFS; color:@theme-fore; border-radius:2.0*@gridFS; display:grid;
    background-color:@theme-gray; position:absolute; left:20%;  top: 0;  width: 80%; height:100%;

    .comp-grid-name { font-size:4*@gridFS; color:@theme-fore; justify-self:center; align-self:center; }

    revo-grid {  width:100%; }

   .tile { background-color:#fff; display:flex; margin:0 auto; padding:20px 0;
     box-shadow:0 0 14px 0 rgba(53,64,82,.05); border-radius:10px; overflow:hidden; }

   .arrow-down svg { opacity:1; width:10px; height:10px; }

   .tile.dark { background-color:#333; }

   .tile.large { width:500px; height:400px; }

  }


</style>