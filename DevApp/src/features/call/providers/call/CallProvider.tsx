import { useActiveSessionLifecycle } from '@/providers/activeSession'
import { type Call } from '@voximplant/react-native-calls'
import {
  createContext,
  useEffect,
  useState,
  type PropsWithChildren
} from 'react'
import { createCallStore, type CallStore } from '../../store'

type CallCtx = CallStore

export const CallContext = createContext<CallCtx | null>(null)

type Props = PropsWithChildren<{
  call: Call
}>

export const CallProvider: React.FC<Props> = ({ call, children }) => {
  useActiveSessionLifecycle(call.id)

  const [store] = useState(() => createCallStore(call))

  useEffect(() => {
    return () => store.destroy()
  }, [store])

  return <CallContext.Provider value={store}>{children}</CallContext.Provider>
}
