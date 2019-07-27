var Util,
  indexOf = [].indexOf,
  hasProp = {}.hasOwnProperty;

Util = class Util {
  constructor() {
    this.dummy = "";
    Util.noop(Util.loadScript, Util.hasMethod, Util.dependsOn, Util.setInstance, Util.getInstance);
    Util.noop(Util.toError, Util.logJSON, Util.isNot, Util.isVal, Util.isntStr);
    Util.noop(Util.inIndex, Util.isEvent, Util.atArray, Util.atLength, Util.isStrInteger);
    Util.noop(Util.isStrCurrency, Util.isStrFloat, Util.isDefs, Util.toPosition, Util.xyScale);
    Util.noop(Util.resizeTimeout, Util.eventErrorCode, Util.toAlpha, Util.hashCode, Util.pdfCSS);
    Util.noop(Util.padStr, Util.isoDateTime, Util.toHMS, Util.toInt, Util.hex32);
    Util.noop(Util.toFloat, Util.toCap, Util.match_test, Util.svgId, Util.saveFile);
  }

  static element($elem) {
    // console.log( 'Dom.element()', $elem, Dom.isJQueryElem( $elem ) )
    if (Util.isJQueryElem($elem)) {
      return $elem.get(0);
    } else if (Util.isStr($elem)) {
      return $($elem).get(0);
    } else {
      console.error('Dom.domElement( $elem )', typeof $elem, $elem, '$elem is neither jQuery object nor selector');
      return $().get(0);
    }
  }

  static isJQueryElem($elem) {
    return (typeof $ !== "undefined" && $ !== null) && ($elem != null) && ($elem instanceof $ || indexOf.call(Object($elem), 'jquery') >= 0);
  }

  static loadScript(path, fn) {
    var head, script;
    head = document.getElementsByTagName('head')[0];
    script = document.createElement('script');
    script.src = path;
    script.async = false;
    if (Util.isFunc(fn)) {
      script.onload = fn;
    }
    head.appendChild(script);
  }

  static ready(fn) {
    if (!Util.isFunc(fn)) { // Sanity check
      return;
    } else if (Util.skipReady) {
      fn();
    } else if (document.readyState === 'complete') { // If document is already loaded, run method
      fn();
    } else {
      document.addEventListener('DOMContentLoaded', fn, false);
    }
  }

  static isChild(key) {
    var a, b;
    a = key.charAt(0);
    b = key.charAt(key.length - 1);
    return a === a.toUpperCase() && a !== '$' && b !== '_';
  }

  // ---- Inquiry ----
  static hasMethod(obj, method, issue = false) {
    var has;
    has = typeof obj[method] === 'function';
    if (!has && issue) {
      console.log('Util.hasMethod()', method, has);
    }
    return has;
  }

  static hasGlobal(global, issue = true) {
    var has;
    has = window[global] != null;
    if (!has && issue) {
      console.error(`Util.hasGlobal() ${global} not present`);
    }
    return has;
  }

  static getGlobal(global, issue = true) {
    if (Util.hasGlobal(global, issue)) {
      return window[global];
    } else {
      return null;
    }
  }

  static hasModule(path, issue = true) {
    var has;
    has = Util.modules[path] != null;
    if (!has && issue) {
      console.error(`Util.hasModule() ${path} not present`);
    }
    return has;
  }

  static dependsOn() {
    var arg, has, j, len1, ok;
    ok = true;
    for (j = 0, len1 = arguments.length; j < len1; j++) {
      arg = arguments[j];
      has = Util.hasGlobal(arg, false) || Util.hasModule(arg, false) || Util.hasPlugin(arg, false);
      if (!has) {
        console.error('Missing Dependency', arg);
      }
      if (has === false) {
        ok = has;
      }
    }
    return ok;
  }

  // ---- Instances ----
  static setInstance(instance, path) {
    console.log('Util.setInstance()', path);
    if ((instance == null) && (path != null)) {
      console.error('Util.setInstance() instance not defined for path', path);
    } else if ((instance != null) && (path == null)) {
      console.error('Util.setInstance() path not defined for instance', instance.toString());
    } else {
      Util.instances[path] = instance;
    }
  }

  static getInstance(path, dbg = false) {
    var instance;
    if (dbg) {
      console.log('getInstance', path);
    }
    instance = Util.instances[path];
    if (instance == null) {
      console.error('Util.getInstance() instance not defined for path', path);
    }
    return instance;
  }

  // ---- Logging -------

  // args should be the arguments passed by the original calling function
  // This method should not be called directly
  static toStrArgs(prefix, args) {
    var arg, j, len1, str;
    Util.logStackNum = 0;
    str = Util.isStr(prefix) ? prefix + " " : "";
    for (j = 0, len1 = args.length; j < len1; j++) {
      arg = args[j];
      str += Util.toStr(arg) + " ";
    }
    return str;
  }

  static toStr(arg) {
    Util.logStackNum++;
    if (Util.logStackNum > Util.logStackMax) {
      return '';
    }
    switch (typeof arg) {
      case 'null':
        return 'null';
      case 'string':
        return Util.toStrStr(arg);
      case 'number':
        return arg.toString();
      case 'object':
        return Util.toStrObj(arg);
      default:
        return arg;
    }
  }

  // Recusively stringify arrays and objects
  static toStrObj(arg) {
    var a, j, key, len1, str, val;
    str = "";
    if (arg == null) {
      str += "null";
    } else if (Util.isArray(arg)) {
      str += "[ ";
      for (j = 0, len1 = arg.length; j < len1; j++) {
        a = arg[j];
        str += Util.toStr(a) + ",";
      }
      str = str.substr(0, str.length - 1) + " ]";
    } else if (Util.isObjEmpty(arg)) {
      str += "{}";
    } else {
      str += "{ ";
      for (key in arg) {
        if (!hasProp.call(arg, key)) continue;
        val = arg[key];
        str += key + ":" + Util.toStr(val) + ", ";
      }
      str = str.substr(0, str.length - 2) + " }"; // Removes last comma
    }
    return str;
  }

  static toStrStr(arg) {
    if (arg.length > 0) {
      return arg;
    } else {
      return '""';
    }
  }

  static toOut(obj, level = 0) {
    var ind, key, out, val;
    ind = Util.indent(level * 2);
    out = "";
    for (key in obj) {
      if (!hasProp.call(obj, key)) continue;
      val = obj[key];
      if (!(key.charAt(0) === key.charAt(0).toUpperCase())) {
        continue;
      }
      out += ind + key + '\n';
      if (Util.isObj(val)) {
        out += Util.toOut(val, level + 1);
      }
    }
    return out;
  }

  // Consume unused but mandated variable to pass code inspections
  static noop(...args) {
  }

  static toError() {
    var str;
    str = Util.toStrArgs('Error:', arguments);
    return new Error(str);
  }

  static alert() {
    var str;
    str = Util.toStrArgs('', arguments);
    console.log(str);
    alert(str);
  }

  static logJSON(json) {
    var obj;
    obj = JSON.parse(json);
    console.log(obj);
  }

  static jQueryHasNotBeenLoaded() {
    if (typeof jQuery === 'undefined') {
      console.error('Util JQuery has not been loaded');
      return true;
    } else {
      return false;
    }
  }

  // ------ Validators ------
  static isDef(d) {
    return d !== null && typeof d !== 'undefined';
  }

  static isNot(d) {
    return !Util.isDef(d);
  }

  static isStr(s) {
    return Util.isDef(s) && typeof s === "string" && s.length > 0;
  }

  static isntStr(s) {
    return !Util.isStr(s);
  }

  static isNum(n) {
    return !isNaN(n);
  }

  static isObj(o) {
    return Util.isDef(o) && typeof o === "object";
  }

  static isVal(v) {
    return typeof v === "number" || typeof v === "string" || typeof v === "boolean";
  }

  static isNaN(v) {
    return Util.isDef(v) && typeof v === "number" && Number.isNaN(v);
  }

  static isSym(v) {
    return typeof v === "symbol";
  }

  static isObjEmpty(o) {
    return Util.isObj(o) && Object.getOwnPropertyNames(o).length === 0;
  }

  static isFunc(f) {
    return Util.isDef(f) && typeof f === "function";
  }

  static isArray(a) {
    return Util.isDef(a) && typeof a !== "string" && (a.length != null) && a.length > 0;
  }

  static isEvent(e) {
    return Util.isDef(e) && (e.target != null);
  }

  static inIndex(a, i) {
    return Util.isArray(a) && 0 <= i && i < a.length;
  }

  static inArray(a, e) {
    return Util.isArray(a) && a.indexOf(e) > -1;
  }

  static atArray(a, e) {
    if (Util.inArray(a, e)) {
      return a.indexOf(e);
    } else {
      return -1;
    }
  }

  static inString(s, e) {
    return Util.isStr(s) && s.indexOf(e) > -1;
  }

  static atLength(a, n) {
    return Util.isArray(a) && a.length === n;
  }

  static head(a) {
    if (Util.isArray(a)) {
      return a[0];
    } else {
      return null;
    }
  }

  static tail(a) {
    if (Util.isArray(a)) {
      return a[a.length - 1];
    } else {
      return null;
    }
  }

  static time() {
    return new Date().getTime();
  }

  static isStrInteger(s) {
    return /^\s*(\+|-)?\d+\s*$/.test(s);
  }

  static isStrFloat(s) {
    return /^\s*(\+|-)?((\d+(\.\d+)?)|(\.\d+))\s*$/.test(s);
  }

  static isStrCurrency(s) {
    return /^\s*(\+|-)?((\d+(\.\d\d)?)|(\.\d\d))\s*$/.test(s);
  }

  //@isStrEmail:(s)   -> /^\s*[\w\-\+_]+(\.[\w\-\+_]+)*\@[\w\-\+_]+\.[\w\-\+_]+(\.[\w\-\+_]+)*\s*$/.test(s)
  static isDefs() {
    var arg, j, len1;
    for (j = 0, len1 = arguments.length; j < len1; j++) {
      arg = arguments[j];
      if (arg == null) {
        return false;
      }
    }
    return true;
  }

  static checkTypes(type, args) {
    var arg, key;
    for (key in args) {
      if (!hasProp.call(args, key)) continue;
      arg = args[key];
      // console.log( "Util.checkTypes isNum() argument #{key} is #{type}", arg, Util.isNum(arg) )
      if (!Util.checkType(type, arg)) {
        console.log(`Util.checkTypes(type,args) argument ${key} is not ${type}`, arg);
        console.trace();
      }
    }
  }

  static checkType(type, arg) {
    switch (type) {
      case "string":
        return Util.isStr(arg);
      case "number":
        return Util.isNum(arg);
      case "object":
        return Util.isObj(arg);
      case "symbol":
        return Util.isSym(arg);
      case "function":
        return Util.isFunc(arg);
      case "array":
        return Util.isArray(arg);
      default:
        return false;
    }
  }

  static copyProperties(to, from) {
    var key, val;
    for (key in from) {
      if (!hasProp.call(from, key)) continue;
      val = from[key];
      to[key] = val;
    }
    return to;
  }

  static contains(array, value) {
    return Util.isArray(array) && array.indexOf(value) !== -1;
  }

  // Screen absolute (left top width height) percent positioning and scaling

  // Percent array to position mapping
  static toPosition(array) {
    return {
      left: array[0],
      top: array[1],
      width: array[2],
      height: array[3]
    };
  }

  // Adds Percent from array for CSS position mapping
  static toPositionPc(array) {
    return {
      position: 'absolute',
      left: array[0] + '%',
      top: array[1] + '%',
      width: array[2] + '%',
      height: array[3] + '%'
    };
  }

  static xyScale(prev, next, port, land) {
    var xn, xp, xs, yn, yp, ys;
    xp = 0;
    yp = 0;
    xn = 0;
    yn = 0;
    [xp, yp] = prev.orientation === 'Portrait' ? [port[2], port[3]] : [land[2], land[3]];
    [xn, yn] = next.orientation === 'Portrait' ? [port[2], port[3]] : [land[2], land[3]];
    xs = next.width * xn / (prev.width * xp);
    ys = next.height * yn / (prev.height * yp);
    return [xs, ys];
  }

  // ----------------- Guarded jQuery dependent calls -----------------
  static resize(callback) {
    window.onresize = function() {
      return setTimeout(callback, 100);
    };
  }

  static resizeTimeout(callback, timeout = null) {
    window.onresize = function() {
      if (timeout != null) {
        clearTimeout(timeout);
      }
      return timeout = setTimeout(callback, 100);
    };
  }

  // ------ Html ------------
  static getHtmlId(name, type = '', ext = '') {
    var id;
    id = name + type + ext + Util.uniqueIdExt;
    return id.replace(/[ \.]/g, "");
  }

  static htmlId(name, type = '', ext = '', issueError = true) {
    var id;
    id = Util.getHtmlId(name, type, ext);
    if ((Util.htmlIds[id] != null) && issueError) {
      console.error('Util.htmlId() duplicate html id', id);
    }
    Util.htmlIds[id] = id;
    return id;
  }

  static clearHtmlIds() {
    return Util.htmlIds = {};
  }

  // ------ Converters ------
  static extend(obj, mixin) {
    var method, name;
    for (name in mixin) {
      if (!hasProp.call(mixin, name)) continue;
      method = mixin[name];
      obj[name] = method;
    }
    return obj;
  }

  static include(klass, mixin) {
    return Util.extend(klass.prototype, mixin);
  }

  static eventErrorCode(e) {
    var errorCode;
    errorCode = (e.target != null) && e.target.errorCode ? e.target.errorCode : 'unknown';
    return {
      errorCode: errorCode
    };
  }

  static toName(s1) {
    var s2, s3, s4, s5;
    if (s1 == null) {
      console.trace();
      return "???";
    }
    s2 = s1.replace('_', ' ');
    s3 = s2.replace(/([A-Z][a-z])/g, ' $1');
    s4 = s3.replace(/([A-Z]+)/g, ' $1');
    s5 = s4.replace(/([0-9][A-Z])/g, ' $1');
    return s5;
  }

  static toAlpha(s1) {
    return s1.replace(/\W/g, '');
  }

  static indent(n) {
    var i, j, ref, str;
    str = '';
    for (i = j = 0, ref = n; (0 <= ref ? j < ref : j > ref); i = 0 <= ref ? ++j : --j) {
      str += ' ';
    }
    return str;
  }

  static hashCode(str) {
    var hash, i, j, ref;
    hash = 0;
    for (i = j = 0, ref = str.length; (0 <= ref ? j < ref : j > ref); i = 0 <= ref ? ++j : --j) {
      hash = (hash << 5) - hash + str.charCodeAt(i);
    }
    return hash;
  }

  static lastTok(str, delim) {
    return str.split(delim).pop();
  }

  static firstTok(str, delim) {
    if (Util.isStr(str) && (str.split != null)) {
      return str.split(delim)[0];
    } else {
      console.error("Util.firstTok() str is not at string", str);
      return '';
    }
  }

  static pdfCSS(href) {
    var link;
    if (!window.location.search.match(/pdf/gi)) {
      return;
    }
    link = document.createElement('link');
    link.rel = 'stylesheet';
    link.type = 'text/css';
    link.href = href;
    document.getElementsByTagName('head')[0].appendChild(link);
  }

  /*
  parse = document.createElement('a')
  parse.href =  "http://example.com:3000/dir1/dir2/file.ext?search=test#hash"
  parse.protocol  "http:"
  parse.hostname  "example.com"
  parse.port      "3000"
  parse.pathname  "/dir1/dir2/file.ext"
  parse.segments  ['dir1','dir2','file.ext']
  parse.fileExt   ['file','ext']
  parse.file       'file'
  parse.ext        'ext'
  parse.search    "?search=test"
  parse.hash      "#hash"
  parse.host      "example.com:3000"
  */
  static parseURI(uri) {
    var a, j, len1, name, nameValue, nameValues, parse, value;
    parse = {};
    parse.params = {};
    a = document.createElement('a');
    a.href = uri;
    parse.href = a.href;
    parse.protocol = a.protocol;
    parse.hostname = a.hostname;
    parse.port = a.port;
    parse.segments = a.pathname.split('/');
    parse.fileExt = parse.segments.pop().split('.');
    parse.file = parse.fileExt[0];
    parse.ext = parse.fileExt.length === 2 ? parse.fileExt[1] : '';
    parse.dbName = parse.file;
    parse.fragment = a.hash;
    parse.query = Util.isStr(a.search) ? a.search.substring(1) : '';
    nameValues = parse.query.split('&');
    if (Util.isArray(nameValues)) {
      for (j = 0, len1 = nameValues.length; j < len1; j++) {
        nameValue = nameValues[j];
        name = '';
        value = '';
        [name, value] = nameValue.split('=');
        parse.params[name] = value;
      }
    }
    return parse;
  }

  static quicksort(array) {
    var a, head, large, small;
    if (array.length === 0) {
      return [];
    }
    head = array.pop();
    small = (function() {
      var j, len1, results;
      results = [];
      for (j = 0, len1 = array.length; j < len1; j++) {
        a = array[j];
        if (a <= head) {
          results.push(a);
        }
      }
      return results;
    })();
    large = (function() {
      var j, len1, results;
      results = [];
      for (j = 0, len1 = array.length; j < len1; j++) {
        a = array[j];
        if (a > head) {
          results.push(a);
        }
      }
      return results;
    })();
    return (Util.quicksort(small)).concat([head]).concat(Util.quicksort(large));
  }

  static pad(n) {
    if (n < 10) {
      return '0' + n;
    } else {
      return n;
    }
  }

  static padStr(n) {
    if (n < 10) {
      return '0' + n.toString();
    } else {
      return n.toString();
    }
  }

  // Return and ISO formated data string
  static isoDateTime(dateIn) {
    var date, pad;
    date = dateIn != null ? dateIn : new Date();
    console.log('Util.isoDatetime()', date);
    console.log('Util.isoDatetime()', date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes, date.getUTCSeconds);
    pad = function(n) {
      return Util.pad(n);
    };
    return date.getFullYear()(+'-' + pad(date.getUTCMonth() + 1) + '-' + pad(date.getUTCDate()) + 'T' + pad(date.getUTCHours()) + ':' + pad(date.getUTCMinutes()) + ':' + pad(date.getUTCSeconds()) + 'Z');
  }

  static toHMS(unixTime) {
    var ampm, date, hour, min, sec, time;
    date = new Date();
    if (Util.isNum(unixTime)) {
      date.setTime(unixTime);
    }
    hour = date.getHours();
    ampm = 'AM';
    if (hour > 12) {
      hour = hour - 12;
      ampm = 'PM';
    }
    min = ('0' + date.getMinutes()).slice(-2);
    sec = ('0' + date.getSeconds()).slice(-2);
    time = `${hour}:${min}:${sec} ${ampm}`;
    return time;
  }

  // Generate four random hex digits
  static hex4() {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  }

  // Generate a 32 bits hex
  static hex32() {
    var hex, i, j;
    hex = this.hex4();
    for (i = j = 1; j <= 4; i = ++j) {
      Util.noop(i);
      hex += this.hex4();
    }
    return hex;
  }

  // Return a number with fixed decimal places
  static toFixed(arg, dec = 2) {
    var num;
    num = (function() {
      switch (typeof arg) {
        case 'number':
          return arg;
        case 'string':
          return parseFloat(arg);
        default:
          return 0;
      }
    })();
    return num.toFixed(dec);
  }

  static toInt(arg) {
    switch (typeof arg) {
      case 'number':
        return Math.floor(arg);
      case 'string':
        return parseInt(arg);
      default:
        return 0;
    }
  }

  static toFloat(arg) {
    switch (typeof arg) {
      case 'number':
        return arg;
      case 'string':
        return parseFloat(arg);
      default:
        return 0;
    }
  }

  static toCap(str) {
    return str.charAt(0).toUpperCase() + str.substring(1);
  }

  static unCap(str) {
    return str.charAt(0).toLowerCase() + str.substring(1);
  }

  static toArray(objs) {
    var array, key, obj;
    if (Util.isArray(objs)) {
      return objs;
    } else {
      array = [];
      for (key in objs) {
        if (!hasProp.call(objs, key)) continue;
        obj = objs[key];
        array.push(obj);
      }
      return array;
    }
  }

  
  // Not working
  static toArray2(objects, whereIn = null, keyField = 'id') {
    var array, j, key, len1, object, where;
    where = whereIn != null ? whereIn : function() {
      return true;
    };
    array = [];
    if (Util.isArray(objects)) {
      for (j = 0, len1 = array.length; j < len1; j++) {
        object = array[j];
        if (!(where(object))) {
          continue;
        }
        if ((object['id'] != null) && keyField !== 'id') {
          object[keyField] = object['id'];
        }
        array.push(object);
      }
    } else {
      for (key in objects) {
        if (!hasProp.call(objects, key)) continue;
        object = objects[key];
        if (!(where(key, object))) {
          continue;
        }
        object[keyField] = key;
        array.push(object);
      }
    }
    return array;
  }

  static toObjects(rows, whereIn = null, keyField = 'id') {
    var j, key, len1, objects, row, where;
    where = whereIn != null ? whereIn : function() {
      return true;
    };
    objects = {};
    if (Util.isArray(rows)) {
      for (j = 0, len1 = rows.length; j < len1; j++) {
        row = rows[j];
        if (!(where(row))) {
          continue;
        }
        if ((row['id'] != null) && keyField !== 'id') {
          row[keyField] = row['id'];
        }
        objects[row[keyField]] = row;
      }
    } else {
      for (key in rows) {
        row = rows[key];
        if (!(where(row))) {
          continue;
        }
        row[keyField] = key;
        objects[key] = row;
      }
    }
    return objects;
  }

  static lenObject(object, where = function() {
      return true;
    }) {
    var key, len, obj;
    len = 0;
    for (key in object) {
      if (!hasProp.call(object, key)) continue;
      obj = object[key];
      if (where(key)) {
        len = len + 1;
      }
    }
    return len;
  }

  // Beautiful Code, Chapter 1.
  // Implements a regular expression matcher that supports character matches,
  // '.', '^', '$', and '*'.

  // Search for the regexp anywhere in the text.
  static match(regexp, text) {
    if (regexp[0] === '^') {
      return Util.match_here(regexp.slice(1), text);
    }
    while (text) {
      if (Util.match_here(regexp, text)) {
        return true;
      }
      text = text.slice(1);
    }
    return false;
  }

  // Search for the regexp at the beginning of the text.
  static match_here(regexp, text) {
    var cur, next;
    cur = "";
    next = "";
    [cur, next] = [regexp[0], regexp[1]];
    if (regexp.length === 0) {
      return true;
    }
    if (next === '*') {
      return Util.match_star(cur, regexp.slice(2), text);
    }
    if (cur === '$' && !next) {
      return text.length === 0;
    }
    if (text && (cur === '.' || cur === text[0])) {
      return Util.match_here(regexp.slice(1), text.slice(1));
    }
    return false;
  }

  // Search for a kleene star match at the beginning of the text.
  static match_star(c, regexp, text) {
    while (true) {
      if (Util.match_here(regexp, text)) {
        return true;
      }
      if (!(text && (text[0] === c || c === '.'))) {
        return false;
      }
      text = text.slice(1);
    }
  }

  static match_test() {
    console.log(Util.match_args("ex", "some text"));
    console.log(Util.match_args("s..t", "spit"));
    console.log(Util.match_args("^..t", "buttercup"));
    console.log(Util.match_args("i..$", "cherries"));
    console.log(Util.match_args("o*m", "vrooooommm!"));
    return console.log(Util.match_args("^hel*o$", "hellllllo"));
  }

  static match_args(regexp, text) {
    return console.log(regexp, text, Util.match(regexp, text));
  }

  static svgId(name, type, svgType, check = false) {
    if (check) {
      return this.id(name, type, svgType);
    } else {
      return name + type + svgType;
    }
  }

  static css(name, type = '') {
    return name + type;
  }

  static icon(name, type, fa) {
    return name + type + ' fa fa-' + fa;
  }

  // json - "application/json;charset=utf-8"
  // svg
  static mineType(fileType) {
    var mine;
    mine = (function() {
      switch (fileType) {
        case 'json':
          return "application/json";
        case 'adoc':
          return "text/plain";
        case 'html':
          return "text/html";
        case 'svg':
          return "image/svg+xml";
        default:
          return "text/plain";
      }
    })();
    mine += ";charset=utf-8";
    return mine;
  }

  static saveFile(stuff, fileName, fileType) {
    var blob, downloadLink, url;
    blob = new Blob([stuff], {
      type: this.mineType(fileType)
    });
    url = window['URL'].createObjectURL(blob);
    downloadLink = document.createElement("a");
    downloadLink.href = url;
    downloadLink.download = fileName;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  }

};

// Static class variables have to be declared outside of class declarion to avoid function wrapper
Util.htmlIds = {}; // Object of unique Html Ids

Util.myVar = 'myVar';

Util.skipReady = false;

Util.modules = [];

Util.instances = [];

Util.logStackNum = 0;

Util.logStackMax = 100;

Util.fills = {};

Util.uniqueIdExt = '';

var Util$1 = Util;

var Data,
  hasProp$1 = {}.hasOwnProperty;

Data = class Data {
  static refine(data, type) {
    var akey, area, base, bkey, ckey, comp, disp, dkey, ikey, item, pkey, prac;
    if (type === 'None') {
      return data;
    }
    data.comps = {};
    for (ckey in data) {
      comp = data[ckey];
      if (!(Util$1.isChild(ckey))) {
        continue;
      }
      // console.log( 'Data.refine comp', comp )
      data.comps[ckey] = comp;
      if (comp['name'] == null) {
        comp['name'] = ckey;
      }
      comp.pracs = {};
      for (pkey in comp) {
        prac = comp[pkey];
        if (!(Util$1.isChild(pkey))) {
          continue;
        }
        // console.log( '  Data.refine prac', prac )
        comp.pracs[pkey] = prac;
        prac.comp = comp;
        if (prac['name'] == null) {
          prac['name'] = pkey;
        }
        prac.disps = {};
        for (dkey in prac) {
          disp = prac[dkey];
          if (!(Util$1.isChild(dkey))) {
            continue;
          }
          prac.disps[dkey] = disp;
          disp.prac = prac;
          if (disp['name'] == null) {
            disp['name'] = dkey;
          }
          disp.areas = {};
          for (akey in disp) {
            area = disp[akey];
            if (!(Util$1.isChild(akey))) {
              continue;
            }
            disp.areas[akey] = area;
            area.disp = disp;
            if (area['name'] == null) {
              area['name'] = akey;
            }
            area.items = {};
            for (ikey in area) {
              item = area[ikey];
              if (!(Util$1.isChild(ikey))) {
                continue;
              }
              area.items[ikey] = item;
              item.area = area;
              if (item['name'] == null) {
                item['name'] = ikey;
              }
              item.bases = {};
              for (bkey in item) {
                base = item[bkey];
                if (!(Util$1.isChild(bkey))) {
                  continue;
                }
                item.bases[bkey] = base;
                base.item = item;
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

  // ---- Read JSON with batch async
  static batchRead(batch, callback, create = null) {
    var key, obj;
    for (key in batch) {
      if (!hasProp$1.call(batch, key)) continue;
      obj = batch[key];
      this.batchJSON(obj, batch, callback, create);
    }
  }

  static batchComplete(batch) {
    var key, obj;
    for (key in batch) {
      if (!hasProp$1.call(batch, key)) continue;
      obj = batch[key];
      if (!obj['data']) {
        return false;
      }
    }
    return true;
  }

  // "Access-Control-Request-Headers": "*", "Access-Control-Request-Method": "*"
  static batchJSON(obj, batch, callback, refine = null) {
    var opt, url;
    url = obj.type === 'Font' ? obj.url : Data.toUrl(obj.url);
    // console.log( 'Data.batchJSON', obj.url, url )
    opt = {
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/json'
      }
    };
    fetch(url, opt).then((response) => {
      return response.json();
    }).then((data) => {
      obj['data'] = Util$1.isFunc(refine) ? refine(data, obj.type) : data;
      if (Data.batchComplete(batch)) {
        return callback(batch);
      }
    }).catch((error) => {
      return console.error("Data.batchJSON()", {
        url: url,
        error: error
      });
    });
  }

  static asyncJSON(urla, callback) {
    var url;
    url = Data.toUrl(urla);
    // console.log( 'Data.asyncJSON', urla, url )
    fetch(url).then((response) => {
      return response.json();
    }).then((data) => {
      return callback(data);
    }).catch((error) => {
      return console.error("Data.asyncJSON()", {
        url: url,
        error: error
      });
    });
  }

  static planeData(batch, plane) {
    return batch[plane].data[plane];
  }

  static toUrl(url) {
    if (window.location.href.includes('localhost')) {
      return Data.local + url;
    } else {
      return Data.hosted + url;
    }
  }

  
  // ------ Quick JSON read ------
  static read(url, callback) {
    if (Util$1.isObj(url)) {
      Data.readFile(url, callback);
    } else {
      Data.asynsJson(url, callback);
    }
  }

  static readFile(fileObj, doJson) {
    var fileReader;
    fileReader = new FileReader();
    fileReader.onerror = function(e) {
      return console.error('Store.readFile', fileObj.name, e.target.error);
    };
    fileReader.onload = function(e) {
      return doJson(JSON.parse(e.target.result));
    };
    fileReader.readAsText(fileObj);
  }

  static saveFile(data, fileName) {
    var downloadLink, htmlBlob, htmlUrl;
    htmlBlob = new Blob([data], {
      type: "text/html;charset=utf-8"
    });
    htmlUrl = window['URL'].createObjectURL(htmlBlob);
    downloadLink = document.createElement("a");
    downloadLink.href = htmlUrl;
    downloadLink.download = fileName;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  }

};

//ata.parse   = Util.parseURI( window.location.href )
//ata.hosted1 = Data.parse.hostname + '/app/data/'
// console.log('Data.hosted', Data.hosted, window.location.href )
Data.local = "app/data/";

Data.hosted = '/app/data/';

Data.cssDir = 'css/'; // /css in /pub

var Data$1 = Data;

var Build,
  hasProp$2 = {}.hasOwnProperty;

Build = class Build {
  // ---- Class Methods for Practices ----
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
      if (!(Util$1.isChild(key))) {
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
      if (!(Util$1.isChild(pkey))) {
        continue;
      }
      if (pract['name'] == null) {
        pract['name'] = pkey;
      }
      for (skey in pract) {
        study = pract[skey];
        if (!(Util$1.isChild(skey))) {
          continue;
        }
        if (study['name'] == null) {
          study['name'] = skey;
        }
        for (tkey in study) {
          topic = study[tkey];
          if (!(Util$1.isChild(tkey))) {
            continue;
          }
          if (topic['name'] == null) {
            topic['name'] = tkey;
          }
          for (ikey in topic) {
            item = topic[ikey];
            if (!(Util$1.isChild(ikey))) {
              continue;
            }
            if (item['name'] == null) {
              item['name'] = ikey;
            }
            for (bkey in item) {
              base = item[bkey];
              if (Util$1.isChild(bkey)) {
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
    var cols, i, len, plane, ref;
    cols = batch.Cols.data['Cols'];
    ref = ['Info', 'Know', 'Wise'];
    for (i = 0, len = ref.length; i < len; i++) {
      plane = ref[i];
      batch[plane].data['Cols'] = cols;
    }
  }

  static rowPractices(batch) {
    var i, len, plane, ref, rows;
    rows = batch.Rows.data['Rows'];
    ref = ['Info', 'Know', 'Wise'];
    for (i = 0, len = ref.length; i < len; i++) {
      plane = ref[i];
      batch[plane].data['Rows'] = rows;
    }
  }

  static copyAtt(src, des) {
    var key, obj;
    for (key in src) {
      if (!hasProp$2.call(src, key)) continue;
      obj = src[key];
      if (!Util$1.isChild(key)) {
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
      if (Util$1.isChild(gkey)) {
        for (pkey in group) {
          pract = group[pkey];
          if (Util$1.isChild(pkey)) {
            for (skey in pract) {
              study = pract[skey];
              if (Util$1.isChild(skey)) {
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
      if (!(Util$1.isChild(gkey))) {
        continue;
      }
      if (log) {
        console.log(gkey);
      }
      for (pkey in group) {
        pract = group[pkey];
        if (!(Util$1.isChild(pkey))) {
          continue;
        }
        if (log) {
          console.log("  ", pkey);
        }
        for (skey in pract) {
          study = pract[skey];
          if (!(Util$1.isChild(skey))) {
            continue;
          }
          if (log) {
            console.log("    ", skey);
          }
          for (tkey in study) {
            topic = study[tkey];
            if (Util$1.isChild(tkey)) {
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
  constructor(batch1, plane1) {
    this.batch = batch1;
    this.plane = plane1;
    //@Spec   = @batch.Muse.data
    this.None = {
      name: "None"
    };
    Util$1.noop(this.toGroups, this.setAdjacents, Build.copyAtt);
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
      if (Util$1.isChild(skey)) {
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
        if (!hasProp$2.call(arg, key)) continue;
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
        return 'None';
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
        return 'None';
    }
  }

  north(row) {
    switch (row) {
      case 'Learn':
        return 'Share';
      case 'Do':
        return 'Learn';
      case 'Share':
        return 'Do';
      default:
        return 'None';
    }
  }

  south(row) {
    switch (row) {
      case 'Learn':
        return 'Do';
      case 'Do':
        return 'Share';
      case 'Share':
        return 'Learn';
      default:
        return 'None';
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
        return 'None';
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
        return 'None';
    }
  }

  adjacentPractice(prac, dir) {
    var adj, col, key, pln, pracs, row;
    if ((prac == null) || (prac.name == null) || prac.name === 'None' || (prac.column == null)) {
      // console.log( 'adjacentPractice', { prac:prac, dir:dir } )
      return this.None;
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
          return ["None", "None", "None"];
      }
    }).call(this);
    if ([col, row, pln] === ["None", "None", "None"]) {
      //console.log( 'adjacentPractice[col,row,pln]', [col,row,pln] )
      return this.None;
    }
    //racs = @getPractices( pln )
    pracs = this.batch[pln].data[pln].pracs;
    for (key in pracs) {
      if (!hasProp$2.call(pracs, key)) continue;
      adj = pracs[key];
      if (Util$1.isChild(key)) {
        if (adj.column === col && adj.row === row && adj.plane === pln) {
          return adj;
        }
      }
    }
    return this.None;
  }

  adjacentStudies(practice, dir) {
    var adjPrac;
    adjPrac = this.adjacentPractice(practice, dir);
    if (adjPrac.name !== 'None') {
      return this.toStudies(adjPrac);
    } else {
      return {};
    }
  }

  connectName(practice, dir, reverse) {
    var adjacent;
    adjacent = this.adjacentPractice(practice, dir);
    if (adjacent.name !== 'None') {
      return this.centerBegEnd(practice.name, adjacent.name, reverse);
    } else {
      return 'None' + '\n' + 'None';
    }
  }

  centerBegEnd(beg, end, reverse) {
    var b, e;
    b = end.length > beg.length ? Util$1.indent((end.length - beg.length) / 2) + beg : beg;
    e = beg.length > end.length ? Util$1.indent((beg.length - end.length) / 2) + end : end;
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
    if ((this.batch[plane] != null) && (this.batch[plane].data[plane] != null)) {
      return this.batch[plane].data[plane];
    } else {
      console.error('Build.getPractices()', plane);
      return {};
    }
  }

  getPractices2(plane) {
    Main.Batch[compk].data[compk].pracs;
    if ((this.batch[plane] != null) && (this.batch[plane].data[plane] != null)) {
      return this.batch[plane].data[plane];
    } else {
      console.error('Build.getPractices()', plane);
      return {};
    }
  }

  getPractice(row, column, plane = this.plane) {
    var pkey, prac, practices;
    practices = this.getPractices(plane);
    for (pkey in practices) {
      if (!hasProp$2.call(practices, pkey)) continue;
      prac = practices[pkey];
      if (Util$1.isChild(pkey) && prac.column === column && prac.row === row) {
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

  getPracticeStudy(row, column, dir, plane = this.plane) {
    var practice, study;
    practice = this.getPractice(row, column, plane);
    study = this.getDir(practice, dir);
    return study;
  }

  getDir(practice, dir) {
    var skey, study;
    for (skey in practice) {
      if (!hasProp$2.call(practice, skey)) continue;
      study = practice[skey];
      if (Util$1.isChild(skey)) {
        if (study.dir === dir) {
          return study;
        }
      }
    }
    return null;
  }

  getDim(cname, dir) {
    var col, dim, key;
    col = this.getCol(cname);
    for (key in col) {
      dim = col[key];
      if (Util$1.isChild(key)) {
        if (dim.dir === dir) {
          return key;
        }
      }
    }
    return this.None;
  }

  getCol(cname) {
    return this.batch.Cols.data['Cols'][cname];
  }

  logPlanes() {
    var i, keyBase, keyItem, keyPlane, keyPractice, keyStudy, keyTopic, len, objBase, objItem, objPractice, objStudy, objTopic, practices, ref;
    console.log('----- Beg Log Planes  ------');
    ref = ['Info', 'Know', 'Wise'];
    for (i = 0, len = ref.length; i < len; i++) {
      keyPlane = ref[i];
      console.log("Plane: ", keyPlane);
      practices = this.getPractices(keyPlane);
      for (keyPractice in practices) {
        if (!hasProp$2.call(practices, keyPractice)) continue;
        objPractice = practices[keyPractice];
        if (!(Util$1.isChild(keyPractice))) {
          continue;
        }
        console.log("  Practice: ", keyPractice);
        for (keyStudy in objPractice) {
          if (!hasProp$2.call(objPractice, keyStudy)) continue;
          objStudy = objPractice[keyStudy];
          if (!(Util$1.isChild(keyStudy))) {
            continue;
          }
          console.log("    Study: ", keyStudy);
          for (keyTopic in objStudy) {
            if (!hasProp$2.call(objStudy, keyTopic)) continue;
            objTopic = objStudy[keyTopic];
            if (!(Util$1.isChild(keyTopic))) {
              continue;
            }
            console.log("      Topic: ", keyTopic);
            for (keyItem in objTopic) {
              if (!hasProp$2.call(objTopic, keyItem)) continue;
              objItem = objTopic[keyItem];
              if (!(Util$1.isChild(keyItem))) {
                continue;
              }
              console.log("        Item: ", keyItem);
              for (keyBase in objItem) {
                if (!hasProp$2.call(objItem, keyBase)) continue;
                objBase = objItem[keyBase];
                if (Util$1.isChild(keyBase)) {
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

  logBatch(batch) {
    var batKey, batObj, i, j, keyPractice, keyStudy, len, len1, objPractice, objStudy, packKey, packObj, ref, ref1;
    console.log('----- Beg Log Batch  ------');
    ref = ['Info', 'Know', 'Wise'];
    for (i = 0, len = ref.length; i < len; i++) {
      batKey = ref[i];
      console.log("Batch File: ", batKey);
      batObj = batch[batKey].data;
      ref1 = ['Info', 'Know', 'Wise', 'Cols', 'Rows'];
      for (j = 0, len1 = ref1.length; j < len1; j++) {
        packKey = ref1[j];
        packObj = batObj[packKey];
        console.log("  Pack: ", packKey, packObj);
        for (keyPractice in packObj) {
          if (!hasProp$2.call(packObj, keyPractice)) continue;
          objPractice = packObj[keyPractice];
          if (!(Util$1.isChild(keyPractice))) {
            continue;
          }
          console.log("    Practice: ", keyPractice);
          for (keyStudy in objPractice) {
            if (!hasProp$2.call(objPractice, keyStudy)) continue;
            objStudy = objPractice[keyStudy];
            if (Util$1.isChild(keyStudy)) {
              console.log("      Study: ", keyStudy);
            }
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
        console.log('  ', dir, dim.name, 'Learn', 'Do', 'Share');
        ref2 = ['Info', 'Know', 'Wise'];
        for (k = 0, len2 = ref2.length; k < len2; k++) {
          plane = ref2[k];
          lprac = this.getPractice('Learn', cname, plane);
          dprac = this.getPractice('Do', cname, plane);
          sprac = this.getPractice('Share', cname, plane);
          learn = this.getDir(lprac, dir);
          doit = this.getDir(dprac, dir);
          share = this.getDir(sprac, dir);
          console.log('    ', plane + ':', dim.name, learn.name, doit.name, share.name);
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
      console.log(col);
      obj = {};
      ref1 = ['west', 'north', 'east', 'south'];
      for (j = 0, len1 = ref1.length; j < len1; j++) {
        dir = ref1[j];
        dim = this.getDim(cname, dir);
        ref2 = ['Info', 'Know', 'Wise'];
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
        htm += "    <table>\n      <thead>\n        ";
        htm += `<tr><th>Plane</th><th>${dim}</th><th>Learn</th><th>Do</th><th>Share</th></tr>\n      </thead>\n      <tbody>\n`;
        ref2 = ['Info', 'Know', 'Wise'];
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
        htm += "      </tbody>\n    </table>\n";
      }
    }
    htm += "  </body>\n</html>\n";
    Data$1.saveHtml(name, htm);
  }

};

/*
getPrevNextPlanes:( plane ) ->

isPractice:( key, plane=@plane ) ->
@getPractices(plane)[key]?

logAdjacentPractices:() ->
@setAdjacents( @None )
for key, plane of @Planes
practices = @getPractices( key )
for own pkey, p of practices  when Util.isChild(pkey)
  @setAdjacents( p )
 * console.log( { p:key, column:p.column, west:p.west.name, east:p.east.name, north:p.north.name, south:p.south.name, prev:p.prev.name, next:p.next.name } )
return

 */
var Build$1 = Build;

var FontAwe;

FontAwe = {};

FontAwe.icons = {
  "fas fa-network-wired": "\uf6ff",
  "fas fa-warehouse": "\uf494",
  "fas fa-infinity": "\uf534",
  "fas fa-satellite": "\uf7bf",
  "fas fa-hands": "\uf4c2",
  "fas fa-chalkboard-teacher": "\uf51c",
  "fas fa-landmark": "\uf66f",
  "fas fa-podcast": "\uf2ce",
  "fas fa-hot-tub": "\uf593",
  "fas fa-brain": "\uf5dc",
  "fas fa-pen-fancy": "\uf5ac",
  "fas fa-shapes": "\uf61f",
  "fas fa-images": "\uf302",
  "fas fa-people-carry": "\uf4ce",
  "fas fa-poll": "\uf681",
  "fas fa-user-graduate": "\uf501",
  "fab fa-galactic-republic": "\uf50c",
  "fas fa-address-book": "\uf2b9",
  "fas fa-address-card": "\uf2bb",
  "fas fa-adjust": "\uf042",
  "fas fa-align-center": "\uf037",
  "fas fa-align-justify": "\uf039",
  "fas fa-align-left": "\uf036",
  "fas fa-align-right": "\uf038",
  "fas fa-allergies": "\uf461",
  "fas fa-ambulance": "\uf0f9",
  "fas fa-american-sign-language-interpreting": "\uf2a3",
  "fas fa-anchor": "\uf13d",
  "fas fa-angle-double-down": "\uf103",
  "fas fa-angle-double-left": "\uf100",
  "fas fa-angle-double-right": "\uf101",
  "fas fa-angle-double-up": "\uf102",
  "fas fa-angle-down": "\uf107",
  "fas fa-angle-left": "\uf104",
  "fas fa-angle-right": "\uf105",
  "fas fa-angle-up": "\uf106",
  "fas fa-archive": "\uf187",
  "fas fa-arrow-alt-circle-down": "\uf358",
  "fas fa-arrow-alt-circle-left": "\uf359",
  "fas fa-arrow-alt-circle-right": "\uf35a",
  "fas fa-arrow-alt-circle-up": "\uf35b",
  "fas fa-arrow-circle-down": "\uf0ab",
  "fas fa-arrow-circle-left": "\uf0a8",
  "fas fa-arrow-circle-right": "\uf0a9",
  "fas fa-arrow-circle-up": "\uf0aa",
  "fas fa-arrow-down": "\uf063",
  "fas fa-arrow-left": "\uf060",
  "fas fa-arrow-right": "\uf061",
  "fas fa-arrow-up": "\uf062",
  "fas fa-arrows-alt": "\uf0b2",
  "fas fa-arrows-alt-h": "\uf337",
  "fas fa-arrows-alt-v": "\uf338",
  "fas fa-assistive-listening-systems": "\uf2a2",
  "fas fa-asterisk": "\uf069",
  "fas fa-at": "\uf1fa",
  "fas fa-atom": "\uf5d2",
  "fas fa-atom fa-spin": "\uf5d2",
  "fas fa-audio-description": "\uf29e",
  "fas fa-backward": "\uf04a",
  "fas fa-balance-scale": "\uf24e",
  "fas fa-ban": "\uf05e",
  "fas fa-band-aid": "\uf462",
  "fas fa-barcode": "\uf02a",
  "fas fa-bars": "\uf0c9",
  "fas fa-baseball-ball": "\uf433",
  "fas fa-basketball-ball": "\uf434",
  "fas fa-bath": "\uf2cd",
  "fas fa-battery-empty": "\uf244",
  "fas fa-battery-full": "\uf240",
  "fas fa-battery-half": "\uf242",
  "fas fa-battery-quarter": "\uf243",
  "fas fa-battery-three-quarters": "\uf241",
  "fas fa-bed": "\uf236",
  "fas fa-beer": "\uf0fc",
  "fas fa-bell": "\uf0f3",
  "fas fa-bell-slash": "\uf1f6",
  "fas fa-bicycle": "\uf206",
  "fas fa-binoculars": "\uf1e5",
  "fas fa-birthday-cake": "\uf1fd",
  "fas fa-blind": "\uf29d",
  "fas fa-bold": "\uf032",
  "fas fa-bolt": "\uf0e7",
  "fas fa-bomb": "\uf1e2",
  "fas fa-book": "\uf02d",
  "fas fa-bookmark": "\uf02e",
  "fas fa-bowling-ball": "\uf436",
  "fas fa-box": "\uf466",
  "fas fa-box-open": "\uf49e",
  "fas fa-boxes": "\uf468",
  "fas fa-braille": "\uf2a1",
  "fas fa-briefcase": "\uf0b1",
  "fas fa-briefcase-medical": "\uf469",
  "fas fa-bug": "\uf188",
  "fas fa-building": "\uf1ad",
  "fas fa-bullhorn": "\uf0a1",
  "fas fa-bullseye": "\uf140",
  "fas fa-burn": "\uf46a",
  "fas fa-bus": "\uf207",
  "fas fa-calculator": "\uf1ec",
  "fas fa-calendar": "\uf133",
  "fas fa-calendar-alt": "\uf073",
  "fas fa-calendar-check": "\uf274",
  "fas fa-calendar-minus": "\uf272",
  "fas fa-calendar-plus": "\uf271",
  "fas fa-calendar-times": "\uf273",
  "fas fa-camera": "\uf030",
  "fas fa-camera-retro": "\uf083",
  "fas fa-capsules": "\uf46b",
  "fas fa-car": "\uf1b9",
  "fas fa-caret-down": "\uf0d7",
  "fas fa-caret-left": "\uf0d9",
  "fas fa-caret-right": "\uf0da",
  "fas fa-caret-square-down": "\uf150",
  "fas fa-caret-square-left": "\uf191",
  "fas fa-caret-square-right": "\uf152",
  "fas fa-caret-square-up": "\uf151",
  "fas fa-caret-up": "\uf0d8",
  "fas fa-cart-arrow-down": "\uf218",
  "fas fa-cart-plus": "\uf217",
  "fas fa-certificate": "\uf0a3",
  "fas fa-chart-area": "\uf1fe",
  "fas fa-chart-bar": "\uf080",
  "fas fa-chart-line": "\uf201",
  "fas fa-chart-pie": "\uf200",
  "fas fa-check": "\uf00c",
  "fas fa-check-circle": "\uf058",
  "fas fa-check-square": "\uf14a",
  "fas fa-chess": "\uf439",
  "fas fa-chess-bishop": "\uf43a",
  "fas fa-chess-board": "\uf43c",
  "fas fa-chess-king": "\uf43f",
  "fas fa-chess-knight": "\uf441",
  "fas fa-chess-pawn": "\uf443",
  "fas fa-chess-queen": "\uf445",
  "fas fa-chess-rook": "\uf447",
  "fas fa-chevron-circle-down": "\uf13a",
  "fas fa-chevron-circle-left": "\uf137",
  "fas fa-chevron-circle-right": "\uf138",
  "fas fa-chevron-circle-up": "\uf139",
  "fas fa-chevron-down": "\uf078",
  "fas fa-chevron-left": "\uf053",
  "fas fa-chevron-right": "\uf054",
  "fas fa-chevron-up": "\uf077",
  "fas fa-child": "\uf1ae",
  "fas fa-circle": "\uf111",
  "fas fa-circle-notch": "\uf1ce",
  "fas fa-clipboard": "\uf328",
  "fas fa-clipboard-check": "\uf46c",
  "fas fa-clipboard-list": "\uf46d",
  "fas fa-clock": "\uf017",
  "fas fa-clone": "\uf24d",
  "fas fa-closed-captioning": "\uf20a",
  "fas fa-cloud": "\uf0c2",
  "fas fa-cloud-download-alt": "\uf381",
  "fas fa-cloud-upload-alt": "\uf382",
  "fas fa-code": "\uf121",
  "fas fa-code-branch": "\uf126",
  "fas fa-coffee": "\uf0f4",
  "fas fa-cog": "\uf013",
  "fas fa-cogs": "\uf085",
  "fas fa-columns": "\uf0db",
  "fas fa-comment": "\uf075",
  "fas fa-comment-alt": "\uf27a",
  "fas fa-comment-dots": "\uf4ad",
  "fas fa-comment-slash": "\uf4b3",
  "fas fa-comments": "\uf086",
  "fas fa-compass": "\uf14e",
  "fas fa-compress": "\uf066",
  "fas fa-copy": "\uf0c5",
  "fas fa-copyright": "\uf1f9",
  "fas fa-couch": "\uf4b8",
  "fas fa-credit-card": "\uf09d",
  "fas fa-crop": "\uf125",
  "fas fa-crosshairs": "\uf05b",
  "fas fa-cube": "\uf1b2",
  "fas fa-cubes": "\uf1b3",
  "fas fa-cut": "\uf0c4",
  "fas fa-database": "\uf1c0",
  "fas fa-deaf": "\uf2a4",
  "fas fa-desktop": "\uf108",
  "fas fa-diagnoses": "\uf470",
  "fas fa-dna": "\uf471",
  "fas fa-dollar-sign": "\uf155",
  "fas fa-dolly": "\uf472",
  "fas fa-dolly-flatbed": "\uf474",
  "fas fa-donate": "\uf4b9",
  "fas fa-dot-circle": "\uf192",
  "fas fa-dove": "\uf4ba",
  "fas fa-download": "\uf019",
  "fas fa-edit": "\uf044",
  "fas fa-eject": "\uf052",
  "fas fa-ellipsis-h": "\uf141",
  "fas fa-ellipsis-v": "\uf142",
  "fas fa-envelope": "\uf0e0",
  "fas fa-envelope-open": "\uf2b6",
  "fas fa-envelope-square": "\uf199",
  "fas fa-eraser": "\uf12d",
  "fas fa-euro-sign": "\uf153",
  "fas fa-exchange-alt": "\uf362",
  "fas fa-exclamation": "\uf12a",
  "fas fa-exclamation-circle": "\uf06a",
  "fas fa-exclamation-triangle": "\uf071",
  "fas fa-expand": "\uf065",
  "fas fa-expand-arrows-alt": "\uf31e",
  "fas fa-external-link-alt": "\uf35d",
  "fas fa-external-link-square-alt": "\uf360",
  "fas fa-eye": "\uf06e",
  "fas fa-eye-dropper": "\uf1fb",
  "fas fa-eye-slash": "\uf070",
  "fas fa-fast-backward": "\uf049",
  "fas fa-fast-forward": "\uf050",
  "fas fa-fax": "\uf1ac",
  "fas fa-female": "\uf182",
  "fas fa-fighter-jet": "\uf0fb",
  "fas fa-file": "\uf15b",
  "fas fa-file-alt": "\uf15c",
  "fas fa-file-archive": "\uf1c6",
  "fas fa-file-audio": "\uf1c7",
  "fas fa-file-code": "\uf1c9",
  "fas fa-file-excel": "\uf1c3",
  "fas fa-file-image": "\uf1c5",
  "fas fa-file-medical": "\uf477",
  "fas fa-file-medical-alt": "\uf478",
  "fas fa-file-pdf": "\uf1c1",
  "fas fa-file-powerpoint": "\uf1c4",
  "fas fa-file-video": "\uf1c8",
  "fas fa-file-word": "\uf1c2",
  "fas fa-film": "\uf008",
  "fas fa-filter": "\uf0b0",
  "fas fa-fire": "\uf06d",
  "fas fa-fire-extinguisher": "\uf134",
  "fas fa-first-aid": "\uf479",
  "fas fa-flag": "\uf024",
  "fas fa-flag-checkered": "\uf11e",
  "fas fa-flask": "\uf0c3",
  "fas fa-folder": "\uf07b",
  "fas fa-folder-open": "\uf07c",
  "fas fa-font": "\uf031",
  "fas fa-football-ball": "\uf44e",
  "fas fa-forward": "\uf04e",
  "fas fa-frown": "\uf119",
  "fas fa-futbol": "\uf1e3",
  "fas fa-gamepad": "\uf11b",
  "fas fa-gavel": "\uf0e3",
  "fas fa-gem": "\uf3a5",
  "fas fa-genderless": "\uf22d",
  "fas fa-gift": "\uf06b",
  "fas fa-glass-martini": "\uf000",
  "fas fa-globe": "\uf0ac",
  "fas fa-golf-ball": "\uf450",
  "fas fa-graduation-cap": "\uf19d",
  "fas fa-h-square": "\uf0fd",
  "fas fa-hand-holding": "\uf4bd",
  "fas fa-hand-holding-heart": "\uf4be",
  "fas fa-hand-holding-usd": "\uf4c0",
  "fas fa-hand-lizard": "\uf258",
  "fas fa-hand-paper": "\uf256",
  "fas fa-hand-peace": "\uf25b",
  "fas fa-hand-point-down": "\uf0a7",
  "fas fa-hand-point-left": "\uf0a5",
  "fas fa-hand-point-right": "\uf0a4",
  "fas fa-hand-point-up": "\uf0a6",
  "fas fa-hand-pointer": "\uf25a",
  "fas fa-hand-rock": "\uf255",
  "fas fa-hand-scissors": "\uf257",
  "fas fa-hand-spock": "\uf259",
  "fas fa-hands": "\uf4c2",
  "fas fa-hands-helping": "\uf4c4",
  "fas fa-handshake": "\uf2b5",
  "fas fa-hashtag": "\uf292",
  "fas fa-hdd": "\uf0a0",
  "fas fa-heading": "\uf1dc",
  "fas fa-headphones": "\uf025",
  "fas fa-heart": "\uf004",
  "fas fa-heartbeat": "\uf21e",
  "fas fa-history": "\uf1da",
  "fas fa-hockey-puck": "\uf453",
  "fas fa-home": "\uf015",
  "fas fa-hospital": "\uf0f8",
  "fas fa-hospital-alt": "\uf47d",
  "fas fa-hospital-symbol": "\uf47e",
  "fas fa-hourglass": "\uf254",
  "fas fa-hourglass-end": "\uf253",
  "fas fa-hourglass-half": "\uf252",
  "fas fa-hourglass-start": "\uf251",
  "fas fa-i-cursor": "\uf246",
  "fas fa-id-badge": "\uf2c1",
  "fas fa-id-card": "\uf2c2",
  "fas fa-id-card-alt": "\uf47f",
  "fas fa-image": "\uf03e",
  "fas fa-inbox": "\uf01c",
  "fas fa-indent": "\uf03c",
  "fas fa-industry": "\uf275",
  "fas fa-info": "\uf129",
  "fas fa-info-circle": "\uf05a",
  "fas fa-italic": "\uf033",
  "fas fa-key": "\uf084",
  "fas fa-keyboard": "\uf11c",
  "fas fa-language": "\uf1ab",
  "fas fa-laptop": "\uf109",
  "fas fa-leaf": "\uf06c",
  "fas fa-lemon": "\uf094",
  "fas fa-level-down-alt": "\uf3be",
  "fas fa-level-up-alt": "\uf3bf",
  "fas fa-life-ring": "\uf1cd",
  "fas fa-lightbulb": "\uf0eb",
  "fas fa-link": "\uf0c1",
  "fas fa-lira-sign": "\uf195",
  "fas fa-list": "\uf03a",
  "fas fa-list-alt": "\uf022",
  "fas fa-list-ol": "\uf0cb",
  "fas fa-list-ul": "\uf0ca",
  "fas fa-location-arrow": "\uf124",
  "fas fa-lock": "\uf023",
  "fas fa-lock-open": "\uf3c1",
  "fas fa-long-arrow-alt-down": "\uf309",
  "fas fa-long-arrow-alt-left": "\uf30a",
  "fas fa-long-arrow-alt-right": "\uf30b",
  "fas fa-long-arrow-alt-up": "\uf30c",
  "fas fa-low-vision": "\uf2a8",
  "fas fa-magic": "\uf0d0",
  "fas fa-magnet": "\uf076",
  "fas fa-male": "\uf183",
  "fas fa-map": "\uf279",
  "fas fa-map-marker": "\uf041",
  "fas fa-map-marker-alt": "\uf3c5",
  "fas fa-map-pin": "\uf276",
  "fas fa-map-signs": "\uf277",
  "fas fa-mars": "\uf222",
  "fas fa-mars-double": "\uf227",
  "fas fa-mars-stroke": "\uf229",
  "fas fa-mars-stroke-h": "\uf22b",
  "fas fa-mars-stroke-v": "\uf22a",
  "fas fa-medkit": "\uf0fa",
  "fas fa-meh": "\uf11a",
  "fas fa-mercury": "\uf223",
  "fas fa-microchip": "\uf2db",
  "fas fa-microphone": "\uf130",
  "fas fa-microphone-slash": "\uf131",
  "fas fa-minus": "\uf068",
  "fas fa-minus-circle": "\uf056",
  "fas fa-minus-square": "\uf146",
  "fas fa-mobile": "\uf10b",
  "fas fa-mobile-alt": "\uf3cd",
  "fas fa-money-bill-alt": "\uf3d1",
  "fas fa-moon": "\uf186",
  "fas fa-motorcycle": "\uf21c",
  "fas fa-mouse-pointer": "\uf245",
  "fas fa-music": "\uf001",
  "fas fa-neuter": "\uf22c",
  "fas fa-newspaper": "\uf1ea",
  "fas fa-notes-medical": "\uf481",
  "fas fa-object-group": "\uf247",
  "fas fa-object-ungroup": "\uf248",
  "fas fa-outdent": "\uf03b",
  "fas fa-paint-brush": "\uf1fc",
  "fas fa-pallet": "\uf482",
  "fas fa-paper-plane": "\uf1d8",
  "fas fa-paperclip": "\uf0c6",
  "fas fa-parachute-box": "\uf4cd",
  "fas fa-paragraph": "\uf1dd",
  "fas fa-paste": "\uf0ea",
  "fas fa-pause": "\uf04c",
  "fas fa-pause-circle": "\uf28b",
  "fas fa-paw": "\uf1b0",
  "fas fa-pen-square": "\uf14b",
  "fas fa-pencil-alt": "\uf303",
  "fas fa-percent": "\uf295",
  "fas fa-phone": "\uf095",
  "fas fa-phone-slash": "\uf3dd",
  "fas fa-phone-square": "\uf098",
  "fas fa-phone-volume": "\uf2a0",
  "fas fa-piggy-bank": "\uf4d3",
  "fas fa-pills": "\uf484",
  "fas fa-plane": "\uf072",
  "fas fa-play": "\uf04b",
  "fas fa-play-circle": "\uf144",
  "fas fa-plug": "\uf1e6",
  "fas fa-plus": "\uf067",
  "fas fa-plus-circle": "\uf055",
  "fas fa-plus-square": "\uf0fe",
  "fas fa-poo": "\uf2fe",
  "fas fa-pound-sign": "\uf154",
  "fas fa-power-off": "\uf011",
  "fas fa-prescription-bottle": "\uf485",
  "fas fa-prescription-bottle-alt": "\uf486",
  "fas fa-print": "\uf02f",
  "fas fa-procedures": "\uf487",
  "fas fa-puzzle-piece": "\uf12e",
  "fas fa-qrcode": "\uf029",
  "fas fa-question": "\uf128",
  "fas fa-question-circle": "\uf059",
  "fas fa-quidditch": "\uf458",
  "fas fa-quote-left": "\uf10d",
  "fas fa-quote-right": "\uf10e",
  "fas fa-random": "\uf074",
  "fas fa-recycle": "\uf1b8",
  "fas fa-redo": "\uf01e",
  "fas fa-redo-alt": "\uf2f9",
  "fas fa-registered": "\uf25d",
  "fas fa-reply": "\uf3e5",
  "fas fa-reply-all": "\uf122",
  "fas fa-retweet": "\uf079",
  "fas fa-ribbon": "\uf4d6",
  "fas fa-road": "\uf018",
  "fas fa-rocket": "\uf135",
  "fas fa-rss": "\uf09e",
  "fas fa-rss-square": "\uf143",
  "fas fa-ruble-sign": "\uf158",
  "fas fa-rupee-sign": "\uf156",
  "fas fa-save": "\uf0c7",
  "fas fa-search": "\uf002",
  "fas fa-search-minus": "\uf010",
  "fas fa-search-plus": "\uf00e",
  "fas fa-seedling": "\uf4d8",
  "fas fa-server": "\uf233",
  "fas fa-share": "\uf064",
  "fas fa-share-alt": "\uf1e0",
  "fas fa-share-alt-square": "\uf1e1",
  "fas fa-share-square": "\uf14d",
  "fas fa-shekel-sign": "\uf20b",
  "fas fa-shield-alt": "\uf3ed",
  "fas fa-ship": "\uf21a",
  "fas fa-shipping-fast": "\uf48b",
  "fas fa-shopping-bag": "\uf290",
  "fas fa-shopping-basket": "\uf291",
  "fas fa-shopping-cart": "\uf07a",
  "fas fa-shower": "\uf2cc",
  "fas fa-sign": "\uf4d9",
  "fas fa-sign-in-alt": "\uf2f6",
  "fas fa-sign-language": "\uf2a7",
  "fas fa-sign-out-alt": "\uf2f5",
  "fas fa-signal": "\uf012",
  "fas fa-sitemap": "\uf0e8",
  "fas fa-sliders-h": "\uf1de",
  "fas fa-smile": "\uf118",
  "fas fa-smoking": "\uf48d",
  "fas fa-snowflake": "\uf2dc",
  "fas fa-sort": "\uf0dc",
  "fas fa-sort-alpha-down": "\uf15d",
  "fas fa-sort-alpha-up": "\uf15e",
  "fas fa-sort-amount-down": "\uf160",
  "fas fa-sort-amount-up": "\uf161",
  "fas fa-sort-down": "\uf0dd",
  "fas fa-sort-numeric-down": "\uf162",
  "fas fa-sort-numeric-up": "\uf163",
  "fas fa-sort-up": "\uf0de",
  "fas fa-space-shuttle": "\uf197",
  "fas fa-spinner": "\uf110",
  "fas fa-spinner fa-pulse": "\uf110",
  "fas fa-square": "\uf0c8",
  "fas fa-square-full": "\uf45c",
  "fas fa-star": "\uf005",
  "fas fa-star-half": "\uf089",
  "fas fa-step-backward": "\uf048",
  "fas fa-step-forward": "\uf051",
  "fas fa-stethoscope": "\uf0f1",
  "fas fa-sticky-note": "\uf249",
  "fas fa-stop": "\uf04d",
  "fas fa-stop-circle": "\uf28d",
  "fas fa-stopwatch": "\uf2f2",
  "fas fa-street-view": "\uf21d",
  "fas fa-strikethrough": "\uf0cc",
  "fas fa-subscript": "\uf12c",
  "fas fa-subway": "\uf239",
  "fas fa-suitcase": "\uf0f2",
  "fas fa-sun": "\uf185",
  "fas fa-superscript": "\uf12b",
  "fas fa-sync": "\uf021",
  "fas fa-sync fa-spin": "\uf021",
  "fas fa-sync-alt": "\uf2f1",
  "fas fa-syringe": "\uf48e",
  "fas fa-table": "\uf0ce",
  "fas fa-table-tennis": "\uf45d",
  "fas fa-tablet": "\uf10a",
  "fas fa-tablet-alt": "\uf3fa",
  "fas fa-tablets": "\uf490",
  "fas fa-tachometer-alt": "\uf3fd",
  "fas fa-tag": "\uf02b",
  "fas fa-tags": "\uf02c",
  "fas fa-tape": "\uf4db",
  "fas fa-tasks": "\uf0ae",
  "fas fa-taxi": "\uf1ba",
  "fas fa-terminal": "\uf120",
  "fas fa-text-height": "\uf034",
  "fas fa-text-width": "\uf035",
  "fas fa-th": "\uf00a",
  "fas fa-th-large": "\uf009",
  "fas fa-th-list": "\uf00b",
  "fas fa-thermometer": "\uf491",
  "fas fa-thermometer-empty": "\uf2cb",
  "fas fa-thermometer-full": "\uf2c7",
  "fas fa-thermometer-half": "\uf2c9",
  "fas fa-thermometer-quarter": "\uf2ca",
  "fas fa-thermometer-three-quarters": "\uf2c8",
  "fas fa-thumbs-down": "\uf165",
  "fas fa-thumbs-up": "\uf164",
  "fas fa-thumbtack": "\uf08d",
  "fas fa-ticket-alt": "\uf3ff",
  "fas fa-times": "\uf00d",
  "fas fa-times-circle": "\uf057",
  "fas fa-tint": "\uf043",
  "fas fa-toggle-off": "\uf204",
  "fas fa-toggle-on": "\uf205",
  "fas fa-trademark": "\uf25c",
  "fas fa-train": "\uf238",
  "fas fa-transgender": "\uf224",
  "fas fa-transgender-alt": "\uf225",
  "fas fa-trash": "\uf1f8",
  "fas fa-trash-alt": "\uf2ed",
  "fas fa-tree": "\uf1bb",
  "fas fa-trophy": "\uf091",
  "fas fa-truck": "\uf0d1",
  "fas fa-truck-loading": "\uf4de",
  "fas fa-truck-moving": "\uf4df",
  "fas fa-tty": "\uf1e4",
  "fas fa-tv": "\uf26c",
  "fas fa-umbrella": "\uf0e9",
  "fas fa-underline": "\uf0cd",
  "fas fa-undo": "\uf0e2",
  "fas fa-undo-alt": "\uf2ea",
  "fas fa-universal-access": "\uf29a",
  "fas fa-university": "\uf19c",
  "fas fa-unlink": "\uf127",
  "fas fa-unlock": "\uf09c",
  "fas fa-unlock-alt": "\uf13e",
  "fas fa-upload": "\uf093",
  "fas fa-user": "\uf007",
  "fas fa-user-circle": "\uf2bd",
  "fas fa-user-md": "\uf0f0",
  "fas fa-user-plus": "\uf234",
  "fas fa-user-secret": "\uf21b",
  "fas fa-user-times": "\uf235",
  "fas fa-user-friends": "\uf500",
  "fas fa-users": "\uf0c0",
  "fas fa-utensil-spoon": "\uf2e5",
  "fas fa-utensils": "\uf2e7",
  "fas fa-venus": "\uf221",
  "fas fa-venus-double": "\uf226",
  "fas fa-venus-mars": "\uf228",
  "fas fa-vial": "\uf492",
  "fas fa-vials": "\uf493",
  "fas fa-video": "\uf03d",
  "fas fa-video-slash": "\uf4e2",
  "fas fa-volleyball-ball": "\uf45f",
  "fas fa-volume-down": "\uf027",
  "fas fa-volume-off": "\uf026",
  "fas fa-volume-up": "\uf028",
  "fas fa-weight": "\uf496",
  "fas fa-wheelchair": "\uf193",
  "fas fa-wifi": "\uf1eb",
  "fas fa-window-close": "\uf410",
  "fas fa-window-maximize": "\uf2d0",
  "fas fa-window-minimize": "\uf2d1",
  "fas fa-window-restore": "\uf2d2",
  "fas fa-wine-glass": "\uf4e3",
  "fas fa-won-sign": "\uf159",
  "fas fa-wrench": "\uf0ad",
  "fas fa-x-ray": "\uf497",
  "fas fa-yen-sign": "\uf157",
  "fab fa-500px": "\uf26e",
  "fab fa-accessible-icon": "\uf368",
  "fab fa-accusoft": "\uf369",
  "fab fa-adn": "\uf170",
  "fab fa-adversal": "\uf36a",
  "fab fa-affiliatetheme": "\uf36b",
  "fab fa-algolia": "\uf36c",
  "fab fa-amazon": "\uf270",
  "fab fa-amazon-pay": "\uf42c",
  "fab fa-amilia": "\uf36d",
  "fab fa-android": "\uf17b",
  "fab fa-angellist": "\uf209",
  "fab fa-angrycreative": "\uf36e",
  "fab fa-angular": "\uf420",
  "fab fa-app-store": "\uf36f",
  "fab fa-app-store-ios": "\uf370",
  "fab fa-apper": "\uf371",
  "fab fa-apple": "\uf179",
  "fab fa-apple-pay": "\uf415",
  "fab fa-asymmetrik": "\uf372",
  "fab fa-audible": "\uf373",
  "fab fa-autoprefixer": "\uf41c",
  "fab fa-avianex": "\uf374",
  "fab fa-aviato": "\uf421",
  "fab fa-aws": "\uf375",
  "fab fa-bandcamp": "\uf2d5",
  "fab fa-behance": "\uf1b4",
  "fab fa-behance-square": "\uf1b5",
  "fab fa-bimobject": "\uf378",
  "fab fa-bitbucket": "\uf171",
  "fab fa-bitcoin": "\uf379",
  "fab fa-bity": "\uf37a",
  "fab fa-black-tie": "\uf27e",
  "fab fa-blackberry": "\uf37b",
  "fab fa-blogger": "\uf37c",
  "fab fa-blogger-b": "\uf37d",
  "fab fa-bluetooth": "\uf293",
  "fab fa-bluetooth-b": "\uf294",
  "fab fa-btc": "\uf15a",
  "fab fa-buromobelexperte": "\uf37f",
  "fab fa-buysellads": "\uf20d",
  "fab fa-cc-amazon-pay": "\uf42d",
  "fab fa-cc-amex": "\uf1f3",
  "fab fa-cc-apple-pay": "\uf416",
  "fab fa-cc-diners-club": "\uf24c",
  "fab fa-cc-discover": "\uf1f2",
  "fab fa-cc-jcb": "\uf24b",
  "fab fa-cc-mastercard": "\uf1f1",
  "fab fa-cc-paypal": "\uf1f4",
  "fab fa-cc-stripe": "\uf1f5",
  "fab fa-cc-visa": "\uf1f0",
  "fab fa-centercode": "\uf380",
  "fab fa-chrome": "\uf268",
  "fab fa-cloudscale": "\uf383",
  "fab fa-cloudsmith": "\uf384",
  "fab fa-cloudversify": "\uf385",
  "fab fa-codepen": "\uf1cb",
  "fab fa-codiepie": "\uf284",
  "fab fa-connectdevelop": "\uf20e",
  "fab fa-contao": "\uf26d",
  "fab fa-cpanel": "\uf388",
  "fab fa-creative-commons": "\uf25e",
  "fab fa-css3": "\uf13c",
  "fab fa-css3-alt": "\uf38b",
  "fab fa-cuttlefish": "\uf38c",
  "fab fa-d-and-d": "\uf38d",
  "fab fa-dashcube": "\uf210",
  "fab fa-delicious": "\uf1a5",
  "fab fa-deploydog": "\uf38e",
  "fab fa-deskpro": "\uf38f",
  "fab fa-deviantart": "\uf1bd",
  "fab fa-digg": "\uf1a6",
  "fab fa-digital-ocean": "\uf391",
  "fab fa-discord": "\uf392",
  "fab fa-discourse": "\uf393",
  "fab fa-dochub": "\uf394",
  "fab fa-docker": "\uf395",
  "fab fa-draft2digital": "\uf396",
  "fab fa-dribbble": "\uf17d",
  "fab fa-dribbble-square": "\uf397",
  "fab fa-dropbox": "\uf16b",
  "fab fa-drupal": "\uf1a9",
  "fab fa-dyalog": "\uf399",
  "fab fa-earlybirds": "\uf39a",
  "fab fa-edge": "\uf282",
  "fab fa-elementor": "\uf430",
  "fab fa-ember": "\uf423",
  "fab fa-empire": "\uf1d1",
  "fab fa-envira": "\uf299",
  "fab fa-erlang": "\uf39d",
  "fab fa-ethereum": "\uf42e",
  "fab fa-etsy": "\uf2d7",
  "fab fa-expeditedssl": "\uf23e",
  "fab fa-facebook": "\uf09a",
  "fab fa-facebook-f": "\uf39e",
  "fab fa-facebook-messenger": "\uf39f",
  "fab fa-facebook-square": "\uf082",
  "fab fa-firefox": "\uf269",
  "fab fa-first-order": "\uf2b0",
  "fab fa-firstdraft": "\uf3a1",
  "fab fa-flickr": "\uf16e",
  "fab fa-flipboard": "\uf44d",
  "fab fa-fly": "\uf417",
  "fab fa-font-awesome": "\uf2b4",
  "fab fa-font-awesome-alt": "\uf35c",
  "fab fa-font-awesome-flag": "\uf425",
  "fab fa-fonticons": "\uf280",
  "fab fa-fonticons-fi": "\uf3a2",
  "fab fa-fort-awesome": "\uf286",
  "fab fa-fort-awesome-alt": "\uf3a3",
  "fab fa-forumbee": "\uf211",
  "fab fa-foursquare": "\uf180",
  "fab fa-free-code-camp": "\uf2c5",
  "fab fa-freebsd": "\uf3a4",
  "fab fa-get-pocket": "\uf265",
  "fab fa-gg": "\uf260",
  "fab fa-gg-circle": "\uf261",
  "fab fa-git": "\uf1d3",
  "fab fa-git-square": "\uf1d2",
  "fab fa-github": "\uf09b",
  "fab fa-github-alt": "\uf113",
  "fab fa-github-square": "\uf092",
  "fab fa-gitkraken": "\uf3a6",
  "fab fa-gitlab": "\uf296",
  "fab fa-gitter": "\uf426",
  "fab fa-glide": "\uf2a5",
  "fab fa-glide-g": "\uf2a6",
  "fab fa-gofore": "\uf3a7",
  "fab fa-goodreads": "\uf3a8",
  "fab fa-goodreads-g": "\uf3a9",
  "fab fa-google": "\uf1a0",
  "fab fa-google-drive": "\uf3aa",
  "fab fa-google-play": "\uf3ab",
  "fab fa-google-plus": "\uf2b3",
  "fab fa-google-plus-g": "\uf0d5",
  "fab fa-google-plus-square": "\uf0d4",
  "fab fa-google-wallet": "\uf1ee",
  "fab fa-gratipay": "\uf184",
  "fab fa-grav": "\uf2d6",
  "fab fa-gripfire": "\uf3ac",
  "fab fa-grunt": "\uf3ad",
  "fab fa-gulp": "\uf3ae",
  "fab fa-hacker-news": "\uf1d4",
  "fab fa-hacker-news-square": "\uf3af",
  "fab fa-hips": "\uf452",
  "fab fa-hire-a-helper": "\uf3b0",
  "fab fa-hooli": "\uf427",
  "fab fa-hotjar": "\uf3b1",
  "fab fa-houzz": "\uf27c",
  "fab fa-html5": "\uf13b",
  "fab fa-hubspot": "\uf3b2",
  "fab fa-imdb": "\uf2d8",
  "fab fa-instagram": "\uf16d",
  "fab fa-internet-explorer": "\uf26b",
  "fab fa-ioxhost": "\uf208",
  "fab fa-itunes": "\uf3b4",
  "fab fa-itunes-note": "\uf3b5",
  "fab fa-java": "\uf4e4",
  "fab fa-jenkins": "\uf3b6",
  "fab fa-joget": "\uf3b7",
  "fab fa-joomla": "\uf1aa",
  "fab fa-js": "\uf3b8",
  "fab fa-js-square": "\uf3b9",
  "fab fa-jsfiddle": "\uf1cc",
  "fab fa-keycdn": "\uf3ba",
  "fab fa-kickstarter": "\uf3bb",
  "fab fa-kickstarter-k": "\uf3bc",
  "fab fa-korvue": "\uf42f",
  "fab fa-laravel": "\uf3bd",
  "fab fa-lastfm": "\uf202",
  "fab fa-lastfm-square": "\uf203",
  "fab fa-leanpub": "\uf212",
  "fab fa-less": "\uf41d",
  "fab fa-line": "\uf3c0",
  "fab fa-linkedin": "\uf08c",
  "fab fa-linkedin-in": "\uf0e1",
  "fab fa-linode": "\uf2b8",
  "fab fa-linux": "\uf17c",
  "fab fa-lyft": "\uf3c3",
  "fab fa-magento": "\uf3c4",
  "fab fa-maxcdn": "\uf136",
  "fab fa-medapps": "\uf3c6",
  "fab fa-medium": "\uf23a",
  "fab fa-medium-m": "\uf3c7",
  "fab fa-medrt": "\uf3c8",
  "fab fa-meetup": "\uf2e0",
  "fab fa-microsoft": "\uf3ca",
  "fab fa-mix": "\uf3cb",
  "fab fa-mixcloud": "\uf289",
  "fab fa-mizuni": "\uf3cc",
  "fab fa-modx": "\uf285",
  "fab fa-monero": "\uf3d0",
  "fab fa-napster": "\uf3d2",
  "fab fa-nintendo-switch": "\uf418",
  "fab fa-node": "\uf419",
  "fab fa-node-js": "\uf3d3",
  "fab fa-npm": "\uf3d4",
  "fab fa-ns8": "\uf3d5",
  "fab fa-nutritionix": "\uf3d6",
  "fab fa-odnoklassniki": "\uf263",
  "fab fa-odnoklassniki-square": "\uf264",
  "fab fa-opencart": "\uf23d",
  "fab fa-openid": "\uf19b",
  "fab fa-opera": "\uf26a",
  "fab fa-optin-monster": "\uf23c",
  "fab fa-osi": "\uf41a",
  "fab fa-page4": "\uf3d7",
  "fab fa-pagelines": "\uf18c",
  "fab fa-palfed": "\uf3d8",
  "fab fa-patreon": "\uf3d9",
  "fab fa-paypal": "\uf1ed",
  "fab fa-periscope": "\uf3da",
  "fab fa-phabricator": "\uf3db",
  "fab fa-phoenix-framework": "\uf3dc",
  "fab fa-php": "\uf457",
  "fab fa-pied-piper": "\uf2ae",
  "fab fa-pied-piper-alt": "\uf1a8",
  "fab fa-pied-piper-hat": "\uf4e5",
  "fab fa-pied-piper-pp": "\uf1a7",
  "fab fa-pinterest": "\uf0d2",
  "fab fa-pinterest-p": "\uf231",
  "fab fa-pinterest-square": "\uf0d3",
  "fab fa-playstation": "\uf3df",
  "fab fa-product-hunt": "\uf288",
  "fab fa-pushed": "\uf3e1",
  "fab fa-python": "\uf3e2",
  "fab fa-qq": "\uf1d6",
  "fab fa-quinscape": "\uf459",
  "fab fa-quora": "\uf2c4",
  "fab fa-ravelry": "\uf2d9",
  "fab fa-react": "\uf41b",
  "fab fa-readme": "\uf4d5",
  "fab fa-rebel": "\uf1d0",
  "fab fa-red-river": "\uf3e3",
  "fab fa-reddit": "\uf1a1",
  "fab fa-reddit-alien": "\uf281",
  "fab fa-reddit-square": "\uf1a2",
  "fab fa-rendact": "\uf3e4",
  "fab fa-renren": "\uf18b",
  "fab fa-replyd": "\uf3e6",
  "fab fa-resolving": "\uf3e7",
  "fab fa-rocketchat": "\uf3e8",
  "fab fa-rockrms": "\uf3e9",
  "fab fa-safari": "\uf267",
  "fab fa-sass": "\uf41e",
  "fab fa-schlix": "\uf3ea",
  "fab fa-scribd": "\uf28a",
  "fab fa-searchengin": "\uf3eb",
  "fab fa-sellcast": "\uf2da",
  "fab fa-sellsy": "\uf213",
  "fab fa-servicestack": "\uf3ec",
  "fab fa-shirtsinbulk": "\uf214",
  "fab fa-simplybuilt": "\uf215",
  "fab fa-sistrix": "\uf3ee",
  "fab fa-skyatlas": "\uf216",
  "fab fa-skype": "\uf17e",
  "fab fa-slack": "\uf198",
  "fab fa-slack-hash": "\uf3ef",
  "fab fa-slideshare": "\uf1e7",
  "fab fa-snapchat": "\uf2ab",
  "fab fa-snapchat-ghost": "\uf2ac",
  "fab fa-snapchat-square": "\uf2ad",
  "fab fa-soundcloud": "\uf1be",
  "fab fa-speakap": "\uf3f3",
  "fab fa-spotify": "\uf1bc",
  "fab fa-stack-exchange": "\uf18d",
  "fab fa-stack-overflow": "\uf16c",
  "fab fa-staylinked": "\uf3f5",
  "fab fa-steam": "\uf1b6",
  "fab fa-steam-square": "\uf1b7",
  "fab fa-steam-symbol": "\uf3f6",
  "fab fa-sticker-mule": "\uf3f7",
  "fab fa-strava": "\uf428",
  "fab fa-stripe": "\uf429",
  "fab fa-stripe-s": "\uf42a",
  "fab fa-studiovinari": "\uf3f8",
  "fab fa-stumbleupon": "\uf1a4",
  "fab fa-stumbleupon-circle": "\uf1a3",
  "fab fa-superpowers": "\uf2dd",
  "fab fa-supple": "\uf3f9",
  "fab fa-telegram": "\uf2c6",
  "fab fa-telegram-plane": "\uf3fe",
  "fab fa-tencent-weibo": "\uf1d5",
  "fab fa-themeisle": "\uf2b2",
  "fab fa-trello": "\uf181",
  "fab fa-tripadvisor": "\uf262",
  "fab fa-tumblr": "\uf173",
  "fab fa-tumblr-square": "\uf174",
  "fab fa-twitch": "\uf1e8",
  "fab fa-twitter": "\uf099",
  "fab fa-twitter-square": "\uf081",
  "fab fa-typo3": "\uf42b",
  "fab fa-uber": "\uf402",
  "fab fa-uikit": "\uf403",
  "fab fa-uniregistry": "\uf404",
  "fab fa-untappd": "\uf405",
  "fab fa-usb": "\uf287",
  "fab fa-ussunnah": "\uf407",
  "fab fa-vaadin": "\uf408",
  "fab fa-viacoin": "\uf237",
  "fab fa-viadeo": "\uf2a9",
  "fab fa-viadeo-square": "\uf2aa",
  "fab fa-viber": "\uf409",
  "fab fa-vimeo": "\uf40a",
  "fab fa-vimeo-square": "\uf194",
  "fab fa-vimeo-v": "\uf27d",
  "fab fa-vine": "\uf1ca",
  "fab fa-vk": "\uf189",
  "fab fa-vnv": "\uf40b",
  "fab fa-vuejs": "\uf41f",
  "fab fa-weibo": "\uf18a",
  "fab fa-weixin": "\uf1d7",
  "fab fa-whatsapp": "\uf232",
  "fab fa-whatsapp-square": "\uf40c",
  "fab fa-whmcs": "\uf40d",
  "fab fa-wikipedia-w": "\uf266",
  "fab fa-windows": "\uf17a",
  "fab fa-wordpress": "\uf19a",
  "fab fa-wordpress-simple": "\uf411",
  "fab fa-wpbeginner": "\uf297",
  "fab fa-wpexplorer": "\uf2de",
  "fab fa-wpforms": "\uf298",
  "fab fa-xbox": "\uf412",
  "fab fa-xing": "\uf168",
  "fab fa-xing-square": "\uf169",
  "fab fa-y-combinator": "\uf23b",
  "fab fa-yahoo": "\uf19e",
  "fab fa-yandex": "\uf413",
  "fab fa-yandex-international": "\uf414",
  "fab fa-yelp": "\uf1e9",
  "fab fa-yoast": "\uf2b1",
  "fab fa-youtube": "\uf167",
  "fab fa-youtube-square": "\uf431"
};

var FontAwe$1 = FontAwe;

var Vis$1;

Vis$1 = class Vis {
  static translate(x0, y0) {
    Util$1.checkTypes('number', {
      x0: x0,
      y0: y0
    });
    return ` translate( ${x0}, ${y0} )`;
  }

  static scale(sx, sy) {
    Util$1.checkTypes('number', {
      sx: sx,
      sy: sy
    });
    return ` scale( ${sx}, ${sy} )`;
  }

  static rotate(a, x, y) {
    Util$1.checkTypes('number', {
      a: a,
      x: x,
      y: y
    });
    return ` rotate(${a} ${x} ${y} )`;
  }

  static rad(deg) {
    return deg * Math.PI / 180;
  }

  static deg(rad) {
    return rad * 180 / Math.PI;
  }

  static sin(deg) {
    return Math.sin(Vis.rad(deg));
  }

  static cos(deg) {
    return Math.cos(Vis.rad(deg));
  }

  static rot(deg, ang) {
    var a;
    a = deg + ang;
    if (a < 0) {
      a = a + 360;
    }
    return a;
  }

  static toRadian(h, hueIsRygb = false) {
    var hue, radian;
    hue = hueIsRygb ? Vis.toHueRygb(h) : h;
    radian = 2 * Math.PI * (90 - hue) / 360; // Correction for MathBox polar coordinate system
    if (radian < 0) {
      radian = 2 * Math.PI + radian;
    }
    return radian;
  }

  static svgDeg(deg) {
    return 360 - deg;
  }

  static svgRad(rad) {
    return 2 * Math.PI - rad;
  }

  static radSvg(deg) {
    return Vis.rad(360 - deg);
  }

  static degSvg(rad) {
    return Vis.deg(2 * Math.PI - rad);
  }

  static sinSvg(deg) {
    return Math.sin(Vis.radSvg(deg));
  }

  static cosSvg(deg) {
    return Math.cos(Vis.radSvg(deg));
  }

  //hexCss:( hex ) -> """##{hex.toString(16)}""" # For orthogonality
  static rgbCss(rgb) {
    return `rgb(${rgb.r},${rgb.g},${rgb.b})`;
  }

  static hslCss(hsl) {
    return `hsl(${hsl.h},${hsl.s * 100}%,${hsl.l * 100}%)`;
  }

  static cssHex(str) {
    return parseInt(str.substr(1), 16);
  }

  static rndRgb(rgb) {
    return {
      r: Math.round(rgb.r),
      g: Math.round(rgb.g),
      b: Math.round(rgb.b)
    };
  }

  static hexRgb(hex) {
    return Vis.rndRgb({
      r: (hex & 0xFF0000) >> 16,
      g: (hex & 0x00FF00) >> 8,
      b: hex & 0x0000FF
    });
  }

  static rgbHex(rgb) {
    return rgb.r * 4096 + rgb.g * 256 + rgb.b;
  }

  static interpolateHexRgb(hex1, r1, hex2, r2) {
    return Vis.interpolateRgb(Vis.hexRgb(hex1), r1, Vis.hexRgb(hex2), r2);
  }

  static interpolateRgb(rgb1, r1, rgb2, r2) {
    return {
      r: rgb1.r * r1 + rgb2.r * r2,
      g: rgb1.g * r1 + rgb2.g * r2,
      b: rgb1.b * r1 + rgb2.b * r2
    };
  }

  static toRgbHsvStr(hsv) {
    var i, j, rgba, str;
    rgba = Vis.toRgbHsvSigmoidal(hsv[0], hsv[1], hsv[2] * 255, true);
    for (i = j = 0; j < 3; i = ++j) {
      rgba[i] = Math.round(rgba[i]);
    }
    str = `rgba(${rgba[0]},${rgba[1]},${rgba[2]},${rgba[3]})`;
    //console.log( "Vis.toRgbHsvStr()", {h:hsv[0],s:hsv[1],v:hsv[2]}, str )
    return str;
  }

  static toRgbaHsv(hsv) {
    var i, j, rgba, str;
    rgba = Vis.toRgbHsvSigmoidal(hsv[0], hsv[1], hsv[2] * 255, true);
    for (i = j = 0; j < 3; i = ++j) {
      rgba[i] = Math.round(rgba[i]);
    }
    str = `rgba(${rgba[0]},${rgba[1]},${rgba[2]},${rgba[3]})`;
    //console.log( "Vis.toRgbaHsv()", {h:hsv[0],s:hsv[1],v:hsv[2]}, str )
    return str;
  }

  static toRgbHsv(H, C, V, toRygb = true) {
    return Vis.toRgbHsvSigmoidal(H, C, V, toRygb);
  }

  static toRgbHsvSigmoidal(H, C, V, toRygb = true) {
    var b, c, d, f, g, h, i, r, v, x, y, z;
    h = toRygb ? Vis.toHueRgb(H) : H;
    d = C * 0.01;
    c = Vis.sigmoidal(d, 2, 0.25);
    v = V * 0.01;
    i = Math.floor(h / 60);
    f = h / 60 - i;
    x = 1 - c;
    y = 1 - f * c;
    z = 1 - (1 - f) * c;
    r = 1;
    g = 1;
    b = 1;
    [r, g, b] = (function() {
      switch (i % 6) {
        case 0:
          return [1, z, x, 1];
        case 1:
          return [y, 1, x, 1];
        case 2:
          return [x, 1, z, 1];
        case 3:
          return [x, y, 1, 1];
        case 4:
          return [z, x, 1, 1];
        case 5:
          return [1, x, y, 1];
      }
    })();
    return [r * v, g * v, b * v, 1];
  }

  static hsvToRgb(hsv) {
    var f, i, p, q, rgb, t, v;
    i = Math.floor(hsv.h / 60);
    f = hsv.h / 60 - i;
    p = hsv.v * (1 - hsv.s);
    q = hsv.v * (1 - f * hsv.s);
    t = hsv.v * (1 - (1 - f) * hsv.s);
    v = hsv.v;
    rgb = (function() {
      switch (i % 6) {
        case 0:
          return {
            r: v,
            g: t,
            b: p
          };
        case 1:
          return {
            r: q,
            g: v,
            b: p
          };
        case 2:
          return {
            r: p,
            g: v,
            b: t
          };
        case 3:
          return {
            r: p,
            g: q,
            b: v
          };
        case 4:
          return {
            r: t,
            g: p,
            b: v
          };
        case 5:
          return {
            r: v,
            g: p,
            b: q
          };
        default:
          console.error('Vis.hsvToRgb()');
          return {
            r: v,
            g: t,
            b: p // Should never happend
          };
      }
    })();
    return Vis.roundRgb(rgb, 255);
  }

  static roundRgb(rgb, f = 1.0) {
    return {
      r: Math.round(rgb.r * f),
      g: Math.round(rgb.g * f),
      b: Math.round(rgb.b * f)
    };
  }

  static sigmoidal(x, k, x0 = 0.5, L = 1) {
    return L / (1 + Math.exp(-k * (x - x0)));
  }

  // ransform RyGB to RGB hueT
  static toHueRgb(hue) {
    var hRgb;
    hRgb = 0;
    if (0 <= hue && hue < 90) {
      hRgb = hue * 60 / 90;
    } else if (90 <= hue && hue < 180) {
      hRgb = 60 + (hue - 90) * 60 / 90;
    } else if (180 <= hue && hue < 270) {
      hRgb = 120 + (hue - 180) * 120 / 90;
    } else if (270 <= hue && hue < 360) {
      hRgb = 240 + (hue - 270) * 120 / 90;
    }
    return hRgb;
  }

  static toRgba(study) {
    var hsv;
    hsv = study.hsv != null ? study.hsv : [90, 90, 90];
    return Vis.toRgbHsv(hsv[0], hsv[1], hsv[2]);
  }

  static toRgbSphere(hue, phi, rad) {
    return Vis.toRgbHsv(Vis.rot(hue, 90), 100 * Vis.sin(phi), 100 * rad);
  }

  // Key algorithm from HCI for converting RGB to HCS  h 360 c 100 s 100 a special color system
  static toHcsRgb(R, G, B, toRygb = true) {
    var H, a, b, c, g, h, r, s, sum;
    sum = R + G + B;
    r = R / sum;
    g = G / sum;
    b = B / sum;
    s = sum / 3;
    c = R === G && G === B ? 0 : 1 - 3 * Math.min(r, g, b); // Center Grayscale
    a = Vis.deg(Math.acos((r - 0.5 * (g + b)) / Math.sqrt((r - g) * (r - g) + (r - b) * (g - b))));
    h = b <= g ? a : 360 - a;
    if (c === 0) {
      h = 0;
    }
    H = toRygb ? Vis.toHueRgb(h) : h;
    return [H, c * 100, s / 2.55];
  }

  static sScale(hue, c, s) {
    var ch, m120, m60, s60, ss;
    ss = 1.0;
    m60 = hue % 60;
    m120 = hue % 120;
    s60 = m60 / 60;
    ch = c / 100;
    ss = m120 < 60 ? 3.0 - 1.5 * s60 : 1.5 + 1.5 * s60;
    return s * (1 - ch) + s * ch * ss;
  }

  static sScaleCf(hue, c, s) {
    var cf, cosd, cosu, m120, m60, ss;
    ss = Vis.sScale(hue, c, s);
    m60 = hue % 60;
    m120 = hue % 120;
    cosu = (1 - Vis.cos(m60)) * 100.00;
    cosd = (1 - Vis.cos(60 - m60)) * 100.00;
    cf = m120 < 60 ? cosu : cosd;
    return ss - cf;
  }

  static floor(x, dx) {
    var dr;
    dr = Math.round(dx);
    return Math.floor(x / dr) * dr;
  }

  static ceil(x, dx) {
    var dr;
    dr = Math.round(dx);
    return Math.ceil(x / dr) * dr;
  }

  static within(beg, deg, end) {
    return beg <= deg && deg <= end; // Closed interval with <=
  }

  static isZero(v) {
    return -0.01 < v && v < 0.01;
  }

  static unicode(icon) {
    var uc;
    uc = FontAwe$1.icons[icon];
    if (uc == null) {
      console.error('Vis.unicode() missing icon in Vis.FontAwesomeUnicodes for', icon);
      uc = "\uf111"; // Circle
    }
    return uc;
  }

};

var Vis$2 = Vis$1;

function ascending(a, b) {
  return a < b ? -1 : a > b ? 1 : a >= b ? 0 : NaN;
}

function bisector(compare) {
  if (compare.length === 1) compare = ascendingComparator(compare);
  return {
    left: function(a, x, lo, hi) {
      if (lo == null) lo = 0;
      if (hi == null) hi = a.length;
      while (lo < hi) {
        var mid = lo + hi >>> 1;
        if (compare(a[mid], x) < 0) lo = mid + 1;
        else hi = mid;
      }
      return lo;
    },
    right: function(a, x, lo, hi) {
      if (lo == null) lo = 0;
      if (hi == null) hi = a.length;
      while (lo < hi) {
        var mid = lo + hi >>> 1;
        if (compare(a[mid], x) > 0) hi = mid;
        else lo = mid + 1;
      }
      return lo;
    }
  };
}

function ascendingComparator(f) {
  return function(d, x) {
    return ascending(f(d), x);
  };
}

var ascendingBisect = bisector(ascending);

function max(values, valueof) {
  var n = values.length,
      i = -1,
      value,
      max;

  if (valueof == null) {
    while (++i < n) { // Find the first comparable value.
      if ((value = values[i]) != null && value >= value) {
        max = value;
        while (++i < n) { // Compare the remaining values.
          if ((value = values[i]) != null && value > max) {
            max = value;
          }
        }
      }
    }
  }

  else {
    while (++i < n) { // Find the first comparable value.
      if ((value = valueof(values[i], i, values)) != null && value >= value) {
        max = value;
        while (++i < n) { // Compare the remaining values.
          if ((value = valueof(values[i], i, values)) != null && value > max) {
            max = value;
          }
        }
      }
    }
  }

  return max;
}

function min(values, valueof) {
  var n = values.length,
      i = -1,
      value,
      min;

  if (valueof == null) {
    while (++i < n) { // Find the first comparable value.
      if ((value = values[i]) != null && value >= value) {
        min = value;
        while (++i < n) { // Compare the remaining values.
          if ((value = values[i]) != null && min > value) {
            min = value;
          }
        }
      }
    }
  }

  else {
    while (++i < n) { // Find the first comparable value.
      if ((value = valueof(values[i], i, values)) != null && value >= value) {
        min = value;
        while (++i < n) { // Compare the remaining values.
          if ((value = valueof(values[i], i, values)) != null && min > value) {
            min = value;
          }
        }
      }
    }
  }

  return min;
}

function sum(values, valueof) {
  var n = values.length,
      i = -1,
      value,
      sum = 0;

  if (valueof == null) {
    while (++i < n) {
      if (value = +values[i]) sum += value; // Note: zero and null are equivalent.
    }
  }

  else {
    while (++i < n) {
      if (value = +valueof(values[i], i, values)) sum += value;
    }
  }

  return sum;
}

var noop = {value: function() {}};

function dispatch() {
  for (var i = 0, n = arguments.length, _ = {}, t; i < n; ++i) {
    if (!(t = arguments[i] + "") || (t in _)) throw new Error("illegal type: " + t);
    _[t] = [];
  }
  return new Dispatch(_);
}

function Dispatch(_) {
  this._ = _;
}

function parseTypenames(typenames, types) {
  return typenames.trim().split(/^|\s+/).map(function(t) {
    var name = "", i = t.indexOf(".");
    if (i >= 0) name = t.slice(i + 1), t = t.slice(0, i);
    if (t && !types.hasOwnProperty(t)) throw new Error("unknown type: " + t);
    return {type: t, name: name};
  });
}

Dispatch.prototype = dispatch.prototype = {
  constructor: Dispatch,
  on: function(typename, callback) {
    var _ = this._,
        T = parseTypenames(typename + "", _),
        t,
        i = -1,
        n = T.length;

    // If no callback was specified, return the callback of the given type and name.
    if (arguments.length < 2) {
      while (++i < n) if ((t = (typename = T[i]).type) && (t = get(_[t], typename.name))) return t;
      return;
    }

    // If a type was specified, set the callback for the given type and name.
    // Otherwise, if a null callback was specified, remove callbacks of the given name.
    if (callback != null && typeof callback !== "function") throw new Error("invalid callback: " + callback);
    while (++i < n) {
      if (t = (typename = T[i]).type) _[t] = set(_[t], typename.name, callback);
      else if (callback == null) for (t in _) _[t] = set(_[t], typename.name, null);
    }

    return this;
  },
  copy: function() {
    var copy = {}, _ = this._;
    for (var t in _) copy[t] = _[t].slice();
    return new Dispatch(copy);
  },
  call: function(type, that) {
    if ((n = arguments.length - 2) > 0) for (var args = new Array(n), i = 0, n, t; i < n; ++i) args[i] = arguments[i + 2];
    if (!this._.hasOwnProperty(type)) throw new Error("unknown type: " + type);
    for (t = this._[type], i = 0, n = t.length; i < n; ++i) t[i].value.apply(that, args);
  },
  apply: function(type, that, args) {
    if (!this._.hasOwnProperty(type)) throw new Error("unknown type: " + type);
    for (var t = this._[type], i = 0, n = t.length; i < n; ++i) t[i].value.apply(that, args);
  }
};

function get(type, name) {
  for (var i = 0, n = type.length, c; i < n; ++i) {
    if ((c = type[i]).name === name) {
      return c.value;
    }
  }
}

function set(type, name, callback) {
  for (var i = 0, n = type.length; i < n; ++i) {
    if (type[i].name === name) {
      type[i] = noop, type = type.slice(0, i).concat(type.slice(i + 1));
      break;
    }
  }
  if (callback != null) type.push({name: name, value: callback});
  return type;
}

var xhtml = "http://www.w3.org/1999/xhtml";

var namespaces = {
  svg: "http://www.w3.org/2000/svg",
  xhtml: xhtml,
  xlink: "http://www.w3.org/1999/xlink",
  xml: "http://www.w3.org/XML/1998/namespace",
  xmlns: "http://www.w3.org/2000/xmlns/"
};

function namespace(name) {
  var prefix = name += "", i = prefix.indexOf(":");
  if (i >= 0 && (prefix = name.slice(0, i)) !== "xmlns") name = name.slice(i + 1);
  return namespaces.hasOwnProperty(prefix) ? {space: namespaces[prefix], local: name} : name;
}

function creatorInherit(name) {
  return function() {
    var document = this.ownerDocument,
        uri = this.namespaceURI;
    return uri === xhtml && document.documentElement.namespaceURI === xhtml
        ? document.createElement(name)
        : document.createElementNS(uri, name);
  };
}

function creatorFixed(fullname) {
  return function() {
    return this.ownerDocument.createElementNS(fullname.space, fullname.local);
  };
}

function creator(name) {
  var fullname = namespace(name);
  return (fullname.local
      ? creatorFixed
      : creatorInherit)(fullname);
}

function none() {}

function selector(selector) {
  return selector == null ? none : function() {
    return this.querySelector(selector);
  };
}

function selection_select(select) {
  if (typeof select !== "function") select = selector(select);

  for (var groups = this._groups, m = groups.length, subgroups = new Array(m), j = 0; j < m; ++j) {
    for (var group = groups[j], n = group.length, subgroup = subgroups[j] = new Array(n), node, subnode, i = 0; i < n; ++i) {
      if ((node = group[i]) && (subnode = select.call(node, node.__data__, i, group))) {
        if ("__data__" in node) subnode.__data__ = node.__data__;
        subgroup[i] = subnode;
      }
    }
  }

  return new Selection(subgroups, this._parents);
}

function empty() {
  return [];
}

function selectorAll(selector) {
  return selector == null ? empty : function() {
    return this.querySelectorAll(selector);
  };
}

function selection_selectAll(select) {
  if (typeof select !== "function") select = selectorAll(select);

  for (var groups = this._groups, m = groups.length, subgroups = [], parents = [], j = 0; j < m; ++j) {
    for (var group = groups[j], n = group.length, node, i = 0; i < n; ++i) {
      if (node = group[i]) {
        subgroups.push(select.call(node, node.__data__, i, group));
        parents.push(node);
      }
    }
  }

  return new Selection(subgroups, parents);
}

function matcher(selector) {
  return function() {
    return this.matches(selector);
  };
}

function selection_filter(match) {
  if (typeof match !== "function") match = matcher(match);

  for (var groups = this._groups, m = groups.length, subgroups = new Array(m), j = 0; j < m; ++j) {
    for (var group = groups[j], n = group.length, subgroup = subgroups[j] = [], node, i = 0; i < n; ++i) {
      if ((node = group[i]) && match.call(node, node.__data__, i, group)) {
        subgroup.push(node);
      }
    }
  }

  return new Selection(subgroups, this._parents);
}

function sparse(update) {
  return new Array(update.length);
}

function selection_enter() {
  return new Selection(this._enter || this._groups.map(sparse), this._parents);
}

function EnterNode(parent, datum) {
  this.ownerDocument = parent.ownerDocument;
  this.namespaceURI = parent.namespaceURI;
  this._next = null;
  this._parent = parent;
  this.__data__ = datum;
}

EnterNode.prototype = {
  constructor: EnterNode,
  appendChild: function(child) { return this._parent.insertBefore(child, this._next); },
  insertBefore: function(child, next) { return this._parent.insertBefore(child, next); },
  querySelector: function(selector) { return this._parent.querySelector(selector); },
  querySelectorAll: function(selector) { return this._parent.querySelectorAll(selector); }
};

function constant$1(x) {
  return function() {
    return x;
  };
}

var keyPrefix = "$"; // Protect against keys like “__proto__”.

function bindIndex(parent, group, enter, update, exit, data) {
  var i = 0,
      node,
      groupLength = group.length,
      dataLength = data.length;

  // Put any non-null nodes that fit into update.
  // Put any null nodes into enter.
  // Put any remaining data into enter.
  for (; i < dataLength; ++i) {
    if (node = group[i]) {
      node.__data__ = data[i];
      update[i] = node;
    } else {
      enter[i] = new EnterNode(parent, data[i]);
    }
  }

  // Put any non-null nodes that don’t fit into exit.
  for (; i < groupLength; ++i) {
    if (node = group[i]) {
      exit[i] = node;
    }
  }
}

function bindKey(parent, group, enter, update, exit, data, key) {
  var i,
      node,
      nodeByKeyValue = {},
      groupLength = group.length,
      dataLength = data.length,
      keyValues = new Array(groupLength),
      keyValue;

  // Compute the key for each node.
  // If multiple nodes have the same key, the duplicates are added to exit.
  for (i = 0; i < groupLength; ++i) {
    if (node = group[i]) {
      keyValues[i] = keyValue = keyPrefix + key.call(node, node.__data__, i, group);
      if (keyValue in nodeByKeyValue) {
        exit[i] = node;
      } else {
        nodeByKeyValue[keyValue] = node;
      }
    }
  }

  // Compute the key for each datum.
  // If there a node associated with this key, join and add it to update.
  // If there is not (or the key is a duplicate), add it to enter.
  for (i = 0; i < dataLength; ++i) {
    keyValue = keyPrefix + key.call(parent, data[i], i, data);
    if (node = nodeByKeyValue[keyValue]) {
      update[i] = node;
      node.__data__ = data[i];
      nodeByKeyValue[keyValue] = null;
    } else {
      enter[i] = new EnterNode(parent, data[i]);
    }
  }

  // Add any remaining nodes that were not bound to data to exit.
  for (i = 0; i < groupLength; ++i) {
    if ((node = group[i]) && (nodeByKeyValue[keyValues[i]] === node)) {
      exit[i] = node;
    }
  }
}

function selection_data(value, key) {
  if (!value) {
    data = new Array(this.size()), j = -1;
    this.each(function(d) { data[++j] = d; });
    return data;
  }

  var bind = key ? bindKey : bindIndex,
      parents = this._parents,
      groups = this._groups;

  if (typeof value !== "function") value = constant$1(value);

  for (var m = groups.length, update = new Array(m), enter = new Array(m), exit = new Array(m), j = 0; j < m; ++j) {
    var parent = parents[j],
        group = groups[j],
        groupLength = group.length,
        data = value.call(parent, parent && parent.__data__, j, parents),
        dataLength = data.length,
        enterGroup = enter[j] = new Array(dataLength),
        updateGroup = update[j] = new Array(dataLength),
        exitGroup = exit[j] = new Array(groupLength);

    bind(parent, group, enterGroup, updateGroup, exitGroup, data, key);

    // Now connect the enter nodes to their following update node, such that
    // appendChild can insert the materialized enter node before this node,
    // rather than at the end of the parent node.
    for (var i0 = 0, i1 = 0, previous, next; i0 < dataLength; ++i0) {
      if (previous = enterGroup[i0]) {
        if (i0 >= i1) i1 = i0 + 1;
        while (!(next = updateGroup[i1]) && ++i1 < dataLength);
        previous._next = next || null;
      }
    }
  }

  update = new Selection(update, parents);
  update._enter = enter;
  update._exit = exit;
  return update;
}

function selection_exit() {
  return new Selection(this._exit || this._groups.map(sparse), this._parents);
}

function selection_join(onenter, onupdate, onexit) {
  var enter = this.enter(), update = this, exit = this.exit();
  enter = typeof onenter === "function" ? onenter(enter) : enter.append(onenter + "");
  if (onupdate != null) update = onupdate(update);
  if (onexit == null) exit.remove(); else onexit(exit);
  return enter && update ? enter.merge(update).order() : update;
}

function selection_merge(selection$$1) {

  for (var groups0 = this._groups, groups1 = selection$$1._groups, m0 = groups0.length, m1 = groups1.length, m = Math.min(m0, m1), merges = new Array(m0), j = 0; j < m; ++j) {
    for (var group0 = groups0[j], group1 = groups1[j], n = group0.length, merge = merges[j] = new Array(n), node, i = 0; i < n; ++i) {
      if (node = group0[i] || group1[i]) {
        merge[i] = node;
      }
    }
  }

  for (; j < m0; ++j) {
    merges[j] = groups0[j];
  }

  return new Selection(merges, this._parents);
}

function selection_order() {

  for (var groups = this._groups, j = -1, m = groups.length; ++j < m;) {
    for (var group = groups[j], i = group.length - 1, next = group[i], node; --i >= 0;) {
      if (node = group[i]) {
        if (next && node.compareDocumentPosition(next) ^ 4) next.parentNode.insertBefore(node, next);
        next = node;
      }
    }
  }

  return this;
}

function selection_sort(compare) {
  if (!compare) compare = ascending$1;

  function compareNode(a, b) {
    return a && b ? compare(a.__data__, b.__data__) : !a - !b;
  }

  for (var groups = this._groups, m = groups.length, sortgroups = new Array(m), j = 0; j < m; ++j) {
    for (var group = groups[j], n = group.length, sortgroup = sortgroups[j] = new Array(n), node, i = 0; i < n; ++i) {
      if (node = group[i]) {
        sortgroup[i] = node;
      }
    }
    sortgroup.sort(compareNode);
  }

  return new Selection(sortgroups, this._parents).order();
}

function ascending$1(a, b) {
  return a < b ? -1 : a > b ? 1 : a >= b ? 0 : NaN;
}

function selection_call() {
  var callback = arguments[0];
  arguments[0] = this;
  callback.apply(null, arguments);
  return this;
}

function selection_nodes() {
  var nodes = new Array(this.size()), i = -1;
  this.each(function() { nodes[++i] = this; });
  return nodes;
}

function selection_node() {

  for (var groups = this._groups, j = 0, m = groups.length; j < m; ++j) {
    for (var group = groups[j], i = 0, n = group.length; i < n; ++i) {
      var node = group[i];
      if (node) return node;
    }
  }

  return null;
}

function selection_size() {
  var size = 0;
  this.each(function() { ++size; });
  return size;
}

function selection_empty() {
  return !this.node();
}

function selection_each(callback) {

  for (var groups = this._groups, j = 0, m = groups.length; j < m; ++j) {
    for (var group = groups[j], i = 0, n = group.length, node; i < n; ++i) {
      if (node = group[i]) callback.call(node, node.__data__, i, group);
    }
  }

  return this;
}

function attrRemove(name) {
  return function() {
    this.removeAttribute(name);
  };
}

function attrRemoveNS(fullname) {
  return function() {
    this.removeAttributeNS(fullname.space, fullname.local);
  };
}

function attrConstant(name, value) {
  return function() {
    this.setAttribute(name, value);
  };
}

function attrConstantNS(fullname, value) {
  return function() {
    this.setAttributeNS(fullname.space, fullname.local, value);
  };
}

function attrFunction(name, value) {
  return function() {
    var v = value.apply(this, arguments);
    if (v == null) this.removeAttribute(name);
    else this.setAttribute(name, v);
  };
}

function attrFunctionNS(fullname, value) {
  return function() {
    var v = value.apply(this, arguments);
    if (v == null) this.removeAttributeNS(fullname.space, fullname.local);
    else this.setAttributeNS(fullname.space, fullname.local, v);
  };
}

function selection_attr(name, value) {
  var fullname = namespace(name);

  if (arguments.length < 2) {
    var node = this.node();
    return fullname.local
        ? node.getAttributeNS(fullname.space, fullname.local)
        : node.getAttribute(fullname);
  }

  return this.each((value == null
      ? (fullname.local ? attrRemoveNS : attrRemove) : (typeof value === "function"
      ? (fullname.local ? attrFunctionNS : attrFunction)
      : (fullname.local ? attrConstantNS : attrConstant)))(fullname, value));
}

function defaultView(node) {
  return (node.ownerDocument && node.ownerDocument.defaultView) // node is a Node
      || (node.document && node) // node is a Window
      || node.defaultView; // node is a Document
}

function styleRemove(name) {
  return function() {
    this.style.removeProperty(name);
  };
}

function styleConstant(name, value, priority) {
  return function() {
    this.style.setProperty(name, value, priority);
  };
}

function styleFunction(name, value, priority) {
  return function() {
    var v = value.apply(this, arguments);
    if (v == null) this.style.removeProperty(name);
    else this.style.setProperty(name, v, priority);
  };
}

function selection_style(name, value, priority) {
  return arguments.length > 1
      ? this.each((value == null
            ? styleRemove : typeof value === "function"
            ? styleFunction
            : styleConstant)(name, value, priority == null ? "" : priority))
      : styleValue(this.node(), name);
}

function styleValue(node, name) {
  return node.style.getPropertyValue(name)
      || defaultView(node).getComputedStyle(node, null).getPropertyValue(name);
}

function propertyRemove(name) {
  return function() {
    delete this[name];
  };
}

function propertyConstant(name, value) {
  return function() {
    this[name] = value;
  };
}

function propertyFunction(name, value) {
  return function() {
    var v = value.apply(this, arguments);
    if (v == null) delete this[name];
    else this[name] = v;
  };
}

function selection_property(name, value) {
  return arguments.length > 1
      ? this.each((value == null
          ? propertyRemove : typeof value === "function"
          ? propertyFunction
          : propertyConstant)(name, value))
      : this.node()[name];
}

function classArray(string) {
  return string.trim().split(/^|\s+/);
}

function classList(node) {
  return node.classList || new ClassList(node);
}

function ClassList(node) {
  this._node = node;
  this._names = classArray(node.getAttribute("class") || "");
}

ClassList.prototype = {
  add: function(name) {
    var i = this._names.indexOf(name);
    if (i < 0) {
      this._names.push(name);
      this._node.setAttribute("class", this._names.join(" "));
    }
  },
  remove: function(name) {
    var i = this._names.indexOf(name);
    if (i >= 0) {
      this._names.splice(i, 1);
      this._node.setAttribute("class", this._names.join(" "));
    }
  },
  contains: function(name) {
    return this._names.indexOf(name) >= 0;
  }
};

function classedAdd(node, names) {
  var list = classList(node), i = -1, n = names.length;
  while (++i < n) list.add(names[i]);
}

function classedRemove(node, names) {
  var list = classList(node), i = -1, n = names.length;
  while (++i < n) list.remove(names[i]);
}

function classedTrue(names) {
  return function() {
    classedAdd(this, names);
  };
}

function classedFalse(names) {
  return function() {
    classedRemove(this, names);
  };
}

function classedFunction(names, value) {
  return function() {
    (value.apply(this, arguments) ? classedAdd : classedRemove)(this, names);
  };
}

function selection_classed(name, value) {
  var names = classArray(name + "");

  if (arguments.length < 2) {
    var list = classList(this.node()), i = -1, n = names.length;
    while (++i < n) if (!list.contains(names[i])) return false;
    return true;
  }

  return this.each((typeof value === "function"
      ? classedFunction : value
      ? classedTrue
      : classedFalse)(names, value));
}

function textRemove() {
  this.textContent = "";
}

function textConstant(value) {
  return function() {
    this.textContent = value;
  };
}

function textFunction(value) {
  return function() {
    var v = value.apply(this, arguments);
    this.textContent = v == null ? "" : v;
  };
}

function selection_text(value) {
  return arguments.length
      ? this.each(value == null
          ? textRemove : (typeof value === "function"
          ? textFunction
          : textConstant)(value))
      : this.node().textContent;
}

function htmlRemove() {
  this.innerHTML = "";
}

function htmlConstant(value) {
  return function() {
    this.innerHTML = value;
  };
}

function htmlFunction(value) {
  return function() {
    var v = value.apply(this, arguments);
    this.innerHTML = v == null ? "" : v;
  };
}

function selection_html(value) {
  return arguments.length
      ? this.each(value == null
          ? htmlRemove : (typeof value === "function"
          ? htmlFunction
          : htmlConstant)(value))
      : this.node().innerHTML;
}

function raise() {
  if (this.nextSibling) this.parentNode.appendChild(this);
}

function selection_raise() {
  return this.each(raise);
}

function lower() {
  if (this.previousSibling) this.parentNode.insertBefore(this, this.parentNode.firstChild);
}

function selection_lower() {
  return this.each(lower);
}

function selection_append(name) {
  var create = typeof name === "function" ? name : creator(name);
  return this.select(function() {
    return this.appendChild(create.apply(this, arguments));
  });
}

function constantNull() {
  return null;
}

function selection_insert(name, before) {
  var create = typeof name === "function" ? name : creator(name),
      select = before == null ? constantNull : typeof before === "function" ? before : selector(before);
  return this.select(function() {
    return this.insertBefore(create.apply(this, arguments), select.apply(this, arguments) || null);
  });
}

function remove() {
  var parent = this.parentNode;
  if (parent) parent.removeChild(this);
}

function selection_remove() {
  return this.each(remove);
}

function selection_cloneShallow() {
  return this.parentNode.insertBefore(this.cloneNode(false), this.nextSibling);
}

function selection_cloneDeep() {
  return this.parentNode.insertBefore(this.cloneNode(true), this.nextSibling);
}

function selection_clone(deep) {
  return this.select(deep ? selection_cloneDeep : selection_cloneShallow);
}

function selection_datum(value) {
  return arguments.length
      ? this.property("__data__", value)
      : this.node().__data__;
}

var filterEvents = {};

if (typeof document !== "undefined") {
  var element = document.documentElement;
  if (!("onmouseenter" in element)) {
    filterEvents = {mouseenter: "mouseover", mouseleave: "mouseout"};
  }
}

function filterContextListener(listener, index, group) {
  listener = contextListener(listener, index, group);
  return function(event) {
    var related = event.relatedTarget;
    if (!related || (related !== this && !(related.compareDocumentPosition(this) & 8))) {
      listener.call(this, event);
    }
  };
}

function contextListener(listener, index, group) {
  return function(event1) {
    try {
      listener.call(this, this.__data__, index, group);
    } finally {
    }
  };
}

function parseTypenames$1(typenames) {
  return typenames.trim().split(/^|\s+/).map(function(t) {
    var name = "", i = t.indexOf(".");
    if (i >= 0) name = t.slice(i + 1), t = t.slice(0, i);
    return {type: t, name: name};
  });
}

function onRemove(typename) {
  return function() {
    var on = this.__on;
    if (!on) return;
    for (var j = 0, i = -1, m = on.length, o; j < m; ++j) {
      if (o = on[j], (!typename.type || o.type === typename.type) && o.name === typename.name) {
        this.removeEventListener(o.type, o.listener, o.capture);
      } else {
        on[++i] = o;
      }
    }
    if (++i) on.length = i;
    else delete this.__on;
  };
}

function onAdd(typename, value, capture) {
  var wrap = filterEvents.hasOwnProperty(typename.type) ? filterContextListener : contextListener;
  return function(d, i, group) {
    var on = this.__on, o, listener = wrap(value, i, group);
    if (on) for (var j = 0, m = on.length; j < m; ++j) {
      if ((o = on[j]).type === typename.type && o.name === typename.name) {
        this.removeEventListener(o.type, o.listener, o.capture);
        this.addEventListener(o.type, o.listener = listener, o.capture = capture);
        o.value = value;
        return;
      }
    }
    this.addEventListener(typename.type, listener, capture);
    o = {type: typename.type, name: typename.name, value: value, listener: listener, capture: capture};
    if (!on) this.__on = [o];
    else on.push(o);
  };
}

function selection_on(typename, value, capture) {
  var typenames = parseTypenames$1(typename + ""), i, n = typenames.length, t;

  if (arguments.length < 2) {
    var on = this.node().__on;
    if (on) for (var j = 0, m = on.length, o; j < m; ++j) {
      for (i = 0, o = on[j]; i < n; ++i) {
        if ((t = typenames[i]).type === o.type && t.name === o.name) {
          return o.value;
        }
      }
    }
    return;
  }

  on = value ? onAdd : onRemove;
  if (capture == null) capture = false;
  for (i = 0; i < n; ++i) this.each(on(typenames[i], value, capture));
  return this;
}

function dispatchEvent(node, type, params) {
  var window = defaultView(node),
      event = window.CustomEvent;

  if (typeof event === "function") {
    event = new event(type, params);
  } else {
    event = window.document.createEvent("Event");
    if (params) event.initEvent(type, params.bubbles, params.cancelable), event.detail = params.detail;
    else event.initEvent(type, false, false);
  }

  node.dispatchEvent(event);
}

function dispatchConstant(type, params) {
  return function() {
    return dispatchEvent(this, type, params);
  };
}

function dispatchFunction(type, params) {
  return function() {
    return dispatchEvent(this, type, params.apply(this, arguments));
  };
}

function selection_dispatch(type, params) {
  return this.each((typeof params === "function"
      ? dispatchFunction
      : dispatchConstant)(type, params));
}

var root = [null];

function Selection(groups, parents) {
  this._groups = groups;
  this._parents = parents;
}

function selection() {
  return new Selection([[document.documentElement]], root);
}

Selection.prototype = selection.prototype = {
  constructor: Selection,
  select: selection_select,
  selectAll: selection_selectAll,
  filter: selection_filter,
  data: selection_data,
  enter: selection_enter,
  exit: selection_exit,
  join: selection_join,
  merge: selection_merge,
  order: selection_order,
  sort: selection_sort,
  call: selection_call,
  nodes: selection_nodes,
  node: selection_node,
  size: selection_size,
  empty: selection_empty,
  each: selection_each,
  attr: selection_attr,
  style: selection_style,
  property: selection_property,
  classed: selection_classed,
  text: selection_text,
  html: selection_html,
  raise: selection_raise,
  lower: selection_lower,
  append: selection_append,
  insert: selection_insert,
  remove: selection_remove,
  clone: selection_clone,
  datum: selection_datum,
  on: selection_on,
  dispatch: selection_dispatch
};

function select(selector) {
  return typeof selector === "string"
      ? new Selection([[document.querySelector(selector)]], [document.documentElement])
      : new Selection([[selector]], root);
}

function define(constructor, factory, prototype) {
  constructor.prototype = factory.prototype = prototype;
  prototype.constructor = constructor;
}

function extend(parent, definition) {
  var prototype = Object.create(parent.prototype);
  for (var key in definition) prototype[key] = definition[key];
  return prototype;
}

function Color() {}

var darker = 0.7;
var brighter = 1 / darker;

var reI = "\\s*([+-]?\\d+)\\s*",
    reN = "\\s*([+-]?\\d*\\.?\\d+(?:[eE][+-]?\\d+)?)\\s*",
    reP = "\\s*([+-]?\\d*\\.?\\d+(?:[eE][+-]?\\d+)?)%\\s*",
    reHex3 = /^#([0-9a-f]{3})$/,
    reHex6 = /^#([0-9a-f]{6})$/,
    reRgbInteger = new RegExp("^rgb\\(" + [reI, reI, reI] + "\\)$"),
    reRgbPercent = new RegExp("^rgb\\(" + [reP, reP, reP] + "\\)$"),
    reRgbaInteger = new RegExp("^rgba\\(" + [reI, reI, reI, reN] + "\\)$"),
    reRgbaPercent = new RegExp("^rgba\\(" + [reP, reP, reP, reN] + "\\)$"),
    reHslPercent = new RegExp("^hsl\\(" + [reN, reP, reP] + "\\)$"),
    reHslaPercent = new RegExp("^hsla\\(" + [reN, reP, reP, reN] + "\\)$");

var named = {
  aliceblue: 0xf0f8ff,
  antiquewhite: 0xfaebd7,
  aqua: 0x00ffff,
  aquamarine: 0x7fffd4,
  azure: 0xf0ffff,
  beige: 0xf5f5dc,
  bisque: 0xffe4c4,
  black: 0x000000,
  blanchedalmond: 0xffebcd,
  blue: 0x0000ff,
  blueviolet: 0x8a2be2,
  brown: 0xa52a2a,
  burlywood: 0xdeb887,
  cadetblue: 0x5f9ea0,
  chartreuse: 0x7fff00,
  chocolate: 0xd2691e,
  coral: 0xff7f50,
  cornflowerblue: 0x6495ed,
  cornsilk: 0xfff8dc,
  crimson: 0xdc143c,
  cyan: 0x00ffff,
  darkblue: 0x00008b,
  darkcyan: 0x008b8b,
  darkgoldenrod: 0xb8860b,
  darkgray: 0xa9a9a9,
  darkgreen: 0x006400,
  darkgrey: 0xa9a9a9,
  darkkhaki: 0xbdb76b,
  darkmagenta: 0x8b008b,
  darkolivegreen: 0x556b2f,
  darkorange: 0xff8c00,
  darkorchid: 0x9932cc,
  darkred: 0x8b0000,
  darksalmon: 0xe9967a,
  darkseagreen: 0x8fbc8f,
  darkslateblue: 0x483d8b,
  darkslategray: 0x2f4f4f,
  darkslategrey: 0x2f4f4f,
  darkturquoise: 0x00ced1,
  darkviolet: 0x9400d3,
  deeppink: 0xff1493,
  deepskyblue: 0x00bfff,
  dimgray: 0x696969,
  dimgrey: 0x696969,
  dodgerblue: 0x1e90ff,
  firebrick: 0xb22222,
  floralwhite: 0xfffaf0,
  forestgreen: 0x228b22,
  fuchsia: 0xff00ff,
  gainsboro: 0xdcdcdc,
  ghostwhite: 0xf8f8ff,
  gold: 0xffd700,
  goldenrod: 0xdaa520,
  gray: 0x808080,
  green: 0x008000,
  greenyellow: 0xadff2f,
  grey: 0x808080,
  honeydew: 0xf0fff0,
  hotpink: 0xff69b4,
  indianred: 0xcd5c5c,
  indigo: 0x4b0082,
  ivory: 0xfffff0,
  khaki: 0xf0e68c,
  lavender: 0xe6e6fa,
  lavenderblush: 0xfff0f5,
  lawngreen: 0x7cfc00,
  lemonchiffon: 0xfffacd,
  lightblue: 0xadd8e6,
  lightcoral: 0xf08080,
  lightcyan: 0xe0ffff,
  lightgoldenrodyellow: 0xfafad2,
  lightgray: 0xd3d3d3,
  lightgreen: 0x90ee90,
  lightgrey: 0xd3d3d3,
  lightpink: 0xffb6c1,
  lightsalmon: 0xffa07a,
  lightseagreen: 0x20b2aa,
  lightskyblue: 0x87cefa,
  lightslategray: 0x778899,
  lightslategrey: 0x778899,
  lightsteelblue: 0xb0c4de,
  lightyellow: 0xffffe0,
  lime: 0x00ff00,
  limegreen: 0x32cd32,
  linen: 0xfaf0e6,
  magenta: 0xff00ff,
  maroon: 0x800000,
  mediumaquamarine: 0x66cdaa,
  mediumblue: 0x0000cd,
  mediumorchid: 0xba55d3,
  mediumpurple: 0x9370db,
  mediumseagreen: 0x3cb371,
  mediumslateblue: 0x7b68ee,
  mediumspringgreen: 0x00fa9a,
  mediumturquoise: 0x48d1cc,
  mediumvioletred: 0xc71585,
  midnightblue: 0x191970,
  mintcream: 0xf5fffa,
  mistyrose: 0xffe4e1,
  moccasin: 0xffe4b5,
  navajowhite: 0xffdead,
  navy: 0x000080,
  oldlace: 0xfdf5e6,
  olive: 0x808000,
  olivedrab: 0x6b8e23,
  orange: 0xffa500,
  orangered: 0xff4500,
  orchid: 0xda70d6,
  palegoldenrod: 0xeee8aa,
  palegreen: 0x98fb98,
  paleturquoise: 0xafeeee,
  palevioletred: 0xdb7093,
  papayawhip: 0xffefd5,
  peachpuff: 0xffdab9,
  peru: 0xcd853f,
  pink: 0xffc0cb,
  plum: 0xdda0dd,
  powderblue: 0xb0e0e6,
  purple: 0x800080,
  rebeccapurple: 0x663399,
  red: 0xff0000,
  rosybrown: 0xbc8f8f,
  royalblue: 0x4169e1,
  saddlebrown: 0x8b4513,
  salmon: 0xfa8072,
  sandybrown: 0xf4a460,
  seagreen: 0x2e8b57,
  seashell: 0xfff5ee,
  sienna: 0xa0522d,
  silver: 0xc0c0c0,
  skyblue: 0x87ceeb,
  slateblue: 0x6a5acd,
  slategray: 0x708090,
  slategrey: 0x708090,
  snow: 0xfffafa,
  springgreen: 0x00ff7f,
  steelblue: 0x4682b4,
  tan: 0xd2b48c,
  teal: 0x008080,
  thistle: 0xd8bfd8,
  tomato: 0xff6347,
  turquoise: 0x40e0d0,
  violet: 0xee82ee,
  wheat: 0xf5deb3,
  white: 0xffffff,
  whitesmoke: 0xf5f5f5,
  yellow: 0xffff00,
  yellowgreen: 0x9acd32
};

define(Color, color, {
  displayable: function() {
    return this.rgb().displayable();
  },
  hex: function() {
    return this.rgb().hex();
  },
  toString: function() {
    return this.rgb() + "";
  }
});

function color(format) {
  var m;
  format = (format + "").trim().toLowerCase();
  return (m = reHex3.exec(format)) ? (m = parseInt(m[1], 16), new Rgb((m >> 8 & 0xf) | (m >> 4 & 0x0f0), (m >> 4 & 0xf) | (m & 0xf0), ((m & 0xf) << 4) | (m & 0xf), 1)) // #f00
      : (m = reHex6.exec(format)) ? rgbn(parseInt(m[1], 16)) // #ff0000
      : (m = reRgbInteger.exec(format)) ? new Rgb(m[1], m[2], m[3], 1) // rgb(255, 0, 0)
      : (m = reRgbPercent.exec(format)) ? new Rgb(m[1] * 255 / 100, m[2] * 255 / 100, m[3] * 255 / 100, 1) // rgb(100%, 0%, 0%)
      : (m = reRgbaInteger.exec(format)) ? rgba(m[1], m[2], m[3], m[4]) // rgba(255, 0, 0, 1)
      : (m = reRgbaPercent.exec(format)) ? rgba(m[1] * 255 / 100, m[2] * 255 / 100, m[3] * 255 / 100, m[4]) // rgb(100%, 0%, 0%, 1)
      : (m = reHslPercent.exec(format)) ? hsla(m[1], m[2] / 100, m[3] / 100, 1) // hsl(120, 50%, 50%)
      : (m = reHslaPercent.exec(format)) ? hsla(m[1], m[2] / 100, m[3] / 100, m[4]) // hsla(120, 50%, 50%, 1)
      : named.hasOwnProperty(format) ? rgbn(named[format])
      : format === "transparent" ? new Rgb(NaN, NaN, NaN, 0)
      : null;
}

function rgbn(n) {
  return new Rgb(n >> 16 & 0xff, n >> 8 & 0xff, n & 0xff, 1);
}

function rgba(r, g, b, a) {
  if (a <= 0) r = g = b = NaN;
  return new Rgb(r, g, b, a);
}

function rgbConvert(o) {
  if (!(o instanceof Color)) o = color(o);
  if (!o) return new Rgb;
  o = o.rgb();
  return new Rgb(o.r, o.g, o.b, o.opacity);
}

function rgb(r, g, b, opacity) {
  return arguments.length === 1 ? rgbConvert(r) : new Rgb(r, g, b, opacity == null ? 1 : opacity);
}

function Rgb(r, g, b, opacity) {
  this.r = +r;
  this.g = +g;
  this.b = +b;
  this.opacity = +opacity;
}

define(Rgb, rgb, extend(Color, {
  brighter: function(k) {
    k = k == null ? brighter : Math.pow(brighter, k);
    return new Rgb(this.r * k, this.g * k, this.b * k, this.opacity);
  },
  darker: function(k) {
    k = k == null ? darker : Math.pow(darker, k);
    return new Rgb(this.r * k, this.g * k, this.b * k, this.opacity);
  },
  rgb: function() {
    return this;
  },
  displayable: function() {
    return (0 <= this.r && this.r <= 255)
        && (0 <= this.g && this.g <= 255)
        && (0 <= this.b && this.b <= 255)
        && (0 <= this.opacity && this.opacity <= 1);
  },
  hex: function() {
    return "#" + hex(this.r) + hex(this.g) + hex(this.b);
  },
  toString: function() {
    var a = this.opacity; a = isNaN(a) ? 1 : Math.max(0, Math.min(1, a));
    return (a === 1 ? "rgb(" : "rgba(")
        + Math.max(0, Math.min(255, Math.round(this.r) || 0)) + ", "
        + Math.max(0, Math.min(255, Math.round(this.g) || 0)) + ", "
        + Math.max(0, Math.min(255, Math.round(this.b) || 0))
        + (a === 1 ? ")" : ", " + a + ")");
  }
}));

function hex(value) {
  value = Math.max(0, Math.min(255, Math.round(value) || 0));
  return (value < 16 ? "0" : "") + value.toString(16);
}

function hsla(h, s, l, a) {
  if (a <= 0) h = s = l = NaN;
  else if (l <= 0 || l >= 1) h = s = NaN;
  else if (s <= 0) h = NaN;
  return new Hsl(h, s, l, a);
}

function hslConvert(o) {
  if (o instanceof Hsl) return new Hsl(o.h, o.s, o.l, o.opacity);
  if (!(o instanceof Color)) o = color(o);
  if (!o) return new Hsl;
  if (o instanceof Hsl) return o;
  o = o.rgb();
  var r = o.r / 255,
      g = o.g / 255,
      b = o.b / 255,
      min = Math.min(r, g, b),
      max = Math.max(r, g, b),
      h = NaN,
      s = max - min,
      l = (max + min) / 2;
  if (s) {
    if (r === max) h = (g - b) / s + (g < b) * 6;
    else if (g === max) h = (b - r) / s + 2;
    else h = (r - g) / s + 4;
    s /= l < 0.5 ? max + min : 2 - max - min;
    h *= 60;
  } else {
    s = l > 0 && l < 1 ? 0 : h;
  }
  return new Hsl(h, s, l, o.opacity);
}

function hsl(h, s, l, opacity) {
  return arguments.length === 1 ? hslConvert(h) : new Hsl(h, s, l, opacity == null ? 1 : opacity);
}

function Hsl(h, s, l, opacity) {
  this.h = +h;
  this.s = +s;
  this.l = +l;
  this.opacity = +opacity;
}

define(Hsl, hsl, extend(Color, {
  brighter: function(k) {
    k = k == null ? brighter : Math.pow(brighter, k);
    return new Hsl(this.h, this.s, this.l * k, this.opacity);
  },
  darker: function(k) {
    k = k == null ? darker : Math.pow(darker, k);
    return new Hsl(this.h, this.s, this.l * k, this.opacity);
  },
  rgb: function() {
    var h = this.h % 360 + (this.h < 0) * 360,
        s = isNaN(h) || isNaN(this.s) ? 0 : this.s,
        l = this.l,
        m2 = l + (l < 0.5 ? l : 1 - l) * s,
        m1 = 2 * l - m2;
    return new Rgb(
      hsl2rgb(h >= 240 ? h - 240 : h + 120, m1, m2),
      hsl2rgb(h, m1, m2),
      hsl2rgb(h < 120 ? h + 240 : h - 120, m1, m2),
      this.opacity
    );
  },
  displayable: function() {
    return (0 <= this.s && this.s <= 1 || isNaN(this.s))
        && (0 <= this.l && this.l <= 1)
        && (0 <= this.opacity && this.opacity <= 1);
  }
}));

/* From FvD 13.37, CSS Color Module Level 3 */
function hsl2rgb(h, m1, m2) {
  return (h < 60 ? m1 + (m2 - m1) * h / 60
      : h < 180 ? m2
      : h < 240 ? m1 + (m2 - m1) * (240 - h) / 60
      : m1) * 255;
}

var deg2rad = Math.PI / 180;
var rad2deg = 180 / Math.PI;

// https://beta.observablehq.com/@mbostock/lab-and-rgb
var K = 18,
    Xn = 0.96422,
    Yn = 1,
    Zn = 0.82521,
    t0 = 4 / 29,
    t1 = 6 / 29,
    t2 = 3 * t1 * t1,
    t3 = t1 * t1 * t1;

function labConvert(o) {
  if (o instanceof Lab) return new Lab(o.l, o.a, o.b, o.opacity);
  if (o instanceof Hcl) {
    if (isNaN(o.h)) return new Lab(o.l, 0, 0, o.opacity);
    var h = o.h * deg2rad;
    return new Lab(o.l, Math.cos(h) * o.c, Math.sin(h) * o.c, o.opacity);
  }
  if (!(o instanceof Rgb)) o = rgbConvert(o);
  var r = rgb2lrgb(o.r),
      g = rgb2lrgb(o.g),
      b = rgb2lrgb(o.b),
      y = xyz2lab((0.2225045 * r + 0.7168786 * g + 0.0606169 * b) / Yn), x, z;
  if (r === g && g === b) x = z = y; else {
    x = xyz2lab((0.4360747 * r + 0.3850649 * g + 0.1430804 * b) / Xn);
    z = xyz2lab((0.0139322 * r + 0.0971045 * g + 0.7141733 * b) / Zn);
  }
  return new Lab(116 * y - 16, 500 * (x - y), 200 * (y - z), o.opacity);
}

function lab(l, a, b, opacity) {
  return arguments.length === 1 ? labConvert(l) : new Lab(l, a, b, opacity == null ? 1 : opacity);
}

function Lab(l, a, b, opacity) {
  this.l = +l;
  this.a = +a;
  this.b = +b;
  this.opacity = +opacity;
}

define(Lab, lab, extend(Color, {
  brighter: function(k) {
    return new Lab(this.l + K * (k == null ? 1 : k), this.a, this.b, this.opacity);
  },
  darker: function(k) {
    return new Lab(this.l - K * (k == null ? 1 : k), this.a, this.b, this.opacity);
  },
  rgb: function() {
    var y = (this.l + 16) / 116,
        x = isNaN(this.a) ? y : y + this.a / 500,
        z = isNaN(this.b) ? y : y - this.b / 200;
    x = Xn * lab2xyz(x);
    y = Yn * lab2xyz(y);
    z = Zn * lab2xyz(z);
    return new Rgb(
      lrgb2rgb( 3.1338561 * x - 1.6168667 * y - 0.4906146 * z),
      lrgb2rgb(-0.9787684 * x + 1.9161415 * y + 0.0334540 * z),
      lrgb2rgb( 0.0719453 * x - 0.2289914 * y + 1.4052427 * z),
      this.opacity
    );
  }
}));

function xyz2lab(t) {
  return t > t3 ? Math.pow(t, 1 / 3) : t / t2 + t0;
}

function lab2xyz(t) {
  return t > t1 ? t * t * t : t2 * (t - t0);
}

function lrgb2rgb(x) {
  return 255 * (x <= 0.0031308 ? 12.92 * x : 1.055 * Math.pow(x, 1 / 2.4) - 0.055);
}

function rgb2lrgb(x) {
  return (x /= 255) <= 0.04045 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4);
}

function hclConvert(o) {
  if (o instanceof Hcl) return new Hcl(o.h, o.c, o.l, o.opacity);
  if (!(o instanceof Lab)) o = labConvert(o);
  if (o.a === 0 && o.b === 0) return new Hcl(NaN, 0, o.l, o.opacity);
  var h = Math.atan2(o.b, o.a) * rad2deg;
  return new Hcl(h < 0 ? h + 360 : h, Math.sqrt(o.a * o.a + o.b * o.b), o.l, o.opacity);
}

function hcl(h, c, l, opacity) {
  return arguments.length === 1 ? hclConvert(h) : new Hcl(h, c, l, opacity == null ? 1 : opacity);
}

function Hcl(h, c, l, opacity) {
  this.h = +h;
  this.c = +c;
  this.l = +l;
  this.opacity = +opacity;
}

define(Hcl, hcl, extend(Color, {
  brighter: function(k) {
    return new Hcl(this.h, this.c, this.l + K * (k == null ? 1 : k), this.opacity);
  },
  darker: function(k) {
    return new Hcl(this.h, this.c, this.l - K * (k == null ? 1 : k), this.opacity);
  },
  rgb: function() {
    return labConvert(this).rgb();
  }
}));

var A = -0.14861,
    B = +1.78277,
    C = -0.29227,
    D = -0.90649,
    E = +1.97294,
    ED = E * D,
    EB = E * B,
    BC_DA = B * C - D * A;

function cubehelixConvert(o) {
  if (o instanceof Cubehelix) return new Cubehelix(o.h, o.s, o.l, o.opacity);
  if (!(o instanceof Rgb)) o = rgbConvert(o);
  var r = o.r / 255,
      g = o.g / 255,
      b = o.b / 255,
      l = (BC_DA * b + ED * r - EB * g) / (BC_DA + ED - EB),
      bl = b - l,
      k = (E * (g - l) - C * bl) / D,
      s = Math.sqrt(k * k + bl * bl) / (E * l * (1 - l)), // NaN if l=0 or l=1
      h = s ? Math.atan2(k, bl) * rad2deg - 120 : NaN;
  return new Cubehelix(h < 0 ? h + 360 : h, s, l, o.opacity);
}

function cubehelix(h, s, l, opacity) {
  return arguments.length === 1 ? cubehelixConvert(h) : new Cubehelix(h, s, l, opacity == null ? 1 : opacity);
}

function Cubehelix(h, s, l, opacity) {
  this.h = +h;
  this.s = +s;
  this.l = +l;
  this.opacity = +opacity;
}

define(Cubehelix, cubehelix, extend(Color, {
  brighter: function(k) {
    k = k == null ? brighter : Math.pow(brighter, k);
    return new Cubehelix(this.h, this.s, this.l * k, this.opacity);
  },
  darker: function(k) {
    k = k == null ? darker : Math.pow(darker, k);
    return new Cubehelix(this.h, this.s, this.l * k, this.opacity);
  },
  rgb: function() {
    var h = isNaN(this.h) ? 0 : (this.h + 120) * deg2rad,
        l = +this.l,
        a = isNaN(this.s) ? 0 : this.s * l * (1 - l),
        cosh = Math.cos(h),
        sinh = Math.sin(h);
    return new Rgb(
      255 * (l + a * (A * cosh + B * sinh)),
      255 * (l + a * (C * cosh + D * sinh)),
      255 * (l + a * (E * cosh)),
      this.opacity
    );
  }
}));

function basis(t1, v0, v1, v2, v3) {
  var t2 = t1 * t1, t3 = t2 * t1;
  return ((1 - 3 * t1 + 3 * t2 - t3) * v0
      + (4 - 6 * t2 + 3 * t3) * v1
      + (1 + 3 * t1 + 3 * t2 - 3 * t3) * v2
      + t3 * v3) / 6;
}

function basis$1(values) {
  var n = values.length - 1;
  return function(t) {
    var i = t <= 0 ? (t = 0) : t >= 1 ? (t = 1, n - 1) : Math.floor(t * n),
        v1 = values[i],
        v2 = values[i + 1],
        v0 = i > 0 ? values[i - 1] : 2 * v1 - v2,
        v3 = i < n - 1 ? values[i + 2] : 2 * v2 - v1;
    return basis((t - i / n) * n, v0, v1, v2, v3);
  };
}

function constant$3(x) {
  return function() {
    return x;
  };
}

function linear(a, d) {
  return function(t) {
    return a + t * d;
  };
}

function exponential(a, b, y) {
  return a = Math.pow(a, y), b = Math.pow(b, y) - a, y = 1 / y, function(t) {
    return Math.pow(a + t * b, y);
  };
}

function hue(a, b) {
  var d = b - a;
  return d ? linear(a, d > 180 || d < -180 ? d - 360 * Math.round(d / 360) : d) : constant$3(isNaN(a) ? b : a);
}

function gamma(y) {
  return (y = +y) === 1 ? nogamma : function(a, b) {
    return b - a ? exponential(a, b, y) : constant$3(isNaN(a) ? b : a);
  };
}

function nogamma(a, b) {
  var d = b - a;
  return d ? linear(a, d) : constant$3(isNaN(a) ? b : a);
}

var interpolateRgb = (function rgbGamma(y) {
  var color$$1 = gamma(y);

  function rgb$$1(start, end) {
    var r = color$$1((start = rgb(start)).r, (end = rgb(end)).r),
        g = color$$1(start.g, end.g),
        b = color$$1(start.b, end.b),
        opacity = nogamma(start.opacity, end.opacity);
    return function(t) {
      start.r = r(t);
      start.g = g(t);
      start.b = b(t);
      start.opacity = opacity(t);
      return start + "";
    };
  }

  rgb$$1.gamma = rgbGamma;

  return rgb$$1;
})(1);

function rgbSpline(spline) {
  return function(colors) {
    var n = colors.length,
        r = new Array(n),
        g = new Array(n),
        b = new Array(n),
        i, color$$1;
    for (i = 0; i < n; ++i) {
      color$$1 = rgb(colors[i]);
      r[i] = color$$1.r || 0;
      g[i] = color$$1.g || 0;
      b[i] = color$$1.b || 0;
    }
    r = spline(r);
    g = spline(g);
    b = spline(b);
    color$$1.opacity = 1;
    return function(t) {
      color$$1.r = r(t);
      color$$1.g = g(t);
      color$$1.b = b(t);
      return color$$1 + "";
    };
  };
}

var rgbBasis = rgbSpline(basis$1);

function interpolateNumber(a, b) {
  return a = +a, b -= a, function(t) {
    return a + b * t;
  };
}

var reA = /[-+]?(?:\d+\.?\d*|\.?\d+)(?:[eE][-+]?\d+)?/g,
    reB = new RegExp(reA.source, "g");

function zero(b) {
  return function() {
    return b;
  };
}

function one(b) {
  return function(t) {
    return b(t) + "";
  };
}

function interpolateString(a, b) {
  var bi = reA.lastIndex = reB.lastIndex = 0, // scan index for next number in b
      am, // current match in a
      bm, // current match in b
      bs, // string preceding current number in b, if any
      i = -1, // index in s
      s = [], // string constants and placeholders
      q = []; // number interpolators

  // Coerce inputs to strings.
  a = a + "", b = b + "";

  // Interpolate pairs of numbers in a & b.
  while ((am = reA.exec(a))
      && (bm = reB.exec(b))) {
    if ((bs = bm.index) > bi) { // a string precedes the next number in b
      bs = b.slice(bi, bs);
      if (s[i]) s[i] += bs; // coalesce with previous string
      else s[++i] = bs;
    }
    if ((am = am[0]) === (bm = bm[0])) { // numbers in a & b match
      if (s[i]) s[i] += bm; // coalesce with previous string
      else s[++i] = bm;
    } else { // interpolate non-matching numbers
      s[++i] = null;
      q.push({i: i, x: interpolateNumber(am, bm)});
    }
    bi = reB.lastIndex;
  }

  // Add remains of b.
  if (bi < b.length) {
    bs = b.slice(bi);
    if (s[i]) s[i] += bs; // coalesce with previous string
    else s[++i] = bs;
  }

  // Special optimization for only a single match.
  // Otherwise, interpolate each of the numbers and rejoin the string.
  return s.length < 2 ? (q[0]
      ? one(q[0].x)
      : zero(b))
      : (b = q.length, function(t) {
          for (var i = 0, o; i < b; ++i) s[(o = q[i]).i] = o.x(t);
          return s.join("");
        });
}

var degrees = 180 / Math.PI;

var identity$2 = {
  translateX: 0,
  translateY: 0,
  rotate: 0,
  skewX: 0,
  scaleX: 1,
  scaleY: 1
};

function decompose(a, b, c, d, e, f) {
  var scaleX, scaleY, skewX;
  if (scaleX = Math.sqrt(a * a + b * b)) a /= scaleX, b /= scaleX;
  if (skewX = a * c + b * d) c -= a * skewX, d -= b * skewX;
  if (scaleY = Math.sqrt(c * c + d * d)) c /= scaleY, d /= scaleY, skewX /= scaleY;
  if (a * d < b * c) a = -a, b = -b, skewX = -skewX, scaleX = -scaleX;
  return {
    translateX: e,
    translateY: f,
    rotate: Math.atan2(b, a) * degrees,
    skewX: Math.atan(skewX) * degrees,
    scaleX: scaleX,
    scaleY: scaleY
  };
}

var cssNode,
    cssRoot,
    cssView,
    svgNode;

function parseCss(value) {
  if (value === "none") return identity$2;
  if (!cssNode) cssNode = document.createElement("DIV"), cssRoot = document.documentElement, cssView = document.defaultView;
  cssNode.style.transform = value;
  value = cssView.getComputedStyle(cssRoot.appendChild(cssNode), null).getPropertyValue("transform");
  cssRoot.removeChild(cssNode);
  value = value.slice(7, -1).split(",");
  return decompose(+value[0], +value[1], +value[2], +value[3], +value[4], +value[5]);
}

function parseSvg(value) {
  if (value == null) return identity$2;
  if (!svgNode) svgNode = document.createElementNS("http://www.w3.org/2000/svg", "g");
  svgNode.setAttribute("transform", value);
  if (!(value = svgNode.transform.baseVal.consolidate())) return identity$2;
  value = value.matrix;
  return decompose(value.a, value.b, value.c, value.d, value.e, value.f);
}

function interpolateTransform(parse, pxComma, pxParen, degParen) {

  function pop(s) {
    return s.length ? s.pop() + " " : "";
  }

  function translate(xa, ya, xb, yb, s, q) {
    if (xa !== xb || ya !== yb) {
      var i = s.push("translate(", null, pxComma, null, pxParen);
      q.push({i: i - 4, x: interpolateNumber(xa, xb)}, {i: i - 2, x: interpolateNumber(ya, yb)});
    } else if (xb || yb) {
      s.push("translate(" + xb + pxComma + yb + pxParen);
    }
  }

  function rotate(a, b, s, q) {
    if (a !== b) {
      if (a - b > 180) b += 360; else if (b - a > 180) a += 360; // shortest path
      q.push({i: s.push(pop(s) + "rotate(", null, degParen) - 2, x: interpolateNumber(a, b)});
    } else if (b) {
      s.push(pop(s) + "rotate(" + b + degParen);
    }
  }

  function skewX(a, b, s, q) {
    if (a !== b) {
      q.push({i: s.push(pop(s) + "skewX(", null, degParen) - 2, x: interpolateNumber(a, b)});
    } else if (b) {
      s.push(pop(s) + "skewX(" + b + degParen);
    }
  }

  function scale(xa, ya, xb, yb, s, q) {
    if (xa !== xb || ya !== yb) {
      var i = s.push(pop(s) + "scale(", null, ",", null, ")");
      q.push({i: i - 4, x: interpolateNumber(xa, xb)}, {i: i - 2, x: interpolateNumber(ya, yb)});
    } else if (xb !== 1 || yb !== 1) {
      s.push(pop(s) + "scale(" + xb + "," + yb + ")");
    }
  }

  return function(a, b) {
    var s = [], // string constants and placeholders
        q = []; // number interpolators
    a = parse(a), b = parse(b);
    translate(a.translateX, a.translateY, b.translateX, b.translateY, s, q);
    rotate(a.rotate, b.rotate, s, q);
    skewX(a.skewX, b.skewX, s, q);
    scale(a.scaleX, a.scaleY, b.scaleX, b.scaleY, s, q);
    a = b = null; // gc
    return function(t) {
      var i = -1, n = q.length, o;
      while (++i < n) s[(o = q[i]).i] = o.x(t);
      return s.join("");
    };
  };
}

var interpolateTransformCss = interpolateTransform(parseCss, "px, ", "px)", "deg)");
var interpolateTransformSvg = interpolateTransform(parseSvg, ", ", ")", ")");

var rho = Math.SQRT2;

function cubehelix$1(hue$$1) {
  return (function cubehelixGamma(y) {
    y = +y;

    function cubehelix$$1(start, end) {
      var h = hue$$1((start = cubehelix(start)).h, (end = cubehelix(end)).h),
          s = nogamma(start.s, end.s),
          l = nogamma(start.l, end.l),
          opacity = nogamma(start.opacity, end.opacity);
      return function(t) {
        start.h = h(t);
        start.s = s(t);
        start.l = l(Math.pow(t, y));
        start.opacity = opacity(t);
        return start + "";
      };
    }

    cubehelix$$1.gamma = cubehelixGamma;

    return cubehelix$$1;
  })(1);
}

var cubehelix$2 = cubehelix$1(hue);
var cubehelixLong = cubehelix$1(nogamma);

var frame = 0, // is an animation frame pending?
    timeout = 0, // is a timeout pending?
    interval = 0, // are any timers active?
    pokeDelay = 1000, // how frequently we check for clock skew
    taskHead,
    taskTail,
    clockLast = 0,
    clockNow = 0,
    clockSkew = 0,
    clock = typeof performance === "object" && performance.now ? performance : Date,
    setFrame = typeof window === "object" && window.requestAnimationFrame ? window.requestAnimationFrame.bind(window) : function(f) { setTimeout(f, 17); };

function now() {
  return clockNow || (setFrame(clearNow), clockNow = clock.now() + clockSkew);
}

function clearNow() {
  clockNow = 0;
}

function Timer() {
  this._call =
  this._time =
  this._next = null;
}

Timer.prototype = timer.prototype = {
  constructor: Timer,
  restart: function(callback, delay, time) {
    if (typeof callback !== "function") throw new TypeError("callback is not a function");
    time = (time == null ? now() : +time) + (delay == null ? 0 : +delay);
    if (!this._next && taskTail !== this) {
      if (taskTail) taskTail._next = this;
      else taskHead = this;
      taskTail = this;
    }
    this._call = callback;
    this._time = time;
    sleep();
  },
  stop: function() {
    if (this._call) {
      this._call = null;
      this._time = Infinity;
      sleep();
    }
  }
};

function timer(callback, delay, time) {
  var t = new Timer;
  t.restart(callback, delay, time);
  return t;
}

function timerFlush() {
  now(); // Get the current time, if not already set.
  ++frame; // Pretend we’ve set an alarm, if we haven’t already.
  var t = taskHead, e;
  while (t) {
    if ((e = clockNow - t._time) >= 0) t._call.call(null, e);
    t = t._next;
  }
  --frame;
}

function wake() {
  clockNow = (clockLast = clock.now()) + clockSkew;
  frame = timeout = 0;
  try {
    timerFlush();
  } finally {
    frame = 0;
    nap();
    clockNow = 0;
  }
}

function poke() {
  var now = clock.now(), delay = now - clockLast;
  if (delay > pokeDelay) clockSkew -= delay, clockLast = now;
}

function nap() {
  var t0, t1 = taskHead, t2, time = Infinity;
  while (t1) {
    if (t1._call) {
      if (time > t1._time) time = t1._time;
      t0 = t1, t1 = t1._next;
    } else {
      t2 = t1._next, t1._next = null;
      t1 = t0 ? t0._next = t2 : taskHead = t2;
    }
  }
  taskTail = t0;
  sleep(time);
}

function sleep(time) {
  if (frame) return; // Soonest alarm already set, or will be.
  if (timeout) timeout = clearTimeout(timeout);
  var delay = time - clockNow; // Strictly less than if we recomputed clockNow.
  if (delay > 24) {
    if (time < Infinity) timeout = setTimeout(wake, time - clock.now() - clockSkew);
    if (interval) interval = clearInterval(interval);
  } else {
    if (!interval) clockLast = clock.now(), interval = setInterval(poke, pokeDelay);
    frame = 1, setFrame(wake);
  }
}

function timeout$1(callback, delay, time) {
  var t = new Timer;
  delay = delay == null ? 0 : +delay;
  t.restart(function(elapsed) {
    t.stop();
    callback(elapsed + delay);
  }, delay, time);
  return t;
}

var emptyOn = dispatch("start", "end", "cancel", "interrupt");
var emptyTween = [];

var CREATED = 0;
var SCHEDULED = 1;
var STARTING = 2;
var STARTED = 3;
var RUNNING = 4;
var ENDING = 5;
var ENDED = 6;

function schedule(node, name, id, index, group, timing) {
  var schedules = node.__transition;
  if (!schedules) node.__transition = {};
  else if (id in schedules) return;
  create$1(node, id, {
    name: name,
    index: index, // For context during callback.
    group: group, // For context during callback.
    on: emptyOn,
    tween: emptyTween,
    time: timing.time,
    delay: timing.delay,
    duration: timing.duration,
    ease: timing.ease,
    timer: null,
    state: CREATED
  });
}

function init(node, id) {
  var schedule = get$1(node, id);
  if (schedule.state > CREATED) throw new Error("too late; already scheduled");
  return schedule;
}

function set$1(node, id) {
  var schedule = get$1(node, id);
  if (schedule.state > STARTED) throw new Error("too late; already running");
  return schedule;
}

function get$1(node, id) {
  var schedule = node.__transition;
  if (!schedule || !(schedule = schedule[id])) throw new Error("transition not found");
  return schedule;
}

function create$1(node, id, self) {
  var schedules = node.__transition,
      tween;

  // Initialize the self timer when the transition is created.
  // Note the actual delay is not known until the first callback!
  schedules[id] = self;
  self.timer = timer(schedule, 0, self.time);

  function schedule(elapsed) {
    self.state = SCHEDULED;
    self.timer.restart(start, self.delay, self.time);

    // If the elapsed delay is less than our first sleep, start immediately.
    if (self.delay <= elapsed) start(elapsed - self.delay);
  }

  function start(elapsed) {
    var i, j, n, o;

    // If the state is not SCHEDULED, then we previously errored on start.
    if (self.state !== SCHEDULED) return stop();

    for (i in schedules) {
      o = schedules[i];
      if (o.name !== self.name) continue;

      // While this element already has a starting transition during this frame,
      // defer starting an interrupting transition until that transition has a
      // chance to tick (and possibly end); see d3/d3-transition#54!
      if (o.state === STARTED) return timeout$1(start);

      // Interrupt the active transition, if any.
      if (o.state === RUNNING) {
        o.state = ENDED;
        o.timer.stop();
        o.on.call("interrupt", node, node.__data__, o.index, o.group);
        delete schedules[i];
      }

      // Cancel any pre-empted transitions.
      else if (+i < id) {
        o.state = ENDED;
        o.timer.stop();
        o.on.call("cancel", node, node.__data__, o.index, o.group);
        delete schedules[i];
      }
    }

    // Defer the first tick to end of the current frame; see d3/d3#1576.
    // Note the transition may be canceled after start and before the first tick!
    // Note this must be scheduled before the start event; see d3/d3-transition#16!
    // Assuming this is successful, subsequent callbacks go straight to tick.
    timeout$1(function() {
      if (self.state === STARTED) {
        self.state = RUNNING;
        self.timer.restart(tick, self.delay, self.time);
        tick(elapsed);
      }
    });

    // Dispatch the start event.
    // Note this must be done before the tween are initialized.
    self.state = STARTING;
    self.on.call("start", node, node.__data__, self.index, self.group);
    if (self.state !== STARTING) return; // interrupted
    self.state = STARTED;

    // Initialize the tween, deleting null tween.
    tween = new Array(n = self.tween.length);
    for (i = 0, j = -1; i < n; ++i) {
      if (o = self.tween[i].value.call(node, node.__data__, self.index, self.group)) {
        tween[++j] = o;
      }
    }
    tween.length = j + 1;
  }

  function tick(elapsed) {
    var t = elapsed < self.duration ? self.ease.call(null, elapsed / self.duration) : (self.timer.restart(stop), self.state = ENDING, 1),
        i = -1,
        n = tween.length;

    while (++i < n) {
      tween[i].call(node, t);
    }

    // Dispatch the end event.
    if (self.state === ENDING) {
      self.on.call("end", node, node.__data__, self.index, self.group);
      stop();
    }
  }

  function stop() {
    self.state = ENDED;
    self.timer.stop();
    delete schedules[id];
    for (var i in schedules) return; // eslint-disable-line no-unused-vars
    delete node.__transition;
  }
}

function interrupt(node, name) {
  var schedules = node.__transition,
      schedule$$1,
      active,
      empty = true,
      i;

  if (!schedules) return;

  name = name == null ? null : name + "";

  for (i in schedules) {
    if ((schedule$$1 = schedules[i]).name !== name) { empty = false; continue; }
    active = schedule$$1.state > STARTING && schedule$$1.state < ENDING;
    schedule$$1.state = ENDED;
    schedule$$1.timer.stop();
    schedule$$1.on.call(active ? "interrupt" : "cancel", node, node.__data__, schedule$$1.index, schedule$$1.group);
    delete schedules[i];
  }

  if (empty) delete node.__transition;
}

function selection_interrupt(name) {
  return this.each(function() {
    interrupt(this, name);
  });
}

function tweenRemove(id, name) {
  var tween0, tween1;
  return function() {
    var schedule$$1 = set$1(this, id),
        tween = schedule$$1.tween;

    // If this node shared tween with the previous node,
    // just assign the updated shared tween and we’re done!
    // Otherwise, copy-on-write.
    if (tween !== tween0) {
      tween1 = tween0 = tween;
      for (var i = 0, n = tween1.length; i < n; ++i) {
        if (tween1[i].name === name) {
          tween1 = tween1.slice();
          tween1.splice(i, 1);
          break;
        }
      }
    }

    schedule$$1.tween = tween1;
  };
}

function tweenFunction(id, name, value) {
  var tween0, tween1;
  if (typeof value !== "function") throw new Error;
  return function() {
    var schedule$$1 = set$1(this, id),
        tween = schedule$$1.tween;

    // If this node shared tween with the previous node,
    // just assign the updated shared tween and we’re done!
    // Otherwise, copy-on-write.
    if (tween !== tween0) {
      tween1 = (tween0 = tween).slice();
      for (var t = {name: name, value: value}, i = 0, n = tween1.length; i < n; ++i) {
        if (tween1[i].name === name) {
          tween1[i] = t;
          break;
        }
      }
      if (i === n) tween1.push(t);
    }

    schedule$$1.tween = tween1;
  };
}

function transition_tween(name, value) {
  var id = this._id;

  name += "";

  if (arguments.length < 2) {
    var tween = get$1(this.node(), id).tween;
    for (var i = 0, n = tween.length, t; i < n; ++i) {
      if ((t = tween[i]).name === name) {
        return t.value;
      }
    }
    return null;
  }

  return this.each((value == null ? tweenRemove : tweenFunction)(id, name, value));
}

function tweenValue(transition, name, value) {
  var id = transition._id;

  transition.each(function() {
    var schedule$$1 = set$1(this, id);
    (schedule$$1.value || (schedule$$1.value = {}))[name] = value.apply(this, arguments);
  });

  return function(node) {
    return get$1(node, id).value[name];
  };
}

function interpolate(a, b) {
  var c;
  return (typeof b === "number" ? interpolateNumber
      : b instanceof color ? interpolateRgb
      : (c = color(b)) ? (b = c, interpolateRgb)
      : interpolateString)(a, b);
}

function attrRemove$1(name) {
  return function() {
    this.removeAttribute(name);
  };
}

function attrRemoveNS$1(fullname) {
  return function() {
    this.removeAttributeNS(fullname.space, fullname.local);
  };
}

function attrConstant$1(name, interpolate$$1, value1) {
  var string00,
      string1 = value1 + "",
      interpolate0;
  return function() {
    var string0 = this.getAttribute(name);
    return string0 === string1 ? null
        : string0 === string00 ? interpolate0
        : interpolate0 = interpolate$$1(string00 = string0, value1);
  };
}

function attrConstantNS$1(fullname, interpolate$$1, value1) {
  var string00,
      string1 = value1 + "",
      interpolate0;
  return function() {
    var string0 = this.getAttributeNS(fullname.space, fullname.local);
    return string0 === string1 ? null
        : string0 === string00 ? interpolate0
        : interpolate0 = interpolate$$1(string00 = string0, value1);
  };
}

function attrFunction$1(name, interpolate$$1, value) {
  var string00,
      string10,
      interpolate0;
  return function() {
    var string0, value1 = value(this), string1;
    if (value1 == null) return void this.removeAttribute(name);
    string0 = this.getAttribute(name);
    string1 = value1 + "";
    return string0 === string1 ? null
        : string0 === string00 && string1 === string10 ? interpolate0
        : (string10 = string1, interpolate0 = interpolate$$1(string00 = string0, value1));
  };
}

function attrFunctionNS$1(fullname, interpolate$$1, value) {
  var string00,
      string10,
      interpolate0;
  return function() {
    var string0, value1 = value(this), string1;
    if (value1 == null) return void this.removeAttributeNS(fullname.space, fullname.local);
    string0 = this.getAttributeNS(fullname.space, fullname.local);
    string1 = value1 + "";
    return string0 === string1 ? null
        : string0 === string00 && string1 === string10 ? interpolate0
        : (string10 = string1, interpolate0 = interpolate$$1(string00 = string0, value1));
  };
}

function transition_attr(name, value) {
  var fullname = namespace(name), i = fullname === "transform" ? interpolateTransformSvg : interpolate;
  return this.attrTween(name, typeof value === "function"
      ? (fullname.local ? attrFunctionNS$1 : attrFunction$1)(fullname, i, tweenValue(this, "attr." + name, value))
      : value == null ? (fullname.local ? attrRemoveNS$1 : attrRemove$1)(fullname)
      : (fullname.local ? attrConstantNS$1 : attrConstant$1)(fullname, i, value));
}

function attrInterpolate(name, i) {
  return function(t) {
    this.setAttribute(name, i(t));
  };
}

function attrInterpolateNS(fullname, i) {
  return function(t) {
    this.setAttributeNS(fullname.space, fullname.local, i(t));
  };
}

function attrTweenNS(fullname, value) {
  var t0, i0;
  function tween() {
    var i = value.apply(this, arguments);
    if (i !== i0) t0 = (i0 = i) && attrInterpolateNS(fullname, i);
    return t0;
  }
  tween._value = value;
  return tween;
}

function attrTween(name, value) {
  var t0, i0;
  function tween() {
    var i = value.apply(this, arguments);
    if (i !== i0) t0 = (i0 = i) && attrInterpolate(name, i);
    return t0;
  }
  tween._value = value;
  return tween;
}

function transition_attrTween(name, value) {
  var key = "attr." + name;
  if (arguments.length < 2) return (key = this.tween(key)) && key._value;
  if (value == null) return this.tween(key, null);
  if (typeof value !== "function") throw new Error;
  var fullname = namespace(name);
  return this.tween(key, (fullname.local ? attrTweenNS : attrTween)(fullname, value));
}

function delayFunction(id, value) {
  return function() {
    init(this, id).delay = +value.apply(this, arguments);
  };
}

function delayConstant(id, value) {
  return value = +value, function() {
    init(this, id).delay = value;
  };
}

function transition_delay(value) {
  var id = this._id;

  return arguments.length
      ? this.each((typeof value === "function"
          ? delayFunction
          : delayConstant)(id, value))
      : get$1(this.node(), id).delay;
}

function durationFunction(id, value) {
  return function() {
    set$1(this, id).duration = +value.apply(this, arguments);
  };
}

function durationConstant(id, value) {
  return value = +value, function() {
    set$1(this, id).duration = value;
  };
}

function transition_duration(value) {
  var id = this._id;

  return arguments.length
      ? this.each((typeof value === "function"
          ? durationFunction
          : durationConstant)(id, value))
      : get$1(this.node(), id).duration;
}

function easeConstant(id, value) {
  if (typeof value !== "function") throw new Error;
  return function() {
    set$1(this, id).ease = value;
  };
}

function transition_ease(value) {
  var id = this._id;

  return arguments.length
      ? this.each(easeConstant(id, value))
      : get$1(this.node(), id).ease;
}

function transition_filter(match) {
  if (typeof match !== "function") match = matcher(match);

  for (var groups = this._groups, m = groups.length, subgroups = new Array(m), j = 0; j < m; ++j) {
    for (var group = groups[j], n = group.length, subgroup = subgroups[j] = [], node, i = 0; i < n; ++i) {
      if ((node = group[i]) && match.call(node, node.__data__, i, group)) {
        subgroup.push(node);
      }
    }
  }

  return new Transition(subgroups, this._parents, this._name, this._id);
}

function transition_merge(transition$$1) {
  if (transition$$1._id !== this._id) throw new Error;

  for (var groups0 = this._groups, groups1 = transition$$1._groups, m0 = groups0.length, m1 = groups1.length, m = Math.min(m0, m1), merges = new Array(m0), j = 0; j < m; ++j) {
    for (var group0 = groups0[j], group1 = groups1[j], n = group0.length, merge = merges[j] = new Array(n), node, i = 0; i < n; ++i) {
      if (node = group0[i] || group1[i]) {
        merge[i] = node;
      }
    }
  }

  for (; j < m0; ++j) {
    merges[j] = groups0[j];
  }

  return new Transition(merges, this._parents, this._name, this._id);
}

function start(name) {
  return (name + "").trim().split(/^|\s+/).every(function(t) {
    var i = t.indexOf(".");
    if (i >= 0) t = t.slice(0, i);
    return !t || t === "start";
  });
}

function onFunction(id, name, listener) {
  var on0, on1, sit = start(name) ? init : set$1;
  return function() {
    var schedule$$1 = sit(this, id),
        on = schedule$$1.on;

    // If this node shared a dispatch with the previous node,
    // just assign the updated shared dispatch and we’re done!
    // Otherwise, copy-on-write.
    if (on !== on0) (on1 = (on0 = on).copy()).on(name, listener);

    schedule$$1.on = on1;
  };
}

function transition_on(name, listener) {
  var id = this._id;

  return arguments.length < 2
      ? get$1(this.node(), id).on.on(name)
      : this.each(onFunction(id, name, listener));
}

function removeFunction(id) {
  return function() {
    var parent = this.parentNode;
    for (var i in this.__transition) if (+i !== id) return;
    if (parent) parent.removeChild(this);
  };
}

function transition_remove() {
  return this.on("end.remove", removeFunction(this._id));
}

function transition_select(select$$1) {
  var name = this._name,
      id = this._id;

  if (typeof select$$1 !== "function") select$$1 = selector(select$$1);

  for (var groups = this._groups, m = groups.length, subgroups = new Array(m), j = 0; j < m; ++j) {
    for (var group = groups[j], n = group.length, subgroup = subgroups[j] = new Array(n), node, subnode, i = 0; i < n; ++i) {
      if ((node = group[i]) && (subnode = select$$1.call(node, node.__data__, i, group))) {
        if ("__data__" in node) subnode.__data__ = node.__data__;
        subgroup[i] = subnode;
        schedule(subgroup[i], name, id, i, subgroup, get$1(node, id));
      }
    }
  }

  return new Transition(subgroups, this._parents, name, id);
}

function transition_selectAll(select$$1) {
  var name = this._name,
      id = this._id;

  if (typeof select$$1 !== "function") select$$1 = selectorAll(select$$1);

  for (var groups = this._groups, m = groups.length, subgroups = [], parents = [], j = 0; j < m; ++j) {
    for (var group = groups[j], n = group.length, node, i = 0; i < n; ++i) {
      if (node = group[i]) {
        for (var children = select$$1.call(node, node.__data__, i, group), child, inherit = get$1(node, id), k = 0, l = children.length; k < l; ++k) {
          if (child = children[k]) {
            schedule(child, name, id, k, children, inherit);
          }
        }
        subgroups.push(children);
        parents.push(node);
      }
    }
  }

  return new Transition(subgroups, parents, name, id);
}

var Selection$1 = selection.prototype.constructor;

function transition_selection() {
  return new Selection$1(this._groups, this._parents);
}

function styleNull(name, interpolate$$1) {
  var string00,
      string10,
      interpolate0;
  return function() {
    var string0 = styleValue(this, name),
        string1 = (this.style.removeProperty(name), styleValue(this, name));
    return string0 === string1 ? null
        : string0 === string00 && string1 === string10 ? interpolate0
        : interpolate0 = interpolate$$1(string00 = string0, string10 = string1);
  };
}

function styleRemove$1(name) {
  return function() {
    this.style.removeProperty(name);
  };
}

function styleConstant$1(name, interpolate$$1, value1) {
  var string00,
      string1 = value1 + "",
      interpolate0;
  return function() {
    var string0 = styleValue(this, name);
    return string0 === string1 ? null
        : string0 === string00 ? interpolate0
        : interpolate0 = interpolate$$1(string00 = string0, value1);
  };
}

function styleFunction$1(name, interpolate$$1, value) {
  var string00,
      string10,
      interpolate0;
  return function() {
    var string0 = styleValue(this, name),
        value1 = value(this),
        string1 = value1 + "";
    if (value1 == null) string1 = value1 = (this.style.removeProperty(name), styleValue(this, name));
    return string0 === string1 ? null
        : string0 === string00 && string1 === string10 ? interpolate0
        : (string10 = string1, interpolate0 = interpolate$$1(string00 = string0, value1));
  };
}

function styleMaybeRemove(id, name) {
  var on0, on1, listener0, key = "style." + name, event$$1 = "end." + key, remove;
  return function() {
    var schedule$$1 = set$1(this, id),
        on = schedule$$1.on,
        listener = schedule$$1.value[key] == null ? remove || (remove = styleRemove$1(name)) : undefined;

    // If this node shared a dispatch with the previous node,
    // just assign the updated shared dispatch and we’re done!
    // Otherwise, copy-on-write.
    if (on !== on0 || listener0 !== listener) (on1 = (on0 = on).copy()).on(event$$1, listener0 = listener);

    schedule$$1.on = on1;
  };
}

function transition_style(name, value, priority) {
  var i = (name += "") === "transform" ? interpolateTransformCss : interpolate;
  return value == null ? this
      .styleTween(name, styleNull(name, i))
      .on("end.style." + name, styleRemove$1(name))
    : typeof value === "function" ? this
      .styleTween(name, styleFunction$1(name, i, tweenValue(this, "style." + name, value)))
      .each(styleMaybeRemove(this._id, name))
    : this
      .styleTween(name, styleConstant$1(name, i, value), priority)
      .on("end.style." + name, null);
}

function styleInterpolate(name, i, priority) {
  return function(t) {
    this.style.setProperty(name, i(t), priority);
  };
}

function styleTween(name, value, priority) {
  var t, i0;
  function tween() {
    var i = value.apply(this, arguments);
    if (i !== i0) t = (i0 = i) && styleInterpolate(name, i, priority);
    return t;
  }
  tween._value = value;
  return tween;
}

function transition_styleTween(name, value, priority) {
  var key = "style." + (name += "");
  if (arguments.length < 2) return (key = this.tween(key)) && key._value;
  if (value == null) return this.tween(key, null);
  if (typeof value !== "function") throw new Error;
  return this.tween(key, styleTween(name, value, priority == null ? "" : priority));
}

function textConstant$1(value) {
  return function() {
    this.textContent = value;
  };
}

function textFunction$1(value) {
  return function() {
    var value1 = value(this);
    this.textContent = value1 == null ? "" : value1;
  };
}

function transition_text(value) {
  return this.tween("text", typeof value === "function"
      ? textFunction$1(tweenValue(this, "text", value))
      : textConstant$1(value == null ? "" : value + ""));
}

function transition_transition() {
  var name = this._name,
      id0 = this._id,
      id1 = newId();

  for (var groups = this._groups, m = groups.length, j = 0; j < m; ++j) {
    for (var group = groups[j], n = group.length, node, i = 0; i < n; ++i) {
      if (node = group[i]) {
        var inherit = get$1(node, id0);
        schedule(node, name, id1, i, group, {
          time: inherit.time + inherit.delay + inherit.duration,
          delay: 0,
          duration: inherit.duration,
          ease: inherit.ease
        });
      }
    }
  }

  return new Transition(groups, this._parents, name, id1);
}

function transition_end() {
  var on0, on1, that = this, id = that._id, size = that.size();
  return new Promise(function(resolve, reject) {
    var cancel = {value: reject},
        end = {value: function() { if (--size === 0) resolve(); }};

    that.each(function() {
      var schedule$$1 = set$1(this, id),
          on = schedule$$1.on;

      // If this node shared a dispatch with the previous node,
      // just assign the updated shared dispatch and we’re done!
      // Otherwise, copy-on-write.
      if (on !== on0) {
        on1 = (on0 = on).copy();
        on1._.cancel.push(cancel);
        on1._.interrupt.push(cancel);
        on1._.end.push(end);
      }

      schedule$$1.on = on1;
    });
  });
}

var id = 0;

function Transition(groups, parents, name, id) {
  this._groups = groups;
  this._parents = parents;
  this._name = name;
  this._id = id;
}

function transition(name) {
  return selection().transition(name);
}

function newId() {
  return ++id;
}

var selection_prototype = selection.prototype;

Transition.prototype = transition.prototype = {
  constructor: Transition,
  select: transition_select,
  selectAll: transition_selectAll,
  filter: transition_filter,
  merge: transition_merge,
  selection: transition_selection,
  transition: transition_transition,
  call: selection_prototype.call,
  nodes: selection_prototype.nodes,
  node: selection_prototype.node,
  size: selection_prototype.size,
  empty: selection_prototype.empty,
  each: selection_prototype.each,
  on: transition_on,
  attr: transition_attr,
  attrTween: transition_attrTween,
  style: transition_style,
  styleTween: transition_styleTween,
  text: transition_text,
  remove: transition_remove,
  tween: transition_tween,
  delay: transition_delay,
  duration: transition_duration,
  ease: transition_ease,
  end: transition_end
};

function cubicInOut(t) {
  return ((t *= 2) <= 1 ? t * t * t : (t -= 2) * t * t + 2) / 2;
}

var pi = Math.PI;

var tau = 2 * Math.PI;

var defaultTiming = {
  time: null, // Set on use.
  delay: 0,
  duration: 250,
  ease: cubicInOut
};

function inherit(node, id) {
  var timing;
  while (!(timing = node.__transition) || !(timing = timing[id])) {
    if (!(node = node.parentNode)) {
      return defaultTiming.time = now(), defaultTiming;
    }
  }
  return timing;
}

function selection_transition(name) {
  var id,
      timing;

  if (name instanceof Transition) {
    id = name._id, name = name._name;
  } else {
    id = newId(), (timing = defaultTiming).time = now(), name = name == null ? null : name + "";
  }

  for (var groups = this._groups, m = groups.length, j = 0; j < m; ++j) {
    for (var group = groups[j], n = group.length, node, i = 0; i < n; ++i) {
      if (node = group[i]) {
        schedule(node, name, id, i, group, timing || inherit(node, id));
      }
    }
  }

  return new Transition(groups, this._parents, name, id);
}

selection.prototype.interrupt = selection_interrupt;
selection.prototype.transition = selection_transition;
var pi$1 = Math.PI;

var pi$2 = Math.PI,
    tau$2 = 2 * pi$2,
    epsilon$1 = 1e-6,
    tauEpsilon = tau$2 - epsilon$1;

function Path() {
  this._x0 = this._y0 = // start of current subpath
  this._x1 = this._y1 = null; // end of current subpath
  this._ = "";
}

function path() {
  return new Path;
}

Path.prototype = path.prototype = {
  constructor: Path,
  moveTo: function(x, y) {
    this._ += "M" + (this._x0 = this._x1 = +x) + "," + (this._y0 = this._y1 = +y);
  },
  closePath: function() {
    if (this._x1 !== null) {
      this._x1 = this._x0, this._y1 = this._y0;
      this._ += "Z";
    }
  },
  lineTo: function(x, y) {
    this._ += "L" + (this._x1 = +x) + "," + (this._y1 = +y);
  },
  quadraticCurveTo: function(x1, y1, x, y) {
    this._ += "Q" + (+x1) + "," + (+y1) + "," + (this._x1 = +x) + "," + (this._y1 = +y);
  },
  bezierCurveTo: function(x1, y1, x2, y2, x, y) {
    this._ += "C" + (+x1) + "," + (+y1) + "," + (+x2) + "," + (+y2) + "," + (this._x1 = +x) + "," + (this._y1 = +y);
  },
  arcTo: function(x1, y1, x2, y2, r) {
    x1 = +x1, y1 = +y1, x2 = +x2, y2 = +y2, r = +r;
    var x0 = this._x1,
        y0 = this._y1,
        x21 = x2 - x1,
        y21 = y2 - y1,
        x01 = x0 - x1,
        y01 = y0 - y1,
        l01_2 = x01 * x01 + y01 * y01;

    // Is the radius negative? Error.
    if (r < 0) throw new Error("negative radius: " + r);

    // Is this path empty? Move to (x1,y1).
    if (this._x1 === null) {
      this._ += "M" + (this._x1 = x1) + "," + (this._y1 = y1);
    }

    // Or, is (x1,y1) coincident with (x0,y0)? Do nothing.
    else if (!(l01_2 > epsilon$1));

    // Or, are (x0,y0), (x1,y1) and (x2,y2) collinear?
    // Equivalently, is (x1,y1) coincident with (x2,y2)?
    // Or, is the radius zero? Line to (x1,y1).
    else if (!(Math.abs(y01 * x21 - y21 * x01) > epsilon$1) || !r) {
      this._ += "L" + (this._x1 = x1) + "," + (this._y1 = y1);
    }

    // Otherwise, draw an arc!
    else {
      var x20 = x2 - x0,
          y20 = y2 - y0,
          l21_2 = x21 * x21 + y21 * y21,
          l20_2 = x20 * x20 + y20 * y20,
          l21 = Math.sqrt(l21_2),
          l01 = Math.sqrt(l01_2),
          l = r * Math.tan((pi$2 - Math.acos((l21_2 + l01_2 - l20_2) / (2 * l21 * l01))) / 2),
          t01 = l / l01,
          t21 = l / l21;

      // If the start tangent is not coincident with (x0,y0), line to.
      if (Math.abs(t01 - 1) > epsilon$1) {
        this._ += "L" + (x1 + t01 * x01) + "," + (y1 + t01 * y01);
      }

      this._ += "A" + r + "," + r + ",0,0," + (+(y01 * x20 > x01 * y20)) + "," + (this._x1 = x1 + t21 * x21) + "," + (this._y1 = y1 + t21 * y21);
    }
  },
  arc: function(x, y, r, a0, a1, ccw) {
    x = +x, y = +y, r = +r;
    var dx = r * Math.cos(a0),
        dy = r * Math.sin(a0),
        x0 = x + dx,
        y0 = y + dy,
        cw = 1 ^ ccw,
        da = ccw ? a0 - a1 : a1 - a0;

    // Is the radius negative? Error.
    if (r < 0) throw new Error("negative radius: " + r);

    // Is this path empty? Move to (x0,y0).
    if (this._x1 === null) {
      this._ += "M" + x0 + "," + y0;
    }

    // Or, is (x0,y0) not coincident with the previous point? Line to (x0,y0).
    else if (Math.abs(this._x1 - x0) > epsilon$1 || Math.abs(this._y1 - y0) > epsilon$1) {
      this._ += "L" + x0 + "," + y0;
    }

    // Is this arc empty? We’re done.
    if (!r) return;

    // Does the angle go the wrong way? Flip the direction.
    if (da < 0) da = da % tau$2 + tau$2;

    // Is this a complete circle? Draw two arcs to complete the circle.
    if (da > tauEpsilon) {
      this._ += "A" + r + "," + r + ",0,1," + cw + "," + (x - dx) + "," + (y - dy) + "A" + r + "," + r + ",0,1," + cw + "," + (this._x1 = x0) + "," + (this._y1 = y0);
    }

    // Is this arc non-empty? Draw an arc!
    else if (da > epsilon$1) {
      this._ += "A" + r + "," + r + ",0," + (+(da >= pi$2)) + "," + cw + "," + (this._x1 = x + r * Math.cos(a1)) + "," + (this._y1 = y + r * Math.sin(a1));
    }
  },
  rect: function(x, y, w, h) {
    this._ += "M" + (this._x0 = this._x1 = +x) + "," + (this._y0 = this._y1 = +y) + "h" + (+w) + "v" + (+h) + "h" + (-w) + "Z";
  },
  toString: function() {
    return this._;
  }
};

var prefix = "$";

function Map$1() {}

Map$1.prototype = map$1.prototype = {
  constructor: Map$1,
  has: function(key) {
    return (prefix + key) in this;
  },
  get: function(key) {
    return this[prefix + key];
  },
  set: function(key, value) {
    this[prefix + key] = value;
    return this;
  },
  remove: function(key) {
    var property = prefix + key;
    return property in this && delete this[property];
  },
  clear: function() {
    for (var property in this) if (property[0] === prefix) delete this[property];
  },
  keys: function() {
    var keys = [];
    for (var property in this) if (property[0] === prefix) keys.push(property.slice(1));
    return keys;
  },
  values: function() {
    var values = [];
    for (var property in this) if (property[0] === prefix) values.push(this[property]);
    return values;
  },
  entries: function() {
    var entries = [];
    for (var property in this) if (property[0] === prefix) entries.push({key: property.slice(1), value: this[property]});
    return entries;
  },
  size: function() {
    var size = 0;
    for (var property in this) if (property[0] === prefix) ++size;
    return size;
  },
  empty: function() {
    for (var property in this) if (property[0] === prefix) return false;
    return true;
  },
  each: function(f) {
    for (var property in this) if (property[0] === prefix) f(this[property], property.slice(1), this);
  }
};

function map$1(object, f) {
  var map = new Map$1;

  // Copy constructor.
  if (object instanceof Map$1) object.each(function(value, key) { map.set(key, value); });

  // Index array by numeric index or specified key function.
  else if (Array.isArray(object)) {
    var i = -1,
        n = object.length,
        o;

    if (f == null) while (++i < n) map.set(i, object[i]);
    else while (++i < n) map.set(f(o = object[i], i, object), o);
  }

  // Convert object to map.
  else if (object) for (var key in object) map.set(key, object[key]);

  return map;
}

function Set$1() {}

var proto = map$1.prototype;

Set$1.prototype = set$2.prototype = {
  constructor: Set$1,
  has: proto.has,
  add: function(value) {
    value += "";
    this[prefix + value] = value;
    return this;
  },
  remove: proto.remove,
  clear: proto.clear,
  values: proto.keys,
  size: proto.size,
  empty: proto.empty,
  each: proto.each
};

function set$2(object, f) {
  var set = new Set$1;

  // Copy constructor.
  if (object instanceof Set$1) object.each(function(value) { set.add(value); });

  // Otherwise, assume it’s an array.
  else if (object) {
    var i = -1, n = object.length;
    if (f == null) while (++i < n) set.add(object[i]);
    else while (++i < n) set.add(f(object[i], i, object));
  }

  return set;
}

var EOL = {},
    EOF = {},
    QUOTE = 34,
    NEWLINE = 10,
    RETURN = 13;

function objectConverter(columns) {
  return new Function("d", "return {" + columns.map(function(name, i) {
    return JSON.stringify(name) + ": d[" + i + "]";
  }).join(",") + "}");
}

function customConverter(columns, f) {
  var object = objectConverter(columns);
  return function(row, i) {
    return f(object(row), i, columns);
  };
}

// Compute unique columns in order of discovery.
function inferColumns(rows) {
  var columnSet = Object.create(null),
      columns = [];

  rows.forEach(function(row) {
    for (var column in row) {
      if (!(column in columnSet)) {
        columns.push(columnSet[column] = column);
      }
    }
  });

  return columns;
}

function pad(value, width) {
  var s = value + "", length = s.length;
  return length < width ? new Array(width - length + 1).join(0) + s : s;
}

function formatYear(year) {
  return year < 0 ? "-" + pad(-year, 6)
    : year > 9999 ? "+" + pad(year, 6)
    : pad(year, 4);
}

function formatDate(date) {
  var hours = date.getUTCHours(),
      minutes = date.getUTCMinutes(),
      seconds = date.getUTCSeconds(),
      milliseconds = date.getUTCMilliseconds();
  return isNaN(date) ? "Invalid Date"
      : formatYear(date.getUTCFullYear(), 4) + "-" + pad(date.getUTCMonth() + 1, 2) + "-" + pad(date.getUTCDate(), 2)
      + (milliseconds ? "T" + pad(hours, 2) + ":" + pad(minutes, 2) + ":" + pad(seconds, 2) + "." + pad(milliseconds, 3) + "Z"
      : seconds ? "T" + pad(hours, 2) + ":" + pad(minutes, 2) + ":" + pad(seconds, 2) + "Z"
      : minutes || hours ? "T" + pad(hours, 2) + ":" + pad(minutes, 2) + "Z"
      : "");
}

function dsvFormat(delimiter) {
  var reFormat = new RegExp("[\"" + delimiter + "\n\r]"),
      DELIMITER = delimiter.charCodeAt(0);

  function parse(text, f) {
    var convert, columns, rows = parseRows(text, function(row, i) {
      if (convert) return convert(row, i - 1);
      columns = row, convert = f ? customConverter(row, f) : objectConverter(row);
    });
    rows.columns = columns || [];
    return rows;
  }

  function parseRows(text, f) {
    var rows = [], // output rows
        N = text.length,
        I = 0, // current character index
        n = 0, // current line number
        t, // current token
        eof = N <= 0, // current token followed by EOF?
        eol = false; // current token followed by EOL?

    // Strip the trailing newline.
    if (text.charCodeAt(N - 1) === NEWLINE) --N;
    if (text.charCodeAt(N - 1) === RETURN) --N;

    function token() {
      if (eof) return EOF;
      if (eol) return eol = false, EOL;

      // Unescape quotes.
      var i, j = I, c;
      if (text.charCodeAt(j) === QUOTE) {
        while (I++ < N && text.charCodeAt(I) !== QUOTE || text.charCodeAt(++I) === QUOTE);
        if ((i = I) >= N) eof = true;
        else if ((c = text.charCodeAt(I++)) === NEWLINE) eol = true;
        else if (c === RETURN) { eol = true; if (text.charCodeAt(I) === NEWLINE) ++I; }
        return text.slice(j + 1, i - 1).replace(/""/g, "\"");
      }

      // Find next delimiter or newline.
      while (I < N) {
        if ((c = text.charCodeAt(i = I++)) === NEWLINE) eol = true;
        else if (c === RETURN) { eol = true; if (text.charCodeAt(I) === NEWLINE) ++I; }
        else if (c !== DELIMITER) continue;
        return text.slice(j, i);
      }

      // Return last token before EOF.
      return eof = true, text.slice(j, N);
    }

    while ((t = token()) !== EOF) {
      var row = [];
      while (t !== EOL && t !== EOF) row.push(t), t = token();
      if (f && (row = f(row, n++)) == null) continue;
      rows.push(row);
    }

    return rows;
  }

  function preformatBody(rows, columns) {
    return rows.map(function(row) {
      return columns.map(function(column) {
        return formatValue(row[column]);
      }).join(delimiter);
    });
  }

  function format(rows, columns) {
    if (columns == null) columns = inferColumns(rows);
    return [columns.map(formatValue).join(delimiter)].concat(preformatBody(rows, columns)).join("\n");
  }

  function formatBody(rows, columns) {
    if (columns == null) columns = inferColumns(rows);
    return preformatBody(rows, columns).join("\n");
  }

  function formatRows(rows) {
    return rows.map(formatRow).join("\n");
  }

  function formatRow(row) {
    return row.map(formatValue).join(delimiter);
  }

  function formatValue(value) {
    return value == null ? ""
        : value instanceof Date ? formatDate(value)
        : reFormat.test(value += "") ? "\"" + value.replace(/"/g, "\"\"") + "\""
        : value;
  }

  return {
    parse: parse,
    parseRows: parseRows,
    format: format,
    formatBody: formatBody,
    formatRows: formatRows
  };
}

var csv = dsvFormat(",");

var tsv = dsvFormat("\t");

function tree_add(d) {
  var x = +this._x.call(null, d),
      y = +this._y.call(null, d);
  return add(this.cover(x, y), x, y, d);
}

function add(tree, x, y, d) {
  if (isNaN(x) || isNaN(y)) return tree; // ignore invalid points

  var parent,
      node = tree._root,
      leaf = {data: d},
      x0 = tree._x0,
      y0 = tree._y0,
      x1 = tree._x1,
      y1 = tree._y1,
      xm,
      ym,
      xp,
      yp,
      right,
      bottom,
      i,
      j;

  // If the tree is empty, initialize the root as a leaf.
  if (!node) return tree._root = leaf, tree;

  // Find the existing leaf for the new point, or add it.
  while (node.length) {
    if (right = x >= (xm = (x0 + x1) / 2)) x0 = xm; else x1 = xm;
    if (bottom = y >= (ym = (y0 + y1) / 2)) y0 = ym; else y1 = ym;
    if (parent = node, !(node = node[i = bottom << 1 | right])) return parent[i] = leaf, tree;
  }

  // Is the new point is exactly coincident with the existing point?
  xp = +tree._x.call(null, node.data);
  yp = +tree._y.call(null, node.data);
  if (x === xp && y === yp) return leaf.next = node, parent ? parent[i] = leaf : tree._root = leaf, tree;

  // Otherwise, split the leaf node until the old and new point are separated.
  do {
    parent = parent ? parent[i] = new Array(4) : tree._root = new Array(4);
    if (right = x >= (xm = (x0 + x1) / 2)) x0 = xm; else x1 = xm;
    if (bottom = y >= (ym = (y0 + y1) / 2)) y0 = ym; else y1 = ym;
  } while ((i = bottom << 1 | right) === (j = (yp >= ym) << 1 | (xp >= xm)));
  return parent[j] = node, parent[i] = leaf, tree;
}

function addAll(data) {
  var d, i, n = data.length,
      x,
      y,
      xz = new Array(n),
      yz = new Array(n),
      x0 = Infinity,
      y0 = Infinity,
      x1 = -Infinity,
      y1 = -Infinity;

  // Compute the points and their extent.
  for (i = 0; i < n; ++i) {
    if (isNaN(x = +this._x.call(null, d = data[i])) || isNaN(y = +this._y.call(null, d))) continue;
    xz[i] = x;
    yz[i] = y;
    if (x < x0) x0 = x;
    if (x > x1) x1 = x;
    if (y < y0) y0 = y;
    if (y > y1) y1 = y;
  }

  // If there were no (valid) points, abort.
  if (x0 > x1 || y0 > y1) return this;

  // Expand the tree to cover the new points.
  this.cover(x0, y0).cover(x1, y1);

  // Add the new points.
  for (i = 0; i < n; ++i) {
    add(this, xz[i], yz[i], data[i]);
  }

  return this;
}

function tree_cover(x, y) {
  if (isNaN(x = +x) || isNaN(y = +y)) return this; // ignore invalid points

  var x0 = this._x0,
      y0 = this._y0,
      x1 = this._x1,
      y1 = this._y1;

  // If the quadtree has no extent, initialize them.
  // Integer extent are necessary so that if we later double the extent,
  // the existing quadrant boundaries don’t change due to floating point error!
  if (isNaN(x0)) {
    x1 = (x0 = Math.floor(x)) + 1;
    y1 = (y0 = Math.floor(y)) + 1;
  }

  // Otherwise, double repeatedly to cover.
  else {
    var z = x1 - x0,
        node = this._root,
        parent,
        i;

    while (x0 > x || x >= x1 || y0 > y || y >= y1) {
      i = (y < y0) << 1 | (x < x0);
      parent = new Array(4), parent[i] = node, node = parent, z *= 2;
      switch (i) {
        case 0: x1 = x0 + z, y1 = y0 + z; break;
        case 1: x0 = x1 - z, y1 = y0 + z; break;
        case 2: x1 = x0 + z, y0 = y1 - z; break;
        case 3: x0 = x1 - z, y0 = y1 - z; break;
      }
    }

    if (this._root && this._root.length) this._root = node;
  }

  this._x0 = x0;
  this._y0 = y0;
  this._x1 = x1;
  this._y1 = y1;
  return this;
}

function tree_data() {
  var data = [];
  this.visit(function(node) {
    if (!node.length) do data.push(node.data); while (node = node.next)
  });
  return data;
}

function tree_extent(_) {
  return arguments.length
      ? this.cover(+_[0][0], +_[0][1]).cover(+_[1][0], +_[1][1])
      : isNaN(this._x0) ? undefined : [[this._x0, this._y0], [this._x1, this._y1]];
}

function Quad(node, x0, y0, x1, y1) {
  this.node = node;
  this.x0 = x0;
  this.y0 = y0;
  this.x1 = x1;
  this.y1 = y1;
}

function tree_find(x, y, radius) {
  var data,
      x0 = this._x0,
      y0 = this._y0,
      x1,
      y1,
      x2,
      y2,
      x3 = this._x1,
      y3 = this._y1,
      quads = [],
      node = this._root,
      q,
      i;

  if (node) quads.push(new Quad(node, x0, y0, x3, y3));
  if (radius == null) radius = Infinity;
  else {
    x0 = x - radius, y0 = y - radius;
    x3 = x + radius, y3 = y + radius;
    radius *= radius;
  }

  while (q = quads.pop()) {

    // Stop searching if this quadrant can’t contain a closer node.
    if (!(node = q.node)
        || (x1 = q.x0) > x3
        || (y1 = q.y0) > y3
        || (x2 = q.x1) < x0
        || (y2 = q.y1) < y0) continue;

    // Bisect the current quadrant.
    if (node.length) {
      var xm = (x1 + x2) / 2,
          ym = (y1 + y2) / 2;

      quads.push(
        new Quad(node[3], xm, ym, x2, y2),
        new Quad(node[2], x1, ym, xm, y2),
        new Quad(node[1], xm, y1, x2, ym),
        new Quad(node[0], x1, y1, xm, ym)
      );

      // Visit the closest quadrant first.
      if (i = (y >= ym) << 1 | (x >= xm)) {
        q = quads[quads.length - 1];
        quads[quads.length - 1] = quads[quads.length - 1 - i];
        quads[quads.length - 1 - i] = q;
      }
    }

    // Visit this point. (Visiting coincident points isn’t necessary!)
    else {
      var dx = x - +this._x.call(null, node.data),
          dy = y - +this._y.call(null, node.data),
          d2 = dx * dx + dy * dy;
      if (d2 < radius) {
        var d = Math.sqrt(radius = d2);
        x0 = x - d, y0 = y - d;
        x3 = x + d, y3 = y + d;
        data = node.data;
      }
    }
  }

  return data;
}

function tree_remove(d) {
  if (isNaN(x = +this._x.call(null, d)) || isNaN(y = +this._y.call(null, d))) return this; // ignore invalid points

  var parent,
      node = this._root,
      retainer,
      previous,
      next,
      x0 = this._x0,
      y0 = this._y0,
      x1 = this._x1,
      y1 = this._y1,
      x,
      y,
      xm,
      ym,
      right,
      bottom,
      i,
      j;

  // If the tree is empty, initialize the root as a leaf.
  if (!node) return this;

  // Find the leaf node for the point.
  // While descending, also retain the deepest parent with a non-removed sibling.
  if (node.length) while (true) {
    if (right = x >= (xm = (x0 + x1) / 2)) x0 = xm; else x1 = xm;
    if (bottom = y >= (ym = (y0 + y1) / 2)) y0 = ym; else y1 = ym;
    if (!(parent = node, node = node[i = bottom << 1 | right])) return this;
    if (!node.length) break;
    if (parent[(i + 1) & 3] || parent[(i + 2) & 3] || parent[(i + 3) & 3]) retainer = parent, j = i;
  }

  // Find the point to remove.
  while (node.data !== d) if (!(previous = node, node = node.next)) return this;
  if (next = node.next) delete node.next;

  // If there are multiple coincident points, remove just the point.
  if (previous) return (next ? previous.next = next : delete previous.next), this;

  // If this is the root point, remove it.
  if (!parent) return this._root = next, this;

  // Remove this leaf.
  next ? parent[i] = next : delete parent[i];

  // If the parent now contains exactly one leaf, collapse superfluous parents.
  if ((node = parent[0] || parent[1] || parent[2] || parent[3])
      && node === (parent[3] || parent[2] || parent[1] || parent[0])
      && !node.length) {
    if (retainer) retainer[j] = node;
    else this._root = node;
  }

  return this;
}

function removeAll(data) {
  for (var i = 0, n = data.length; i < n; ++i) this.remove(data[i]);
  return this;
}

function tree_root() {
  return this._root;
}

function tree_size() {
  var size = 0;
  this.visit(function(node) {
    if (!node.length) do ++size; while (node = node.next)
  });
  return size;
}

function tree_visit(callback) {
  var quads = [], q, node = this._root, child, x0, y0, x1, y1;
  if (node) quads.push(new Quad(node, this._x0, this._y0, this._x1, this._y1));
  while (q = quads.pop()) {
    if (!callback(node = q.node, x0 = q.x0, y0 = q.y0, x1 = q.x1, y1 = q.y1) && node.length) {
      var xm = (x0 + x1) / 2, ym = (y0 + y1) / 2;
      if (child = node[3]) quads.push(new Quad(child, xm, ym, x1, y1));
      if (child = node[2]) quads.push(new Quad(child, x0, ym, xm, y1));
      if (child = node[1]) quads.push(new Quad(child, xm, y0, x1, ym));
      if (child = node[0]) quads.push(new Quad(child, x0, y0, xm, ym));
    }
  }
  return this;
}

function tree_visitAfter(callback) {
  var quads = [], next = [], q;
  if (this._root) quads.push(new Quad(this._root, this._x0, this._y0, this._x1, this._y1));
  while (q = quads.pop()) {
    var node = q.node;
    if (node.length) {
      var child, x0 = q.x0, y0 = q.y0, x1 = q.x1, y1 = q.y1, xm = (x0 + x1) / 2, ym = (y0 + y1) / 2;
      if (child = node[0]) quads.push(new Quad(child, x0, y0, xm, ym));
      if (child = node[1]) quads.push(new Quad(child, xm, y0, x1, ym));
      if (child = node[2]) quads.push(new Quad(child, x0, ym, xm, y1));
      if (child = node[3]) quads.push(new Quad(child, xm, ym, x1, y1));
    }
    next.push(q);
  }
  while (q = next.pop()) {
    callback(q.node, q.x0, q.y0, q.x1, q.y1);
  }
  return this;
}

function defaultX$1(d) {
  return d[0];
}

function tree_x(_) {
  return arguments.length ? (this._x = _, this) : this._x;
}

function defaultY$1(d) {
  return d[1];
}

function tree_y(_) {
  return arguments.length ? (this._y = _, this) : this._y;
}

function quadtree(nodes, x, y) {
  var tree = new Quadtree(x == null ? defaultX$1 : x, y == null ? defaultY$1 : y, NaN, NaN, NaN, NaN);
  return nodes == null ? tree : tree.addAll(nodes);
}

function Quadtree(x, y, x0, y0, x1, y1) {
  this._x = x;
  this._y = y;
  this._x0 = x0;
  this._y0 = y0;
  this._x1 = x1;
  this._y1 = y1;
  this._root = undefined;
}

function leaf_copy(leaf) {
  var copy = {data: leaf.data}, next = copy;
  while (leaf = leaf.next) next = next.next = {data: leaf.data};
  return copy;
}

var treeProto = quadtree.prototype = Quadtree.prototype;

treeProto.copy = function() {
  var copy = new Quadtree(this._x, this._y, this._x0, this._y0, this._x1, this._y1),
      node = this._root,
      nodes,
      child;

  if (!node) return copy;

  if (!node.length) return copy._root = leaf_copy(node), copy;

  nodes = [{source: node, target: copy._root = new Array(4)}];
  while (node = nodes.pop()) {
    for (var i = 0; i < 4; ++i) {
      if (child = node.source[i]) {
        if (child.length) nodes.push({source: child, target: node.target[i] = new Array(4)});
        else node.target[i] = leaf_copy(child);
      }
    }
  }

  return copy;
};

treeProto.add = tree_add;
treeProto.addAll = addAll;
treeProto.cover = tree_cover;
treeProto.data = tree_data;
treeProto.extent = tree_extent;
treeProto.find = tree_find;
treeProto.remove = tree_remove;
treeProto.removeAll = removeAll;
treeProto.root = tree_root;
treeProto.size = tree_size;
treeProto.visit = tree_visit;
treeProto.visitAfter = tree_visitAfter;
treeProto.x = tree_x;
treeProto.y = tree_y;

var initialAngle = Math.PI * (3 - Math.sqrt(5));

// Computes the decimal coefficient and exponent of the specified number x with
// significant digits p, where x is positive and p is in [1, 21] or undefined.
// For example, formatDecimal(1.23) returns ["123", 0].
function formatDecimal(x, p) {
  if ((i = (x = p ? x.toExponential(p - 1) : x.toExponential()).indexOf("e")) < 0) return null; // NaN, ±Infinity
  var i, coefficient = x.slice(0, i);

  // The string returned by toExponential either has the form \d\.\d+e[-+]\d+
  // (e.g., 1.2e+3) or the form \de[-+]\d+ (e.g., 1e+3).
  return [
    coefficient.length > 1 ? coefficient[0] + coefficient.slice(2) : coefficient,
    +x.slice(i + 1)
  ];
}

function exponent$1(x) {
  return x = formatDecimal(Math.abs(x)), x ? x[1] : NaN;
}

function formatGroup(grouping, thousands) {
  return function(value, width) {
    var i = value.length,
        t = [],
        j = 0,
        g = grouping[0],
        length = 0;

    while (i > 0 && g > 0) {
      if (length + g + 1 > width) g = Math.max(1, width - length);
      t.push(value.substring(i -= g, i + g));
      if ((length += g + 1) > width) break;
      g = grouping[j = (j + 1) % grouping.length];
    }

    return t.reverse().join(thousands);
  };
}

function formatNumerals(numerals) {
  return function(value) {
    return value.replace(/[0-9]/g, function(i) {
      return numerals[+i];
    });
  };
}

// [[fill]align][sign][symbol][0][width][,][.precision][~][type]
var re = /^(?:(.)?([<>=^]))?([+\-( ])?([$#])?(0)?(\d+)?(,)?(\.\d+)?(~)?([a-z%])?$/i;

function formatSpecifier(specifier) {
  return new FormatSpecifier(specifier);
}

formatSpecifier.prototype = FormatSpecifier.prototype; // instanceof

function FormatSpecifier(specifier) {
  if (!(match = re.exec(specifier))) throw new Error("invalid format: " + specifier);
  var match;
  this.fill = match[1] || " ";
  this.align = match[2] || ">";
  this.sign = match[3] || "-";
  this.symbol = match[4] || "";
  this.zero = !!match[5];
  this.width = match[6] && +match[6];
  this.comma = !!match[7];
  this.precision = match[8] && +match[8].slice(1);
  this.trim = !!match[9];
  this.type = match[10] || "";
}

FormatSpecifier.prototype.toString = function() {
  return this.fill
      + this.align
      + this.sign
      + this.symbol
      + (this.zero ? "0" : "")
      + (this.width == null ? "" : Math.max(1, this.width | 0))
      + (this.comma ? "," : "")
      + (this.precision == null ? "" : "." + Math.max(0, this.precision | 0))
      + (this.trim ? "~" : "")
      + this.type;
};

// Trims insignificant zeros, e.g., replaces 1.2000k with 1.2k.
function formatTrim(s) {
  out: for (var n = s.length, i = 1, i0 = -1, i1; i < n; ++i) {
    switch (s[i]) {
      case ".": i0 = i1 = i; break;
      case "0": if (i0 === 0) i0 = i; i1 = i; break;
      default: if (i0 > 0) { if (!+s[i]) break out; i0 = 0; } break;
    }
  }
  return i0 > 0 ? s.slice(0, i0) + s.slice(i1 + 1) : s;
}

var prefixExponent;

function formatPrefixAuto(x, p) {
  var d = formatDecimal(x, p);
  if (!d) return x + "";
  var coefficient = d[0],
      exponent = d[1],
      i = exponent - (prefixExponent = Math.max(-8, Math.min(8, Math.floor(exponent / 3))) * 3) + 1,
      n = coefficient.length;
  return i === n ? coefficient
      : i > n ? coefficient + new Array(i - n + 1).join("0")
      : i > 0 ? coefficient.slice(0, i) + "." + coefficient.slice(i)
      : "0." + new Array(1 - i).join("0") + formatDecimal(x, Math.max(0, p + i - 1))[0]; // less than 1y!
}

function formatRounded(x, p) {
  var d = formatDecimal(x, p);
  if (!d) return x + "";
  var coefficient = d[0],
      exponent = d[1];
  return exponent < 0 ? "0." + new Array(-exponent).join("0") + coefficient
      : coefficient.length > exponent + 1 ? coefficient.slice(0, exponent + 1) + "." + coefficient.slice(exponent + 1)
      : coefficient + new Array(exponent - coefficient.length + 2).join("0");
}

var formatTypes = {
  "%": function(x, p) { return (x * 100).toFixed(p); },
  "b": function(x) { return Math.round(x).toString(2); },
  "c": function(x) { return x + ""; },
  "d": function(x) { return Math.round(x).toString(10); },
  "e": function(x, p) { return x.toExponential(p); },
  "f": function(x, p) { return x.toFixed(p); },
  "g": function(x, p) { return x.toPrecision(p); },
  "o": function(x) { return Math.round(x).toString(8); },
  "p": function(x, p) { return formatRounded(x * 100, p); },
  "r": formatRounded,
  "s": formatPrefixAuto,
  "X": function(x) { return Math.round(x).toString(16).toUpperCase(); },
  "x": function(x) { return Math.round(x).toString(16); }
};

function identity$3(x) {
  return x;
}

var prefixes = ["y","z","a","f","p","n","\xB5","m","","k","M","G","T","P","E","Z","Y"];

function formatLocale(locale) {
  var group = locale.grouping && locale.thousands ? formatGroup(locale.grouping, locale.thousands) : identity$3,
      currency = locale.currency,
      decimal = locale.decimal,
      numerals = locale.numerals ? formatNumerals(locale.numerals) : identity$3,
      percent = locale.percent || "%";

  function newFormat(specifier) {
    specifier = formatSpecifier(specifier);

    var fill = specifier.fill,
        align = specifier.align,
        sign = specifier.sign,
        symbol = specifier.symbol,
        zero = specifier.zero,
        width = specifier.width,
        comma = specifier.comma,
        precision = specifier.precision,
        trim = specifier.trim,
        type = specifier.type;

    // The "n" type is an alias for ",g".
    if (type === "n") comma = true, type = "g";

    // The "" type, and any invalid type, is an alias for ".12~g".
    else if (!formatTypes[type]) precision == null && (precision = 12), trim = true, type = "g";

    // If zero fill is specified, padding goes after sign and before digits.
    if (zero || (fill === "0" && align === "=")) zero = true, fill = "0", align = "=";

    // Compute the prefix and suffix.
    // For SI-prefix, the suffix is lazily computed.
    var prefix = symbol === "$" ? currency[0] : symbol === "#" && /[boxX]/.test(type) ? "0" + type.toLowerCase() : "",
        suffix = symbol === "$" ? currency[1] : /[%p]/.test(type) ? percent : "";

    // What format function should we use?
    // Is this an integer type?
    // Can this type generate exponential notation?
    var formatType = formatTypes[type],
        maybeSuffix = /[defgprs%]/.test(type);

    // Set the default precision if not specified,
    // or clamp the specified precision to the supported range.
    // For significant precision, it must be in [1, 21].
    // For fixed precision, it must be in [0, 20].
    precision = precision == null ? 6
        : /[gprs]/.test(type) ? Math.max(1, Math.min(21, precision))
        : Math.max(0, Math.min(20, precision));

    function format(value) {
      var valuePrefix = prefix,
          valueSuffix = suffix,
          i, n, c;

      if (type === "c") {
        valueSuffix = formatType(value) + valueSuffix;
        value = "";
      } else {
        value = +value;

        // Perform the initial formatting.
        var valueNegative = value < 0;
        value = formatType(Math.abs(value), precision);

        // Trim insignificant zeros.
        if (trim) value = formatTrim(value);

        // If a negative value rounds to zero during formatting, treat as positive.
        if (valueNegative && +value === 0) valueNegative = false;

        // Compute the prefix and suffix.
        valuePrefix = (valueNegative ? (sign === "(" ? sign : "-") : sign === "-" || sign === "(" ? "" : sign) + valuePrefix;
        valueSuffix = (type === "s" ? prefixes[8 + prefixExponent / 3] : "") + valueSuffix + (valueNegative && sign === "(" ? ")" : "");

        // Break the formatted value into the integer “value” part that can be
        // grouped, and fractional or exponential “suffix” part that is not.
        if (maybeSuffix) {
          i = -1, n = value.length;
          while (++i < n) {
            if (c = value.charCodeAt(i), 48 > c || c > 57) {
              valueSuffix = (c === 46 ? decimal + value.slice(i + 1) : value.slice(i)) + valueSuffix;
              value = value.slice(0, i);
              break;
            }
          }
        }
      }

      // If the fill character is not "0", grouping is applied before padding.
      if (comma && !zero) value = group(value, Infinity);

      // Compute the padding.
      var length = valuePrefix.length + value.length + valueSuffix.length,
          padding = length < width ? new Array(width - length + 1).join(fill) : "";

      // If the fill character is "0", grouping is applied after padding.
      if (comma && zero) value = group(padding + value, padding.length ? width - valueSuffix.length : Infinity), padding = "";

      // Reconstruct the final output based on the desired alignment.
      switch (align) {
        case "<": value = valuePrefix + value + valueSuffix + padding; break;
        case "=": value = valuePrefix + padding + value + valueSuffix; break;
        case "^": value = padding.slice(0, length = padding.length >> 1) + valuePrefix + value + valueSuffix + padding.slice(length); break;
        default: value = padding + valuePrefix + value + valueSuffix; break;
      }

      return numerals(value);
    }

    format.toString = function() {
      return specifier + "";
    };

    return format;
  }

  function formatPrefix(specifier, value) {
    var f = newFormat((specifier = formatSpecifier(specifier), specifier.type = "f", specifier)),
        e = Math.max(-8, Math.min(8, Math.floor(exponent$1(value) / 3))) * 3,
        k = Math.pow(10, -e),
        prefix = prefixes[8 + e / 3];
    return function(value) {
      return f(k * value) + prefix;
    };
  }

  return {
    format: newFormat,
    formatPrefix: formatPrefix
  };
}

var locale;
var format;
var formatPrefix;

defaultLocale({
  decimal: ".",
  thousands: ",",
  grouping: [3],
  currency: ["$", ""]
});

function defaultLocale(definition) {
  locale = formatLocale(definition);
  format = locale.format;
  formatPrefix = locale.formatPrefix;
  return locale;
}

// Adds floating point numbers with twice the normal precision.
// Reference: J. R. Shewchuk, Adaptive Precision Floating-Point Arithmetic and
// Fast Robust Geometric Predicates, Discrete & Computational Geometry 18(3)
// 305–363 (1997).
// Code adapted from GeographicLib by Charles F. F. Karney,
// http://geographiclib.sourceforge.net/

function adder() {
  return new Adder;
}

function Adder() {
  this.reset();
}

Adder.prototype = {
  constructor: Adder,
  reset: function() {
    this.s = // rounded value
    this.t = 0; // exact error
  },
  add: function(y) {
    add$1(temp, y, this.t);
    add$1(this, temp.s, this.s);
    if (this.s) this.t += temp.t;
    else this.s = temp.t;
  },
  valueOf: function() {
    return this.s;
  }
};

var temp = new Adder;

function add$1(adder, a, b) {
  var x = adder.s = a + b,
      bv = x - a,
      av = x - bv;
  adder.t = (a - av) + (b - bv);
}
var pi$3 = Math.PI;

var areaRingSum = adder();

var areaSum = adder();

var deltaSum = adder();

var sum$1 = adder();

var lengthSum = adder();

var areaSum$1 = adder(),
    areaRingSum$1 = adder();

var lengthSum$1 = adder();

var t0$1 = new Date,
    t1$1 = new Date;

function newInterval(floori, offseti, count, field) {

  function interval(date) {
    return floori(date = new Date(+date)), date;
  }

  interval.floor = interval;

  interval.ceil = function(date) {
    return floori(date = new Date(date - 1)), offseti(date, 1), floori(date), date;
  };

  interval.round = function(date) {
    var d0 = interval(date),
        d1 = interval.ceil(date);
    return date - d0 < d1 - date ? d0 : d1;
  };

  interval.offset = function(date, step) {
    return offseti(date = new Date(+date), step == null ? 1 : Math.floor(step)), date;
  };

  interval.range = function(start, stop, step) {
    var range = [], previous;
    start = interval.ceil(start);
    step = step == null ? 1 : Math.floor(step);
    if (!(start < stop) || !(step > 0)) return range; // also handles Invalid Date
    do range.push(previous = new Date(+start)), offseti(start, step), floori(start);
    while (previous < start && start < stop);
    return range;
  };

  interval.filter = function(test) {
    return newInterval(function(date) {
      if (date >= date) while (floori(date), !test(date)) date.setTime(date - 1);
    }, function(date, step) {
      if (date >= date) {
        if (step < 0) while (++step <= 0) {
          while (offseti(date, -1), !test(date)) {} // eslint-disable-line no-empty
        } else while (--step >= 0) {
          while (offseti(date, +1), !test(date)) {} // eslint-disable-line no-empty
        }
      }
    });
  };

  if (count) {
    interval.count = function(start, end) {
      t0$1.setTime(+start), t1$1.setTime(+end);
      floori(t0$1), floori(t1$1);
      return Math.floor(count(t0$1, t1$1));
    };

    interval.every = function(step) {
      step = Math.floor(step);
      return !isFinite(step) || !(step > 0) ? null
          : !(step > 1) ? interval
          : interval.filter(field
              ? function(d) { return field(d) % step === 0; }
              : function(d) { return interval.count(0, d) % step === 0; });
    };
  }

  return interval;
}

var millisecond = newInterval(function() {
  // noop
}, function(date, step) {
  date.setTime(+date + step);
}, function(start, end) {
  return end - start;
});

// An optimized implementation for this simple case.
millisecond.every = function(k) {
  k = Math.floor(k);
  if (!isFinite(k) || !(k > 0)) return null;
  if (!(k > 1)) return millisecond;
  return newInterval(function(date) {
    date.setTime(Math.floor(date / k) * k);
  }, function(date, step) {
    date.setTime(+date + step * k);
  }, function(start, end) {
    return (end - start) / k;
  });
};

var durationSecond = 1e3;
var durationMinute = 6e4;
var durationHour = 36e5;
var durationDay = 864e5;
var durationWeek = 6048e5;

var second = newInterval(function(date) {
  date.setTime(date - date.getMilliseconds());
}, function(date, step) {
  date.setTime(+date + step * durationSecond);
}, function(start, end) {
  return (end - start) / durationSecond;
}, function(date) {
  return date.getUTCSeconds();
});

var minute = newInterval(function(date) {
  date.setTime(date - date.getMilliseconds() - date.getSeconds() * durationSecond);
}, function(date, step) {
  date.setTime(+date + step * durationMinute);
}, function(start, end) {
  return (end - start) / durationMinute;
}, function(date) {
  return date.getMinutes();
});

var hour = newInterval(function(date) {
  date.setTime(date - date.getMilliseconds() - date.getSeconds() * durationSecond - date.getMinutes() * durationMinute);
}, function(date, step) {
  date.setTime(+date + step * durationHour);
}, function(start, end) {
  return (end - start) / durationHour;
}, function(date) {
  return date.getHours();
});

var day = newInterval(function(date) {
  date.setHours(0, 0, 0, 0);
}, function(date, step) {
  date.setDate(date.getDate() + step);
}, function(start, end) {
  return (end - start - (end.getTimezoneOffset() - start.getTimezoneOffset()) * durationMinute) / durationDay;
}, function(date) {
  return date.getDate() - 1;
});

function weekday(i) {
  return newInterval(function(date) {
    date.setDate(date.getDate() - (date.getDay() + 7 - i) % 7);
    date.setHours(0, 0, 0, 0);
  }, function(date, step) {
    date.setDate(date.getDate() + step * 7);
  }, function(start, end) {
    return (end - start - (end.getTimezoneOffset() - start.getTimezoneOffset()) * durationMinute) / durationWeek;
  });
}

var sunday = weekday(0);
var monday = weekday(1);
var tuesday = weekday(2);
var wednesday = weekday(3);
var thursday = weekday(4);
var friday = weekday(5);
var saturday = weekday(6);

var month = newInterval(function(date) {
  date.setDate(1);
  date.setHours(0, 0, 0, 0);
}, function(date, step) {
  date.setMonth(date.getMonth() + step);
}, function(start, end) {
  return end.getMonth() - start.getMonth() + (end.getFullYear() - start.getFullYear()) * 12;
}, function(date) {
  return date.getMonth();
});

var year = newInterval(function(date) {
  date.setMonth(0, 1);
  date.setHours(0, 0, 0, 0);
}, function(date, step) {
  date.setFullYear(date.getFullYear() + step);
}, function(start, end) {
  return end.getFullYear() - start.getFullYear();
}, function(date) {
  return date.getFullYear();
});

// An optimized implementation for this simple case.
year.every = function(k) {
  return !isFinite(k = Math.floor(k)) || !(k > 0) ? null : newInterval(function(date) {
    date.setFullYear(Math.floor(date.getFullYear() / k) * k);
    date.setMonth(0, 1);
    date.setHours(0, 0, 0, 0);
  }, function(date, step) {
    date.setFullYear(date.getFullYear() + step * k);
  });
};

var utcMinute = newInterval(function(date) {
  date.setUTCSeconds(0, 0);
}, function(date, step) {
  date.setTime(+date + step * durationMinute);
}, function(start, end) {
  return (end - start) / durationMinute;
}, function(date) {
  return date.getUTCMinutes();
});

var utcHour = newInterval(function(date) {
  date.setUTCMinutes(0, 0, 0);
}, function(date, step) {
  date.setTime(+date + step * durationHour);
}, function(start, end) {
  return (end - start) / durationHour;
}, function(date) {
  return date.getUTCHours();
});

var utcDay = newInterval(function(date) {
  date.setUTCHours(0, 0, 0, 0);
}, function(date, step) {
  date.setUTCDate(date.getUTCDate() + step);
}, function(start, end) {
  return (end - start) / durationDay;
}, function(date) {
  return date.getUTCDate() - 1;
});

function utcWeekday(i) {
  return newInterval(function(date) {
    date.setUTCDate(date.getUTCDate() - (date.getUTCDay() + 7 - i) % 7);
    date.setUTCHours(0, 0, 0, 0);
  }, function(date, step) {
    date.setUTCDate(date.getUTCDate() + step * 7);
  }, function(start, end) {
    return (end - start) / durationWeek;
  });
}

var utcSunday = utcWeekday(0);
var utcMonday = utcWeekday(1);
var utcTuesday = utcWeekday(2);
var utcWednesday = utcWeekday(3);
var utcThursday = utcWeekday(4);
var utcFriday = utcWeekday(5);
var utcSaturday = utcWeekday(6);

var utcMonth = newInterval(function(date) {
  date.setUTCDate(1);
  date.setUTCHours(0, 0, 0, 0);
}, function(date, step) {
  date.setUTCMonth(date.getUTCMonth() + step);
}, function(start, end) {
  return end.getUTCMonth() - start.getUTCMonth() + (end.getUTCFullYear() - start.getUTCFullYear()) * 12;
}, function(date) {
  return date.getUTCMonth();
});

var utcYear = newInterval(function(date) {
  date.setUTCMonth(0, 1);
  date.setUTCHours(0, 0, 0, 0);
}, function(date, step) {
  date.setUTCFullYear(date.getUTCFullYear() + step);
}, function(start, end) {
  return end.getUTCFullYear() - start.getUTCFullYear();
}, function(date) {
  return date.getUTCFullYear();
});

// An optimized implementation for this simple case.
utcYear.every = function(k) {
  return !isFinite(k = Math.floor(k)) || !(k > 0) ? null : newInterval(function(date) {
    date.setUTCFullYear(Math.floor(date.getUTCFullYear() / k) * k);
    date.setUTCMonth(0, 1);
    date.setUTCHours(0, 0, 0, 0);
  }, function(date, step) {
    date.setUTCFullYear(date.getUTCFullYear() + step * k);
  });
};

function localDate(d) {
  if (0 <= d.y && d.y < 100) {
    var date = new Date(-1, d.m, d.d, d.H, d.M, d.S, d.L);
    date.setFullYear(d.y);
    return date;
  }
  return new Date(d.y, d.m, d.d, d.H, d.M, d.S, d.L);
}

function utcDate(d) {
  if (0 <= d.y && d.y < 100) {
    var date = new Date(Date.UTC(-1, d.m, d.d, d.H, d.M, d.S, d.L));
    date.setUTCFullYear(d.y);
    return date;
  }
  return new Date(Date.UTC(d.y, d.m, d.d, d.H, d.M, d.S, d.L));
}

function newYear(y) {
  return {y: y, m: 0, d: 1, H: 0, M: 0, S: 0, L: 0};
}

function formatLocale$1(locale) {
  var locale_dateTime = locale.dateTime,
      locale_date = locale.date,
      locale_time = locale.time,
      locale_periods = locale.periods,
      locale_weekdays = locale.days,
      locale_shortWeekdays = locale.shortDays,
      locale_months = locale.months,
      locale_shortMonths = locale.shortMonths;

  var periodRe = formatRe(locale_periods),
      periodLookup = formatLookup(locale_periods),
      weekdayRe = formatRe(locale_weekdays),
      weekdayLookup = formatLookup(locale_weekdays),
      shortWeekdayRe = formatRe(locale_shortWeekdays),
      shortWeekdayLookup = formatLookup(locale_shortWeekdays),
      monthRe = formatRe(locale_months),
      monthLookup = formatLookup(locale_months),
      shortMonthRe = formatRe(locale_shortMonths),
      shortMonthLookup = formatLookup(locale_shortMonths);

  var formats = {
    "a": formatShortWeekday,
    "A": formatWeekday,
    "b": formatShortMonth,
    "B": formatMonth,
    "c": null,
    "d": formatDayOfMonth,
    "e": formatDayOfMonth,
    "f": formatMicroseconds,
    "H": formatHour24,
    "I": formatHour12,
    "j": formatDayOfYear,
    "L": formatMilliseconds,
    "m": formatMonthNumber,
    "M": formatMinutes,
    "p": formatPeriod,
    "Q": formatUnixTimestamp,
    "s": formatUnixTimestampSeconds,
    "S": formatSeconds,
    "u": formatWeekdayNumberMonday,
    "U": formatWeekNumberSunday,
    "V": formatWeekNumberISO,
    "w": formatWeekdayNumberSunday,
    "W": formatWeekNumberMonday,
    "x": null,
    "X": null,
    "y": formatYear$1,
    "Y": formatFullYear,
    "Z": formatZone,
    "%": formatLiteralPercent
  };

  var utcFormats = {
    "a": formatUTCShortWeekday,
    "A": formatUTCWeekday,
    "b": formatUTCShortMonth,
    "B": formatUTCMonth,
    "c": null,
    "d": formatUTCDayOfMonth,
    "e": formatUTCDayOfMonth,
    "f": formatUTCMicroseconds,
    "H": formatUTCHour24,
    "I": formatUTCHour12,
    "j": formatUTCDayOfYear,
    "L": formatUTCMilliseconds,
    "m": formatUTCMonthNumber,
    "M": formatUTCMinutes,
    "p": formatUTCPeriod,
    "Q": formatUnixTimestamp,
    "s": formatUnixTimestampSeconds,
    "S": formatUTCSeconds,
    "u": formatUTCWeekdayNumberMonday,
    "U": formatUTCWeekNumberSunday,
    "V": formatUTCWeekNumberISO,
    "w": formatUTCWeekdayNumberSunday,
    "W": formatUTCWeekNumberMonday,
    "x": null,
    "X": null,
    "y": formatUTCYear,
    "Y": formatUTCFullYear,
    "Z": formatUTCZone,
    "%": formatLiteralPercent
  };

  var parses = {
    "a": parseShortWeekday,
    "A": parseWeekday,
    "b": parseShortMonth,
    "B": parseMonth,
    "c": parseLocaleDateTime,
    "d": parseDayOfMonth,
    "e": parseDayOfMonth,
    "f": parseMicroseconds,
    "H": parseHour24,
    "I": parseHour24,
    "j": parseDayOfYear,
    "L": parseMilliseconds,
    "m": parseMonthNumber,
    "M": parseMinutes,
    "p": parsePeriod,
    "Q": parseUnixTimestamp,
    "s": parseUnixTimestampSeconds,
    "S": parseSeconds,
    "u": parseWeekdayNumberMonday,
    "U": parseWeekNumberSunday,
    "V": parseWeekNumberISO,
    "w": parseWeekdayNumberSunday,
    "W": parseWeekNumberMonday,
    "x": parseLocaleDate,
    "X": parseLocaleTime,
    "y": parseYear,
    "Y": parseFullYear,
    "Z": parseZone,
    "%": parseLiteralPercent
  };

  // These recursive directive definitions must be deferred.
  formats.x = newFormat(locale_date, formats);
  formats.X = newFormat(locale_time, formats);
  formats.c = newFormat(locale_dateTime, formats);
  utcFormats.x = newFormat(locale_date, utcFormats);
  utcFormats.X = newFormat(locale_time, utcFormats);
  utcFormats.c = newFormat(locale_dateTime, utcFormats);

  function newFormat(specifier, formats) {
    return function(date) {
      var string = [],
          i = -1,
          j = 0,
          n = specifier.length,
          c,
          pad,
          format;

      if (!(date instanceof Date)) date = new Date(+date);

      while (++i < n) {
        if (specifier.charCodeAt(i) === 37) {
          string.push(specifier.slice(j, i));
          if ((pad = pads[c = specifier.charAt(++i)]) != null) c = specifier.charAt(++i);
          else pad = c === "e" ? " " : "0";
          if (format = formats[c]) c = format(date, pad);
          string.push(c);
          j = i + 1;
        }
      }

      string.push(specifier.slice(j, i));
      return string.join("");
    };
  }

  function newParse(specifier, newDate) {
    return function(string) {
      var d = newYear(1900),
          i = parseSpecifier(d, specifier, string += "", 0),
          week, day$$1;
      if (i != string.length) return null;

      // If a UNIX timestamp is specified, return it.
      if ("Q" in d) return new Date(d.Q);

      // The am-pm flag is 0 for AM, and 1 for PM.
      if ("p" in d) d.H = d.H % 12 + d.p * 12;

      // Convert day-of-week and week-of-year to day-of-year.
      if ("V" in d) {
        if (d.V < 1 || d.V > 53) return null;
        if (!("w" in d)) d.w = 1;
        if ("Z" in d) {
          week = utcDate(newYear(d.y)), day$$1 = week.getUTCDay();
          week = day$$1 > 4 || day$$1 === 0 ? utcMonday.ceil(week) : utcMonday(week);
          week = utcDay.offset(week, (d.V - 1) * 7);
          d.y = week.getUTCFullYear();
          d.m = week.getUTCMonth();
          d.d = week.getUTCDate() + (d.w + 6) % 7;
        } else {
          week = newDate(newYear(d.y)), day$$1 = week.getDay();
          week = day$$1 > 4 || day$$1 === 0 ? monday.ceil(week) : monday(week);
          week = day.offset(week, (d.V - 1) * 7);
          d.y = week.getFullYear();
          d.m = week.getMonth();
          d.d = week.getDate() + (d.w + 6) % 7;
        }
      } else if ("W" in d || "U" in d) {
        if (!("w" in d)) d.w = "u" in d ? d.u % 7 : "W" in d ? 1 : 0;
        day$$1 = "Z" in d ? utcDate(newYear(d.y)).getUTCDay() : newDate(newYear(d.y)).getDay();
        d.m = 0;
        d.d = "W" in d ? (d.w + 6) % 7 + d.W * 7 - (day$$1 + 5) % 7 : d.w + d.U * 7 - (day$$1 + 6) % 7;
      }

      // If a time zone is specified, all fields are interpreted as UTC and then
      // offset according to the specified time zone.
      if ("Z" in d) {
        d.H += d.Z / 100 | 0;
        d.M += d.Z % 100;
        return utcDate(d);
      }

      // Otherwise, all fields are in local time.
      return newDate(d);
    };
  }

  function parseSpecifier(d, specifier, string, j) {
    var i = 0,
        n = specifier.length,
        m = string.length,
        c,
        parse;

    while (i < n) {
      if (j >= m) return -1;
      c = specifier.charCodeAt(i++);
      if (c === 37) {
        c = specifier.charAt(i++);
        parse = parses[c in pads ? specifier.charAt(i++) : c];
        if (!parse || ((j = parse(d, string, j)) < 0)) return -1;
      } else if (c != string.charCodeAt(j++)) {
        return -1;
      }
    }

    return j;
  }

  function parsePeriod(d, string, i) {
    var n = periodRe.exec(string.slice(i));
    return n ? (d.p = periodLookup[n[0].toLowerCase()], i + n[0].length) : -1;
  }

  function parseShortWeekday(d, string, i) {
    var n = shortWeekdayRe.exec(string.slice(i));
    return n ? (d.w = shortWeekdayLookup[n[0].toLowerCase()], i + n[0].length) : -1;
  }

  function parseWeekday(d, string, i) {
    var n = weekdayRe.exec(string.slice(i));
    return n ? (d.w = weekdayLookup[n[0].toLowerCase()], i + n[0].length) : -1;
  }

  function parseShortMonth(d, string, i) {
    var n = shortMonthRe.exec(string.slice(i));
    return n ? (d.m = shortMonthLookup[n[0].toLowerCase()], i + n[0].length) : -1;
  }

  function parseMonth(d, string, i) {
    var n = monthRe.exec(string.slice(i));
    return n ? (d.m = monthLookup[n[0].toLowerCase()], i + n[0].length) : -1;
  }

  function parseLocaleDateTime(d, string, i) {
    return parseSpecifier(d, locale_dateTime, string, i);
  }

  function parseLocaleDate(d, string, i) {
    return parseSpecifier(d, locale_date, string, i);
  }

  function parseLocaleTime(d, string, i) {
    return parseSpecifier(d, locale_time, string, i);
  }

  function formatShortWeekday(d) {
    return locale_shortWeekdays[d.getDay()];
  }

  function formatWeekday(d) {
    return locale_weekdays[d.getDay()];
  }

  function formatShortMonth(d) {
    return locale_shortMonths[d.getMonth()];
  }

  function formatMonth(d) {
    return locale_months[d.getMonth()];
  }

  function formatPeriod(d) {
    return locale_periods[+(d.getHours() >= 12)];
  }

  function formatUTCShortWeekday(d) {
    return locale_shortWeekdays[d.getUTCDay()];
  }

  function formatUTCWeekday(d) {
    return locale_weekdays[d.getUTCDay()];
  }

  function formatUTCShortMonth(d) {
    return locale_shortMonths[d.getUTCMonth()];
  }

  function formatUTCMonth(d) {
    return locale_months[d.getUTCMonth()];
  }

  function formatUTCPeriod(d) {
    return locale_periods[+(d.getUTCHours() >= 12)];
  }

  return {
    format: function(specifier) {
      var f = newFormat(specifier += "", formats);
      f.toString = function() { return specifier; };
      return f;
    },
    parse: function(specifier) {
      var p = newParse(specifier += "", localDate);
      p.toString = function() { return specifier; };
      return p;
    },
    utcFormat: function(specifier) {
      var f = newFormat(specifier += "", utcFormats);
      f.toString = function() { return specifier; };
      return f;
    },
    utcParse: function(specifier) {
      var p = newParse(specifier, utcDate);
      p.toString = function() { return specifier; };
      return p;
    }
  };
}

var pads = {"-": "", "_": " ", "0": "0"},
    numberRe = /^\s*\d+/, // note: ignores next directive
    percentRe = /^%/,
    requoteRe = /[\\^$*+?|[\]().{}]/g;

function pad$1(value, fill, width) {
  var sign = value < 0 ? "-" : "",
      string = (sign ? -value : value) + "",
      length = string.length;
  return sign + (length < width ? new Array(width - length + 1).join(fill) + string : string);
}

function requote(s) {
  return s.replace(requoteRe, "\\$&");
}

function formatRe(names) {
  return new RegExp("^(?:" + names.map(requote).join("|") + ")", "i");
}

function formatLookup(names) {
  var map = {}, i = -1, n = names.length;
  while (++i < n) map[names[i].toLowerCase()] = i;
  return map;
}

function parseWeekdayNumberSunday(d, string, i) {
  var n = numberRe.exec(string.slice(i, i + 1));
  return n ? (d.w = +n[0], i + n[0].length) : -1;
}

function parseWeekdayNumberMonday(d, string, i) {
  var n = numberRe.exec(string.slice(i, i + 1));
  return n ? (d.u = +n[0], i + n[0].length) : -1;
}

function parseWeekNumberSunday(d, string, i) {
  var n = numberRe.exec(string.slice(i, i + 2));
  return n ? (d.U = +n[0], i + n[0].length) : -1;
}

function parseWeekNumberISO(d, string, i) {
  var n = numberRe.exec(string.slice(i, i + 2));
  return n ? (d.V = +n[0], i + n[0].length) : -1;
}

function parseWeekNumberMonday(d, string, i) {
  var n = numberRe.exec(string.slice(i, i + 2));
  return n ? (d.W = +n[0], i + n[0].length) : -1;
}

function parseFullYear(d, string, i) {
  var n = numberRe.exec(string.slice(i, i + 4));
  return n ? (d.y = +n[0], i + n[0].length) : -1;
}

function parseYear(d, string, i) {
  var n = numberRe.exec(string.slice(i, i + 2));
  return n ? (d.y = +n[0] + (+n[0] > 68 ? 1900 : 2000), i + n[0].length) : -1;
}

function parseZone(d, string, i) {
  var n = /^(Z)|([+-]\d\d)(?::?(\d\d))?/.exec(string.slice(i, i + 6));
  return n ? (d.Z = n[1] ? 0 : -(n[2] + (n[3] || "00")), i + n[0].length) : -1;
}

function parseMonthNumber(d, string, i) {
  var n = numberRe.exec(string.slice(i, i + 2));
  return n ? (d.m = n[0] - 1, i + n[0].length) : -1;
}

function parseDayOfMonth(d, string, i) {
  var n = numberRe.exec(string.slice(i, i + 2));
  return n ? (d.d = +n[0], i + n[0].length) : -1;
}

function parseDayOfYear(d, string, i) {
  var n = numberRe.exec(string.slice(i, i + 3));
  return n ? (d.m = 0, d.d = +n[0], i + n[0].length) : -1;
}

function parseHour24(d, string, i) {
  var n = numberRe.exec(string.slice(i, i + 2));
  return n ? (d.H = +n[0], i + n[0].length) : -1;
}

function parseMinutes(d, string, i) {
  var n = numberRe.exec(string.slice(i, i + 2));
  return n ? (d.M = +n[0], i + n[0].length) : -1;
}

function parseSeconds(d, string, i) {
  var n = numberRe.exec(string.slice(i, i + 2));
  return n ? (d.S = +n[0], i + n[0].length) : -1;
}

function parseMilliseconds(d, string, i) {
  var n = numberRe.exec(string.slice(i, i + 3));
  return n ? (d.L = +n[0], i + n[0].length) : -1;
}

function parseMicroseconds(d, string, i) {
  var n = numberRe.exec(string.slice(i, i + 6));
  return n ? (d.L = Math.floor(n[0] / 1000), i + n[0].length) : -1;
}

function parseLiteralPercent(d, string, i) {
  var n = percentRe.exec(string.slice(i, i + 1));
  return n ? i + n[0].length : -1;
}

function parseUnixTimestamp(d, string, i) {
  var n = numberRe.exec(string.slice(i));
  return n ? (d.Q = +n[0], i + n[0].length) : -1;
}

function parseUnixTimestampSeconds(d, string, i) {
  var n = numberRe.exec(string.slice(i));
  return n ? (d.Q = (+n[0]) * 1000, i + n[0].length) : -1;
}

function formatDayOfMonth(d, p) {
  return pad$1(d.getDate(), p, 2);
}

function formatHour24(d, p) {
  return pad$1(d.getHours(), p, 2);
}

function formatHour12(d, p) {
  return pad$1(d.getHours() % 12 || 12, p, 2);
}

function formatDayOfYear(d, p) {
  return pad$1(1 + day.count(year(d), d), p, 3);
}

function formatMilliseconds(d, p) {
  return pad$1(d.getMilliseconds(), p, 3);
}

function formatMicroseconds(d, p) {
  return formatMilliseconds(d, p) + "000";
}

function formatMonthNumber(d, p) {
  return pad$1(d.getMonth() + 1, p, 2);
}

function formatMinutes(d, p) {
  return pad$1(d.getMinutes(), p, 2);
}

function formatSeconds(d, p) {
  return pad$1(d.getSeconds(), p, 2);
}

function formatWeekdayNumberMonday(d) {
  var day$$1 = d.getDay();
  return day$$1 === 0 ? 7 : day$$1;
}

function formatWeekNumberSunday(d, p) {
  return pad$1(sunday.count(year(d), d), p, 2);
}

function formatWeekNumberISO(d, p) {
  var day$$1 = d.getDay();
  d = (day$$1 >= 4 || day$$1 === 0) ? thursday(d) : thursday.ceil(d);
  return pad$1(thursday.count(year(d), d) + (year(d).getDay() === 4), p, 2);
}

function formatWeekdayNumberSunday(d) {
  return d.getDay();
}

function formatWeekNumberMonday(d, p) {
  return pad$1(monday.count(year(d), d), p, 2);
}

function formatYear$1(d, p) {
  return pad$1(d.getFullYear() % 100, p, 2);
}

function formatFullYear(d, p) {
  return pad$1(d.getFullYear() % 10000, p, 4);
}

function formatZone(d) {
  var z = d.getTimezoneOffset();
  return (z > 0 ? "-" : (z *= -1, "+"))
      + pad$1(z / 60 | 0, "0", 2)
      + pad$1(z % 60, "0", 2);
}

function formatUTCDayOfMonth(d, p) {
  return pad$1(d.getUTCDate(), p, 2);
}

function formatUTCHour24(d, p) {
  return pad$1(d.getUTCHours(), p, 2);
}

function formatUTCHour12(d, p) {
  return pad$1(d.getUTCHours() % 12 || 12, p, 2);
}

function formatUTCDayOfYear(d, p) {
  return pad$1(1 + utcDay.count(utcYear(d), d), p, 3);
}

function formatUTCMilliseconds(d, p) {
  return pad$1(d.getUTCMilliseconds(), p, 3);
}

function formatUTCMicroseconds(d, p) {
  return formatUTCMilliseconds(d, p) + "000";
}

function formatUTCMonthNumber(d, p) {
  return pad$1(d.getUTCMonth() + 1, p, 2);
}

function formatUTCMinutes(d, p) {
  return pad$1(d.getUTCMinutes(), p, 2);
}

function formatUTCSeconds(d, p) {
  return pad$1(d.getUTCSeconds(), p, 2);
}

function formatUTCWeekdayNumberMonday(d) {
  var dow = d.getUTCDay();
  return dow === 0 ? 7 : dow;
}

function formatUTCWeekNumberSunday(d, p) {
  return pad$1(utcSunday.count(utcYear(d), d), p, 2);
}

function formatUTCWeekNumberISO(d, p) {
  var day$$1 = d.getUTCDay();
  d = (day$$1 >= 4 || day$$1 === 0) ? utcThursday(d) : utcThursday.ceil(d);
  return pad$1(utcThursday.count(utcYear(d), d) + (utcYear(d).getUTCDay() === 4), p, 2);
}

function formatUTCWeekdayNumberSunday(d) {
  return d.getUTCDay();
}

function formatUTCWeekNumberMonday(d, p) {
  return pad$1(utcMonday.count(utcYear(d), d), p, 2);
}

function formatUTCYear(d, p) {
  return pad$1(d.getUTCFullYear() % 100, p, 2);
}

function formatUTCFullYear(d, p) {
  return pad$1(d.getUTCFullYear() % 10000, p, 4);
}

function formatUTCZone() {
  return "+0000";
}

function formatLiteralPercent() {
  return "%";
}

function formatUnixTimestamp(d) {
  return +d;
}

function formatUnixTimestampSeconds(d) {
  return Math.floor(+d / 1000);
}

var locale$1;
var timeFormat;
var timeParse;
var utcFormat;
var utcParse;

defaultLocale$1({
  dateTime: "%x, %X",
  date: "%-m/%-d/%Y",
  time: "%-I:%M:%S %p",
  periods: ["AM", "PM"],
  days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
  shortDays: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
  shortMonths: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
});

function defaultLocale$1(definition) {
  locale$1 = formatLocale$1(definition);
  timeFormat = locale$1.format;
  timeParse = locale$1.parse;
  utcFormat = locale$1.utcFormat;
  utcParse = locale$1.utcParse;
  return locale$1;
}

var isoSpecifier = "%Y-%m-%dT%H:%M:%S.%LZ";

function formatIsoNative(date) {
  return date.toISOString();
}

var formatIso = Date.prototype.toISOString
    ? formatIsoNative
    : utcFormat(isoSpecifier);

function parseIsoNative(string) {
  var date = new Date(string);
  return isNaN(date) ? null : date;
}

var parseIso = +new Date("2000-01-01T00:00:00.000Z")
    ? parseIsoNative
    : utcParse(isoSpecifier);

function colors(specifier) {
  var n = specifier.length / 6 | 0, colors = new Array(n), i = 0;
  while (i < n) colors[i] = "#" + specifier.slice(i * 6, ++i * 6);
  return colors;
}

var category10 = colors("1f77b4ff7f0e2ca02cd627289467bd8c564be377c27f7f7fbcbd2217becf");

var Accent = colors("7fc97fbeaed4fdc086ffff99386cb0f0027fbf5b17666666");

var Dark2 = colors("1b9e77d95f027570b3e7298a66a61ee6ab02a6761d666666");

var Paired = colors("a6cee31f78b4b2df8a33a02cfb9a99e31a1cfdbf6fff7f00cab2d66a3d9affff99b15928");

var Pastel1 = colors("fbb4aeb3cde3ccebc5decbe4fed9a6ffffcce5d8bdfddaecf2f2f2");

var Pastel2 = colors("b3e2cdfdcdaccbd5e8f4cae4e6f5c9fff2aef1e2cccccccc");

var Set1 = colors("e41a1c377eb84daf4a984ea3ff7f00ffff33a65628f781bf999999");

var Set2 = colors("66c2a5fc8d628da0cbe78ac3a6d854ffd92fe5c494b3b3b3");

var Set3 = colors("8dd3c7ffffb3bebadafb807280b1d3fdb462b3de69fccde5d9d9d9bc80bdccebc5ffed6f");

function ramp(scheme) {
  return rgbBasis(scheme[scheme.length - 1]);
}

var scheme = new Array(3).concat(
  "d8b365f5f5f55ab4ac",
  "a6611adfc27d80cdc1018571",
  "a6611adfc27df5f5f580cdc1018571",
  "8c510ad8b365f6e8c3c7eae55ab4ac01665e",
  "8c510ad8b365f6e8c3f5f5f5c7eae55ab4ac01665e",
  "8c510abf812ddfc27df6e8c3c7eae580cdc135978f01665e",
  "8c510abf812ddfc27df6e8c3f5f5f5c7eae580cdc135978f01665e",
  "5430058c510abf812ddfc27df6e8c3c7eae580cdc135978f01665e003c30",
  "5430058c510abf812ddfc27df6e8c3f5f5f5c7eae580cdc135978f01665e003c30"
).map(colors);

var BrBG = ramp(scheme);

var scheme$1 = new Array(3).concat(
  "af8dc3f7f7f77fbf7b",
  "7b3294c2a5cfa6dba0008837",
  "7b3294c2a5cff7f7f7a6dba0008837",
  "762a83af8dc3e7d4e8d9f0d37fbf7b1b7837",
  "762a83af8dc3e7d4e8f7f7f7d9f0d37fbf7b1b7837",
  "762a839970abc2a5cfe7d4e8d9f0d3a6dba05aae611b7837",
  "762a839970abc2a5cfe7d4e8f7f7f7d9f0d3a6dba05aae611b7837",
  "40004b762a839970abc2a5cfe7d4e8d9f0d3a6dba05aae611b783700441b",
  "40004b762a839970abc2a5cfe7d4e8f7f7f7d9f0d3a6dba05aae611b783700441b"
).map(colors);

var PRGn = ramp(scheme$1);

var scheme$2 = new Array(3).concat(
  "e9a3c9f7f7f7a1d76a",
  "d01c8bf1b6dab8e1864dac26",
  "d01c8bf1b6daf7f7f7b8e1864dac26",
  "c51b7de9a3c9fde0efe6f5d0a1d76a4d9221",
  "c51b7de9a3c9fde0eff7f7f7e6f5d0a1d76a4d9221",
  "c51b7dde77aef1b6dafde0efe6f5d0b8e1867fbc414d9221",
  "c51b7dde77aef1b6dafde0eff7f7f7e6f5d0b8e1867fbc414d9221",
  "8e0152c51b7dde77aef1b6dafde0efe6f5d0b8e1867fbc414d9221276419",
  "8e0152c51b7dde77aef1b6dafde0eff7f7f7e6f5d0b8e1867fbc414d9221276419"
).map(colors);

var PiYG = ramp(scheme$2);

var scheme$3 = new Array(3).concat(
  "998ec3f7f7f7f1a340",
  "5e3c99b2abd2fdb863e66101",
  "5e3c99b2abd2f7f7f7fdb863e66101",
  "542788998ec3d8daebfee0b6f1a340b35806",
  "542788998ec3d8daebf7f7f7fee0b6f1a340b35806",
  "5427888073acb2abd2d8daebfee0b6fdb863e08214b35806",
  "5427888073acb2abd2d8daebf7f7f7fee0b6fdb863e08214b35806",
  "2d004b5427888073acb2abd2d8daebfee0b6fdb863e08214b358067f3b08",
  "2d004b5427888073acb2abd2d8daebf7f7f7fee0b6fdb863e08214b358067f3b08"
).map(colors);

var PuOr = ramp(scheme$3);

var scheme$4 = new Array(3).concat(
  "ef8a62f7f7f767a9cf",
  "ca0020f4a58292c5de0571b0",
  "ca0020f4a582f7f7f792c5de0571b0",
  "b2182bef8a62fddbc7d1e5f067a9cf2166ac",
  "b2182bef8a62fddbc7f7f7f7d1e5f067a9cf2166ac",
  "b2182bd6604df4a582fddbc7d1e5f092c5de4393c32166ac",
  "b2182bd6604df4a582fddbc7f7f7f7d1e5f092c5de4393c32166ac",
  "67001fb2182bd6604df4a582fddbc7d1e5f092c5de4393c32166ac053061",
  "67001fb2182bd6604df4a582fddbc7f7f7f7d1e5f092c5de4393c32166ac053061"
).map(colors);

var RdBu = ramp(scheme$4);

var scheme$5 = new Array(3).concat(
  "ef8a62ffffff999999",
  "ca0020f4a582bababa404040",
  "ca0020f4a582ffffffbababa404040",
  "b2182bef8a62fddbc7e0e0e09999994d4d4d",
  "b2182bef8a62fddbc7ffffffe0e0e09999994d4d4d",
  "b2182bd6604df4a582fddbc7e0e0e0bababa8787874d4d4d",
  "b2182bd6604df4a582fddbc7ffffffe0e0e0bababa8787874d4d4d",
  "67001fb2182bd6604df4a582fddbc7e0e0e0bababa8787874d4d4d1a1a1a",
  "67001fb2182bd6604df4a582fddbc7ffffffe0e0e0bababa8787874d4d4d1a1a1a"
).map(colors);

var RdGy = ramp(scheme$5);

var scheme$6 = new Array(3).concat(
  "fc8d59ffffbf91bfdb",
  "d7191cfdae61abd9e92c7bb6",
  "d7191cfdae61ffffbfabd9e92c7bb6",
  "d73027fc8d59fee090e0f3f891bfdb4575b4",
  "d73027fc8d59fee090ffffbfe0f3f891bfdb4575b4",
  "d73027f46d43fdae61fee090e0f3f8abd9e974add14575b4",
  "d73027f46d43fdae61fee090ffffbfe0f3f8abd9e974add14575b4",
  "a50026d73027f46d43fdae61fee090e0f3f8abd9e974add14575b4313695",
  "a50026d73027f46d43fdae61fee090ffffbfe0f3f8abd9e974add14575b4313695"
).map(colors);

var RdYlBu = ramp(scheme$6);

var scheme$7 = new Array(3).concat(
  "fc8d59ffffbf91cf60",
  "d7191cfdae61a6d96a1a9641",
  "d7191cfdae61ffffbfa6d96a1a9641",
  "d73027fc8d59fee08bd9ef8b91cf601a9850",
  "d73027fc8d59fee08bffffbfd9ef8b91cf601a9850",
  "d73027f46d43fdae61fee08bd9ef8ba6d96a66bd631a9850",
  "d73027f46d43fdae61fee08bffffbfd9ef8ba6d96a66bd631a9850",
  "a50026d73027f46d43fdae61fee08bd9ef8ba6d96a66bd631a9850006837",
  "a50026d73027f46d43fdae61fee08bffffbfd9ef8ba6d96a66bd631a9850006837"
).map(colors);

var RdYlGn = ramp(scheme$7);

var scheme$8 = new Array(3).concat(
  "fc8d59ffffbf99d594",
  "d7191cfdae61abdda42b83ba",
  "d7191cfdae61ffffbfabdda42b83ba",
  "d53e4ffc8d59fee08be6f59899d5943288bd",
  "d53e4ffc8d59fee08bffffbfe6f59899d5943288bd",
  "d53e4ff46d43fdae61fee08be6f598abdda466c2a53288bd",
  "d53e4ff46d43fdae61fee08bffffbfe6f598abdda466c2a53288bd",
  "9e0142d53e4ff46d43fdae61fee08be6f598abdda466c2a53288bd5e4fa2",
  "9e0142d53e4ff46d43fdae61fee08bffffbfe6f598abdda466c2a53288bd5e4fa2"
).map(colors);

var Spectral = ramp(scheme$8);

var scheme$9 = new Array(3).concat(
  "e5f5f999d8c92ca25f",
  "edf8fbb2e2e266c2a4238b45",
  "edf8fbb2e2e266c2a42ca25f006d2c",
  "edf8fbccece699d8c966c2a42ca25f006d2c",
  "edf8fbccece699d8c966c2a441ae76238b45005824",
  "f7fcfde5f5f9ccece699d8c966c2a441ae76238b45005824",
  "f7fcfde5f5f9ccece699d8c966c2a441ae76238b45006d2c00441b"
).map(colors);

var BuGn = ramp(scheme$9);

var scheme$a = new Array(3).concat(
  "e0ecf49ebcda8856a7",
  "edf8fbb3cde38c96c688419d",
  "edf8fbb3cde38c96c68856a7810f7c",
  "edf8fbbfd3e69ebcda8c96c68856a7810f7c",
  "edf8fbbfd3e69ebcda8c96c68c6bb188419d6e016b",
  "f7fcfde0ecf4bfd3e69ebcda8c96c68c6bb188419d6e016b",
  "f7fcfde0ecf4bfd3e69ebcda8c96c68c6bb188419d810f7c4d004b"
).map(colors);

var BuPu = ramp(scheme$a);

var scheme$b = new Array(3).concat(
  "e0f3dba8ddb543a2ca",
  "f0f9e8bae4bc7bccc42b8cbe",
  "f0f9e8bae4bc7bccc443a2ca0868ac",
  "f0f9e8ccebc5a8ddb57bccc443a2ca0868ac",
  "f0f9e8ccebc5a8ddb57bccc44eb3d32b8cbe08589e",
  "f7fcf0e0f3dbccebc5a8ddb57bccc44eb3d32b8cbe08589e",
  "f7fcf0e0f3dbccebc5a8ddb57bccc44eb3d32b8cbe0868ac084081"
).map(colors);

var GnBu = ramp(scheme$b);

var scheme$c = new Array(3).concat(
  "fee8c8fdbb84e34a33",
  "fef0d9fdcc8afc8d59d7301f",
  "fef0d9fdcc8afc8d59e34a33b30000",
  "fef0d9fdd49efdbb84fc8d59e34a33b30000",
  "fef0d9fdd49efdbb84fc8d59ef6548d7301f990000",
  "fff7ecfee8c8fdd49efdbb84fc8d59ef6548d7301f990000",
  "fff7ecfee8c8fdd49efdbb84fc8d59ef6548d7301fb300007f0000"
).map(colors);

var OrRd = ramp(scheme$c);

var scheme$d = new Array(3).concat(
  "ece2f0a6bddb1c9099",
  "f6eff7bdc9e167a9cf02818a",
  "f6eff7bdc9e167a9cf1c9099016c59",
  "f6eff7d0d1e6a6bddb67a9cf1c9099016c59",
  "f6eff7d0d1e6a6bddb67a9cf3690c002818a016450",
  "fff7fbece2f0d0d1e6a6bddb67a9cf3690c002818a016450",
  "fff7fbece2f0d0d1e6a6bddb67a9cf3690c002818a016c59014636"
).map(colors);

var PuBuGn = ramp(scheme$d);

var scheme$e = new Array(3).concat(
  "ece7f2a6bddb2b8cbe",
  "f1eef6bdc9e174a9cf0570b0",
  "f1eef6bdc9e174a9cf2b8cbe045a8d",
  "f1eef6d0d1e6a6bddb74a9cf2b8cbe045a8d",
  "f1eef6d0d1e6a6bddb74a9cf3690c00570b0034e7b",
  "fff7fbece7f2d0d1e6a6bddb74a9cf3690c00570b0034e7b",
  "fff7fbece7f2d0d1e6a6bddb74a9cf3690c00570b0045a8d023858"
).map(colors);

var PuBu = ramp(scheme$e);

var scheme$f = new Array(3).concat(
  "e7e1efc994c7dd1c77",
  "f1eef6d7b5d8df65b0ce1256",
  "f1eef6d7b5d8df65b0dd1c77980043",
  "f1eef6d4b9dac994c7df65b0dd1c77980043",
  "f1eef6d4b9dac994c7df65b0e7298ace125691003f",
  "f7f4f9e7e1efd4b9dac994c7df65b0e7298ace125691003f",
  "f7f4f9e7e1efd4b9dac994c7df65b0e7298ace125698004367001f"
).map(colors);

var PuRd = ramp(scheme$f);

var scheme$g = new Array(3).concat(
  "fde0ddfa9fb5c51b8a",
  "feebe2fbb4b9f768a1ae017e",
  "feebe2fbb4b9f768a1c51b8a7a0177",
  "feebe2fcc5c0fa9fb5f768a1c51b8a7a0177",
  "feebe2fcc5c0fa9fb5f768a1dd3497ae017e7a0177",
  "fff7f3fde0ddfcc5c0fa9fb5f768a1dd3497ae017e7a0177",
  "fff7f3fde0ddfcc5c0fa9fb5f768a1dd3497ae017e7a017749006a"
).map(colors);

var RdPu = ramp(scheme$g);

var scheme$h = new Array(3).concat(
  "edf8b17fcdbb2c7fb8",
  "ffffcca1dab441b6c4225ea8",
  "ffffcca1dab441b6c42c7fb8253494",
  "ffffccc7e9b47fcdbb41b6c42c7fb8253494",
  "ffffccc7e9b47fcdbb41b6c41d91c0225ea80c2c84",
  "ffffd9edf8b1c7e9b47fcdbb41b6c41d91c0225ea80c2c84",
  "ffffd9edf8b1c7e9b47fcdbb41b6c41d91c0225ea8253494081d58"
).map(colors);

var YlGnBu = ramp(scheme$h);

var scheme$i = new Array(3).concat(
  "f7fcb9addd8e31a354",
  "ffffccc2e69978c679238443",
  "ffffccc2e69978c67931a354006837",
  "ffffccd9f0a3addd8e78c67931a354006837",
  "ffffccd9f0a3addd8e78c67941ab5d238443005a32",
  "ffffe5f7fcb9d9f0a3addd8e78c67941ab5d238443005a32",
  "ffffe5f7fcb9d9f0a3addd8e78c67941ab5d238443006837004529"
).map(colors);

var YlGn = ramp(scheme$i);

var scheme$j = new Array(3).concat(
  "fff7bcfec44fd95f0e",
  "ffffd4fed98efe9929cc4c02",
  "ffffd4fed98efe9929d95f0e993404",
  "ffffd4fee391fec44ffe9929d95f0e993404",
  "ffffd4fee391fec44ffe9929ec7014cc4c028c2d04",
  "ffffe5fff7bcfee391fec44ffe9929ec7014cc4c028c2d04",
  "ffffe5fff7bcfee391fec44ffe9929ec7014cc4c02993404662506"
).map(colors);

var YlOrBr = ramp(scheme$j);

var scheme$k = new Array(3).concat(
  "ffeda0feb24cf03b20",
  "ffffb2fecc5cfd8d3ce31a1c",
  "ffffb2fecc5cfd8d3cf03b20bd0026",
  "ffffb2fed976feb24cfd8d3cf03b20bd0026",
  "ffffb2fed976feb24cfd8d3cfc4e2ae31a1cb10026",
  "ffffccffeda0fed976feb24cfd8d3cfc4e2ae31a1cb10026",
  "ffffccffeda0fed976feb24cfd8d3cfc4e2ae31a1cbd0026800026"
).map(colors);

var YlOrRd = ramp(scheme$k);

var scheme$l = new Array(3).concat(
  "deebf79ecae13182bd",
  "eff3ffbdd7e76baed62171b5",
  "eff3ffbdd7e76baed63182bd08519c",
  "eff3ffc6dbef9ecae16baed63182bd08519c",
  "eff3ffc6dbef9ecae16baed64292c62171b5084594",
  "f7fbffdeebf7c6dbef9ecae16baed64292c62171b5084594",
  "f7fbffdeebf7c6dbef9ecae16baed64292c62171b508519c08306b"
).map(colors);

var Blues = ramp(scheme$l);

var scheme$m = new Array(3).concat(
  "e5f5e0a1d99b31a354",
  "edf8e9bae4b374c476238b45",
  "edf8e9bae4b374c47631a354006d2c",
  "edf8e9c7e9c0a1d99b74c47631a354006d2c",
  "edf8e9c7e9c0a1d99b74c47641ab5d238b45005a32",
  "f7fcf5e5f5e0c7e9c0a1d99b74c47641ab5d238b45005a32",
  "f7fcf5e5f5e0c7e9c0a1d99b74c47641ab5d238b45006d2c00441b"
).map(colors);

var Greens = ramp(scheme$m);

var scheme$n = new Array(3).concat(
  "f0f0f0bdbdbd636363",
  "f7f7f7cccccc969696525252",
  "f7f7f7cccccc969696636363252525",
  "f7f7f7d9d9d9bdbdbd969696636363252525",
  "f7f7f7d9d9d9bdbdbd969696737373525252252525",
  "fffffff0f0f0d9d9d9bdbdbd969696737373525252252525",
  "fffffff0f0f0d9d9d9bdbdbd969696737373525252252525000000"
).map(colors);

var Greys = ramp(scheme$n);

var scheme$o = new Array(3).concat(
  "efedf5bcbddc756bb1",
  "f2f0f7cbc9e29e9ac86a51a3",
  "f2f0f7cbc9e29e9ac8756bb154278f",
  "f2f0f7dadaebbcbddc9e9ac8756bb154278f",
  "f2f0f7dadaebbcbddc9e9ac8807dba6a51a34a1486",
  "fcfbfdefedf5dadaebbcbddc9e9ac8807dba6a51a34a1486",
  "fcfbfdefedf5dadaebbcbddc9e9ac8807dba6a51a354278f3f007d"
).map(colors);

var Purples = ramp(scheme$o);

var scheme$p = new Array(3).concat(
  "fee0d2fc9272de2d26",
  "fee5d9fcae91fb6a4acb181d",
  "fee5d9fcae91fb6a4ade2d26a50f15",
  "fee5d9fcbba1fc9272fb6a4ade2d26a50f15",
  "fee5d9fcbba1fc9272fb6a4aef3b2ccb181d99000d",
  "fff5f0fee0d2fcbba1fc9272fb6a4aef3b2ccb181d99000d",
  "fff5f0fee0d2fcbba1fc9272fb6a4aef3b2ccb181da50f1567000d"
).map(colors);

var Reds = ramp(scheme$p);

var scheme$q = new Array(3).concat(
  "fee6cefdae6be6550d",
  "feeddefdbe85fd8d3cd94701",
  "feeddefdbe85fd8d3ce6550da63603",
  "feeddefdd0a2fdae6bfd8d3ce6550da63603",
  "feeddefdd0a2fdae6bfd8d3cf16913d948018c2d04",
  "fff5ebfee6cefdd0a2fdae6bfd8d3cf16913d948018c2d04",
  "fff5ebfee6cefdd0a2fdae6bfd8d3cf16913d94801a636037f2704"
).map(colors);

var Oranges = ramp(scheme$q);

var cubehelix$3 = cubehelixLong(cubehelix(300, 0.5, 0.0), cubehelix(-240, 0.5, 1.0));

var warm = cubehelixLong(cubehelix(-100, 0.75, 0.35), cubehelix(80, 1.50, 0.8));

var cool = cubehelixLong(cubehelix(260, 0.75, 0.35), cubehelix(80, 1.50, 0.8));

var c = cubehelix();

var c$1 = rgb(),
    pi_1_3 = Math.PI / 3,
    pi_2_3 = Math.PI * 2 / 3;

function ramp$1(range) {
  var n = range.length;
  return function(t) {
    return range[Math.max(0, Math.min(n - 1, Math.floor(t * n)))];
  };
}

var viridis = ramp$1(colors("44015444025645045745055946075a46085c460a5d460b5e470d60470e6147106347116447136548146748166848176948186a481a6c481b6d481c6e481d6f481f70482071482173482374482475482576482677482878482979472a7a472c7a472d7b472e7c472f7d46307e46327e46337f463480453581453781453882443983443a83443b84433d84433e85423f854240864241864142874144874045884046883f47883f48893e49893e4a893e4c8a3d4d8a3d4e8a3c4f8a3c508b3b518b3b528b3a538b3a548c39558c39568c38588c38598c375a8c375b8d365c8d365d8d355e8d355f8d34608d34618d33628d33638d32648e32658e31668e31678e31688e30698e306a8e2f6b8e2f6c8e2e6d8e2e6e8e2e6f8e2d708e2d718e2c718e2c728e2c738e2b748e2b758e2a768e2a778e2a788e29798e297a8e297b8e287c8e287d8e277e8e277f8e27808e26818e26828e26828e25838e25848e25858e24868e24878e23888e23898e238a8d228b8d228c8d228d8d218e8d218f8d21908d21918c20928c20928c20938c1f948c1f958b1f968b1f978b1f988b1f998a1f9a8a1e9b8a1e9c891e9d891f9e891f9f881fa0881fa1881fa1871fa28720a38620a48621a58521a68522a78522a88423a98324aa8325ab8225ac8226ad8127ad8128ae8029af7f2ab07f2cb17e2db27d2eb37c2fb47c31b57b32b67a34b67935b77937b87838b9773aba763bbb753dbc743fbc7340bd7242be7144bf7046c06f48c16e4ac16d4cc26c4ec36b50c46a52c56954c56856c66758c7655ac8645cc8635ec96260ca6063cb5f65cb5e67cc5c69cd5b6ccd5a6ece5870cf5773d05675d05477d1537ad1517cd2507fd34e81d34d84d44b86d54989d5488bd6468ed64590d74393d74195d84098d83e9bd93c9dd93ba0da39a2da37a5db36a8db34aadc32addc30b0dd2fb2dd2db5de2bb8de29bade28bddf26c0df25c2df23c5e021c8e020cae11fcde11dd0e11cd2e21bd5e21ad8e219dae319dde318dfe318e2e418e5e419e7e419eae51aece51befe51cf1e51df4e61ef6e620f8e621fbe723fde725"));

var magma = ramp$1(colors("00000401000501010601010802010902020b02020d03030f03031204041405041606051806051a07061c08071e0907200a08220b09240c09260d0a290e0b2b100b2d110c2f120d31130d34140e36150e38160f3b180f3d19103f1a10421c10441d11471e114920114b21114e22115024125325125527125829115a2a115c2c115f2d11612f116331116533106734106936106b38106c390f6e3b0f703d0f713f0f72400f74420f75440f764510774710784910784a10794c117a4e117b4f127b51127c52137c54137d56147d57157e59157e5a167e5c167f5d177f5f187f601880621980641a80651a80671b80681c816a1c816b1d816d1d816e1e81701f81721f817320817521817621817822817922827b23827c23827e24828025828125818326818426818627818827818928818b29818c29818e2a81902a81912b81932b80942c80962c80982d80992d809b2e7f9c2e7f9e2f7fa02f7fa1307ea3307ea5317ea6317da8327daa337dab337cad347cae347bb0357bb2357bb3367ab5367ab73779b83779ba3878bc3978bd3977bf3a77c03a76c23b75c43c75c53c74c73d73c83e73ca3e72cc3f71cd4071cf4070d0416fd2426fd3436ed5446dd6456cd8456cd9466bdb476adc4869de4968df4a68e04c67e24d66e34e65e44f64e55064e75263e85362e95462ea5661eb5760ec5860ed5a5fee5b5eef5d5ef05f5ef1605df2625df2645cf3655cf4675cf4695cf56b5cf66c5cf66e5cf7705cf7725cf8745cf8765cf9785df9795df97b5dfa7d5efa7f5efa815ffb835ffb8560fb8761fc8961fc8a62fc8c63fc8e64fc9065fd9266fd9467fd9668fd9869fd9a6afd9b6bfe9d6cfe9f6dfea16efea36ffea571fea772fea973feaa74feac76feae77feb078feb27afeb47bfeb67cfeb77efeb97ffebb81febd82febf84fec185fec287fec488fec68afec88cfeca8dfecc8ffecd90fecf92fed194fed395fed597fed799fed89afdda9cfddc9efddea0fde0a1fde2a3fde3a5fde5a7fde7a9fde9aafdebacfcecaefceeb0fcf0b2fcf2b4fcf4b6fcf6b8fcf7b9fcf9bbfcfbbdfcfdbf"));

var inferno = ramp$1(colors("00000401000501010601010802010a02020c02020e03021004031204031405041706041907051b08051d09061f0a07220b07240c08260d08290e092b10092d110a30120a32140b34150b37160b39180c3c190c3e1b0c411c0c431e0c451f0c48210c4a230c4c240c4f260c51280b53290b552b0b572d0b592f0a5b310a5c320a5e340a5f3609613809623909633b09643d09653e0966400a67420a68440a68450a69470b6a490b6a4a0c6b4c0c6b4d0d6c4f0d6c510e6c520e6d540f6d550f6d57106e59106e5a116e5c126e5d126e5f136e61136e62146e64156e65156e67166e69166e6a176e6c186e6d186e6f196e71196e721a6e741a6e751b6e771c6d781c6d7a1d6d7c1d6d7d1e6d7f1e6c801f6c82206c84206b85216b87216b88226a8a226a8c23698d23698f24699025689225689326679526679727669827669a28659b29649d29649f2a63a02a63a22b62a32c61a52c60a62d60a82e5fa92e5eab2f5ead305dae305cb0315bb1325ab3325ab43359b63458b73557b93556ba3655bc3754bd3853bf3952c03a51c13a50c33b4fc43c4ec63d4dc73e4cc83f4bca404acb4149cc4248ce4347cf4446d04545d24644d34743d44842d54a41d74b3fd84c3ed94d3dda4e3cdb503bdd513ade5238df5337e05536e15635e25734e35933e45a31e55c30e65d2fe75e2ee8602de9612bea632aeb6429eb6628ec6726ed6925ee6a24ef6c23ef6e21f06f20f1711ff1731df2741cf3761bf37819f47918f57b17f57d15f67e14f68013f78212f78410f8850ff8870ef8890cf98b0bf98c0af98e09fa9008fa9207fa9407fb9606fb9706fb9906fb9b06fb9d07fc9f07fca108fca309fca50afca60cfca80dfcaa0ffcac11fcae12fcb014fcb216fcb418fbb61afbb81dfbba1ffbbc21fbbe23fac026fac228fac42afac62df9c72ff9c932f9cb35f8cd37f8cf3af7d13df7d340f6d543f6d746f5d949f5db4cf4dd4ff4df53f4e156f3e35af3e55df2e661f2e865f2ea69f1ec6df1ed71f1ef75f1f179f2f27df2f482f3f586f3f68af4f88ef5f992f6fa96f8fb9af9fc9dfafda1fcffa4"));

var plasma = ramp$1(colors("0d088710078813078916078a19068c1b068d1d068e20068f2206902406912605912805922a05932c05942e05952f059631059733059735049837049938049a3a049a3c049b3e049c3f049c41049d43039e44039e46039f48039f4903a04b03a14c02a14e02a25002a25102a35302a35502a45601a45801a45901a55b01a55c01a65e01a66001a66100a76300a76400a76600a76700a86900a86a00a86c00a86e00a86f00a87100a87201a87401a87501a87701a87801a87a02a87b02a87d03a87e03a88004a88104a78305a78405a78606a68707a68808a68a09a58b0aa58d0ba58e0ca48f0da4910ea3920fa39410a29511a19613a19814a099159f9a169f9c179e9d189d9e199da01a9ca11b9ba21d9aa31e9aa51f99a62098a72197a82296aa2395ab2494ac2694ad2793ae2892b02991b12a90b22b8fb32c8eb42e8db52f8cb6308bb7318ab83289ba3388bb3488bc3587bd3786be3885bf3984c03a83c13b82c23c81c33d80c43e7fc5407ec6417dc7427cc8437bc9447aca457acb4679cc4778cc4977cd4a76ce4b75cf4c74d04d73d14e72d24f71d35171d45270d5536fd5546ed6556dd7566cd8576bd9586ada5a6ada5b69db5c68dc5d67dd5e66de5f65de6164df6263e06363e16462e26561e26660e3685fe4695ee56a5de56b5de66c5ce76e5be76f5ae87059e97158e97257ea7457eb7556eb7655ec7754ed7953ed7a52ee7b51ef7c51ef7e50f07f4ff0804ef1814df1834cf2844bf3854bf3874af48849f48948f58b47f58c46f68d45f68f44f79044f79143f79342f89441f89540f9973ff9983ef99a3efa9b3dfa9c3cfa9e3bfb9f3afba139fba238fca338fca537fca636fca835fca934fdab33fdac33fdae32fdaf31fdb130fdb22ffdb42ffdb52efeb72dfeb82cfeba2cfebb2bfebd2afebe2afec029fdc229fdc328fdc527fdc627fdc827fdca26fdcb26fccd25fcce25fcd025fcd225fbd324fbd524fbd724fad824fada24f9dc24f9dd25f8df25f8e125f7e225f7e425f6e626f6e826f5e926f5eb27f4ed27f3ee27f3f027f2f227f1f426f1f525f0f724f0f921"));

function constant$b(x) {
  return function constant() {
    return x;
  };
}

var abs$1 = Math.abs;
var atan2$1 = Math.atan2;
var cos$2 = Math.cos;
var max$2 = Math.max;
var min$1 = Math.min;
var sin$2 = Math.sin;
var sqrt$2 = Math.sqrt;

var epsilon$3 = 1e-12;
var pi$4 = Math.PI;
var halfPi$3 = pi$4 / 2;
var tau$4 = 2 * pi$4;

function acos$1(x) {
  return x > 1 ? 0 : x < -1 ? pi$4 : Math.acos(x);
}

function asin$1(x) {
  return x >= 1 ? halfPi$3 : x <= -1 ? -halfPi$3 : Math.asin(x);
}

function arcInnerRadius(d) {
  return d.innerRadius;
}

function arcOuterRadius(d) {
  return d.outerRadius;
}

function arcStartAngle(d) {
  return d.startAngle;
}

function arcEndAngle(d) {
  return d.endAngle;
}

function arcPadAngle(d) {
  return d && d.padAngle; // Note: optional!
}

function intersect(x0, y0, x1, y1, x2, y2, x3, y3) {
  var x10 = x1 - x0, y10 = y1 - y0,
      x32 = x3 - x2, y32 = y3 - y2,
      t = y32 * x10 - x32 * y10;
  if (t * t < epsilon$3) return;
  t = (x32 * (y0 - y2) - y32 * (x0 - x2)) / t;
  return [x0 + t * x10, y0 + t * y10];
}

// Compute perpendicular offset line of length rc.
// http://mathworld.wolfram.com/Circle-LineIntersection.html
function cornerTangents(x0, y0, x1, y1, r1, rc, cw) {
  var x01 = x0 - x1,
      y01 = y0 - y1,
      lo = (cw ? rc : -rc) / sqrt$2(x01 * x01 + y01 * y01),
      ox = lo * y01,
      oy = -lo * x01,
      x11 = x0 + ox,
      y11 = y0 + oy,
      x10 = x1 + ox,
      y10 = y1 + oy,
      x00 = (x11 + x10) / 2,
      y00 = (y11 + y10) / 2,
      dx = x10 - x11,
      dy = y10 - y11,
      d2 = dx * dx + dy * dy,
      r = r1 - rc,
      D = x11 * y10 - x10 * y11,
      d = (dy < 0 ? -1 : 1) * sqrt$2(max$2(0, r * r * d2 - D * D)),
      cx0 = (D * dy - dx * d) / d2,
      cy0 = (-D * dx - dy * d) / d2,
      cx1 = (D * dy + dx * d) / d2,
      cy1 = (-D * dx + dy * d) / d2,
      dx0 = cx0 - x00,
      dy0 = cy0 - y00,
      dx1 = cx1 - x00,
      dy1 = cy1 - y00;

  // Pick the closer of the two intersection points.
  // TODO Is there a faster way to determine which intersection to use?
  if (dx0 * dx0 + dy0 * dy0 > dx1 * dx1 + dy1 * dy1) cx0 = cx1, cy0 = cy1;

  return {
    cx: cx0,
    cy: cy0,
    x01: -ox,
    y01: -oy,
    x11: cx0 * (r1 / r - 1),
    y11: cy0 * (r1 / r - 1)
  };
}

function arc() {
  var innerRadius = arcInnerRadius,
      outerRadius = arcOuterRadius,
      cornerRadius = constant$b(0),
      padRadius = null,
      startAngle = arcStartAngle,
      endAngle = arcEndAngle,
      padAngle = arcPadAngle,
      context = null;

  function arc() {
    var buffer,
        r,
        r0 = +innerRadius.apply(this, arguments),
        r1 = +outerRadius.apply(this, arguments),
        a0 = startAngle.apply(this, arguments) - halfPi$3,
        a1 = endAngle.apply(this, arguments) - halfPi$3,
        da = abs$1(a1 - a0),
        cw = a1 > a0;

    if (!context) context = buffer = path();

    // Ensure that the outer radius is always larger than the inner radius.
    if (r1 < r0) r = r1, r1 = r0, r0 = r;

    // Is it a point?
    if (!(r1 > epsilon$3)) context.moveTo(0, 0);

    // Or is it a circle or annulus?
    else if (da > tau$4 - epsilon$3) {
      context.moveTo(r1 * cos$2(a0), r1 * sin$2(a0));
      context.arc(0, 0, r1, a0, a1, !cw);
      if (r0 > epsilon$3) {
        context.moveTo(r0 * cos$2(a1), r0 * sin$2(a1));
        context.arc(0, 0, r0, a1, a0, cw);
      }
    }

    // Or is it a circular or annular sector?
    else {
      var a01 = a0,
          a11 = a1,
          a00 = a0,
          a10 = a1,
          da0 = da,
          da1 = da,
          ap = padAngle.apply(this, arguments) / 2,
          rp = (ap > epsilon$3) && (padRadius ? +padRadius.apply(this, arguments) : sqrt$2(r0 * r0 + r1 * r1)),
          rc = min$1(abs$1(r1 - r0) / 2, +cornerRadius.apply(this, arguments)),
          rc0 = rc,
          rc1 = rc,
          t0,
          t1;

      // Apply padding? Note that since r1 ≥ r0, da1 ≥ da0.
      if (rp > epsilon$3) {
        var p0 = asin$1(rp / r0 * sin$2(ap)),
            p1 = asin$1(rp / r1 * sin$2(ap));
        if ((da0 -= p0 * 2) > epsilon$3) p0 *= (cw ? 1 : -1), a00 += p0, a10 -= p0;
        else da0 = 0, a00 = a10 = (a0 + a1) / 2;
        if ((da1 -= p1 * 2) > epsilon$3) p1 *= (cw ? 1 : -1), a01 += p1, a11 -= p1;
        else da1 = 0, a01 = a11 = (a0 + a1) / 2;
      }

      var x01 = r1 * cos$2(a01),
          y01 = r1 * sin$2(a01),
          x10 = r0 * cos$2(a10),
          y10 = r0 * sin$2(a10);

      // Apply rounded corners?
      if (rc > epsilon$3) {
        var x11 = r1 * cos$2(a11),
            y11 = r1 * sin$2(a11),
            x00 = r0 * cos$2(a00),
            y00 = r0 * sin$2(a00),
            oc;

        // Restrict the corner radius according to the sector angle.
        if (da < pi$4 && (oc = intersect(x01, y01, x00, y00, x11, y11, x10, y10))) {
          var ax = x01 - oc[0],
              ay = y01 - oc[1],
              bx = x11 - oc[0],
              by = y11 - oc[1],
              kc = 1 / sin$2(acos$1((ax * bx + ay * by) / (sqrt$2(ax * ax + ay * ay) * sqrt$2(bx * bx + by * by))) / 2),
              lc = sqrt$2(oc[0] * oc[0] + oc[1] * oc[1]);
          rc0 = min$1(rc, (r0 - lc) / (kc - 1));
          rc1 = min$1(rc, (r1 - lc) / (kc + 1));
        }
      }

      // Is the sector collapsed to a line?
      if (!(da1 > epsilon$3)) context.moveTo(x01, y01);

      // Does the sector’s outer ring have rounded corners?
      else if (rc1 > epsilon$3) {
        t0 = cornerTangents(x00, y00, x01, y01, r1, rc1, cw);
        t1 = cornerTangents(x11, y11, x10, y10, r1, rc1, cw);

        context.moveTo(t0.cx + t0.x01, t0.cy + t0.y01);

        // Have the corners merged?
        if (rc1 < rc) context.arc(t0.cx, t0.cy, rc1, atan2$1(t0.y01, t0.x01), atan2$1(t1.y01, t1.x01), !cw);

        // Otherwise, draw the two corners and the ring.
        else {
          context.arc(t0.cx, t0.cy, rc1, atan2$1(t0.y01, t0.x01), atan2$1(t0.y11, t0.x11), !cw);
          context.arc(0, 0, r1, atan2$1(t0.cy + t0.y11, t0.cx + t0.x11), atan2$1(t1.cy + t1.y11, t1.cx + t1.x11), !cw);
          context.arc(t1.cx, t1.cy, rc1, atan2$1(t1.y11, t1.x11), atan2$1(t1.y01, t1.x01), !cw);
        }
      }

      // Or is the outer ring just a circular arc?
      else context.moveTo(x01, y01), context.arc(0, 0, r1, a01, a11, !cw);

      // Is there no inner ring, and it’s a circular sector?
      // Or perhaps it’s an annular sector collapsed due to padding?
      if (!(r0 > epsilon$3) || !(da0 > epsilon$3)) context.lineTo(x10, y10);

      // Does the sector’s inner ring (or point) have rounded corners?
      else if (rc0 > epsilon$3) {
        t0 = cornerTangents(x10, y10, x11, y11, r0, -rc0, cw);
        t1 = cornerTangents(x01, y01, x00, y00, r0, -rc0, cw);

        context.lineTo(t0.cx + t0.x01, t0.cy + t0.y01);

        // Have the corners merged?
        if (rc0 < rc) context.arc(t0.cx, t0.cy, rc0, atan2$1(t0.y01, t0.x01), atan2$1(t1.y01, t1.x01), !cw);

        // Otherwise, draw the two corners and the ring.
        else {
          context.arc(t0.cx, t0.cy, rc0, atan2$1(t0.y01, t0.x01), atan2$1(t0.y11, t0.x11), !cw);
          context.arc(0, 0, r0, atan2$1(t0.cy + t0.y11, t0.cx + t0.x11), atan2$1(t1.cy + t1.y11, t1.cx + t1.x11), cw);
          context.arc(t1.cx, t1.cy, rc0, atan2$1(t1.y11, t1.x11), atan2$1(t1.y01, t1.x01), !cw);
        }
      }

      // Or is the inner ring just a circular arc?
      else context.arc(0, 0, r0, a10, a00, cw);
    }

    context.closePath();

    if (buffer) return context = null, buffer + "" || null;
  }

  arc.centroid = function() {
    var r = (+innerRadius.apply(this, arguments) + +outerRadius.apply(this, arguments)) / 2,
        a = (+startAngle.apply(this, arguments) + +endAngle.apply(this, arguments)) / 2 - pi$4 / 2;
    return [cos$2(a) * r, sin$2(a) * r];
  };

  arc.innerRadius = function(_) {
    return arguments.length ? (innerRadius = typeof _ === "function" ? _ : constant$b(+_), arc) : innerRadius;
  };

  arc.outerRadius = function(_) {
    return arguments.length ? (outerRadius = typeof _ === "function" ? _ : constant$b(+_), arc) : outerRadius;
  };

  arc.cornerRadius = function(_) {
    return arguments.length ? (cornerRadius = typeof _ === "function" ? _ : constant$b(+_), arc) : cornerRadius;
  };

  arc.padRadius = function(_) {
    return arguments.length ? (padRadius = _ == null ? null : typeof _ === "function" ? _ : constant$b(+_), arc) : padRadius;
  };

  arc.startAngle = function(_) {
    return arguments.length ? (startAngle = typeof _ === "function" ? _ : constant$b(+_), arc) : startAngle;
  };

  arc.endAngle = function(_) {
    return arguments.length ? (endAngle = typeof _ === "function" ? _ : constant$b(+_), arc) : endAngle;
  };

  arc.padAngle = function(_) {
    return arguments.length ? (padAngle = typeof _ === "function" ? _ : constant$b(+_), arc) : padAngle;
  };

  arc.context = function(_) {
    return arguments.length ? ((context = _ == null ? null : _), arc) : context;
  };

  return arc;
}

function Linear(context) {
  this._context = context;
}

Linear.prototype = {
  areaStart: function() {
    this._line = 0;
  },
  areaEnd: function() {
    this._line = NaN;
  },
  lineStart: function() {
    this._point = 0;
  },
  lineEnd: function() {
    if (this._line || (this._line !== 0 && this._point === 1)) this._context.closePath();
    this._line = 1 - this._line;
  },
  point: function(x, y) {
    x = +x, y = +y;
    switch (this._point) {
      case 0: this._point = 1; this._line ? this._context.lineTo(x, y) : this._context.moveTo(x, y); break;
      case 1: this._point = 2; // proceed
      default: this._context.lineTo(x, y); break;
    }
  }
};

function curveLinear(context) {
  return new Linear(context);
}

function x$3(p) {
  return p[0];
}

function y$3(p) {
  return p[1];
}

function line() {
  var x$$1 = x$3,
      y$$1 = y$3,
      defined = constant$b(true),
      context = null,
      curve = curveLinear,
      output = null;

  function line(data) {
    var i,
        n = data.length,
        d,
        defined0 = false,
        buffer;

    if (context == null) output = curve(buffer = path());

    for (i = 0; i <= n; ++i) {
      if (!(i < n && defined(d = data[i], i, data)) === defined0) {
        if (defined0 = !defined0) output.lineStart();
        else output.lineEnd();
      }
      if (defined0) output.point(+x$$1(d, i, data), +y$$1(d, i, data));
    }

    if (buffer) return output = null, buffer + "" || null;
  }

  line.x = function(_) {
    return arguments.length ? (x$$1 = typeof _ === "function" ? _ : constant$b(+_), line) : x$$1;
  };

  line.y = function(_) {
    return arguments.length ? (y$$1 = typeof _ === "function" ? _ : constant$b(+_), line) : y$$1;
  };

  line.defined = function(_) {
    return arguments.length ? (defined = typeof _ === "function" ? _ : constant$b(!!_), line) : defined;
  };

  line.curve = function(_) {
    return arguments.length ? (curve = _, context != null && (output = curve(context)), line) : curve;
  };

  line.context = function(_) {
    return arguments.length ? (_ == null ? context = output = null : output = curve(context = _), line) : context;
  };

  return line;
}

function sign$1(x) {
  return x < 0 ? -1 : 1;
}

// Calculate the slopes of the tangents (Hermite-type interpolation) based on
// the following paper: Steffen, M. 1990. A Simple Method for Monotonic
// Interpolation in One Dimension. Astronomy and Astrophysics, Vol. 239, NO.
// NOV(II), P. 443, 1990.
function slope3(that, x2, y2) {
  var h0 = that._x1 - that._x0,
      h1 = x2 - that._x1,
      s0 = (that._y1 - that._y0) / (h0 || h1 < 0 && -0),
      s1 = (y2 - that._y1) / (h1 || h0 < 0 && -0),
      p = (s0 * h1 + s1 * h0) / (h0 + h1);
  return (sign$1(s0) + sign$1(s1)) * Math.min(Math.abs(s0), Math.abs(s1), 0.5 * Math.abs(p)) || 0;
}

// Calculate a one-sided slope.
function slope2(that, t) {
  var h = that._x1 - that._x0;
  return h ? (3 * (that._y1 - that._y0) / h - t) / 2 : t;
}

// According to https://en.wikipedia.org/wiki/Cubic_Hermite_spline#Representations
// "you can express cubic Hermite interpolation in terms of cubic Bézier curves
// with respect to the four values p0, p0 + m0 / 3, p1 - m1 / 3, p1".
function point$5(that, t0, t1) {
  var x0 = that._x0,
      y0 = that._y0,
      x1 = that._x1,
      y1 = that._y1,
      dx = (x1 - x0) / 3;
  that._context.bezierCurveTo(x0 + dx, y0 + dx * t0, x1 - dx, y1 - dx * t1, x1, y1);
}

function MonotoneX(context) {
  this._context = context;
}

MonotoneX.prototype = {
  areaStart: function() {
    this._line = 0;
  },
  areaEnd: function() {
    this._line = NaN;
  },
  lineStart: function() {
    this._x0 = this._x1 =
    this._y0 = this._y1 =
    this._t0 = NaN;
    this._point = 0;
  },
  lineEnd: function() {
    switch (this._point) {
      case 2: this._context.lineTo(this._x1, this._y1); break;
      case 3: point$5(this, this._t0, slope2(this, this._t0)); break;
    }
    if (this._line || (this._line !== 0 && this._point === 1)) this._context.closePath();
    this._line = 1 - this._line;
  },
  point: function(x, y) {
    var t1 = NaN;

    x = +x, y = +y;
    if (x === this._x1 && y === this._y1) return; // Ignore coincident points.
    switch (this._point) {
      case 0: this._point = 1; this._line ? this._context.lineTo(x, y) : this._context.moveTo(x, y); break;
      case 1: this._point = 2; break;
      case 2: this._point = 3; point$5(this, slope2(this, t1 = slope3(this, x, y)), t1); break;
      default: point$5(this, this._t0, t1 = slope3(this, x, y)); break;
    }

    this._x0 = this._x1, this._x1 = x;
    this._y0 = this._y1, this._y1 = y;
    this._t0 = t1;
  }
};

function MonotoneY(context) {
  this._context = new ReflectContext(context);
}

(MonotoneY.prototype = Object.create(MonotoneX.prototype)).point = function(x, y) {
  MonotoneX.prototype.point.call(this, y, x);
};

function ReflectContext(context) {
  this._context = context;
}

ReflectContext.prototype = {
  moveTo: function(x, y) { this._context.moveTo(y, x); },
  closePath: function() { this._context.closePath(); },
  lineTo: function(x, y) { this._context.lineTo(y, x); },
  bezierCurveTo: function(x1, y1, x2, y2, x, y) { this._context.bezierCurveTo(y1, x1, y2, x2, y, x); }
};

function justify(node, n) {
  return node.sourceLinks.length ? node.depth : n - 1;
}

function constant(x) {
  return function() {
    return x;
  };
}

function ascendingSourceBreadth(a, b) {
  return ascendingBreadth(a.source, b.source) || a.index - b.index;
}

function ascendingTargetBreadth(a, b) {
  return ascendingBreadth(a.target, b.target) || a.index - b.index;
}

function ascendingBreadth(a, b) {
  return a.y0 - b.y0;
}

function value(d) {
  return d.value;
}

function defaultId(d) {
  return d.index;
}

function defaultNodes(graph) {
  return graph.nodes;
}

function defaultLinks(graph) {
  return graph.links;
}

function find(nodeById, id) {
  const node = nodeById.get(id);
  if (!node) throw new Error("missing: " + id);
  return node;
}

function computeLinkBreadths({nodes}) {
  for (const node of nodes) {
    let y0 = node.y0;
    let y1 = y0;
    for (const link of node.sourceLinks) {
      link.y0 = y0 + link.width / 2;
      y0 += link.width;
    }
    for (const link of node.targetLinks) {
      link.y1 = y1 + link.width / 2;
      y1 += link.width;
    }
  }
}

function Sankey() {
  let x0 = 0, y0 = 0, x1 = 1, y1 = 1; // extent
  let dx = 24; // nodeWidth
  let py = 8; // nodePadding
  let id = defaultId;
  let align = justify;
  let sort;
  let linkSort;
  let nodes = defaultNodes;
  let links = defaultLinks;
  let iterations = 6;

  function sankey() {
    const graph = {nodes: nodes.apply(null, arguments), links: links.apply(null, arguments)};
    computeNodeLinks(graph);
    computeNodeValues(graph);
    computeNodeDepths(graph);
    computeNodeHeights(graph);
    computeNodeBreadths(graph);
    computeLinkBreadths(graph);
    return graph;
  }

  sankey.update = function(graph) {
    computeLinkBreadths(graph);
    return graph;
  };

  sankey.nodeId = function(_) {
    return arguments.length ? (id = typeof _ === "function" ? _ : constant(_), sankey) : id;
  };

  sankey.nodeAlign = function(_) {
    return arguments.length ? (align = typeof _ === "function" ? _ : constant(_), sankey) : align;
  };

  sankey.nodeSort = function(_) {
    return arguments.length ? (sort = _, sankey) : sort;
  };

  sankey.nodeWidth = function(_) {
    return arguments.length ? (dx = +_, sankey) : dx;
  };

  sankey.nodePadding = function(_) {
    return arguments.length ? (py = +_, sankey) : py;
  };

  sankey.nodes = function(_) {
    return arguments.length ? (nodes = typeof _ === "function" ? _ : constant(_), sankey) : nodes;
  };

  sankey.links = function(_) {
    return arguments.length ? (links = typeof _ === "function" ? _ : constant(_), sankey) : links;
  };

  sankey.linkSort = function(_) {
    return arguments.length ? (linkSort = _, sankey) : linkSort;
  };

  sankey.size = function(_) {
    return arguments.length ? (x0 = y0 = 0, x1 = +_[0], y1 = +_[1], sankey) : [x1 - x0, y1 - y0];
  };

  sankey.extent = function(_) {
    return arguments.length ? (x0 = +_[0][0], x1 = +_[1][0], y0 = +_[0][1], y1 = +_[1][1], sankey) : [[x0, y0], [x1, y1]];
  };

  sankey.iterations = function(_) {
    return arguments.length ? (iterations = +_, sankey) : iterations;
  };

  function computeNodeLinks({nodes, links}) {
    for (const [i, node] of nodes.entries()) {
      node.index = i;
      node.sourceLinks = [];
      node.targetLinks = [];
    }
    const nodeById = new Map(nodes.map((d, i) => [id(d, i, nodes), d]));
    for (const [i, link] of links.entries()) {
      link.index = i;
      let {source, target} = link;
      if (typeof source !== "object") source = link.source = find(nodeById, source);
      if (typeof target !== "object") target = link.target = find(nodeById, target);
      source.sourceLinks.push(link);
      target.targetLinks.push(link);
    }
  }

  function computeNodeValues({nodes}) {
    for (const node of nodes) {
      node.value = Math.max(
        sum(node.sourceLinks, value),
        sum(node.targetLinks, value)
      );
    }
  }

  function computeNodeDepths({nodes}) {
    const n = nodes.length;
    let current = new Set(nodes);
    let next = new Set;
    let x = 0;
    while (current.size) {
      for (const node of current) {
        node.depth = x;
        for (const {target} of node.sourceLinks) {
          next.add(target);
        }
      }
      if (++x > n) throw new Error("circular link");
      current = next;
      next = new Set;
    }
  }

  function computeNodeHeights({nodes}) {
    const n = nodes.length;
    let current = new Set(nodes);
    let next = new Set;
    let x = 0;
    while (current.size) {
      for (const node of current) {
        node.height = x;
        for (const {source} of node.targetLinks) {
          next.add(source);
        }
      }
      if (++x > n) throw new Error("circular link");
      current = next;
      next = new Set;
    }
  }

  function computeNodeLayers({nodes}) {
    const x = max(nodes, d => d.depth) + 1;
    const kx = (x1 - x0 - dx) / (x - 1);
    const columns = new Array(x);
    for (const node of nodes) {
      const i = Math.max(0, Math.min(x - 1, Math.floor(align.call(null, node, x))));
      node.layer = i;
      node.x0 = x0 + i * kx;
      node.x1 = node.x0 + dx;
      if (columns[i]) columns[i].push(node);
      else columns[i] = [node];
    }
    if (sort) for (const column of columns) {
      column.sort(sort);
    }
    return columns;
  }

  function initializeNodeBreadths(columns) {
    const ky = min(columns, c => (y1 - y0 - (c.length - 1) * py) / sum(c, value));
    for (const nodes of columns) {
      let y = y0;
      for (const node of nodes) {
        node.y0 = y;
        node.y1 = y + node.value * ky;
        y = node.y1 + py;
        for (const link of node.sourceLinks) {
          link.width = link.value * ky;
        }
      }
      y = (y1 - y + py) / (nodes.length + 1);
      for (let i = 0; i < nodes.length; ++i) {
        const node = nodes[i];
        node.y0 += y * (i + 1);
        node.y1 += y * (i + 1);
      }
      reorderLinks(nodes);
    }
  }

  function computeNodeBreadths(graph) {
    const columns = computeNodeLayers(graph);
    initializeNodeBreadths(columns);
    for (let i = 0; i < iterations; ++i) {
      const alpha = Math.pow(0.99, i);
      const beta = Math.max(1 - alpha, (i + 1) / iterations);
      relaxRightToLeft(columns, alpha, beta);
      relaxLeftToRight(columns, alpha, beta);
    }
  }

  // Reposition each node based on its incoming (target) links.
  function relaxLeftToRight(columns, alpha, beta) {
    for (let i = 1, n = columns.length; i < n; ++i) {
      const column = columns[i];
      for (const target of column) {
        let y = 0;
        let w = 0;
        for (const {source, value} of target.targetLinks) {
          let v = value * (target.layer - source.layer);
          y += targetTop(source, target) * v;
          w += v;
        }
        if (!(w > 0)) continue;
        let dy = (y / w - target.y0) * alpha;
        target.y0 += dy;
        target.y1 += dy;
        reorderNodeLinks(target);
      }
      if (sort === undefined) column.sort(ascendingBreadth);
      resolveCollisions(column, beta);
    }
  }

  // Reposition each node based on its outgoing (source) links.
  function relaxRightToLeft(columns, alpha, beta) {
    for (let n = columns.length, i = n - 2; i >= 0; --i) {
      const column = columns[i];
      for (const source of column) {
        let y = 0;
        let w = 0;
        for (const {target, value} of source.sourceLinks) {
          let v = value * (target.layer - source.layer);
          y += sourceTop(source, target) * v;
          w += v;
        }
        if (!(w > 0)) continue;
        let dy = (y / w - source.y0) * alpha;
        source.y0 += dy;
        source.y1 += dy;
        reorderNodeLinks(source);
      }
      if (sort === undefined) column.sort(ascendingBreadth);
      resolveCollisions(column, beta);
    }
  }

  function resolveCollisions(nodes, alpha) {
    const i = nodes.length >> 1;
    const subject = nodes[i];
    resolveCollisionsBottomToTop(nodes, subject.y0 - py, i - 1, alpha);
    resolveCollisionsTopToBottom(nodes, subject.y1 + py, i + 1, alpha);
    resolveCollisionsBottomToTop(nodes, y1, nodes.length - 1, alpha);
    resolveCollisionsTopToBottom(nodes, y0, 0, alpha);
  }

  // Push any overlapping nodes down.
  function resolveCollisionsTopToBottom(nodes, y, i, alpha) {
    for (; i < nodes.length; ++i) {
      const node = nodes[i];
      const dy = (y - node.y0) * alpha;
      if (dy > 1e-6) node.y0 += dy, node.y1 += dy;
      y = node.y1 + py;
    }
  }

  // Push any overlapping nodes up.
  function resolveCollisionsBottomToTop(nodes, y, i, alpha) {
    for (; i >= 0; --i) {
      const node = nodes[i];
      const dy = (node.y1 - y) * alpha;
      if (dy > 1e-6) node.y0 -= dy, node.y1 -= dy;
      y = node.y0 - py;
    }
  }

  function reorderNodeLinks({sourceLinks, targetLinks}) {
    if (linkSort === undefined) {
      for (const {source: {sourceLinks}} of targetLinks) {
        sourceLinks.sort(ascendingTargetBreadth);
      }
      for (const {target: {targetLinks}} of sourceLinks) {
        targetLinks.sort(ascendingSourceBreadth);
      }
    }
  }

  function reorderLinks(nodes) {
    if (linkSort === undefined) {
      for (const {sourceLinks, targetLinks} of nodes) {
        sourceLinks.sort(ascendingTargetBreadth);
        targetLinks.sort(ascendingSourceBreadth);
      }
    }
  }

  // Returns the target.y0 that would produce an ideal link from source to target.
  function targetTop(source, target) {
    let y = source.y0 - (source.sourceLinks.length - 1) * py / 2;
    for (const {target: node, width} of source.sourceLinks) {
      if (node === target) break;
      y += width + py;
    }
    for (const {source: node, width} of target.targetLinks) {
      if (node === source) break;
      y -= width;
    }
    return y;
  }

  // Returns the source.y0 that would produce an ideal link from source to target.
  function sourceTop(source, target) {
    let y = target.y0 - (target.targetLinks.length - 1) * py / 2;
    for (const {source: node, width} of target.targetLinks) {
      if (node === source) break;
      y += width + py;
    }
    for (const {target: node, width} of source.sourceLinks) {
      if (node === target) break;
      y -= width;
    }
    return y;
  }

  return sankey;
}

var Convey;

Convey = class Convey {
  constructor(shapes, defs, g, x, y, w, h) {
    this.doData = this.doData.bind(this);
    this.sankeyLink = this.sankeyLink.bind(this);
    this.shapes = shapes;
    this.defs = defs;
    this.g = g;
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.nw = 24;
    this.np = 0;
    this.showLabel = false;
    Convey.Id++;
    this.shapes.gradientDef(this.defs, 'WhiteBlack' + Convey.Id, 'white', 'black');
    this.gc = this.g.append("g");
  }

  doData(graph) {
    this.sankeyc = this.createSankeyc();
    this.graph = this.sankeyc(graph);
    [this.linkSvg, this.nodeSvg] = this.doSankey(this.sankeyc, this.graph);
  }

  createSankeyc() {
    var sankeyc;
    sankeyc = Sankey().nodeWidth(this.nw).nodePadding(this.np).extent([[this.x, this.y], [this.x + this.w, this.y + this.h]]);
    sankeyc.link = this.sankeyLink;
    return sankeyc;
  }

  sankeyLink(d) {
    var curvature, x0, x1, x2, x3, xi, y0, y1;
    curvature = .5;
    x0 = d.source.x1;
    x1 = d.target.x0;
    xi = interpolateNumber(x0, x1);
    x2 = xi(curvature);
    x3 = xi(1 - curvature);
    y0 = d.y0;
    y1 = d.y1 + 0.1; // 0.1 prevents a pure horizontal line that did not respond to color gradients
    return 'M' + x0 + ',' + y0 + 'C' + x2 + ',' + y0 + ' ' + x3 + ',' + y1 + ' ' + x1 + ',' + y1;
  }

  doSankey(sankey, graph) {
    var linkSvg, nodeSvg;
    sankey.nodes(graph.nodes).links(graph.links);
    //console.log( 'Node', node ) for node in graph.nodes
    linkSvg = this.doLinks(graph);
    nodeSvg = this.doNodes(graph);
    return [linkSvg, nodeSvg];
  }

  // .attr( "stroke", "url(#WhiteBlack)" ).attr( "fill","none")#
  doLinks(graph) {
    var d, gLink, gLinks, i, id, len, ref;
    gLinks = this.gc.append("svg:g");
    ref = graph.links;
    for (i = 0, len = ref.length; i < len; i++) {
      d = ref[i];
      //console.log( 'Convey.doLinks() d', d )
      id = d.source.name + d.target.name;
      this.shapes.gradientDef(this.defs, id, d.source.color, d.target.color);
      gLink = gLinks.append("svg:g").attr("stroke", `url(#${id})`).attr("fill", "none");
      //sort( (a, b) -> (b.y1-b.y0) - (a.y1-a.y0) )
      gLink.append("svg:path").attr("d", this.sankeyc.link(d)).style("stroke-width", 1).append("title").text(d.source.name + " → " + d.target.name); //.attr("class", "link")
    }
    return gLinks;
  }

  doNodes(graph) {
    var node;
    node = this.gc.append("g").selectAll(".node").data(graph.nodes).enter().append("g").attr("class", "node").attr("transform", function(d) {
      return Vis$2.translate(d.x0, d.y0);
    });
    node.append("rect").attr("height", function(d) {
      return d.y1 - d.y0;
    }).attr("width", this.sankeyc.nodeWidth()).attr("fill", (d) => {
      return d.color;
    }).append("title").text((d) => {
      return d.name; //  + "\n" + d.value
    });
    if (this.showLabel) {
      node.append("text").attr("x", -6).attr("y", function(d) {
        return (d.y1 - d.y0) / 2;
      }).attr("dy", ".35em").attr("text-anchor", "end").text(function(d) {
        return d.name;
      }).filter((d) => {
        return d['x'] < this.w / 2;
      }).attr("x", 6 + this.sankeyc.nodeWidth()).attr("text-anchor", "start");
    }
    return node;
  }

};

Convey.Id = 0;

var Convey$1 = Convey;

var Shapes,
  hasProp$3 = {}.hasOwnProperty;

Shapes = class Shapes {
  constructor(stream) {
    this.createSvg = this.createSvg.bind(this);
    this.layoutSvg = this.layoutSvg.bind(this);
    this.stream = stream;
    this.cos30 = 0.86602540378;
    //@cos15 = Vis.cos(15)
    this.fontText = "Roboto";
    Util$1.noop(this.ellipse, this.pathPlot, this.textFill, this.rectGrad, this.saveSvg, this.createSvg, this.layoutSvg);
  }

  createSvg(elem, name, w, h) {
    var defs, g, gId, svg, svgId;
    svgId = Util$1.htmlId(name, 'Svg', '', false); // Turn off duplicate id error message
    gId = Util$1.htmlId(name, 'SvgG', '', false); // Turn off duplicate id error message
    svg = select(elem).append("svg:svg");
    svg.attr("id", svgId).attr("width", w).attr("height", h).attr("xmlns", "http://www.w3.org/2000/svg");
    defs = svg.append("svg:defs");
    g = svg.append("svg:g").attr("id", gId); // All transforms are applied to g
    return [svg, g, svgId, gId, defs];
  }

  layoutSvg(svg, g, svgWidth, svgHeight, sx, sy) {
    // console.log( 'Shapes.layoutSvg()', svgWidth, svgHeight, sx, sy )
    svg.attr("width", svgWidth).attr("height", svgHeight);
    g.attr('transform', Vis$2.scale(sx, sy));
  }

  rectGrad(g, defs, xc, yc, w, h, fill, stroke, text) {
    this.rectCenter(g, xc, yc, w * 1.5, h * 1.5, fill, stroke, 0.1);
    this.rectCenter(g, xc, yc, w * 1.4, h * 1.4, fill, stroke, 0.2);
    this.rectCenter(g, xc, yc, w * 1.3, h * 1.3, fill, stroke, 0.3);
    this.rectCenter(g, xc, yc, w * 1.2, h * 1.2, fill, stroke, 0.4);
    this.rectCenter(g, xc, yc, w * 1.1, h * 1.1, fill, stroke, 0.5);
    this.rectCenter(g, xc, yc, w, h, fill, stroke, 0.6, text);
  }

  rectCenter(g, xc, yc, w, h, fill, stroke, opacity, text = '') {
    this.rect(g, xc - w * 0.5, yc - h * 0.5, w, h, fill, stroke, opacity, text);
  }

  toFill(studyPrac, darken = false) {
    var hsv;
    hsv = (studyPrac.hsv != null) && studyPrac.hsv.length === 3 ? studyPrac.hsv : [50, 50, 50];
    hsv = darken ? [hsv[0], hsv[1], hsv[2] * 0.75] : hsv; // [hsv[0],60,30]
    // console.log( 'Shapes.toFill()', studyPrac.hsv, hsv ) if darken
    if ((studyPrac.hsv != null) && studyPrac.hsv.length === 3) {
      return Vis$2.toRgbHsvStr(hsv);
    } else {
      console.error('Shapes.toFill() unknown fill code', {
        name: studyPrac.name,
        fill: studyPrac.fill,
        spec: studyPrac
      });
      return '#888888';
    }
  }

  arrange(prac) {
    var dir, i, len, ref, studies;
    studies = {};
    ref = ['north', 'west', 'east', 'south'];
    for (i = 0, len = ref.length; i < len; i++) {
      dir = ref[i];
      studies[this.key(prac, dir)] = this.obj(prac, dir);
    }
    return studies;
  }

  key(prac, dir) {
    var key, study;
    for (key in prac) {
      study = prac[key];
      if (Util$1.isChild(key) && study.dir === dir) {
        return key;
      }
    }
    return '???';
  }

  obj(prac, dir) {
    var key, study;
    for (key in prac) {
      study = prac[key];
      if (Util$1.isChild(key) && study.dir === dir) {
        return study;
      }
    }
    return {};
  }

  htmlId(pracName, contentName) {
    return Util$1.getHtmlId(pracName, 'Info', contentName); // @ui.plane.id
  }

  size(obj) {
    if (obj != null) {
      return Object.keys(obj).length;
    } else {
      return 0;
    }
  }

  isWest(col) {
    return col === 'Embrace';
  }

  layout(geom, col, ns, ni) {
    var lay;
    lay = {}; // Layout ob
    lay.dir = (this.isWest(col)) ? 1 : -1; // convey direction
    lay.xc = geom.x0; // x center
    lay.yc = geom.y0; // y center
    lay.w = geom.w; // pane width
    lay.h = geom.h; // pane height
    lay.hk = lay.h / 8; // height keyhole rect
    lay.xk = (this.isWest(col)) ? lay.w : 0; // x keyhole rect
    lay.yk = lay.yc - lay.hk; // y keyhole rect
    lay.rs = lay.yc * 0.85; // Outer  study section radius
    lay.ro = lay.rs - lay.hk; // Inner  study section radius
    lay.ri = lay.ro - lay.hk / 4; // Icon   intersction   radius
    lay.yt = lay.yc + lay.ro + lay.rs * 0.65; // y for practice text
    lay.a1 = (this.isWest(col)) ? 60 : 120; // Begin  study section angle
    lay.a2 = (this.isWest(col)) ? 300 : -120; // Ending study section angle
    lay.ns = ns; // Number of studies
    lay.da = (lay.a1 - lay.a2) / lay.ns; // Angle of each section
    lay.ds = lay.da / 12; // Link angle dif
    lay.li = lay.ds / 2; // Link begin inset
    lay.wr = 8; // Width  study rect  24
    lay.hr = lay.ri / lay.ns; // Height study rect
    lay.xr = lay.xc + lay.dir * (lay.rs / 2 + lay.wr); // x orgin study rect
    lay.yr = lay.yc - lay.ri / 2; // r orgin study rect
    lay.dl = lay.hr / 12; // link dif on study rect
    lay.xl = lay.xr + lay.wr; // x link   on study rect
    lay.yl = lay.yr + lay.dl / 2; // y link   on study rect
    lay.ni = ni; // Number of innovative studies
    lay.xi = 0; // x innovative study rects
    lay.yi = lay.yc - lay.ri / 2; // y innovative study rects
    lay.wi = lay.wr; // w innovative study rects
    lay.hi = lay.ri / lay.ni; // h innovative study rects
    lay.thick = 1; // line thickness
    lay.stroke = 'none'; // line stroke
    // console.log( 'Shapes.layout()', col, geom, lay )
    return lay;
  }

  click(path, text) {
    path.style('z-index', '4'); //.style("pointer-events","all").style("visibility", "visible" )
    path.on("click", () => {
      var select;
      //console.log( 'Shape.click',  text )
      select = {}; // UI.toTopic(  text, 'Shapes', UI.SelectStudy )
      return this.stream.publish('Select', select);
    });
  }

  wedge(g, r1, r2, a1, a2, x0, y0, fill, text, wedgeId) {
    var arc$1;
    arc$1 = arc().innerRadius(r1).outerRadius(r2).startAngle(this.radD3(a1)).endAngle(this.radD3(a2));
    //console.log( 'Shape.wedge()', { x0:x0, y0:y0 } )
    g.append("svg:path").attr("d", arc$1).attr("fill", fill).attr("stroke", "none").attr("transform", Vis$2.translate(x0, y0));
    this.wedgeText(g, r1, r2, a1, a2, x0, y0, fill, text, wedgeId);
  }

  wedgeText(g, r1, r2, a1, a2, x0, y0, fill, text, wedgeId) {
    var as, at, path, rt, th, x, y;
    Util$1.noop(wedgeId);
    th = 14;
    at = (a1 + a2) / 2;
    if ((210 <= at && at <= 330) || (-150 <= at && at <= -30)) {
      rt = (r1 + r2) / 2 + th * 0.25;
      as = 270 - at;
    } else {
      rt = (r1 + r2) / 2 - th * 0.5;
      as = 90 - at;
    }
    x = x0 + rt * this.cos(at);
    y = y0 + rt * this.sin(at);
    path = g.append("svg:text").text(text).attr("x", x).attr("y", y).attr("transform", Vis$2.rotate(as, x, y)).attr("text-anchor", "middle").attr("font-size", `${th}px`).attr("font-family", this.fontText).attr("font-weight", "bold").attr('fill', '#000000'); // @textFill(fill))
    this.click(path, text);
  }

  icon(g, x0, y0, name, iconId, uc) {
    var path;
    path = g.append("svg:text").text(uc).attr("x", x0).attr("y", y0 + 12).attr("id", iconId).attr("text-anchor", "middle").attr("font-size", "4vh").attr("font-family", "FontAwesome");
    this.click(path, name);
  }

  text(g, x0, y0, name, textId, color, size) {
    var path;
    path = g.append("svg:text").text(name).attr("x", x0).attr("y", y0).attr("id", textId).attr("fill", color).attr("text-anchor", "middle").attr("font-size", size).attr("font-family", this.fontText).attr("font-weight", "bold");
    this.click(path, name);
  }

  link(g, a, ra, rb, xc, yc, xd, yd, xe, ye, stroke, thick) {
    var data, xa, xb, ya, yb;
    xa = xc + ra * this.cos(a);
    ya = yc + ra * this.sin(a);
    xb = xc + rb * this.cos(a);
    yb = yc + rb * this.sin(a);
    data = `M${xa},${ya} C${xb},${yb} ${xd},${yd} ${xe},${ye}`;
    this.curve(g, data, stroke, thick);
  }

  curve(g, data, stroke, thick) {
    g.append("svg:path").attr("d", data).attr("stroke-linejoin", "round").attr("fill", "none").attr("stroke", stroke).attr("stroke-width", thick);
  }

  keyHole(g, xc, yc, xs, ys, ro, ri, fill, stroke = 'none', thick = 0) {
    var a, data, h, isweep, osweep, rh, rx;
    h = yc - ys;
    a = Math.asin(h / ro);
    rx = Math.cos(a) * ro;
    rh = ri;
    osweep = 0; // Negative
    isweep = 1; // Positive
    if (xs < xc) {
      rx = -rx;
      rh = -ri;
      osweep = 1; // Positive
      isweep = 0; // Negative
    }
    data = `M${xs},   ${ys}`;
    data += `L${xc + rx},${ys} A${ro},${ro} 0, 1,${osweep} ${xc + rx},${yc + h}`;
    data += `L${xs},   ${yc + h} L${xs},${ys}`;
    data += `M${xc + rh},${yc} A${ri},${ri} 0, 1,${isweep} ${xc + rh},${yc - 0.001 // Donut hole
}`;
    //console.log( 'Shapes.keyhole()', { xc:xc, yc:yc, xs:xs, ys:ys, ro:ro, ri:ri, h:h, a:a, rx:rx } )
    this.poly(g, data, fill, stroke, thick);
  }

  poly(g, data, fill) {
    g.append("svg:path").attr("d", data).attr("stroke-linejoin", "round").attr("fill", fill);
  }

  // svg:rect x="0" y="0" width="0" height="0" rx="0" ry="0"
  rect(g, x0, y0, w, h, fill, stroke, opacity = 1.0, text = '', size = '2em') {
    g.append("svg:rect").attr("x", x0).attr("y", y0).attr("width", w).attr("height", h).attr("fill", fill).attr("stroke", stroke).style("opacity", opacity);
    if (opacity < 1.0) {
      g.style('background', '#000000');
    }
    if (text !== '') {
      g.append("svg:text").text(text).attr("x", x0 + w / 2).attr("y", y0 + h / 2 + 14).attr('fill', 'wheat').attr("text-anchor", "middle").attr("font-size", size).attr("font-family", this.fontText).attr("font-weight", "bold");
    }
  }

  round(g, x0, y0, w, h, rx, ry, fill, stroke) {
    g.append("svg:rect").attr("x", x0).attr("y", y0).attr("width", w).attr("height", h).attr("rx", rx).attr("ry", ry).attr("fill", fill).attr("stroke", stroke);
  }

  // svg:ellipse cx="0" cy="0" rx="0" ry="0"
  ellipse(g, cx, cy, rx, ry, fill, stroke) {
    g.append("svg:ellipse").attr("cx", cx).attr("cy", cy).attr("rx", rx).attr("ry", ry).attr("fill", fill).attr("stroke", stroke);
  }

  // svg:ellipse cx="0" cy="0" rx="0" ry="0"
  circle(g, cx, cy, r, fill, stroke) {
    g.append("svg:ellipse").attr("cx", cx).attr("cy", cy).attr("r", r).attr("fill", fill).attr("stroke", stroke);
  }

  nodesLinks(studies, innovs) {
    var iK, iKey, innov, key, links, nodes, sK, sKey, study;
    nodes = [];
    for (key in studies) {
      if (!hasProp$3.call(studies, key)) continue;
      study = studies[key];
      nodes.push({
        name: key,
        color: this.toFill(study)
      });
    }
    for (key in innovs) {
      if (!hasProp$3.call(innovs, key)) continue;
      innov = innovs[key];
      nodes.push({
        name: key,
        color: this.toFill(innov)
      });
    }
    links = [];
    sK = 0;
    for (sKey in studies) {
      if (!hasProp$3.call(studies, sKey)) continue;
      study = studies[sKey];
      iK = 4;
      for (iKey in innovs) {
        if (!hasProp$3.call(innovs, iKey)) continue;
        innov = innovs[iKey];
        links.push({
          source: sK,
          target: iK,
          value: 1 // sourceName:sKey, targetName:iKey,
        });
        iK++;
      }
      sK++;
    }
    return {
      //console.log( 'Shape.nodesLinks', nodes, links )
      nodes: nodes,
      links: links
    };
  }

  conveySankey(col, defs, g, studies, innovs, x, y, w, h) {
    var convey, nodesLinks;
    //console.log( { col:col, studies:studies, innovs:innovs, x:x, y:y, w:w, h:h } )
    convey = new Convey$1(this, defs, g, x, y, w, h);
    nodesLinks = {};
    if (col === "Embrace") {
      nodesLinks = this.nodesLinks(studies, innovs);
    } else if (col === "Encourage") {
      nodesLinks = this.nodesLinks(innovs, studies);
    }
    convey.doData(nodesLinks);
  }

  // All flows are colored the north color of yellow [[90,90.90]
  practiceFlow(g, geom, spec) {
    if (spec.row == null) {
      return;
    }
    switch (spec.row) {
      case 'Learn':
        this.flow(g, geom, [90, 90, 90], 'south', 12);
        break;
      case 'Do':
        this.flow(g, geom, [90, 90, 90], 'north', 12);
        this.flow(g, geom, [90, 90, 90], 'south', 12);
        break;
      case 'Share':
        this.flow(g, geom, [90, 90, 90], 'sorth', 12);
        break;
      default:
        console.error(' unknown spec row ', spec.name, spec.row);
        this.flow(g, geom, [90, 90, 90], 'south', 12);
    }
  }

  flow(g, geom, hsv, dir, h) {
    var fill, w, x0, y0;
    w = 18;
    x0 = geom.x0 - w / 2;
    y0 = dir === 'south' ? geom.h - h : 0;
    fill = Vis$2.toRgbHsvStr(hsv);
    this.rect(g, x0, y0, w, h, fill, 'none');
  }

  // Convert degress to radians and make angle counter clockwise
  rad(deg) {
    return (360 - deg) * Math.PI / 180.0;
  }

  //degSVG:( deg ) -> 360-deg
  radD3(deg) {
    return (450 - deg) * Math.PI / 180.0;
  }

  //degD3:( rad )  -> -rad * 180.0 / Math.PI
  cos(deg) {
    return Vis$2.cosSvg(deg);
  }

  sin(deg) {
    return Vis$2.sinSvg(deg);
  }

  gradientDef(defs, id, color1, color2, x1 = '0%', x2 = '100%', y1 = '0%', y2 = '100%') {
    var grad;
    grad = defs.append("svg:linearGradient");
    grad.attr("id", id).attr("x1", x1).attr("y1", y1).attr("x2", x2).attr("y2", y2);
    grad.append("svg:stop").attr("offset", "10%").attr("stop-color", color1);
    grad.append("svg:stop").attr("offset", "90%").attr("stop-color", color2);
  }

  pathPlot(g, stroke, thick, d) {
    g.append('svg:path').attr('d', d).attr('stroke', stroke).attr('stroke-width', thick).attr('fill', 'none').attr("stroke-linejoin", 'round');
  }

  textFill(hex, dark = '#000000', light = '#FFFFFF') {
    if (hex > 0x888888) {
      return dark;
    } else {
      return light;
    }
  }

  saveSvg(name, id) {
    var downloadLink, fileName, svgBlob, svgData, svgUrl;
    fileName = name + '.svg';
    svgData = $('#' + id)[0].outerHTML;
    svgBlob = new Blob([svgData], {
      type: "image/svg+xml;charset=utf-8"
    });
    svgUrl = window['URL'].createObjectURL(svgBlob);
    downloadLink = document.createElement("a");
    downloadLink.href = svgUrl;
    downloadLink.download = fileName;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  }

};

var Shapes$1 = Shapes;

var Embrace,
  hasProp$4 = {}.hasOwnProperty;

Embrace = class Embrace {
  constructor(spec, shapes, build) {
    this.drawSvg = this.drawSvg.bind(this);
    this.spec = spec;
    this.shapes = shapes;
    this.build = build;
    this.studies = this.shapes.arrange(this.spec);
    this.innovs = this.build.adjacentStudies(this.spec, 'east');
  }

  drawSvg(g, geom, defs) {
    var a, a1, fill, h, i, key, lay, ref, ref1, ref2, ref3, study, w, wedgeId, x, xr, xt, y, yl, yr, yt;
    lay = this.shapes.layout(geom, this.spec.column, this.shapes.size(this.studies), this.shapes.size(this.innovs));
    fill = this.shapes.toFill(this.spec, true);
    this.shapes.keyHole(g, lay.xc, lay.yc, lay.xk, lay.yk, lay.ro, lay.hk, fill, lay.stroke);
    yl = lay.yl;
    a1 = lay.a1;
    xr = lay.xr + lay.wr;
    yr = lay.yr;
    ref = this.studies;
    for (key in ref) {
      if (!hasProp$4.call(ref, key)) continue;
      study = ref[key];
      fill = this.shapes.toFill(study);
      wedgeId = this.shapes.htmlId(study.name, 'Wedge');
      this.shapes.wedge(g, lay.ro, lay.rs, a1, a1 - lay.da, lay.xc, lay.yc, fill, study.name, wedgeId);
      for (a = i = ref1 = a1 - lay.li, ref2 = a1 - lay.da, ref3 = -lay.ds; ref3 !== 0 && (ref3 > 0 ? i < ref2 : i > ref2); a = i += ref3) {
        this.shapes.link(g, a, lay.ro, lay.ri, lay.xc, lay.yc, lay.xc, yl, xr, yl, fill, lay.thick);
        yl += lay.dl;
      }
      a1 -= lay.da;
      yr += lay.hr;
    }
    x = lay.xr + lay.wr;
    y = lay.yr;
    w = lay.w - x;
    h = lay.ri;
    xt = x + w * 0.5;
    yt = geom.y0 * 0.5 - 6;
    this.shapes.conveySankey("Embrace", defs, g, this.studies, this.innovs, x, y, w, h);
    this.shapes.icon(g, geom.x0, geom.y0, this.spec.name, this.shapes.htmlId(this.spec.name, 'IconSvg'), Vis$2.unicode(this.spec.icon));
    this.shapes.text(g, xt, yt, this.spec.name, this.shapes.htmlId(this.spec.name, 'TextSvg'), 'lack', '1.2em');
    this.shapes.practiceFlow(g, geom, this.spec);
  }

  // Not called but matches innovation
  innovateStudies(g, geom) {
    var fill, h, innov, key, r0, ref, w, x0, y0;
    r0 = geom.x0 / 2 - 36;
    w = 24;
    h = r0 / this.shapes.size(this.innovs);
    x0 = geom.w - w;
    y0 = geom.y0 - r0 / 2;
    ref = this.innovs;
    for (key in ref) {
      if (!hasProp$4.call(ref, key)) continue;
      innov = ref[key];
      fill = this.shapes.toFill(innov);
      this.shapes.rect(g, x0, y0, w, h, fill, 'none');
      y0 += h;
    }
  }

};

var Embrace$1 = Embrace;

var Innovate;

Innovate = class Innovate {
  constructor(spec, shapes, build) {
    this.hexStudy = this.hexStudy.bind(this);
    this.line = this.line.bind(this);
    this.spec = spec;
    this.shapes = shapes;
    this.build = build;
    this.studies = this.shapes.arrange(this.spec);
    this.cos30 = this.shapes.cos30;
    this.t = 24;
    this.xh = 0;
    this.yh = 0;
    this.r = 0;
    this.thick = 1;
    this.stroke = 'black';
  }

  drawSvg(g, geom, defs) {
    var key, ref, study;
    Util$1.noop(defs);
    this.lay = this.shapes.layout(geom, this.spec.column, this.shapes.size(this.studies), this.shapes.size(this.studies));
    this.rings(g, geom, this.t);
    switch (this.spec.row) {
      case 'Learn':
        this.concept(g, geom);
        break;
      case 'Do':
        this.technology(g, geom);
        break;
      case 'Share':
        this.facilitate(g, geom);
        break;
      default:
        this.technology(g, geom); // Default for group spec
    }
    ref = this.studies;
    for (key in ref) {
      study = ref[key];
      this.hexStudy(g, geom, study);
    }
  }

  rings(g, geom, t) {
    var colorBack, colorRing;
    colorRing = Vis$2.toRgbHsvStr([70, 55, 70]);
    colorBack = 'rgba(97, 56, 77, 1.0 )';
    this.shapes.round(g, t, t, geom.w - t * 2, geom.h - t * 2, t, t, colorRing, 'none');
    this.shapes.round(g, t * 2.5, t * 2.5, geom.w - t * 5.0, geom.h - t * 5.0, t, t, colorBack, 'none');
    return this.shapes.text(g, t * 4, t * 2 + 2, this.spec.name, this.spec.name + 'Text', 'black', '1.2em');
  }

  concept(g, geom) {
    this.eastInovate(g, geom);
    this.westInovate(g, geom);
    this.southInovate(g, geom, function(study) {
      return study.dir !== 'north';
    });
  }

  // "ArchitectEngineerConstruct":{"dir":"pradd","icon":"fa-university","hsv":[ 30,60,90]}
  technology(g, geom) {
    this.eastInovate(g, geom);
    this.westInovate(g, geom);
    this.northInovate(g, geom, function(study) {
      return study.dir !== 'south';
    });
    this.southInovate(g, geom, function(study) {
      return study.dir !== 'north';
    });
  }

  facilitate(g, geom) {
    this.eastInovate(g, geom);
    this.westInovate(g, geom);
    this.northInovate(g, geom);
  }

  westInovate(g, geom) {
    var fill, h, key, r0, ref, study, w, x0, y0;
    r0 = this.lay.ri; // geom.x0/2 - 36
    w = 24;
    h = r0 / this.shapes.size(this.studies);
    x0 = geom.w - w;
    y0 = geom.y0 - r0 / 2;
    ref = this.studies;
    for (key in ref) {
      study = ref[key];
      fill = this.shapes.toFill(study);
      this.shapes.rect(g, x0, y0, w, h, fill, 'none');
      y0 += h;
    }
  }

  eastInovate(g, geom) {
    var fill, h, key, r0, ref, study, w, x0, y0;
    r0 = this.lay.ri; // geom.x0/2 - 36
    w = 24;
    h = r0 / this.shapes.size(this.studies);
    x0 = 0;
    y0 = geom.y0 - r0 / 2;
    ref = this.studies;
    for (key in ref) {
      study = ref[key];
      fill = this.shapes.toFill(study);
      this.shapes.rect(g, x0, y0, w, h, fill, 'none');
      y0 += h;
    }
  }

  northInovate(g, geom) {
    var dx, fill, h, key, ordered, study, w, x0, y0;
    w = 18;
    h = 24;
    dx = geom.r * 1.5;
    x0 = geom.x0 - dx - w / 2;
    y0 = 0;
    ordered = this.build.toOrder(this.studies, ['west', 'north', 'east']);
    for (key in ordered) {
      study = ordered[key];
      fill = this.shapes.toFill(study);
      this.shapes.rect(g, x0, y0, w, h, fill, 'none');
      x0 += dx;
    }
  }

  southInovate(g, geom) {
    var dx, fill, h, key, ordered, study, w, x0, y0;
    w = 18;
    h = 24;
    dx = geom.r * 1.5;
    x0 = geom.x0 - dx - w / 2;
    y0 = geom.h - h;
    ordered = this.build.toOrder(this.studies, ['west', 'north', 'east']);
    for (key in ordered) {
      study = ordered[key];
      fill = this.shapes.toFill(study);
      this.shapes.rect(g, x0, y0, w, h, fill, 'none');
      x0 += dx;
    }
  }

  hexStudy(g, geom, study) {
    var dx, dy, fill, i, j, uc, x, x0, y, y0, yh;
    this.r = geom.r;
    dx = this.r * 1.5;
    dy = this.r * 2.0 * this.cos30;
    x0 = geom.x0;
    y0 = geom.y0; // - 26
    j = 0;
    i = 0;
    [j, i] = this.hexPosTier(study.dir);
    yh = j % 2 === 0 ? 0 : this.r * this.cos30;
    x = j * dx + x0;
    y = -i * dy + y0 + yh;
    fill = this.shapes.toFill(study);
    uc = Vis$2.unicode(study.icon);
    // console.log( 'Innovate.hexStudy()', study.icon, uc )
    this.hexPath(fill, g, x, y, this.shapes.htmlId(study.name, 'HexPath'));
    this.hexText(study.name, g, x, y, this.shapes.htmlId(study.name, 'HexText'));
    this.hexIcon(uc, g, x, y, this.shapes.htmlId(study.name, 'HexIcon'));
  }

  hexPosTier(dir) {
    switch (dir) {
      case 'west':
      case 'westd':
        return [-1, 0.5];
      case 'north':
      case 'northd':
        return [0, 0.5];
      case 'east':
      case 'eastd':
        return [1, 0.5];
      case 'south':
      case 'southd':
        return [0, -0.5];
      case 'nw':
      case 'nwd':
        return [-1, 1.5];
      case 'ne':
      case 'ned':
        return [1, 1.5];
      case 'sw':
      case 'swd':
        return [-1, -0.5];
      case 'se':
      case 'sed':
        return [1, -0.5];
      default:
        console.error('Innovate.hexPos() unknown dir', dir, 'returning [0, 0.5] for Service');
        return [0, 0.5];
    }
  }

  line() {
    return line().x((ang) => {
      return this.r * Vis$2.cosSvg(ang) + this.xh;
    }).y((ang) => {
      return this.r * Vis$2.sinSvg(ang) + this.yh;
    });
  }

  hexPath(fill, g, x0, y0, pathId) {
    var ang, k, len, path$1, ref, xp, yp;
    xp = (ang) => {
      return this.r * Vis$2.cosSvg(ang) + x0;
    };
    yp = (ang) => {
      return this.r * Vis$2.sinSvg(ang) + y0;
    };
    path$1 = path();
    path$1.moveTo(xp(0), yp(0));
    ref = [60, 120, 180, 240, 300, 360];
    for (k = 0, len = ref.length; k < len; k++) {
      ang = ref[k];
      path$1.lineTo(xp(ang), yp(ang));
    }
    path$1.closePath();
    // console.log( 'hexPathV4 path', path )
    g.append("svg:path").attr("d", path$1).attr("id", pathId).attr("stroke-width", this.thick).attr("stroke", this.stroke).attr("fill", fill);
  }

  hexText(text, g, x0, y0, textId) {
    var path;
    path = g.append("svg:text").text(text).attr("id", textId).attr("x", x0).attr("y", y0 + 16).attr("text-anchor", "middle").attr("font-size", "0.5em").attr("font-family", this.shapes.fontText);
    //.attr("font-weight","bold")
    this.shapes.click(path, text);
  }

  hexIcon(icon, g, x0, y0, iconId) {
    g.append("svg:text").text(icon).attr("x", x0).attr("y", y0 - 2).attr("id", iconId).attr("text-anchor", "middle").attr("font-size", "1.0em").attr("font-family", "FontAwesome").attr("font-weight", "normal");
  }

};

var Innovate$1 = Innovate;

var Encourage;

Encourage = class Encourage {
  constructor(spec, shapes, build) {
    this.spec = spec;
    this.shapes = shapes;
    this.build = build;
    this.studies = this.shapes.arrange(this.spec);
    this.innovs = this.build.adjacentStudies(this.spec, 'west');
  }

  drawSvg(g, geom, defs) {
    var a, a1, fill, h, i, key, lay, r0, ref, ref1, ref2, ref3, study, w, wedgeId, x, xr, xt, y, yl, yr, yt;
    lay = this.shapes.layout(geom, this.spec.column, this.shapes.size(this.studies), this.shapes.size(this.innovs));
    fill = this.shapes.toFill(this.spec, true);
    this.shapes.keyHole(g, lay.xc, lay.yc, lay.xk, lay.yk, lay.ro, lay.hk, fill, lay.stroke);
    yl = lay.yl;
    a1 = lay.a1;
    xr = lay.xr + lay.wr;
    yr = lay.yr;
    ref = this.studies;
    for (key in ref) {
      study = ref[key];
      fill = this.shapes.toFill(study);
      wedgeId = this.shapes.htmlId(study.name, 'Wedge');
      this.shapes.wedge(g, lay.ro, lay.rs, a1, a1 - lay.da, lay.xc, lay.yc, fill, study.name, wedgeId);
      for (a = i = ref1 = a1 - lay.li, ref2 = a1 - lay.da, ref3 = -lay.ds; ref3 !== 0 && (ref3 > 0 ? i < ref2 : i > ref2); a = i += ref3) {
        this.shapes.link(g, a, lay.ro, lay.ri, lay.xc, lay.yc, lay.xc, yl, xr, yl, fill, lay.thick);
        yl += lay.dl;
      }
      a1 -= lay.da;
      yr += lay.hr;
    }
    //@innovateStudies( g, lay )
    x = 0; // lay.xr+lay.wr
    r0 = lay.ri; // geom.x0/2 - 36
    y = geom.y0 - r0 / 2; // lay.yr
    w = lay.xr + lay.wr;
    h = r0; // lay.ri
    xt = x + w * 0.5;
    yt = geom.y0 * 0.5 - 6;
    this.shapes.conveySankey("Encourage", defs, g, this.studies, this.innovs, x, y, w, h);
    this.shapes.icon(g, geom.x0, geom.y0, this.spec.name, this.shapes.htmlId(this.spec.name, 'IconSvg'), Vis$2.unicode(this.spec.icon));
    this.shapes.text(g, xt, yt, this.spec.name, this.shapes.htmlId(this.spec.name, 'TextSvg'), 'black', '1.2em');
    this.shapes.practiceFlow(g, geom, this.spec);
  }

  // Not called but matches Sankey
  innovateStudies(g, lay) {
    var fill, innov, key, ref, yi;
    yi = lay.yi;
    ref = this.innovs;
    for (key in ref) {
      innov = ref[key];
      fill = this.shapes.toFill(innov);
      this.shapes.rect(g, lay.xi, yi, lay.wi, lay.hi, fill, lay.stroke);
      yi += lay.hi;
    }
  }

};

var Encourage$1 = Encourage;

var Connect;

Connect = class Connect {
  constructor(stream, build, prac, elem, size1) {
    this.stream = stream;
    this.build = build;
    this.prac = prac;
    this.elem = elem;
    this.size = size1;
    this.shapes = new Shapes$1(this.stream);
    this.ready();
  }

  createDraw() {
    switch (this.prac.column) {
      case 'Embrace':
        return new Embrace$1(this.prac, this.shapes, this.build);
      case 'Innovate':
        return new Innovate$1(this.prac, this.shapes, this.build);
      case 'Encourage':
        return new Encourage$1(this.prac, this.shapes, this.build);
      default:
        return new Innovate$1(this.prac, this.shapes, this.build);
    }
  }

  ready() {
    var gId, geo, svgId;
    geo = this.geom(this.size.elemWidth, this.size.elemHeight, this.size.elemWidth, this.size.elemHeight);
    this.graph = null;
    this.g = null;
    svgId = '';
    gId = '';
    this.defs = null;
    [this.graph, this.g, svgId, gId, this.defs] = this.shapes.createSvg(this.elem, this.prac.name, this.size.elemWidth, this.size.elemHeight);
    this.size.lastWidth = this.size.elemWidth;
    this.size.lastHeight = this.size.elemHeight;
    this.draw = this.createDraw();
    this.draw.drawSvg(this.g, geo, this.defs);
    this.htmlId = svgId;
  }

  lastSize(size) {
    this.size.lastWidth = size.elemWidth;
    return this.size.lastHeight = size.elemHeight;
  }

  layout(size, op) {
    var geo;
    // console.log( 'Connect.layout()', @prac.name, op, size );
    if (op === 'Expand') { // Zoom to the entire Comp size
      geo = this.geom(size.compWidth, size.compHeight, this.size.elemWidth, this.size.elemHeight);
      this.shapes.layoutSvg(this.graph, this.g, size.compWidth, size.compHeight, geo.sx, geo.sy);
    }
    if (op === 'Restore') { // @size is original while size is a reszize
      geo = this.geom(this.size.lastWidth, this.size.lastHeight, this.size.elemWidth, this.size.elemHeight);
      this.shapes.layoutSvg(this.graph, this.g, this.size.lastWidth, this.size.lastHeight, geo.sx, geo.sy);
    }
    if (op === 'Resize') { // @size is original while size is a reszize
      geo = this.geom(size.elemWidth, size.elemHeight, this.size.elemWidth, this.size.elemHeight);
      this.shapes.layoutSvg(this.graph, this.g, this.size.elemWidth, this.size.elemHeight, geo.sx, geo.sy);
    }
  }

  geom(compWidth, compHeight, elemWidth, elemHeight) {
    var g;
    g = {};
    [g.w, g.h] = [elemWidth, elemHeight];
    g.r = Math.min(g.w, g.h) * 0.2; // Use for hexagons
    g.x0 = g.w * 0.5;
    g.y0 = g.h * 0.5;
    g.sx = compWidth / g.w;
    g.sy = compHeight / g.h;
    g.s = Math.min(g.sx, g.sy);
    g.fontSize = '2em'; // @toVh( 5 )+'vh'
    g.iconSize = '2em'; // @toVh( 5 )+'vh'
    return g;
  }

  toFill(hsv) {
    return Vis.toRgbHsvStr(hsv);
  }

};

var Connect$1 = Connect;

//

var script = {

  data() {
    return { comp:'None', prac:'All', disp:'All', tab:'Connections',
             build:{}, connects:{}, practices:{} }; },

  methods: {
    isPrac: function (prac) {
      return this.prac===prac || this.prac==='All' },
    onPrac: function (prac) {
      if( prac==='All' && this.prac!=='All' ) {
        this.connects[this.prac].layout( this.size(this.prac), 'Restore'); }
      if( prac!=='All' && typeof(this.connects[prac])==='object' ) { // Expand prac to Comp size
        this.connects[prac].layout( this.size(prac), 'Expand'); }
      this.prac = prac; this.disp='All';  },
    onDisp: function (prac,disp) {
      this.prac = prac; this.disp=disp; },
    onNone: function (obj) {
      console.error( 'Conn Nav Error', { obj:obj } ); },
    onNav:  function (obj) {
      switch( obj.level ) {
        case 'Prac' : this.onPrac(obj.prac);          break;
        case 'Disp' : this.onDisp(obj.prac,obj.disp); break;
        default     : this.onNone(obj); } },
    onTabs: function (tab) {
      if( tab==='Connections' && this.tab==='Connections'  ) {
        this.onPrac('All'); }
      this.tab = tab; },
    pracDir: function(dir) {
      return this.prac==='All' ? dir : 'fullPracDir'; },
    pubPrac: function (prac) {
      this.publish( this.comp, { prac:prac, disp:'All' } ); },
    style: function( hsv ) {
      return { backgroundColor:this.toRgbaHsv(hsv) }; },
    
    size: function(prac) {
      let elem = this.$refs[prac][0];
      let sz   = {};
      if( typeof(this.$refs['Conn'])==='undefined' ) {
        console.log( 'Conn.size() $refs[Conn] undefined', this.$refs ); }
      sz.compWidth  = this.$refs['Conn']['clientWidth' ];
      sz.compHeight = this.$refs['Conn']['clientHeight'];
      sz.elemWidth  = elem['clientWidth' ];
      sz.elemHeight = elem['clientHeight'];
      // console.log( 'Conn.size()', prac, sz );
      return sz;
    },
    
    createConnects: function( stream, build ) {
      for( let key of this.pkeys ) {
          let prac = this.practices[key];
          if( prac.row !== 'Dim' ) {
            let elem = this.$refs[key][0];
            this.connects[prac.name] = new Connect$1( stream, build, prac, elem, this.size(key) ); } }
      return this.connects; },
    
    resize: function() {
      for( let key of this.pkeys ) {
        let size  = this.size(key);
        let level = key!==this.prac ? 'Resize' : 'Expand';
        if( level==='Expand') { this.connects[key].lastSize(size); }
        this.connects[key].layout( size, level ); } }
  },

  beforeMount: function() {
    this.comp = this.$route.name.substring(0,4); },
    //console.log( 'Conn.beforeMount()', this.$route.name, this.comp );

  mounted: function () {
    this.build     = new Build$1(  this.batch() );
    this.practices = this.conns( this.comp );
    this.pkeys     = this.keys(  this.practices );
    this.subscribe(  this.comp,  this.comp+'.vue', (obj) => {
      if( obj.disp==='All' ) {   this.onPrac(obj.prac); }
      else                   {   this.onDisp(obj.prac,obj.disp); } } );
    this.subscribe(  "Tabs",     this.comp+'.vue', (obj) => {
      this.onTabs(obj); } );
    this.subscribe(  "Nav",     this.comp+'.vue', (obj) => {
      this.onNav(obj); } );
    this.$nextTick( function() {
      this.connects  = this.createConnects( this.stream(), this.build );
      if( this.nav().queued ) {
        this.onNav( this.nav().que('Conn',false) ); } } ); },
  
  created: function () {
    window.addEventListener(   'resize', this.resize ); },
  destroyed: function () {
    window.removeEventListener('resize', this.resize ); }
 };

function normalizeComponent(template, style, script, scopeId, isFunctionalTemplate, moduleIdentifier
/* server only */
, shadowMode, createInjector, createInjectorSSR, createInjectorShadow) {
  if (typeof shadowMode !== 'boolean') {
    createInjectorSSR = createInjector;
    createInjector = shadowMode;
    shadowMode = false;
  } // Vue.extend constructor export interop.


  var options = typeof script === 'function' ? script.options : script; // render functions

  if (template && template.render) {
    options.render = template.render;
    options.staticRenderFns = template.staticRenderFns;
    options._compiled = true; // functional template

    if (isFunctionalTemplate) {
      options.functional = true;
    }
  } // scopedId


  if (scopeId) {
    options._scopeId = scopeId;
  }

  var hook;

  if (moduleIdentifier) {
    // server build
    hook = function hook(context) {
      // 2.3 injection
      context = context || // cached call
      this.$vnode && this.$vnode.ssrContext || // stateful
      this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext; // functional
      // 2.2 with runInNewContext: true

      if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
        context = __VUE_SSR_CONTEXT__;
      } // inject component styles


      if (style) {
        style.call(this, createInjectorSSR(context));
      } // register component module identifier for async chunk inference


      if (context && context._registeredComponents) {
        context._registeredComponents.add(moduleIdentifier);
      }
    }; // used by ssr in case component is cached and beforeCreate
    // never gets called


    options._ssrRegister = hook;
  } else if (style) {
    hook = shadowMode ? function () {
      style.call(this, createInjectorShadow(this.$root.$options.shadowRoot));
    } : function (context) {
      style.call(this, createInjector(context));
    };
  }

  if (hook) {
    if (options.functional) {
      // register for functional component in vue file
      var originalRender = options.render;

      options.render = function renderWithStyleInjection(h, context) {
        hook.call(context);
        return originalRender(h, context);
      };
    } else {
      // inject component registration as beforeCreate hook
      var existing = options.beforeCreate;
      options.beforeCreate = existing ? [].concat(existing, hook) : [hook];
    }
  }

  return script;
}

var normalizeComponent_1 = normalizeComponent;

var isOldIE = typeof navigator !== 'undefined' && /msie [6-9]\\b/.test(navigator.userAgent.toLowerCase());
function createInjector(context) {
  return function (id, style) {
    return addStyle(id, style);
  };
}
var HEAD = document.head || document.getElementsByTagName('head')[0];
var styles = {};

function addStyle(id, css) {
  var group = isOldIE ? css.media || 'default' : id;
  var style = styles[group] || (styles[group] = {
    ids: new Set(),
    styles: []
  });

  if (!style.ids.has(id)) {
    style.ids.add(id);
    var code = css.source;

    if (css.map) {
      // https://developer.chrome.com/devtools/docs/javascript-debugging
      // this makes source maps inside style tags work properly in Chrome
      code += '\n/*# sourceURL=' + css.map.sources[0] + ' */'; // http://stackoverflow.com/a/26603875

      code += '\n/*# sourceMappingURL=data:application/json;base64,' + btoa(unescape(encodeURIComponent(JSON.stringify(css.map)))) + ' */';
    }

    if (!style.element) {
      style.element = document.createElement('style');
      style.element.type = 'text/css';
      if (css.media) style.element.setAttribute('media', css.media);
      HEAD.appendChild(style.element);
    }

    if ('styleSheet' in style.element) {
      style.styles.push(code);
      style.element.styleSheet.cssText = style.styles.filter(Boolean).join('\n');
    } else {
      var index = style.ids.size - 1;
      var textNode = document.createTextNode(code);
      var nodes = style.element.childNodes;
      if (nodes[index]) style.element.removeChild(nodes[index]);
      if (nodes.length) style.element.insertBefore(textNode, nodes[index]);else style.element.appendChild(textNode);
    }
  }
}

var browser = createInjector;

/* script */
const __vue_script__ = script;

/* template */
var __vue_render__ = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c(
    "div",
    { ref: "Conn", staticClass: "conn", attrs: { id: "Conn" } },
    [
      _vm._l(_vm.practices, function(prac) {
        return [
          _c(
            "div",
            {
              directives: [
                {
                  name: "show",
                  rawName: "v-show",
                  value: _vm.isPrac(prac.name),
                  expression: "isPrac(prac.name)"
                }
              ],
              key: prac.name,
              ref: "Prac",
              refInFor: true,
              class: _vm.pracDir(prac.dir)
            },
            [
              _c("div", {
                ref: prac.name,
                refInFor: true,
                staticClass: "prac",
                staticStyle: { "background-color": "rgba(97,56,77,1.0)" },
                attrs: { id: prac.name },
                on: {
                  click: function($event) {
                    return _vm.pubPrac(prac.name)
                  }
                }
              })
            ]
          )
        ]
      })
    ],
    2
  )
};
var __vue_staticRenderFns__ = [];
__vue_render__._withStripped = true;

  /* style */
  const __vue_inject_styles__ = function (inject) {
    if (!inject) return
    inject("data-v-0f46ac3c_0", { source: ".theme-logo {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-menu {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-find {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-tocs {\n  background-color: black;\n  font-size: 2.5rem;\n}\n.theme-view {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-side {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-pref {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-foot {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-trak {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.conn {\n  position: absolute;\n  left: 0;\n  top: 5%;\n  right: 0;\n  bottom: 0;\n  font-size: 1.3rem;\n  background-color: black;\n  color: wheat;\n  display: grid;\n  grid-template-columns: 33.3fr 33.3fr 33.4fr;\n  grid-template-rows: 7fr 31fr 31fr 31fr;\n  grid-template-areas: \"tabs tabs tabs\" \"nw north ne\" \"west cen east\" \"sw south se\";\n  justify-items: center;\n  align-items: center;\n}\n.conn .tabs {\n  grid-area: tabs;\n  display: inline;\n  color: wheat;\n  font-size: 1.5rem;\n  justify-self: start;\n  align-self: center;\n  text-align: left;\n}\n.conn .nw {\n  display: grid;\n  grid-area: nw;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n}\n.conn .north {\n  display: grid;\n  grid-area: north;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n}\n.conn .ne {\n  display: grid;\n  grid-area: ne;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n}\n.conn .west {\n  display: grid;\n  grid-area: west;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n}\n.conn .cen {\n  display: grid;\n  grid-area: cen;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n}\n.conn .east {\n  display: grid;\n  grid-area: east;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n}\n.conn .sw {\n  display: grid;\n  grid-area: sw;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n}\n.conn .south {\n  display: grid;\n  grid-area: south;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n}\n.conn .se {\n  display: grid;\n  grid-area: se;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n}\n.conn .prac {\n  display: grid;\n  border-radius: 36px;\n  width: 99%;\n  height: 98%;\n  font-size: 2rem;\n  font-weight: bold;\n}\n.conn .prac .name {\n  justify-self: center;\n  align-self: center;\n  text-align: center;\n}\n.conn .fullPracDir {\n  position: absolute;\n  left: 3%;\n  top: 6%;\n  right: 3%;\n  bottom: 6%;\n  display: grid;\n}\n.conn .fullPracDir .prac {\n  font-size: 2.5rem;\n  width: 100%;\n  height: 100%;\n  justify-self: center;\n  align-self: center;\n  display: grid;\n  border-radius: 0.5em;\n}\n.conn .fullPracDir .prac div {\n  padding-bottom: 2rem;\n}\n.conn .fullPracDir .prac div .disp {\n  padding-bottom: 0;\n}\n.conn .fullPracDir .prac div .disp i {\n  font-size: 2.5rem;\n}\n.conn .fullPracDir .prac div .disp .name {\n  font-size: 2.5rem;\n}\n.conn .fullPracDir .prac div .disp .desc {\n  font-size: 2.5rem;\n  display: block;\n}\n.conn .fullPracDir .prac .area {\n  padding-bottom: 0;\n}\n", map: {"version":3,"sources":["Conn.vue","/Users/ax/Documents/prj/aug/vue/page/Conn.vue"],"names":[],"mappings":"AAAA;EACE,uBAAuB;EACvB,iBAAiB;AACnB;AACA;EACE,uBAAuB;EACvB,iBAAiB;AACnB;AACA;EACE,uBAAuB;EACvB,iBAAiB;AACnB;AACA;EACE,uBAAuB;EACvB,iBAAiB;AACnB;AACA;EACE,uBAAuB;EACvB,iBAAiB;AACnB;AACA;EACE,uBAAuB;EACvB,iBAAiB;AACnB;AACA;EACE,uBAAuB;EACvB,iBAAiB;AACnB;AACA;EACE,uBAAuB;EACvB,iBAAiB;AACnB;AACA;EACE,uBAAuB;EACvB,iBAAiB;AACnB;AACA;EACE,kBAAkB;EAClB,OAAO;EACP,OAAO;EACP,QAAQ;EACR,SAAS;EACT,iBAAiB;EACjB,uBAAuB;EACvB,YAAY;EACZ,aAAa;EACb,2CAA2C;EAC3C,sCAAsC;EACtC,iFAAiF;EACjF,qBAAqB;EACrB,mBAAmB;AACrB;AACA;EACE,eAAe;EACf,eAAe;EACf,YAAY;EACZ,iBAAiB;EACjB,mBAAmB;EACnB,kBAAkB;EAClB,gBAAgB;AAClB;AACA;EACE,aAAa;EACb,aAAa;EACb,qBAAqB;EACrB,mBAAmB;EACnB,qBAAqB;EACrB,mBAAmB;AACrB;AACA;EACE,aAAa;EACb,gBAAgB;EAChB,qBAAqB;EACrB,mBAAmB;EACnB,qBAAqB;EACrB,mBAAmB;AACrB;AACA;EACE,aAAa;EACb,aAAa;EACb,qBAAqB;EACrB,mBAAmB;EACnB,qBAAqB;EACrB,mBAAmB;AACrB;AACA;EACE,aAAa;EACb,eAAe;EACf,qBAAqB;EACrB,mBAAmB;EACnB,qBAAqB;EACrB,mBAAmB;AACrB;AACA;EACE,aAAa;EACb,cAAc;EACd,qBAAqB;EACrB,mBAAmB;EACnB,qBAAqB;EACrB,mBAAmB;AACrB;AACA;EACE,aAAa;EACb,eAAe;EACf,qBAAqB;EACrB,mBAAmB;EACnB,qBAAqB;EACrB,mBAAmB;AACrB;AACA;EACE,aAAa;EACb,aAAa;ECCf,qBAAA;EDCE,mBAAmB;ECCrB,qBAAA;EACA,mBAAA;ADCA;ACCA;EACA,aAAA;EDCE,gBAAgB;ECClB,qBAAA;EACA,mBAAA;EDCE,qBAAqB;ECCvB,mBAAA;AACA;ADCA;ECCA,aAAA;EACA,aAAA;EACA,qBAAA;EACA,mBAAA;EACA,qBAAA;EACA,mBAAA;AACA;AACA;EDCE,aAAa;ECCf,mBAAA;EACA,UAAA;EDCE,WAAW;ECCb,eAAA;EACA,iBAAA;AACA;AACA;EACA,oBAAA;EACA,kBAAA;EACA,kBAAA;AACA;AACA;EACA,kBAAA;EACA,QAAA;EDCE,OAAO;EACP,SAAS;EACT,UAAU;EACV,aAAa;AACf;AACA;EACE,iBAAiB;EACjB,WAAW;EACX,YAAY;EACZ,oBAAoB;EACpB,kBAAkB;EAClB,aAAa;EACb,oBAAoB;AACtB;AACA;EACE,oBAAoB;AACtB;AACA;EACE,iBAAiB;AACnB;AACA;EACE,iBAAiB;AACnB;AACA;EACE,iBAAiB;AACnB;AACA;EACE,iBAAiB;EACjB,cAAc;AAChB;AACA;EACE,iBAAiB;AACnB","file":"Conn.vue","sourcesContent":[".theme-logo {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-menu {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-find {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-tocs {\n  background-color: black;\n  font-size: 2.5rem;\n}\n.theme-view {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-side {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-pref {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-foot {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-trak {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.conn {\n  position: absolute;\n  left: 0;\n  top: 5%;\n  right: 0;\n  bottom: 0;\n  font-size: 1.3rem;\n  background-color: black;\n  color: wheat;\n  display: grid;\n  grid-template-columns: 33.3fr 33.3fr 33.4fr;\n  grid-template-rows: 7fr 31fr 31fr 31fr;\n  grid-template-areas: \"tabs tabs tabs\" \"nw north ne\" \"west cen east\" \"sw south se\";\n  justify-items: center;\n  align-items: center;\n}\n.conn .tabs {\n  grid-area: tabs;\n  display: inline;\n  color: wheat;\n  font-size: 1.5rem;\n  justify-self: start;\n  align-self: center;\n  text-align: left;\n}\n.conn .nw {\n  display: grid;\n  grid-area: nw;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n}\n.conn .north {\n  display: grid;\n  grid-area: north;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n}\n.conn .ne {\n  display: grid;\n  grid-area: ne;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n}\n.conn .west {\n  display: grid;\n  grid-area: west;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n}\n.conn .cen {\n  display: grid;\n  grid-area: cen;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n}\n.conn .east {\n  display: grid;\n  grid-area: east;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n}\n.conn .sw {\n  display: grid;\n  grid-area: sw;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n}\n.conn .south {\n  display: grid;\n  grid-area: south;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n}\n.conn .se {\n  display: grid;\n  grid-area: se;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n}\n.conn .prac {\n  display: grid;\n  border-radius: 36px;\n  width: 99%;\n  height: 98%;\n  font-size: 2rem;\n  font-weight: bold;\n}\n.conn .prac .name {\n  justify-self: center;\n  align-self: center;\n  text-align: center;\n}\n.conn .fullPracDir {\n  position: absolute;\n  left: 3%;\n  top: 6%;\n  right: 3%;\n  bottom: 6%;\n  display: grid;\n}\n.conn .fullPracDir .prac {\n  font-size: 2.5rem;\n  width: 100%;\n  height: 100%;\n  justify-self: center;\n  align-self: center;\n  display: grid;\n  border-radius: 0.5em;\n}\n.conn .fullPracDir .prac div {\n  padding-bottom: 2rem;\n}\n.conn .fullPracDir .prac div .disp {\n  padding-bottom: 0;\n}\n.conn .fullPracDir .prac div .disp i {\n  font-size: 2.5rem;\n}\n.conn .fullPracDir .prac div .disp .name {\n  font-size: 2.5rem;\n}\n.conn .fullPracDir .prac div .disp .desc {\n  font-size: 2.5rem;\n  display: block;\n}\n.conn .fullPracDir .prac .area {\n  padding-bottom: 0;\n}\n","\n<template>\n  <div id=\"Conn\" class=\"conn\" ref=\"Conn\">\n    <template v-for=\"prac in practices\">\n      <div v-show=\"isPrac(prac.name)\" ref=\"Prac\" :class=\"pracDir(prac.dir)\" :key=\"prac.name\">\n        <div :id=\"prac.name\" :ref=\"prac.name\" class=\"prac\"\n          @click=\"pubPrac(prac.name)\" style=\"background-color:rgba(97,56,77,1.0)\">\n        </div>\n      </div>\n    </template>\n  </div>\n</template>\n\n<script type=\"module\">\n  \n  import Build   from '../../pub/ikw/cube/Build.js';\n  import Connect from '../../pub/ikw/conn/Connect.js';\n\n  export default {\n\n    data() {\n      return { comp:'None', prac:'All', disp:'All', tab:'Connections',\n               build:{}, connects:{}, practices:{} }; },\n\n    methods: {\n      isPrac: function (prac) {\n        return this.prac===prac || this.prac==='All' },\n      onPrac: function (prac) {\n        if( prac==='All' && this.prac!=='All' ) {\n          this.connects[this.prac].layout( this.size(this.prac), 'Restore'); }\n        if( prac!=='All' && typeof(this.connects[prac])==='object' ) { // Expand prac to Comp size\n          this.connects[prac].layout( this.size(prac), 'Expand'); }\n        this.prac = prac; this.disp='All';  },\n      onDisp: function (prac,disp) {\n        this.prac = prac; this.disp=disp; },\n      onNone: function (obj) {\n        console.error( 'Conn Nav Error', { obj:obj } ); },\n      onNav:  function (obj) {\n        switch( obj.level ) {\n          case 'Prac' : this.onPrac(obj.prac);          break;\n          case 'Disp' : this.onDisp(obj.prac,obj.disp); break;\n          default     : this.onNone(obj); } },\n      onTabs: function (tab) {\n        if( tab==='Connections' && this.tab==='Connections'  ) {\n          this.onPrac('All'); }\n        this.tab = tab; },\n      pracDir: function(dir) {\n        return this.prac==='All' ? dir : 'fullPracDir'; },\n      pubPrac: function (prac) {\n        this.publish( this.comp, { prac:prac, disp:'All' } ); },\n      style: function( hsv ) {\n        return { backgroundColor:this.toRgbaHsv(hsv) }; },\n      \n      size: function(prac) {\n        let elem = this.$refs[prac][0]\n        let sz   = {}\n        if( typeof(this.$refs['Conn'])==='undefined' ) {\n          console.log( 'Conn.size() $refs[Conn] undefined', this.$refs ) }\n        sz.compWidth  = this.$refs['Conn']['clientWidth' ];\n        sz.compHeight = this.$refs['Conn']['clientHeight'];\n        sz.elemWidth  = elem['clientWidth' ];\n        sz.elemHeight = elem['clientHeight'];\n        // console.log( 'Conn.size()', prac, sz );\n        return sz;\n      },\n      \n      createConnects: function( stream, build ) {\n        for( let key of this.pkeys ) {\n            let prac = this.practices[key];\n            if( prac.row !== 'Dim' ) {\n              let elem = this.$refs[key][0]\n              this.connects[prac.name] = new Connect( stream, build, prac, elem, this.size(key) ); } }\n        return this.connects; },\n      \n      resize: function() {\n        for( let key of this.pkeys ) {\n          let size  = this.size(key);\n          let level = key!==this.prac ? 'Resize' : 'Expand';\n          if( level==='Expand') { this.connects[key].lastSize(size) }\n          this.connects[key].layout( size, level ); } }\n    },\n\n    beforeMount: function() {\n      this.comp = this.$route.name.substring(0,4); },\n      //console.log( 'Conn.beforeMount()', this.$route.name, this.comp );\n\n    mounted: function () {\n      this.build     = new Build(  this.batch() );\n      this.practices = this.conns( this.comp );\n      this.pkeys     = this.keys(  this.practices )\n      this.subscribe(  this.comp,  this.comp+'.vue', (obj) => {\n        if( obj.disp==='All' ) {   this.onPrac(obj.prac); }\n        else                   {   this.onDisp(obj.prac,obj.disp); } } );\n      this.subscribe(  \"Tabs\",     this.comp+'.vue', (obj) => {\n        this.onTabs(obj); } );\n      this.subscribe(  \"Nav\",     this.comp+'.vue', (obj) => {\n        this.onNav(obj); } );\n      this.$nextTick( function() {\n        this.connects  = this.createConnects( this.stream(), this.build );\n        if( this.nav().queued ) {\n          this.onNav( this.nav().que('Conn',false) ); } } ) },\n    \n    created: function () {\n      window.addEventListener(   'resize', this.resize ) },\n    destroyed: function () {\n      window.removeEventListener('resize', this.resize ) }\n   }\n\n</script>\n\n<style lang=\"less\">\n  \n  @import '../../pub/css/themes/theme.less';\n  \n  .grid5x4() { display:grid; grid-template-columns:7fr 31fr 31fr 31fr; grid-template-rows:7fr 12fr 27fr 27fr 27fr;\n    grid-template-areas: \"tabs tabs tabs tabs\" \"cm em in en\" \"le nw north ne\" \"do west cen east\" \"sh sw south se\"; }\n\n  .grid4x4() { display:grid; grid-template-columns:7fr 31fr 31fr 31fr; grid-template-rows:7fr 31fr 31fr 31fr;\n    grid-template-areas: \"tabs tabs tabs tabs\" \"le nw north ne\" \"do west cen east\" \"sh sw south se\"; }\n\n  .grid4x3() { display:grid; grid-template-columns:33.3fr 33.3fr 33.4fr; grid-template-rows:7fr 31fr 31fr 31fr;\n    grid-template-areas: \"tabs tabs tabs\" \"nw north ne\" \"west cen east\" \"sw south se\"; }\n  \n  .pdir( @dir ) { display:grid; grid-area:@dir; justify-self:stretch; align-self:stretch;\n    justify-items:center; align-items:center; }\n  \n  .conn { position:absolute; left:0; top:5%; right:0; bottom:0; font-size:@theme-conn-size;\n          background-color:@theme-back; color:@theme-color;\n    .grid4x3(); justify-items:center; align-items:center; // The 5x4 Tabs + Dim + Per + 9 Practices Grid\n    .tabs{ grid-area:tabs; display:inline; color:@theme-color; font-size:@theme-tab-size;\n      justify-self:start; align-self:center; text-align:left; }\n    .nw   { .pdir(nw);   } .north { .pdir(north); } .ne   { .pdir(ne);   }\n    .west { .pdir(west); } .cen   { .pdir(cen);   } .east { .pdir(east); }\n    .sw   { .pdir(sw);   } .south { .pdir(south); } .se   { .pdir(se);   }\n    \n    .prac { display:grid; border-radius:36px; width:99%; height:98%; font-size:@theme-prac-size; font-weight:bold;\n      .name { justify-self:center; align-self:center; text-align:center; } }\n  \n    // Placed one level above .prac at the 9 Practices Grid Direction\n    .fullPracDir { position:absolute; left:3%; top:6%; right:3%; bottom:6%; display:grid;\n      .prac { font-size:@theme-full-size; width:100%; height:100%;\n        justify-self:center; align-self:center; display:grid; border-radius:0.5em;\n        div {     padding-bottom:2rem;\n          .disp { padding-bottom:0;\n            i     { font-size:@theme-full-size; }\n            .name { font-size:@theme-full-size; }\n            .desc { font-size:@theme-full-size; display:block; } } }  // Turns on .disp .desc\n        .area { padding-bottom:0; } } }\n  }\n</style>"]}, media: undefined });

  };
  /* scoped */
  const __vue_scope_id__ = undefined;
  /* module identifier */
  const __vue_module_identifier__ = undefined;
  /* functional template */
  const __vue_is_functional_template__ = false;
  /* style inject SSR */
  

  
  var Conn = normalizeComponent_1(
    { render: __vue_render__, staticRenderFns: __vue_staticRenderFns__ },
    __vue_inject_styles__,
    __vue_script__,
    __vue_scope_id__,
    __vue_is_functional_template__,
    __vue_module_identifier__,
    browser,
    undefined
  );

export default Conn;
