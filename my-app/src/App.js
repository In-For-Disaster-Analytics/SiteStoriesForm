import React, { useState } from 'react';
// import Location from './location';
import RegistrationForm from './registrationForm';
import List from './list';
import Header from './Header';
import './App.css';

function App() {
  const [updateTrigger, setUpdateTrigger] = useState(0);
  const [activeTab, setActiveTab] = useState('form');

  const triggerUpdate = () => {
    setUpdateTrigger(prev => prev + 1);
    setActiveTab('list');
  };

  return (
    <div className="App">
      <Header />
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
          Submitted Entries
        </button>
      </div>
      {activeTab === 'form' ? (
        <RegistrationForm onSubmitSuccess={triggerUpdate} />
      ) : (
        <List updateTrigger={updateTrigger} />
      )}
    </div>
  );
}

export default App;
