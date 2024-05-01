"use client";

import useIsInternational from "@lib/hooks/useIsInternational";
import {HTMLAttributes} from "react";
import Button from "@components/elements/button";


type Props = HTMLAttributes<HTMLDivElement>;

const LocationSelection = ({...props}: Props) => {
  const [isIntl, setIntl] = useIsInternational();

  return (
    <div {...props}>
      <Button buttonElem secondary={!isIntl} disabled={!isIntl} aria-current={!isIntl} onClick={() => setIntl(false)}>
        US/Canada
      </Button>

      <Button buttonElem secondary={isIntl} disabled={isIntl} aria-current={isIntl} onClick={() => setIntl(true)}>
        International
      </Button>
    </div>
  )
}
export default LocationSelection;