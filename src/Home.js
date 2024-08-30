import React from 'react';

function Home() {
  return (
    <div className="home-container">
      <h1>Welcome to Sites and Stories</h1>
      <p>
      By recording and analyzing human experiences with the power of AI and natural language processing we can correlate rich qualitative data with precision geospatial data to quantify and illustrate real world issues with a science-based approach.
      Sites and Stories provides a platform to support field research through organizing interviews, and . 
      </p>
      <div className="features">
        <h2>Key Features:</h2>
        <ul>
          <li>Create and explore digital collections of interviews, imagery, and notes</li>
          <li>Leverage High Performance Computing to transcribe your interview collections, and extract common themes.   </li>
          <li>Visualize and analyze interviews and notes with geospatial data</li>
          
        </ul>
      </div>
      <div className="cta">
        <h2>Get Started</h2>
        <p>Join our community and start exploring or contributing today!</p>
      
      </div>
    </div>
  );
}

export default Home;
