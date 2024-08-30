import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ScrappDataList.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt, faSave, faPlus, faHistory } from '@fortawesome/free-solid-svg-icons';
import Updatee from '../../components/Updatee/Updatee';
import Insertt from '../../components/Insertt/Insertt';
import ScrappDataHistory from '../../components/ScrappDataHistory/ScrappDataHistory';


import { 
    calculateQuantitéPF, 
    calculateTotalConsommé, 
    calculatePercentConsomméPF, 
    calculatePercentRejets 
} from '../calcul/calcul';


const ScrappDataList = () => {
    const [scrappData, setScrappData] = useState(null);
    const [shiftData, setShiftData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedScrappData, setSelectedScrappData] = useState(null);
    const [selectedShiftData, setSelectedShiftData] = useState(null);
    const [showUpdateForm, setShowUpdateForm] = useState(false);
    const [showInsertForm, setShowInsertForm] = useState(false);
    const [selectedDate, setSelectedDate] = useState(getCurrentDate());
    const [role, setRole] = useState('');
    const [showHistoryModal, setShowHistoryModal] = useState(false);
    const [quantiteEntreePr, setQuantiteEntreePr] = useState(null);
    const [error, setError] = useState(null);




    // Nouveaux états pour PN et Test Ingénieur
    const [fields, setFields] = useState([{ pn: '', testIngenieur: '' }]);
    const [isDirty, setIsDirty] = useState(false); // Etat pour suivre si des modifications ont été faites

    const currentDate = getCurrentDate();
    const isCurrentDate = selectedDate === currentDate;

    const quantitéPF = quantiteEntreePr != null && typeof quantiteEntreePr === 'number'
    ? calculateQuantitéPF(quantiteEntreePr, shiftData)
    : 0;

const totalConsommé = quantiteEntreePr != null && typeof quantiteEntreePr === 'number'
    ? calculateTotalConsommé(quantiteEntreePr, shiftData)
    : 0;

const percentConsomméPF = quantiteEntreePr != null
    ? calculatePercentConsomméPF(quantiteEntreePr, shiftData)
    : 0;

const percentRejets = quantiteEntreePr != null
    ? calculatePercentRejets(shiftData)
    : 0;


    const handleHistoryButtonClick = () => {
        setShowHistoryModal(true);
    };
    
    const handleHistoryModalClose = () => {
        setShowHistoryModal(false);
    };
    

    function getCurrentDate() {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }
    
    const fetchDataByDate = async (date) => {
        try {
            const [scrappResponse, shiftResponse, quantiteEntreePrResponse] = await Promise.all([
                axios.get('http://localhost:5062/api/ScrappData/ByDate', { params: { date } }),
                axios.get('http://localhost:5062/api/ScrappDataShift/ByDate', { params: { date } }),
                axios.get('http://localhost:5062/api/ScrappData/ValuesByDate', { params: { date } }) // Nouvelle ligne pour appeler la nouvelle API
            ]);
    
            console.log('QuantitéEntréePr:', quantiteEntreePrResponse.data); // Ajoutez ce log pour vérifier la réponse
    
            setScrappData(scrappResponse.data.length > 0 ? scrappResponse.data[0] : null);
            setShiftData(Array.isArray(shiftResponse.data) ? shiftResponse.data : []);
            setQuantiteEntreePr(quantiteEntreePrResponse.data.length > 0 ? quantiteEntreePrResponse.data[0] : null); // Ajustez selon la structure des données retournées
        } catch (error) {
            console.error('Échec de la récupération des données:', error);
            setScrappData(null);
            setShiftData([]);
            setQuantiteEntreePr(null); // Nouvelle ligne pour gérer les erreurs
        } finally {
            setIsLoading(false);
        }
    };
    
    
    
    

    const fetchUserRole = async () => {
        try {
            const response = await axios.get('http://localhost:5062/api/auth/currentrole');
            setRole(response.data.role);
        } catch (error) {
            console.error('Échec de la récupération du rôle utilisateur:', error);
        }
    };

    useEffect(() => {
        fetchUserRole();
        fetchDataByDate(selectedDate);
    }, [selectedDate]);

    useEffect(() => {
        const savedFields = localStorage.getItem('fields');
        if (savedFields) {
            setFields(JSON.parse(savedFields));
        }
    }, []);
    
    
    useEffect(() => {
        // Vérifier si des modifications ont été faites pour afficher le bouton Sauvegarder
        const hasChanged = fields.some(field => field.pn !== '' || field.testIngenieur !== '');
        setIsDirty(hasChanged);
    }, [fields]);

    const handleDateChange = (event) => {
        const selectedDate = event.target.value;
        setSelectedDate(selectedDate);
        setIsLoading(true);
    };

    const handleUpdateClick = (shiftId) => {
        const shift = shiftData.find(data => data.id === shiftId);
        const scrapp = scrappData;

        if (shift && scrapp) {
            setSelectedScrappData(scrapp);
            setSelectedShiftData(shift);
            if (isCurrentDate && role === 'M') {
                setShowUpdateForm(true);
            }
        }
    };

    const handleInsertClick = () => {
        
        if (isCurrentDate && role === 'M') {
            setShowInsertForm(true);
        }
    };
    const handleUpdateClose = () => {
        setShowUpdateForm(false);
        fetchDataByDate(selectedDate);
    };

    const handleInsertClose = () => {
        setShowInsertForm(false);
        fetchDataByDate(selectedDate);
    };

    const handleTableClick = (event) => {
        const target = event.target;
        if (target.closest('td')) {
            if (target.innerText.includes('Aucune donnée')) {
                handleInsertClick();
            }
        }
    };

    
      // Gère les changements dans les champs
      const handleFieldChange = (index, event) => {
        const updatedFields = [...fields];
        updatedFields[index][event.target.name] = event.target.value;
        setFields(updatedFields);
        setIsDirty(true);
    };

    // Ajoute un nouveau champ si aucun champ n'est affiché
    const addField = () => {
        if (fields.length === 0) {
            setFields([{ pn: '', testIngenieur: '' }]);
        } else {
            setFields([...fields, { pn: '', testIngenieur: '' }]);
        }
    };

    const removeField = (index) => {
        const updatedFields = [...fields];
        updatedFields.splice(index, 1);
        setFields(updatedFields);
    
        if (updatedFields.length === 0) {
            setFields([{ pn: '', testIngenieur: '' }]);
        }
    
        // Mettre à jour le localStorage
        localStorage.setItem('fields', JSON.stringify(updatedFields));
    
        console.log('Fields après suppression:', updatedFields); // Ajoutez cette ligne pour déboguer
        handleSave(); // Sauvegardez les modifications
    };
    const handleLogout = () => {
        localStorage.removeItem('fields');
        // Autres logiques de déconnexion
    };
    
    

    // Sauvegarde les données dans le localStorage
    const handleSave = () => {
        localStorage.setItem('fields', JSON.stringify(fields));
        setIsDirty(false);
      
    };

    

    if (isLoading) {
        return <div>Chargement...</div>;
    }

    return (
        <div className="datatable-container">
            <div className="date-picker-container">
                <label htmlFor="datePicker">Sélectionnez une date:</label>
                <input
                    type="date"
                    id="datePicker"
                    value={selectedDate}
                    onChange={handleDateChange}
                /><br /><br />
                <button 
        className="btn btn-info" 
        onClick={handleHistoryButtonClick}
    >
        <FontAwesomeIcon icon={faHistory} /> Historique
    </button>
            </div>
            

            {showHistoryModal && (
    <ScrappDataHistory
        show={showHistoryModal}
        handleClose={handleHistoryModalClose}
        selectedDate={selectedDate}
    />
)}


<table className="combined-data-table" onClick={handleTableClick}>
    <thead>
        <tr>
            <th rowSpan="2">Quantité Retour</th>
            <th rowSpan="2">Quantité Restante Pr</th>
            <th rowSpan="2">Quantité Entrée Pr</th>
            <th rowSpan="2">Shift</th>
            <th colSpan="4">Quantité rejeté</th>
            <th rowSpan="2">Quantité PF</th>
            <th rowSpan="2">Total Consommé</th>
            <th rowSpan="2">% Consommé PF</th>
            <th rowSpan="2">% Rejets</th>
        </tr>
        <tr>
            <th>Purge</th>
            <th>Défaut Injection</th>
            <th>Défaut Assemblage</th>
            <th>Bavures</th>
        </tr>
    </thead>
    <tbody>
        {scrappData || shiftData.length > 0 ? (
            shiftData.map((shift, index) => (
                <tr key={shift.id} onClick={() => isCurrentDate && role === 'M' && handleUpdateClick(shift.id)}>
                    {index === 0 && (
                        <>
                            <td rowSpan={shiftData.length}>
                                {scrappData?.quantitéRetour ?? 'Aucune donnée'}
                            </td>
                            <td rowSpan={shiftData.length}>
                                {scrappData?.quantitéRestantePr ?? 'Aucune donnée'}
                            </td>
                            <td rowSpan={shiftData.length}>
                                {quantiteEntreePr ?? 'Aucune donnée'}
                            </td>
                        </>
                    )}
                    <td>
                        {shift.shift === 1 ? 'Shift 1' : shift.shift === 2 ? 'Shift 2' : 'Shift 3'}
                    </td>
                    <td>{shift.purge ?? 'Aucune donnée'}</td>
                    <td>{shift.defautInjection ?? 'Aucune donnée'}</td>
                    <td>{shift.defautAssemblage ?? 'Aucune donnée'}</td>
                    <td>{shift.bavures ?? 'Aucune donnée'}</td>
                    {index === 0 && (
                        <>
                            <td rowSpan={shiftData.length}>{quantitéPF ?? 'Aucune donnée'}</td>
                            <td rowSpan={shiftData.length}>{totalConsommé ?? 'Aucune donnée'}</td>
                            <td rowSpan={shiftData.length}>{percentConsomméPF ?? 'Aucune donnée'}%</td>
                            <td rowSpan={shiftData.length}>{percentRejets ?? 'Aucune donnée'}%</td>
                        </>
                    )}
                </tr>
            ))
        ) : (
            <tr onClick={handleInsertClick}>
                <td colSpan="12">Aucune donnée trouvée pour aujourd'hui</td>
            </tr>
        )}
    </tbody>
</table>

<br />
            {(role === 'I' && isCurrentDate) && (
                <div className="ajouter-pn-container">
                    <h3>PN et Test Ingénieurie : </h3>
                    <div className="ajouter-pn-header">
            <span className="title-pnn">PN:</span>
            <span className="title-test-ingenieurr">Poids par Kg:</span>
        </div>
                    {fields.map((field, index) => (
                        <div key={index} className="ajouter-pn-item">
                            <input
                                type="text"
                                name="pn"
                                value={field.pn}
                                onChange={(event) => handleFieldChange(index, event)}
                                placeholder="PN"
                                className="custom-input"
                            />
                            <input
                                type="text"
                                name="testIngenieur"
                                value={field.testIngenieur}
                                onChange={(event) => handleFieldChange(index, event)}
                                placeholder="Test Ingénieur"
                                className="custom-input"
                            />
                            <button onClick={() => removeField(index)} className="btn btn-danger">
                                <FontAwesomeIcon icon={faTrashAlt} />
                            </button>
                            <button onClick={addField} className="btn btn-primary">
                                <FontAwesomeIcon icon={faPlus} />
                            </button>
                            <button onClick={handleSave} disabled={!isDirty} className="btn btn-success">
                                <FontAwesomeIcon icon={faSave} /> {isDirty ? 'Sauvegarder' : 'Aucune modification'}
                            </button>
                        </div>
                    ))}
                </div>
            )}

{(role === 'M' || role === 'R') && isCurrentDate && (
    <div className="ajouter-pn-container">
        <h3>PN et Test Ingénieurie : </h3>
        <div className="ajouter-pn-header">
            <span className="title-pn">PN:</span>
            <span className="title-test-ingenieur">Poids par Kg:</span>
        </div>
        {fields.map((field, index) => (
            <div key={index} className="ajouter-pn-item">
                <input
                    type="text"
                    name="pn"
                    value={field.pn}
                    readOnly
                    placeholder="PN"
                    className="custom-input"
                />
                <input
                    type="text"
                    name="testIngenieur"
                    value={field.testIngenieur}
                    readOnly
                    placeholder="Test Ingénieur"
                    className="custom-input"
                />
            </div>
        ))}
    </div>
)}


            {role === 'M' && showUpdateForm && (
                <Updatee
                    onClose={handleUpdateClose}
                    scrappData={selectedScrappData}
                    shiftData={selectedShiftData}
                />
            )}
            

            {role === 'M' && showInsertForm && (
                <Insertt
                    onClose={handleInsertClose}
                    scrappData={scrappData}
                    shiftData={shiftData}
                />
            )}

            {role === 'R' && (
                <div>
                    {/* Code pour le rôle 'R' */}
                </div>
            )}
        </div>
    );
};

export default ScrappDataList;