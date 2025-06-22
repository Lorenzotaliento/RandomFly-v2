import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import axios from 'axios';
import Swal from 'sweetalert2';
import { AuthContext } from '../context/AuthContext';

const Profile = () => {
  const { user } = useContext(AuthContext);
  const [savedTrips, setSavedTrips] = useState([]);

  useEffect(() => {
    if (user) {
      const fetchSavedTrips = async () => {
        try {
          const res = await axios.get('http://localhost:3001/api/users/profile', {
            headers: { Authorization: `Bearer ${user.token}` },
          });
          setSavedTrips(res.data.savedTrips);
        } catch (err) {
          console.error(err);
        }
      };
      fetchSavedTrips();
    }
  }, [user]);

  const handleDelete = async (tripId) => {
    const result = await Swal.fire({
      title: 'Sei sicuro?',
      text: "Vuoi davvero rimuovere questo viaggio salvato?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sì, rimuovi',
      cancelButtonText: 'Annulla',
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`http://localhost:3001/api/users/savedTrips/${tripId}`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setSavedTrips(prev => prev.filter(t => t._id !== tripId));
        Swal.fire('Rimosso!', 'Il viaggio è stato rimosso con successo.', 'success');
      } catch (err) {
        console.error('Errore durante l\'eliminazione del viaggio:', err);
        Swal.fire('Errore', 'Si è verificato un errore durante l\'eliminazione.', 'error');
      }
    }
  };

  if (!user) {
    return <Container><h3>Devi essere loggato per visualizzare questa pagina.</h3></Container>;
  }

  return (
    <Container className="my-4">
      <h2>I Miei Viaggi Salvati</h2>
      <Row>
        {savedTrips.map((trip) => (
          <Col md={4} key={trip._id} className="mb-4">
            <Card>
              <Card.Img
                variant="top"
                src={trip.image || 'https://via.placeholder.com/150'}
                style={{ filter: 'blur(6px)' }}
              />
              <Card.Body>
                <Card.Title style={{ filter: 'blur(4px)' }}>{trip.title}</Card.Title>
                <Card.Text>{trip.description}</Card.Text>
                <Card.Text>Budget: €{trip.budget}</Card.Text>
                <Card.Text>Tipo: {trip.type}</Card.Text>
                <Card.Text>Temperatura: {trip.temperature?.min}°C - {trip.temperature?.max}°C</Card.Text>
                <Card.Text>Costo della vita: €{trip.costOfLiving}/giorno</Card.Text>
                <Card.Text>Durata: {trip.duration} giorni</Card.Text>
                <Card.Text>Stagione: {trip.season}</Card.Text>
                <button className="btn btn-danger mt-2" onClick={() => handleDelete(trip._id)}>Rimuovi</button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Profile;