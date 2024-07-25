import React, { useState } from "react";
import Location from "./location";
import { saveAudioToIndexedDB, getAudioFromIndexedDB } from "./db";

function RegistrationForm({ onSubmitSuccess }) {
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");
  const [audioFile, setAudioFile] = useState(null);
  const [notes, setNotes] = useState("");
  let saveFormDataToFile = null;

  saveFormDataToFile = async (formData) => {
    try {
      const handle = await window.showSaveFilePicker({
        suggestedName: `${formData.title}.mp3`,
        types: [
          {
            description: "MP3 Audio",
            accept: { "audio/mpeg": [".mp3"] },
          },
        ],
      });
      const writable = await handle.createWritable();
      await writable.write(formData.audioFile);
      await writable.close();
      console.log(handle);
      console.log("File saved successfully");
    } catch (err) {
      console.error("Error saving file:", err);
    }
  };

  const handleAudioFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      console.log(file);
      setAudioFile(file.name ? file : null);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const audioFileId = await saveAudioToIndexedDB(audioFile, title);

      const newFormData = {
        id: Date.now(),
        name,
        title,
        description,
        time,
        location,
        audioFileId,
        notes,
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
        const storedData = await getAudioFromIndexedDB(audioFileId);
        console.log("Stored audio data:", storedData);
      } catch (error) {
        console.error("Error retrieving audio data:", error);
      }
      onSubmitSuccess();
    } catch (error) {
      console.error("Error saving form data:", error);
    }
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   const newFormData = {
  //     id: Date.now(),
  //     name,
  //     title,
  //     description,
  //     time,
  //     location,
  //     audioFileName: audioFile ? audioFile.name : null,
  //     audioFile: audioFile,
  //     notes
  //   };

  //   // Retrieve existing data
  //   const existingData = JSON.parse(localStorage.getItem('siteStoryFormData')) || [];

  //   // Append new data
  //   const updatedData = [...existingData, newFormData];

  //   // Save updated data back to localStorage
  //   localStorage.setItem('siteStoryFormData', JSON.stringify(updatedData));
  //   localStorage.setItem(newFormData.title, audioFile);
  //   console.log(localStorage)
  //   // Save file locally
  //   // await saveFormDataToFile(newFormData);
  //   console.log('Form data appended to localStorage:', newFormData);
  //   console.log('Total entries:', updatedData.length);

  //   // Optionally, reset form fields here
  //   onSubmitSuccess();
  // };

  return (
    <form onSubmit={handleSubmit} className="registration-form">
      <div className="registration-form">
        <label htmlFor="Title">Title:</label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        ></input>
      </div>
      <div className="registration-form">
        <label htmlFor="Description">Description:</label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        ></textarea>
      </div>
      <div className="registration-form">
        <label htmlFor="name">Interviewer Name:</label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div className="registration-form">
        <label htmlFor="time">Time:</label>
        <input
          type="datetime-local"
          id="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          required
        />
      </div>
      <div className="registration-form">
        <Location onLocationChange={setLocation} />
      </div>
      <div className="registration-form">
        <label htmlFor="audio">Audio Narrative Location:</label>
        <input
          type="file"
          id="audio"
          accept=".mp3"
          onChange={handleAudioFileChange}
          required
        />
        {audioFile && <p>Selected file: {audioFile.name}</p>}
      </div>
      <div className="registration-form">
        <label htmlFor="notes">Notes:</label>
        <textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        ></textarea>
      </div>
      <button type="submit" className="submit-button">
        Register
      </button>
    </form>
  );
}
export default RegistrationForm;
