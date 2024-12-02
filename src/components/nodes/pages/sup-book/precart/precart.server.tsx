"use server"

import {redirect} from "next/navigation"

export const submitForm = async (formData: FormData) => {
  "use server"

  // Honeypot field.
  if (formData.get("email")) return

  const bookTitle = formData.get("title") as string
  const formatIsbn = formData.get("format") as string
  const isIntl = formData.get("intl") !== "us"

  if (isIntl) {
    const title = bookTitle.replace(/[^a-zA-Z\d\s:]/, "").replace(/ /, "-")
    redirect(`https://www.combinedacademic.co.uk/${formatIsbn}/${title}`)
  }
  redirect(`https://add-to-cart-2.supadu.com/add-to-cart?isbn=${formatIsbn}&client=indiepubs-stanford-university-press`)
}
