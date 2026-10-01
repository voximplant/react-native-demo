import { sdkService } from '@/services/sdk'
import { createContext, useState, type PropsWithChildren } from 'react'
import { createMediaStore, type MediaStore } from './media.store'

type MediaCtx = MediaStore

export const MediaContext = createContext<MediaCtx | null>(null)

export const MediaProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [store] = useState(() => createMediaStore(sdkService.video))

  return <MediaContext.Provider value={store}>{children}</MediaContext.Provider>
}
