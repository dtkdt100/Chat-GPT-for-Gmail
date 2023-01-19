import { useCallback, useEffect, useState } from 'preact/hooks'
import { getUserConfig, updateUserConfig, EnableMode } from '../config'
import './styles.css'

function getGithubLogoSvg() {
  return <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="19px" height="19px" viewBox="0 0 19 18" version="1.1">
  <g id="surface1">
  <path style=" stroke:none;fill-rule:evenodd;fill:rgb(14.117647%,16.078431%,18.431373%);fill-opacity:1;" d="M 9.472656 0 C 4.234375 0 0 4.125 0 9.226562 C 0 13.308594 2.714844 16.761719 6.476562 17.984375 C 6.945312 18.074219 7.121094 17.785156 7.121094 17.539062 C 7.121094 17.324219 7.105469 16.59375 7.105469 15.828125 C 4.46875 16.378906 3.921875 14.726562 3.921875 14.726562 C 3.496094 13.660156 2.871094 13.382812 2.871094 13.382812 C 2.007812 12.820312 2.933594 12.820312 2.933594 12.820312 C 3.890625 12.878906 4.390625 13.765625 4.390625 13.765625 C 5.238281 15.171875 6.601562 14.773438 7.152344 14.53125 C 7.230469 13.933594 7.480469 13.519531 7.746094 13.292969 C 5.644531 13.078125 3.433594 12.285156 3.433594 8.738281 C 3.433594 7.730469 3.808594 6.90625 4.40625 6.265625 C 4.3125 6.035156 3.984375 5.085938 4.5 3.820312 C 4.5 3.820312 5.300781 3.574219 7.105469 4.765625 C 7.875 4.566406 8.671875 4.460938 9.472656 4.460938 C 10.269531 4.460938 11.085938 4.566406 11.839844 4.765625 C 13.644531 3.574219 14.441406 3.820312 14.441406 3.820312 C 14.960938 5.085938 14.628906 6.035156 14.535156 6.265625 C 15.148438 6.90625 15.507812 7.730469 15.507812 8.738281 C 15.507812 12.285156 13.296875 13.0625 11.179688 13.292969 C 11.527344 13.582031 11.824219 14.132812 11.824219 15.003906 C 11.824219 16.242188 11.808594 17.234375 11.808594 17.539062 C 11.808594 17.785156 11.980469 18.074219 12.453125 17.984375 C 16.214844 16.761719 18.925781 13.308594 18.925781 9.226562 C 18.941406 4.125 14.695312 0 9.472656 0 Z M 9.472656 0 "/>
  </g>
  </svg>
}

function Popup() {
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
      <form class="setting">
        <input type="checkbox" id="enable" name="enable" class="switch-input" checked={Boolean(enableMode)} onChange={(val) => onEnableModeChange(val.target.checked ? 1 : 0 as EnableMode)}></input>
        <label for="enable" class="switch-label"><span data-message="enable">Enable extension on Gmail</span></label>
      </form>
      <form class="setting">
        <input type="checkbox" id="subjectCompletion" name="subjectCompletion" class="switch-input" checked={Boolean(subjectCompletion)} onChange={(val) => onSubjectChange(val.target.checked ? 1 : 0 as EnableMode)}></input>
        <label for="subjectCompletion" class="switch-label"><span data-message="subjectCompletion">Subject Completion</span></label>
      </form>
      <hr></hr>
      <a href={"https://github.com/dtkdt100/Chat-GPT-for-Gmail"} target="_blank" class="teaser">
        <div style="text-align: center;">
          <span data-message="sourceCode">Source code </span>
          {getGithubLogoSvg()}
          <br></br>
          ⭑⭑⭑⭑⭑
        </div>
      </a>
    </ul>
  )
}

export default Popup


