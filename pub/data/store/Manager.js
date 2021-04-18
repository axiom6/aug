var Manager;

import Data from '../appl/Data.js';

import Store from '../../base/store/Store.js';

import Memory from '../../base/store/Memory.js';

import Local from '../../base/store/Local.js';

import Index from '../../base/store/Index.js';

import Pouch from '../../base/store/Pouch.js';

import Fire from '../../base/store/Fire.js';

import Rest from '../../base/store/Rest.js';

Manager = class Manager {
  constructor() {
    this.onSubscribe = this.onSubscribe.bind(this);
    this.dbName = 'Test';
    this.tables;
    this.mix = Data.mix;
    this.stream = Data.stream;
  }

  test(name) {
    var id, obj, objs, store, table;
    store = (function() {
      switch (name) {
        case 'Local':
          return new Local();
        case 'Index':
          return new Index();
        case 'Pouch':
          return new Pouch();
        case 'Fire':
          return new Fire();
        case 'Rest':
          return new Rest();
        default:
          return new Memory();
      }
    })();
    id = 'Involve';
    table = 'Prac';
    obj = {
      id: "Involve",
      type: "pane",
      "hsv": [195, 90, 60],
      "column": "Embrace",
      "row": "Learn",
      "plane": "Know",
      "icon": "fas fa-users",
      "cells": [5, 12, 7, 12],
      "dir": "nw",
      "neg": "Greed"
    };
    objs = this.mix.inovObject('Info', 'Info');
    this.suite(store, table, id, obj, objs);
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
