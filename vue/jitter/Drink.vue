
<script type="module">

  import Choice from './Choice.vue'

  let Drink = {

    extends:Choice,

    data() { return { name:'Drink', btns:{
        Black:  { title:'Black',  name:'Black',                   pos:[2, 5,96,13], hsv:[34,44,69],
          check:true, checked:false, icon:"fas fa-mug-hot" },
        Sugar:   { title:'Sugar',   name:'Sugar',                 pos:[2,20,96,13], hsv:[34,44,69],
          check:true, checked:false, icon:"fas fa-mug-hot" },
        Cream: { title:'Cream', name:'Cream',                     pos:[2,35,96,13], hsv:[34,44,69],
          check:true, checked:false, icon:"fas fa-coffee" },
        CreamSugar:  { title:'Cream Sugar',  name:'CreamSugar',   pos:[2,50,96,13], hsv:[34,44,69],
          check:true, checked:false, icon:"fas fa-coffee" },
        OwnWords:  { title:'Own Words',  name:'OwnWords',         pos:[2,65,96,13], hsv:[34,44,69],
          check:true, checked:false, icon:"fas fa-coffee" },
        Alternative:  { title:'Alternative',  name:'Alternative', pos:[2,80,96,13], hsv:[34,44,69],
          check:true, checked:false, icon:"fas fa-coffee" }
      } } }

  }

  export default Drink;

</script>