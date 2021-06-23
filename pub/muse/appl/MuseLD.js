var MuseLD;

import {
  tester
} from '../../../lib/pub/base/util/Util.js';

import Prin from '../../../data/muse/Prin.json';

import Rows from '../../../data/muse/Rows.json';

import Info from '../../../data/muse/Info.json';

import Know from '../../../data/muse/Know.json';

import Wise from '../../../data/muse/Wise.json';

//mport Soft from '../../../data/inno/Soft.json'
//mport Data from '../../../data/inno/Data.json'
//mport Scie from '../../../data/inno/Scie.json'
//mport Math from '../../../data/inno/Math.json'
MuseLD = class MuseLD {
  constructor(Home) {
    this.Home = Home;
    this.site = "http://example.com/";
    this.jsonLD = this.toJsonLD(this.site);
    this.jsonLDStr = JSON.stringify(this.jsonLD);
    this.children = [];
  }

  toJsonLD(site) {
    var jsonLD;
    jsonLD = {};
    jsonLD["@context"] = {
      "principles": `${site}principles`,
      "refinements": `${site}refinements`,
      "information": `${site}information`,
      "knowledge": `${site}knowledge`,
      "wisdom": `${site}wisdom`
    };
    jsonLD['principles'] = this.toPracticesLD(Prin, site);
    jsonLD['refinements'] = this.toPracticesLD(Rows, site);
    jsonLD['information'] = this.toPracticesLD(Info, site);
    jsonLD['knowledge'] = this.toPracticesLD(Know, site);
    jsonLD['wisdom'] = this.toPracticesLD(Wise, site);
    // console.log( 'MuseLD.toJsonLD()', jsonLD )
    return jsonLD;
  }

  isChild(key) {
    return tester.isChild(key);
  }

  toPracLD(pkey, prac, site) {
    var pracLD;
    pracLD = {};
    pracLD["@context"] = {
      '@type': `${site}`,
      "name": `${site}name`,
      "column": `${site}column`,
      "row": `${site}row`,
      "plane": `${site}plane`,
      "description": `${site}description`
    };
    pracLD['@type'] = 'Practice';
    pracLD.name = pkey;
    pracLD.column = prac.column;
    pracLD.row = prac.row;
    pracLD.plane = prac.plane;
    pracLD.description = prac.desc;
    return pracLD;
  }

  toDispLD(dkey, disp, site) {
    var dispLD;
    dispLD = {};
    dispLD["@context"] = {
      '@type': `${site}`,
      "name": `${site}name`,
      "description": `${site}description`
    };
    dispLD['@type'] = 'Discipline';
    dispLD.name = dkey;
    dispLD.description = disp.desc;
    return dispLD;
  }

  toPracticesLD(data, site) {
    var disp, dkey, pkey, prac, practices;
    practices = {};
    for (pkey in data) {
      prac = data[pkey];
      if (!(this.isChild(pkey))) {
        continue;
      }
      practices[pkey] = this.toPracLD(pkey, prac, site);
      practices[pkey].disciplines = {};
      for (dkey in prac) {
        disp = prac[dkey];
        if (this.isChild(dkey)) {
          practices[pkey].disciplines[dkey] = this.toDispLD(dkey, disp, site);
        }
      }
    }
    return practices;
  }

  static toJsonScript(jsonLD) {
    var html;
    html = `<script type="application/ld+json">`;
    html += JSON.stringify(jsonLD);
    html += `</script`;
    return html;
  }

  /*
    @AugmRoutes = [
      { path: '/',       name:'Home',   components:{ Home:   Home } },
      { path: '/math',   name:'Math',   components:{ Math:   Home.Math }, children: [
        { path:'ML',     name:'MathML', components:{ MathML: loader.load('MathND') } },
        { path:'EQ',     name:'MathEQ', components:{ MathEQ: loader.load('MathND') } } ] },
      { path: '/draw',   name:'Draw',   components:{ Draw:   loader.load('Draw') } },
      { path: '/hues',   name:'Hues',   components:{ Hues:   loader.load('Hues') } },
      { path: '/tool',   name:'Tool',   components:{ Tool:   Home.Tool }, children: [
        { path:'Gauges', name:'Gauges', components:{ Gauges: loader.load('Tools') } },
        { path:'Widget', name:'Widget', components:{ Widget: loader.load('Tools') } } ] },
      { path: '/cube',   name:'Cube',   components:{ Cube:   loader.load('Cube') } },
      { path: '/wood',   name:'Wood',   components:{ Wood:   loader.load('Wood') } } ]

    Muse.routes = [
      { path: '/',     name:'Home', components:{ Home: Home      } },
      { path: '/Prin', name:'Prin', components:{ Prin: Home.Prin } },
      { path: '/Comp', name:'Comp', components:{ Comp: Home.Comp } },
      { path: '/Prac', name:'Prac', components:{ Prac: Home.Prac } },
      { path: '/Disp', name:'Disp', components:{ Disp: Home.Disp } },
      { path: '/Cube', name:'Cube', components:{ Cube: Home.Cube } } ]
  */
  toRoutes() {
    var comp, compName, comps, i, len, pkey, prac, routes, vueComp;
    comps = [Prin, Info, Know, Wise];
    routes = [];
    routes.push(this.toPath('/', 'Home', 'Comp', 'Home'));
    for (i = 0, len = comps.length; i < len; i++) {
      comp = comps[i];
      compName = this.toCompName(comp);
      vueComp = compName === 'Principles' ? 'Home.Prin' : 'Home.Comp';
      routes.push(this.toPath('/' + compName, compName, 'Parent', vueComp));
      for (pkey in comp) {
        prac = comp[pkey];
        if (this.isChild(pkey)) {
          routes.push(this.toPath(pkey, pkey, 'Child', 'Home.Prac'));
        }
      }
    }
    routes.push(this.toPath('/Cube', 'Cube', 'Comp', 'Home.Cube'));
    return routes;
  }

  toPath(path, name, type, comp) {
    var route;
    if (type === 'Parent') {
      this.children = [];
    }
    route = {};
    route.path = path;
    route.name = name;
    switch (type) {
      case 'Comp':
        route.components = {
          [`${name}`]: comp
        };
        break;
      case 'Parent':
        route.components = {
          [`${name}`]: comp
        };
        route.children = this.children;
        break;
      case 'Child':
        route.components = {
          [`${name}`]: comp
        };
        this.children.push(route);
    }
    return route;
  }

  toCompName(comp) {
    if (comp === Prin) {
      return 'Principles';
    } else if (comp === Info) {
      return 'Information';
    } else if (comp === Know) {
      return 'Knowledge';
    } else if (comp === Wise) {
      return 'Wisdom';
    } else {
      return 'None';
    }
  }

};

export default MuseLD;

//# sourceMappingURL=MuseLD.js.map
