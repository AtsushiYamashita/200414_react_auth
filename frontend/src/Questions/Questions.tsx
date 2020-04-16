import React, { Component, ReactNode } from "react"
import { Link } from "react-router-dom"
import axios from "axios";

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

interface IQuestion { id: number, answers: any[], title: string, description: string[] }

function QuestionView(props:
   { question: IQuestion }) {
   const { question } = props;
   return (
      <div key={question.id} className="col-sm-12 col-md-4 col-lg-3">
         <Link to={`/question/${question.id}`}>
            <div className="card text-white bg-success mb-3">
               <div className="card-header">Answers: {question.answers}</div>
               <div className="card-body">
                  <h4 className="card-title">{question.title}</h4>
                  <p className="card-text">{question.description}</p>
               </div>
            </div>
         </Link>
      </div>
   )
}

class Questions extends
   Component<{}, { questions: any }> {

   constructor(props: Readonly<{}>) {
      super(props);
      this.state = {
         questions: null
      }
   }

   async componentDidMount() {
      const res = await axios.get("http://localhost:8018/");
      const questions = await res.data;
      this.setState({ questions });
   }

   render() {
      console.log(`this state`, this.state)
      return (
         <Container>{
            this.state.questions
               ? this.state.questions.map((question: IQuestion, i: number) => <QuestionView question={question} key={i} />)
               : <p>Loading questions...</p>
         }</Container>
      )
   }
}

export default Questions;
