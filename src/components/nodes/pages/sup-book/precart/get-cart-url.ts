export const getCartUrl = (
  bookTitle: string,
  format: string,
  isbn: string,
  ebookFormat: string,
  isIntl: boolean,
  altFormat: string
) => {
  const cartDomain = process.env.NEXT_PUBLIC_CART_DOMAIN
  if (!cartDomain) throw new Error("NEXT_PUBLIC_CART_DOMAIN is not defined")

  // Ebook go to the same place regardless of international.
  if (format === "ebook") return `${cartDomain}/?add-to-cart-sku=${isbn}_${ebookFormat}`

  // All other international requests go to CAP.
  if (isIntl) {
    const title = bookTitle.replaceAll(/[^a-zA-Z\d\s:]/g, "").replaceAll(/\s/g, "-")
    return `https://mngbookshop.co.uk/${isbn}/${title}`
  }

  const glassBoxFormat = format === "alt" ? altFormat.toUpperCase() : "PRINT"
  return `${cartDomain}/?add-to-cart-sku=${isbn}_${glassBoxFormat}`
}
