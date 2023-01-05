import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

function Navigation (prop) {
  const { pageHash } = prop;

  return <Navbar bg="dark" variant="dark">
    <Container>
      <Navbar.Brand href="#textToImg">N4.lt <small className="text-muted">BETA</small></Navbar.Brand>
      <Nav className="me-auto">
        <Nav.Link href="#textToImg" active={pageHash === "#textToImg"}>Tekstas į paveikliuką</Nav.Link>
        <Nav.Link href="#about" active={pageHash === "#about"}>Apie</Nav.Link>
      </Nav>
    </Container>
  </Navbar>;
}

export default Navigation;