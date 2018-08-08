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
      const file = readFile(this.dirPath + `/${tableName}.json`, {
        flags: "r"
      });

      // Listen for data
      file.on("data", chunk => {
        chunks.push(chunk);
      });

      // File is done being read
      file.on("end", () => {
        // Create a buffer of the image from the stream
        let buf = Buffer.concat(chunks).toString();
        return resolve(buf);
      });
    });
  };

  this.save = function(tableName, data = this.defaultValue) {
    return new Promise((resolve, reject) => {
      const file = writeFile(this.dirPath + `/${tableName}.json`);
      file.on("finish", function() {
        return resolve(true);
      });
      file.write(this.serialize(data));
      file.end();
    });
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
