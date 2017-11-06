var express = require('express');
var router = express.Router();
var db = require('../lib/db');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('api works!!');
});

// Get all records from the table
router.get('/:tableName', function (req, res, next) {
  var tableName = req.params.tableName;
  db.getAll(tableName);
});

// Get record by id from the given table name
router.get('/:tableName/:id', function (req, res, next) {
  var tableName = req.params.tableName,
    id = req.params.id;
  db.getRec(tableName, id).then(function (data) {
    res.json(data);
  }, function(error){
    res.
  });
});

// Add record to given table name
router.put('/:tableName', function (req, res, next) {
  var tableName = req.params.tableName;
  db.getAll(tableName);
});

// Remove record by id from given table name
router.delete('/:tableName/:id', function (req, res, next) {
  var tableName = req.params.tableName,
    id = req.params.id;
  db.getAll(tableName, id);
});

module.exports = router;