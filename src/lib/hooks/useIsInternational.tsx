"use client"

import {useLocalStorage} from "usehooks-ts"

// Region detection is removed. Leave the hook in case it's desired in the future.
// const useIsInternational = (): [boolean, (_value: boolean) => void] => {
//   const {value: isIntl, setValue: setIsIntl} = useBoolean(false)
//   const [userIntl, setUserIntl] = useLocalStorage<boolean | undefined>("intl", undefined, {initializeWithValue: false})
//
//   const onEvent = useCallback(
//     ({coords}: {coords: GeolocationCoordinates}) => {
//       const {latitude, longitude} = coords
//       setIsIntl(latitude < 24.5 || longitude > -52 || longitude < -170)
//     },
//     [setIsIntl]
//   )
//
//   useEffect(() => navigator.geolocation.getCurrentPosition(onEvent), [onEvent])
//   return [userIntl !== undefined ? userIntl : isIntl, setUserIntl]
// }

const useIsInternational = (): [boolean, (_value: boolean) => void] => {
  const [userIntl, setUserIntl] = useLocalStorage<boolean | undefined>("intl", undefined, {initializeWithValue: false})
  return [userIntl || false, setUserIntl]
}

export default useIsInternational
