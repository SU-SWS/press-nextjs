import {HTMLAttributes} from "react";

type Props = HTMLAttributes<HTMLDivElement>;

const PreBuiltAuthorList = async ({...props}: Props) => {
  // Fetch all the books, sort by authors, and then build pagination and side alpha selection.
  return (
    <div {...props}>
      Authoring list
    </div>
  )
}
export default PreBuiltAuthorList;