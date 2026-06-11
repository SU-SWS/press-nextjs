import {MetadataRoute} from "next"
import {getAllNodes} from "@lib/gql/gql-queries"
import {cacheLife} from "next/cache"

// https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config
export const maxDuration = 60

const Sitemap = async (): Promise<MetadataRoute.Sitemap> => {
  "use cache"
  cacheLife("weeks")
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
  })

  return sitemap
}

export default Sitemap
