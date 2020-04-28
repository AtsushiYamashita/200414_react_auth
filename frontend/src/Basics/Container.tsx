import React, { ReactNode } from "react"

function Container(props: {
   children?: ReactNode
}) {
   return (
      <div className="container">
         <div className="row">
            {props.children}
         </div>
      </div>
   )
}

export default Container;
