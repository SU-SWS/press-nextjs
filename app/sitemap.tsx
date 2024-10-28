import {MetadataRoute} from "next"
import {getAllNodes} from "@lib/gql/gql-queries"

// https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config
export const revalidate = 604800
export const dynamic = "force-static"
export const maxDuration = 60

const Sitemap = async (): Promise<MetadataRoute.Sitemap> => {
  const nodes = await getAllNodes()

  const sitemap: MetadataRoute.Sitemap = []

  nodes.map(node => {
    const path = node.path === "/home" ? "/" : node.path
    sitemap.push({
      url: `https://www.sup.org${path}`,
      lastModified: new Date(node.changed.time),
      priority: node.__typename === "NodeStanfordPage" ? 1 : 0.8,
      changeFrequency: node.__typename === "NodeStanfordPage" ? "weekly" : "monthly",
    })

    // Add excerpts page for each book as appropriate.
    if (node.__typename === "NodeSupBook" && node.supBookExcerpts) {
      sitemap.push({
        url: `https://www.sup.org${node.path}/excerpts`,
        lastModified: new Date(node.changed.time),
        priority: 0.8,
        changeFrequency: "monthly",
      })
    }
  })

  return sitemap
}

export default Sitemap
