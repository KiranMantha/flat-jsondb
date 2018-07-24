const path = require('path');
const db = require('./jsondb')(path.resolve(__dirname , './data'));
db.createTable(['movies', 'actors', 'years']);
//db.createTable('movies');
const rec = db.insert('movies', { title: 'Mission Impossible' });
console.log(db.getById('movies', rec.id));