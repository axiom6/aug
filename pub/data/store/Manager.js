var Manager;

import Data from '../appl/Data.js';

import Store from '../../base/store/Store.js';

import Memory from '../../base/store/Memory.js';

import Local from '../../base/store/Local.js';

import Index from '../../base/store/Index.js';

import Pouch from '../../base/store/Pouch.js';

//mport Fire from '../../base/store/Fire.js'
Manager = class Manager {
  constructor() {
    var index, local, memory, pouch;
    //ire    = new Fire()
    this.onSubscribe = this.onSubscribe.bind(this);
    this.dbName = 'Test';
    this.tables;
    this.mix = Data.mix;
    this.stream = Data.stream;
    memory = new Memory();
    local = new Local();
    index = new Index();
    pouch = new Pouch();
  }

  onSubscribe(obj) {
    console.log('Mgr', obj);
  }

  subscribes(table, store) {
    var i, len, op, ref, results;
    ref = Store.allOps;
    results = [];
    for (i = 0, len = ref.length; i < len; i++) {
      op = ref[i];
      results.push(store.subscribe(table, op, store.source, this.onSubscribe));
    }
    return results;
  }

  suite(store, table, id, obj, objs) {
    subscribes(table, store);
    store.add(table, id, obj);
    store.get(table, id);
    store.put(table, id, obj);
    store.del(table, id);
    store.insert(table, objs);
    store.select(table);
    store.update(table, objs);
    store.remove(table);
  }

};

export default Manager;
