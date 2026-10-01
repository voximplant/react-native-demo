import type { IconName, ToggleGroupOption } from '@/shared/ui'
import z from 'zod'

export const JOIN_MODES = ['call', 'conference'] as const

export type JoinMode = (typeof JOIN_MODES)[number]

export const JOIN_SETTINGS_LABELS = {
  sendVideo: 'Send video',
  receiveVideo: 'Receive video',
  muteAudio: 'Mute audio'
} as const

export type JoinSettingField = keyof typeof JOIN_SETTINGS_LABELS

export type JoinConfig = {
  label: string
  icon: IconName
  placeholder: string
  fab: { label: string; icon: IconName }
  settings: JoinSettingField[]
}

export const JOIN_CONFIG: Record<JoinMode, JoinConfig> = {
  call: {
    label: 'Call',
    icon: 'phone',
    placeholder: 'Call number',
    fab: { label: 'Call', icon: 'phone' },
    settings: ['sendVideo', 'receiveVideo', 'muteAudio']
  },
  conference: {
    label: 'Conference',
    icon: 'users',
    placeholder: 'Conference number',
    fab: { label: 'Conference', icon: 'users' },
    settings: ['sendVideo', 'muteAudio']
  }
}

export const JOIN_OPTIONS: ToggleGroupOption<JoinMode>[] = JOIN_MODES.map(
  (value) => ({
    value,
    label: JOIN_CONFIG[value].label,
    icon: JOIN_CONFIG[value].icon
  })
)

export const joinFormSchema = z
  .object({
    mode: z.enum(JOIN_MODES),
    callDestination: z.string(),
    conferenceDestination: z.string(),
    sendVideo: z.boolean(),
    receiveVideo: z.boolean(),
    muteAudio: z.boolean()
  })
  .refine(
    (data) => (data.mode === 'call' ? data.callDestination.length > 0 : true),
    {
      message: 'Call number is required',
      path: ['callDestination']
    }
  )
  .refine(
    (data) =>
      data.mode === 'conference' ? data.conferenceDestination.length > 0 : true,
    {
      message: 'Conference number is required',
      path: ['conferenceDestination']
    }
  )

export type JoinFormData = z.infer<typeof joinFormSchema>
