var MuseLD;

import Util from '../../base/util/Util.js';

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
  constructor() {
    this.site = "http://example.com/";
    this.jsonLD = this.toJsonLD(this.site);
    this.jsonLDStr = JSON.stringify(this.jsonLD);
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
    console.log('MuseLD.toJsonLD()', jsonLD);
    return jsonLD;
  }

  isChild(key) {
    return Util.isChild(key);
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

};

export default MuseLD;
