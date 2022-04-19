import React, { useEffect, useState } from 'react';
import Cookie from 'js-cookie';
import { AxiosError } from 'axios';
import PulseLoader from 'react-spinners/PulseLoader';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Color } from './types';
import './app.module.scss';
import { Header } from './components/header';
import { DisplayPage, AddPage } from './components/pages';
import ColorButtons from './components/color/color-buttons.component';
import ColorDisplay from './components/color/color-display.component';
import ColorInputs from './components/color/color-inputs.component';
import { GetColorResponse, getColorById } from './api/axios';

const colorDefault: Color = {
  colorId: 0,
  name: '',
  rgb: {
    r: 0,
    g: 0,
    b: 0,
  },
  hsl: {
    h: 0,
    s: 0,
    l: 0,
  },
  hexString: '',
};

function App(): React.ReactElement {
  // const [color, setColor] = useState<Color>();
  // const [colorInputs, setColorInputs] = useState<Color>(colorDefault);
  // const [bgColor, setBgColor] = useState<Color>();
  // const [currColorId, setCurrColorId] = useState(0);
  // const [error, setError] = useState('');

  // useEffect(() => {
  //   const cookieBgColor = Cookie.get('bg-color');
  //   const cookieColorId = Number(Cookie.get('color-index'));

  //   if (cookieBgColor) {
  //     setBgColor(JSON.parse(cookieBgColor) as Color);
  //   }

  //   if (cookieColorId && !Number.isNaN(cookieColorId)) {
  //     setCurrColorId(cookieColorId);

  //     getColorById(cookieColorId)
  //       .then((resColor) => {
  //         setColor(resColor);
  //         console.log(resColor);
  //       })
  //       .catch((err) => console.error(err));
  //   } else {
  //     getColorById(0)
  //       .then((resColor) => {
  //         setColor(resColor);
  //         setColorInputs(resColor);
  //         console.log(resColor);
  //       })
  //       .catch((err: AxiosError<GetColorResponse>) => {
  //         const { response } = err;
  //         setError(`Error: ${response?.data.error ?? 'error'}`);
  //       });
  //   }
  // }, []);

  // useEffect(() => {
  //   if (bgColor) {
  //     Cookie.set('bg-color', JSON.stringify(bgColor));
  //     document.body.style.backgroundColor = bgColor.hexString;
  //   }
  // }, [bgColor]);

  // function changeBgColor() {
  //   console.log('hi');
  // }

  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/display" element={<DisplayPage />} />
        <Route path="/add" element={<AddPage />} />
      </Routes>
      {/* <main className="container d-flex flex-column">
        {color && colorInputs ? (
          <>
            <ColorButtons
              colorInputs={colorInputs}
              setBgColor={setBgColor}
              setColor={setColor}
            />
            <div className="d-flex">
              <ColorDisplay index={currColorId} color={color} />
              <div className="d-flex flex-column flex-grow-1">
                {error && <h2 className="text-danger">{error}</h2>}
                <ColorInputs
                  colorInputs={colorInputs}
                  setColorInputs={setColorInputs}
                />
              </div>
            </div>
          </>
        ) : (
          <PulseLoader />
        )}
      </main> */}
    </BrowserRouter>
  );
}

export default App;
