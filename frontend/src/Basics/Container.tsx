import React, {  ReactNode } from "react"
export default function Container(props: {
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
