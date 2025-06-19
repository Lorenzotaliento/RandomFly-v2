import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import axios from 'axios';
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
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Profile;