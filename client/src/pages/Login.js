import React, { useState, useContext } from 'react';
import { Container, Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Toast, ToastContainer } from 'react-bootstrap';

const Login = () => {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showToast, setShowToast] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError('Errore durante il login. Controlla email e password.');
      setShowToast(true);
    }
  };

  // Varianti per animazioni
  const pageVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, type: 'spring' } },
  };

  return (
    <Container
      className="my-5 d-flex justify-content-center align-items-center"
      style={{ minHeight: '80vh', background: 'var(--background)' }}
    >
      <motion.div
        variants={pageVariants}
        initial="hidden"
        animate="visible"
        className="p-4 rounded-3"
        style={{ background: 'var(--card-bg)', boxShadow: 'var(--shadow)', maxWidth: '400px', width: '100%' }}
      >
        <h2 className="text-center mb-4" style={{ color: 'var(--text)', fontWeight: 700 }}>
          Accedi al Tuo Viaggio
        </h2>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="form-control"
            />
          </Form.Group>
          <Form.Group className="mb-4">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="form-control"
            />
          </Form.Group>
          <Button variant="primary" type="submit" className="btn-primary w-100">
            Accedi
          </Button>
        </Form>
        {error && (
          <ToastContainer position="top-end" className="p-3">
            <Toast
              onClose={() => setShowToast(false)}
              show={showToast}
              delay={5000}
              autohide
              bg="danger"
            >
              <Toast.Body className="text-white">{error}</Toast.Body>
            </Toast>
          </ToastContainer>
        )}
      </motion.div>
    </Container>
  );
};

export default Login;