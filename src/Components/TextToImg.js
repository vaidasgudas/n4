import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Spinner from 'react-bootstrap/Spinner';
import Badge from 'react-bootstrap/Badge';
import Container from 'react-bootstrap/Container';
import { useEffect, useState } from 'react';
import TextToImgExamples from './TextToImgExamples';

function TextToImg() {
  // const apiUrl = "http://localhost:7126/api/";
  const apiUrl = "https://ttttibackend20221228185518.azurewebsites.net/";
  
  const [textValue, setTextValue] = useState("");
  const [isFormLoading, setIsFormLoading] = useState(false);
  const [isWaitingInQueue, setIsWaitingInQueue] = useState(false);
  const [queueLength, setQueueLength] = useState(0);
  const [images, setImages] = useState([]);

  const embedRecaptcha = () => {
    const script = document.createElement("script")
    script.src = "https://www.google.com/recaptcha/api.js?render=6Lf9BsIjAAAAADpUtpkiVlqGFdTP1bLzZOieNub_"
    document.body.appendChild(script)
  };

  const onSubmitWithCaptchaHandler = e => {
    setIsFormLoading(true);
    e.preventDefault();
    window.grecaptcha.ready(_ => {
      window.grecaptcha
        .execute("6Lf9BsIjAAAAADpUtpkiVlqGFdTP1bLzZOieNub_", { action: "textToImg" })
        .then(token => {
          handleSubmit(token);
        })
    })
  };

  const handleSubmit = (recaptchaToken) => {
    const url = apiUrl + "AddPromtToQueue";
    const data = {
      Prompt: textValue,
      RecaptchaToken: recaptchaToken
    };
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      mode: 'cors',
      body: JSON.stringify(data)
    };
    fetch(url, requestOptions)
      .then(response => {
        if (response.status === 429) alert("Klaida. Perdaug užklausų iš jūsų IP adreso");
        if (!response.ok) throw new Error(response.status);
        return response.json();
      })
      .then(data => {
        setIsWaitingInQueue(true);
        setQueueLength(data.QueueLength);
        checkEntryStatusAfter5Seconds(data.QueueEntryId);
      });
  };

  const checkEntryStatusAfter5Seconds = (queueEntryId) => {
    setTimeout(() => { checkEntryStatus(queueEntryId); }, 5000);
  }

  const checkEntryStatus = (queueEntryId) => {
    if(!queueEntryId) throw new Error(`No entryId: ${queueEntryId}`);
    const url = apiUrl + "GetQueueEntryDetails/" + queueEntryId;
    fetch(url)
      .then(response => response.json())
      .then(data => {
        if(data.QueueLength !== undefined){
          setQueueLength(data.QueueLength);
          checkEntryStatusAfter5Seconds(queueEntryId);          
        }
        else if(data.Images) {
          setIsWaitingInQueue(false);
          setIsFormLoading(false);
          setImages(data.Images);
        }
      });
  }

  useEffect(() => {
    embedRecaptcha();
  }, []);

  return <>
    <div className="text-center mt-3 mb-5">
      <h1>Dirbtiniu intelektu generuojami vaizdai</h1>
    </div>    
    <TextToImgExamples />
    <Container className="p-3 mt-3">
      <Form onSubmit={onSubmitWithCaptchaHandler}>
        <Form.Label>Išbandyti: </Form.Label>
        <Form.Control size="lg" type="text" name="text" placeholder="Tekstas" value={textValue} onChange={(e) => setTextValue(e.target.value)} disabled={isFormLoading} required maxLength="255" />
        <Button variant="primary" type="submit" className="mt-1" disabled={isFormLoading}>
          {isFormLoading && <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />}
          {isFormLoading ? " Generuojama..." : "Generuoti"}
        </Button>
        <div
          className="g-recaptcha"
          data-sitekey="6Lf9BsIjAAAAADpUtpkiVlqGFdTP1bLzZOieNub_"
          data-size="invisible"
        ></div>
      </Form>

      { isFormLoading && <div className="text-center mt-4">
        <Spinner animation="border" size="sm" /> Generuojama. Viena užklausa generuojama apie 30 sekundžių. {isWaitingInQueue && queueLength > 0 && <><br/> Prieš jus eilėje: <Badge bg="info">{queueLength}</Badge></> }
      </div> }

    </Container>

    { images.length > 0 && <div className="mt-4 text-center">{images.map(image => { return <><img src={image} alt="generatedAiImage" className="rounded img-fluid m-2" /> </>; })}</div> }

    <Container className="p-3 mt-5">
      <small className="text-muted">
        * Nors ir mažai tikėtina, bet įrankis gali sugeneruoti netinkamus, nepadorius, įžeidžiančius paveikslėlius. Naudojantis prisiimate visas rizikas.
      </small>
    </Container>
  </>;
}

export default TextToImg;