export const logger = {
  info: (scope: string, method: string, ...args: any[]) => {
    console.info(`[${scope}] ${method}`, ...args)
  },
  warn: (scope: string, method: string, ...args: any[]) => {
    console.warn(`[${scope}] ${method}`, ...args)
  },
  error: (scope: string, method: string, ...args: any[]) => {
    console.error(`[${scope}] ${method}`, ...args)
  },
  debug: (scope: string, method: string, ...args: any[]) => {
    console.debug(`[${scope}] ${method}`, ...args)
  }
}
