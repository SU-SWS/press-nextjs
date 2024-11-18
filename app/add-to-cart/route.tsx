import {NextRequest} from "next/server"
import {redirect} from "next/navigation"

export const revalidate = false
export const dynamic = "force-static"

export const POST = async (request: NextRequest) => {
  const formData = await request.formData()
  const bookTitle = formData.get("title") as string
  const formatIsbn = formData.get("format") as string
  const isIntl = formData.get("intl") !== "us"

  if (isIntl) {
    const title = bookTitle.replace(/[^a-zA-Z\d\s:]/, "").replace(/ /, "-")
    redirect(`https://www.combinedacademic.co.uk/${formatIsbn}/${title}`)
  }
  redirect(`https://add-to-cart-2.supadu.com/add-to-cart?isbn=${formatIsbn}&client=indiepubs-stanford-university-press`)
}
