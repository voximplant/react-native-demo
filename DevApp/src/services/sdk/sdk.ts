import { logger } from '@/utils'
import type {
  ConnectionNode,
  LoginResult,
  LoginTokens
} from '@voximplant/react-native-core'
import {
  Client,
  ClientState,
  Core,
  LoginTokenExpiredError
} from '@voximplant/react-native-core'
import { AudioDeviceManagerService } from './audioDeviceManager/audioDeviceManager'
import { CallManagerService } from './callManager'
import type { LoginParams, TokenLoginParams } from './sdk.types'
import { hashOtk } from './sdk.utils'
import { VideoService } from './video'

interface DisconnectOptions {
  silent?: boolean
}

class SDKService {
  private static _instance: SDKService | null = null

  private readonly client = Client.getInstance()
  private readonly core = Core.getInstance()

  private constructor() {}

  static get instance(): SDKService {
    if (!SDKService._instance) SDKService._instance = new SDKService()
    return SDKService._instance
  }

  init(): void {
    this.core.initialize()
  }

  initMainServices(): void {
    AudioDeviceManagerService.init()
    VideoService.init()
    CallManagerService.init()
  }

  get audioDeviceManager(): AudioDeviceManagerService {
    return AudioDeviceManagerService.instance
  }

  get video(): VideoService {
    return VideoService.instance
  }

  get callManager(): CallManagerService {
    return CallManagerService.instance
  }

  async connect(node: ConnectionNode, gateway?: string): Promise<void> {
    const gateways = gateway ? gateway.split(';') : []

    await this.disconnect()

    await this.client.connect({ node, gateways }).catch((err: unknown) => {
      logger.error(
        'SDK connect error',
        err instanceof Error ? err.message : 'unknown error'
      )
      throw err
    })
  }

  async disconnect(options?: DisconnectOptions): Promise<void> {
    if (this.client.state.value === ClientState.Disconnected) return

    try {
      await this.client.disconnect()
    } catch (err) {
      logger.error(
        'SDK disconnect error',
        err instanceof Error ? err.message : 'unknown error'
      )
      if (options?.silent) return
      throw err
    }
  }

  async passwordLogin(params: LoginParams): Promise<LoginResult> {
    await this.connect(params.node, params.gateway)

    try {
      return await this.client.login(params.username, params.password)
    } catch (err) {
      await this.disconnect({ silent: true })
      throw err
    }
  }

  async otkLogin(params: LoginParams): Promise<LoginResult> {
    await this.connect(params.node, params.gateway)

    try {
      const otk = await this.client.requestOneTimeKey(params.username)
      const hash = hashOtk(params.username, params.password, otk)

      return await this.client.loginWithOneTimeKey(params.username, hash)
    } catch (err) {
      await this.disconnect({ silent: true })
      throw err
    }
  }

  async tokenLogin(params: TokenLoginParams): Promise<LoginResult> {
    await this.connect(params.node, params.gateway)

    try {
      return await this.client.loginWithAccessToken(
        params.username,
        params.tokens.accessToken
      )
    } catch (err) {
      await this.disconnect({ silent: true })
      throw err
    }
  }

  async restoreLogin(params: TokenLoginParams): Promise<LoginTokens | null> {
    if (this.client.state.value === ClientState.LoggedIn) {
      return params.tokens
    }

    await this.connect(params.node, params.gateway)

    try {
      const res = await this.client.loginWithAccessToken(
        params.username,
        params.tokens.accessToken
      )

      return res.loginTokens
    } catch (err) {
      if (!(err instanceof LoginTokenExpiredError)) {
        await this.disconnect({ silent: true })
        throw err
      }
    }

    try {
      const res = await this.refreshTokenLogin(params)
      return res.loginTokens
    } catch (err) {
      await this.disconnect({ silent: true })
      throw err
    }
  }

  private async refreshTokenLogin(
    params: TokenLoginParams
  ): Promise<LoginResult> {
    const tokens = await this.client.refreshTokens(
      params.username,
      params.tokens.refreshToken
    )

    const res = await this.client.loginWithAccessToken(
      params.username,
      tokens.accessToken
    )

    return res
  }
}

export type { SDKService }
export const sdkService = SDKService.instance
