"use server"

import {redirect} from "next/navigation"
import {getCartUrl} from "@components/nodes/pages/sup-book/precart/get-cart-url"

export const submitForm = async (formData: FormData) => {
  // Honeypot field.
  if (formData.get("email")) return

  const bookTitle = formData.get("title") as string
  const [format, isbn] = (formData.get("format") as string).split(":")
  const isIntl = formData.get("intl") === "intl"
  const ebookFormat = formData.get("ebook") as string
  const altFormat = formData.get("alt-format") as string

  redirect(getCartUrl(bookTitle, format, isbn, ebookFormat, isIntl, altFormat))
}
