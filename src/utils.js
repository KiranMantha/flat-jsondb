import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { createReadStream, createWriteStream, existsSync, promises, unlinkSync } = require('graceful-fs');

export class Utils {
  constructor(dirPath) {
    this.defaultValue = [];
    this.deserialize = JSON.parse;
    this.dirPath = dirPath;
  }

  serialize(obj) {
    return JSON.stringify(obj, null, 2);
  }

  async mkdirSync() {
    try {
      await promises.mkdir(this.dirPath);
    } catch (err) {
      if (err.code !== 'EEXIST') throw err;
    }
  }

  checkTable(tableName) {
    return Promise.resolve(existsSync(`${this.dirPath}/${tableName}.json`));
  }

  async readFile(tableName) {
    const chunks = [];
    const file = createReadStream(`${this.dirPath}/${tableName}.json`, { flags: 'r' });

    return new Promise((resolve, reject) => {
      file.on('data', (chunk) => {
        chunks.push(chunk);
      });

      file.on('end', () => {
        const buf = Buffer.concat(chunks).toString();
        resolve(this.deserialize(buf));
      });

      file.on('error', (err) => {
        reject(err);
      });
    });
  }

  async save(tableName, data = this.defaultValue) {
    return new Promise((resolve, reject) => {
      const file = createWriteStream(`${this.dirPath}/${tableName}.json`);
      file.on('finish', () => resolve(true));
      file.on('error', (err) => reject(err));
      file.write(this.serialize(data));
      file.end();
    });
  }

  async createTable(tableName) {
    const exists = await this.checkTable(tableName);
    if (!exists) {
      await this.save(tableName, this.defaultValue);
      return this.defaultValue;
    } else {
      const data = await this.readFile(tableName);
      return data;
    }
  }

  dropTable(tableName) {
    if (existsSync(`${this.dirPath}/${tableName}.json`)) {
      unlinkSync(`${this.dirPath}/${tableName}.json`);
    }
  }
}
