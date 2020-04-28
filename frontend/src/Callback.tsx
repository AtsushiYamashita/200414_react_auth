import React, { Component } from 'react';
import { withRouter,RouteComponentProps } from 'react-router-dom';
import auth0Client from './Auth';

// type ExMem<B, O> = B & { [N in keyof O]: O[N] }
interface IProps extends RouteComponentProps { }

class Callback extends Component<IProps> {
   async componentDidMount() {
      const ret = await auth0Client.handleAuthentication();
      console.log("Callbacked", ret, this.props)
      this.props.history.replace('/');
   }

   render() {
      return (<p>Loading profile...</p>);
   }
}

export default withRouter(Callback);
