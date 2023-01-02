const serverIO = {
  io: undefined,
  socket: [],
  init(httpServer, option) {
    this.io = require('socket.io')(httpServer, option);
    return this.io
  },
  getIO() {
    if (!this.io) {
      throw new Error('Socket.io not initialized!');
    }
    return this.io;
  }
}

module.exports = serverIO