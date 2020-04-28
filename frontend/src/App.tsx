import React from 'react';
import { Route } from 'react-router';

import NavBar from "./NavBar/NavBar"
import Questions from './Questions/Questions';
import Question from './Question/Question';
import Callback from "./Callback"


function App() {
   return (
      <div>
         <NavBar />
         <Route exact path='/' component={Questions} />
         <Route exact path='/question/:questionId' component={Question} />
         <Route exact path='/callback' component={Callback} />
      </div>
   );
}

export default App;
