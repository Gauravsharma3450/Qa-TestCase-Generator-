'use client'

interface TextInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export default function TextInput({ value, onChange, placeholder }: TextInputProps) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full h-48 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
    />
  )
}
