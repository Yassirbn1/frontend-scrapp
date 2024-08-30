import React, { createContext, useContext, useState } from 'react';

// Création du contexte
const AuthContext = createContext();

// Fournisseur de contexte
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    const loginAction = async (code, password) => {
        // Simuler une requête de connexion
        console.log('Attempting login with code:', code); // Log attempt
        if (code === 1234 && password === 'password') {
            setUser({ code });
        } else {
            throw new Error('Invalid code or password');
        }
    };

    const logout = () => {
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loginAction, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// Hook pour utiliser le contexte
export const useAuth = () => {
    return useContext(AuthContext);
};
