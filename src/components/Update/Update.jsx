import React, { useState, useEffect } from 'react';
import './Update.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

const UpdateScrappData = ({ scrappData, onSave, onCancel }) => { // Changed prop names for clarity
    const [formData, setFormData] = useState({});

    useEffect(() => {
        setFormData(scrappData);
    }, [scrappData]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSave = () => {
        const updatedFormData = { ...formData, date: new Date().toISOString() };
        onSave(updatedFormData); // Use onSave instead of handleSaveScrappData
    };

    return (
        <>
            <div className="overlay" onClick={onCancel} />
            <div className="update-scrapp-data-container">
                <button className="close-button" onClick={onCancel}>
                    <FontAwesomeIcon icon={faTimes} />
                </button>
                <h2>Modification de données de scrap</h2>
                <div className="form-group">
                    <label>Quantité Retour:</label>
                    <input
                        type="number"
                        name="quantitéRetour"
                        value={formData.quantitéRetour || ''}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="form-group">
                    <label>Quantité Restante Pr:</label>
                    <input
                        type="number"
                        name="quantitéRestantePr"
                        value={formData.quantitéRestantePr || ''}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="form-group">
                    <label>Quantité Entrée Pr:</label>
                    <input
                        type="number"
                        name="quantitéEntreePr"
                        value={formData.quantitéEntreePr || ''}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="button-container">
                    <button className="save-button" onClick={handleSave}>Enregistrer</button>
                    <button className="cancel-button" onClick={onCancel}>Annuler</button>
                </div>
            </div>
        </>
    );
};

export default UpdateScrappData;
