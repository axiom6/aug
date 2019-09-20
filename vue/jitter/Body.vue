
<script type="module">
  
  import Choice from './Choice.vue'

  let Body = {

    extends:Choice,

    data() { return { name:'Body', btns:{
      Thick:  { title:'Thick',  name:'Thick',  pos:[20, 5,60,14], hsv:[34,44,69],
        check:true, checked:false, icon:"fas fa-mug-hot" },
      Full:   { title:'Full',   name:'Full',   pos:[20,24,60,14], hsv:[34,44,69],
        check:true, checked:false, icon:"fas fa-mug-hot" },
      Creamy: { title:'Creamy', name:'Creamy', pos:[20,43,60,14], hsv:[34,44,69],
        check:true, checked:false, icon:"fas fa-coffee" },
      Milky:  { title:'Milky',  name:'Milky',  pos:[20,62,60,14], hsv:[34,44,69],
        check:true, checked:false, icon:"fas fa-coffee" },
      Silky:  { title:'Silky',  name:'Silky',  pos:[20,81,60,14], hsv:[34,44,69],
        check:true, checked:false, icon:"fas fa-coffee" }
    } } }
    
  }

  export default Body;

</script>


