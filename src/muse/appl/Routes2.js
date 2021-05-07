
import Home from '../../../vue/muse/appl/Muse.vue';

let routes =[
  {
    "path": "/",
    "name": "Home",
    "components": {
      "Home": Home
    }
  },
  {
    "path": "/Principles",
    "name": "Principles",
    "components": {
      "Principles": Home.Prin
    },
    "children": [
      {
        "path": "Embrace",
        "name": "Embrace",
        "components": {
          "Embrace": Home.Prac
        }
      },
      {
        "path": "Innovate",
        "name": "Innovate",
        "components": {
          "Innovate": Home.Prac
        }
      },
      {
        "path": "Encourage",
        "name": "Encourage",
        "components": {
          "Encourage": Home.Prac
        }
      }
    ]
  },
  {
    "path": "Embrace",
    "name": "Embrace",
    "components": {
      "Embrace": Home.Prac
    }
  },
  {
    "path": "Innovate",
    "name": "Innovate",
    "components": {
      "Innovate": Home.Prac
    }
  },
  {
    "path": "Encourage",
    "name": "Encourage",
    "components": {
      "Encourage": Home.Prac
    }
  },
  {
    "path": "/Information",
    "name": "Information",
    "components": {
      "Information": Home.Comp
    },
    "children": [
      {
        "path": "Team",
        "name": "Team",
        "components": {
          "Team": Home.Prac
        }
      },
      {
        "path": "Domain",
        "name": "Domain",
        "components": {
          "Domain": Home.Prac
        }
      },
      {
        "path": "Relate",
        "name": "Relate",
        "components": {
          "Relate": Home.Prac
        }
      },
      {
        "path": "Adapt",
        "name": "Adapt",
        "components": {
          "Adapt": Home.Prac
        }
      },
      {
        "path": "Tech",
        "name": "Tech",
        "components": {
          "Tech": Home.Prac
        }
      },
      {
        "path": "Benefit",
        "name": "Benefit",
        "components": {
          "Benefit": Home.Prac
        }
      },
      {
        "path": "Change",
        "name": "Change",
        "components": {
          "Change": Home.Prac
        }
      },
      {
        "path": "Deliver",
        "name": "Deliver",
        "components": {
          "Deliver": Home.Prac
        }
      },
      {
        "path": "Govern",
        "name": "Govern",
        "components": {
          "Govern": Home.Prac
        }
      }
    ]
  },
  {
    "path": "Team",
    "name": "Team",
    "components": {
      "Team": Home.Prac
    }
  },
  {
    "path": "Domain",
    "name": "Domain",
    "components": {
      "Domain": Home.Prac
    }
  },
  {
    "path": "Relate",
    "name": "Relate",
    "components": {
      "Relate": Home.Prac
    }
  },
  {
    "path": "Adapt",
    "name": "Adapt",
    "components": {
      "Adapt": Home.Prac
    }
  },
  {
    "path": "Tech",
    "name": "Tech",
    "components": {
      "Tech": Home.Prac
    }
  },
  {
    "path": "Benefit",
    "name": "Benefit",
    "components": {
      "Benefit": Home.Prac
    }
  },
  {
    "path": "Change",
    "name": "Change",
    "components": {
      "Change": Home.Prac
    }
  },
  {
    "path": "Deliver",
    "name": "Deliver",
    "components": {
      "Deliver": Home.Prac
    }
  },
  {
    "path": "Govern",
    "name": "Govern",
    "components": {
      "Govern": Home.Prac
    }
  },
  {
    "path": "/Knowledge",
    "name": "Knowledge",
    "components": {
      "Knowledge": Home.Comp
    },
    "children": [
      {
        "path": "Involve",
        "name": "Involve",
        "components": {
          "Involve": Home.Prac
        }
      },
      {
        "path": "Discover",
        "name": "Discover",
        "components": {
          "Discover": Home.Prac
        }
      },
      {
        "path": "Understand",
        "name": "Understand",
        "components": {
          "Understand": Home.Prac
        }
      },
      {
        "path": "Conduct",
        "name": "Conduct",
        "components": {
          "Conduct": Home.Prac
        }
      },
      {
        "path": "Cognition",
        "name": "Cognition",
        "components": {
          "Cognition": Home.Prac
        }
      },
      {
        "path": "Reason",
        "name": "Reason",
        "components": {
          "Reason": Home.Prac
        }
      },
      {
        "path": "Evolve",
        "name": "Evolve",
        "components": {
          "Evolve": Home.Prac
        }
      },
      {
        "path": "Educate",
        "name": "Educate",
        "components": {
          "Educate": Home.Prac
        }
      },
      {
        "path": "Culture",
        "name": "Culture",
        "components": {
          "Culture": Home.Prac
        }
      }
    ]
  },
  {
    "path": "Involve",
    "name": "Involve",
    "components": {
      "Involve": Home.Prac
    }
  },
  {
    "path": "Discover",
    "name": "Discover",
    "components": {
      "Discover": Home.Prac
    }
  },
  {
    "path": "Understand",
    "name": "Understand",
    "components": {
      "Understand": Home.Prac
    }
  },
  {
    "path": "Conduct",
    "name": "Conduct",
    "components": {
      "Conduct": Home.Prac
    }
  },
  {
    "path": "Cognition",
    "name": "Cognition",
    "components": {
      "Cognition": Home.Prac
    }
  },
  {
    "path": "Reason",
    "name": "Reason",
    "components": {
      "Reason": Home.Prac
    }
  },
  {
    "path": "Evolve",
    "name": "Evolve",
    "components": {
      "Evolve": Home.Prac
    }
  },
  {
    "path": "Educate",
    "name": "Educate",
    "components": {
      "Educate": Home.Prac
    }
  },
  {
    "path": "Culture",
    "name": "Culture",
    "components": {
      "Culture": Home.Prac
    }
  },
  {
    "path": "/Wisdom",
    "name": "Wisdom",
    "components": {
      "Wisdom": Home.Comp
    },
    "children": [
      {
        "path": "Trust",
        "name": "Trust",
        "components": {
          "Trust": Home.Prac
        }
      },
      {
        "path": "Nature",
        "name": "Nature",
        "components": {
          "Nature": Home.Prac
        }
      },
      {
        "path": "Truth",
        "name": "Truth",
        "components": {
          "Truth": Home.Prac
        }
      },
      {
        "path": "Aware",
        "name": "Aware",
        "components": {
          "Aware": Home.Prac
        }
      },
      {
        "path": "Create",
        "name": "Create",
        "components": {
          "Create": Home.Prac
        }
      },
      {
        "path": "Mind",
        "name": "Mind",
        "components": {
          "Mind": Home.Prac
        }
      },
      {
        "path": "Emerge",
        "name": "Emerge",
        "components": {
          "Emerge": Home.Prac
        }
      },
      {
        "path": "Inspire",
        "name": "Inspire",
        "components": {
          "Inspire": Home.Prac
        }
      },
      {
        "path": "Actualize",
        "name": "Actualize",
        "components": {
          "Actualize": Home.Prac
        }
      }
    ]
  },
  {
    "path": "Trust",
    "name": "Trust",
    "components": {
      "Trust": Home.Prac
    }
  },
  {
    "path": "Nature",
    "name": "Nature",
    "components": {
      "Nature": Home.Prac
    }
  },
  {
    "path": "Truth",
    "name": "Truth",
    "components": {
      "Truth": Home.Prac
    }
  },
  {
    "path": "Aware",
    "name": "Aware",
    "components": {
      "Aware": Home.Prac
    }
  },
  {
    "path": "Create",
    "name": "Create",
    "components": {
      "Create": Home.Prac
    }
  },
  {
    "path": "Mind",
    "name": "Mind",
    "components": {
      "Mind": Home.Prac
    }
  },
  {
    "path": "Emerge",
    "name": "Emerge",
    "components": {
      "Emerge": Home.Prac
    }
  },
  {
    "path": "Inspire",
    "name": "Inspire",
    "components": {
      "Inspire": Home.Prac
    }
  },
  {
    "path": "Actualize",
    "name": "Actualize",
    "components": {
      "Actualize": Home.Prac
    }
  },
  {
    "path": "/Cube",
    "name": "Cube",
    "components": {
      "Cube": Home.Cube
    }
  }
]

export default routes;