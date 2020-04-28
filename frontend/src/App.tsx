import React from 'react';
import { Route } from 'react-router';

import NavBar from "./NavBar/NavBar"
import Questions from './Questions/Questions';
import Question from './Question/Question';
import NewQuestion from "./NewQuestion/NewQuestion"
import SecuredRoute from "./SecuredRoute/SecuredRoute"
import Callback from "./Callback"


function App() {
   return (
      <div>
         <NavBar />
         <Route exact path='/' component={Questions} />
         <SecuredRoute path='/new-question' component={NewQuestion} />
         <Route exact path='/question/:questionId' component={Question} />
         <Route exact path='/callback' component={Callback} />
      </div>
   );
}

export default App;
