import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home/Home';

// For testing purposes we keep abstracted the Render three structure without 
// declare the createRoot method that will break a testing environment
export const App = () => (
  <BrowserRouter>
    <Routes>
      <Route index path='home' element={<Home />} />
      <Route path='*' element={<Navigate to='/home' />} />
    </Routes>
  </BrowserRouter>
);
