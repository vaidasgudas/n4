import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

function Navigation () {
    return <Navbar bg="dark" variant="dark">
    <Container>
      <Navbar.Brand href="#home">N4.lt <small className="text-muted">BETA</small></Navbar.Brand>
      <Nav className="me-auto">
        <Nav.Link href="#home">Tekstas į paveikliuką</Nav.Link>
        <Nav.Link href="#about">Apie</Nav.Link>
      </Nav>
    </Container>
  </Navbar>;
}

export default Navigation;