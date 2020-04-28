import React, { ReactNode } from "react"
import { Route } from "react-router-dom"
import auth0Client from "../Auth"

function SecuredRoute(props: { component: ReactNode, path: string }) {
   const { component: Component, path } = props;
   return (
      <Route path={path} render={() => {
         if (auth0Client.isAuthenticated()) return < > {Component} </>;
         auth0Client.signIn();
         return <div></div>
      }} />
   );
}

export default SecuredRoute;
