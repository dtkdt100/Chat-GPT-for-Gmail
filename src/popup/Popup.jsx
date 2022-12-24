import '@picocss/pico'
import { useCallback, useEffect, useState } from 'preact/hooks'
import { getUserConfig, updateUserConfig, TRIGGER_MODES } from '../config'
import './styles.css'

function Popup() {
  const [triggerMode, setTriggerMode] = useState()

  useEffect(() => {
    getUserConfig().then((config) => {
      setTriggerMode(config.on || 1)
      document.querySelector("input[type=checkbox]").checked = config.on;
    })
  }, [])

  function onTriggerModeChange(event) {
    const checkbox = event.target;
    const enable = checkbox.checked ? 1 : 0;
    setTriggerMode(enable)
    updateUserConfig({ on: enable })
  }


  return (
    <div className="container">
      <form>
        <fieldset>
          <legend>Enable ChatGPT for Gmail</legend>
          <label className="switch">
            <input type="checkbox" onChange={onTriggerModeChange} />
            <span className="slider round"></span>
          </label>
        </fieldset>
      </form>
    </div>
  )
}

export default Popup
