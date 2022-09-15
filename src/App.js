import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import PasswordGenerator from "./components/PasswordGenerator";


function App() {
  return (
    <Router>
      <div className='container'>
        <Routes>
          <Route path="/" element={<PasswordGenerator />} />
          <Route path="*" element={<Navigate to="/"/>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
