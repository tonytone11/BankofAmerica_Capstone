import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import './Auth.css'
import Home from './pages/Home'
import About from './pages/About'
import Contact from './pages/Contact'
import Login from './pages/Login'
import Player from './pages/Player'
import Profile from './pages/Profile'
import Signup from './pages/Signup'
import Training from './pages/Training'

function App() {

  return (
    <>
    <Routes>
      <Route path="/" element={<Home/>}/>
      <Route path="/contact" element={<Contact/>}/>
      <Route path="/about" element={<About/>}/>
      <Route path="/login" element={<Login/>}/>
      <Route path="/signup" element={<Signup/>}/>
      <Route path="/players" element={<Player/>}/>
      <Route path="/training" element={<Training/>}/>
      <Route path="/profile" element={<Profile/>}/>
      <Route path= '*' element={<Error/>}/>
    </Routes>
    
    </>
  )
}

export default App
