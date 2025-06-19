import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Row, Col, Card, Modal, Toast, ToastContainer } from 'react-bootstrap';
import axios from 'axios';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { motion } from 'framer-motion'; 

const Home = () => {
  const { user } = useContext(AuthContext);
  const [budget, setBudget] = useState('');
  const [type, setType] = useState('');
  const [trips, setTrips] = useState([]);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastVariant, setToastVariant] = useState('success')


  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.get('http://localhost:3001/api/trips/search', {
        params: { budget, type },
      });
      setTrips(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveTrip = async (tripId) => {
    if (!user) {
      alert('Devi essere loggato per salvare un viaggio!');
      return;
    }
    try {
      await axios.post(
        `http://localhost:3001/api/trips/save/${tripId}`,
        {},
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      triggerToast('Viaggio salvato con successo!');
    } catch (err) {
      console.error(err);
    }
  };

  const handleViewDetails = (trip) => {
    setSelectedTrip(trip);
    setShowModal(true);
    triggerToast('Hai svelato la sorpresa! Questo è il tuo viaggio 🎉', 'danger');
  };

  const triggerToast = (message,  variant = 'success') => {
    setToastMessage(message);
    setToastVariant(variant);
    setShowToast(true);
  };

  return (
    <Container className="my-5">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="mb-4" style={{ fontWeight: 700, fontSize: '36px', color: '#1d1d1f' }}>
        Scopri dove ti porterà l’inaspettato.
        </h2>
        <Form onSubmit={handleSearch} className="mb-5">
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Budget</Form.Label>
                <Form.Control
                  type="number"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  placeholder="Budget massimo (€)"
                  className="form-control"
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Tipo di Viaggio</Form.Label>
                <Form.Select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="form-control"
                >
                  <option value="">Seleziona...</option>
                  <option value="Natura">Natura</option>
                  <option value="Avventura">Avventura</option>
                  <option value="Relax">Relax</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
          <Button variant="primary" type="submit" className="btn-primary">
            Cerca Viaggi
          </Button>
        </Form>
      </motion.div>
      <Row>
        {trips.map((trip) => (
          <Col md={4} key={trip._id} className="mb-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="card">
                <Card.Img 
                  variant="top" 
                  src={trip.image || 'https://via.placeholder.com/150'} 
                  style={{ filter: 'blur(10px)' }} 
                />
                <Card.Body>
                 
                  <Card.Text>Budget: €{trip.budget}</Card.Text>
                  <Card.Text>Tipo: {trip.type}</Card.Text>
                  <Button
                    variant="success"
                    onClick={() => handleSaveTrip(trip._id)}
                    className="btn-primary me-5"
                    style={{ backgroundColor: '#007aff', borderColor: '#007aff' }}
                  >
                    Salva Viaggio
                  </Button>
                  <Button
                    variant="info"
                    onClick={() => handleViewDetails(trip)}
                    className="btn-primary"
                    style={{ backgroundColor: '#007aff', borderColor: '#007aff' }}
                  >
                    Visualizza Dettagli
                  </Button>
                </Card.Body>
              </Card>
            </motion.div>
          </Col>
        ))}
      </Row>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Dettagli Viaggio</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedTrip && (
            <>
              <p><strong>Titolo:</strong> {selectedTrip.title}</p> 
              <Card.Img 
                variant="top" 
                src={selectedTrip.image || 'https://via.placeholder.com/150'} 
                style={{ filter: 'none' }} 
              />
              <p><strong>Descrizione:</strong> {selectedTrip.description}</p>
              <p><strong>Budget:</strong> €{selectedTrip.budget}</p>
              <p><strong>Tipo:</strong> {selectedTrip.type}</p>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Chiudi
          </Button>
        </Modal.Footer>
      </Modal>

      <ToastContainer position="bottom-end" className="p-3">
  <Toast
    show={showToast}
    onClose={() => setShowToast(false)}
    delay={7000}
    autohide
    bg={toastVariant}
  >
    <Toast.Body className="text-white">{toastMessage}</Toast.Body>
  </Toast>
</ToastContainer>
    </Container>
  );
};

export default Home;