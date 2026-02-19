"use client"

import {useState} from "react"
import {clearCache} from "./actions"
import Checkbox from "@components/elements/inputs/checkbox"
import {clsx} from "clsx"

const CacheClearForm = () => {
  const [message, setMessage] = useState<{success: boolean; message: string} | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (formData: FormData) => {
    setIsLoading(true)
    setMessage(null)

    try {
      setMessage(await clearCache(formData))
    } catch {
      setMessage({success: false, message: "An error occurred while clearing the cache"})
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div>
      <form action={handleSubmit}>
        <fieldset>
          <legend></legend>

          <Checkbox
            className="mb-20"
            label="Clear all prices"
            helpText="This will revalidate all prices across the site."
            inputProps={{name: "clearAllPrices"}}
          />
          <Checkbox
            className="mb-20"
            label="Clear Main Menu"
            helpText="This will revalidate the menu system and cause every page to rebuild."
            inputProps={{name: "clearMenu"}}
          />
          <Checkbox
            className="mb-20"
            label="Clear Global Footer"
            helpText="This will revalidate the site wide footer and cause every page to rebuild."
            inputProps={{name: "clearGlobalElements"}}
          />
        </fieldset>

        <div className="mb-20">
          <label className="mb-3 flex flex-col gap-5">
            <span className="block font-semibold">Specific Path</span>
            <input type="text" name="path" placeholder="/example-path" size={20} className="max-w-300 text-4xl" />
          </label>
          <p className="text-lg italic">Enter a path to revalidate (e.g., /about).</p>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="btn border-2 border-cardinal-red bg-digital-red px-8 py-4 font-normal text-white no-underline transition disabled:bg-gray-600 hocus:bg-cardinal-red hocus:text-white hocus:underline"
        >
          {isLoading ? "Clearing Cache..." : "Clear Cache"}
        </button>
      </form>

      {message && (
        <div
          className={clsx("mt-4 rounded-md p-4 font-semibold text-white", {
            "bg-green-800": message.success,
            "bg-red-800": !message.success,
          })}
        >
          {message.message}
        </div>
      )}
    </div>
  )
}
export default CacheClearForm
