
<script type="module">

  import Choice from './Choice.vue'

  let Drink = {

    extends:Choice,

    data() { return { name:'Drink', btns:{
        Black:  { title:'Black',  name:'Black',                   pos:[20, 5,60,13], hsv:[34,44,69],
          check:true, checked:false, icon:"fas fa-mug-hot" },
        Sugar:   { title:'Sugar',   name:'Sugar',                 pos:[20,20,60,13], hsv:[34,44,69],
          check:true, checked:false, icon:"fas fa-mug-hot" },
        Cream: { title:'Cream', name:'Cream',                     pos:[20,35,60,13], hsv:[34,44,69],
          check:true, checked:false, icon:"fas fa-coffee" },
        CreamSugar:  { title:'Cream Sugar',  name:'CreamSugar',   pos:[20,50,60,13], hsv:[34,44,69],
          check:true, checked:false, icon:"fas fa-coffee" },
        OwnWords:  { title:'Own Words',  name:'OwnWords',         pos:[20,65,60,13], hsv:[34,44,69],
          check:true, checked:false, icon:"fas fa-coffee" },
        Alternative:  { title:'Alternative',  name:'Alternative', pos:[20,80,60,13], hsv:[34,44,69],
          check:true, checked:false, icon:"fas fa-coffee" }
      } } }

  }

  export default Drink;

</script>