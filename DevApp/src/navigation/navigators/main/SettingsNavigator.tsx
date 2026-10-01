import {
  AudioDeviceSelectScreen,
  AudioDeviceTypeSelectScreen,
  SettingsScreen
} from '@/features/settings'
import type { SettingsStackParamList } from '@/navigation'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

const SettingsStack = createNativeStackNavigator<SettingsStackParamList>()

export const SettingsNavigator = () => {
  return (
    <SettingsStack.Navigator screenOptions={{ headerShown: false }}>
      <SettingsStack.Screen name='SettingsScreen' component={SettingsScreen} />

      <SettingsStack.Screen
        name='AudioDeviceTypeSelect'
        component={AudioDeviceTypeSelectScreen}
        options={{
          presentation: 'containedTransparentModal',
          animation: 'fade'
        }}
      />

      <SettingsStack.Screen
        name='AudioDeviceSelect'
        component={AudioDeviceSelectScreen}
        options={{
          presentation: 'containedTransparentModal',
          animation: 'fade'
        }}
      />
    </SettingsStack.Navigator>
  )
}
