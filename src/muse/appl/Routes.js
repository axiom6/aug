import Home from '../../../vue/muse/appl/Muse.vue';

let routes = [
  { "path":"/", "name":"Home", "components":{   "Home":Home} },
  { "path":"/Principles", "name":"Prin", "components":{ "Principles":Home.Prin }, "children":[
    { "path":"Embrace",   "name":"Prac", "components":{ "Embrace":   Home.Prac } },
    { "path":"Innovate",  "name":"Prac", "components":{ "Innovate":  Home.Prac } },
    { "path":"Encourage", "name":"Prac", "components":{ "Encourage": Home.Prac } } ] },
  { "path":"/Information", "name":"Comp", "components":{ "Information":Home.Comp }, "children":[
      { "path":"Team",    "name":"Prac", "components":{ "Team":   Home.Prac} },
      { "path":"Domain",  "name":"Prac", "components":{ "Domain": Home.Prac } },
      { "path":"Relate",  "name":"Prac", "components":{ "Relate": Home.Prac } },
      { "path":"Adapt",   "name":"Prac", "components":{ "Adapt":  Home.Prac } },
      { "path":"Tech",    "name":"Prac", "components":{ "Tech":   Home.Prac } },
      { "path":"Benefit", "name":"Prac", "components":{ "Benefit":Home.Prac } },
      { "path":"Change",  "name":"Prac", "components":{ "Change": Home.Prac } },
      { "path":"Deliver", "name":"Prac", "components":{ "Deliver":Home.Prac } },
      { "path":"Govern",  "name":"Prac", "components":{ "Govern": Home.Prac } } ] },
  { "path":"/Knowledge", "name":"Comp", "components":{   "Knowledge":Home.Comp }, "children":[
      { "path":"Involve",    "name":"Prac", "components":{ "Involve":   Home.Prac } },
      { "path":"Discover",   "name":"Prac", "components":{ "Discover":  Home.Prac } },
      { "path":"Understand", "name":"Prac", "components":{ "Understand":Home.Prac } },
      { "path":"Conduct",    "name":"Prac", "components":{ "Conduct":   Home.Prac } },
      { "path":"Cognition",  "name":"Prac", "components":{ "Cognition": Home.Prac } },
      { "path":"Reason",     "name":"Prac", "components":{ "Reason":    Home.Prac } },
      { "path":"Evolve",     "name":"Prac", "components":{ "Evolve":    Home.Prac } },
      { "path":"Educate",    "name":"Prac", "components":{ "Educate":   Home.Prac } },
      { "path":"Culture",    "name":"Prac", "components":{ "Culture":   Home.Prac } } ] },
  { "path":"/Wisdom", "name":"Comp", "components":{   "Wisdom":Home.Comp }, "children":[
      { "path":"Trust",     "name":"Prac", "components":{ "Trust":    Home.Prac } },
      { "path":"Nature",    "name":"Prac", "components":{ "Nature":   Home.Prac } },
      { "path":"Truth",     "name":"Prac", "components":{ "Truth":    Home.Prac } },
      { "path":"Aware",     "name":"Prac", "components":{ "Aware":    Home.Prac } },
      { "path":"Create",    "name":"Prac", "components":{ "Create":   Home.Prac } },
      { "path":"Mind",      "name":"Prac", "components":{ "Mind":     Home.Prac } },
      { "path":"Emerge",    "name":"Prac", "components":{ "Emerge":   Home.Prac } },
      { "path":"Inspire",   "name":"Prac", "components":{ "Inspire":  Home.Prac } },
      { "path":"Actualize", "name":"Prac", "components":{ "Actualize":Home.Prac } } ] },
  { "path":"/Cube", "name":"Cube", "components":{ "Cube":Home.Cube } } ]

export default routes;