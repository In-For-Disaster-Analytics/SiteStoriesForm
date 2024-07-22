# SiteStoriesForm

SiteStoriesForm is a React-based web application for collecting and managing site stories. It allows users to register new stories, view submitted entries, and upload audio files associated with each story.

## Features

- User authentication
- Registration form for new site stories
- List view of submitted entries
- Audio file upload and management
- Integration with Tapis for file storage
- ArcGIS integration for geospatial data submission

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Start the development server: `npm start`
4. Open [http://localhost:3000](http://localhost:3000) to view it in your browser.


## Components

- App: Main component managing the application state and navigation
- Header: Contains the application title and login form
- RegistrationForm: Form for submitting new site stories
- List: Displays submitted entries and handles data submission to external services

## External Services

- Tapis: Used for file storage and management
- ArcGIS: Used for geospatial data submission

## Technologies Used

- React
- Axios for API requests
- IndexedDB for local data storage

## Contributing

Contributions are welcome. Please submit pull requests for any enhancements.

## License

MIT License

Copyright (c) 2024 Will Mobley

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
