import { defaults } from 'lodash-es'
import Browser from 'webextension-polyfill'

export enum EnableMode {
  Off = 0,
  On = 1,
}

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
