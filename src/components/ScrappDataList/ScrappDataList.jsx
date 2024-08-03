import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faPenSquare } from '@fortawesome/free-solid-svg-icons';
import './ScrappDataList.css';
import Insert from '../Insert/Insert';
import UpdateScrappData from '../Update/Update';
import InsertShift from '../InsertShift/InsertShift';
import UpdateShift from '../UpdateShift/UpdateShift';

const ScrappDataList = ({ matricule }) => {
    const [scrappData, setScrappData] = useState({});
    const [shiftData, setShiftData] = useState([]);
    const [showInsertForm, setShowInsertForm] = useState(false);
    const [showUpdateForm, setShowUpdateForm] = useState(false);
    const [showInsertShiftForm, setShowInsertShiftForm] = useState(false);
    const [showUpdateShiftForm, setShowUpdateShiftForm] = useState(false);
    const [isDataEmpty, setIsDataEmpty] = useState(true);

    const fetchTodayScrappData = async () => {
        try {
            const response = await axios.get(`http://localhost:5062/api/ScrappData/ByMatricule/${matricule}`);
            setScrappData(response.data[0] || {});
        } catch (error) {
            console.error('Échec de la récupération des données de ScrappData:', error);
            setScrappData({});
        }
        try {
            const responseShiftToday = await axios.get(`http://localhost:5062/api/ScrappDataShift/ByMatricule/${matricule}`);
            if (Array.isArray(responseShiftToday.data)) {
                setShiftData(responseShiftToday.data);
            } else {
                setShiftData([]); // Assurez-vous que shiftData est toujours un tableau
            }
        } catch (error) {
            console.error('Échec de la récupération des données de ScrappDataShift:', error);
            setShiftData([]);
        }
    };

    const checkIfDataIsEmpty = async () => {
        try {
            const response = await axios.get('http://localhost:5062/api/ScrappData/IsEmpty');
            setIsDataEmpty(response.data);
        } catch (error) {
            console.error('Échec de la vérification des données:', error);
        }
    };

    useEffect(() => {
        if (matricule) {
            fetchTodayScrappData();
            checkIfDataIsEmpty();
        }
    }, [matricule]);

    const handleEditClick = () => {
        setShowUpdateForm(true);
    };

    const handleSaveScrappData = async (updatedData) => {
        try {
            await axios.put(`http://localhost:5062/api/ScrappData/${updatedData.id}`, updatedData);
            fetchTodayScrappData();
            setShowUpdateForm(false);
        } catch (error) {
            console.error('Échec de la mise à jour de ScrappData:', error);
        }
    };

    const handleInsertShiftSuccess = () => {
        fetchTodayScrappData();
        setShowInsertShiftForm(false);
    };

    const handleUpdateShiftSuccess = () => {
        fetchTodayScrappData();
        setShowUpdateShiftForm(false);
    };

    const handleInsertSuccess = () => {
        fetchTodayScrappData();
        setShowInsertForm(false);
    };

    const handleCancel = () => {
        setShowUpdateForm(false);
        setShowUpdateShiftForm(false);
        setShowInsertForm(false);
        setShowInsertShiftForm(false);
    };

    const isShiftDataEmpty = () => {
        return shiftData.length === 0 || shiftData.every(shift =>
            shift.purge === 0 &&
            shift.defautInjection === 0 &&
            shift.defautAssemblage === 0 &&
            shift.bavures === 0
        );
    };

    const shouldShowInsertIcon = () => {
        return scrappData && (scrappData.quantitéRetour === undefined || scrappData.quantitéRetour === 0) &&
            (scrappData.quantitéRestantePr === undefined || scrappData.quantitéRestantePr === 0) &&
            (scrappData.quantitéEntreePr === undefined || scrappData.quantitéEntreePr === 0);
    };

    const shouldShowEditButton = () => {
        return scrappData && (
            scrappData.quantitéRetour !== undefined && scrappData.quantitéRetour !== 0 ||
            scrappData.quantitéRestantePr !== undefined && scrappData.quantitéRestantePr !== 0 ||
            scrappData.quantitéEntreePr !== undefined && scrappData.quantitéEntreePr !== 0
        );
    };

    const handleUpdateShiftClick = () => {
        setShowUpdateShiftForm(true);
    };

    return (
        <div className="shift-container">
            <div className="global-inputs">
                <div>
                    <label>Quantité Retour:</label>
                    <input
                        type="number"
                        name="quantitéRetour"
                        value={scrappData.quantitéRetour || ''}
                        readOnly
                    />
                </div>
                <div>
                    <label>Quantité Restante Pr:</label>
                    <input
                        type="number"
                        name="quantitéRestantePr"
                        value={scrappData.quantitéRestantePr || ''}
                        readOnly
                    />
                </div>
                <div>
                    <label>Quantité Entrée Pr:</label>
                    <input
                        type="number"
                        name="quantitéEntreePr"
                        value={scrappData.quantitéEntreePr || ''}
                        readOnly
                    />
                </div>
                {shouldShowInsertIcon() && (
                    <button className="insert-icon" onClick={() => setShowInsertForm(true)}>
                        <FontAwesomeIcon icon={faPlus} /> Insérer
                    </button>
                )}
                {shouldShowEditButton() && !showUpdateForm && (
                    <button className="edit-button" onClick={handleEditClick}>
                        <FontAwesomeIcon icon={faPenSquare} /> Modifier
                    </button>
                )}
            </div>

            <div className="shifts-data">
                <div className="labels"><br /><br /><br /><br />
                    <label>Purge:</label><br /><br />
                    <label>DefautInjection:</label><br /><br />
                    <label>DefautAssemblage:</label><br /><br />
                    <label>Bavures:</label>
                </div>
                {[1, 2, 3].map(shiftNumber => (
                    <div key={shiftNumber} className="shift-column">
                        <div className="shift-header">
                            <h2>Shift {shiftNumber}</h2>
                        </div>
                        <div className="shift-items">
                            {shiftData
                                .filter(data => data.shift === shiftNumber)
                                .map((data, index) => (
                                    <div key={index} className="shift-item">
                                        <input
                                            type="number"
                                            value={data.purge || ''}
                                            readOnly
                                        />
                                        <input
                                            type="number"
                                            value={data.defautInjection || ''}
                                            readOnly
                                        />
                                        <input
                                            type="number"
                                            value={data.defautAssemblage || ''}
                                            readOnly
                                        />
                                        <input
                                            type="number"
                                            value={data.bavures || ''}
                                            readOnly
                                        />
                                    </div>
                                ))}
                        </div>
                    </div>
                ))}
                {!isShiftDataEmpty() ? (
                    <button className="update-shift-button" onClick={handleUpdateShiftClick}>
                        <FontAwesomeIcon icon={faPenSquare} /> Modifier Shift
                    </button>
                ) : (
                    <button className="insert-shift-button" onClick={() => setShowInsertShiftForm(true)}>
                        <FontAwesomeIcon icon={faPlus} /> Ajouter Shift
                    </button>
                )}
            </div>

            {showInsertForm && <Insert onSave={handleInsertSuccess} onCancel={handleCancel} />}
            {showUpdateForm && <UpdateScrappData scrappData={scrappData} onSave={handleSaveScrappData} onCancel={handleCancel} />}
            {showInsertShiftForm && <InsertShift onSave={handleInsertShiftSuccess} onCancel={handleCancel} />}
            {showUpdateShiftForm && <UpdateShift shiftData={shiftData} onSave={handleUpdateShiftSuccess} onCancel={handleCancel} />}
        </div>
    );
};

export default ScrappDataList;
