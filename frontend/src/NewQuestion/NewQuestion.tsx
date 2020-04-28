import React, { Component, ReactNode } from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import auth0Client from '../Auth';
import axios from 'axios';

interface IState {
   disabled: boolean;
   title: string;
   description: string;
}

interface IProps extends RouteComponentProps { }

function Container(props: { children?: ReactNode, header: string }) {
   return (
      <div className="container">
         <div className="row">
            <div className="col-12">
               <div className="card border-primary">
                  <div className="card-header">{props.header}</div>
                  <div className="card-body text-left">
                     {props.children}
                  </div>
               </div>
            </div>
         </div>
      </div>
   )
}

class NewQuestion extends Component<IProps, IState> {
   constructor(props: IProps) {
      super(props);

      this.state = {
         disabled: false,
         title: '',
         description: '',
      };
   }

   updateDescription(value: string) {
      this.setState({
         description: value,
      });
   }

   updateTitle(value: string) {
      this.setState({
         title: value,
      });
   }

   async submit() {
      this.setState({
         disabled: true,
      });

      await axios.post('http://localhost:8081', {
         title: this.state.title,
         description: this.state.description,
      }, {
         headers: { 'Authorization': `Bearer ${auth0Client.getIdToken()}` }
      });

      this.props.history.push('/');
   }

   render() {
      return (
         <Container header="New Question">
            <div className="form-group">
               <label htmlFor="exampleInputEmail1">Title:</label>
               <input
                  disabled={this.state.disabled}
                  type="text"
                  onBlur={(e) => { this.updateTitle(e.target.value) }}
                  className="form-control"
                  placeholder="Give your question a title."
               />
            </div>
            <div className="form-group">
               <label htmlFor="exampleInputEmail1">Description:</label>
               <input
                  disabled={this.state.disabled}
                  type="text"
                  onBlur={(e) => { this.updateDescription(e.target.value) }}
                  className="form-control"
                  placeholder="Give more context to your question."
               />
            </div>
            <button
               disabled={this.state.disabled}
               className="btn btn-primary"
               onClick={() => { this.submit() }}>
               Submit
              </button>
         </Container>
      )
   }
}

export default withRouter(NewQuestion);
