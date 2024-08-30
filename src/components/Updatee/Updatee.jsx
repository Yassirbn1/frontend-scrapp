import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './Updatee.css';

const Updatee = ({ scrappData, shiftData, onClose }) => {
    const [formData, setFormData] = useState({
        quantitéRetour: 0,
        quantitéRestantePr: 0,
        quantitéEntreePr: 0,
    });
    const [shiftDataCurrent, setShiftDataCurrent] = useState({
        purge: 0,
        defautInjection: 0,
        defautAssemblage: 0,
        bavures: 0
    });
    const [loading, setLoading] = useState(false);
    const [currentShift, setCurrentShift] = useState(getCurrentShift()); // Initialiser avec le shift actuel

    // Fonction pour obtenir l'heure actuelle et déterminer le shift
    function getCurrentShift() {
        const now = new Date();
        const hour = now.getHours();
        const minute = now.getMinutes();

        if ((hour === 21 && minute >= 45) || (hour >= 22) || (hour < 5) || (hour === 5 && minute < 45)) return 1; // Shift 1
        if ((hour === 5 && minute >= 45) || (hour >= 6 && hour < 13) || (hour === 13 && minute < 45)) return 2; // Shift 2
        return 3; // Shift 3
    }

    // Utiliser useEffect pour récupérer les données lorsque le composant est monté ou lorsque scrappData change
    useEffect(() => {
        if (scrappData) {
            setFormData({
                quantitéRetour: scrappData.quantitéRetour ?? 0,
                quantitéRestantePr: scrappData.quantitéRestantePr ?? 0,
                quantitéEntreePr: scrappData.quantitéEntreePr ?? 0
            });
        } else {
            console.warn('Les données de scrap sont manquantes ou invalides');
            setFormData({
                quantitéRetour: 0,
                quantitéRestantePr: 0,
                quantitéEntreePr: 0
            });
        }
    }, [scrappData]);

    // Utiliser useEffect pour mettre à jour les données du shift actuel
    useEffect(() => {
        if (shiftData && shiftData.shift === currentShift) {
            setShiftDataCurrent({
                purge: shiftData.purge ?? 0,
                defautInjection: shiftData.defautInjection ?? 0,
                defautAssemblage: shiftData.defautAssemblage ?? 0,
                bavures: shiftData.bavures ?? 0
            });
        } else if (shiftData) {
            // Si les données du shift ne correspondent pas au shift actuel, réinitialiser les données du shift
            setShiftDataCurrent({
                purge: 0,
                defautInjection: 0,
                defautAssemblage: 0,
                bavures: 0
            });
        }
    }, [shiftData, currentShift]);

    const handleChange = useCallback((event) => {
        const { name, value } = event.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: parseFloat(value) || 0, // Convertir en nombre pour éviter les problèmes
        }));
    }, []);

    const handleSave = useCallback(async () => {
        try {
            setLoading(true);
    
            // Validation des données avant envoi
            if (!scrappData.id) {
                throw new Error('ID manquant pour la mise à jour.');
            }
    
            const scrappDataPayload = {
                id: scrappData.id,
                date: scrappData.date,
                quantitéRetour: formData.quantitéRetour,
                quantitéRestantePr: formData.quantitéRestantePr,
                quantitéEntreePr: formData.quantitéEntreePr
            };
    
            const shiftDataPayload = {
                id: shiftData.id,
                shift: currentShift,
                purge: shiftDataCurrent.purge,
                defautInjection: shiftDataCurrent.defautInjection,
                defautAssemblage: shiftDataCurrent.defautAssemblage,
                bavures: shiftDataCurrent.bavures
            };
    
            // Mise à jour des données
            const scrappResponse = await axios.put(`http://localhost:5062/api/ScrappData/${scrappData.id}`, scrappDataPayload);
            console.log('Réponse de mise à jour ScrappData:', scrappResponse.data);
    
            if (shiftData.id) { // Assurez-vous que shiftData.id existe
                const shiftResponse = await axios.put(`http://localhost:5062/api/ScrappDataShift/${shiftData.id}`, shiftDataPayload);
                console.log('Réponse de mise à jour ScrappDataShift:', shiftResponse.data);
            }
    
            onClose();
        } catch (error) {
            console.error('Erreur lors de la sauvegarde des données:', error.response ? error.response.data : error.message);
            alert(`Erreur lors de la sauvegarde des données: ${error.response ? error.response.data.message : error.message}`);
        } finally {
            setLoading(false);
        }
    }, [formData, scrappData, shiftDataCurrent, currentShift, onClose]);
    
    
    const handleCancel = () => {
        onClose();
    };

    // Fonction pour fermer le formulaire si on clique en dehors de celui-ci
    const handleOverlayClick = (event) => {
        if (event.target === event.currentTarget) {
            onClose();
        }
    };

    if (loading) {
        return <div>Chargement...</div>;
    }

    return (
        <div className="updatee-overlay" onClick={handleOverlayClick}>
            <div className="updatee-form" onClick={(e) => e.stopPropagation()}>
                <h2>Modifier les données</h2>
                <form>
                    <fieldset>
                        <legend>Données Par Date</legend>
                        <div className="form-grid">
                            <div className="form-group">
                                <label htmlFor="quantitéRetour">
                                    Quantité Retour:
                                    <input
                                        id="quantitéRetour"
                                        type="number"
                                        name="quantitéRetour"
                                        value={formData.quantitéRetour}
                                        onChange={handleChange}
                                    />
                                </label>
                            </div>
                            <div className="form-group">
                                <label htmlFor="quantitéRestantePr">
                                    Quantité Restante Pr:
                                    <input
                                        id="quantitéRestantePr"
                                        type="number"
                                        name="quantitéRestantePr"
                                        value={formData.quantitéRestantePr}
                                        onChange={handleChange}
                                    />
                                </label>
                            </div>
                        
                        </div>
                    </fieldset>
                    <fieldset>
                        <legend>Données Par Shift</legend>
                        <div className="form-grid">
                            <div className="form-group">
                                <label htmlFor="purge">
                                    Purge:
                                    <input
                                        id="purge"
                                        type="number"
                                        name="purge"
                                        value={shiftDataCurrent.purge}
                                        onChange={(e) => setShiftDataCurrent(prev => ({ ...prev, purge: parseFloat(e.target.value) || 0 }))}
                                    />
                                </label>
                            </div>
                            <div className="form-group">
                                <label htmlFor="defautInjection">
                                    Défaut Injection:
                                    <input
                                        id="defautInjection"
                                        type="number"
                                        name="defautInjection"
                                        value={shiftDataCurrent.defautInjection}
                                        onChange={(e) => setShiftDataCurrent(prev => ({ ...prev, defautInjection: parseFloat(e.target.value) || 0 }))}
                                    />
                                </label>
                            </div>
                            <div className="form-group">
                                <label htmlFor="defautAssemblage">
                                    Défaut Assemblage:
                                    <input
                                        id="defautAssemblage"
                                        type="number"
                                        name="defautAssemblage"
                                        value={shiftDataCurrent.defautAssemblage}
                                        onChange={(e) => setShiftDataCurrent(prev => ({ ...prev, defautAssemblage: parseFloat(e.target.value) || 0 }))}
                                    />
                                </label>
                            </div>
                            <div className="form-group">
                                <label htmlFor="bavures">
                                    Bavures:
                                    <input
                                        id="bavures"
                                        type="number"
                                        name="bavures"
                                        value={shiftDataCurrent.bavures}
                                        onChange={(e) => setShiftDataCurrent(prev => ({ ...prev, bavures: parseFloat(e.target.value) || 0 }))}
                                    />
                                </label>
                            </div>
                        </div>
                    </fieldset>
                    <div className="form-actions">
                        <button type="button" className="btn-primary" onClick={handleSave}>Enregistrer</button>
                        <button type="button" className="btn-secondary" onClick={handleCancel}>Annuler</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Updatee;
