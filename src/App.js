import React, { useState, useEffect } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import './App.css';
import './components/calcul/calcul.css';
import Login from './pages/Login/Login';
import Navbar from './components/navbar/Navbar';
import ScrappDataList from './components/ScrappDataList/ScrappDataList';
import Insertt from './components/Insertt/Insertt';
import Updatee from './components/Updatee/Updatee';
import axios from './axiosConfig';
import 'bootstrap/dist/css/bootstrap.min.css';

const App = () => {
    const [user, setUser] = useState(null);
    const [scrappData, setScrappData] = useState([]);
    const [shiftData, setShiftData] = useState([]);
    const [showInsertForm, setShowInsertForm] = useState(false);
    const [showUpdateForm, setShowUpdateForm] = useState(false);
    const [dataId, setDataId] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            fetchScrappData();
            fetchShiftData();
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
    };

    const fetchShiftData = async () => {
        try {
            const responseShift = await axios.get('/api/ScrappDataShift');
            setShiftData(responseShift.data);
        } catch (error) {
            console.error('Échec de la récupération des données de shift:', error);
        }
    };

    const handleInsertClick = () => {
        // Fermer le formulaire de mise à jour si ouvert
        setShowUpdateForm(false);
        setShowInsertForm(true);
    };

    const handleUpdateClick = (id) => {
        // Fermer le formulaire d'insertion si ouvert
        setShowInsertForm(false);
        setDataId(id);
        setShowUpdateForm(true);
    };

    const handleInsertSuccess = () => {
        fetchScrappData();
        fetchShiftData();
        setShowInsertForm(false);
    };

    const handleUpdateSuccess = () => {
        fetchScrappData();
        fetchShiftData();
        setShowUpdateForm(false);
    };

    const handleCancel = () => {
        setShowInsertForm(false);
        setShowUpdateForm(false);
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

    return (
        <div className="app-container">
            {user && (
                <Navbar 
                    nom={user.Nom} 
                    prenom={user.Prenom} 
                    onLogout={handleLogout} 
                    onInsertClick={handleInsertClick}
                    onUpdateClick={handleUpdateClick}
                />
            )}
            {showInsertForm && <Insertt onInsertSuccess={handleInsertSuccess} onCancel={handleCancel} />}
            {showUpdateForm && dataId && (
                <Updatee dataId={dataId} onClose={handleCancel} />
            )}

<Routes>
    <Route path="/" element={user ? <ScrappDataList matricule={user.code} /> : <Login onLoginSuccess={handleLoginSuccess} />} />
    <Route path="/login" element={<Login onLoginSuccess={handleLoginSuccess} />} />
    <Route path="/scrappdata" element={user ? <ScrappDataList matricule={user.code} /> : <Login onLoginSuccess={handleLoginSuccess} />} />
</Routes>

        </div>
    );
};

export default App;
