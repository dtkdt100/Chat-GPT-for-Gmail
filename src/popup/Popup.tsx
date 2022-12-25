import { useCallback, useEffect, useState } from 'preact/hooks'
import { getUserConfig, updateUserConfig } from '../config'
import './styles.css'


function Popup() {
  const [number, setTriggerMode] = useState<number>()

  useEffect(() => {
    getUserConfig().then((config) => {
      setTriggerMode(config.on || 1)
      const checkbox = document.querySelector('input[type=checkbox]');
      if (checkbox && 'checked' in checkbox) {
        checkbox.checked = config.on;
      }
    })
  }, [])

  function onTriggerModeChange(event) {
    const checkbox = event.target;
    const enable: number = (checkbox.checked) ? 1 : 0;
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
