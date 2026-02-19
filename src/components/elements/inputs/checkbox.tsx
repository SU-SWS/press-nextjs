import {HTMLAttributes, InputHTMLAttributes, ReactNode} from "react"

type Props = HTMLAttributes<HTMLDivElement> & {
  label: string | ReactNode
  helpText?: string | ReactNode
  inputProps?: InputHTMLAttributes<HTMLInputElement>
}
const Checkbox = ({label, helpText, inputProps, ...props}: Props) => {
  return (
    <div {...props}>
      <label className="mb-3 flex cursor-pointer items-center gap-10">
        <span className="order-last text-18 font-semibold">{label}</span>

        <div className="group relative">
          <input className="peer sr-only" type="checkbox" {...inputProps} />
          <div className="h-6 w-16 rounded-full bg-press-sand-light shadow-inner peer-checked:bg-press-bay-light" />
          <div className="absolute -left-1 -top-2 h-10 w-10 rounded-full border border-fog-dark bg-white shadow outline-8 outline-press-bay transition peer-checked:translate-x-full peer-checked:bg-press-grass peer-focus-visible:outline group-hocus:outline" />
        </div>
      </label>
      {helpText && <p className="text-lg italic">{helpText}</p>}
    </div>
  )
}
export default Checkbox
