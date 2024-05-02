"use client";

import {useBoolean, useLocalStorage} from "usehooks-ts";
import {useCallback, useEffect} from "react";

const useIsInternational = (): [boolean, (_value: boolean) => void] => {
  const {value: isIntl, setValue: setIsIntl} =  useBoolean(false)
  const [userIntl, setUserIntl] = useLocalStorage<boolean | undefined>("intl", undefined, {initializeWithValue: false})

  const onEvent = useCallback(({coords}: { coords: GeolocationCoordinates }) => {
    const {latitude, longitude} = coords;
    setIsIntl(latitude < 24.5 || longitude > -52 || longitude < -170)
  }, [setIsIntl]);

  useEffect(() => navigator.geolocation.getCurrentPosition(onEvent), [onEvent]);
  return [userIntl !== undefined ? userIntl : isIntl, setUserIntl];
}

export default useIsInternational;