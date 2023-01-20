import logo from './logo.svg';
import './App.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

function App() {
  return (
    <div className='App flex flex-col min-h-screen'>
      <Navbar />
      <Footer />
    </div>
  );
}

export default App;
