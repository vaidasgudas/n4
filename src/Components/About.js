import Container from 'react-bootstrap/Container';
import { useState } from 'react';

function About () {
    const [email, setEmail] = useState("");

    setTimeout(() => {
        // To hide email from bots
        const lastname = "gudas";
        const firstname = "vaidas";
        const gmail = "gmail.com";        
        setEmail(`${lastname}.${firstname}@${gmail}`);
    }, 750);

    return <Container sm>
      <h2 className='mt-3'>Technologijos</h2>
      <p>
        <ul>
            <li>Vaizdai generuojami su: <a href="https://github.com/Stability-AI/stablediffusion" target="_blank" rel="noreferrer" className="link-primary">Stable Diffusion 1.5</a></li>
            <li>Modelis: <a href="https://huggingface.co/runwayml/stable-diffusion-v1-5" target="_blank" rel="noreferrer" className="link-primary">runwayml/stable-diffusion-v1-5</a></li>
            <li>Modelis apmokintas su: <a href="https://laion.ai" target="_blank" rel="noreferrer" className="link-primary">LAION-2B</a></li>
            <li>Vertimui iš lietuvių į anglų kalbą: <a href="https://translate.google.com/?hl=lt" target="_blank" rel="noreferrer" className="link-primary">Google Translate</a></li>
        </ul>
      </p>
      <h2>Kontaktai</h2>
      <p>
        <b>E-paštas:</b> <span className='lead'>{email}</span>
      </p>
    </Container>;
}

export default About;