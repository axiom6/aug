
<script type="module">

  import Choice from './Choice.vue'

  import ColdBrewImg    from '../../../css/brew/ColdBrew.jpg';
  import PourOverImg    from '../../../css/brew/PourOver.jpg';  // ??? Unable to get into vite build. vite dev works
  import AutoDripImg    from '../../../css/brew/AutoDrip.jpg';
  import SyphonPotImg   from '../../../css/brew/SyphonPot.jpg';
  import FrenchPressImg from '../../../css/brew/FrenchPress.jpg';
  import ExpressoImg    from '../../../css/brew/Expresso.jpg';
  import {inject, ref} from 'vue';

  let Brew = {

    extends:Choice,

    setup() {

      const mix  = inject( 'mix' );
      const name = 'Brew';
      const btns = {
      ColdBrew:    { title:'Cold Brew',    name:'ColdBrew',    pos:[2, 5,96,13], hsv:[34,44,69],
        type:'choice', check:true, checked:ref(false), img:ColdBrewImg },
      PourOver:    { title:'Pour Over',    name:'PourOver',    pos:[2,20,96,13], hsv:[34,44,69],
        type:'choice', check:true, checked:ref(false), img:PourOverImg },
      AutoDrip:    { title:'Auto Drip',    name:'AutoDrip',    pos:[2,35,96,13], hsv:[34,44,69],
        type:'choice', check:true, checked:ref(false), img:AutoDripImg },
      SyphonPot:   { title:'Syphon Pot',   name:'SyphonPot',   pos:[2,50,96,13], hsv:[34,44,69],
        type:'choice', check:true, checked:ref(false), img:SyphonPotImg },
      FrenchPress: { title:'French Press', name:'FrenchPress', pos:[2,65,96,13], hsv:[34,44,69],
        type:'choice', check:true, checked:ref(false), img:FrenchPressImg },
      Expresso:    { title:'Expresso',     name:'Expresso',    pos:[2,80,96,13], hsv:[34,44,69],
        type:'choice', check:true, checked:ref(false), img:ExpressoImg }  };

      mix.refreshBtns( name, btns );

      return { name, btns }; }

  }

  export default Brew;

</script>