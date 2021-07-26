
<script type="module">

  import Choice    from './Choice.vue'
  import BlondImg  from '../../../css/roast/1.png';
  import LightImg  from '../../../css/roast/2.png';
  import CityImg   from '../../../css/roast/3.png';
  import FullImg   from '../../../css/roast/4.png';
  import MediumImg from '../../../css/roast/5.png';
  import ViennaImg from '../../../css/roast/6.png';
  import DarkImg   from '../../../css/roast/7.png';
  import FrenchImg from '../../../css/roast/8.png';
  import BlackImg  from '../../../css/roast/9.png';
  import { ref, inject } from 'vue';

  let Roast = {

    extends:Choice,

    setup() {

      const choice = inject('choice')
      const name   = 'Roast';
      const btns = {
        Blonde:    { title:'Blonde', name:'Blonde',   pos:[7, 5,86,9], hsv:[34,44,69],
          type:'choice', check:true, checked:ref(false), img:BlondImg },
        Light:    { title:'Light',   name:'Light',    pos:[7,15,86,9], hsv:[34,44,69],
          type:'choice', check:true, checked:ref(false), img:LightImg },
        City:    { title:'City',     name:'City',     pos:[7,25,86,9], hsv:[34,44,69],
          type:'choice', check:true, checked:ref(false), img:CityImg },
        Full:   { title:'Full',      name:'Full',     pos:[7,35,86,9], hsv:[34,44,69],
          type:'choice', check:true, checked:ref(false), img:FullImg },
        Medium: { title:'Medium',    name:'Medium',   pos:[7,45,86,9], hsv:[34,44,69],
          type:'choice', check:true, checked:ref(false), img:MediumImg },
        Vienna:    { title:'Vienna', name:'Vienna',   pos:[7,55,86,9], hsv:[34,44,69],
          type:'choice', check:true, checked:ref(false), img:ViennaImg },
        Dark:   { title:'Dark',      name:'Dark',     pos:[7,65,86,9], hsv:[34,44,69],
          type:'choice', check:true, checked:ref(false), img:DarkImg },
        French: { title:'French',    name:'French',   pos:[7,75,86,9], hsv:[34,44,69],
          type:'choice', check:true, checked:ref(false), img:FrenchImg },
        Black:    { title:'Black',   name:'Black',    pos:[7,85,86,9], hsv:[34,44,69],
          type:'choice', check:true, checked:ref(false), img:BlackImg } };

      choice.refreshBtns( name, btns );

      return { name, btns }; }
  }

  export default Roast;

</script>