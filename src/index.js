// index.js
import { assign, filter, find, remove, uniqueId } from 'lodash-es';
import { Utils } from './utils.js';

const _ = {
  assign,
  filter,
  find,
  remove,
  uniqueId
};

export class JsonDB {
  constructor(dataBasePath) {
    this.utils = new Utils(dataBasePath);
    this.cache = {};

    // Create database folder
    this.utils.mkdirSync();
  }

  // Clean cache
  cleanCache() {
    this.cache = {};
  }

  // Create table JSON
  async createTable(tableName) {
    let tableData;
    if (typeof tableName === 'string') {
      tableData = await this.utils.createTable(tableName);
      this.cache[tableName] = tableData;
    } else if (Array.isArray(tableName)) {
      for (const table of tableName) {
        tableData = await this.utils.createTable(table);
        this.cache[table] = tableData;
      }
    }
    return tableData;
  }

  // CURD Functions
  async get(tableName) {
    try {
      if (await this.utils.checkTable(tableName)) {
        if (!this.cache[tableName] || this.cache[tableName].length === 0) {
          const data = await this.utils.readFile(tableName);
          this.cache[tableName] = data;
          return data;
        } else {
          return this.cache[tableName];
        }
      } else {
        return undefined;
      }
    } catch (error) {
      console.error(error);
    }
  }

  async getById(tableName, id) {
    if (!this.cache[tableName] || this.cache[tableName].length === 0) {
      await this.get(tableName);
    }
    return _.find(this.cache[tableName], { id });
  }

  async getWhere(tableName, whereAttrs) {
    const data = await this.get(tableName);
    return _.filter(data, whereAttrs);
  }

  async insert(tableName, data) {
    const records = [];
    if (Array.isArray(data)) {
      for (const item of data) {
        const record = this.__insert(tableName, item);
        records.push(record);
      }
    } else {
      const record = this.__insert(tableName, data);
      records.push(record);
    }
    await this.__save(tableName);
    return records;
  }

  async updateById(tableName, id, data) {
    const record = _.find(this.cache[tableName], { id });
    if (record) {
      _.assign(record, data);
      await this.__save(tableName);
    }
    return record;
  }

  async updateWhere(tableName, whereAttrs, attrs) {
    const records = _.filter(this.cache[tableName], whereAttrs);
    records.forEach((record) => _.assign(record, attrs));
    await this.__save(tableName);
    return records;
  }

  async removeById(tableName, id) {
    _.remove(this.cache[tableName], { id });
    await this.__save(tableName);
  }

  async removeWhere(tableName, whereAttrs) {
    _.remove(this.cache[tableName], whereAttrs);
    await this.__save(tableName);
  }

  async truncateTable(tableName) {
    this.cache[tableName] = [];
    await this.__save(tableName);
  }

  dropTable(tableName) {
    delete this.cache[tableName];
    this.utils.dropTable(tableName);
  }

  // Private insert function
  __insert(tableName, data) {
    const newData = { ...data, id: _.uniqueId() };
    this.cache[tableName].push(newData);
    return newData;
  }

  // Private save function
  async __save(tableName) {
    await this.utils.save(tableName, this.cache[tableName]);
  }
}
