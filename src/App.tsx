import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import Home from './pages/Home';
import Navbar from './components/Navbar';
import Register from './pages/Register';
import Favorites from './pages/Favorites';
import CryptoDetails from './pages/CryptoDetails';
import Footer from './components/Footer';
import About from './pages/About';


const App: React.FC = () => {
    return (
        <Router>
            <Navbar /> 
            <div id="root">
                <Routes>
                    <Route path="/" element={<Home/>} />
                    <Route path="/home" element={<Home/>} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/favorites" element={<Favorites />} />
                    <Route path="/cryptoDetails/:symbol" element={<CryptoDetails />} />
                    <Route path="/about" element={<About />} />
                </Routes>
          
                
            </div>

            <Footer/>
            
        </Router>
        
    );
};

export default App;
