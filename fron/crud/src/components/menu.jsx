import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { NavLink } from 'react-router-dom';

function Menu() {
  return (
    <Navbar expand="lg" sticky="top" className="app-header">
      <Container className="app-header__inner">
        <Navbar.Brand as={NavLink} to="/" className="app-brand">
          <span className="app-brand__mark" aria-hidden="true">
            <span />
            <span />
            <span />
          </span>
          <span>
            <strong>Sistema de Ventas</strong>
            <small>Panel de administracion</small>
          </span>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="menu-principal" className="app-header__toggle" />
        <Navbar.Collapse id="menu-principal">
          <Nav className="app-nav ms-auto">
            <Nav.Link
              as={NavLink}
              to="/clientes"
              className={({ isActive }) => `app-nav__link ${isActive ? 'is-active' : ''}`}
            >
              <span className="app-nav__icon" aria-hidden="true">01</span>
              Clientes
            </Nav.Link>
            <Nav.Link
              as={NavLink}
              to="/productos"
              className={({ isActive }) => `app-nav__link ${isActive ? 'is-active' : ''}`}
            >
              <span className="app-nav__icon" aria-hidden="true">02</span>
              Productos
            </Nav.Link>
            <Nav.Link
              as={NavLink}
              to="/ventas"
              className={({ isActive }) => `app-nav__link ${isActive ? 'is-active' : ''}`}
            >
              <span className="app-nav__icon" aria-hidden="true">03</span>
              Ventas
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Menu;