const Utils = require('./lib/utils');
const lodash = require('lodash');
const lodashid = require('lodash-id');
const _ = Object.assign({}, lodash, lodashid);

function jsondb(dataBasePath) {
    let utils = new Utils(dataBasePath);
    let cache = {};

    utils.mkdirSync();

    function __insert(tableName, data) {
        let rec = _.insert(cache[tableName], data);
        return rec;
    }

    // Clean cache
    this.cleanCache = function () {
        cache = {};
    }

    // Create table JSON
    this.createTable = function (tableName) {
        let tableData;
        if (typeof tableName === 'string') {
            tableData = utils.createTable(tableName);
            cache[tableName] = tableData;
        } else if (tableName.map) {
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
            if (utils.checkTable(tableName)) {
                if (!cache[tableName] || cache[tableName].length === 0) {
                    const data = utils.readFile(tableName);
                    cache[tableName] = data;
                    return data;
                } else {
                    return cache[tableName];
                }
            } else {
                return undefined;
            }
        } catch (error) {}
    }

    this.getById = function (tableName, id) {
        return _.getById(cache[tableName], id);
    }

    this.getWhere = function (tableName, whereAttrs) {
        const data = this.get(tableName);
        return _.filter(data, whereAttrs);
    }

    this.insert = function (tableName, data) {
        let rec = [];
        if (data.map) {
            _.each(data, function (item) {
                let rec1 = __insert(tableName, item);
                rec.push(rec1);
            });
        } else {
            let rec1 = __insert(tableName, data);
            rec.push(rec1);
        }
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

    this.truncateTable = function (tableName) {
        cache[tableName] = [];
        utils.save(tableName, []);
    }

    this.dropTable = function (tableName) {
        delete cache[tableName];
        utils.dropTable(tableName);
    }

    return this;
}

module.exports = jsondb;