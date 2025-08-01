"use server"

import {redirect} from "next/navigation"

export const submitForm = async (formData: FormData) => {
  "use server"

  // Honeypot field.
  if (formData.get("email")) return

  const bookTitle = formData.get("title") as string
  const [format, isbn] = (formData.get("format") as string).split(":")
  const isIntl = formData.get("intl") === "intl"
  const ebookFormat = formData.get("ebook") as string
  const altFormat = formData.get("alt-format") as string

  // Ebook go to the same place regardless of international.
  if (format === "ebook")
    redirect(`https://stanforduniversitypress.glassboxx.com/?add-to-cart-sku=${isbn}_${ebookFormat}`)

  // All other international requests go to CAP.
  if (isIntl) {
    const title = bookTitle.replaceAll(/[^a-zA-Z\d\s:]/g, "").replaceAll(/\s/g, "-")
    redirect(`https://www.combinedacademic.co.uk/${isbn}/${title}`)
  }

  const glassBoxFormat = format === "alt" ? altFormat.toUpperCase() : "PRINT"
  redirect(`https://stanforduniversitypress.glassboxx.com/?add-to-cart-sku=${isbn}_${glassBoxFormat}`)
}
