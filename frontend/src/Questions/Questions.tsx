import React, { Component } from "react"
import { Link } from "react-router-dom"
import axios from "axios";
import { IQuestion } from "../interfaces/IQuestion"
import Container from "../Basics/Container"
import CardView from "../Basics/Card"


function NewQuestion() {
   return (
      <Link to="/new-question">
         <div className="card text-white bg-secondary mb-3">
            <div className="card-header">Need help? Ask here!</div>
            <div className="card-body">
               <h4 className="card-title">+ New Question</h4>
               <p className="card-text">Don't worry. Help is on the way!</p>
            </div>
         </div>
      </Link>
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
      const to_card = (question: IQuestion, i: number) => <CardView
         key={i}
         id={question.id}
         linkto={`/question/${question.id}`}
         header={"Answers:" + question.answers}
         title={question.title}
         body={question.description}
      />
      return (
         <Container>
            <NewQuestion />
            {this.state.questions && this.state.questions.map(to_card)}
            {this.state.questions && this.state.questions.length < 1 && <p>Question is nothing...</p>}
            {!this.state.questions && <p>Loading questions...</p>}
         </Container>
      )
   }
}

export default Questions;
