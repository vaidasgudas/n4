import Navigation from './Components/Navigation';
import TextToImg from './Components/TextToImg';
import About from './Components/About';
import { useState } from 'react';

const Pages = {
  TextToImg: 0,
  About: 1,
};

function App() {
  const [page, setPage] = useState(GetPage());
  window.addEventListener("hashchange", () => {
    setPage(GetPage());
  });

  return (
    <>
      <Navigation pageHash={page === Pages.TextToImg ? "#textToImg" : window.location.hash } />
      { page === Pages.TextToImg && <TextToImg/> }
      { page === Pages.About && <About/> }
    </>
  );
}

function GetPage() {
  if(window.location.hash === "#about"){
    return Pages.About;
  } else {
    return Pages.TextToImg;
  }
}

export default App;
