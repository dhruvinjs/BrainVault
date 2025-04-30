import React from "react"

export const InputBoxes = React.forwardRef<HTMLInputElement, {
  type: string
  placeholder: string
  value?: string
  onChange?: (e: any) => void,
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void
}>(({ type, placeholder, value, onChange,onKeyDown }, ref) => {
  return (
    <input
      ref={ref}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required
      className="px-4 py-2 outline-purple-500 rounded-md border"
      onKeyDown={onKeyDown}
    />
  )
})
