"use client"

import Editori11y from "@components/tools/editorially"
import useDrupalWindowSync from "@lib/hooks/useDrupalWindowSync"

const PreviewTools = () => {
  useDrupalWindowSync()
  return <Editori11y />
}

export default PreviewTools
