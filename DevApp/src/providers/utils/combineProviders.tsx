import type { Provider } from '../provider.types'

export const combineProviders = (list: Provider[], children: React.ReactNode) =>
  (list.filter(Boolean) as Provider[]).reduceRight(
    (acc, Provider) => <Provider>{acc}</Provider>,
    <>{children}</>
  )
