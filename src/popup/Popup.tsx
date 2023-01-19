import { useCallback, useEffect, useState } from 'preact/hooks'
import { getUserConfig, updateUserConfig, EnableMode } from '../config'
import './styles.css'


function Popup() {
  const [enableMode, setEnableMode] = useState<EnableMode>(EnableMode.On)
  const [subjectCompletion, setSubjectCompletion] = useState<EnableMode>(EnableMode.On)

  useEffect(() => {
    getUserConfig().then((config) => {
      setEnableMode(config.on)
      setSubjectCompletion(config.subject)
    })
  }, [])

  const onEnableModeChange = useCallback((mode: EnableMode) => {
    console.log(mode);
    setEnableMode(mode)
    updateUserConfig({ on: mode })
  }, [])

  const onSubjectChange = useCallback((mode: EnableMode) => {
    setSubjectCompletion(mode)
    updateUserConfig({ subject: mode })
  }, [])


  return (
    <div className="container">
      <form>
        <fieldset>
          <legend>Enable ChatGPT for Gmail</legend>
          <label className="switch">
            <input type="checkbox" checked={Boolean(enableMode)} onChange={(val) => onEnableModeChange(val.target.checked ? 1 : 0 as EnableMode)} />
            <span className="slider round"></span>
          </label>
        </fieldset>

        <fieldset>
          <legend>Enable Subject Completion</legend>
          <label className="switch">
          <input type="checkbox" checked={Boolean(subjectCompletion)} onChange={(val) => onSubjectChange(val.target.checked ? 1 : 0 as EnableMode)} />
            <span className="slider round"></span>
          </label>
        </fieldset>
      </form>
    </div>
  )
}

export default Popup
