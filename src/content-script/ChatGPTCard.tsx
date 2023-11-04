import { useState } from 'preact/hooks'
import ChatGPTQuery, { QueryStatus } from './ChatGPTQuery'

interface Props {
  question: string
  onStatusChange?: (status: QueryStatus) => void
}

function ChatGPTCard(props: Props) {
  const [triggered, setTriggered] = useState(false)
  return <ChatGPTQuery question={props.question} onStatusChange={props.onStatusChange} />
}

export default ChatGPTCard