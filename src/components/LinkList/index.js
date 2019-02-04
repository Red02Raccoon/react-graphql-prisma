import React, { Component } from 'react'
import { Query } from 'react-apollo'

import * as query from "../../config/query"
import Link from '../Link'

class LinkList extends Component {
  render() {

    return (
      <Query query={query.FEED_QUERY}>
        {({ loading, error, data }) => {
          if (loading) return <div>Fetching</div>
          if (error) return <div>Error</div>
    
          const linksToRender = data.feed.links
    
          return (
            <div>
              {linksToRender.map((link, index) => <Link key={link.id} link={link} index={index} updateStoreAfterVote={this._updateCacheAfterVote}/>)}
            </div>
          )
        } }
      </Query>
    )
  }

  _updateCacheAfterVote = (store, createVote, linkId) => {
    const data = store.readQuery({ query: query.FEED_QUERY })
  
    const votedLink = data.feed.links.find(link => link.id === linkId)
    votedLink.votes = createVote.link.votes
  
    store.writeQuery({ query: query.FEED_QUERY, data })
  }
}

export default LinkList