const fs = require('graceful-fs');
const readFile = fs.readFileSync;
const writeFile = fs.writeFileSync;
const base = require('./base');

function utils(dirPath) {
    this.dirPath = dirPath;

    this.mkdirSync = function () {
        try {
            fs.mkdirSync(this.dirPath);
        } catch (err) {
            if (err.code !== 'EEXIST') throw err
        }
    }

    this.checkTable = function (tableName) {
        return fs.existsSync(this.dirPath + `/${tableName}.json`);
    }

    this.readFile = function (tableName) {
        const data = readFile(this.dirPath + `/${tableName}.json`, 'utf-8').trim();
        return data ? this.deserialize(data) : this.defaultValue;
    }

    this.save = function (tableName, data = this.defaultValue) {
        writeFile(this.dirPath + `/${tableName}.json`, this.serialize(data));
    }

    this.createTable = function (tableName) {
        if (!fs.existsSync(this.dirPath + `/${tableName}.json`)) {
            writeFile(this.dirPath + `/${tableName}.json`, this.serialize(this.defaultValue));
            return this.defaultValue;
        } else {
            return this.readFile(tableName);
        }
    }
}

utils.prototype = new base();
utils.prototype.constructor = utils;

module.exports = utils;