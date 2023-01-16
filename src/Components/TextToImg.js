import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Spinner from 'react-bootstrap/Spinner';
import Badge from 'react-bootstrap/Badge';
import Container from 'react-bootstrap/Container';
import Accordion from 'react-bootstrap/Accordion';
import { useEffect, useState } from 'react';
import TextToImgExamples from './TextToImgExamples';
import { formatDate } from '../Utils';

function TextToImg() {
  // const apiUrl = "http://localhost:7126/api/";
  const apiUrl = "https://ttttibackend20221228185518.azurewebsites.net/api/";
  
  let promptDefault = "";
  let isFormLoadingDefault = false;
  let isWaitingInQueueDefault = false;
  let generatedImagesHistoryDefault = [];

  const generatedImagesHistoryParsed = JSON.parse(localStorage.getItem('generatedImages'));
  if(generatedImagesHistoryParsed && generatedImagesHistoryParsed.length > 0) {
    generatedImagesHistoryDefault = generatedImagesHistoryParsed;
  }

  const generatingId = localStorage.getItem('generatingEntryId');
  const localPrompt = localStorage.getItem('generatingPrompt');

  if(generatingId && localPrompt) {
    isFormLoadingDefault = true;
    isWaitingInQueueDefault = true;
    promptDefault = localPrompt;
  }

  const [textValue, setTextValue] = useState(promptDefault);
  const [isFormLoading, setIsFormLoading] = useState(isFormLoadingDefault);
  const [isWaitingInQueue, setIsWaitingInQueue] = useState(isWaitingInQueueDefault);
  const [queueLength, setQueueLength] = useState(0);
  const [imagesHistory, setImagesHistory] = useState(generatedImagesHistoryDefault);

  let timer = null;

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
        localStorage.setItem('generatingEntryId', data.QueueEntryId);
        localStorage.setItem('generatingPrompt', textValue);
      });
  };

  const checkEntryStatusAfter5Seconds = (queueEntryId) => {
    clearTimeout(timer);
    timer = setTimeout(() => { checkEntryStatus(queueEntryId); }, 5000);
  }

  const checkEntryStatus = (queueEntryId) => {
    if(!queueEntryId) throw new Error(`No entryId: ${queueEntryId}`);
    const url = apiUrl + "GetQueueEntryDetails/" + queueEntryId;
    checkEntryStatusAfter5Seconds(queueEntryId);
    fetch(url)
      .then(response => response.json())
      .then(data => {
        if(data.QueueLength !== undefined) {
          setQueueLength(data.QueueLength);
        } else if(data.Images) {
          clearTimeout(timer);
          localStorage.removeItem("generatingEntryId");
          localStorage.removeItem("generatingPrompt");
          setIsWaitingInQueue(false);
          setIsFormLoading(false);

          const historyEntry = {
            prompt: textValue,
            images: data.Images,
            generatedAt: formatDate(new Date()),
          };

          if(imagesHistory.indexOf(historyEntry) === -1){
            imagesHistory.unshift(historyEntry);
            setImagesHistory(imagesHistory);
            localStorage.setItem('generatedImages', JSON.stringify(imagesHistory));        
          }
        }
      });
  }

  useEffect(() => {
    embedRecaptcha();
    const generatingId = localStorage.getItem('generatingEntryId');
    if(generatingId) setTimeout(() => { checkEntryStatus(generatingId); }, 1500); // Workaround
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    return () => {
      clearTimeout(timer);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return <>
    <div className="text-center mt-3 mb-5">
      <h1>Dirbtiniu intelektu generuojami vaizdai</h1>
      <h2 style={{color:'red'}}>Projektas uždarytas ir nebeveikia!</h2>
    </div>

    { imagesHistory.length === 0 && <TextToImgExamples /> }

    <Container className="p-3 mt-3">

      <Form onSubmit={onSubmitWithCaptchaHandler}>
        { imagesHistory.length === 0 && <h2>Sugeneruok savo:</h2> }
        <Form.Control size="lg" type="text" name="text" placeholder="Vaizdo aprašymas. Naudokit lietuviškas raides (ąčęėįšųū)" value={textValue} onChange={(e) => setTextValue(e.target.value)} disabled={isFormLoading} required maxLength="255" />
        <Button variant="primary" type="submit" className="mt-2" disabled={isFormLoading}>
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
        <Spinner animation="border" size="sm" /> Viena užklausa užtrunka apie 45 sekundes. {isWaitingInQueue && queueLength > 0 && <><br/> Prieš jus eilėje <Badge bg="info">{queueLength}</Badge> užklaus(a)(ų)(os)</> }
      </div> }

    </Container>

    { imagesHistory.length > 0 &&
      <Accordion defaultActiveKey={[0]} alwaysOpen className='mx-auto mt-3' style={{'maxWidth': '1630px'}}>
        {imagesHistory.map((item, index) => { 
          return <Accordion.Item eventKey={index} key={index}>
            <Accordion.Header>{item.prompt}{' '}<span className="text-muted ms-3">{item.generatedAt}</span></Accordion.Header>
            <Accordion.Body className='text-center'>
              {item.images.map((imageUrl, urlIndex) => { return <img src={imageUrl} key={urlIndex} alt={item.prompt} className="rounded img-fluid m-2" />; })}
            </Accordion.Body>
          </Accordion.Item>; })}
      </Accordion> }

    <Container className="p-3 mt-5">
      <small className="text-muted">
        * Nors ir mažai tikėtina, bet įrankis gali sugeneruoti netinkamus, nepadorius, įžeidžiančius paveikslėlius. Naudojantis prisiimate visas rizikas.
      </small>
    </Container>
  </>;
}

export default TextToImg;