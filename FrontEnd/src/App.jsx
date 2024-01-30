import { useState } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Login from './pages/login';
import Register from './pages/register';
import Verify from './components/verify';
import Create from './components/create';
import Home from './pages/home';

import { QueryClient, QueryClientProvider } from 'react-query';


function App() {

  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
    <Router>
      <Routes>
        <Route path="/login" element={<Login/>} />
        <Route path="/register" element={<Register/>} />
        <Route path="/verify" element={<Verify/>} />
        <Route path="/create" element={<Create/>} />
        <Route path="/" element={<Home/>} />

      </Routes>
    </Router>
    </QueryClientProvider>
  );
}

export default App;
