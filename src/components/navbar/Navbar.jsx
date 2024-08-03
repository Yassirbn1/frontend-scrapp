import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import './Navbar.css';
import lohoLogo from './logo.png'; // Importez l'image

const Navbar = ({ nom, prenom, onLogout }) => {
    useEffect(() => {
        const handleScroll = () => {
            const navbar = document.querySelector('.navbar');
            if (window.scrollY > 0) {
                navbar.classList.add('sticky');
            } else {
                navbar.classList.remove('sticky');
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <nav className="navbar">
            <div className="brand">
                <Link to="/" className="brand-link">
                    <img src={lohoLogo} alt="Logo" className="brand-logo" /> {/* Image ajoutée */}
                    <span className="brand-part blue-dark">Elastomer</span>
                    <span className="brand-part blue-dark">Solutions</span>   
                </Link>
            </div>
            <div className="user-info">
                <span>{nom} {prenom}</span>
                <FontAwesomeIcon icon={faRightFromBracket} onClick={onLogout} className="logout-icon" />
            </div>
        </nav>
    );
};

export default Navbar;
