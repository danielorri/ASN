const socketIO = require('socket.io');

let io;

function initializeSocket(server) {
    io = socketIO(server, {
        cors: {
          origin: "http://10.100.111.10:3000",  // Replace with the actual origin of your client app
          methods: ["GET", "POST", "OPTIONS"]
        }
      });
    
      // Add logging for troubleshooting
    io.on('connection', (socket) => {
        console.log(`Socket connected: ${socket.id}`);
    });

  // Add any socket-related configurations or event handlers here

  return io;
}

function getIo() {
  if (!io) {
    throw new Error('Socket.IO not initialized. Call initializeSocket first.');
  }
  return io;
}

module.exports = {
  initializeSocket,
  getIo,
};

