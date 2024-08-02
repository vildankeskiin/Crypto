import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer: React.FC = () => {
    return (
        <footer className="footer">
            <div className="text-center p-3">
            <p>© {new Date().getFullYear()} Crypto Tracker. All rights reserved.</p>
            <Link to="/about" className="text-decoration-none">Read more about us</Link>
            </div>
        </footer>
    );
};

export default Footer;
