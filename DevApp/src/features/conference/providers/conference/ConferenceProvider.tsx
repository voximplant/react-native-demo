import { useActiveSessionLifecycle } from '@/providers/activeSession'
import { type Conference } from '@voximplant/react-native-calls'
import {
  createContext,
  useEffect,
  useState,
  type PropsWithChildren
} from 'react'
import { createConferenceStore, type ConferenceStore } from '../../store'

type ConferenceCtx = ConferenceStore

export const ConferenceContext = createContext<ConferenceCtx | null>(null)

type Props = PropsWithChildren<{
  conference: Conference
}>

export const ConferenceProvider: React.FC<Props> = ({
  conference,
  children
}) => {
  useActiveSessionLifecycle(conference.id)

  const [store] = useState(() => createConferenceStore(conference))

  useEffect(() => {
    return () => store.destroy()
  }, [store])

  return (
    <ConferenceContext.Provider value={store}>
      {children}
    </ConferenceContext.Provider>
  )
}
