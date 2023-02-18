import { useCallback, useEffect, useState } from 'preact/hooks'
import { getUserConfig, updateUserConfig, EnableMode } from '../config'
import './styles.css'
import ProviderSelect from './ProviderSelect'


function Options() {
  const [enableMode, setEnableMode] = useState<EnableMode>(EnableMode.Off)
  const [subjectCompletion, setSubjectCompletion] = useState<EnableMode>(EnableMode.Off)

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
    <ul>
      <div class="logo">
        <img src="../logo_128.png" />
        <h1 data-message="extension_name">ChatGPT for Gmail</h1>
      </div>
      <hr></hr>
      <h1 data-message="extension_name">AI Provider</h1>
      {/* <Text h3 className="mt-5 mb-0">
        AI Provider
      </Text> */}
      <ProviderSelect />
    </ul>
  )
}

export default Options


