import React, { Component } from 'react'
import { Mutation } from 'react-apollo'

import * as mutation from "../../config/mutation"
import * as query from "../../config/query"

class CreateLink extends Component {
  state = {
    description: '',
    url: '',
  }

  render() {
    const { description, url } = this.state
    return (
      <div>
        <div className="flex flex-column mt3">
          <input
            className="mb2"
            value={description}
            onChange={e => this.setState({ description: e.target.value })}
            type="text"
            placeholder="A description for the link"
          />
          <input
            className="mb2"
            value={url}
            onChange={e => this.setState({ url: e.target.value })}
            type="text"
            placeholder="The URL for the link"
          />
        </div>
        <Mutation
          mutation={ mutation.POST_MUTATION }
          variables={{ description, url }}
          onCompleted={() => this.props.history.push('/')}
          update={(store, { data: { post } }) => {
            const data = store.readQuery({ query: query.FEED_QUERY })
            data.feed.links.unshift(post)
            store.writeQuery({
              query: query.FEED_QUERY,
              data
            })
          }}
  >
          { postMutation => <button onClick={ postMutation }>Submit</button> }
        </Mutation>
      </div>
    )
  }
}

export default CreateLink