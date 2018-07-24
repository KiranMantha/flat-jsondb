const Utils = require('./lib/utils');
const lodash = require('lodash');
const lodashid = require('lodash-id');
const _ = Object.assign({}, lodash, lodashid);

function jsondb(dataBasePath) {
    let utils = new Utils(dataBasePath);
    let cache = {};
    
    utils.mkdirSync();

    // Create table JSON
    this.createTable = function(tableName) {
        if(typeof tableName === 'string') {
            let tableData = utils.createTable(tableName);
            cache[tableName] = tableData;
        } else if(tableName.slice){
            _.each(tableName, function(table) {
                let tableData = utils.createTable(table);
                cache[table] = tableData;
            });
        }
    }

    // CURD Functions
    this.get = function(tableName) {
        try {
            if (utils.checkTable(tableName) && !cache[tableName]) {
                const data = this.utils.readFile(tableName);
                cache[tableName] = data;
                return data;
            } else {
                return cache[tableName];
            }
        } catch (error) {
        }
    }

    this.getById = function(tableName, id) {
        return  _.getById(cache[tableName], id);
    }

    this.insert = function(tableName, data) {
        const rec = _.insert(cache[tableName], data);
        utils.save(tableName, cache[tableName]);
        return rec;
    }

    this.updateById = function (tableName, id, data) {

    }

    this.removeById = function(tableName, id) {

    }

    this.removeWhere = function (tableName, whereAttrs) {

    }

    return this;
}

module.exports = jsondb;