import React, { createContext, useReducer, useContext } from 'react';

const AppContext = createContext();

const initialState = {
  // Auth state
  isAuthenticated: false,
  username: '',
  jwt: null,
  jwtExpiration: null,
  // Collections state
  collections: [],
  activeCollection: null,
  isLoading: false,
  entries: [],
  projects: [],
};

function appReducer(state, action) {
  switch (action.type) {
    // Auth actions
    case 'LOGIN':
      return {
        ...state,
        isAuthenticated: true,
        username: action.payload.username,
        jwt: action.payload.jwt,
        jwtExpiration: action.payload.jwtExpiration,
      };
    case 'LOGOUT':
      return {
        ...initialState,
        collections: [], // Clear collections on logout
      };
    // Collections actions
    case 'SET_COLLECTIONS':
      return { ...state, collections: action.payload };
    case 'SET_ACTIVE_COLLECTION':
      return { ...state, activeCollection: action.payload };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ENTRIES':
      return { ...state, entries: action.payload };
    case 'SET_PROJECTS':
      return { ...state, projects: action.payload };
    default:
      return state;
  }
}export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);
  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
