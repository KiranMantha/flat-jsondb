const fs = require('fs');
const path = require('path');
const rootDir = __dirname;
const dataFolder = __dirname + '/data';
const db = {};
const util = {};

function checkTable(tableName) {
    fs.existsSync(path.resolve(dataFolder, `/${tableName}.json`));
}

function readFile(tableName, callback){
    fs.readFile(path.resolve(dataFolder, `/${tableName}.json`), 'utf8', callback);    
}

function createTable(tableName, callBack) {
    fs.writeFile(path.resolve(dataFolder, `/${tableName}.json`), JSON.stringify([]), 'utf8', callBack)
}

db.findAll = function (tableName) {
    new Promise((resolve, reject) => {
        try {
            if (checkTable(tableName)) {
                readFile(tableName, function (err, data) {
                    if (err) {
                        console.log(err);
                    } else {
                        resolve(JSON.parse(data));
                    }
                });
            } else {
                createTable(tableName, function () {

                });
            }
        } catch (error) {
            reject(error);
        }
    });
}

db.find = function (tableName, id) {

}

db.save = function (tableName, data) {

}

db.drop = function (tableName, id) {

}

module.exports = db;