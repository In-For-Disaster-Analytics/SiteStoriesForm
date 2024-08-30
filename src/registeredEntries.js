import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useApp } from './store/AppContext';

const RegisteredEntries = (collectionName) => {
  const { state, dispatch } = useApp();
  const { isAuthenticated, username, jwt, jwtExpiration, entries, projects } = state;
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEntries = async () => {
      if (!isAuthenticated ) {
        setIsLoading(false);
        return;
      }
      try {
        
        
       
        dispatch({ type: 'SET_LOADING', payload: true });
        const where = `collection='${collectionName.collectionName}' and Allocation IN (${projects.map(title => `'${title}'`).join(', ')})`
        console.log(where);
        const response = await axios.get('https://sitestories.io/arcgis/rest/services/Hosted/Narratives/FeatureServer/0/query', {
          params: {
            where: where,
            outFields: '*',
            f: 'json'
          }
        });
        dispatch({ type: 'SET_ENTRIES', payload: response.data.features });
      } catch (error) {
        console.error('Error fetching entries:', error);
      } finally {
        setIsLoading(false);
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    fetchEntries();
  }, [isAuthenticated, username, jwt, jwtExpiration, dispatch]);

  if (!isAuthenticated) {
    return <div>Please login to view registered entries.</div>;
  }
console.log("entries", entries)
  // if (isLoading) {
  //   return <div className="loading">Loading registered entries...</div>;
  // }

  return (
    <div className="registered-list">
      <h2>Registered Entries</h2>
      {entries && entries.length > 0 ? (
        entries.map((entry) => (
          <div key={entry.attributes.objectid} className="metadata-card">
            <h3>Entry: {entry.attributes.title}</h3>
            <p><strong>Description:</strong> {entry.attributes.description}</p>
            <p><strong>Interviewer:</strong> {entry.attributes.interviewer}</p>
            <p><strong>Time:</strong> {new Date(entry.attributes.time_).toLocaleString()}</p>
            <p><strong>Latitude:</strong> {entry.attributes.esrignss_latitude}</p>
            <p><strong>Longitude:</strong> {entry.attributes.esrignss_longitude}</p>
            <p><strong>Audio File:</strong> {entry.attributes.audiofile || 'No file uploaded'}</p>
            <p><strong>Notes:</strong> {entry.attributes.notes}</p>
          </div>
        ))
      ) : (
        <p>No entries found.</p>
      )}
    </div>
  );};

export default RegisteredEntries;