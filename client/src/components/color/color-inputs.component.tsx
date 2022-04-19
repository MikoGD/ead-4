import React, { ChangeEvent, useEffect, useState } from 'react';
import convert from 'color-convert';
import { Color, SetState } from '../../types';

// REVIEW:
interface ColorInputsProps {
  colorInputs: Color;
  setColorInputs: SetState<Color>;
}

/* eslint-disable */
export function ColorInputs({
  colorInputs,
  setColorInputs,
}: ColorInputsProps): React.ReactElement<ColorInputsProps> {
  function handleOnChange(e: ChangeEvent<HTMLInputElement>) {
    const inputId = e.target.id;
    if (inputId === 'color-id') {
      const colorId = Number(e.target.value);
      setColorInputs((prev) => ({ ...prev, colorId }));
    } else if (inputId === 'color-name') {
      const name = e.target.value;

      setColorInputs((prev) => ({ ...prev, name }));
    } else if (inputId === 'color-hex') {
      const [r, g, b] = convert.hex.rgb(e.target.value);
      const [h, s, l] = convert.hex.hsl(e.target.value);

      setColorInputs((prev) => ({
        ...prev,
        hexString: e.target.value,
        rgb: { r, g, b },
        hsl: { h, s, l },
      }));
    } else if (inputId.includes('rgb')) {
      const channel = inputId.split('-')[2];
      setColorInputs((prev) => {
        const newInput = { ...prev };

        newInput.rgb[channel] = Number(e.target.value);

        const { rgb } = newInput;

        const [h, s, l] = convert.rgb.hsl(rgb.r, rgb.g, rgb.b);
        const hexString = convert.rgb.hex(rgb.r, rgb.g, rgb.b);

        return { ...newInput, hexString, hsl: { h, s, l } };
      });
    } else if (inputId.includes('hsl')) {
      const channel = inputId.split('-')[2];
      console.log(channel);

      setColorInputs((prev) => {
        const newInput = { ...prev };

        newInput.hsl[channel] = Number(e.target.value);

        const { hsl } = newInput;

        const [r, g, b] = convert.hsl.rgb([hsl.h, hsl.s, hsl.l]);
        const hexString = convert.hsl.hex([hsl.h, hsl.s, hsl.l]);

        return { ...newInput, hexString, rgb: { r, g, b } };
      });
    }
  }

  return (
    <div className="d-flex flex-column">
      <label className="form-label" htmlFor="color-id">
        <h3>Color ID:</h3>
        <input
          type="number"
          className="form-control"
          name="color-id"
          id="color-id"
          value={colorInputs?.colorId}
          onChange={handleOnChange}
          min={0}
        />
      </label>
      <label className="form-label" htmlFor="color-name">
        <h3>Color name:</h3>
        <input
          type="text"
          className="form-control"
          name="color-name"
          id="color-name"
          value={colorInputs?.name}
          onChange={handleOnChange}
        />
      </label>
      <label className="form-label" htmlFor="color-hex">
        <h3>Color hex value:</h3>
        <input
          type="text"
          className="form-control"
          name="color-hex"
          id="color-hex"
          value={colorInputs?.hexString}
          onChange={handleOnChange}
        />
      </label>
      <div>
        <h4>RGB</h4>
        <div
          id="rgb-container"
          className="d-flex justify-content-between space-2"
        >
          {['r', 'g', 'b'].map((letter) => {
            return (
              <label
                key={letter}
                className="form-label"
                htmlFor={`color-rgb-${letter}`}
              >
                <p>{`${letter.toUpperCase()}:`}</p>
                <input
                  type="number"
                  className="form-control"
                  name={`color-rgb-${letter}`}
                  id={`color-rgb-${letter}`}
                  value={`${colorInputs?.rgb[letter] ?? 0}`}
                  onChange={handleOnChange}
                  min={0}
                  max={255}
                />
              </label>
            );
          })}
        </div>
      </div>
      <div>
        <h4>HSL</h4>
        <div id="hsl-container" className="d-flex justify-content-between">
          {['h', 's', 'l'].map((letter) => {
            return (
              <label
                key={letter}
                className="form-label"
                htmlFor={`color-hsl-${letter}`}
              >
                <p>{`${letter.toUpperCase()}:`}</p>
                <input
                  type="number"
                  className="form-control"
                  name={`color-hsl-${letter}`}
                  id={`color-hsl-${letter}`}
                  value={`${colorInputs?.hsl[letter] ?? 0}`}
                  onChange={handleOnChange}
                  min={0}
                  max={240}
                />
              </label>
            );
          })}
        </div>
      </div>
    </div>
  );
}
export default ColorInputs;
