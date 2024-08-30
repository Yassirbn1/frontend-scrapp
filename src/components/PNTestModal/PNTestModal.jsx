import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Col, Row } from 'react-bootstrap';
import './PNTestModal.css'; // Assurez-vous d'ajouter du style pour le modal si nécessaire

const PNTestModal = ({ show, handleClose, initialFields, onSave }) => {
    const [fields, setFields] = useState(initialFields);

    useEffect(() => {
        setFields(initialFields);
    }, [initialFields]);

    const handleFieldChange = (index, event) => {
        const { name, value } = event.target;
        const updatedFields = [...fields];
        updatedFields[index] = { ...updatedFields[index], [name]: value };
        setFields(updatedFields);
    };

    const handleAddField = () => {
        setFields([...fields, { pn: '', testIngenieur: '' }]);
    };

    const handleRemoveField = (index) => {
        const updatedFields = fields.filter((_, i) => i !== index);
        setFields(updatedFields);
    };

    const handleSave = () => {
        onSave(fields);
        handleClose();
    };

    return (
        <Modal show={show} onHide={handleClose} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Ajouter / Modifier PN et Test Ingénieur</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    {fields.map((field, index) => (
                        <Row key={index} className="mb-3">
                            <Col md={5}>
                                <Form.Group controlId={`formPN${index}`}>
                                    <Form.Label>PN</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="pn"
                                        value={field.pn}
                                        onChange={(event) => handleFieldChange(index, event)}
                                        placeholder="PN"
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={5}>
                                <Form.Group controlId={`formTestIngenieur${index}`}>
                                    <Form.Label>Test Ingénieur</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="testIngenieur"
                                        value={field.testIngenieur}
                                        onChange={(event) => handleFieldChange(index, event)}
                                        placeholder="Test Ingénieur"
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={2} className="d-flex align-items-end">
                                <Button
                                    variant="danger"
                                    onClick={() => handleRemoveField(index)}
                                >
                                    Supprimer
                                </Button>
                            </Col>
                        </Row>
                    ))}
                    <Button variant="primary" onClick={handleAddField}>
                        Ajouter un champ
                    </Button>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Annuler
                </Button>
                <Button variant="success" onClick={handleSave}>
                    Sauvegarder
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default PNTestModal;
