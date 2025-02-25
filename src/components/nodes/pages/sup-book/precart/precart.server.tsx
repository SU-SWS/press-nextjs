"use server"

import {redirect} from "next/navigation"

export const submitForm = async (formData: FormData) => {
  "use server"

  // Honeypot field.
  if (formData.get("email")) return

  const bookTitle = formData.get("title") as string
  const [format, isbn] = (formData.get("format") as string).split(":")
  const isIntl = formData.get("intl") !== "us"

  if (format === "ebook") redirect(`https://stanforduniversitypress.glassboxx.com/?add-to-cart-sku=${isbn}_PDF`)

  if (isIntl) {
    const title = bookTitle.replaceAll(/[^a-zA-Z\d\s:]/g, "").replaceAll(/\s/g, "-")
    redirect(`https://www.combinedacademic.co.uk/${isbn}/${title}`)
  }
  redirect(`https://stanforduniversitypress.glassboxx.com/?add-to-cart-sku=${isbn}_PRINT`)
}
