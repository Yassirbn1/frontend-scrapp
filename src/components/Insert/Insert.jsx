import React, { useState } from 'react';
import axios from 'axios';
import './Insert.css';

const Insert = ({ onSave, onCancel }) => {
    const [scrappData, setScrappData] = useState({
        quantitéRetour: '',
        quantitéRestantePr: '',
        quantitéEntreePr: '',
        date: new Date().toISOString() // Ajoute la date actuelle
    });
    const [error, setError] = useState('');

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setScrappData(prevState => ({
            ...prevState,
            [name]: value
        }));
        setError(''); // Réinitialiser l'erreur lorsque l'utilisateur commence à taper
    };

    const handleInsert = async () => {
        if (!scrappData.quantitéRetour || !scrappData.quantitéRestantePr || !scrappData.quantitéEntreePr) {
            setError('Veuillez remplir tous les champs.');
            return;
        }

        const token = localStorage.getItem('authToken');

        if (!token) {
            setError('Jeton d\'authentification manquant.');
            return;
        }

        try {
            await axios.post('http://localhost:5062/api/ScrappData', scrappData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            onSave();
        } catch (error) {
            setError('Échec de l\'insertion des données.');
            console.error('Erreur lors de l\'insertion:', error);
        }
    };

    return (
        <>
            <div className="overlay" onClick={onCancel} />
            <div className="insert-container">
                <button className="close-button" onClick={onCancel}>
                    ×
                </button>
                <h2>Insérer des données de scrap</h2>
                <div className="form-group">
                    <label className='lbl'>Quantité Retour:</label>
                    <input
                        type="number"
                        name="quantitéRetour"
                        value={scrappData.quantitéRetour}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="form-group">
                    <label className='lbl'>Quantité Restante Pr:</label>
                    <input
                        type="number"
                        name="quantitéRestantePr"
                        value={scrappData.quantitéRestantePr}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="form-group">
                    <label className='lbl'>Quantité Entrée Pr:</label>
                    <input
                        type="number"
                        name="quantitéEntreePr"
                        value={scrappData.quantitéEntreePr}
                        onChange={handleInputChange}
                    />
                </div>
                {error && <p className="error-message">{error}</p>}
                <div className="button-container">
                    <button className="insert-button" onClick={handleInsert}>Sauvegarder</button>
                    <button className="cancel-button" onClick={onCancel}>Annuler</button>
                </div>
            </div>
        </>
    );
};

export default Insert;
