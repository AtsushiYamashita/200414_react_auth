import React, { ComponentProps } from 'react';
import { Link, withRouter } from 'react-router-dom';
import auth0Client from "../Auth"

type Duck<B, O> = B & { [N in keyof O]: O[N] }
type Prop = Duck<ComponentProps<any>, { history: string }>

function NavBar(props: Prop) {
   const sign_out = () => {
      auth0Client.signOut();
      props.history.replace(`/`, "");
   }

   const [name, setName] = React.useState("")
   if (name.length < 1) {
      auth0Client.getProfile().add_call(e => setName(e.name));
   }
   return (
      <nav className="navbar navbar-dark bg-primary fixed-top">
         <Link className="navbar-brand" to="/">
            Q&App
      </Link>
         {
            !auth0Client.isAuthenticated() &&
            <button className="btn btn-dark"
               onClick={auth0Client.signIn }>Sign In</button>
         }
         {
            auth0Client.isAuthenticated() && [
               console.log('name >> ', name),
            ]&&
            <div>
               <label className="mr-2 text-white">{
                  name || "PROFILE FAIL"}</label>
               <button className="btn btn-dark"
                  onClick={sign_out}>Sign Out</button>
            </div>
         }
      </nav>
   );
}

export default withRouter(NavBar);
