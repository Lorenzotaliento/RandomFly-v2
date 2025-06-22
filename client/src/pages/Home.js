import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Row, Col, Card, Modal, Toast, ToastContainer } from 'react-bootstrap';
import axios from 'axios';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { motion } from 'framer-motion';
import Swal from 'sweetalert2';

const Home = () => {
  const { user } = useContext(AuthContext);
  const [budget, setBudget] = useState('');
  const [type, setType] = useState('');
  const [trips, setTrips] = useState([]);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastVariant, setToastVariant] = useState('success');

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.get('http://localhost:3001/api/trips/search', {
        params: { budget, type },
      });
      setTrips(res.data);
    } catch (err) {
      console.error(err);
      triggerToast('Errore nella ricerca dei viaggi.', 'danger');
    }
  };

  const handleSaveTrip = async (tripId) => {
    if (!user) {
      await Swal.fire({
        title: 'Attenzione',
        text: 'Devi essere loggato per salvare un viaggio!',
        icon: 'warning',
        confirmButtonText: 'Ok',
        confirmButtonColor: '#f0ad4e',
      });
      return;
    }
    try {
      await axios.post(
        `http://localhost:3001/api/trips/save/${tripId}`,
        {},
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      await Swal.fire({
        title: 'Viaggio salvato!',
        text: 'Il viaggio è stato salvato con successo.',
        icon: 'success',
        confirmButtonText: 'Ok',
        confirmButtonColor: '#28a745',
      });
    } catch (err) {
      console.error(err);
      const errorMessage = err.response?.data?.error || err.message || 'Errore sconosciuto';
      await Swal.fire({
        title: 'Errore',
        text: `Non è stato possibile salvare il viaggio: ${errorMessage}`,
        icon: 'error',
        confirmButtonText: 'Ok',
        confirmButtonColor: '#dc3545',
      });
    }
  };

  const handleViewDetails = async (trip) => {
    const { value: password } = await Swal.fire({
      title: 'Inserisci la password per visualizzare i dettagli',
      input: 'password',
      inputLabel: 'Password',
      inputPlaceholder: 'Inserisci la password',
      inputAttributes: {
        maxlength: 10,
        autocapitalize: 'off',
        autocorrect: 'off',
      },
      showCancelButton: true,
      confirmButtonText: 'Conferma',
      cancelButtonText: 'Annulla',
      confirmButtonColor: '#3085d6',
      inputValidator: (value) => {
        if (!value) {
          return 'Devi inserire una password!';
        }
      },
    });
  
    if (password === 'l') {
      await Swal.fire({
        title: 'Hai svelato la sorpresa!',
        text: 'Questo è il tuo viaggio 🎉',
        icon: 'info',
        confirmButtonText: 'Ok',
        confirmButtonColor: '#3085d6',
      });
      setSelectedTrip(trip);
      setShowModal(true);
    } else if (password) {
      await Swal.fire({
        title: 'Password errata',
        text: 'La password inserita non è corretta.',
        icon: 'error',
        confirmButtonText: 'Riprova',
        confirmButtonColor: '#d33',
      });
    }
  };

  const triggerToast = (message, variant = 'success') => {
    setToastMessage(message);
    setToastVariant(variant);
    setShowToast(true);
  };

  // Varianti per animazioni
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, type: 'spring' } },
  };

  return (
    <Container className="my-5">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h2
          variants={itemVariants}
          className="mb-4"
          style={{ fontWeight: 700, fontSize: '36px', color: 'var(--text)' }}
        >
          Scopri dove ti porterà l’inaspettato.
        </motion.h2>
        <motion.div variants={itemVariants}>
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
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="row"
      >
        {trips.map((trip) => (
          <Col md={4} key={trip._id} className="mb-4">
            <motion.div
              variants={itemVariants}
              whileHover={{ scale: 1.02, transition: { duration: 0.3 } }}
            >
              <Card className="card">
                <Card.Img
                  variant="top"
                  src={trip.image || 'https://via.placeholder.com/150'}
                  style={{ filter: 'blur(10px)', borderRadius: '20px 20px 0 0' }}
                />
                <Card.Body>
                  <Card.Title style={{ filter: 'blur(5px)', opacity: 0.3 }}>Sorpresa...</Card.Title>
                  <Card.Text>Budget: €{trip.budget}</Card.Text>
                  <Card.Text>Tipo: {trip.type}</Card.Text>
                  <Card.Text>Temperatura: {trip.temperature?.min}°C - {trip.temperature?.max}°C</Card.Text>
                  <Card.Text>Costo della vita: €{trip.costOfLiving}/giorno</Card.Text>
                  <Card.Text>Durata: {trip.duration} giorni</Card.Text>
                  <Card.Text>Stagione: {trip.season}</Card.Text>
                  <div className="d-flex gap-2">
                    <Button
                      variant="success"
                      onClick={() => handleSaveTrip(trip._id)}
                      className="btn-primary"
                      style={{ backgroundColor: 'var(--secondary-accent)', borderColor: 'var(--secondary-accent)' }}
                    >
                      Salva Viaggio
                    </Button>
                    <Button
                      variant="info"
                      onClick={() => handleViewDetails(trip)}
                      className="btn-primary"
                      style={{ background: 'var(--button-bg)', borderColor: 'var(--button-bg)' }}
                    >
                      Visualizza Dettagli
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </motion.div>
          </Col>
        ))}
      </motion.div>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Dettagli Viaggio</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedTrip && (
            <>
              <Card.Img
                variant="top"
                src={selectedTrip.image || 'https://via.placeholder.com/150'}
                style={{ filter: 'none', borderRadius: '20px 20px 0 0' }}
              />
              <p><strong>Titolo:</strong> {selectedTrip.title}</p>
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