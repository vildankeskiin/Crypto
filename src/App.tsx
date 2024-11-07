import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import Navbar from './components/Navbar';
import Register from './pages/Register';
import Favorites from './pages/Favorites';
import CryptoDetails from './pages/CryptoDetails';
import Footer from './components/Footer';
import About from './pages/About';
import Compare from './pages/CryptoCompare';
import Dashboard from './pages/Dashboard';
import Home from './pages/Home';
import NewsPage from './pages/NewsPage';



const App: React.FC = () => {
    return (
        <Router>
            <Navbar /> 
            <div id="root">
                <Routes>
                    <Route path="/" element={<Home/>} />
                    <Route path="/home" element={<Home/>} />
                    <Route path="/dashboard" element={<Dashboard/>} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/favorites" element={<Favorites />} />
                    <Route path="/cryptoDetails/:symbol" element={<CryptoDetails />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/compare" element={<Compare />} />,                    
                    <Route path="/news" element={<NewsPage />} />
                   



                </Routes> 
          
                
            </div>

            <Footer/>
            
        </Router>
        
    );
};

export default App;
