import React from 'react';
import {
  BrowserRouter as Router,
  Link,
  Route,
  Switch
} from 'react-router-dom';
import Drawing from './Drawing';
import Home from './Home';
import Settings from './Settings';

const App = () => {
  return (
    <Router>
      <Switch>
        <Route path="/" exact>
          <Home />
        </Route>
        <Route path="/room/:id" exact>
          <Settings />
        </Route>
        <Route path="/canvas/:id" exact>
          <Drawing />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
