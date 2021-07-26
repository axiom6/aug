
import ChoiceObj from '../../../data/jitter/Choice.json'

class Choice

  constructor:( @stream, @nav ) ->

  choices:(key) ->
    ChoiceObj[key].choices

  choose:( obj ) ->
    choices = @choices(obj.compKey)
    console.log( "Choice.choose()", { compKey:obj.compKey, choices:choices, obj:obj })
    if obj.checked
      choices.push( obj.choice )
    else
      choices = choices.filter( (elem) -> elem isnt choice )
    return

  choosen:( name, choice ) ->
    @nav.inArray( choice, @choices(key) )

  choiceIndex:( name, choice ) ->
    @choices(key).indexOf(choice)

  init:( name, btns ) ->
    for own key, btn of btns
      btn.checked.value = @choosen( name, btn.name )
    return


export default  Choice
