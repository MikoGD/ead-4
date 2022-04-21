import React, { useEffect, useState } from 'react';
import PulseLoader from 'react-spinners/PulseLoader';
import { useGetRequest } from '../../api/hooks';
import { Color } from '../../types';
import styles from './pages.module.scss';

export function Display(): React.ReactElement {
  const [response, error] = useGetRequest('/');
  const [colors, setColors] = useState<Color[]>();

  useEffect(() => {
    if (response) {
      const resColors = response.data?.colors;
      if (resColors) {
        setColors(resColors);
      }
    }
  }, [response]);

  return colors || error ? (
    <div className="d-flex justify-content-between flex-wrap container">
      {error && (
        <div className="w-100 text-center">
          <h2 className="text-danger">{error}</h2>
        </div>
      )}
      {colors &&
        colors.map((color) => (
          <div key={color.colorId} className="p-2 w-25">
            <div
              style={{ backgroundColor: color.hexString }}
              className={styles.colorDisplay}
            >
              &nbsp;
            </div>
            <h2>ID: {color.colorId}</h2>
            <h3>{color.name}</h3>
            <p>Hex: {color.hexString}</p>
            <div className="d-flex justify-content-between w-50">
              <div>{`R: ${color.rgb.r}`}</div>
              <div>{`G: ${color.rgb.g}`}</div>
              <div>{`B: ${color.rgb.b}`}</div>
            </div>
            <div className="d-flex justify-content-between w-50">
              <div>{`H: ${color.hsl.h}`}</div>
              <div>{`S: ${color.hsl.s}`}</div>
              <div>{`L: ${color.hsl.l}`}</div>
            </div>
          </div>
        ))}
    </div>
  ) : (
    <div className="w-100 d-flex justify-content-center align-items-center">
      <PulseLoader />
    </div>
  );
}
export default Display;
