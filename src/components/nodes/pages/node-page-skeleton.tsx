/**
 * Placeholder for any node page while the entity is fetched from Drupal.
 *
 * The node type isn't known until the path is resolved, so this only mimics the
 * structure every page display shares: a page title followed by body content.
 */
const NodePageSkeleton = () => {
  return (
    <div className="centered mt-32" role="status" aria-label="Loading page content">
      <div className="rs-mb-4 h-[60px] w-full max-w-[800px] bg-black-10" aria-hidden />

      <div className="flex flex-col gap-10 xl:max-w-[980px]">
        <div className="h-[20px] w-full bg-black-10" aria-hidden />
        <div className="h-[20px] w-full bg-black-10" aria-hidden />
        <div className="h-[20px] w-10/12 bg-black-10" aria-hidden />
      </div>

      <div className="rs-mt-4 aspect-[16/9] w-full bg-black-10 xl:max-w-[980px]" aria-hidden />
    </div>
  )
}

export default NodePageSkeleton
