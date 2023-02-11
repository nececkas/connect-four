const io = require('socket.io')(3000, {
  cors: {
    origin: ['http://localhost:8080']
  }
})

io.on('connection', socket => {
  socket.on('send-move', (room, move, moveBy) => {
    socket.to(room).emit('receive-move', move, moveBy)
  })

  socket.on('join-room', (room) => {
    socket.join(room)
  })

  socket.on('leave-room', (room) => {
    socket.leave(room)
  })
})