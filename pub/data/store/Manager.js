var Manager;

import Memory from '../../../lib/pub/data/Memory.js';

import Local from '../../../lib/pub/data/Local.js';

import Index from '../../../lib/pub/data/Index.js';

import Fire from '../../../lib/pub/data/Fire.js';

import Couch from '../../../lib/pub/data/Couch.js';

Manager = class Manager {
  constructor(mix) {
    this.subscribe = this.subscribe.bind(this);
    this.mix = mix;
    this.dbName = 'test1';
    this.credsUrl = 'http://admin:athena@127.0.0.1:5984'; // Admin host to couchdb
    this.couchUrl = 'http://127.0.0.1:5984'; // Admin host to couchdb
    this.stream = this.mix.stream();
    this.Prac = null;
    this.Hues = null;
    this.Kit = null;
    this.source = null;
  }

  test(name) {
    this.store = (function() {
      switch (name) {
        case 'Local':
          return new Local(this.stream, this.dbName);
        case 'Index':
          return new Index(this.stream, this.dbName);
        case 'Fire':
          return new Fire(this.stream, this.dbName);
        case 'Couch':
          return new Couch(this.stream, this.dbName, this.couchUrl);
        case 'Memory':
          return new Memory(this.stream, this.dbName);
        default:
          console.error('Manager.test() unknown name', name);
          return null;
      }
    }).call(this);
    this.source = this.store.source;
    this.store.openTable('Prac');
    this.store.openTable('Hues');
    if (name === 'Index') {
      this.openIndex(this.store);
    }
    if (name !== 'Index') {
      this.suite();
    }
  }

  openIndex(idb) {
    idb.openDB(idb.dbName, idb.dbVersion).then((db) => {
      idb.db = db;
      this.suite(idb);
    }).catch((error) => {
      idb.onerror(idb.tables, 'openDB', error);
    });
  }

  subscribe(table, op) {
    var onSubscribe;
    onSubscribe = (obj) => {
      var whereD, whereS;
      console.log('Mgr', {
        table: table,
        op: op,
        source: this.source,
        obj: obj
      });
      whereS = function(obj) {
        return true;
      };
      whereD = function(obj) {
        return obj.column === 'Embrace';
      };
      switch (op) {
        case 'add':
          return this.store.get(table, obj.id);
        case 'put':
          return this.store.del(table, obj.id);
        case 'insert':
          return this.store.select(table, whereS);
        case 'update':
          return this.store.remove(table, whereD);
      }
    };
    this.store.subscribe(table, op, this.store.source, onSubscribe);
  }

  suite() {
    console.log('Manager.suite()', this.store.source);
    this.data();
    this.subscribe('Prac', 'add');
    this.subscribe('Prac', 'get');
    this.subscribe('Prac', 'put');
    this.subscribe('Prac', 'del');
    this.subscribe('Hues', 'insert');
    this.subscribe('Hues', 'select');
    this.subscribe('Hues', 'update');
    this.subscribe('Hues', 'remove');
    this.subscribe('Tables', 'show');
    this.subscribe('Prac', 'open');
    this.subscribe('Prac', 'drop');
    this.store.show();
    this.store.add('Prac', this.Prac.id, this.Prac);
    //tore.get( 'Prac', @Prac.id )         # Called after add
    this.store.put('Prac', this.Prac.id, this.Prac);
    //tore.del( 'Prac', @Prac.id )         # Called after put
    this.store.insert('Hues', this.Hues);
    //tore.select( 'Hues', (obj) -> true ) # Called after insert
    this.Hues['Green'].column = 'Embrace';
    this.Hues['Orange'].column = 'Embrace';
    this.Hues['Violet'].column = 'Embrace';
    this.store.update('Hues', this.Hues);
  }

  //here = (obj) -> obj.column is 'Embrace'  # Called after update
  //tore.remove( 'Hues', where )
  //console.log( "Manager.test()", { subjects:@store.stream.subjects } )
  data() {
    this.Prac = {
      "_id": "Involve",
      "id": "Involve",
      "table": "prac",
      "type": "pane",
      "hsv": [195, 90, 60],
      "column": "Embrace",
      "row": "Learn",
      "plane": "Know",
      "icon": "fas fa-users",
      "cells": [5, 12, 7, 12],
      "dir": "nw",
      "neg": "Greed"
    };
    this.Hues = this.mix.data('Hues');
    // console.log( 'Manager.data(@Pracs)', @mix, @Hues )
    return this.Kit = {
      "_id": "mittens",
      "name": "Mittens",
      "occupation": "kitten",
      "age": 3,
      "hobbies": ["playing with balls of yarn", "chasing laser pointers", "lookin' hella cute"]
    };
  }

};

export default Manager;

//# sourceMappingURL=Manager.js.map
