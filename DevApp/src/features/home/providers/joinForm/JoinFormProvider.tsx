import { createContext, useState, type PropsWithChildren } from "react"
import { createJoinFormStore, type JoinFormStore } from "./joinForm.store"

type JoinFormCtx = JoinFormStore

export const JoinFormContext = createContext<JoinFormCtx | null>(null)

export const JoinFormProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [store] = useState(() => createJoinFormStore())

  return (
    <JoinFormContext.Provider value={store}>
      {children}
    </JoinFormContext.Provider>
  )
}
