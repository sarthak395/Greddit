import logo from './logo.svg';
import './App.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { BrowserRouter as Router, Routes, Switch, Route, Link } from 'react-router-dom';
import Profile from './components/Profile';
import Signup from './components/Signup';
import Login from './components/Login';

function App() {
  return (
    <Router>
      <div className='App flex flex-col min-h-screen'>
        <Navbar />
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
