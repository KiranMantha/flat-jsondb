const path = require('path');
const db = require('./jsondb')(path.resolve(__dirname , './data'));
//db.createTable(['movies', 'actors', 'years']);
console.log(db.createTable('movies'));
const rec = db.insert('movies', { title: 'Mission Impossible' });
console.log(db.getById('movies', rec.id));
console.log(db.updateById('movies', rec.id, { favorite: true }));
db.insert('movies', { title: 'Twilight' });
console.log(db.get('movies'));