import { Select, type SelectOption } from '@/shared/ui'
import { ConnectionNode } from '@voximplant/react-native-core'

const OPTIONS: SelectOption<ConnectionNode>[] = Object.values(
  ConnectionNode
).map((v) => ({
  label: v,
  value: v
}))

type Props = {
  value: ConnectionNode | null
  error?: string
  onChange: (node: ConnectionNode) => void
}

export const ConnectionNodeSelect: React.FC<Props> = ({
  value,
  error,
  onChange,
  ...props
}) => (
  <Select
    value={value}
    options={OPTIONS}
    label='Node'
    placeholder='Select node'
    error={error}
    onChange={onChange}
    {...props}
  />
)
