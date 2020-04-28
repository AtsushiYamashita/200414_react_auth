import React from 'react';
import { Link, withRouter, RouteComponentProps } from 'react-router-dom';
import auth0Client from "../Auth"

interface IProps extends RouteComponentProps {}

function SignButton(props: {
   sigh_name: string,
   sign_out: () => void
}) {
   const auth = auth0Client.isAuthenticated();
   const { sigh_name: name, sign_out } = props;
   const label = auth ? "Sign Out" : "Sign In";
   const onclick = auth ? sign_out : auth0Client.signIn;
   return (
      <div>
         <label className="mr-2 text-white">{name || ""}</label>
         <button className="btn btn-dark" onClick={onclick}>{label}</button>
      </div>
   );
}

function NavBar(props: IProps) {
   const sign_out = () => {
      auth0Client.signOut();
      props.history.replace(`/`);
   }

   const [name, setName] = React.useState("")
   auth0Client.getProfile().add_call(e => name.length < 1 ? [setName(e.name)] : []);
   return (
      <nav className="navbar navbar-dark bg-primary fixed-top">
         <Link className="navbar-brand" to="/"> Q&App </Link>
         <SignButton sigh_name={name} sign_out={sign_out} />
      </nav>
   );
}

export default withRouter(NavBar);
