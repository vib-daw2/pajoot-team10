import { useState } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Login from './pages/login';
import Newcount from './pages/newcount';
import Register from './components/register';
import Verify from './components/verify';
import Create from './components/create';
import Home from './pages/home';
import Notfound from './pages/notfound';


import { QueryClient, QueryClientProvider } from 'react-query';


function App() {

  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
    <Router>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/newcount" element={<Newcount/>} />
        <Route path="/register" element={<Register/>} />
        <Route path="/verify" element={<Verify/>} />
        <Route path="/create" element={<Create/>} />
        
        <Route path="/*" element={<Notfound/>} />

      </Routes>
    </Router>
    </QueryClientProvider>
  );
}

export default App;
