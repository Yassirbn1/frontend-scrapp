import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './Insertt.css'; // Assurez-vous que le chemin est correct

const Insertt = ({ onInsertSuccess, onClose }) => {
    const [formData, setFormData] = useState({
        quantitéRetour: '',
        quantitéRestantePr: '',
        purge: '',
        defautInjection: '',
        defautAssemblage: '',
        bavures: '',
        date: '',
        shift: ''
    });
    const [error, setError] = useState('');

    // Référence pour le formulaire
    const formRef = useRef(null);

    useEffect(() => {
        const currentDate = new Date().toISOString().split('T')[0]; // Format YYYY-MM-DD
        const currentShift = calculateCurrentShift();
        setFormData(prevState => ({
            ...prevState,
            date: currentDate,
            shift: currentShift
        }));
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (formRef.current && !formRef.current.contains(event.target)) {
                if (typeof onClose === 'function') {
                    onClose(); // Fermer le formulaire si on clique en dehors
                }
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [onClose]);

    const calculateCurrentShift = () => {
        const now = new Date();
        const hours = now.getHours();
        const minutes = now.getMinutes();
        const totalMinutes = hours * 60 + minutes;

        if (totalMinutes >= 1290 || totalMinutes < 300) { // Shift 1: 21:45 - 05:44
            return 1;
        } else if (totalMinutes >= 300 && totalMinutes < 820) { // Shift 2: 05:45 - 13:44
            return 2;
        } else { // Shift 3: 13:45 - 21:44
            return 3;
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); // Réinitialiser l'erreur

        try {
            // Validation des champs du formulaire
            if (!formData.quantitéRetour || !formData.quantitéRestantePr ) {
                throw new Error('Veuillez remplir tous les champs requis.');
            }

            // Envoyer les données de ScrappData
            await axios.post('http://localhost:5062/api/ScrappData', {
                quantitéRetour: formData.quantitéRetour,
                quantitéRestantePr: formData.quantitéRestantePr,
                date: formData.date
            });

            // Envoyer les données de ScrappDataShift
            await axios.post('http://localhost:5062/api/ScrappDataShift', {
                purge: formData.purge,
                defautInjection: formData.defautInjection,
                defautAssemblage: formData.defautAssemblage,
                bavures: formData.bavures,
                date: formData.date,
                shift: formData.shift
            });

            if (onInsertSuccess) {
                onInsertSuccess();
            }
            // Réinitialiser le formulaire et fermer le modal
            if (typeof onClose === 'function') {
                onClose();
            }
        } catch (error) {
            console.error('Échec de l’insertion des données:', error.response ? error.response.data : error.message);
            setError('Une erreur est survenue lors de l’insertion des données.');
        }
    };

    return (
        <div className="custom-modal" onClick={() => {
            if (typeof onClose === 'function') {
                onClose(); // Fermer le modal si on clique en dehors
            }
        }}>
            <div className="custom-modal-content" ref={formRef} onClick={(e) => e.stopPropagation()}>
                <h2>Insérer des données de scrapp</h2>
                <form onSubmit={handleSubmit}>
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
                        required
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
                        required
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
                        value={formData.purge}
                        onChange={handleChange}
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
                        value={formData.defautInjection}
                        onChange={handleChange}
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
                        value={formData.defautAssemblage}
                        onChange={handleChange}
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
                        value={formData.bavures}
                        onChange={handleChange}
                    />
                </label>
            </div>
        </div>
    </fieldset>
                    {error && <p className="error-message">{error}</p>}
                    <div className="form-actions">
                        <button type="submit" className="btn-primary">Enregistrer</button>
                        <button type="button" className="btn-secondary" onClick={() => {
                            if (typeof onClose === 'function') {
                                onClose(); // Appel de la fonction onClose pour fermer le modal
                            }
                        }}>Annuler</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Insertt;
