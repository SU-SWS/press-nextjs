"use client"

import {HtmlHTMLAttributes} from "react"
import {useIntersectionObserver} from "usehooks-ts"

type Props = HtmlHTMLAttributes<HTMLDivElement>

const Iframe = ({children, ...props}: Props) => {
  const {isIntersecting, ref} = useIntersectionObserver({freezeOnceVisible: true})
  return <div ref={ref}>{isIntersecting && <iframe {...props}>{children}</iframe>}</div>
}

export default Iframe
