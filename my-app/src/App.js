import React, { useState } from 'react';
import Location from './location';
import RegistrationForm from './registrationForm';
import List from './list';
import Login from './login';
import './App.css';


function App() {
  const [updateTrigger, setUpdateTrigger] = useState(0);

  const triggerUpdate = () => {
    setUpdateTrigger(prev => prev + 1);
  };
  return (
    <div className="App">
      <Login/>
      <RegistrationForm onSubmitSuccess={triggerUpdate}/>
      <List updateTrigger={updateTrigger}/>

    </div>
  );
}

export default App;