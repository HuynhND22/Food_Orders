#!/usr/bin/env node

/**
 * Module dependencies.
 */

import app from '../src/app';
const debug = require('debug')('express-typescript:server');
import http from 'http';
import { initSocket } from '../src/config/socket/socketServer';

/**
 * Get port from environment and store in Express.
 */

const port = normalizePort(process.env.PORT || '9999');
app.set('port', port);

/**
 * Create HTTP server.
 */

const server = http.createServer(app);
initSocket(server)

/**
 * Listen on provided port, on all network interfaces.
 */

// Khởi tạo Socket.IO
// const io = initSocketIO(server);

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val: any) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error: any) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + address?.port;
  debug('Listening on ' + bind);
}
