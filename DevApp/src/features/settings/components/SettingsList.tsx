import { en } from '@/constants'
import { useSettingsNavigation } from '@/navigation'
import { useSettings } from '@/providers/settings'
import { useTheme } from '@/providers/theme'
import {
  ListItemNav,
  ListItemToggle,
  ListSection,
  ListSubsection
} from '@/shared/ui'
import { SPACING } from '@/styles/theme'
import { capitalize } from '@/utils'
import { ScrollView } from 'react-native'
import { AudioDeviceSelectItem } from './AudioDeviceSelectItem'

export const SettingsList = () => {
  const { navigate } = useSettingsNavigation()
  const isDark = useTheme((s) => s.isDark)
  const toggleTheme = useTheme((s) => s.toggleTheme)

  const audioDeviceType = useSettings((s) => s.audioDeviceType)

  return (
    <ScrollView
      contentContainerStyle={{
        padding: SPACING.m
      }}
    >
      <ListSection title={en.app.name}>
        <ListSubsection title='Appearance'>
          <ListItemToggle
            label='Dark mode'
            value={isDark}
            onValueChange={toggleTheme}
          />
        </ListSubsection>
      </ListSection>

      <ListSection title='App behavior'>
        <ListSubsection title='Audio devices'>
          <AudioDeviceSelectItem />

          <ListItemNav
            label='Type'
            value={capitalize(audioDeviceType, {
              lowercaseRest: true
            })}
            onPress={() => navigate('AudioDeviceTypeSelect')}
          />
        </ListSubsection>
      </ListSection>
    </ScrollView>
  )
}
