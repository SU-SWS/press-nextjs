import Link from "@components/elements/link"
import LockupLogo from "@components/elements/lockup/lockup-logo"

export const Lockup = () => {
  return (
    <div className="py-25">
      <Link href="/" className="flex flex-col gap-10 no-underline lg:flex-row">
        <LockupLogo />
      </Link>
    </div>
  )
}
export default Lockup
