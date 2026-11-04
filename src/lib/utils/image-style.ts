import {ImageStyleDerivative} from "@lib/gql/__generated__/graphql"

/**
 * Read an aliased image style variation from an image field.
 *
 * Fragments request derivatives with an alias, e.g. `cardStyle: variations(styles: [LARGE_SQUARE])`. Aliases are not
 * part of the generated schema types, so components typed with schema types (`NodeSupBook`, etc.) can't see them.
 *
 * @param image - The image field object, e.g. `node.supBookImage?.mediaImage`.
 * @param alias - The alias used for the `variations` field in the GraphQL fragment.
 */
export const getImageStyle = (image: object | null | undefined, alias: string): ImageStyleDerivative | undefined =>
  (image as Record<string, ImageStyleDerivative[] | undefined> | null | undefined)?.[alias]?.[0]
