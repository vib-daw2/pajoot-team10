import { useState } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Login from './pages/login';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login/>} />
      </Routes>
    </Router>
  );
}

export default App;
