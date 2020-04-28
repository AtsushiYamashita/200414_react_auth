import React, { Component } from 'react';
import axios from 'axios';
import { IQuestion } from "../interfaces/IQuestion"
import auth0Client from '../Auth';
import Container from "../Basics/Container"

const HOST = "http://localhost:8018"

interface IProps {
   match: { params: any }
}
interface IStates {
   question: IQuestion | null
}

class Question extends Component<IProps, IStates> {
   constructor(props: IProps) {
      super(props);
      console.log(`>> 15`)
      this.state = {
         question: null,
      };
   }

   async componentDidMount() {
      await this.refreshQuestion();
   }

   async refreshQuestion() {
      const { match: { params } } = this.props;
      const url = `${HOST}/${params.questionId}`;
      const question = (await axios.get(url)).data;
      // console.log(`>> 25`,question)
      this.setState({ question });
   }

   async submitAnswer(answer: any) {
      const post_to = this.state.question && `${HOST}/answer/${this.state.question.id}`;
      const data = { answer }
      const config = {
         headers: {
            'Authorization': `Bearer ${auth0Client.getIdToken()}`
         }
      }
      if (!post_to) {
         console.error("Fail post to =", this.state.question);
         return;
      }
      await axios.post(post_to, data, config);
      await this.refreshQuestion();
   }

   render() {
      const { question } = this.state;
      if (question === null) return <p>Loading ...</p>;
      return (
         <Container>
            <div className="jumbotron col-12">
               <h1 className="display-3">{question.title}</h1>
               <p className="lead">{question.description}</p>
               <hr className="my-4" />
               <p>Answers:</p>
               {
                  question.answers.map((answer, idx) => (
                     <p className="lead" key={idx}>{answer.answer}</p>
                  ))
               }
            </div>
         </Container>
      )
   }
}

export default Question;
