import { SwitchField } from '../switch'

type Props = {
  label: string
  value: boolean
  onValueChange: (value: boolean) => void
}

export const ListItemToggle: React.FC<Props> = ({
  label,
  value,
  onValueChange,
  ...props
}) => (
  <SwitchField
    label={label}
    value={value}
    onValueChange={onValueChange}
    {...props}
  />
)
