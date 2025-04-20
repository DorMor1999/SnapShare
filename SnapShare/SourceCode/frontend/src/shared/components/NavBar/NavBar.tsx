// react imports
import React, { Fragment } from 'react';
import { useNavigate } from 'react-router';

// bootsrap imports
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Badge from 'react-bootstrap/Badge';
import NavDropdown from 'react-bootstrap/NavDropdown';

//my imports
import logo from '../../../assets/logo/logo croped.png';
import classes from './NavBar.module.css';
import SettingsIcon from '../UI/Icons/SettingsIcon';
import LogOutIcon from '../UI/Icons/LogOutIcon';
import LogInIcon from '../UI/Icons/LogInIcon';
import PersonPlusIcon from '../UI/Icons/PersonPlusIcon';

const NavBar: React.FC = () => {
  const navigate = useNavigate();
  const isConnected: boolean = true;

  function moveToOtherPage(path: string): void {
    navigate(`${path}`);
  }

  let content;
  if (isConnected) {
    const pendingInvitations: number = 5;
    const fullName: string = "Doron Ben Zaken";

    content = (
      <Fragment>
        <Nav className="me-auto">
        <Nav.Link className={classes["disabled-link-full-name"]}>{fullName}</Nav.Link>
          <Nav.Link onClick={() => moveToOtherPage('/events')}>Events</Nav.Link>
          <Nav.Link>
            Invitations{' '}
            {pendingInvitations > 0 && (
              <Badge className={classes['invitations-badge']} pill bg="danger">
                {pendingInvitations}
              </Badge>
            )}
          </Nav.Link>
          <NavDropdown
            title={
              <Fragment>
                <SettingsIcon width={16} height={16} /> Settings
              </Fragment>
            }
            id="basic-nav-dropdown"
          >
            <NavDropdown.Item href="#action/3.1">Change Data</NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item className={classes["logout-item"]}  href="#action/3.4">
            <LogOutIcon width={16} height={16}/> LogOut
            </NavDropdown.Item>
          </NavDropdown>
        </Nav>
      </Fragment>
    );
  } else {
    content = <Fragment>
      <Nav className="me-auto">
          <NavDropdown
            title={
              <Fragment>
                 Authentication
              </Fragment>
            }
            id="basic-nav-dropdown"
          >
            <NavDropdown.Item onClick={() => moveToOtherPage('/login')}>{<LogInIcon width={16} height={16}/>} LogIn</NavDropdown.Item>
            <NavDropdown.Item onClick={() => moveToOtherPage('/register')}>{<PersonPlusIcon width={16} height={16}/>} Register</NavDropdown.Item>
          </NavDropdown>
        </Nav>
    </Fragment>;
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
              width="35"
              height="35"
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
