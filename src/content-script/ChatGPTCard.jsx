import { LightBulbIcon, SearchIcon } from '@primer/octicons-react'
import { useState } from 'preact/hooks'
import PropTypes from 'prop-types'
import ChatGPTQuery from './ChatGPTQuery'


function ChatGPTCard(props) {
  const [triggered, setTriggered] = useState(false)
  if (props.triggerMode === 'always') {
    return <ChatGPTQuery question={props.question} />
  }
  
  if (triggered) {
    return <ChatGPTQuery question={props.question} />
  }
  return (
    <p className="gpt-inner manual-btn icon-and-text" onClick={() => setTriggered(true)}>
      <SearchIcon size="small" /> Ask ChatGPT for this query
    </p>
  )
}

ChatGPTCard.propTypes = {
  question: PropTypes.string.isRequired,
  triggerMode: PropTypes.string.isRequired,
}

export default ChatGPTCard
