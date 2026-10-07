import {HTMLAttributes, InputHTMLAttributes, ReactNode} from "react"

type Props = HTMLAttributes<HTMLDivElement> & {
  label: string | ReactNode
  helpText?: string | ReactNode
  inputProps?: InputHTMLAttributes<HTMLInputElement>
}
const Checkbox = ({label, helpText, inputProps, ...props}: Props) => {
  return (
    <div {...props}>
      <label className="mb-7.5 flex cursor-pointer items-center gap-25">
        <span className="order-last text-18 font-semibold">{label}</span>

        <div className="group relative">
          <input className="peer sr-only" type="checkbox" {...inputProps} />
          <div className="h-15 w-40 rounded-full bg-press-sand-light shadow-inner peer-checked:bg-press-bay-light" />
          <div className="absolute -top-5 -left-2.5 h-25 w-25 rounded-full border border-fog-dark bg-white shadow-sm outline-8 outline-press-bay transition outline-none group-hocus:outline-solid peer-checked:translate-x-full peer-checked:bg-press-grass peer-focus-visible:outline-solid" />
        </div>
      </label>
      {helpText && <p className="text-lg italic">{helpText}</p>}
    </div>
  )
}
export default Checkbox
