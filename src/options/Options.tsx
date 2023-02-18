import { useEffect } from 'preact/hooks'
import './styles.css'
import ProviderSelect from './ProviderSelect'



function Options() {
  useEffect(() => {
    
  }, [])

  return (
    <ul>
      <div class="logo">
        <img src="../logo_128.png" />
        <h1 data-message="extension_name">ChatGPT for Gmail</h1>
      </div>
      <hr></hr>
      <h1 data-message="extension_name">AI Provider</h1>
      <ProviderSelect />
    </ul>
  )
}

export default Options


