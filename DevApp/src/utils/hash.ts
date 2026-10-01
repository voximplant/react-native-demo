import md5 from 'blueimp-md5'

export const hash = (value: string) => md5(value)
