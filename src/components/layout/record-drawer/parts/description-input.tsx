import { Input } from "@/components/ui/input"

type DescriptionInputProps = {
  description: string
  onDescriptionChange: (description: string) => void
  isSubmitting: boolean
}

export const DescriptionInput = ({
  description,
  onDescriptionChange,
  isSubmitting,
}: DescriptionInputProps) => {
  return (
    <Input
      value={description}
      onChange={(e) => onDescriptionChange(e.target.value)}
      disabled={isSubmitting}
      placeholder="这一笔钱变成了什么？"
      aria-label="描述"
      className="h-11 text-base disabled:cursor-not-allowed disabled:opacity-50"
    />
  )
}
