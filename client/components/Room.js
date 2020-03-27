import React, {Component} from 'react'
import history from '../history'
import {startGame, updateUserGames} from '../store/thunksAndActionCreators'
import {connect} from 'react-redux'
import io from 'socket.io-client'
export const socket = io('/games')
class Room extends Component {
  componentDidMount() {
    const user = this.props.user
    const roomId = this.props.match.params.roomId

    socket.emit('join', {roomId: roomId})
    socket.on('join', data => {
      if (data.numPpl === 2) {
        socket.emit('id exchange', {
          oppId: user._id,
          roomId: roomId
        })
      }
    })

    // socket.on('full', data => {
    //   socket.leave(`room${data.roomId}`)
    //   // eslint-disable-next-line no-alert
    //   alert('Room is full!')
    // })

    socket.on('id exchange', async data => {
      if (socket.id === data.host) {
        const gameId = await this.props.startGame(user._id, data.oppId)
        this.props.updateUserGames(user._id, {
          email: user.email,
          userName: user.userName,
          imgUrl: user.imgUrl,
          collections: user.collections,
          games: user.games.includes(gameId)
            ? user.games
            : [...user.games, gameId]
        })

        socket.emit('game started', {
          gameId: gameId,
          roomId: roomId
        })

        history.push(`/games/rooms/${roomId}/game/${gameId}`)
      }
    })

    socket.on('game started', data => {
      this.props.updateUserGames(this.props.user._id, {
        email: user.email,
        userName: user.userName,
        imgUrl: user.imgUrl,
        collections: user.collections,
        games: user.games.includes(data.gameId)
          ? user.games
          : [...user.games, data.gameId]
      })

      history.push(`/games/rooms/${roomId}/game/${data.gameId}`)
    })
  }

  render() {
    return (
      <h1>{`Your room is: ${this.props.match.params.roomId}\nSend this to your friend!`}</h1>
    )
  }
}

const mapStateToProps = state => {
  return {
    user: state.user
  }
}

const mapDispatchToProps = dispatch => {
  return {
    startGame: (p1Id, p2Id) => dispatch(startGame(p1Id, p2Id)),
    updateUserGames: (userId, userData) =>
      dispatch(updateUserGames(userId, userData))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Room)