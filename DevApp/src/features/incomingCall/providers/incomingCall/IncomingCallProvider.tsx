import { type Call } from '@voximplant/react-native-calls'
import {
  createContext,
  useEffect,
  useState,
  type PropsWithChildren
} from 'react'
import { createIncomingCallStore, type IncomingCallStore } from '../../store'

export type IncomingCallCtx = IncomingCallStore

export const IncomingCallContext = createContext<IncomingCallCtx | null>(null)

type Props = PropsWithChildren<{
  call: Call
  withVideo: boolean
}>

export const IncomingCallProvider: React.FC<Props> = ({
  call,
  withVideo,
  children
}) => {
  const [store] = useState(() => createIncomingCallStore(call, withVideo))
  useEffect(() => () => store.destroy(), [store])

  return (
    <IncomingCallContext.Provider value={store}>
      {children}
    </IncomingCallContext.Provider>
  )
}
