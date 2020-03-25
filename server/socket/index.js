const IO = io => {
  io.on('connection', socket => {
    console.log(`A socket connection to the server has been made: ${socket.id}`)

    socket.on('disconnect', () => {
      console.log(`Connection ${socket.id} has left the building`)
    })
  })
}

const GAMENSP = gameNsp => {
  gameNsp.on('connection', socket => {
    console.log(`A socket connection to games has been made: ${socket.id}`)

    socket.on('disconnect', () => {
      console.log(`Connection ${socket.id} has left the lobby`)
    })
    socket.on('join', data => {
      socket.join(`room${data.id}`)
    })
    socket.on('move made', data => {
      socket.to('room1').emit('move made')
    })
    socket.on('play card', data => {
      console.log('emitting from gameNSP')
      socket.to('room1').emit('play card', data)
    })

    socket.on('attack', data => {
      console.log('emitting from gameNSP')
      socket.to('room1').emit('attack', data)
    })

    socket.on('draw card', () => {
      console.log('emitting from gameNSP')
      socket.to('room1').emit('draw card')
    })

    socket.on('send msg', data => {
      console.log('emitting from gameNSP')
      gameNsp.in('room1').emit('send msg', data)
    })
    socket.on('end turn', () => {
      console.log('emitting from gameNSP')
      gameNsp.in('room1').emit('end turn')
    })
  })
}

module.exports = {
  IO,
  GAMENSP
}
