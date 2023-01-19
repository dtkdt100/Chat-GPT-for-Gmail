import { defaults } from 'lodash-es'
import Browser from 'webextension-polyfill'

// export async function getUserConfig() { // 1-on, 0-off
//   const result = await Browser.storage.local.get(['on'])
//   return defaults(result, { on: 1 })
// }

// export async function updateUserConfig(updates) {
//   return Browser.storage.local.set(updates)
// }



export enum EnableMode {
  Off = 0,
  On = 1,
}

// export const TRIGGER_MODE_TEXT = {
//   [TriggerMode.Always]: 'Always',
//   [TriggerMode.QuestionMark]: 'When query ends with question mark (?)',
//   [TriggerMode.Manually]: 'Manually',
// }

const userConfigWithDefaultValue = {
  on: EnableMode.On,
  subject: EnableMode.On,
}

export type UserConfig = typeof userConfigWithDefaultValue

export async function getUserConfig(): Promise<UserConfig> {
  const result = await Browser.storage.local.get(Object.keys(userConfigWithDefaultValue))
  return defaults(result, userConfigWithDefaultValue)
}

export async function updateUserConfig(updates: Partial<UserConfig>) {
  return Browser.storage.local.set(updates)
}

export async function onChanged(callBack) {
  Browser.storage.local.onChanged.addListener(callBack);
}
