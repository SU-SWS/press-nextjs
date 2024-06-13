import Link from "@components/elements/link"
import LockupLogo from "@components/elements/lockup/lockup-logo"

export const Lockup = () => {
  return (
    <div className="py-10">
      <Link
        href="/"
        className="flex flex-col gap-4 no-underline lg:flex-row"
      >
        <LockupLogo />
      </Link>
    </div>
  )
}
export default Lockup
