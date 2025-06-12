import React, { useContext } from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const NavigationBar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Navbar bg="light" expand="lg" className="shadow-sm" style={{ backgroundColor: '#f5f5f7' }}>
      <Container>
        <Navbar.Brand as={Link} to="/" style={{ fontWeight: 600, fontSize: '24px', color: '#1d1d1f' }}>
          ViaggiRandom
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link as={Link} to="/" style={{ color: '#1d1d1f', fontWeight: 500 }}>
              Home
            </Nav.Link>
            {user ? (
              <>
                <Nav.Link as={Link} to="/profile" style={{ color: '#1d1d1f', fontWeight: 500 }}>
                  Profilo
                </Nav.Link>
                <Button
                  variant="link"
                  onClick={handleLogout}
                  style={{ color: '#007aff', fontWeight: 500, textDecoration: 'none' }}
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/login" style={{ color: '#1d1d1f', fontWeight: 500 }}>
                  Login
                </Nav.Link>
                <Nav.Link as={Link} to="/register" style={{ color: '#1d1d1f', fontWeight: 500 }}>
                  Registrati
                </Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavigationBar;