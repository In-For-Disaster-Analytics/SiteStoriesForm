import React, { useState, useEffect } from "react";
import { getFileFromIndexedDB } from "./db";
// import axios from 'axios';
import ExpiredTokenModal from "./ExpiredTokenModal";

function List({ updateTrigger }) {
  const [formEntries, setFormEntries] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  console.log(isLoading);
  useEffect(() => {
    const loadFormData = () => {
      const data = JSON.parse(localStorage.getItem("siteStoryFormData")) || [];

      setFormEntries(data);
    };

    loadFormData();
    window.addEventListener("storage", loadFormData);

    return () => {
      window.removeEventListener("storage", loadFormData);
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
  // const uploadAudioToTapis = async (audioUrl, fileName) => {
  //   const jwt = localStorage.getItem('jwt');
  //   if (!jwt) {
  //     console.error('No JWT found. Please log in.');
  //     return;
  //   }
  //   console.log(fileName.id, audioUrl)
  //   const body = {
  //     tag: "Audio file upload",
  //     elements: [
  //       {
  //         sourceURI: audioUrl,
  //         destinationURI: `tapis://ls6.wmobley/corral-repl/tacc/aci/PT2050/projects/PT2050-138/Interviews/${fileName.id}.mp3`
  //       }
  //     ]
  //   };

  //   try {
  //     const response = await axios.post(
  //       'https://tacc.tapis.io/v3/files/transfers',
  //       body,
  //       {
  //         headers: {
  //           'X-Tapis-Token': jwt,
  //           'Content-Type': 'application/json'
  //         }
  //       }
  //     );
  //     console.log('File transfer initiated:', response.data);
  //     return response.data;
  //   } catch (error) {
  //     console.error('Error initiating file transfer:', error);
  //     throw error;
  //   }
  // };

  const submitToArcGIS = async (formData) => {
    const arcgisUrl =
      "https://sitestories.io/arcgis/rest/services/Hosted/Narratives/FeatureServer/0/addFeatures";
    const feature = {
      attributes: {
        description: formData.description,
        interviewer: formData.name,
        time_: new Date(formData.time).getTime(),
        audiofile: formData.fileId + (formData.fileType === 'image' ? '.jpg' : (formData.audioFileType === 'audio/x-m4a' ? '.m4a' : '.mp3')),
        notes: formData.notes,
        esrignss_latitude: formData.location[1],
        esrignss_longitude: formData.location[0],
      },
      // geometry: {
      //   x: formData.location[1],
      //   y: formData.location[0],
      //   spatialReference: {
      //     wkid: 4326,
      //   },
        
      // },
    };
    console.log(feature);
    const params = new URLSearchParams({
      features: JSON.stringify([feature]),
      f: "json",
    });

    try {
      const response = await fetch(arcgisUrl, {
        method: "POST",
        body: params,
      });
      const result = await response.json();
      console.log("ArcGIS submission result:", result.addResults[0]);
    } catch (error) {
      console.error("Error submitting to ArcGIS:", error);
    }
  };

  // const playAudio = (audioUrl) => {
  //   const audio = new Audio(audioUrl);
  //   audio.play()
  //     .then(() => console.log('Audio playback started'))
  //     .catch(error => console.error('Error playing audio:', error));
  // };

  const saveFileLocally = async (fileURL, fileName, fileType) => {
    try {
      const response = await fetch(fileURL);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.download = `${fileName}.${fileType === 'image' ? 'jpg' : (fileType === 'audio/x-m4a' ? 'm4a' : 'mp3')}`;
      console.log(`${fileName}.${fileType === 'image' ? 'jpg' : (fileType === 'audio/x-m4a' ? 'm4a' : 'mp3')}`)
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      console.log("File saved locally");
    } catch (error) {
      console.error("Error saving file locally:", error);
    }
  };

  const handleSubmit = async (entry) => {
    const fileId = entry.fileId;
    const jwt = localStorage.getItem("jwt");
    const jwtExpiration = localStorage.getItem("jwt_expiration");

    if (!jwt || new Date(jwtExpiration) < new Date()) {
      setIsModalOpen(true);
      return;
    }

    setIsLoading(true);
    if (new Date(localStorage.getItem("jwt_expiration")) > Date.now()) {
      try {
        const fileData = await getFileFromIndexedDB(fileId);
        console.log("File data retrieved from IndexedDB:", fileData);
      
        if (fileData && fileData.file) {
          const fileUrl = URL.createObjectURL(fileData.file);
          saveFileLocally(fileUrl, fileData.id, entry.fileType);
        } else {
          console.log("File not found or invalid file data");
        }
      } catch (error) {
        console.error("Error loading file:", error);
      
      } finally {
        setIsLoading(false);
        submitToArcGIS(entry);
        handleDelete(entry.id);
      }
    } else {
      console.log("JWT expired. Please log in again.");
    }
  };

  const handleDelete = (id) => {
    const updatedEntries = formEntries.filter((entry) => entry.id !== id);
    setFormEntries(updatedEntries);
    localStorage.setItem("siteStoryFormData", JSON.stringify(updatedEntries));
  };

  return (
    <div className="form-entries-list">
      <h2 className="submitted-entries-header">Submitted Entries</h2>

      
       {formEntries.length === 0 ? (
        <div className="metadata-card empty-card">
          <p>No entries have been submitted yet.</p>
        </div>
      ) : (formEntries.map((entry) => (
        <div key={entry.id} className="metadata-card">
          <h3>{entry.title}</h3>
          <p>
            <strong>Description:</strong> {entry.description}
          </p>
          <p>
            <strong>Interviewer:</strong> {entry.name}
          </p>
          <p>
            <strong>Time:</strong> {new Date(entry.time).toLocaleString()}
          </p>
          <p>
            <strong>Location:</strong> {entry.location}
          </p>
          <p>
  <strong>File:</strong>{" "}
  {entry.fileId + (entry.fileType === 'image' ? '.jpg' : (entry.audioFileType === 'audio/x-m4a' ? '.m4a' : '.mp3')) || "No file uploaded"}
</p>

          <p>
            <strong>Notes:</strong> {entry.notes}
          </p>
          <div className="button-container">
            <button onClick={() => handleSubmit(entry)}>
              Submit to PTDataX
            </button>
            <button onClick={() => handleDelete(entry.id)}>Delete</button>
          </div>
          <ExpiredTokenModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
          />
        </div>
      ))
  )}
    </div>
  );
}

export default List;
