const Utils = require("./lib/utils");
const lodash = require("lodash");
const lodashid = require("lodash-id");
const _ = Object.assign({}, lodash, lodashid);

function jsondb(dataBasePath) {
  let utils = new Utils(dataBasePath);
  let cache = {};

  utils.mkdirSync();

  function __insert(tableName, data) {
    let rec = _.insert(cache[tableName], data);
    return rec;
  }

  async function __save(tableName) {
    await utils.save(tableName, cache[tableName]);
  }

  // Clean cache
  this.cleanCache = function() {
    cache = {};
  };

  // Create table JSON
  this.createTable = async function(tableName) {
    let tableData;
    if (typeof tableName === "string") {
      tableData = await utils.createTable(tableName);
      cache[tableName] = tableData;
    } else if (tableName.map) {
      for (const table of tableName) {
        tableData = await utils.createTable(table);
        cache[table] = tableData;
      }
    }
    return tableData;
  };

  // CURD Functions
  this.get = async function(tableName) {
    try {
      if (utils.checkTable(tableName)) {
        if (!cache[tableName] || cache[tableName].length === 0) {
          const data = await utils.readFile(tableName);
          cache[tableName] = JSON.parse(data);
          return JSON.parse(data);
        } else {
          return cache[tableName];
        }
      } else {
        return undefined;
      }
    } catch (error) {}
  };

  this.getById = async function(tableName, id) {
    if (!cache[tableName] || cache[tableName].length === 0) {
      await this.get(tableName);
    }
    return _.getById(cache[tableName], id);
  };

  this.getWhere = async function(tableName, whereAttrs) {
    const data = await this.get(tableName);
    return _.filter(data, whereAttrs);
  };

  this.insert = async function(tableName, data) {
    let rec = [];
    if (data.map) {
      for (let item of data) {
        let rec1 = __insert(tableName, item);
        rec.push(rec1);
      }
    } else {
      let rec1 = __insert(tableName, data);
      rec.push(rec1);
    }
    await __save(tableName);
    return rec;
  };

  this.updateById = async function(tableName, id, data) {
    const rec = _.updateById(cache[tableName], id, data);
    await __save(tableName);
    return rec;
  };

  this.updateWhere = async function(tableName, whereAttrs, attrs) {
    const recs = _.updateWhere(cache[tableName], whereAttrs, attrs);
    await __save(tableName);
    return recs;
  };

  this.removeById = async function(tableName, id) {
    _.removeById(cache[tableName], id);
    await __save(tableName);
  };

  this.removeWhere = async function(tableName, whereAttrs) {
    _.removeWhere(cache[tableName], whereAttrs);
    await __save(tableName);
  };

  this.truncateTable = async function(tableName) {
    cache[tableName] = [];
    await __save(tableName);
  };

  this.dropTable = function(tableName) {
    delete cache[tableName];
    utils.dropTable(tableName);
  };

  return this;
}

module.exports = jsondb;
