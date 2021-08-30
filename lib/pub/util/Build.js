var Build,
  hasProp = {}.hasOwnProperty;

import Util from '../util/Util.js';

import Access from '../util/Access.js';

Build = (function() {
  class Build {
    static create(data, type) {
      switch (type) {
        case 'Pack':
          return Build.createPacks(data);
        case 'Prac':
          return Build.createPracs(data);
        default:
          return data;
      }
    }

    static createPacks(data) {
      var key, pack;
      for (key in data) {
        pack = data[key];
        if (!(Util.isChild(key))) {
          continue;
        }
        if (pack['name'] == null) {
          pack['name'] = key;
        }
        Build.createPracs(pack);
      }
      return data;
    }

    static createPracs(data) {
      var base, bkey, ikey, item, pkey, pract, skey, study, tkey, topic;
      for (pkey in data) {
        pract = data[pkey];
        if (!(Util.isChild(pkey))) {
          continue;
        }
        if (pract['name'] == null) {
          pract['name'] = pkey;
        }
        for (skey in pract) {
          study = pract[skey];
          if (!(Util.isChild(skey))) {
            continue;
          }
          if (study['name'] == null) {
            study['name'] = skey;
          }
          for (tkey in study) {
            topic = study[tkey];
            if (!(Util.isChild(tkey))) {
              continue;
            }
            if (topic['name'] == null) {
              topic['name'] = tkey;
            }
            for (ikey in topic) {
              item = topic[ikey];
              if (!(Util.isChild(ikey))) {
                continue;
              }
              if (item['name'] == null) {
                item['name'] = ikey;
              }
              for (bkey in item) {
                base = item[bkey];
                if (Util.isChild(bkey)) {
                  if (base['name'] == null) {
                    base['name'] = bkey;
                  }
                }
              }
            }
          }
        }
      }
      return data;
    }

    static colPractices(batch) {
      var i, len, plane, prin, ref;
      prin = batch.Prin.data['Prin'];
      ref = Build.planes;
      for (i = 0, len = ref.length; i < len; i++) {
        plane = ref[i];
        batch[plane].data['Prin'] = prin;
      }
    }

    static rowPractices(batch) {
      var i, len, plane, ref, rows;
      rows = batch.Rows.data['Rows'];
      ref = Build.planes;
      for (i = 0, len = ref.length; i < len; i++) {
        plane = ref[i];
        batch[plane].data['Rows'] = rows;
      }
    }

    static copyAtt(src, des) {
      var key, obj;
      for (key in src) {
        if (!hasProp.call(src, key)) continue;
        obj = src[key];
        if (!Util.isChild(key)) {
          des[key] = obj;
        }
      }
      return des;
    }

    // for dir in [ 'west', 'north', 'east', 'south'   ]
    // Call after all practices and studies have been read in
    // Not used because we store studies with practices in /pract
    static expandStudys(groups, studies) {
      var gkey, group, pkey, pract, skey, study;
      for (gkey in groups) {
        group = groups[gkey];
        if (Util.isChild(gkey)) {
          for (pkey in group) {
            pract = group[pkey];
            if (Util.isChild(pkey)) {
              for (skey in pract) {
                study = pract[skey];
                if (Util.isChild(skey)) {
                  if (studies[skey] != null) {
                    pract[skey] = studies[skey];
                  }
                }
              }
            }
          }
        }
      }
    }

    // Call after all practices and topics have been read in
    static expandTopics(groups, topics, log = false) {
      var gkey, group, pkey, pract, skey, study, tkey, topic;
      for (gkey in groups) {
        group = groups[gkey];
        if (!(Util.isChild(gkey))) {
          continue;
        }
        if (log) {
          console.log(gkey);
        }
        for (pkey in group) {
          pract = group[pkey];
          if (!(Util.isChild(pkey))) {
            continue;
          }
          if (log) {
            console.log("  ", pkey);
          }
          for (skey in pract) {
            study = pract[skey];
            if (!(Util.isChild(skey))) {
              continue;
            }
            if (log) {
              console.log("    ", skey);
            }
            for (tkey in study) {
              topic = study[tkey];
              if (Util.isChild(tkey)) {
                if (topics[tkey] != null) {
                  if (log) {
                    console.log("      ", tkey, "match");
                  }
                  if (topics[tkey]['name'] == null) {
                    topics[tkey]['name'] = tkey;
                  }
                  study[tkey] = topics[tkey];
                } else {
                  if (log) {
                    console.log("      ", tkey);
                  }
                }
              }
            }
          }
        }
      }
    }

    // Build instance
    constructor(batch1, komps = null) {
      this.batch = batch1;
      this.komps = komps;
      this.none = 'none';
      this.debug = true;
    }

    getPlane(pracKey) {
      var i, len, pkey, plane, prac, pracs, ref;
      ref = Build.planes;
      for (i = 0, len = ref.length; i < len; i++) {
        plane = ref[i];
        pracs = this.batch[plane].data;
        for (pkey in pracs) {
          if (!hasProp.call(pracs, pkey)) continue;
          prac = pracs[pkey];
          if (Util.isChild(pkey)) {
            if (pracKey === pkey) {
              return plane;
            }
          }
        }
      }
      return 'none';
    }

    getSpecs(plane) {
      if (this.batch[plane] != null) {
        return this.batch[plane].data;
      } else {
        console.error(`Build.getSpecs() ${plane}.json has not been input`);
        return null;
      }
    }

    toGroups(groups) {
      var group, key;
      for (key in groups) {
        group = groups[key];
        group['key'] = key;
        group['name'] = group.name != null ? group.name : key;
        group['border'] = group['border'] != null ? group['border'] : '0';
      }
      return groups;
    }

    toStudies(prac) {
      var skey, studies, study;
      studies = {};
      for (skey in prac) {
        study = prac[skey];
        if (Util.isChild(skey)) {
          studies[skey] = study;
        }
      }
      return this.toOrder(studies);
    }

    toOrder(studies, dirs = ['north', 'west', 'east', 'south']) {
      var dir, i, len, ordered, skey, study;
      ordered = {};
      for (i = 0, len = dirs.length; i < len; i++) {
        dir = dirs[i];
        for (skey in studies) {
          study = studies[skey];
          if (study.dir === dir) {
            ordered[skey] = study;
          }
        }
      }
      return ordered;
    }

    combine() {
      var arg, i, key, len, obj, val;
      obj = {};
      for (i = 0, len = arguments.length; i < len; i++) {
        arg = arguments[i];
        for (key in arg) {
          if (!hasProp.call(arg, key)) continue;
          val = arg[key];
          obj[key] = val;
        }
      }
      return obj;
    }

    west(col) {
      switch (col) {
        case 'Embrace':
          return 'Encourage';
        case 'Innovate':
          return 'Embrace';
        case 'Encourage':
          return 'Innovate';
        default:
          console.error('Build.west() unknown col', col);
          return 'Embrace';
      }
    }

    east(col) {
      switch (col) {
        case 'Embrace':
          return 'Innovate';
        case 'Innovate':
          return 'Encourage';
        case 'Encourage':
          return 'Embrace';
        default:
          console.error('Build.east() unknown col', col);
          return 'Embrace';
      }
    }

    north(row) {
      switch (row) {
        case 'Dim':
          return 'Dim';
        case 'Learn':
          return 'Share';
        case 'Do':
          return 'Learn';
        case 'Share':
          return 'Do';
        default:
          console.error('Build.north() unknown row', row);
          return 'Learn';
      }
    }

    south(row) {
      switch (row) {
        case 'Dim':
          return 'Dim';
        case 'Learn':
          return 'Do';
        case 'Do':
          return 'Share';
        case 'Share':
          return 'Learn';
        default:
          console.error('Build.south() unknown row', row);
          return 'Learn';
      }
    }

    prev(plane) {
      switch (plane) {
        case 'Info':
          return 'Wise';
        case 'Know':
          return 'Info';
        case 'Wise':
          return 'Know';
        default:
          console.error('Build.prev() unknown plane', plane);
          return 'none';
      }
    }

    next(plane) {
      switch (plane) {
        case 'Info':
          return 'Know';
        case 'Know':
          return 'Wise';
        case 'Wise':
          return 'Info';
        default:
          console.error('Build.next() unknown plane', plane);
          return 'none';
      }
    }

    adjacentPractice(prac, dir) {
      var adj, col, key, pln, pracs, row;
      if ((prac == null) || (prac.name == null) || prac.name === 'none' || (prac.column == null)) {
        // console.log( 'Build.adjacentPractice', { prac:prac, dir:dir } )
        return this.none;
      }
      col = "";
      row = "";
      pln = "";
      [col, row, pln] = (function() {
        switch (dir) {
          case 'west':
          case 'nw':
          case 'sw':
            return [this.west(prac.column), prac.row, prac.plane];
          case 'east':
          case 'sw':
          case 'se':
            return [this.east(prac.column), prac.row, prac.plane];
          case 'north':
            return [prac.column, this.north(prac.row), prac.plane];
          case 'south':
            return [prac.column, this.south(prac.row), prac.plane];
          case 'prev':
            return [prac.column, prac.row, this.prev(prac.plane)];
          case 'next':
            return [prac.column, prac.row, this.next(prac.plane)];
          default:
            return ["none", "none", "none"];
        }
      }).call(this);
      if ([col, row, pln] === ["none", "none", "none"]) {
        return this.none;
      }
      pracs = {};
      if (this.batch[pln] != null) {
        pracs = this.batch[pln].data.pracs;
      } else {
        // console.log( 'Build.adjacentPractice()', { plane:pln, pracs:pracs } )
        console.error('Build.adjacentPractice() batch[] not found', [col, row, pln]);
        return this.none;
      }
      for (key in pracs) {
        if (!hasProp.call(pracs, key)) continue;
        adj = pracs[key];
        if (Util.isChild(key)) {
          if (adj.column === col && adj.row === row && adj.plane === pln) {
            // console.log( 'adjacentPractice[col,row,pln]', [col,row,pln], adj )
            return adj;
          }
        }
      }
      console.log('Build.adjacentPractice[col,row,pln]', [col, row, pln], 'adj not found');
      return this.none;
    }

    adjacentStudies(practice, dir) {
      var adjPrac;
      adjPrac = this.adjacentPractice(practice, dir);
      if (adjPrac.name !== 'none') {
        return this.toStudies(adjPrac);
      } else {
        return {};
      }
    }

    connectName(practice, dir, reverse) {
      var adjacent;
      adjacent = this.adjacentPractice(practice, dir);
      if (adjacent.name !== 'none') {
        return this.centerBegEnd(practice.name, adjacent.name, reverse);
      } else {
        return 'none' + '\n' + 'none';
      }
    }

    centerBegEnd(beg, end, reverse) {
      var b, e;
      b = end.length > beg.length ? Util.indent((end.length - beg.length) / 2) + beg : beg;
      e = beg.length > end.length ? Util.indent((beg.length - end.length) / 2) + end : end;
      // console.log( 'Build.centerBegEnd()', { beg:beg, end:end, blen:beg.length, elen:end.length, b:b, e:e,be:b+'\n'+e })
      if (!reverse) {
        return b + '\n' + e;
      } else {
        return e + '\n' + b;
      }
    }

    setAdjacents(practice) {
      practice.west = this.adjacentPractice(practice, 'west');
      practice.east = this.adjacentPractice(practice, 'east');
      practice.north = this.adjacentPractice(practice, 'north');
      practice.south = this.adjacentPractice(practice, 'south');
      practice.prev = this.adjacentPractice(practice, 'prev');
      practice.next = this.adjacentPractice(practice, 'next');
    }

    getPractices(plane) {
      if ((this.batch[plane] != null) && (this.batch[plane].data != null)) {
        return this.batch[plane].data;
      } else {
        console.error('Build.getPractices()', plane);
        return {};
      }
    }

    getPractice(row, column, plane) {
      var pkey, prac, practices;
      practices = this.getPractices(plane);
      for (pkey in practices) {
        if (!hasProp.call(practices, pkey)) continue;
        prac = practices[pkey];
        if (Util.isChild(pkey) && prac.column === column && prac.row === row) {
          return prac;
        }
      }
      console.error('Prac.getPractice() practice not found for', {
        column: column,
        row: row,
        plane: plane
      });
      return null; // Landmine
    }

    getPracticeStudy(row, column, plane, dir) {
      var practice, study;
      practice = this.getPractice(row, column, plane);
      study = this.getDir(practice, dir);
      return study;
    }

    getDir(practice, dir) {
      var skey, study;
      for (skey in practice) {
        if (!hasProp.call(practice, skey)) continue;
        study = practice[skey];
        if (Util.isChild(skey)) {
          if (study.dir === dir) {
            return study;
          }
        }
      }
      return null;
    }

    getDisps(compKey, pracKey) {
      var pkey, prac, pracs;
      pracs = this.getPractices(compKey);
      for (pkey in pracs) {
        if (!hasProp.call(pracs, pkey)) continue;
        prac = pracs[pkey];
        if (Util.isChild(pkey)) {
          if (pkey === pracKey) {
            return prac.disps;
          }
        }
      }
      return {};
    }

    getNextDispKey(prevCompKey, nextCompKey, prevPracKey, nextPracKey, prevDispKey) {
      var disp, dispDir, dkey, nextDispKey, nextDisps, prevDisps;
      prevDisps = this.getDisps(prevCompKey, prevPracKey);
      nextDisps = this.getDisps(nextCompKey, nextPracKey);
      dispDir = this.none;
      nextDispKey = this.none;
      for (dkey in prevDisps) {
        if (!hasProp.call(prevDisps, dkey)) continue;
        disp = prevDisps[dkey];
        if (Util.isChild(dkey) && dkey === prevDispKey) {
          dispDir = disp.dir;
        }
      }
      for (dkey in nextDisps) {
        if (!hasProp.call(nextDisps, dkey)) continue;
        disp = nextDisps[dkey];
        if (Util.isChild(dkey) && disp.dir === dispDir) {
          nextDispKey = dkey;
        }
      }
      if (this.debug) {
        console.log("Build.getNextDispKey()", {
          nextDispKey: nextDispKey,
          prevDispKey: prevDispKey,
          dispDir: dispDir,
          prevDisps: prevDisps,
          nextDisps: nextDisps
        });
      }
      return nextDispKey;
    }

    getDim(cname, dir) {
      var col, dim, key;
      col = this.getCol(cname);
      for (key in col) {
        dim = col[key];
        if (Util.isChild(key)) {
          if (dim.dir === dir) {
            // console.log( 'Build.getDim()', { key:key, dim:dim, col:col } )
            return dim;
          }
        }
      }
      return this.none;
    }

    getCol(cname) {
      return this.batch.Prin.data[cname];
    }

    logPlanes(planes) {
      var i, keyBase, keyItem, keyPlane, keyPractice, keyStudy, keyTopic, len, objBase, objItem, objPractice, objStudy, objTopic, practices;
      console.log('----- Beg Log Planes  ------');
      for (i = 0, len = planes.length; i < len; i++) {
        keyPlane = planes[i];
        console.log("Plane: ", keyPlane);
        practices = this.getPractices(keyPlane);
        for (keyPractice in practices) {
          if (!hasProp.call(practices, keyPractice)) continue;
          objPractice = practices[keyPractice];
          if (!(Util.isChild(keyPractice))) {
            continue;
          }
          console.log("  Practice: ", keyPractice);
          for (keyStudy in objPractice) {
            if (!hasProp.call(objPractice, keyStudy)) continue;
            objStudy = objPractice[keyStudy];
            if (!(Util.isChild(keyStudy))) {
              continue;
            }
            console.log("    Study: ", keyStudy);
            for (keyTopic in objStudy) {
              if (!hasProp.call(objStudy, keyTopic)) continue;
              objTopic = objStudy[keyTopic];
              if (!(Util.isChild(keyTopic))) {
                continue;
              }
              console.log("      Topic: ", keyTopic);
              for (keyItem in objTopic) {
                if (!hasProp.call(objTopic, keyItem)) continue;
                objItem = objTopic[keyItem];
                if (!(Util.isChild(keyItem))) {
                  continue;
                }
                console.log("        Item: ", keyItem);
                for (keyBase in objItem) {
                  if (!hasProp.call(objItem, keyBase)) continue;
                  objBase = objItem[keyBase];
                  if (Util.isChild(keyBase)) {
                    console.log("          Base: ", keyBase);
                  }
                }
              }
            }
          }
        }
      }
      console.log('----- End Log Planes ------');
    }

    logBatch(batch, comps) { // Build.planes
      var comp, i, keyPractice, keyStudy, len, objPractice, objStudy, pracs;
      console.log('----- Beg Log Batch  ------');
      for (i = 0, len = comps.length; i < len; i++) {
        comp = comps[i];
        console.log("Comp: ", comp);
        pracs = batch[comp].data;
        for (keyPractice in pracs) {
          if (!hasProp.call(pracs, keyPractice)) continue;
          objPractice = pracs[keyPractice];
          if (!(Util.isChild(keyPractice))) {
            continue;
          }
          console.log("    Prac: ", keyPractice);
          for (keyStudy in objPractice) {
            if (!hasProp.call(objPractice, keyStudy)) continue;
            objStudy = objPractice[keyStudy];
            if (Util.isChild(keyStudy)) {
              console.log("      Disp: ", keyStudy);
            }
          }
        }
      }
      console.log('----- End Log Batch ------');
    }

    logByConduit() {
      var col, dir, i, infod, infop, j, k, knowd, knowp, len, len1, len2, ref, ref1, ref2, row, wised, wisep;
      console.log('----- Beg Log By Conduit  ------');
      ref = ['Learn', 'Do', 'Share'];
      for (i = 0, len = ref.length; i < len; i++) {
        row = ref[i];
        ref1 = ['Embrace', 'Innovate', 'Encourage'];
        for (j = 0, len1 = ref1.length; j < len1; j++) {
          col = ref1[j];
          infop = this.getPractice(row, col, 'Info');
          knowp = this.getPractice(row, col, 'Know');
          wisep = this.getPractice(row, col, 'Wise');
          console.log(infop.name, knowp.name, wisep.name);
          ref2 = ['west', 'north', 'east', 'south'];
          for (k = 0, len2 = ref2.length; k < len2; k++) {
            dir = ref2[k];
            infod = this.getDir(infop, dir);
            knowd = this.getDir(knowp, dir);
            wised = this.getDir(wisep, dir);
            console.log('    ', infod.name, knowd.name, wised.name);
          }
        }
      }
      console.log('----- End Log By Conduit  ------');
    }

    planeIcon(plane) {
      if (plane === 'Data') {
        return 'fas fa-table';
      } else if (this.komps != null) {
        return this.komps[plane].icon;
      } else {
        return 'fas fa-circle';
      }
    }

    dimDisps() {
      var col, dim, dir, disp, i, j, k, l, len, len1, len2, len3, plane, planes, prac, ref, ref1, ref2, row;
      ref = ['Embrace', 'Innovate', 'Encourage'];
      for (i = 0, len = ref.length; i < len; i++) {
        col = ref[i];
        planes = col === 'Innovate' ? Build.planes : Build.planes; // 'Data',
        ref1 = ['west', 'north', 'east', 'south'];
        for (j = 0, len1 = ref1.length; j < len1; j++) {
          dir = ref1[j];
          dim = this.getDim(col, dir);
          dim.column = col;
          dim.dims = [];
          for (k = 0, len2 = planes.length; k < len2; k++) {
            plane = planes[k];
            dim.dims.push({
              name: plane,
              icon: this.planeIcon(plane),
              klass: this.dimKlass('Plane', plane)
            });
            ref2 = ['Learn', 'Do', 'Share'];
            for (l = 0, len3 = ref2.length; l < len3; l++) {
              row = ref2[l];
              prac = this.getPractice(row, col, plane);
              disp = this.getDir(prac, dir);
              disp.klass = this.dimKlass(row, plane);
              dim.dims.push(disp);
            }
          }
        }
      }
    }

    dimKlass(row, plane) {
      return row.charAt(0).toLowerCase() + plane.charAt(0).toLowerCase();
    }

    colPracs() {
      var cname, col, i, j, k, len, len1, len2, plane, planes, prac, ref, ref1, row;
      ref = ['Embrace', 'Innovate', 'Encourage'];
      for (i = 0, len = ref.length; i < len; i++) {
        cname = ref[i];
        planes = cname === 'Innovate' ? Build.planes : Build.planes; // 'Data',
        col = this.getCol(cname);
        col.dims = [];
        for (j = 0, len1 = planes.length; j < len1; j++) {
          plane = planes[j];
          col.dims.push({
            name: plane,
            icon: this.planeIcon(plane),
            klass: this.dimKlass('Plane', plane)
          });
          ref1 = ['Learn', 'Do', 'Share'];
          for (k = 0, len2 = ref1.length; k < len2; k++) {
            row = ref1[k];
            prac = this.getPractice(row, cname, plane);
            prac.klass = this.dimKlass(row, plane);
            col.dims.push(prac);
          }
        }
      }
    }

    logByColumn() {
      var cname, dim, dir, doit, dprac, i, j, k, learn, len, len1, len2, lprac, plane, ref, ref1, ref2, share, sprac;
      console.log('----- Beg Log By Column  ------');
      ref = ['Embrace', 'Innovate', 'Encourage'];
      for (i = 0, len = ref.length; i < len; i++) {
        cname = ref[i];
        console.log(cname);
        ref1 = ['west', 'north', 'east', 'south'];
        for (j = 0, len1 = ref1.length; j < len1; j++) {
          dir = ref1[j];
          dim = this.getDim(cname, dir);
          console.log('  ', dim.name, '------'); // Learn', 'Do', 'Share ', dir )
          ref2 = Build.planes;
          for (k = 0, len2 = ref2.length; k < len2; k++) {
            plane = ref2[k];
            lprac = this.getPractice('Learn', cname, plane);
            dprac = this.getPractice('Do', cname, plane);
            sprac = this.getPractice('Share', cname, plane);
            learn = this.getDir(lprac, dir);
            doit = this.getDir(dprac, dir);
            share = this.getDir(sprac, dir);
            console.log('    ', plane + ':', learn.name, doit.name, share.name);
          }
        }
      }
      console.log('----- End Log By Column  ------');
    }

    logAsTable() {
      var cname, dim, dir, doit, dprac, i, j, k, learn, len, len1, len2, lprac, obj, plane, ref, ref1, ref2, share, sprac;
      console.log('----- Beg Log As Table  ------');
      ref = ['Embrace', 'Innovate', 'Encourage'];
      for (i = 0, len = ref.length; i < len; i++) {
        cname = ref[i];
        console.log(cname);
        obj = {};
        ref1 = ['west', 'north', 'east', 'south'];
        for (j = 0, len1 = ref1.length; j < len1; j++) {
          dir = ref1[j];
          dim = this.getDim(cname, dir);
          ref2 = Build.planes;
          for (k = 0, len2 = ref2.length; k < len2; k++) {
            plane = ref2[k];
            lprac = this.getPractice('Learn', cname, plane);
            dprac = this.getPractice('Do', cname, plane);
            sprac = this.getPractice('Share', cname, plane);
            learn = this.getDir(lprac, dir);
            doit = this.getDir(dprac, dir);
            share = this.getDir(sprac, dir);
            obj[plane] = {
              Dimension: dim.name,
              Learn: learn.name,
              Do: doit.name,
              Share: share.name
            };
          }
        }
        // data.push( [ pln, prin, learn.name, doit.name, share.name ] )
        // console.table( data, ['Plane','Principle','Learn', 'Do', 'Share'])
        console.table(obj);
      }
      console.log('----- End Log As Table  ------');
    }

    saveAsHtml(name) {
      var col, dim, dir, doit, dprac, htm, i, j, k, learn, len, len1, len2, lprac, plane, ref, ref1, ref2, share, sprac;
      htm = `<!DOCTYPE html>\n<html lang="en">\n  <head><meta charset="utf-8">\n    <title>${name}</title>`;
      htm += `\n    <link href="${name}.css" rel="stylesheet" type="text/css"/>\n  </head>\n  <body>\n`;
      ref = ['Embrace', 'Innovate', 'Encourage'];
      for (i = 0, len = ref.length; i < len; i++) {
        col = ref[i];
        htm += `    <div class="col">${col}</div>\n`;
        ref1 = ['west', 'north', 'east', 'south'];
        for (j = 0, len1 = ref1.length; j < len1; j++) {
          dir = ref1[j];
          dim = this.getDim(col, dir);
          htm += `    <table>\n      <thead>\n        `;
          htm += `<tr><th>Plane</th><th>${dim}</th><th>Learn</th><th>Do</th><th>Share</th></tr>\n      </thead>\n      <tbody>\n`;
          ref2 = Build.planes;
          for (k = 0, len2 = ref2.length; k < len2; k++) {
            plane = ref2[k];
            lprac = this.getPractice('Learn', col, plane);
            dprac = this.getPractice('Do', col, plane);
            sprac = this.getPractice('Share', col, plane);
            learn = this.getDir(lprac, dir);
            doit = this.getDir(dprac, dir);
            share = this.getDir(sprac, dir);
            htm += `        <tr><td>${plane}:</td><td>${dim}</td><td>${learn.name}</td><td>${doit.name}</td><td>${share.name}</td></tr>\n`;
          }
          htm += `      </tbody>\n    </table>\n`;
        }
      }
      htm += `  </body>\n</html>\n`;
      Access.saveHtml(name, htm);
    }

  };

  // ---- Class Methods for Practices ----
  Build.planes = ['Info', 'Know', 'Wise'];

  return Build;

}).call(this);

export default Build;

//# sourceMappingURL=Build.js.map
