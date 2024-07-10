import {useState, useEffect, useTransition, useRef} from "react"
import {useBoolean} from "usehooks-ts"

/**
 *
 * @param action
 * @param onFinished
 *
 * @see https://github.com/vercel/next.js/discussions/51371#discussioncomment-7143482
 */
const useServerAction = <P, R>(action?: (_: P) => Promise<R>, onFinished?: (_: R | undefined) => void): [(_: P) => Promise<R | undefined>, boolean] => {
  const [isPending, startTransition] = useTransition()
  const [result, setResult] = useState<R>()
  const {value: finished, setTrue: setFinished} = useBoolean(false)
  const resolver = useRef<(_value?: R | PromiseLike<R>) => void>()

  useEffect(() => {
    if (!finished) return

    if (onFinished) onFinished(result)
    resolver.current?.(result)
  }, [result, finished, onFinished])

  const runAction = async (args: P): Promise<R | undefined> => {
    startTransition(() => {
      if (action) {
        action(args).then(data => {
          setResult(data)
          setFinished()
        })
      }
    })

    return new Promise(resolve => {
      resolver.current = resolve
    })
  }

  return [runAction, isPending]
}

export default useServerAction
