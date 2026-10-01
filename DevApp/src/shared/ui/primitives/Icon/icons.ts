import {
  ArrowLeftIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  ChevronUpIcon,
  HomeIcon,
  LogOutIcon,
  Maximize2Icon,
  MenuIcon,
  MicIcon,
  MicOffIcon,
  Minimize2Icon,
  MoonIcon,
  PauseIcon,
  PhoneIcon,
  PhoneOffIcon,
  PlayIcon,
  SettingsIcon,
  SunIcon,
  UsersIcon,
  VideoIcon,
  VideoOffIcon
} from 'lucide-react-native'

export const ICONS = {
  'arrow-left': ArrowLeftIcon,
  home: HomeIcon,
  'menu-burger': MenuIcon,
  leave: LogOutIcon,
  sun: SunIcon,
  moon: MoonIcon,
  'chevron-down': ChevronDownIcon,
  'chevron-up': ChevronUpIcon,
  settings: SettingsIcon,
  'chevron-right': ChevronRightIcon,
  phone: PhoneIcon,
  'phone-off': PhoneOffIcon,
  users: UsersIcon,
  maximize2: Maximize2Icon,
  minimize2: Minimize2Icon,
  mic: MicIcon,
  'mic-off': MicOffIcon,
  video: VideoIcon,
  'video-off': VideoOffIcon,
  pause: PauseIcon,
  play: PlayIcon
} as const

export type IconName = keyof typeof ICONS
