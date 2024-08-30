import React, { useState, useRef, useEffect } from "react";
import RegistrationForm from "./registrationForm";
import List from "./components/List/list";
import Header from "./Header";
import ThreeDMap from "./3dObj/3dmap";
import Home from "./Home";
import Collections from "./components/Collections/Collections";
import "./App.css";
import { AppProvider } from './store/AppContext';


function App() {
  const [updateTrigger, setUpdateTrigger] = useState(0);
  const [activeTab, setActiveTab] = useState("home");
  const [activeSubTab, setActiveSubTab] = useState("registered");
  const [username, setUsername] = useState(localStorage.getItem("userName"));
  const collectionsRef = useRef();
  const [loginTrigger, setLoginTrigger] = useState(0);

  useEffect(() => {
    const storedUsername = localStorage.getItem("userName");
    if (storedUsername) {
      setUsername(storedUsername);
      setLoginTrigger(prev => prev + 1);
    }
  }, []);

  const triggerUpdate = () => {
    setUpdateTrigger((prev) => prev + 1);
    setActiveTab("submissions");
    setActiveSubTab("local");
  };

  return (
    <AppProvider>
        <div className="App">
          <Header onLogin={() => setLoginTrigger(prev => prev + 1)} />
          <div className="main-content">
            <div className="tab-container">
              <button
                className={`tab ${activeTab === "home" ? "active" : ""}`}
                onClick={() => setActiveTab("home")}
              >
                Home
              </button>
              <button
                className={`tab ${activeTab === "collections" ? "active" : ""}`}
                onClick={() => setActiveTab("collections")}
              >
                Collections
              </button>
              <div className="sub-tab-container">
                {activeTab === "collections" && (
                  <>
                    <button
                      className={`sub-tab ${
                        activeSubTab === "registered" ? "active" : ""
                      }`}
                      onClick={() => setActiveSubTab("registered")}
                    >
                      View a collection
                    </button>
                    <button
                      className={`sub-tab ${
                        activeSubTab === "map" ? "active" : ""
                      }`}
                      onClick={() => setActiveSubTab("map")}
                    >
                      Map a collection
                    </button>
                  </>
                )}
              </div>
              <button
                className={`tab ${activeTab === "submissions" ? "active" : ""}`}
                onClick={() => setActiveTab("submissions")}
              >
                Notebook
              </button>
              <div className="sub-tab-container">
                {activeTab === "submissions" && (
                  <>
                    <button
                      className={`sub-tab ${
                        activeSubTab === "form" ? "active" : ""
                      }`}
                      onClick={() => setActiveSubTab("form")}
                    >
                      Take Notes
                    </button>
                    <button
                      className={`sub-tab ${
                        activeSubTab === "local" ? "active" : ""
                      }`}
                      onClick={() => setActiveSubTab("local")}
                    >
                      Saved Local Entries
                    </button>
                  </>
                )}
              </div>
            </div>
            <div className="content-area">
              {activeTab === "home" && <Home username={username} />}

              {activeTab === "collections" && activeSubTab === "registered" && (
                <Collections ref={collectionsRef} username={username} loginTrigger={loginTrigger} />
              )}
              {activeTab === "collections" && activeSubTab === "map" && (
                <ThreeDMap />
              )}
              {activeTab === "submissions" && activeSubTab === "form" && (
                <RegistrationForm onSubmitSuccess={triggerUpdate} />
              )}
              {activeTab === "submissions" && activeSubTab === "local" && (
                <List updateTrigger={updateTrigger} />
              )}
            </div>
          </div>
        </div>
    </AppProvider>
  );
}

export default App;