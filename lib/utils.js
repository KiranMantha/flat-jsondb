const fs = require("graceful-fs");
const readFile = fs.createReadStream;
const writeFile = fs.createWriteStream;
const removeFile = fs.unlinkSync;
const base = require("./base");

function utils(dirPath) {
  this.dirPath = dirPath;

  this.mkdirSync = function() {
    try {
      fs.mkdirSync(this.dirPath);
    } catch (err) {
      if (err.code !== "EEXIST") throw err;
    }
  };

  this.checkTable = function(tableName) {
    return fs.existsSync(this.dirPath + `/${tableName}.json`);
  };

  this.readFile = function(tableName) {
    return new Promise(async (resolve, reject) => {
      let chunks = [];
      const file = await readFile(this.dirPath + `/${tableName}.json`);

      // Listen for data
      file.on("data", chunk => {
        chunks.push(chunk);
      });

      // File is done being read
      file.on("end", () => {
        // Create a buffer of the image from the stream
        return resolve(Buffer.concat(chunks));
      });
    });
  };

  this.save = async function(tableName, data = this.defaultValue) {
    const file = await writeFile(this.dirPath + `/${tableName}.json`);
    file.write(this.serialize(data));
    file.end();
  };

  this.createTable = async function(tableName) {
    if (!fs.existsSync(this.dirPath + `/${tableName}.json`)) {
      await this.save(tableName, this.defaultValue);
      return this.defaultValue;
    } else {
      const data = await this.readFile(tableName);
      return data;
    }
  };

  this.dropTable = function(tableName) {
    if (fs.existsSync(this.dirPath + `/${tableName}.json`)) {
      removeFile(this.dirPath + `/${tableName}.json`);
    }
  };
}

utils.prototype = new base();
utils.prototype.constructor = utils;

module.exports = utils;
