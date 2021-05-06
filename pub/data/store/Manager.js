var Manager;

import Data from '../appl/Data.js';

import Memory from '../../base/store/Memory.js';

import Local from '../../base/store/Local.js';

import Index from '../../base/store/Index.js';

import Fire from '../../base/store/Fire.js';

import Couch from '../../base/store/Couch.js';

Manager = class Manager {
  constructor(mix) {
    this.subscribe = this.subscribe.bind(this);
    this.mix = mix;
    this.dbName = 'test1';
    this.credsUrl = 'http://admin:athena@127.0.0.1:5984'; // Admin host to couchdb
    this.couchUrl = 'http://127.0.0.1:5984'; // Admin host to couchdb
    this.stream = Data.stream;
    this.Prac = null;
    this.Hues = null;
    this.Kit = null;
    this.source = null;
  }

  test(name) {
    var store;
    store = (function() {
      switch (name) {
        case 'Local':
          return new Local(this.dbName);
        case 'Index':
          return new Index(this.dbName);
        case 'Fire':
          return new Fire(this.dbName);
        case 'Couch':
          return new Couch(this.dbName, this.couchUrl);
        default:
          return new Memory(this.dbName);
      }
    }).call(this);
    this.source = store.source;
    store.openTable('Prac');
    store.openTable('Hues');
    if (name === 'Index') {
      this.openIndex(store);
    }
    if (name !== 'Index') {
      this.suite(store);
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

  subscribe(table, op, store) {
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
          return store.get(table, obj.id);
        case 'put':
          return store.del(table, obj.id);
        case 'insert':
          return store.select(table, whereS);
        case 'update':
          return store.remove(table, whereD);
      }
    };
    //tore.unsubscribe( table, op, @lastSource ) if @lastSource?
    store.subscribe(table, op, store.source, onSubscribe);
  }

  suite(store) {
    console.log('Manager.suite()', store.source);
    this.data();
    this.subscribe('Prac', 'add', store);
    this.subscribe('Prac', 'get', store);
    this.subscribe('Prac', 'put', store);
    this.subscribe('Prac', 'del', store);
    this.subscribe('Hues', 'insert', store);
    this.subscribe('Hues', 'select', store);
    this.subscribe('Hues', 'update', store);
    this.subscribe('Hues', 'remove', store);
    this.subscribe('Tables', 'show', store);
    this.subscribe('Prac', 'open', store);
    this.subscribe('Prac', 'drop', store);
    store.show();
    store.add('Prac', this.Prac.id, this.Prac);
    //tore.get( 'Prac', @Prac.id )         # Called after add
    store.put('Prac', this.Prac.id, this.Prac);
    //tore.del( 'Prac', @Prac.id )         # Called after put
    store.insert('Hues', this.Hues);
    //tore.select( 'Hues', (obj) -> true ) # Called after insert
    this.Hues['Green'].column = 'Embrace';
    this.Hues['Orange'].column = 'Embrace';
    this.Hues['Violet'].column = 'Embrace';
    store.update('Hues', this.Hues);
  }

  //here = (obj) -> obj.column is 'Embrace'  # Called after update
  //tore.remove( 'Hues', where )
  //console.log( "Manager.test()", { subjects:store.stream.subjects } )
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
