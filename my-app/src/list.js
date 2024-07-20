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
        'https://tacc.tapis.io/v3/files/ops/ls6.wmobley//corral-repl/tacc/aci/PT2050/projects/PT2050-138/Interviews/' + fileName +".mp3",
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
  
//   const loadAudio = async (audioFileId) => {
//     setIsLoading(true);
//     let audioData = null;
//        audioData = await getAudioFromIndexedDB(audioFileId).catch(error => {
//         console.error('Error loading audio:', error);
//         audioData = null;
//       })
//       console.log(audioData)
      
        
//     if (audioData && audioData.result.audioFile) {
//         console.log('Audio file found:', audioData.audioFile);
//         uploadAudioToTapis(audioData.audioFile, audioData.fileName);

//         } else {
//         console.log('Audio file not found');
//         }
   
//       setIsLoading(false);

    
//   };
const loadAudio = async (audioFileId) => {
    setIsLoading(true);
    try {
      const audioData = await getAudioFromIndexedDB(audioFileId);
      if (audioData && audioData.result.audioFile) {
        const audioUrl = URL.createObjectURL(audioData.result.audioFile);
        console.log('Audio source URI:', audioUrl);
        console.log(audioData.result.title)
        uploadAudioToTapis(audioUrl, audioData.result.id);
        // You can now use this audioUrl to play the audio or for further processing
      } else {
        console.log('Audio file not found');
      }
    } catch (error) {
      console.error('Error loading audio:', error);
    } finally {
      setIsLoading(false);
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
          <p><strong>Audio File:</strong> {entry.audioFileName || 'No file uploaded'}</p>
          <p><strong>Notes:</strong> {entry.notes}</p>
          
                    <button onClick={() => loadAudio(entry.audioFileId)}>
                    Play Audio
                    </button>
          <button onClick={() => handleDelete(entry.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}

export default List;
