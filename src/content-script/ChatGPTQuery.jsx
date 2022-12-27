import { useEffect, useState } from 'preact/hooks'
import PropTypes from 'prop-types'
import ReactMarkdown from 'react-markdown'
import rehypeHighlight from 'rehype-highlight'
import Browser from 'webextension-polyfill'

function ChatGPTQuery(props) {
  const [answer, setAnswer] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    const port = Browser.runtime.connect()
    const listener = (msg) => {
      if (msg.text) {
        setAnswer(msg)
      } else if (msg.error === 'UNAUTHORIZED' || msg.error === 'CLOUDFLARE') {
        setError(msg.error)
      } else {
        setError('EXCEPTION')
      }
    }
    port.onMessage.addListener(listener)
    port.postMessage({ question: props.question })
    return () => {
      port.onMessage.removeListener(listener)
      port.disconnect()
    }
  }, [props.question])

  if (answer) {
    return (
      <div id="answer" dir="auto">
        <ReactMarkdown rehypePlugins={[[rehypeHighlight, { detect: true }]]}>
          {answer.text}
        </ReactMarkdown>
      </div>
    )
  }

  if (error === 'UNAUTHORIZED') {
    return (
      <p className="gpt-inner" id="chatGPTError">
        Please login at{' '}
        <a href="https://chat.openai.com" target="_blank" rel="noreferrer">
          chat.openai.com
        </a>{' '}
        first
      </p>
    )
  }
  if (error === 'CLOUDFLARE') {
    return (
      <p className="gpt-inner" id="chatGPTError">
        Please pass Cloudflare security check at{' '}
        <a href="https://chat.openai.com" target="_blank" rel="noreferrer">
          chat.openai.com
        </a>{' '}
      </p>
    )
  }
  if (error) {
    return <p className="gpt-inner" id="chatGPTError">Failed to load response from ChatGPT</p>
  }

  return <p className="gpt-loading gpt-inner" id="chatGPTError">Waiting for ChatGPT response...</p>
}

ChatGPTQuery.propTypes = {
  question: PropTypes.string.isRequired,
}

export default ChatGPTQuery
