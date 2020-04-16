import React, { Component, ReactNode } from "react"
import { Link } from "react-router-dom"
import axios from "axios";
import { IQuestion } from "../interfaces/IQuestion"
import Container from "../Basics/Container"

export interface ICardViewProps {
   id: string|number,
   header: string,
   title: string,
   body: string | string[]
   linkto: string,
}

export default function CardView(props: ICardViewProps) {
   const { id, linkto, header, title, body } = props;
   return (
      <div key={id}
         className="col-sm-12 col-md-4 col-lg-3">
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
