var TestStore;

import Stream from '../util/Stream.js';

import Rest from '../store/Rest.js';

import Memory from '../store/Memory.js';

import Pipe from '../store/Pipe.js';

import Store from '../store/Store.js';

TestStore = class TestStore {
  constructor() {
    var streamLog, subjects;
    this.dbName = 'Prac';
    this.url = 'http://localhost:63342/aug/pub/app/data/store/Prac.json';
    this.tables = {};
    subjects = ["Data"];
    streamLog = {
      subscribe: false,
      publish: false,
      subjects: subjects
    };
    this.stream = new Stream(subjects, streamLog);
    this.store = new Store(this.dbName, this.tables, this.url);
    this.store.rest = new Rest(this.store);
    //store.fire   = new Fire(   @store, {} )
    //store.index  = new Index(  @store )
    //store.local  = new Local(  @store )
    this.store.memory = new Memory(this.store);
    this.store.pipe = new Pipe(this.stream, this.dbName);
  }

  testRest() {
    var callback;
    callback = function(result) {
      return console.log('testRest result', result);
    };
    this.store.rest.get('table', 'id', callback);
  }

  testMemory() {}

  testIndex() {}

  testLocal() {}

  testPipe() {}

  testFire() {}

};

export default TestStore;
