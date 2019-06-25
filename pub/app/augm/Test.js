var Test;

import Stream from '../../bas/util/Stream.js';

import Index from '../../bas/store/Index.js';

import Pipe from '../../bas/store/Pipe.js';

import Store from '../../bas/store/Store.js';

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
    //store.rest   = new Rest(   @store )
    //store.fire   = new Fire(   @store, {} )
    //store.local  = new Local(  @store )
    //store.memory = new Memory( @store )
    this.store.pipe = new Pipe(this.stream, this.dbName);
    //@testShow()
    this.testInit();
  }

  async testInit() {
    var error;
    try {
      this.store.index = new Index(this.store);
      await this.store.index.initDB();
      return this.testIndex();
    } catch (error1) {
      error = error1;
      return console.error('Store.Test', error);
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
    this.store.subscribe("Prac", "select1", 'testIndex', onSelect);
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
    return this.store.select('index', 'Prac', where);
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

  testFire() {}

  prac() {
    var str;
    str = " {\n  \"Collab\":{\"column\":\"Embrace\",\"row\":\"Learn\",\"plane\":\"Information\",\"icon\":\"fa-group\",\"id\":\"Collab\"},\n  \"Domain\":{\"column\":\"Innovate\",\"row\":\"Learn\",\"plane\":\"Information\",\"icon\":\"fa-empire\",\"id\":\"Domain\"},\n  \"Discover\":{\"column\":\"Encourage\",\"row\":\"Learn\",\"plane\":\"Information\",\"icon\":\"fa-external-link-square\",\"id\":\"Discover\"},\n  \"Adapt\":{\"column\":\"Embrace\",\"row\":\"Do\",\"plane\":\"Information\",\"icon\":\"fa-spinner\",\"id\":\"Adapt\"},\n  \"Tech\":{\"column\":\"Innovate\",\"row\":\"Do\",\"plane\":\"Information\",\"icon\":\"fa-wrench\",\"id\":\"Tech\"},\n  \"Benefit\":{\"column\":\"Encourage\",\"row\":\"Do\",\"plane\":\"Information\",\"icon\":\"fa-bar-chart-o\",\"id\":\"Benefit\"},\n  \"Change\":{\"column\":\"Embrace\",\"row\":\"Share\",\"plane\":\"Information\",\"icon\":\"fa-refresh\",\"id\":\"Change\"},\n  \"Deliver\":{\"column\":\"Innovate\",\"row\":\"Share\",\"plane\":\"Information\",\"icon\":\"fa-medkit\",\"id\":\"Deliver\"},\n  \"Govern\":{\"column\":\"Encourage\",\"row\":\"Share\",\"plane\":\"Information\",\"icon\":\"fa-compass\",\"id\":\"Govern\"},\n  \"Humanity\":{\"column\":\"Embrace\",\"row\":\"Learn\",\"plane\":\"Knowledge\",\"icon\":\"fa-question-circle\",\"id\":\"Humanity\"},\n  \"Science\":{\"column\":\"Innovate\",\"row\":\"Learn\",\"plane\":\"Knowledge\",\"icon\":\"fa-flask\",\"id\":\"Science\"},\n  \"Understand\":{\"column\":\"Encourage\",\"row\":\"Learn\",\"plane\":\"Knowledge\",\"icon\":\"fa-tripadvisor\",\"id\":\"Understand\"},\n  \"Conduct\":{\"column\":\"Embrace\",\"row\":\"Do\",\"plane\":\"Knowledge\",\"icon\":\"fa-magic\",\"id\":\"Conduct\"},\n  \"Cognition\":{\"column\":\"Innovate\",\"row\":\"Do\",\"plane\":\"Knowledge\",\"icon\":\"fa-object-group\",\"id\":\"Cognition\"},\n  \"Reason\":{\"column\":\"Encourage\",\"row\":\"Do\",\"plane\":\"Knowledge\",\"icon\":\"fa-connectdevelop\",\"id\":\"Reason\"},\n  \"Evolve\":{\"column\":\"Embrace\",\"row\":\"Share\",\"plane\":\"Knowledge\",\"icon\":\"fa-language\",\"id\":\"Evolve\"},\n  \"Educate\":{\"column\":\"Innovate\",\"row\":\"Share\",\"plane\":\"Knowledge\",\"icon\":\"fa-graduation-cap\",\"id\":\"Educate\"},\n  \"Culture\":{\"column\":\"Encourage\",\"row\":\"Share\",\"plane\":\"Knowledge\",\"icon\":\"fa-user-plus\",\"id\":\"Culture\"},\n  \"Trust\":{\"column\":\"Embrace\",\"row\":\"Learn\",\"plane\":\"Wisdom\",\"icon\":\"fa-github-square\",\"id\":\"Trust\"},\n  \"Nature\":{\"column\":\"Innovate\",\"row\":\"Learn\",\"plane\":\"Wisdom\",\"icon\":\"fa-paint-brush\",\"id\":\"Nature\"},\n  \"Truth\":{\"column\":\"Encourage\",\"row\":\"Learn\",\"plane\":\"Wisdom\",\"icon\":\"fa-lightbulb-o\",\"id\":\"Truth\"},\n  \"Experience\":{\"column\":\"Embrace\",\"row\":\"Do\",\"plane\":\"Wisdom\",\"icon\":\"fa-history\",\"id\":\"Experience\"},\n  \"Create\":{\"column\":\"Innovate\",\"row\":\"Do\",\"plane\":\"Wisdom\",\"icon\":\"fa-eye\",\"id\":\"Create\"},\n  \"Conscious\":{\"column\":\"Encourage\",\"row\":\"Do\",\"plane\":\"Wisdom\",\"icon\":\"fa-connectdevelop\",\"id\":\"Conscious\"},\n  \"Emerge\":{\"column\":\"Embrace\",\"row\":\"Share\",\"plane\":\"Wisdom\",\"icon\":\"fa-dropbox\",\"id\":\"Emerge\"},\n  \"Inspire\":{\"column\":\"Innovate\",\"row\":\"Share\",\"plane\":\"Wisdom\",\"icon\":\"fa-fire\",\"id\":\"Inspire\"},\n  \"Actualize\":{\"column\":\"Encourage\",\"row\":\"Share\",\"plane\":\"Wisdom\",\"icon\":\"fa-codepen\",\"id\":\"Actualize\"}\n} ";
    return JSON.parse(str);
  }

  pracUpdate() {
    var str;
    str = " {\n\"Collab\":{\"column\":\"Embrace\", \"row\":\"Learn\",\"plane\":\"Knowledge\",\"icon\":\"fa-group\", \"id\":\"Collab\"},\n\"Domain\":{\"column\":\"Innovate\",\"row\":\"Learn\",\"plane\":\"Knowledge\",\"icon\":\"fa-empire\",\"id\":\"Domain\"} } ";
    return JSON.parse(str);
  }

  pracAdd() {
    var str;
    str = " { \"column\":\"Embrace\", \"row\":\"Learn\",\"plane\":\"Knowledge\",\"icon\":\"fa-group\", \"id\":\"Unite\" } ";
    return JSON.parse(str);
  }

  pracPut() {
    var str;
    str = " {\"column\":\"Encourage\",\"row\":\"Learn\",\"plane\":\"Wisdom\",\"icon\":\"fa-external-link-square\",\"id\":\"Discover\"} ";
    return JSON.parse(str);
  }

  batchObjs() {
    return {
      Math: {
        src: 'rest',
        url: 'augm/Math.json',
        table: 'Math',
        data: null
      },
      Geom: {
        src: 'rest',
        url: 'augm/Geom.json',
        table: 'Geom',
        data: null
      },
      Data: {
        src: 'rest',
        url: 'augm/Data.json',
        table: 'Data',
        data: null
      }
    };
  }

};

export default Test;
