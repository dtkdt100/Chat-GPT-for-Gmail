import Browser from 'webextension-polyfill'

export async function getUserConfig() {
  return Browser.storage.local.get(['on']) // 1-on, 0-off
}

export async function updateUserConfig(updates) {
  return Browser.storage.local.set(updates)
}

export async function onChanged(callBack) {
  Browser.storage.local.onChanged.addListener(callBack);
}