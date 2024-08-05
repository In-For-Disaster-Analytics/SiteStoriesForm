import React, { useState, useEffect } from 'react';
import axios from 'axios';

const RegisteredEntries = ({ username }) => {
  const [entries, setEntries] = useState([]);
  const jwt = localStorage.getItem("jwt");
  const jwtExpiration = localStorage.getItem("jwt_expiration");
  useEffect(() => {
    

   
    const fetchEntries = async () => {
      if (!jwt || new Date(jwtExpiration) < new Date()) {
        return;
      }
      try {
        const response = await axios.get('https://sitestories.io/arcgis/rest/services/Hosted/Narratives/FeatureServer/0/query', {
          params: {
            where: "account='"+localStorage.getItem('userName') +"'",
            outFields: '*',
            f: 'json'
          }
        });
        setEntries(response.data.features);
      } catch (error) {
        console.error('Error fetching entries:', error);
      }
      
    };

    fetchEntries();
  }, [username, jwt, jwtExpiration]);
  if (!jwt || new Date(jwtExpiration) < new Date()) {
    return <div>Please login to view registered entries.</div>;
  }
  return (
    <div className="registered-list">
      <h2>Registered Entries</h2>
      {entries.map((entry) => (
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
      ))}
    </div>
  );
};

export default RegisteredEntries;