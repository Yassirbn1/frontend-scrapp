import React, { useState } from 'react';
import axios from 'axios';
import './InsertShift.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

const InsertShift = ({ onSave, onCancel }) => {
    const [formData, setFormData] = useState({
        purge: '',
        defautInjection: '',
        defautAssemblage: '',
        bavures: ''
    });
    const [error, setError] = useState('');

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
        setError(''); // Réinitialiser l'erreur lorsque l'utilisateur commence à taper
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.purge || !formData.defautInjection || !formData.defautAssemblage || !formData.bavures) {
            setError('Veuillez remplir tous les champs.');
            return;
        }

        try {
            const response = await axios.post('http://localhost:5062/api/ScrappDataShift', formData);
            if (response.status === 201) {
                onSave(); // Utilisez onSave ici
            }
        } catch (error) {
            setError('Échec de l\'insertion des données.');
            console.error('Erreur lors de l\'insertion des données de shift:', error);
        }
    };

    return (
        <>
            <div className="overlay" onClick={onCancel} />
            <div className="insert-shift-container">
                <button className="close-button" onClick={onCancel}>
                    <FontAwesomeIcon icon={faTimes} />
                </button>
                <h2>Insérer des données de Shift</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className='lbl'>Purge:</label>
                        <input
                            type="number"
                            name="purge"
                            value={formData.purge}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="form-group">
                        <label className='lbl'>Defaut Injection:</label>
                        <input
                            type="number"
                            name="defautInjection"
                            value={formData.defautInjection}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="form-group">
                        <label className='lbl'>Defaut Assemblage:</label>
                        <input
                            type="number"
                            name="defautAssemblage"
                            value={formData.defautAssemblage}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="form-group">
                        <label className='lbl'>Bavures:</label>
                        <input
                            type="number"
                            name="bavures"
                            value={formData.bavures}
                            onChange={handleInputChange}
                        />
                    </div>
                    {error && <p className="error-message">{error}</p>}
                    <div className="button-container">
                        <button className="insert-button" type="submit">Enregistrer</button>
                        <button className="cancel-button" type="button" onClick={onCancel}>
                            Annuler
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default InsertShift;
