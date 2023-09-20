import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import NewTable from './pages/newTable/NewTable';

// For testing purposes we keep abstracted the Render three structure without 
// declare the createRoot method that will break a testing environment
export const App = () => (
  <BrowserRouter>
    <Routes>
      <Route index path='newTable' element={<NewTable />} />
      <Route path='*' element={<Navigate to='/newTable' />} />
    </Routes>
  </BrowserRouter>
);
