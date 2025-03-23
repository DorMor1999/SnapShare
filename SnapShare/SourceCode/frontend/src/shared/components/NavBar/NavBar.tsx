import React, { useContext } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { useNavigate } from 'react-router';
import logo from '../../../assets/logo/logo croped.png';

const NavBar: React.FC = () => {
  const navigate = useNavigate();
  const isConnected: boolean = true;

  function moveToOtherPage(path: string): void {
    navigate(`${path}`);
  }

  let content;
  if (isConnected) {
    content = (
      <Nav className="me-auto">
        <Nav.Link onClick={() => moveToOtherPage('/movies')}>Events</Nav.Link>
      </Nav>
    );
  } else {
    content = <></>;
  }

  return (
    <Navbar
      collapseOnSelect
      expand="lg"
      className={`bg-light light-theme`}
      data-bs-theme="light"
    >
      <Container>
        <Nav.Link>
          <Navbar.Brand onClick={() => moveToOtherPage('/')}>
            <img
              src={logo}
              width="30"
              height="30"
              className="d-inline-block align-top"
              alt="React Bootstrap logo"
            />{' '}
            SnapShare
          </Navbar.Brand>
        </Nav.Link>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">{content}</Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;
