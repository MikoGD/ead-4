import axios, { AxiosError, AxiosResponse } from 'axios';
import convert from 'color-convert';
import React from 'react';
import { addColor, PostColorResponse } from '../../api/axios';
import { Color, SetState } from '../../types';

// REVIEW:
interface ColorButtonsProps {
  colorInputs: Color;
  setBgColor: SetState<Color | undefined>;
  setColor: SetState<Color | undefined>;
}

function validateHexString(hex: string) {
  return /^#([0-9A-F]{3}){1,2}$/i.test(hex);
}

export function ColorButtons({
  colorInputs,
  setBgColor,
  setColor,
}: ColorButtonsProps): React.ReactElement<ColorButtonsProps> {
  function onShowClick() {
    setColor(colorInputs);
  }

  function onChangeBackgroundClick() {
    setColor(colorInputs);
    setBgColor(colorInputs);
  }

  async function onInsertClick() {
    const isValidRGB = Object.values(colorInputs.rgb).every(
      (channel) => channel >= 0 && channel <= 255
    );

    const isValidHSL = Object.values(colorInputs.hsl).every(
      (channel) => channel >= 0 && channel <= 240
    );

    const isValidHexString = validateHexString(colorInputs.hexString);

    if (isValidRGB && isValidHSL && isValidHexString) {
      try {
        const colorToAdd: Partial<Color> = { ...colorInputs };
        delete colorToAdd.colorId;

        const response = await addColor(colorToAdd as Omit<Color, 'colorId'>);

        alert(`color added at url ${response.data.url}`);
      } catch (err) {
        const { response } = err as AxiosError<PostColorResponse>;
        alert(`Error adding new color ${response?.data.error}`);
      }
      return;
    }

    alert('invalid color');
  }

  return (
    <div className="btn-toolbar d-flex flex-column mb-5" role="toolbar">
      <div className="btn-group" role="group">
        <button
          type="button"
          id="btn-show"
          className="btn btn-secondary"
          onClick={onShowClick}
        >
          Show
        </button>
        <button
          type="button"
          id="btn-insert"
          className="btn btn-secondary"
          onClick={onInsertClick}
        >
          Insert
        </button>
        <button type="button" id="btn-remove" className="btn btn-secondary">
          Remove
        </button>
        <button type="button" id="btn-modify" className="btn btn-secondary">
          Modify
        </button>
        <button
          type="button"
          id="btn-change-bg"
          className="btn btn-secondary"
          onClick={onChangeBackgroundClick}
        >
          Change background
        </button>
      </div>
    </div>
  );
}
export default ColorButtons;
