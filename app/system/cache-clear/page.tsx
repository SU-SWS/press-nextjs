import CacheClearForm from "./form"
import {H1} from "@components/elements/headers"
import {Metadata} from "next"

export const metadata: Metadata = {
  metadataBase: new URL("https://sup.org"),
  title: "Cache Management | Stanford University Press",
}

export default async function CacheClearPage() {
  return (
    <div className="centered mt-32">
      <H1>Cache Management</H1>
      <CacheClearForm />
    </div>
  )
}
