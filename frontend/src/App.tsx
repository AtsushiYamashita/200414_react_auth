import React, { Component } from 'react';
import { Route, RouteComponentProps, withRouter } from 'react-router';

import auth0Client from './Auth';
import Observer from './Observe';

import NavBar from "./NavBar/NavBar"
import Questions from './Questions/Questions';
import Question from './Question/Question';
import NewQuestion from "./NewQuestion/NewQuestion"
import SecuredRoute from "./SecuredRoute/SecuredRoute"
import Callback from "./Callback"


interface IProps extends RouteComponentProps { }

interface IState {
   checkingSession: boolean
}

class App extends Component<IProps, IState> {

   constructor(props: IProps) {
      super(props);
      this.state = {
         checkingSession: true
      }

   }

   componentDidMount() {
      const ret = new Promise<any[]>((result, rej) => {
         if (this.props.location.pathname === "/callback") {
            this.setState({checkingSession:false});
            return result([]);
         }

         const err = new Observer<any[]>()
         err.add_call_chain(e => !!e[0] && e[0].error === "login_required")
            .then(e => !e && console.error(e))

         const silent = new Observer<any[]>()
         silent.add_call(_ => this.setState({checkingSession:false}));
         silent.add_call(_ => this.forceUpdate());
         silent.add_call(_ => console.log("silent sign in"));
         silent.add_call(result);

         auth0Client.silentAuth()
            .then(silent.update, err.update)
            .catch(e => console.error(__filename, e));

      })
      return ret;
   }

   render() {
      return (
         <div>
            <NavBar />
            <Route exact path='/' component={Questions} />
            <SecuredRoute path='/new-question' component={NewQuestion} checkingSession={this.state.checkingSession} />
            <Route exact path='/question/:questionId' component={Question} />
            <Route exact path='/callback' component={Callback} />
         </div>
      );
   }
}

export default withRouter(App);
