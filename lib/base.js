let base = function () {
  this.defaultValue = [];
};

base.prototype.serialize = function (obj) {
  return JSON.stringify(obj, null, 2);
};

base.prototype.deserialize = JSON.parse;

module.exports = base;
