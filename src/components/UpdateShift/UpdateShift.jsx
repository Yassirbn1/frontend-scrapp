import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './UpdateShift.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

const UpdateShift = ({ shiftData, onSave, onCancel }) => {
    const [updatedShiftData, setUpdatedShiftData] = useState([]);

    useEffect(() => {
        if (shiftData && shiftData.length > 0) {
            console.log('shiftData reçu:', shiftData); // Vérifiez ce que vous recevez
            setUpdatedShiftData([...shiftData]);
        } else {
            console.error('shiftData est vide ou non défini.');
        }
    }, [shiftData]);

    const handleInputChange = (index, event) => {
        const { name, value } = event.target;
        const newShiftData = [...updatedShiftData];
        newShiftData[index] = { ...newShiftData[index], [name]: value };
        setUpdatedShiftData(newShiftData);
    };

    const handleSave = async () => {
        try {
            for (const data of updatedShiftData) {
                await axios.put(`http://localhost:5062/api/ScrappDataShift/${data.id}`, data);
            }
            onSave();
        } catch (error) {
            console.error('Échec de la mise à jour des données de Shift:', error);
        }
    };

    const handleCancel = () => {
        onCancel();
    };

    if (updatedShiftData.length === 0) {
        return <div>Aucune donnée à afficher.</div>;
    }

    return (
        <>
            <div className="overlay" onClick={onCancel} />
            <div className="update-shift-container">
                <button className="close-button" onClick={onCancel}>
                    <FontAwesomeIcon icon={faTimes} />
                </button>
                <h2>Modifier les données de Shift</h2>
                {updatedShiftData.map((data, index) => (
                    <div key={index} className="form-group">
                        <label>Purge:</label>
                        <input
                            type="number"
                            name="purge"
                            value={data.purge || ''}
                            onChange={(e) => handleInputChange(index, e)}
                        />
                        <label>Defaut Injection:</label>
                        <input
                            type="number"
                            name="defautInjection"
                            value={data.defautInjection || ''}
                            onChange={(e) => handleInputChange(index, e)}
                        />
                        <label>Defaut Assemblage:</label>
                        <input
                            type="number"
                            name="defautAssemblage"
                            value={data.defautAssemblage || ''}
                            onChange={(e) => handleInputChange(index, e)}
                        />
                        <label>Bavures:</label>
                        <input
                            type="number"
                            name="bavures"
                            value={data.bavures || ''}
                            onChange={(e) => handleInputChange(index, e)}
                        />
                    </div>
                ))}
                <div className="button-container">
                    <button className="save-button" onClick={handleSave}>Enregistrer</button>
                    <button className="cancel-button" onClick={handleCancel}>Annuler</button>
                </div>
            </div>
        </>
    );
};

export default UpdateShift;
