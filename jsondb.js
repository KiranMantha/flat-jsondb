const Utils = require('./lib/utils');
const lodash = require('lodash');
const lodashid = require('lodash-id');
const _ = Object.assign({}, lodash, lodashid);

function jsondb(dataBasePath) {
    let utils = new Utils(dataBasePath);
    let cache = {};

    utils.mkdirSync();

    _.createId = function() {
        return Date.now();
    }

    // Create table JSON
    this.createTable = function (tableName) {
        let tableData;
        if (typeof tableName === 'string') {
            tableData = utils.createTable(tableName);
            cache[tableName] = tableData;
        } else if (tableName.slice) {
            _.each(tableName, function (table) {
                tableData = utils.createTable(table);
                cache[table] = tableData;
            });
        }
        return tableData;
    }

    // CURD Functions
    this.get = function (tableName) {
        try {
            if (utils.checkTable(tableName) && !cache[tableName]) {
                const data = this.utils.readFile(tableName);
                cache[tableName] = data;
                return data;
            } else {
                return cache[tableName];
            }
        } catch (error) {}
    }

    this.getById = function (tableName, id) {
        return _.getById(cache[tableName], id);
    }

    this.insert = function (tableName, data) {
        const rec = _.insert(cache[tableName], data);
        utils.save(tableName, cache[tableName]);
        return rec;
    }

    this.updateById = function (tableName, id, data) {
        const rec = _.updateById(cache[tableName], id, data);
        utils.save(tableName, cache[tableName]);
        return rec;
    }

    this.updateWhere = function (tableName, whereAttrs, attrs) {
        const recs = _.updateWhere(cache[tableName], whereAttrs, attrs);
        utils.save(tableName, cache[tableName]);
        return recs;
    }

    this.removeById = function (tableName, id) {
        _.removeById(cache[tableName], id);
        utils.save(tableName, cache[tableName]);
    }

    this.removeWhere = function (tableName, whereAttrs) {
        _.removeWhere(cache[tableName], whereAttrs);
        utils.save(tableName, cache[tableName]);
    }

    return this;
}

module.exports = jsondb;