import React, { Component } from 'react'
import { withApollo } from 'react-apollo'

import * as query from '../../config/query'
import Link from '../Link'

class Search extends Component {

  state = {
    links: [],
    filter: ''
  }

  render() {
    const { links } = this.state
    return (
      <div>
        <div>
          Search
          <input
            type='text'
            onChange={e => this.setState({ filter: e.target.value })}
          />
          <button onClick={() => this._executeSearch()}>OK</button>
        </div>
        {links.map((link, index) => (
          <Link key={link.id} link={link} index={index} />
        ))}
      </div>
    )
  }

  _executeSearch = async () => {
    const { filter } = this.state
    const result = await this.props.client.query({
      query: query.FEED_SEARCH_QUERY,
      variables: { filter },
    })
    const links = result.data.feed.links
    this.setState({ links })
  }
}

export default withApollo(Search)
// withApollo - прокидывает props client в компонент -> можно использовать client.query для работы с graphql
// When wrapped around a component, it injects the 'ApolloClient' instance into the component's props