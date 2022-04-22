import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './app.module.scss';
import { Header } from './components/header';
import { DisplayPage, AddPage, UpdatePage } from './components/pages';

/* TODO:
  - Add page to update colors
  - Add page to delete colors
*/
function App(): React.ReactElement {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/display" element={<DisplayPage />} />
        <Route path="/add" element={<AddPage />} />
        <Route path="/update" element={<UpdatePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
