import logo from './logo.svg';
import './App.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { BrowserRouter as Router, Routes, Switch, Route, Link , useLocation } from 'react-router-dom';
import Profile from './components/Profile';
import Signup from './components/Signup';
import Login from './components/Login';
import { useState, useEffect } from 'react';

function App() {
 
  const [user, setuser] = useState({})

  return (
    <Router>
      <div className='App flex flex-col min-h-screen'>
        <Navbar user={user} setuser={setuser}/>
        <Routes>
          <Route exact path="/" element={<Profile></Profile>} ></Route>
          <Route exact path='/login' element={<Login></Login>}></Route>
          <Route exact path='/signup' element={<Signup></Signup>} ></Route>
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
