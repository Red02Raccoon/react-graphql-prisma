import React from 'react'

import { getData } from '../../utils'

export default () => {
  return(
    <div style={{marginRight: "20px"}}>
      {`Welcome, ${getData('user-name')} !!!` }
    </div>
  )
}