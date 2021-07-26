
<script type="module">
  
  import Choice  from './Choice.vue'
  import { ref, inject } from 'vue';

  let Body = {

    extends:Choice,

    setup() {

    const choice = inject( 'choice' );
    const name   = 'Body';
    const btns = {
      Thick:  { title:'Thick',  name:'Thick',  pos:[20, 5,60,14], hsv:[34,44,69],
        type:'choice', check:true, checked:ref(false), icon:"fas fa-mug-hot" },
      Full:   { title:'Full',   name:'Full',   pos:[20,24,60,14], hsv:[34,44,69],
        type:'choice', check:true, checked:ref(false), icon:"fas fa-mug-hot" },
      Creamy: { title:'Creamy', name:'Creamy', pos:[20,43,60,14], hsv:[34,44,69],
        type:'choice', check:true, checked:ref(false), icon:"fas fa-coffee" },
      Milky:  { title:'Milky',  name:'Milky',  pos:[20,62,60,14], hsv:[34,44,69],
        type:'choice', check:true, checked:ref(false), icon:"fas fa-coffee" },
      Silky:  { title:'Silky',  name:'Silky',  pos:[20,81,60,14], hsv:[34,44,69],
        type:'choice', check:true, checked:ref(false), icon:"fas fa-coffee" } };

      choice.refreshBtns( name, btns );

    return { name, btns }; }
    
  }

  export default Body;

</script>


