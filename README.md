[![Build Status](https://travis-ci.org/KiranMantha/flat-jsondb.svg?branch=master)](https://travis-ci.org/KiranMantha/flat-jsondb) [![Coverage Status](https://coveralls.io/repos/github/KiranMantha/flat-jsondb/badge.svg?branch=master)](https://coveralls.io/github/KiranMantha/flat-jsondb?branch=master)

# Flat-JSONDB
a simple flat file based JSON database

### Create Database Folder
`const db = require("./jsondb")(path.resolve(__dirname, <-Your-db-folder-name->));`

### Create Table
`await db.createTable('movies');`

### Create Tables
`await db.createTable(['movies', 'actors']);`

### Get
#### All
`await db.get(tableName);`

#### By Id
`await db.getById(tableName, <-record-id->);`

#### By Where
`await db.getWhere(tableName, {<-your-where-args->});`
example: `await db.getWhere('movies', {favorite: true});`

### Insert Record
`await db.insert(tableName, <-your-table-object->);`
example: `await db.insert('movies', {title: 'Starwars'});`

### Insert Records
`await db.insert(tableName, [<-your-table-object->]);`
example: `await db.insert('movies', [{title: 'Starwars'}, {title: 'Transformers'}]);`

### Update
#### By Id
`await db.updateById(tableName, <-record-id->, {<-record-data->});`
example: `await db.updateById("movies", id, {title: ""});`

#### By Where
`await db.updateWhere(tableName, <-your-where-object->, <-new-data-object->);`

### Remove
#### By Id
`await db.removeById(tableName, <-record-id->);`

#### By Where
`await db.removeById(tableName, <-where-object->);`

### Truncate Table
`await db.truncateTable(tableName);`

### Drop Table
`await db.dropTable(tableName);`