import {HTMLAttributes, useId} from "react"
import {MagnifyingGlassIcon} from "@heroicons/react/20/solid"

const SiteSearchForm = ({...props}: HTMLAttributes<HTMLFormElement>) => {
  const inputId = useId()
  return (
    <form aria-label="Site Search" action="/search" {...props}>
      <div className="relative my-25">
        <label htmlFor={inputId} className="sr-only">
          Search this site
        </label>
        <input
          className="w-full rounded-full px-20 py-12.5 text-16 lg:border-black-20 lg:text-19"
          type="text"
          placeholder="Search this site"
          id={inputId}
          name="q"
          required
        />
        <button type="submit" className="absolute top-12.5 right-15">
          <MagnifyingGlassIcon width={21} className="text-digital-red" />
          <span className="sr-only">Submit Search</span>
        </button>
      </div>
    </form>
  )
}

export default SiteSearchForm
