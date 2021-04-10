var Ptn;

import {
  _,
  REST
} from '../../../base/util/Match.js';

import Ascii from '../par/Ascii.esm.js';

Ptn = class Ptn {
  static toPtn(f) {
    var a, i, j, ref;
    a = void 0;
    if (f === 'String') {
      a = String;
    } else if (f === 'Number') {
      a = Number;
    } else if (f === '_') {
      a = _;
    } else if (typeof f === 'function') {
      a = [];
      if (f.name === 'Vec' || f.name === 'Mat') {
        a.push(f.name, REST);
      } else {
        // console.log( 'Ptn.toPtn() Vec', f.name, REST )
        a.push(f.name);
        for (i = j = 0, ref = f.length; (0 <= ref ? j < ref : j > ref); i = 0 <= ref ? ++j : --j) {
          a.push(_);
        }
      }
    } else {
      console.error('Ptn.toPtn() unknown pattern', f);
    }
    //console.log( 'Ptn.toPtn()', { f:f, ft:typeof(f), fa:Array.isArray(f), a:a, at:typeof(a), aa:Array.isArray(a) } )
    return a;
  }

  static type(ptn) {
    if (Array.isArray(ptn)) {
      return 'array';
    } else {
      return typeof ptn;
    }
  }

  static toPtns(adts) {
    var i, j, ptns, ref;
    // console.log( 'Ptn.toPtns() adts', adts )
    ptns = new Array(adts.length);
    for (i = j = 0, ref = adts.length; (0 <= ref ? j < ref : j > ref); i = 0 <= ref ? ++j : --j) {
      ptns[i] = i % 2 === 0 ? Ptn.toPtn(adts[i]) : adts[i];
    }
    // for i in [0...ptns.length] by 2
    //   console.log( 'Ptn.toPtns()', { ptn:ptns[i], type:Ptn.type(ptns[i]) } )
    return ptns;
  }

  static parse(ascii) {
    var ast, e, err, sst;
    sst = "X";
    ast = [];
    err = {};
    try {
      sst = Ascii.parse(ascii);
      try {
        ast = eval(sst);
      } catch (error) {
        e = error;
        console.error('Ptn.parse() eval  error', key, e);
      }
    } catch (error) {
      e = error;
      err.found = e.found;
      err.msg = e.message;
      err.loc = e.location;
      console.error('Ptn.doParse() parse error', {
        key: key,
        ascii: ascii,
        error: err
      });
    }
    return ast;
  }

  static toSst(ast) {
    var i, j, ref, sst;
    sst = "[";
    for (i = j = 0, ref = ast.length; (0 <= ref ? j < ref : j > ref); i = 0 <= ref ? ++j : --j) {
      if (!(ast[i] != null)) {
        continue;
      }
      sst += Array.isArray(ast[i]) ? Ptn.toSst(ast[i]) : ast[i].toString();
      if (i < ast.length - 1) {
        sst += ',';
      }
    }
    sst += "]";
    return sst;
  }

};

export default Ptn;
