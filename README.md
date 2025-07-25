This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

### Setup Local Environment Variables:
1. copy .env.example to .env.local
2. The only necessary variable is the `NEXT_PUBLIC_DRUPAL_BASE_URL`. Set this to your local drupal installation url.

### Set Up Drupal Environment (Optional)
You can configure your Drupal environment to use this as a "preview".

1. In the Drupal environment, go to `/admin/config/services/next/sites/add` page.
2. Enter a label of your choice.
3. "Base URL" will be `http://localhost:3000`.
4. "Preview URL" will be `http://localhost:3000/api/draft`.
5. "Preview Secret" can be any string of your choice. This should match the `DRUPAL_PREVIEW_SECRET` environment variable.
6. "Revalidate URL" `http://localhost:3000/api/revalidate`. Only necessary to test cache invalidations in preview mode.
7. "Revalidate secret" will be any string of your choice. This should match `DRUPAL_REVALIDATE_SECRET` environment variable. . Only necessary to test cache invalidations in preview mode.
8. To test authenticated "Draft Mode" navigate to `/admin/config/services/consumer`. At least 1 "Consumer" should already exist.
   1. Edit the consumer
   2. The "Client ID" can be any string of your choice. It should match the `DRUPAL_DRAFT_CLIENT` environment variable.
   3. The "New Secret" can be any string of your choice. It should match the `DRUPAL_DRAFT_SECRET` environment variable.
   4. Choose an appropriate "User", like any "Site Manager"
   5. For "Scopes" select "Site Manager" and "Decoupled Site User"

### Start Development Server:

```bash
# Install Dependencies
yarn install
# Run dev server
yarn dev
# Or run preview server
yarn preview
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

### Storybook

Story book is a great way to edit components without the need for any Drupal connection. All stories and setup are saved in the [./.storybook directory](./.storybook).
```bash
yarn storybook
```
This will open a new browser window to [http://localhost:6006](http://localhost:6006).

View more [Storybook documentation](https://storybook.js.org/).

### Linting

This project uses both typescript checks and ESLinting. These are run on CI services, but not on production environments since the dev dependencies are not installed on production.

```bash
yarn lint
```

## API Connection

This project makes use of both JSON API and GraphQL API endpoints from the Drupal environment. When a user is in "Draft
Mode", the APIs will use the `DRUPAL_DRAFT_CLIENT` & `DRUPAL_DRAFT_SECRET` environment variables to fetch an OAuth token.
This token allows either API to fetch authenticated only data. But while in "draft mode", the pages will be built at
request time. "Draft mode" should only be used for previewing content when a user is editing. "Draft mode" is only enabled
when a user hits the [/api/draft](./app/api/draft/route.tsx) route from the Drupal environment. It establishes a cookie
that is then used for subsequent page requests. Note that while in "draft mode", every page load will request fresh data
from the CMS system. This can have negative performance impacts on both platforms.

[Draft mode documenation](https://nextjs.org/docs/app/building-your-application/configuring/draft-mode)

### JSON API

The JSON API is used for data points that are more simple and don't require very complex data such as paragraph entities.
Things like the config pages and the main menu are fetched from JSON API. These APIs also use GET methods. This way they
can be easily cached by Drupal/Varnish/CDN services and result in faster data transfer.

JSON API functions are found in the [./src/lib/drupal directory](./src/lib/drupal).

### GraphQL

GraphQL endpoint `/graphql` accepts POST methods only. GraphQL allows us to create very nested queries using unions. We
can easily fetch every single piece of information in a single request to build out the entire page, except views. Views
are fetched separately to allow us to make them more dynamic in the future and also to avoid some unwanted errors that
come from the first render in Drupal.

GraphQL types and fetch methods are generated automatically using `yarn graphql`. If a content type, field, vocabulary,
paragraph type, etc. are created/edited/deleted in the Drupal environment, the queries in [./src/lib/gql](./src/lib/gql)
will need to be updated. Most of the changes can be implemented in the [fragments.drupal.gql](./src/lib/gql/fragments.drupal.gql)
file. To make it easy, Drupal provides fragments you can copy as a starting point. Navigate to `/admin/config/graphql_compose/fragments`
to view those fragments. Once the fragments and/or queries have been modified, simply run `yarn graphql` to rebuild the
typescript types and fetcher queries.

If a field is added in the Drupal environment that is "required", that field must be populated for each entity. GraphQL
is strict and will throw an error if you include that field in a query, but the data is null. To solve this, either
populate the data in Drupal or make the field optional.

## Cache

This project uses [Next.JS "use cache" directive](https://nextjs.org/docs/app/api-reference/directives/use-cache).
This allows the caching of data that is fetched, components, pages, and layouts. With some exceptions, we want to cache
all data indefinitely. Then invalidating that cache upon some action performed in the Drupal application, such as a
piece of content is updated. The default cache behavior of Next.JS has been overridden to infinite cache. Simply adding
`"use cache"` on a component, function, or page will then cache it forever. Some pages, such as the [sitemap.xml](app/sitemap.tsx),
can set their cache to be shorter by using the [cacheLife()](https://nextjs.org/docs/app/api-reference/functions/cacheLife)
function. It's recommended to use a long of cache life as needed to keep cache read/writes to a minimum.

In the layout and pages we set `"use cache"` at the top of the file. This caches the page and layout build indefinitely.
Layouts and page caches are treated separately and can be invalidated independently of each other, while also allowing
specific parts of each to be invalidated. A route handler is provided that allows the CMS system to invalidate
appropriate areas of the site. Making a `GET` request to `/api/revalidate?secret=[secret]&path=/[path]` with the correct
parameters will accomplish this invalidation. Passing a path in the form `/tags/foo:bar` will invalidate the cache tags
for `foo:bar` using the [revalidateTag](https://nextjs.org/docs/app/api-reference/functions/revalidateTag) function. The
reason for this is the Next.js Drupal module only provides a single API url for on demand invalidation. So we have to
implement our own logic.

### Layout

The layout consists of the global elements on all pages. This consists of the global header, footer, and the menu. Any
site wide settings should also be used in the layout. The main menu in the header has cache tags: `menus` & `menu:main`.
The config pages have the cache tag `config-pages` since all config pages are fetched with a single request.

When a layout cache is invalidated, it has no impact on the route caches below. However, it will trigger every route to
be rebuilt upon the next request. This shouldn't impact the CMS system since the route caches are still available.

### Page

Page routes are cache separately from Layouts. When invalidating a route or any fetch requests on the route, the layout
caches will not be impacted. Using the route handler, if we invalidate the path `/foo/bar` using the [revalidatePath](https://nextjs.org/docs/app/api-reference/functions/revalidatePath)
function, it will invalidate any cache data that was used to build that single page and no other pages. Requests
like list paragraphs, or external fetches will be re-executed when the page is requested.

Pages may contain list paragraphs. Those paragraphs have a separate `fetch` so they can be invalidated when a content
changes in the CMS. Each view contains a cache tag in the form `views:[content_type]` that correlates to the content
type in the Drupal CMS. When this cache tag is invalidated, any route that contains that list paragraph will be rebuilt,
but only the list paragraph data will be re-fetched from the CMS.

### Images/Files

Images are optimized on the hosting platform. It is recommended to use the original image from the source so that the
derived images will be at the best resolution quality. [Next.js](https://nextjs.org/docs/pages/api-reference/components/image)
provides extensive documentation about image optimization. Optimized images will then be cached on the hosting provider
and stored for 31 days, unless triggered to be cleared out. [Vercel](https://vercel.com/docs/image-optimization#caching)
has documentation explaining how their cache is handled.

Files, pdf, txt, etc., assets are referenced directly from the CMS. Their cache is managed by the Drupal hosting provider
and/or Varnish/CDN/Etc.

### Troubleshooting Cache Issues

If you experience any issues during development, most times opening the browser's inspector tools and reloading the page
will bypass any cached data. If necessary, delete the `.next` directory and restart your local server.

Cache issues on the front end can be very different from Drupal related cache issues. Although both systems use a form
of cache tags, there are no relationship between the two caching systems. When a save action is performed in Drupal, a
revalidation request is made to this platform. Occasionally there can be a communication issue or perhaps the Next.JS
cache refuses to invalidate the appropriate areas. Here are some ways to attempt to resolve the issue:

1. Using your local development environment, change the environment variables to pull data from the production site
   - Use `yarn dev` and load a page in your browser with the inspector tools open.
   - This will give you a better indication if the issues is cached in Drupal or in NextJS.
2. Resave the [GraphQL Compose settings](https://supress.sites-pro.stanford.edu/admin/config/graphql_compose).
   - This can cause the graphql to clear any stored queries caches.
3. Resave the page that is outdated.
   - This will make a second request to the FE and attempt to revalidate it again.
4. Resave a menu item or a page within the menu.
   - This will invalidate the menu on all pages.
   - If resaving a page within the menu, make sure to change some value in the menu area to trigger the invalidation.
     Changing a weight from 50 to 49 can be the easiest solution.
5. Resave the configuration page that is outdated.
   - Resaving a global message or site settings will clear cache for all config pages. This will rebuild all pages.
6. Enable debugging in the "Next" module in Drupal.
   - `drush cset next.settings debug 1` will add watchdog logs. These can be streamed in Acquia logs or viewed in the UI
     if the dblog module is enabled. Errors in the logs will indicate some issue that should be inspected more closely.
   - Remember to disable the debug once the issue is resolved.

If all of the above fails, there are two quick fixes that can help in a pinch.

1. As stated above making a `GET` request to `/api/revalidate?secret=[secret]&path=/[path/tags]` with the correct
   parameters will perform a cache invalidation. This will invalidate just a piece of the page(s).
2. As a last resort, making a `GET` request to `/api/revalidate/page?secret=[secret]&slug=/[path]` will invalidate every
   bit of cached data for that specific path. The system will then refetch the menu, config pages, and the page data to
   rebuild that one page. This approach will not invalidate cache on any other page and it does not support cache tags.
   It is very specific to only that single path.

To verify the cache is fixed, use the page invalidation mentioned above on a random page (try to avoid main menu items).
Invalidating the entire page's cache will give clear indication if the issue is fixed.

### Cache Documentation
- [Next.JS cache documentation](https://nextjs.org/docs/app/building-your-application/caching)
- [Next.JS "use cache" directive](https://nextjs.org/docs/app/api-reference/directives/use-cache)
- [Vercel Edge Caching](https://vercel.com/docs/edge-network/caching)

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out the [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
