import { defaults } from 'lodash-es'
import Browser from 'webextension-polyfill'

export async function getUserConfig() { // 1-on, 0-off
  const result = await Browser.storage.local.get(['on'])
  return defaults(result, { on: 1 })
}

export async function updateUserConfig(updates) {
  return Browser.storage.local.set(updates)
}

export async function onChanged(callBack) {
  Browser.storage.local.onChanged.addListener(callBack);
}