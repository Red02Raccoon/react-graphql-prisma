import React, { Component, Fragment } from 'react'
import { Query } from 'react-apollo'

import * as query from "../../config/query"
import * as subscription from "../../config/subscription"
import { LINKS_PER_PAGE } from "../../config/constants"
import Link from '../Link'

class LinkList extends Component {
  render() {

    return (
      <Query query={query.FEED_QUERY} variables={this._getQueryVariables()}>
        {({ loading, error, data, subscribeToMore }) => {
          if (loading) return <div>Fetching</div>
          if (error) return <div>Error</div>

          this._subscribeToNewLinks(subscribeToMore)
          this._subscribeToNewVotes(subscribeToMore)

          const linksToRender = this._getLinksToRender(data)
          const isNewPage = this.props.location.pathname.includes('new')
          const pageIndex = this.props.match.params.page ? (this.props.match.params.page - 1) * LINKS_PER_PAGE : 0
       
          return (
            <Fragment>
              {linksToRender.map((link, index) => (
                <Link
                  key={link.id}
                  link={link}
                  index={index + pageIndex}
                  updateStoreAfterVote={this._updateCacheAfterVote}
                />
              ))}

              {isNewPage && (
                <div className="flex ml4 mv3 gray">
                  <div className="pointer mr2" onClick={this._previousPage}>
                    Previous
                  </div>
                  <div className="pointer" onClick={() => this._nextPage(data)}>
                    Next
                  </div>
                </div>
              )}
            </Fragment>
 
          )
        } }
      </Query>
    )
  }

  _updateCacheAfterVote = (store, createVote, linkId) => {
    const isNewPage = this.props.location.pathname.includes('new')
    const page = parseInt(this.props.match.params.page, 10)
  
    const skip = isNewPage ? (page - 1) * LINKS_PER_PAGE : 0
    const first = isNewPage ? LINKS_PER_PAGE : 100
    const orderBy = isNewPage ? 'createdAt_DESC' : null
    const data = store.readQuery({ //'readQuery' always reads data from the local cache while 'query' might retrieve data either from the cache or remotely
      query: query.FEED_QUERY,
      variables: { first, skip, orderBy }
    })
  
    const votedLink = data.feed.links.find(link => link.id === linkId)
    votedLink.votes = createVote.link.votes
  
    store.writeQuery({ query: query.FEED_QUERY, data })
  }

  _subscribeToNewLinks = subscribeToMore => {
    subscribeToMore({
      document: subscription.NEW_LINKS_SUBSCRIPTION,
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev
        const newLink = subscriptionData.data.newLink.node
  
        return Object.assign({}, prev, {
          feed: {
            links: [newLink, ...prev.feed.links],
            count: prev.feed.links.length + 1,
            __typename: prev.feed.__typename
          }
        })
      }
    })
  }

  _subscribeToNewVotes = subscribeToMore => {
    subscribeToMore({
      document: subscription.NEW_VOTES_SUBSCRIPTION
    })
  }

  _getQueryVariables = () => {
    const isNewPage = this.props.location.pathname.includes('new')
    const page = parseInt(this.props.match.params.page, 10)
  
    const skip = isNewPage ? (page - 1) * LINKS_PER_PAGE : 0
    const first = isNewPage ? LINKS_PER_PAGE : 100
    const orderBy = isNewPage ? 'createdAt_DESC' : null

    return { first, skip, orderBy }
  }

  _getLinksToRender = data => {
    const isNewPage = this.props.location.pathname.includes('new')
    if (isNewPage) {
      return data.feed.links
    }
    const rankedLinks = data.feed.links.slice()
    rankedLinks.sort((l1, l2) => l2.votes.length - l1.votes.length)

    return rankedLinks
  }

  _nextPage = data => {
    const page = parseInt(this.props.match.params.page, 10)

    if (page <= data.feed.count / LINKS_PER_PAGE) {
      const nextPage = page + 1
      this.props.history.push(`/new/${nextPage}`)
    }
  }
  
  _previousPage = () => {
    const page = parseInt(this.props.match.params.page, 10)
    if (page > 1) {
      const previousPage = page - 1
      this.props.history.push(`/new/${previousPage}`)
    }
  }
}

export default LinkList