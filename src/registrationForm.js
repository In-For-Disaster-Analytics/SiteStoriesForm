import React, { useState } from "react";
import Location from "./location";
import {
  saveAudioToIndexedDB,
  getFileFromIndexedDB,
  saveImageToIndexedDB,
} from "./db";

const formFields = [
  { id: "title", label: "Title", type: "text" },
  { id: "description", label: "Description", type: "textarea" },
  { id: "name", label: "Interviewer Name", type: "text", required: true },
  { id: "time", label: "Time", type: "datetime-local", required: true },
  { id: "location", label: "Location", type: "custom" },
  {
    id: "audio",
    label: "Audio Narrative",
    type: "file",
    accept: ".mp3,.m4a",
    required: true,
    tab: "audio",
  },
  {
    id: "image",
    label: "Image",
    type: "file",
    accept: "image/jpeg",
    required: true,
    tab: "image",
  },
  { id: "notes", label: "Notes", type: "textarea" },
];

function RegistrationForm({ onSubmitSuccess }) {
  const [formData, setFormData] = useState({});
  const [audioFile, setAudioFile] = useState(null);
  const [location, setLocation] = useState(null);
  const [activeTab, setActiveTab] = useState("audio");
  const [imageFile, setImageFile] = useState(null);
  const DEFAULT_LAT =60.876549;
  const DEFAULT_LONG = -162.460444;
  
  
  
  
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [id]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (
      activeTab === "audio" &&
      (file.type === "audio/mpeg" || file.type === "audio/x-m4a")
    ) {
      setAudioFile(file);
    } else if (activeTab === "image" && file.type === "image/jpeg") {
      setImageFile(file);
    } else {
      console.log("Invalid file type.");
    }
    setFormData((prevData) => ({ ...prevData, fileId: file.name }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const fileId =
        activeTab === "audio"
          ? await saveAudioToIndexedDB(audioFile, formData.title)
          : await saveImageToIndexedDB(imageFile, formData.title);

      const newFormData = {
        id: Date.now(),
        ...formData,
        location: formData.location || [DEFAULT_LONG, DEFAULT_LAT],

        fileId,
        fileType: activeTab,
      };
      // Retrieve existing data
      const existingData =
        JSON.parse(localStorage.getItem("siteStoryFormData")) || [];

      // Append new data
      const updatedData = [...existingData, newFormData];

      // Save updated data back to localStorage
      localStorage.setItem("siteStoryFormData", JSON.stringify(updatedData));

      console.log("Form data appended to localStorage:", newFormData);
      console.log("Total entries:", updatedData.length);
      // Confirm data storage
      try {
        const storedData = await getFileFromIndexedDB(fileId);
        console.log("Stored audio data:", storedData);
      } catch (error) {
        console.error("Error retrieving audio data:", error);
      }
      onSubmitSuccess();
    } catch (error) {
      console.error("Error saving form data:", error);
    }
  };
  return (
    <form onSubmit={handleSubmit} className="registration-form">
      <div className="tab-container">
      <button type="button" onClick={() => setActiveTab('audio')} className={`tab-button file-type-tab ${activeTab === 'audio' ? 'active' : ''}`}>
          Register Audio Narrative
        </button>
        <button type="button" onClick={() => setActiveTab('image')} className={`tab-button file-type-tab ${activeTab === 'image' ? 'active' : ''}`}>
          Register an Image
        </button>
      </div>
      <div className={`tab-content ${activeTab}`}>
      {formFields.map(
        (field) =>
          (!field.tab || field.tab === activeTab) && (
            <div key={field.id} className="registration-form">
              <label htmlFor={field.id}>{field.label}:</label>

              {field.type === "custom" && field.id === "location" ? (
                <Location
                  onLocationChange={(loc) =>
                    setFormData((prev) => ({ ...prev, location: loc }))
                  }
                />
              ) : field.type === "textarea" ? (
                <textarea
                  id={field.id}
                  value={formData[field.id] || ""}
                  onChange={handleInputChange}
                  required={field.required}
                />
              ) : field.type === "file" ? (
                <input
                  type={field.type}
                  id={field.id}
                  accept={field.accept}
                  onChange={handleFileChange}
                  required={field.required}
                />
              ) : (
                <input
                  type={field.type}
                  id={field.id}
                  value={formData[field.id] || ""}
                  onChange={handleInputChange}
                  required={field.required}
                />
              )}
            </div>
          )
      )}
      
      {audioFile && <p>Selected file: {audioFile.name}</p>}
      <button type="submit" className="submit-button">
        Register
      </button>
      </div>
    </form>
  );
}
export default RegistrationForm;
