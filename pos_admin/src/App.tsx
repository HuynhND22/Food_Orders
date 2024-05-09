import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Layout from './components/layout/layout'; // Import your Layout component
// Import your Login component

const App: React.FC = () => {
  return (
    <Router>
      <Switch>
        <Route path="/" render={() => <Layout />} /> {/* Route for Layout component */}
      </Switch>
    </Router>
  );
};

export default App;
