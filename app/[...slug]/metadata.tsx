import {Maybe, NodeStanfordEvent, NodeStanfordNews, NodeStanfordPage, NodeStanfordPerson, NodeStanfordPolicy, NodeSupBook, NodeUnion, ParagraphStanfordWysiwyg, ParagraphUnion} from "@lib/gql/__generated__/drupal.d"
import {Metadata} from "next"
import {decode} from "html-entities"

export const getNodeMetadata = (node: NodeUnion, page: "excerpt" | "copy-requests" | "detail" = "detail"): Metadata => {
  const defaultData = {
    title: node.title + " | Stanford University Press",
    other: {},
  }
  switch (node.__typename) {
    case "NodeStanfordPage":
      return {
        ...getBasicPageMetaData(node),
        ...defaultData,
      }

    case "NodeStanfordNews":
      return {
        ...getNewsMetaData(node),
        ...defaultData,
      }

    case "NodeStanfordEvent":
      return {
        ...getEventMetaData(node),
        ...defaultData,
      }

    case "NodeStanfordPerson":
      return {
        ...getPersonMetaData(node),
        ...defaultData,
      }

    case "NodeStanfordPolicy":
      return {
        ...getPolicyMetaData(node),
        ...defaultData,
      }

    case "NodeSupBook":
      return {
        ...defaultData,
        ...getBookMetaData(node, page),
      }
  }

  return defaultData
}

const getBookMetaData = (node: NodeSupBook, page: "excerpt" | "copy-requests" | "detail") => {
  const image = node.supBookImage?.mediaImage
  let description = getCleanDescription(node.supBookDescription?.processed)

  let title = node.title
  if (page === "excerpt") {
    title += ": Excerpt & More"
    description = getFirstText(node.supBookExcerpts)
  }
  if (page === "copy-requests") {
    title += ": Copy Requests"
    description = `Instructions to get copy requests of the book "${node.title}"`
  }

  return {
    title: title,
    description: description,
    openGraph: {
      type: "book",
      title: node.title,
      isbn: node.supBookIsbn13Isw || node.supBookIsbn13Paper || node.supBookIsbn13Cloth || node.supBookIsbn13Alt,
      authors: node.supBookAuthors?.map(author => ({
        "profile:first_name": author.given,
        "profile:last_name": author.family,
      })),
      releaseDate: node.supBookPubYearFirst,
      description: description,
      images: image ? getOpenGraphImage(image.url, image.alt || "") : [],
    },
  }
}

const getBasicPageMetaData = (node: NodeStanfordPage) => {
  const pageTitleBannerImage = node.suPageBanner?.__typename === "ParagraphStanfordPageTitleBanner" && node.suPageBanner.suTitleBannerImage.mediaImage
  const bannerImage = node.suPageBanner?.__typename === "ParagraphStanfordBanner" && node.suPageBanner.suBannerImage?.mediaImage
  const image = node.suPageImage?.mediaImage || pageTitleBannerImage || bannerImage

  const description = node.suPageDescription || getFirstText(node.suPageComponents)

  return {
    description: description,
    openGraph: {
      type: "website",
      title: node.title,
      description: description,
      images: image ? getOpenGraphImage(image.url, image.alt || "") : [],
    },
  }
}

const getNewsMetaData = (node: NodeStanfordNews) => {
  const pageImage = node.suNewsFeaturedMedia?.mediaImage
  const bannerImage = node.suNewsBanner?.__typename === "MediaImage" ? node.suNewsBanner.mediaImage : undefined

  const imageUrl = pageImage?.url || bannerImage?.url
  const imageAlt = pageImage?.alt || bannerImage?.alt || ""

  const description = node.suNewsDek || getFirstText(node.suNewsComponents)

  let publishTime
  if (node.suNewsPublishingDate) {
    publishTime = new Date(node.suNewsPublishingDate.time).toISOString()
  }

  return {
    description: description,
    openGraph: {
      type: "article",
      title: node.title,
      description: description,
      publishedTime: publishTime || null,
      tag: node.suNewsTopics?.map(term => term.name) || [],
      images: getOpenGraphImage(imageUrl, imageAlt),
    },
  }
}

const getPersonMetaData = (node: NodeStanfordPerson) => {
  const pageImage = node.suPersonPhoto?.mediaImage
  const imageUrl = pageImage?.url
  const imageAlt = pageImage?.alt || ""
  const description = node.suPersonFullTitle || getCleanDescription(node.body?.processed)

  return {
    description: description,
    openGraph: {
      type: "profile",
      title: node.title,
      description: description,
      firstName: node.suPersonFirstName,
      lastName: node.suPersonLastName,
      images: getOpenGraphImage(imageUrl, imageAlt),
    },
  }
}

const getEventMetaData = (node: NodeStanfordEvent) => {
  const description = node.suEventSubheadline || getCleanDescription(node.body?.processed)

  return {
    description: description,
    openGraph: {
      type: "website",
      title: node.title,
      description: description,
    },
  }
}

const getPolicyMetaData = (node: NodeStanfordPolicy) => {
  const description = getCleanDescription(node.body?.processed)

  return {
    description: description,
    openGraph: {
      type: "website",
      title: node.title,
      description: description,
    },
  }
}

const getFirstText = (components?: Maybe<ParagraphUnion[]>) => {
  const firstWysiwyg = components?.find(component => component.__typename === "ParagraphStanfordWysiwyg") as ParagraphStanfordWysiwyg
  if (firstWysiwyg) {
    return getCleanDescription(firstWysiwyg.suWysiwygText?.processed)
  }
}

const getCleanDescription = (description: string | undefined): string | undefined => {
  if (description) {
    const text: string =
      description
        .replace(/(<([^>]+)>)/gi, " ")
        .replace("/ +/", " ")
        .split(".")
        .slice(0, 2)
        .join(".") + "."
    return text?.length > 1 ? decode(text) : undefined
  }
}

const getOpenGraphImage = (imageUrl?: string, imageAlt?: string) => {
  if (imageUrl) {
    return [
      {
        url: imageUrl,
        width: 956,
        height: 478,
        alt: imageAlt,
      },
    ]
  }
  return []
}
