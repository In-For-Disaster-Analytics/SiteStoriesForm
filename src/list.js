import React, { useState, useEffect } from 'react';
import {openDB, saveAudioToIndexedDB, getAudioFromIndexedDB} from './db';
import axios from 'axios';
import ExpiredTokenModal from './ExpiredTokenModal';



function List( { updateTrigger }) {
  const [formEntries, setFormEntries] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  // const uploadAudioToTapis = async (audioURL, fileName) => {
  //   const jwt = localStorage.getItem('jwt');
  //   if (!jwt) {
  //     console.error('No JWT found. Please log in.');
  //     return;
  //   }
  
  //   const formData = new FormData();
  //   console.log(audioURL)
  //   formData.append('file', audioURL);
  
  //   try {
  //     const response = await axios.post(
  //       'https://tacc.tapis.io/v3/files/ops/ls6.wmobley//corral-repl/tacc/aci/PT2050/projects/PT2050-138/Interviews/' +fileName.id +".mp3",
  //       formData,
  //       {
  //         headers: {
  //           'X-Tapis-Token': jwt,
  //           'Content-Type': 'multipart/form-data'
  //         }
  //       }
  //     );
  //     console.log('File uploaded successfully:', response.data);
  //   } catch (error) {
  //     console.error('Error uploading file:', error);
  //   }
  // };
  const uploadAudioToTapis = async (audioUrl, fileName) => {
    const jwt = localStorage.getItem('jwt');
    if (!jwt) {
      console.error('No JWT found. Please log in.');
      return;
    }
    console.log(fileName.id, audioUrl)
    const body = {
      tag: "Audio file upload",
      elements: [
        {
          sourceURI: audioUrl,
          destinationURI: `tapis://ls6.wmobley/corral-repl/tacc/aci/PT2050/projects/PT2050-138/Interviews/${fileName.id}.mp3`
        }
      ]
    };
  
    try {
      const response = await axios.post(
        'https://tacc.tapis.io/v3/files/transfers',
        body,
        {
          headers: {
            'X-Tapis-Token': jwt,
            'Content-Type': 'application/json'
          }
        }
      );
      console.log('File transfer initiated:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error initiating file transfer:', error);
      throw error;
    }
  };

  const submitToArcGIS = async (formData) => {
    const arcgisUrl = 'https://sitestories.io/arcgis/rest/services/Hosted/Narratives/FeatureServer/0/addFeatures';
    const feature = {
      attributes: {
        description: formData.description,
        interviewer: localStorage.getItem('username'),
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
    console.log(feature)
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
  
  const playAudio = (audioUrl) => {
    const audio = new Audio(audioUrl);
    audio.play()
      .then(() => console.log('Audio playback started'))
      .catch(error => console.error('Error playing audio:', error));
  };

const handleSubmit = async (entry) => {
    const audioFileId = entry.audioFileId
    const jwt = localStorage.getItem('jwt');
    const jwtExpiration = localStorage.getItem('jwt_expiration');

    if (!jwt || new Date(jwtExpiration) < new Date()) {
      console.log(jwt ,new Date(jwtExpiration) , new Date(), new Date(jwtExpiration) < new Date())
      setIsModalOpen(true);
      return;
    }

    setIsLoading(true);
    if(new Date(localStorage.getItem('jwt_expiration'))> Date.now()){
    try {
      const audioData = await getAudioFromIndexedDB(audioFileId);
      console.log('Audio data retrieved from IndexedDB:', audioData);

      if (audioData && audioData.result.audioFile) {
        const audioUrl = URL.createObjectURL(audioData.result.audioFile);
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
    // const updatedEntries = formEntries.filter(item => item.id !== entry.id);
    // setFormEntries(updatedEntries);
    // localStorage.setItem('siteStoryFormData', JSON.stringify(updatedEntries));

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
          <ExpiredTokenModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
        </div>
      ))}
    </div>
  );
}

export default List;
