"use client"

import {useCountdown} from "usehooks-ts"
import {useEffect} from "react"
import {useRouter} from "next/navigation";

const RedirectSignup = () => {
  const [count, {startCountdown}] = useCountdown({
    countStart: 5,
    intervalMs: 1000,
  })
  const router = useRouter()

  useEffect(() => startCountdown(), [startCountdown])
  useEffect(() => {
    if (count === 0) router.replace("https://signup.e2ma.net/signup/1414766/1406582/")
  }, [count, router])
  return <p>Redirecting to Newsletter Signup form in {count} seconds</p>
}
export default RedirectSignup
