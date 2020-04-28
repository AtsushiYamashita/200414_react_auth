import React from "react"
import { Link } from "react-router-dom"

export interface ICardViewProps {
   header: string,
   title: string,
   body: string | string[]
   linkto: string,
}

export default function CardView(props: ICardViewProps) {
   const { linkto, header, title, body } = props;
   return (
      <div className="col-sm-12 col-md-4 col-lg-3">
         <Link to={linkto}>
            <div className="card text-white bg-success mb-3">
               <div className="card-header"> {header}</div>
               <div className="card-body">
                  <h4 className="card-title">{title}</h4>
                  <p className="card-text">{body}</p>
               </div>
            </div>
         </Link>
      </div>
   )
}
