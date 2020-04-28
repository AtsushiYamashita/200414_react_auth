import React, { Component, ComponentProps } from 'react';
import { withRouter } from 'react-router-dom';
import auth0Client from './Auth';

type ExMem<B, O> = B & { [N in keyof O]: O[N] }
type Prop = ExMem<ComponentProps<any>, { history: string }>

class Callback extends Component<Prop> {
   constructor(props: Prop) { super(props); }

   async componentDidMount() {
      const ret = await auth0Client.handleAuthentication();
      // console.log(ret);
      console.log("Callbacked", ret, this.props)
      this.props.history.replace('/', "");
   }

   render() {
      return (
         <p>Loading profile...</p>
      );
   }
}

export default withRouter(Callback);
