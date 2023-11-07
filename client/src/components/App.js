import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

// Import components
import './App.css';
import InventoryList from './InventoryList'; 
import InventoryDetail from './InventoryDetail'; 
import ConventionsList from './ConventionsList';
import Header from './Header';
import Homepage from './Homepage';
import RegistrationForm from './RegistrationForm';
import Login from './Login';
import TotalSales from './TotalSales';
import { UserSessionProvider } from './UserSessionContext';

function App() {
  return (
    <div className="App">
    <UserSessionProvider>
    <Router>
      <div>
        <Header />
        <Switch>
          <Route path="/" exact component={Homepage} />
          <Route path="/inventory" component={InventoryList} />
          <Route path="/convention" component={ConventionsList} />
          <Route path="/register" component={RegistrationForm} />
          <Route path="/login" component={Login}/>
          <Route path="/total-sales" component={TotalSales}/>
        </Switch>
      </div>
    </Router>
    </UserSessionProvider>
    </div>
  );
}

export default App;