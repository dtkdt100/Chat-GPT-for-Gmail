import { useState } from 'preact/hooks'
import ChatGPTQuery from './ChatGPTQuery'


function ChatGPTCard(props) {
  const [] = useState(false)
  return <ChatGPTQuery question={props.question} />
}

export default ChatGPTCard
