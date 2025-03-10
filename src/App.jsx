import { useState } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";

import './App.css';
import Home from'#';
import Contact from'#';
import About from'#';
import Home from'#';


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <Routes>
      <Route path="/" element={<Home/>}/>
      <Route path="/contact" element={<Contact/>}/>
      <Route path="/about" element={<About/>}/>
      <Route path= '*' element={<Error/>}/>
    </Routes>
    
    </>
  )
}

export default App
