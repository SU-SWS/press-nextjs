"use client"

import {useCountdown} from "usehooks-ts"
import {useEffect} from "react"

const RedirectSignup = () => {
  const [count, {startCountdown}] = useCountdown({
    countStart: 5,
    intervalMs: 1000,
  })

  useEffect(() => startCountdown(), [startCountdown])
  useEffect(() => {
    if (count === 0) window.location.href = "https://signup.e2ma.net/signup/1414766/1406582/"
  }, [count])
  return <p>Redirecting to Newsletter Signup form in {count} seconds</p>
}
export default RedirectSignup
