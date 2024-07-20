import React, { useState } from 'react';

function RegistrationForm() {
  const [name, setName] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');
  const [video, setVideo] = useState(null);
  const [notes, setNotes] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log({ name, time, location, video, notes });
  };

  return (
    <form onSubmit={handleSubmit} className="registration-form">
      <div>
        <label htmlFor="name">Name:</label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="time">Time:</label>
        <input
          type="datetime-local"
          id="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="location">Location:</label>
        <input
          type="text"
          id="location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="video">Video (MP4):</label>
        <input
          type="file"
          id="video"
          accept="video/mp4"
          onChange={(e) => setVideo(e.target.files[0])}
          required
        />
      </div>
      <div>
        <label htmlFor="notes">Notes:</label>
        <textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        ></textarea>
      </div>
      <button type="submit">Register</button>
    </form>
  );
}

function App() {
  return (
    <div className="App">
      <HelloWorld />
      <RegistrationForm />
    </div>
  );
}