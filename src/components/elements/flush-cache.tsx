import {revalidatePath, revalidateTag} from "next/cache"

const FlushCache = ({currentPath}: {currentPath: string}) => {
  const clearCache = async () => {
    "use server"

    revalidatePath(currentPath)
    revalidateTag(`paths:${currentPath}`)
  }

  return (
    <form action={clearCache} className="fixed bottom-0 z-50">
      <button
        type="submit"
        className="rounded-full border border-black-80 bg-white p-4 shadow hocus:bg-black-10 hocus:underline"
      >
        Clear this page cache
      </button>
    </form>
  )
}

export default FlushCache
