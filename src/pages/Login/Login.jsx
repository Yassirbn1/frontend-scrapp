import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = ({ onLoginSuccess }) => {
    const [matricule, setMatricule] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(''); // Réinitialiser les erreurs avant de tenter une nouvelle connexion
        try {
            const response = await axios.post('http://localhost:5062/api/auth/login', { matricule, password });
            const { matricule: matriculeResponse, nom, prenom, token } = response.data;
    
            if (token) {
                localStorage.setItem('authToken', token); // Stocker le jeton
                onLoginSuccess({ Matricule: matriculeResponse, Nom: nom, Prenom: prenom, token }); // Passez le token à la fonction de succès
                navigate('/'); // Naviguer vers la page d'accueil ou une autre page après connexion réussie
            } else {
                console.error('Token missing in response:', response.data);
                setError('Login failed. Please try again.');
            }
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                setError(error.response.data.message); // Afficher le message d'erreur spécifique du backend
            } else {
                setError('Login failed. Please try again.');
            }
            console.error('Login failed:', error);
        }
    };

    return (
        <div className="login-container">
            <form className="login-form" onSubmit={handleLogin}>
                <h2>Login</h2>
                {error && <p className="error-message">{error}</p>}
                <div className="form-group">
                    <label htmlFor="matricule">Matricule</label>
                    <input
                        type="text"
                        id="matricule"
                        value={matricule}
                        onChange={(e) => setMatricule(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <button type="submit">Login</button>
            </form>
        </div>
    );
};

export default Login;
