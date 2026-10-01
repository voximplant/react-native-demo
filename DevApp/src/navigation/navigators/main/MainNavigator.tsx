import { CallProvider, CallScreen, CallScreenGuard } from '@/features/call'
import {
  ConferenceProvider,
  ConferenceScreen,
  ConferenceScreenGuard
} from '@/features/conference'
import { HomeScreen } from '@/features/home'
import {
  IncomingCallProvider,
  IncomingCallScreen,
  IncomingCallScreenGuard,
  usePendingIncomingCallHandler
} from '@/features/incomingCall'
import { SettingsButton } from '@/features/settings'
import { SettingsLayout } from '@/features/settings/layouts'
import { MainLayout } from '@/layouts'
import type { MainStackParamList } from '@/navigation'
import { useThemeTokens } from '@/providers/theme'
import { ResetHomeButton, LogoutButton } from '@/shared/components'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { SettingsNavigator } from './SettingsNavigator'

const MainStack = createNativeStackNavigator<MainStackParamList>()

export const MainNavigator = () => {
  const theme = useThemeTokens()
  usePendingIncomingCallHandler()

  return (
    <MainStack.Navigator
      screenOptions={{
        headerShown: true,
        headerTitle: '',
        headerShadowVisible: false,
        headerStyle: { backgroundColor: theme.colors.background },
        headerTintColor: theme.colors.text,
        headerLeft: () => <LogoutButton />,
        headerRight: () => <SettingsButton />
      }}
    >
      <MainStack.Screen
        name='Home'
        component={HomeScreen}
        layout={({ children }) => <MainLayout>{children}</MainLayout>}
      />

      <MainStack.Screen
        name='Settings'
        options={{
          headerShown: false,
          presentation: 'modal',
          animation: 'slide_from_bottom',
          gestureEnabled: true
        }}
        component={SettingsNavigator}
        layout={({ children }) => <SettingsLayout>{children}</SettingsLayout>}
      />

      <MainStack.Screen
        name='Call'
        options={{
          gestureEnabled: false,
          fullScreenGestureEnabled: false,
          headerLeft: () => <ResetHomeButton />
        }}
      >
        {({ route }) => (
          <CallScreenGuard callId={route.params.callId}>
            {(call) => (
              <CallProvider call={call}>
                <MainLayout>
                  <CallScreen />
                </MainLayout>
              </CallProvider>
            )}
          </CallScreenGuard>
        )}
      </MainStack.Screen>

      <MainStack.Screen
        name='IncomingCall'
        options={{
          headerShown: false,
          animation: 'fade',
          gestureEnabled: false,
          fullScreenGestureEnabled: false
        }}
      >
        {({ route }) => {
          return (
            <IncomingCallScreenGuard callId={route.params.callId}>
              {(incomingCall) => (
                <IncomingCallProvider
                  call={incomingCall}
                  withVideo={route.params.withVideo}
                >
                  <IncomingCallScreen />
                </IncomingCallProvider>
              )}
            </IncomingCallScreenGuard>
          )
        }}
      </MainStack.Screen>

      <MainStack.Screen
        name='Conference'
        options={{
          gestureEnabled: false,
          fullScreenGestureEnabled: false,
          headerLeft: () => <ResetHomeButton />
        }}
      >
        {({ route }) => (
          <ConferenceScreenGuard conferenceId={route.params.conferenceId}>
            {(conference) => (
              <ConferenceProvider conference={conference}>
                <MainLayout>
                  <ConferenceScreen />
                </MainLayout>
              </ConferenceProvider>
            )}
          </ConferenceScreenGuard>
        )}
      </MainStack.Screen>
    </MainStack.Navigator>
  )
}
