import React, { useState } from 'react';
// import Location from './location';
import RegistrationForm from './registrationForm';
import RegisteredEntries from './registeredEntries';
import List from './list';
import Header from './Header';
import './App.css';

function App() {
  const [updateTrigger, setUpdateTrigger] = useState(0);
  const [activeTab, setActiveTab] = useState('form');
  const [username, setUsername] = useState('');

  const triggerUpdate = () => {
    setUpdateTrigger(prev => prev + 1);
    setActiveTab('list');
  };

  return (
    <div className="App">
      <Header setUsername={setUsername} />
      <div className="tab-container">
        <button 
          className={`tab ${activeTab === 'form' ? 'active' : ''}`}
          onClick={() => setActiveTab('form')}
        >
          Registration Form
        </button>
        <button 
          className={`tab ${activeTab === 'list' ? 'active' : ''}`}
          onClick={() => setActiveTab('list')}
        >
          Submitted Local Entries
        </button>
        <button 
          className={`tab ${activeTab === 'Registered' ? 'active' : ''}`}
          onClick={() => setActiveTab('Registered')}
        >
          Registered Entries
        </button>
      </div>
      {activeTab === 'form' ? (
        <RegistrationForm onSubmitSuccess={triggerUpdate} />
      ) : activeTab === 'list' ?  (
        <List updateTrigger={updateTrigger} />
      ) :(
        <RegisteredEntries username={username} />
      )}
    </div>
  );
}

export default App;
