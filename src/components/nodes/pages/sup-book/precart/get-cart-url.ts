export const getCartUrl = (
  bookTitle: string,
  format: string,
  isbn: string,
  ebookFormat: string,
  isIntl: boolean,
  altFormat: string
) => {
  // Ebook go to the same place regardless of international.
  if (format === "ebook") return `https://stanforduniversitypress.glassboxx.com/?add-to-cart-sku=${isbn}_${ebookFormat}`

  // All other international requests go to CAP.
  if (isIntl) {
    const title = bookTitle.replaceAll(/[^a-zA-Z\d\s:]/g, "").replaceAll(/\s/g, "-")
    return `https://www.combinedacademic.co.uk/${isbn}/${title}`
  }

  const glassBoxFormat = format === "alt" ? altFormat.toUpperCase() : "PRINT"
  return `https://stanforduniversitypress.glassboxx.com/?add-to-cart-sku=${isbn}_${glassBoxFormat}`
}
