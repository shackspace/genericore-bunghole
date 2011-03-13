/**
 * Module dependencies.
 */

var Express = require('express');
var Util = require('util');
var app = module.exports = Express.createServer();

// Configuration
app.configure(function () {
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.use(Express.bodyParser());
    app.use(Express.methodOverride());
    app.use(app.router);
    app.use(Express.static(__dirname + '/public'));
  });

app.configure('development', function () {
    app.use(Express.errorHandler({ dumpExceptions: true, showStack: true })); 
  });

app.configure('production', function () {
    app.use(Express.errorHandler()); 
  });

// Routes
app.get('/', function (req, res) {
    res.render('index', {
        title: 'Bunghole'
      });
  });

// Only listen on $ node app.js
if (!module.parent) {
  app.listen(3000, function () {
      var address = app.address();
      Util.puts('Express server listening on http://' + address.address + ':' + address.port + '/');
    });
}
