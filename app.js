/*!
 * app.js
 *
 * @author pfleidi
 */

var Fs = require('fs');
var Util = require('util');
var Express = require('express');
var Io = require('socket.io');
var Log4js = require('log4js')();
var logger = Log4js.getLogger('bunghole');
var LOGFILE = __dirname + '/logs/bunghole.log';

// main application
var app = module.exports = Express.createServer();

/**
 * configuration
 */
app.configure(function () {
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.use(Express.bodyParser());
    app.use(app.router);
    app.use(Express.static(__dirname + '/public'));
  });

app.configure('development', function () {
    app.use(Express.errorHandler({
          dumpExceptions: true,
          showStack: true
        }));
    logger.setLevel('DEBUG');
  });

app.configure('production', function () {
    var accessLog = Fs.createWriteStream(__dirname + '/logs/access.log', {
        encoding: 'utf-8',
        flags: 'a'
      });

    app.use(Express.logger({ stream: accessLog }));
    app.use(Express.errorHandler());
    Log4js.addAppender(Log4js.fileAppender(LOGFILE));
    logger.setLevel('ERROR');
  });


app.listen(3000, function () {
    var adr = app.address();
    Util.puts('Express server listening on http://' + adr.address + ':' + adr.port + '/');
  });

var webSocketServer = Io.listen(app, {
    flashPolicyServer: false
  });

webSocketServer.on('connection', function (connection) {

    function _dispatch(msg, connection) {
      console.dir(msg);
    }

    connection.on('message', function (message) {
        try {
          var msg = JSON.parse(message);
          _dispatch(msg, connection);
        } catch (err) {
          log.error('Couldn\'t parse or eval message: ' + err.stack);
        }
      });

  });

var plotSin = [];
var plotCos = [];
var plot = [plotSin, plotCos];
var count = 0;

(function broadcast() {
    count += 0.1;
    plotSin.push([count, Math.sin(count)]);
    plotCos.push([count, Math.cos(count)]);
    webSocketServer.broadcast(JSON.stringify(plot));
    setTimeout(broadcast, 200);
  }());



/* Process Logging */

process.on('SIGINT', function () {
    logger.info('Got SIGINT. Exiting ...');
    process.exit(0);
  });

process.on('uncaughtException', function (err) {
    logger.fatal('RUNTIME ERROR! :' + err.stack);
  });
