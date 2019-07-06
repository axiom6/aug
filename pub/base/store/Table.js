var Table;

import Fire from './Fire.js';

import Pipe from './Pipe.js';

import Store from './Store.js';

Table = class Table {
  constructor(stream) {
    this.stream = stream;
    this.dbName = 'Prac';
    this.url = 'http://localhost:63342/aug/pub/app/data/';
    this.tables = {
      Prac: {}
    };
    this.store = new Store(this.dbName, this.tables, this.url);
    this.store.fire = new Fire(this.store);
    this.store.pipe = new Pipe(this.stream, this.dbName);
  }

  //store.rest   = new Rest(   @store )
  //store.local  = new Local(  @store )
  //store.memory = new Memory( @store )
  selectPrac(onSelect) {
    var cols, keys, onPrac, where;
    cols = ['id', 'plane', 'row', 'column', 'icon'];
    keys = ['Collab', 'Domain', 'Discover', 'Adapt', 'Tech', 'Benefit', 'Change', 'Deliver', 'Govern', 'Humanity', 'Science', 'Understand', 'Conduct', 'Cognition', 'Reason', 'Evolve', 'Educate', 'Culture', 'Trust', 'Nature', 'Truth', 'Experience', 'Create', 'Conscious', 'Emerge', 'Inspire', 'Actualize'];
    onPrac = (results) => {
      var col, i, j, key, len, len1, row, rows;
      rows = {};
      for (i = 0, len = keys.length; i < len; i++) {
        key = keys[i];
        row = {};
        for (j = 0, len1 = cols.length; j < len1; j++) {
          col = cols[j];
          row[col] = results[key][col];
        }
        rows[key] = row;
      }
      onSelect(rows);
    };
    this.store.subscribe("Prac", "select", 'Table', onPrac);
    where = function(obj) {
      return true;
    };
    return this.store.select('fire', 'Prac', where);
  }

  toCap(str) {
    return str.charAt(0).toUpperCase() + str.substring(1);
  }

  columns(rows) {
    var cols, fkey, key, obj, ref;
    fkey = Object.keys(rows)[0];
    cols = {};
    ref = rows[fkey];
    for (key in ref) {
      obj = ref[key];
      cols[key] = this.toCap(key);
    }
    return cols;
  }

};

export default Table;
