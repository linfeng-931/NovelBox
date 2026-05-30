import { useState } from 'react'
import './App.css'
import Header from './component/Header';
import { Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';

function App() {

  return (
    <>
      <Header/>
      <Routes>
        <Route path="/" element={<HomePage />} />
      </Routes>
    </>
  )
}

export default App;
