import {NodeSupBook} from "@lib/gql/__generated__/drupal";
import {H1} from "@components/elements/headers";
import {HTMLAttributes} from "react";

type Props = HTMLAttributes<HTMLElement> & {
  node: NodeSupBook
}
const SupBookPage = ({node, ...props}: Props) => {
  return (
    <article className="centered pt-32" {...props}>
      <div className="flex flex-col gap-10">
        <H1 className="order-2">
          {node.title}
        </H1>
      </div>
    </article>
  )
}
export default SupBookPage;