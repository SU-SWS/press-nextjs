import {NextRequest, NextResponse} from "next/server"
import {revalidateTag} from "next/cache"
import {getEntityFromPath, getMenu} from "@lib/gql/gql-queries"
import getActiveTrail from "@lib/drupal/utils"

export const revalidate = 0

export const GET = async (request: NextRequest) => {
  const secret = request.nextUrl.searchParams.get("secret")
  if (secret !== process.env.DRUPAL_REVALIDATE_SECRET)
    return NextResponse.json({message: "Invalid token"}, {status: 403})

  let path = request.nextUrl.searchParams.get("slug")
  if (!path || path.startsWith("/node/")) return NextResponse.json({message: "Invalid slug"}, {status: 400})

  const tagsInvalidated = ["paths", `paths:${path}`]
  if (path.startsWith("/tags/"))
    path
      .substring(6)
      .split("/")
      .map(tag => tagsInvalidated.push(tag))

  // When the home page is saved, it's url slug might be like `/home`. If the home page matches the slug, invalidate
  // the home page path.
  const {entity} = await getEntityFromPath("/")
  if (entity?.path === path) tagsInvalidated.push("paths:/")

  const menu = await getMenu()
  if (!!getActiveTrail(menu, path).length) tagsInvalidated.push("menu:main")

  // Invalidate the book path if the path is an excerpt page.
  if (path.includes("/excerpt/")) tagsInvalidated.push(`excerpts:${path.substring(0, path.indexOf("/excerpt"))}`)

  tagsInvalidated.map(tag => revalidateTag(tag))
  return NextResponse.json({revalidated: true, tags: tagsInvalidated})
}
