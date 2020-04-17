import React, { ComponentProps } from 'react';
import { Link, withRouter } from 'react-router-dom';
import auth0Client from "../Auth"

type ExMem<B, O> = B & { [N in keyof O]: O[N] }
type Prop = ExMem<ComponentProps<any>, { history: string }>


function NavBar(props: Prop) {
   const sign_out = () => {
      auth0Client.signOut();
      props.history.replace(`/`, "");
   }
   return (
      <nav className="navbar navbar-dark bg-primary fixed-top">
         <Link className="navbar-brand" to="/">
            Q&App
      </Link>
         {
            !auth0Client.isAuthenticated() &&
            <button className="btn btn-dark" onClick={auth0Client.signIn}>Sign In</button>
         }
         {
            auth0Client.isAuthenticated() &&
            <div>
               <label className="mr-2 text-white">{auth0Client.getProfile().name}</label>
               <button className="btn btn-dark" onClick={() => { sign_out() }}>Sign Out</button>
            </div>
         }
      </nav>
   );
}

export default NavBar;
