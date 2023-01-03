import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

function TextToImgExamples(){
  return <Container>
      <Row >
        <Col className="mt-1">
            <Card style={{ width: '18rem' }} className="mx-auto">
                <Card.Img variant="top" src="images/promptExample1.png" />
                <Card.Body>
                    <Card.Text>
                        Astronautas joja žirgu marse
                    </Card.Text>
                </Card.Body>
            </Card>
        </Col>
        <Col className="mt-1">
            <Card style={{ width: '18rem' }} className="mx-auto">
                <Card.Img variant="top" src="images/promptExample2.png" />
                <Card.Body>
                    <Card.Text>
                        Braškiniai sušiai
                    </Card.Text>
                </Card.Body>
            </Card>
        </Col>
        <Col className="mt-1">
            <Card style={{ width: '18rem' }} className="mx-auto">
                <Card.Img variant="top" src="images/promptExample3.png" />
                <Card.Body>
                    <Card.Text>
                        Panda važiuoja su motociklu
                    </Card.Text>
                </Card.Body>
            </Card>
        </Col>
        <Col className="mt-1">
            <Card style={{ width: '18rem' }} className="mx-auto">
                <Card.Img variant="top" src="images/promptExample4.png" />
                <Card.Body>
                    <Card.Text>
                        Tapytas paveikslas su gražia pilimi prie krioklio
                    </Card.Text>
                </Card.Body>
            </Card>
        </Col>
      </Row>
</Container>
}

export default TextToImgExamples;