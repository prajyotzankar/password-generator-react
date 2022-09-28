import React from 'react'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from 'react-router-dom'
import PasswordGenerator from './components/PasswordGenerator'

function App () {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<PasswordGenerator />} />
        <Route path='*' element={<Navigate to='/' />} />
      </Routes>
    </Router>
  )
}

export default App
