import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import NewTable from './pages/newTable/NewTable';
import { TableProvider } from './context/Table';

export const App = () => (
  <TableProvider> {/* Wrap your entire app with TableProvider */}
    <BrowserRouter>
      <Routes>
        <Route index path='newTable' element={<NewTable />} />
        <Route path='*' element={<Navigate to='/newTable' />} />
      </Routes>
    </BrowserRouter>
  </TableProvider>
);
