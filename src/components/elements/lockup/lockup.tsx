import Link from "@components/elements/link";
import LockupLogo from "@components/elements/lockup/lockup-logo";

export const Lockup = () => {

  return (
    <div className="py-10">
      <Link href="/" className="flex flex-col lg:flex-row gap-4 no-underline">
        <LockupLogo/>
      </Link>
    </div>
  )
}
export default Lockup;