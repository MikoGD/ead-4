import React, { useEffect } from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import { getColorById } from './api/axios';
import './app.module.scss';
import { Header } from './components/header';
import {
  DisplayPage,
  AddPage,
  UpdatePage,
  RemovePage,
  BackroundColorPage,
} from './components/pages';
import getCookies from './cookies';

function App(): React.ReactElement {
  useEffect(() => {
    const cookie = getCookies();
    getColorById(cookie.backgroundColorIndex).then((response) => {
      const color = response.data;
      if (!Array.isArray(color)) {
        document.body.style.backgroundColor = color.hexString;
      }
    });
  }, []);
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Navigate to="/display" />} />
        <Route path="/display" element={<DisplayPage />} />
        <Route path="/add" element={<AddPage />} />
        <Route path="/update" element={<UpdatePage />} />
        <Route path="/remove" element={<RemovePage />} />
        <Route path="/background" element={<BackroundColorPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
