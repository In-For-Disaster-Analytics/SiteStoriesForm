import React, { useEffect, useRef, useState } from 'react';

import PLYViewer from './plyViewer';

function ThreeDMap() {
  const mountRef = useRef(null);
  const [fileType, setFileType] = useState('ply');


  return  <>
  <div className="file-type-tabs">
  
</div>
  <div>
    {/* File type tabs */}
    <div className="file-type-tabs">
      {/* ... tab buttons ... */}
    </div>

    {/* Render viewer based on file type */}
  
      <PLYViewer />
   
  </div>

</>
}

export default ThreeDMap;