import React from 'react'
import Card from './Card'
import Plane from './Plane'
import {
  playerPlayCard,
  playerDrawCard,
  hurtByTheDraw
} from '../store/thunksAndActionCreators'
import {connect} from 'react-redux'
import Player from './Player'

const Side = props => {
  return (
    <div className="side">
      {props.top ? (
        <div>
          <Player
            imgUrl={props.side.heroUrl}
            player={props.opponent}
            side="top"
          />
          <div className="hand">
            HAND:
            {props.opponent.hand.map(card => {
              return (
                <Card card={card} key={card.id} player="enemy" inHand="true" />
              )
            })}
          </div>
          <Plane
            inPlay={props.opponentInPlay}
            playCard={card => props.playCard(props.opponent, card)}
            player="enemy"
          />
        </div>
      ) : (
        <div>
          <Plane
            inPlay={props.inPlay}
            playCard={card => props.playCard(props.player, card)}
            player="hero"
            planeFull={props.planeFull}
          />
          <div className="hand">
            HAND:
            {props.hand.map(card => {
              return (
                <Card card={card} key={card._id} player="hero" inHand={true} />
              )
            })}
          </div>
          <Player
            imgUrl={props.side.heroUrl}
            player={props.player}
            side="bottom"
          />
          {props.player.deck.length ? (
            <button
              type="submit"
              onClick={() => props.drawCard(props.player.deck)}
            >
              Draw Card Button
            </button>
          ) : (
            <button
              type="submit"
              onClick={() => props.hurtByDraw(props.player)}
            >
              Draw Card Button
            </button>
          )}
        </div>
      )}
    </div>
  )
}

const mapStateToProps = function(state) {
  return {
    inPlay: state.game.player.inPlay,
    opponentInPlay: state.game.opponent.inPlay,
    hand: state.game.player.hand,
    opponentHand: state.game.opponent.hand,
    opponent: state.game.opponent,
    player: state.game.player,
    planeFull: state.game.player.planeFull
  }
}

const mapDispatchToProps = function(dispatch) {
  return {
    playCard: (hero, card) => dispatch(playerPlayCard(hero, card)),
    drawCard: deck => dispatch(playerDrawCard(deck)),
    hurtByDraw: hero => dispatch(hurtByTheDraw(hero))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Side)
