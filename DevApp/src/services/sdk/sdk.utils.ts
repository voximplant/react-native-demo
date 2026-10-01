import { hash } from '@/utils'
import { USERNAME_SUFFIX } from './sdk.constants'

export const hashOtk = (username: string, password: string, otk: string) => {
  const cleanUsername = username.split('@')[0]

  return hash(`${otk}|${hash(`${cleanUsername}:voximplant.com:${password}`)}`)
}

export const toFullUsername = (username: string) => {
  return `${username}${USERNAME_SUFFIX}`
}
