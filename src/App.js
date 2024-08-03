import React, { useState, useEffect } from 'react';
import { Route, Routes, useNavigate, useLocation } from 'react-router-dom'; // Importez useLocation
import './App.css';
import './components/calcul/calcul.css';
import Home from './pages/home/ScrappDataList';
import Login from './pages/Login/Login';
import Navbar from './components/navbar/Navbar';
import ScrappDataList from './components/ScrappDataList/ScrappDataList';
import Insert from './components/Insert/Insert';
import axios from './axiosConfig'; // Importez l'instance Axios configurée
import { 
    calculateQuantitéPF, 
    calculateTotalConsommé, 
    calculatePercentConsomméPF, 
    calculatePercentRejets 
} from './components/calcul/calcul';

const App = () => {
    const [user, setUser] = useState(null);
    const [scrappData, setScrappData] = useState([]);
    const [shiftData, setShiftData] = useState([]);
    const navigate = useNavigate();
    const location = useLocation(); // Utilisez useLocation pour obtenir le chemin actuel

    useEffect(() => {
        if (user) {
            fetchScrappData();
            navigate('/scrappdata');
        }
    }, [user, navigate]);

    const fetchScrappData = async () => {
        try {
            const response = await axios.get('/api/ScrappData');
            setScrappData(response.data);
        } catch (error) {
            console.error('Échec de la récupération des données de scrapp:', error);
        }
    
        try {
            const responseShift = await axios.get('/api/ScrappDataShift');
            setShiftData(responseShift.data);
        } catch (error) {
            console.error('Échec de la récupération des données de shift:', error);
        }
    };

    const configureAxios = (token) => {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    };

    const handleLoginSuccess = (userInfo) => {
        setUser(userInfo);
        configureAxios(userInfo.token);
    };

    const handleLogout = () => {
        setUser(null);
        delete axios.defaults.headers.common['Authorization'];
        navigate('/login');
    };

    const handleInsertSuccess = () => {
        fetchScrappData();
    };

    const quantitéEntreePr = scrappData.reduce((sum, data) => sum + (data.quantitéEntreePr || 0), 0);
    const quantitéPF = calculateQuantitéPF(quantitéEntreePr, shiftData);
    const totalConsommé = calculateTotalConsommé(quantitéEntreePr, shiftData);
    const percentConsomméPF = calculatePercentConsomméPF(quantitéEntreePr, shiftData);
    const percentRejets = calculatePercentRejets(shiftData);

    return (
        <div className="app-container">
            {user && <Navbar nom={user.Nom} prenom={user.Prenom} onLogout={handleLogout} />}
            <Routes>
                <Route path="/" element={user ? <ScrappDataList matricule={user.Matricule} /> : <Login onLoginSuccess={handleLoginSuccess} />} />
                <Route path="/login" element={<Login onLoginSuccess={handleLoginSuccess} />} />
                <Route path="/scrappdata" element={user ? <ScrappDataList matricule={user.Matricule} /> : <Login onLoginSuccess={handleLoginSuccess} />} />
                <Route path="/insert" element={<Insert onInsertSuccess={handleInsertSuccess} />} />
            </Routes>
            {user && location.pathname === '/scrappdata' && ( // Affiche les calculs uniquement si la page actuelle est '/scrappdata'
                <div className="calculations">
                    <h2>Calculs :</h2>
                    <div>
                        <label>Quantité PF:</label>
                        <input type="number" value={quantitéPF} readOnly />
                    </div>
                    <div>
                        <label>Total Consommé:</label>
                        <input type="number" value={totalConsommé} readOnly />
                    </div>
                    <div>
                        <label>% Consommé PF:</label>
                        <input type="number" value={percentConsomméPF.toFixed(2)} readOnly />
                    </div>
                    <div>
                        <label>% Rejets:</label>
                        <input type="number" value={percentRejets.toFixed(2)} readOnly />
                    </div>
                </div>
            )}
        </div>
    );
};

export default App;
