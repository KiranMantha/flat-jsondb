var express = require('express'),
    app = express(),
    port = 3000,
    ip = '127.0.0.1';
var bodyParser = require('body-parser');
var routes = require('./routes/index');
var path = require('path');

app.use(express.static(__dirname + '/public' ));
app.use(express.static(__dirname + '/bower_components'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

app.use('/', routes);

var server_port = process.env.OPENSHIFT_NODEJS_PORT || port;
var server_ip_address = process.env.OPENSHIFT_NODEJS_IP || ip;

app.listen(server_port, server_ip_address, () => {
    console.log("Listening on " + server_ip_address + ", server_port " + server_port)
});