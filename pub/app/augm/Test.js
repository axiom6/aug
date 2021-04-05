var Test;

import Stream from '../../base/util/Stream.js';

import Fire from '../../base/store/Fire.js';

import Index from '../../base/store/Index.js';

import Pipe from '../../base/store/Pipe.js';

import Store from '../../base/store/Store.js';

Test = class Test {
  constructor() {
    var streamLog, subjects;
    this.dbName = 'Prac';
    this.url = 'http://localhost:63342/aug/pub/app/data/';
    this.tables = {
      Prac: {}
    };
    subjects = ["Prac:Prac:select"];
    streamLog = {
      subscribe: false,
      publish: false,
      subjects: subjects
    };
    this.stream = new Stream(subjects, streamLog);
    this.store = new Store(this.dbName, this.tables, this.url);
    this.store.fire = new Fire(this.store);
    this.store.pipe = new Pipe(this.stream, this.dbName);
    //store.rest   = new Rest(   @store )
    //store.local  = new Local(  @store )
    //store.memory = new Memory( @store )
    //@testShow()
    //testInit()
    this.testFire();
  }

  testFire() {
    var onGet;
    // onInsert = (results) =>
    //   console.log( 'Fire pipe insert', results )
    // @store.subscribe( "Prac", "insert", 'testFire', onInsert )
    // @store.insert( 'Prac', @prac() )

    // onSelect = (results) =>
    //   console.log(  'Fire pipe select', results )
    // @store.subscribe( "Prac", "select", 'testFire', onSelect )
    // where = (obj) -> obj.row is 'Do'
    // @store.select( 'fire', 'Prac', where )
    onGet = (results) => {
      return console.log('Fire pipe get', results);
    };
    this.store.subscribe("Prac", "get", 'testFire', onGet);
    this.store.get('fire', 'Prac', 'Nature');
  }

  async testInit() {
    var error;
    try {
      this.store.index = new Index(this.store);
      await this.store.index.initDB();
      this.testIndex();
    } catch (error1) {
      error = error1;
      console.error('Store.Test', error);
    }
  }

  testIndex() {
    var onAdd, onDel, onGet, onInsert, onPut, onRemove, onSelect, onUpdate, where;
    onInsert = (results) => {
      return console.log('testIndex pipe insert', results);
    };
    this.store.subscribe("Prac", "insert", 'testIndex', onInsert);
    this.store.insert('Prac', this.prac());
    onUpdate = (results) => {
      return console.log('testIndex pipe update', results);
    };
    this.store.subscribe("Prac", "update", 'testIndex', onUpdate);
    this.store.update('Prac', this.pracUpdate());
    onRemove = (results) => {
      return console.log('testIndex pipe remove', results);
    };
    this.store.subscribe("Prac", "remove", 'testIndex', onRemove);
    where = function(obj) {
      return obj.row === 'Do';
    };
    this.store.remove('Prac', where);
    onSelect = (results) => {
      return console.log('testIndex select', results);
    };
    this.store.subscribe("Prac", "select", 'testIndex', onSelect);
    where = function(obj) {
      return true;
    };
    this.store.select('index', 'Prac', where);
    onAdd = (obj) => {
      return console.log('testIndex pipe add', obj);
    };
    this.store.subscribe("Prac", "add", 'testIndex', onAdd);
    this.store.add('Prac', 'Unite', this.pracAdd());
    onGet = (result) => {
      return console.log('testIndex get', result);
    };
    this.store.subscribe("Prac", "get", 'testIndex', onGet);
    this.store.get('index', 'Prac', 'Unite');
    onPut = (obj) => {
      return console.log('testIndex pipe put', obj);
    };
    this.store.subscribe("Prac", "put", 'testIndex', onPut);
    this.store.put('Prac', 'Discover', this.pracPut());
    onDel = (id) => {
      return console.log('testIndex pipe del', id);
    };
    this.store.subscribe("Prac", "del", 'testIndex', onDel);
    this.store.del('Prac', 'Change');
    this.store.subscribe("Prac", "select", 'testIndex', onSelect);
    where = function(obj) {
      return true;
    };
    this.store.select('index', 'Prac', where);
  }

  testRest() {
    var callback;
    callback = (result) => {
      // @store.tables['Prac'] = result
      return console.log('testRest result', result);
    };
    this.store.rest.get('table', 'id', 'store/Prac.json', callback);
  }

  testStore() {}

  testMemory() {}

  testLocal() {}

  testPipe() {}

  prac() {
    var str;
    str = ` {
  "Collab":{"column":"Embrace","row":"Learn","plane":"Information","icon":"fa-group","id":"Collab"},
  "Domain":{"column":"Innovate","row":"Learn","plane":"Information","icon":"fa-empire","id":"Domain"},
  "Discover":{"column":"Encourage","row":"Learn","plane":"Information","icon":"fa-external-link-square","id":"Discover"},
  "Adapt":{"column":"Embrace","row":"Do","plane":"Information","icon":"fa-spinner","id":"Adapt"},
  "Tech":{"column":"Innovate","row":"Do","plane":"Information","icon":"fa-wrench","id":"Tech"},
  "Benefit":{"column":"Encourage","row":"Do","plane":"Information","icon":"fa-bar-chart-o","id":"Benefit"},
  "Change":{"column":"Embrace","row":"Share","plane":"Information","icon":"fa-refresh","id":"Change"},
  "Deliver":{"column":"Innovate","row":"Share","plane":"Information","icon":"fa-medkit","id":"Deliver"},
  "Govern":{"column":"Encourage","row":"Share","plane":"Information","icon":"fa-compass","id":"Govern"},
  "Humanity":{"column":"Embrace","row":"Learn","plane":"Knowledge","icon":"fa-question-circle","id":"Humanity"},
  "Science":{"column":"Innovate","row":"Learn","plane":"Knowledge","icon":"fa-flask","id":"Science"},
  "Understand":{"column":"Encourage","row":"Learn","plane":"Knowledge","icon":"fa-tripadvisor","id":"Understand"},
  "Conduct":{"column":"Embrace","row":"Do","plane":"Knowledge","icon":"fa-magic","id":"Conduct"},
  "Cognition":{"column":"Innovate","row":"Do","plane":"Knowledge","icon":"fa-object-group","id":"Cognition"},
  "Reason":{"column":"Encourage","row":"Do","plane":"Knowledge","icon":"fa-connectdevelop","id":"Reason"},
  "Evolve":{"column":"Embrace","row":"Share","plane":"Knowledge","icon":"fa-language","id":"Evolve"},
  "Educate":{"column":"Innovate","row":"Share","plane":"Knowledge","icon":"fa-graduation-cap","id":"Educate"},
  "Culture":{"column":"Encourage","row":"Share","plane":"Knowledge","icon":"fa-user-plus","id":"Culture"},
  "Trust":{"column":"Embrace","row":"Learn","plane":"Wisdom","icon":"fa-github-square","id":"Trust"},
  "Nature":{"column":"Innovate","row":"Learn","plane":"Wisdom","icon":"fa-paint-brush","id":"Nature"},
  "Truth":{"column":"Encourage","row":"Learn","plane":"Wisdom","icon":"fa-lightbulb-o","id":"Truth"},
  "Experience":{"column":"Embrace","row":"Do","plane":"Wisdom","icon":"fa-history","id":"Experience"},
  "Create":{"column":"Innovate","row":"Do","plane":"Wisdom","icon":"fa-eye","id":"Create"},
  "Conscious":{"column":"Encourage","row":"Do","plane":"Wisdom","icon":"fa-connectdevelop","id":"Conscious"},
  "Emerge":{"column":"Embrace","row":"Share","plane":"Wisdom","icon":"fa-dropbox","id":"Emerge"},
  "Inspire":{"column":"Innovate","row":"Share","plane":"Wisdom","icon":"fa-fire","id":"Inspire"},
  "Actualize":{"column":"Encourage","row":"Share","plane":"Wisdom","icon":"fa-codepen","id":"Actualize"}
} `;
    return JSON.parse(str);
  }

  pracUpdate() {
    var str;
    str = ` {
"Collab":{"column":"Embrace", "row":"Learn","plane":"Knowledge","icon":"fa-group", "id":"Collab"},
"Domain":{"column":"Innovate","row":"Learn","plane":"Knowledge","icon":"fa-empire","id":"Domain"} } `;
    return JSON.parse(str);
  }

  pracAdd() {
    var str;
    str = ` { "column":"Embrace", "row":"Learn","plane":"Knowledge","icon":"fa-group", "id":"Unite" } `;
    return JSON.parse(str);
  }

  pracPut() {
    var str;
    str = ` {"column":"Encourage","row":"Learn","plane":"Wisdom","icon":"fa-external-link-square","id":"Discover"} `;
    return JSON.parse(str);
  }

  batchObjs() {
    return {
      Math: {
        src: 'rest',
        url: 'augm/Math.json',
        table: 'Math',
        result: null
      },
      Geom: {
        src: 'rest',
        url: 'augm/Geom.json',
        table: 'Geom',
        result: null
      },
      Data: {
        src: 'rest',
        url: 'augm/Data.json',
        table: 'Data',
        result: null
      }
    };
  }

};

export default Test;
