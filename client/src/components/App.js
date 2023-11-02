import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

// Import components
import InventoryList from './InventoryList'; 
import InventoryDetail from './InventoryDetail'; 
import ConventionsList from './ConventionsList';
import Header from './Header';
import Homepage from './Homepage';
import RegistrationForm from './RegistrationForm';
import Login from './Login';

function App() {
  return (
    <Router>
      <div>
        <Header />
        <Switch>
          <Route path="/" exact component={Homepage} />
          <Route path="/inventory" component={InventoryList} />
          <Route path="/convention" component={ConventionsList} />
          <Route path="/register" component={RegistrationForm} />
          <Route path="/login" component={Login}/>
        </Switch>
      </div>
    </Router>
  );
}

export default App;