import {
  getAllUserCollections,
  getCollectionCards,
  createDeck
} from '../store/reducers/user.js'
import Collection from './Collection'
import DisplayCard from './DisplayCard'
import {connect} from 'react-redux'
import React, {Component} from 'react'

class CollectionList extends Component {
  constructor() {
    super()
    this.state = {
      name: ''
    }

    this.handleClick = this.handleClick.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleChange = this.handleChange.bind(this)
  }

  componentDidMount() {
    this.props.loadInitialData(this.props.user._id)
    // this.props.loadCards(this.props.selectedCollection._id)
  }

  handleClick(collectionId) {
    this.props.loadCards(collectionId)
  }

  handleSubmit(event) {
    event.preventDefault()
    this.props.createDeck(this.state.name)
    this.setState({
      name: ''
    })
  }

  handleChange(event) {
    this.setState({
      name: event.target.value
    })
  }

  render() {
    if (this.props.selectedCollection) {
      return (
        <div>
          <div id="collections">
            {this.props.userCollections.map(collection => {
              return (
                <Collection
                  handleClick={() => {
                    this.handleClick(collection._id)
                  }}
                  key={collection._id}
                  collection={collection}
                />
              )
            })}
          </div>
          <form onSubmit={this.handleSubmit}>
            <label htmlFor="deck">Deck Name</label>
            <input
              name="deck"
              value={this.state.name}
              onChange={this.handleChange}
            ></input>
            <button type="submit">Create Deck</button>
          </form>

          <div id="selectedCollection">
            {this.props.selectedCollection.map(card => {
              return <DisplayCard key={card._id} card={card} />
            })}
          </div>
        </div>
      )
    } else {
      return (
        <div>
          <div id="collections">
            {this.props.userCollections.map(collection => {
              return <Collection key={collection._id} collection={collection} />
            })}
          </div>
          <div id="selectedCollection">No selection</div>
        </div>
      )
    }
  }
}

const mapState = state => {
  return {
    userCollections: state.user.collections,
    selectedCollection: state.user.selectedCollection,
    user: state.user
  }
}

const mapDispatch = dispatch => {
  return {
    loadCards: collectionId => {
      dispatch(getCollectionCards(collectionId))
    },
    loadInitialData: userId => {
      //at some point this will have to refer to an actual user
      dispatch(getAllUserCollections(userId))
    },
    createDeck: deckName => {
      dispatch(createDeck(deckName))
    }
  }
}

export default connect(mapState, mapDispatch)(CollectionList)
