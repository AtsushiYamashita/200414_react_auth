import React, { Component } from 'react';
import axios from 'axios';
import { IQuestion } from "../interfaces/IQuestion"

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
      const { match: { params } } = this.props;
      const url = `http://localhost:8018/${params.questionId}`;
      const question = (await axios.get(url)).data;
      console.log(`>> 25`,question)
      this.setState({ question });
   }

   render() {
      const { question } = this.state;
      if (question === null) return <p>Loading ...</p>;
      console.log(`>> 32`)
      return (
         <div className="container">
            <div className="row">
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
            </div>
         </div>
      )
   }
}

export default Question;
