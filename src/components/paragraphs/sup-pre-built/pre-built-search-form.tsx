import {HTMLAttributes} from "react";
import SiteSearchForm from "@components/search/site-search-form";

type Props = HTMLAttributes<HTMLDivElement>;

const PrebuiltSearchForm = ({...props}: Props) => {
  return (
    <div {...props}>
      <SiteSearchForm/>
    </div>
  )
}
export default PrebuiltSearchForm;