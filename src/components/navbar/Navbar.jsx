import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import './Navbar.css';
import lohoLogo from './logoo.jpeg'; // Mettre à jour le chemin du logo

const Navbar = ({ onLogout }) => {
    const [isShrunk, setIsShrunk] = useState(false);
    const [lastScrollTop, setLastScrollTop] = useState(0);

    const firstName = localStorage.getItem('firstName');
    const lastName = localStorage.getItem('lastName');

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollTop = window.scrollY;

            // Log des valeurs importantes
            console.log("Current Scroll Top:", currentScrollTop);
            console.log("Last Scroll Top:", lastScrollTop);

            // Vérifiez si l'utilisateur défile vers le bas
            if (currentScrollTop > lastScrollTop && currentScrollTop > 50) {
                console.log("Shrinking Navbar");
                setIsShrunk(true);
            } else {
                console.log("Expanding Navbar");
                setIsShrunk(false);
            }

            setLastScrollTop(currentScrollTop);
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [lastScrollTop]);

    const capitalizeFirstLetter = (string) => {
        if (string) {
            return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
        }
        return '';
    };

    return (
        <nav className={`navbar ${isShrunk ? 'shrink' : ''}`}>
            <div className="brand">
                <Link to="/" className="brand-link">
                    <img src={lohoLogo} alt="Logo" className="brand-logo" />
                </Link>
            </div>

            <div className="user-info">
                {firstName && lastName ? (
                    <span>Bonjour {capitalizeFirstLetter(firstName)} {capitalizeFirstLetter(lastName)}</span>
                ) : (
                    <span>Bonjour Invité</span>
                )}
                <FontAwesomeIcon 
                    icon={faRightFromBracket} 
                    onClick={onLogout} 
                    className="logout-icon" 
                />
            </div>
        </nav>
    );
};

export default Navbar;
