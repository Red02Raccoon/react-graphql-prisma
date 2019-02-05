import React, { Component } from 'react'
import { Mutation } from 'react-apollo'

import { AUTH_TOKEN } from '../../config/constants'
import { timeDifferenceForDate, getData } from "../../utils"
import * as mutation from "../../config/mutation"

class Link extends Component {
  render() {
    const authToken = getData(AUTH_TOKEN)
    const { link } = this.props
    return (
      <div className="flex mt2 items-start">
        <div className="flex items-center">
          <span className="gray">{this.props.index + 1}.</span>
          
          {authToken && (
            <Mutation 
              mutation={mutation.VOTE_MUTATION}
              variables={{ linkId: link.id }}
              update={(store, { data: { vote } }) => this.props.updateStoreAfterVote(store, vote, link.id)
            }>
              {voteMutation => (
                <div className="ml1 gray f11" onClick={voteMutation}>
                  ▲
                </div>
              )}
            </Mutation>
          )}
        </div>
        <div className="ml1">
          <div>
            {link.description} ({link.url})
          </div>

          <div className="f6 lh-copy gray">
            {link.votes.length} votes | by{' '}
            {link.postedBy
              ? link.postedBy.name
              : 'Unknown'}{' '}
            {timeDifferenceForDate(link.createdAt)}
          </div>

        </div>
      </div>
    )
  }
}

export default Link