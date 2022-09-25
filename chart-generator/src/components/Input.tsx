import { ReactElement } from "react"

interface InputInterface {
  label: string
  value?: string
  onChange?: (event: any) => void
  placeholder?: string
  error: boolean
  id: string
}

const Input = ({
  label,
  value,
  id,
  error,
  onChange,
  placeholder
}: InputInterface): ReactElement => {
  return (
    <div className={`relative rounded-md border border-gray-300 px-3 py-2 shadow-sm focus-within:border-indigo-600 focus-within:ring-1 focus-within:ring-indigo-600 ${error ? 'rounded-md border-red-300' : ''}`}>
      <label className="absolute -top-2 left-2 -mt-px inline-block bg-white px-1 text-xs font-medium text-gray-900">{label}</label>
      <input
        id={id}
        type="text"
        value={value}
        onChange={onChange}
        className="block w-full border-0 p-0 text-gray-900 placeholder-gray-500 focus:ring-0 sm:text-sm"
        placeholder={placeholder}
      />
    </div>
  )
}

export default Input
