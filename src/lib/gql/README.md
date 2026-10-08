# GraphQL Integration

This directory contains all GraphQL query definitions, the generated TypeScript types, and the helper functions that
fetch data from the Drupal GraphQL API.

## Directory Structure

```
src/lib/gql/
├── *.drupal.gql             # GraphQL query/fragment definitions (hand-authored)
├── schema-overrides.graphql # Nullability corrections merged over the Drupal schema during codegen
├── gql-client.ts            # Fetch based GraphQL client with auth header logic
├── gql-queries.ts           # Cached server-side data fetching helpers
├── gql-views.tsx            # Cached view/listing fetchers and the view page server action
└── __generated__/           # Auto-generated — do not edit by hand
    ├── graphql.ts           # All schema types + a typed document per operation
    ├── gql.ts               # Typed gql() tag used internally by the preset
    └── index.ts             # Re-exports gql.ts
```

---

## Code Generation

Types and documents are generated from the live Drupal GraphQL schema using
[`@graphql-codegen/client-preset`](https://the-guild.dev/graphql/codegen/plugins/presets/preset-client).

```bash
yarn graphql
```

This command:

1. Fetches the schema introspection from `$NEXT_PUBLIC_DRUPAL_BASE_URL/graphql` using Basic Auth credentials from
   `.env.local`, and merges `schema-overrides.graphql` over it.
2. Parses all `*.drupal.gql` files in this directory.
3. Writes `__generated__/graphql.ts`, `__generated__/gql.ts`, and `__generated__/index.ts`.

> **Never edit files inside `__generated__/` directly.** Changes will be overwritten on the next codegen run.

Notable codegen settings (`codegen.ts`):

- `documentMode: "string"` — operations are emitted as query strings, so `graphql` stays out of the runtime bundle.
- `fragmentMasking: false` — fragment fields are accessed directly.
- `enumsAsConst: true` — enums are `as const` objects (`MenuAvailable.Main` still works as a value and a type).
- Drupal custom scalars are mapped to `string` (`Timestamp`, `Html`, …), so parse timestamps before doing math:
  `new Date(parseInt(node.suEventDateTime.value) * 1000)`.

### Required Environment Variables

| Variable                      | Purpose                                                              |
|-------------------------------|----------------------------------------------------------------------|
| `NEXT_PUBLIC_DRUPAL_BASE_URL` | Base URL of the Drupal site                                          |
| `DRUPAL_BASIC_AUTH`           | `username:password` for standard read-only requests                  |
| `DRUPAL_BASIC_AUTH_ADMIN`     | `username:password` for preview / draft content requests             |
| `DRUPAL_REQUEST_HEADERS`      | _(optional)_ JSON object of extra headers forwarded to every request |

### What Gets Generated

| Export pattern           | Example                                                     |
|--------------------------|-------------------------------------------------------------|
| `<Name>Document`         | `RouteDocument` — typed document string for the operation   |
| `<Name>Query`            | `RouteQuery` — the exact TypeScript shape of the response   |
| `<Name>QueryVariables`   | `RouteQueryVariables` — the accepted input variables        |
| `Fragment<Name>Fragment` | `FragmentNodeSupBookFragment` — fragment result type        |

Lower camel case operation names are pascal cased: `query supBooks` produces `SupBooksDocument` and `SupBooksQuery`.

### Schema Overrides

`schema-overrides.graphql` promotes fields Drupal reports as nullable but never returns null for (`Link.url`, node
`path`). A node type added to Drupal must also be added to the `path` list there, otherwise its `path` stays nullable.

---

## GraphQL Source Files

| File                                 | Contents                                                                                     |
|--------------------------------------|----------------------------------------------------------------------------------------------|
| `route-query.drupal.gql`             | `Route` (path to entity or redirect), `Redirects`                                            |
| `entity-queries.drupal.gql`          | `Node`, `AllNodes`, `BooksAuthors`, `BooksWorkId`, per-type collections, `Paragraph`, `ConfigPages` |
| `view-queries.drupal.gql`            | Drupal Views listings: `stanford*` views and `supBooks*`, `supBookAncillary`                 |
| `menu.drupal.gql`                    | `Menu` with nested children                                                                  |
| `fragments-node.drupal.gql`          | Node fragments, teasers, and `FragmentNodeUnion`                                              |
| `fragments-paragraph.drupal.gql`     | Paragraph fragments and `FragmentParagraphUnion`                                              |
| `fragments-media.drupal.gql`         | Media entity fragments                                                                       |
| `fragments-sup-entities.drupal.gql`  | `BookPrice` query for SUP price entities                                                     |
| `fragments-fields.drupal.gql`        | Primitive field fragments (text, link, date, metatags, terms)                                |

---

## Client (`gql-client.ts`)

`graphqlClient()` returns a small client around the global `fetch`, so Next.js caches requests normally and no GraphQL
library ships to the runtime.

```ts
import {graphqlClient} from "@lib/gql/gql-client"
import {RouteDocument, RouteQuery} from "@lib/gql/__generated__/graphql"

const query = await graphqlClient().request<RouteQuery>(RouteDocument, {path: "/about", teaser: false})
const draft = await graphqlClient({}, true).request<RouteQuery>(RouteDocument, {path: "/about", teaser: false})
```

- `request()` returns the `data` payload and throws a `ClientError` (exported from `gql-client.ts`) when the response
  is not 2xx or carries GraphQL `errors`. `e.response.errors[].debugMessage` holds Drupal's readable message.
- `buildHeaders(headers?, isPreviewMode?)` is exported for other Drupal requests (e.g. the `/system` file proxy).
  Preview mode prefers `DRUPAL_BASIC_AUTH_ADMIN`; `DRUPAL_REQUEST_HEADERS` entries are merged in first.

---

## Query Helpers (`gql-queries.ts`)

Cached functions use `"use cache: remote"` with `cacheTag()` so Drupal can revalidate them on demand via
`/api/revalidate`.

| Function                                       | Purpose                                                       | Cache tags                     |
|------------------------------------------------|---------------------------------------------------------------|--------------------------------|
| `getEntityFromPath(path, previewMode?, teaser?)` | Resolve a path to `{entity}` or `{redirect}`. Preview skips the cache. | `all-entities`, `paths:<path>` |
| `getConfigPage<T>(typename)`                   | First config page node of a bundle (all bundles fetched once) | `config-pages`                 |
| `getConfigPageField<T, F>(typename, field)`    | A single field from a config page                             | `config-pages`                 |
| `getMenu(name?)`                               | Menu tree with `"Inaccessible"` items removed                 | `menu`, `menu:<name>`          |
| `getAllNodes()`                                | Every node, paged by per-type cursors, for static params      | `cacheLife("months")`          |
| `getBookAncillaryContents(uuid)`               | Excerpt pages for a book                                      | `excerpts:<uuid>`              |
| `getAlgoliaCredential()`                       | `[appId, index, key, recommendations]` from env or config page |                                |
| `getHomePagePath()`                            | Path alias of the front page                                  |                                |

---

## View Helpers (`gql-views.tsx`)

- `getViewPagedItems(viewId, displayId, contextualFilter?, pageSize?, page?, offset?, filters?, sort?)` dispatches on
  `viewId--displayId` to the matching view query and returns `{items, totalItems}`. Tagged `views` plus
  `views:<bundle>` (e.g. `views:sup_book`).
- `getViewItems(...)` wraps it with a 30 item page size and an optional limit.
- `loadViewPage(...)` is a server action returning a rendered `<View>` for client-side paging.

---

## Adding a New Query

1. Write the operation in the appropriate `.drupal.gql` file.
2. Run `yarn graphql` to generate `<Name>Document`, `<Name>Query`, and `<Name>QueryVariables`.
3. Call it with the client:

   ```ts
   const result = await graphqlClient().request<MyContentQuery>(MyContentDocument, {uuid})
   ```

4. If it is wrapped in a `"use cache: remote"` function, add a `cacheTag()` that Drupal's revalidation sends.
