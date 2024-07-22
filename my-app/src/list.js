import React, { useState, useEffect } from 'react';
import {openDB, saveAudioToIndexedDB, getAudioFromIndexedDB} from './db';
import axios from 'axios';



function List( { updateTrigger }) {
  const [formEntries, setFormEntries] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadFormData = () => {
      const data = JSON.parse(localStorage.getItem('siteStoryFormData')) || [];
    
      setFormEntries(data);
    };

    loadFormData();
    window.addEventListener('storage', loadFormData);

    return () => {
      window.removeEventListener('storage', loadFormData);
    };
  }, [updateTrigger]);

  const uploadAudioToTapis = async (audioFile, fileName) => {
    const jwt = localStorage.getItem('jwt');
    if (!jwt) {
      console.error('No JWT found. Please log in.');
      return;
    }
  
    const formData = new FormData();
    formData.append('file', audioFile);
  
    try {
      const response = await axios.post(
        'https://tacc.tapis.io/v3/files/ops/ls6.wmobley//corral-repl/tacc/aci/PT2050/projects/PT2050-138/Interviews/' +fileName.id +".mp3",
        formData,
        {
          headers: {
            'X-Tapis-Token': jwt,
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      console.log('File uploaded successfully:', response.data);
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  const submitToArcGIS = async (formData) => {
    const arcgisUrl = 'https://sitestories.io/arcgis/rest/services/Hosted/Narratives/FeatureServer/0/addFeatures';
    const feature = {
      attributes: {
        description: formData.description,
        interviewer: "Test",
        time_: new Date(formData.time).getTime(),
        audiofile: formData.audioFileId + '.mp3',
        notes: formData.notes,
        esrignss_latitude: formData.location[1],
        esrignss_longitude: formData.location[0]
      },
      "geometry": {
        spatialReference: {
            wkid: 4326
          },
        "x": formData.location[1],
        "y": formData.location[0]
      }
    };
  
    const params = new URLSearchParams({
      features: JSON.stringify([feature]),
      f: 'json'
    });
  
    try {
      const response = await fetch(arcgisUrl, {
        method: 'POST',
        body: params
      });
      const result = await response.json();
      console.log('ArcGIS submission result:', result.addResults[0]);
    } catch (error) {
      console.error('Error submitting to ArcGIS:', error);
    }
  };
  
const handleSubmit = async (entry) => {
    const audioFileId = entry.audioFileId
    setIsLoading(true);
    if(new Date(localStorage.getItem('jwt_expiration'))> Date.now()){
    try {
      const audioData = await getAudioFromIndexedDB(audioFileId);
      if (audioData && audioData.result.audioFile) {
        const audioUrl = URL.createObjectURL(audioData.result.audioFile);
        console.log('Audio source URI:', audioUrl);
        console.log(audioData.result.title)
        uploadAudioToTapis(audioUrl, audioData.result);
        // You can now use this audioUrl to play the audio or for further processing
      } else {
        console.log('Audio file not found');
      }
    } catch (error) {
      console.error('Error loading audio:', error);
    } finally {
      setIsLoading(false);
      submitToArcGIS(entry);
      // Remove the submitted entry from the list
    const updatedEntries = formEntries.filter(item => item.id !== entry.id);
    setFormEntries(updatedEntries);
    localStorage.setItem('siteStoryFormData', JSON.stringify(updatedEntries));

    }
    }else{
       console.log('JWT expired. Please log in again.');
    }
  };

  
  
  const handleDelete = (id) => {
    const updatedEntries = formEntries.filter(entry => entry.id !== id);
    setFormEntries(updatedEntries);
    localStorage.setItem('siteStoryFormData', JSON.stringify(updatedEntries));
  };

  return (
    <div className="form-entries-list">
      <h2>Submitted Entries</h2>
      {formEntries.map((entry) => (
        <div key={entry.id} className="metadata-card">
          <h3>{entry.title}</h3>
          <p><strong>Description:</strong> {entry.description}</p>
          <p><strong>Interviewer:</strong> {entry.name}</p>
          <p><strong>Time:</strong> {new Date(entry.time).toLocaleString()}</p>
          <p><strong>Location:</strong> {entry.location}</p>
          <p><strong>Audio File:</strong> {entry.audioFileId +".mp3" || 'No file uploaded'}</p>
          <p><strong>Notes:</strong> {entry.notes}</p>
          
                    <button onClick={() => handleSubmit(entry)}>
                    Submit to PTDataX
                    </button>
          <button onClick={() => handleDelete(entry.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}

export default List;
