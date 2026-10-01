import { KeyboardProvider } from 'react-native-keyboard-controller'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { AuthProvider } from './auth/AuthProvider'
import { GlobalLoadingProvider } from './globalLoading/GlobalLoadingProvider'
import type { Provider } from './provider.types'
import { ThemeProvider } from './theme/ThemeProvider'
import { combineProviders } from './utils/combineProviders'

const providers: Provider[] = [
  SafeAreaProvider,
  KeyboardProvider,
  ThemeProvider,
  AuthProvider,
  GlobalLoadingProvider
]

export const RootProvider: Provider = ({ children }) =>
  combineProviders(providers, children)
