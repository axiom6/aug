var Manager;

import Data from '../appl/Data.js';

import Memory from '../../base/store/Memory.js';

import Local from '../../base/store/Local.js';

import Index from '../../base/store/Index.js';

import Fire from '../../base/store/Fire.js';

import Couch from '../../base/store/Couch.js';

Manager = class Manager {
  constructor(mix) {
    this.mix = mix;
    this.dbName = 'test1';
    this.tables = ['Prac', 'Hues'];
    this.credUrl = 'http://admin:athena@127.0.0.1:5984'; // Admin host to couchdb
    this.baseUrl = 'http://127.0.0.1:5984'; // Admin host to couchdb
    this.stream = Data.stream;
    this.prac = null;
    this.hues = null;
    this.kit = null;
  }

  test(name) {
    var store;
    store = (function() {
      switch (name) {
        case 'Local':
          return new Local(this.dbName);
        case 'Index':
          return this.openIndex(this.dbName, ['Hues']); // 'Prac',
        case 'Fire':
          return new Fire(this.dbName);
        case 'Couch':
          return new Couch(this.dbName, this.baseUrl);
        default:
          return new Memory(this.dbName);
      }
    }).call(this);
    if (name !== 'Index') {
      this.suite(store);
    }
  }

  openIndex(dbName, tables) {
    var idb;
    idb = new Index(dbName, ['Prac', 'Hues']);
    idb.openDB(idb.dbName, idb.dbVersion, tables).then((db) => {
      idb.db = db;
      this.suite(idb);
    }).catch((error) => {
      idb.onerror(tables, 'openDB', error);
    });
    return idb;
  }

  subscribe(table, op, store) {
    var onSubscribe;
    onSubscribe = (obj) => {
      return console.log('Mgr', {
        table: table,
        op: op,
        source: store.source,
        obj: obj
      });
    };
    store.subscribe(table, op, store.source, onSubscribe);
  }

  suite(store) {
    console.log('Manager.suite()', store.source);
    this.data();
    this.subscribe('prac', 'add', store);
    this.subscribe('prac', 'get', store);
    this.subscribe('hues', 'put', store);
    this.subscribe('prac', 'del', store);
    this.subscribe(this.dbName, 'show', store);
    this.subscribe('hues', 'open', store);
    //tore.drop( 'demo')

    //tore.open( 'hues')
    store.show();
    //tore.add( 'prac', @prac.id, @prac )
    //tore.get( 'prac', @prac.id )
    this.hues['Green'].column = 'Embrace';
    this.hues['Green']._rev = "3-3ec7f175f1d3920f3d02c7d16c4a6737";
    //store.put( 'hues', 'Green', @hues['Green'] )
    //tore.del( 'prac', @prac.id )
    this.subscribe('hues', 'insert', store);
    this.subscribe('hues', 'select', store);
    this.subscribe('hues', 'update', store);
    this.subscribe('hues', 'remove', store);
  }

  //tore.insert( 'hues', @hues )
  //tore.select( 'hues', (obj) -> true )
  //@hues['Green'].column  = 'Embrace'
  //@hues['Orange'].column = 'Embrace'
  //@hues['Violet'].column = 'Embrace'
  //tore.update( 'hues', @hues )
  //here = (obj) -> obj.column is 'Embrace'
  //tore.remove( 'hues', where )
  data() {
    this.prac = {
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
    this.hues = this.mix.data('Hues');
    // console.log( 'Manager.data(@pracs)', @mix, @hues )
    return this.kit = {
      "_id": "mittens",
      "name": "Mittens",
      "occupation": "kitten",
      "age": 3,
      "hobbies": ["playing with balls of yarn", "chasing laser pointers", "lookin' hella cute"]
    };
  }

};

export default Manager;
