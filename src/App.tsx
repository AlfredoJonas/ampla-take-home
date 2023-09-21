import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Table from "./pages/table/Table";
import { TableProvider } from "./context/Table";

export const App = () => (
  <TableProvider>
    {" "}
    {/* Wrap your entire app with TableProvider */}
    <BrowserRouter>
      <Routes>
        <Route index path="table/:id?" element={<Table />} />
        <Route path="*" element={<Navigate to="/table" />} />
      </Routes>
    </BrowserRouter>
  </TableProvider>
);
