import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import axios from 'axios';

const ScrappDataHistory = ({ show, handleClose, selectedDate }) => {
  const [historyData, setHistoryData] = useState([]);

  // Fonction pour récupérer les données d'historique
  const fetchHistoryData = async () => {
    try {
      if (selectedDate) {
        const formattedDate = new Date(selectedDate).toISOString(); // Format ISO 8601
        
        const response = await axios.get('http://localhost:5062/api/ScrappDataHistory', {
          params: { date: formattedDate } // Inclure la date au format ISO

        });
        
        if (response.data && response.data.length > 0) {
          setHistoryData(response.data);
        } else {
          setHistoryData([]);
        }
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des données historiques:', error);
    }
  };
  
  // Utiliser useEffect pour récupérer les données lorsque le modal est affiché
  useEffect(() => {
    if (show && selectedDate) {
      fetchHistoryData();
    }
  }, [show, selectedDate]);

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Historique des données Scrapp</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {historyData.length > 0 ? (
          <table className="table">
            <thead>
              <tr>
                <th>Date/Heure</th>
                <th>Code Utilisateur</th>
                <th>Type d'Action</th>
                <th>Type de Table</th>
              </tr>
            </thead>
            <tbody>
              {historyData.map(history => (
                <tr key={history.id}>
                  <td>{new Date(history.dateTime).toLocaleString()}</td>
                  <td>{history.userCode}</td>
                  <td>{history.actionType}</td>
                  <td>{history.tableType}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>Aucune donnée d'historique trouvée pour la date sélectionnée.</p>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Fermer
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ScrappDataHistory;
