
<script type="module">

  import Choice  from './Choice.vue'
  import {inject, ref} from 'vue';

  let Drink = {

    extends:Choice,

    setup() {

      const nav  = inject( 'nav' );
      const name = 'Drink';
      const btns = {
        Black:  { title:'Black',  name:'Black',                   pos:[2, 5,96,13], hsv:[34,44,69],
          type:'choice', check:true, checked:ref(false), icon:"fas fa-mug-hot" },
        Sugar:   { title:'Sugar',   name:'Sugar',                 pos:[2,20,96,13], hsv:[34,44,69],
          type:'choice', check:true, checked:ref(false), icon:"fas fa-mug-hot" },
        Cream: { title:'Cream', name:'Cream',                     pos:[2,35,96,13], hsv:[34,44,69],
          type:'choice', check:true, checked:ref(false), icon:"fas fa-coffee" },
        CreamSugar:  { title:'Cream Sugar',  name:'CreamSugar',   pos:[2,50,96,13], hsv:[34,44,69],
          type:'choice', check:true, checked:ref(false), icon:"fas fa-coffee" },
        OwnWords:  { title:'Own Words',  name:'OwnWords',         pos:[2,65,96,13], hsv:[34,44,69],
          type:'choice', check:true, checked:ref(false), icon:"fas fa-coffee" },
        Alternative:  { title:'Alternative',  name:'Alternative', pos:[2,80,96,13], hsv:[34,44,69],
          type:'choice', check:true, checked:ref(false), icon:"fas fa-coffee" } };

      nav.refreshBtns( name, btns );

      return { name, btns }; }
  }

  export default Drink;

</script>