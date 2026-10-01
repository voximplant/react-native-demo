import { RootLayout } from '@/layouts'
import { Navigation } from '@/navigation'
import { RootProvider } from '@/providers'

export default function App() {
  return (
    <RootProvider>
      <RootLayout>
        <Navigation />
      </RootLayout>
    </RootProvider>
  )
}
