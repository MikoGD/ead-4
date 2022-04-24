import React, { useEffect, useRef, useState } from 'react';
import PulseLoader from 'react-spinners/PulseLoader';
import { AxiosError } from 'axios';
import { useForm } from 'react-hook-form';
import convert from 'color-convert';
import { HSL, RGB } from 'color-convert/conversions';
import styles from './pages.module.scss';
import { addColor, getColorById, updateColor } from '../../api/axios';
import { Color } from '../../types';
import { ColorResponse } from '../../api/hooks';

interface Inputs {
  name: string;
  colorId: number;
  hexString: string;
  r: number;
  g: number;
  b: number;
  h: number;
  s: number;
  l: number;
}

/*
  TODO:
  - Add error handling
  - Reset values when there is no ID
  - Add buttons to navigate colors
*/

export function UpdatePage(): React.ReactElement {
  const { register, handleSubmit, watch, setValue } = useForm<Inputs>();
  const [didColorUpdate, setDidColorUpdate] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isColorSelected, setIsColorSelected] = useState(false);
  const timeout = useRef<NodeJS.Timeout | null>(null);

  function onHexChange(event: React.ChangeEvent<HTMLInputElement>) {
    const [r, g, b] = convert.hex.rgb(event.target.value);
    const [h, s, l] = convert.hex.hsl(event.target.value);

    setValue('r', r);
    setValue('g', g);
    setValue('b', b);

    setValue('h', h);
    setValue('s', s);
    setValue('l', l);
  }

  function onRGBChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { r, g, b } = watch();

    const channel = event.target.id.split('-')[2];
    const channelValue = Number(event.target.value);
    const newRGB = { r, g, b, [channel]: channelValue };

    const newHex = convert.rgb.hex(Object.values(newRGB) as RGB);
    setValue('hexString', `#${newHex}`);

    const [h, s, l] = convert.rgb.hsl(Object.values(newRGB) as RGB);
    setValue('h', h);
    setValue('s', s);
    setValue('l', l);
  }

  function onHSLChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { h, s, l } = watch();

    const channel = event.target.id.split('-')[2];
    const channelValue = Number(event.target.value);

    const newHSL = { h, s, l, [channel]: channelValue };

    const newHex = convert.hsl.hex(Object.values(newHSL) as HSL);
    setValue('hexString', `#${newHex}`);

    const [r, g, b] = convert.hsl.rgb(Object.values(newHSL) as HSL);
    setValue('r', r);
    setValue('g', g);
    setValue('b', b);
  }

  function setInputValues(color: Color) {
    const {
      colorId,
      name,
      hexString,
      rgb: { r, g, b },
      hsl: { h, s, l },
    } = color;
    setValue('colorId', colorId, { shouldDirty: true });
    setValue('name', name);
    setValue('hexString', hexString, { shouldDirty: true });
    setValue('r', r, { shouldDirty: true });
    setValue('g', g, { shouldDirty: true });
    setValue('b', b, { shouldDirty: true });
    setValue('h', h, { shouldDirty: true });
    setValue('s', s, { shouldDirty: true });
    setValue('l', l, { shouldDirty: true });
  }

  async function onColorIdChange(event: React.ChangeEvent<HTMLInputElement>) {
    if (timeout.current) {
      clearTimeout(timeout.current);
    }

    timeout.current = setTimeout(async () => {
      if (event.target.value) {
        try {
          const response = await getColorById(Number(event.target.value));
          if (!Array.isArray(response.data)) {
            setInputValues(response.data);
            setIsColorSelected(true);
            setError(null);
          }
        } catch (e) {
          const { message } = e as AxiosError<ColorResponse>;
          setError(`Invalid color ID - ${message}`);
          setIsColorSelected(true);
        }
      }
    }, 500);
  }

  async function onSubmit(inputs: Inputs) {
    const newColor: Color = {
      name: inputs.name,
      colorId: inputs.colorId,
      hexString: inputs.hexString,
      rgb: {
        r: inputs.r,
        g: inputs.g,
        b: inputs.b,
      },
      hsl: {
        h: inputs.h,
        s: inputs.s,
        l: inputs.l,
      },
    };

    try {
      await updateColor(newColor);
      setDidColorUpdate(true);
    } catch (e) {
      setDidColorUpdate(false);
    } finally {
      setTimeout(() => {
        setDidColorUpdate(null);
      }, 5000);
    }
  }

  useEffect(() => {
    getColorById(1)
      .then((response) => {
        if (!Array.isArray(response.data)) {
          setInputValues(response.data);
          setIsColorSelected(true);
          setError(null);
        }
      })
      .catch((e: AxiosError<ColorResponse>) => {
        setError(e.message);
      });
  }, []);

  return isColorSelected ? (
    <div className="container mt-5 d-flex justify-content-between bg-white p-3">
      <div className="d-flex flex-column w-50">
        <h2>Color Preview</h2>
        <div>
          <div
            className={`mb-3 ${styles.colorPreview}`}
            style={{ backgroundColor: watch('hexString', 'value') }}
          >
            &nbsp;
          </div>
        </div>
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="d-flex flex-column container"
      >
        <label className="form-label" htmlFor="color-id">
          <h3>Color ID:</h3>
          <input
            {...register('colorId', {
              required: true,
              onChange: onColorIdChange,
              value: 1,
            })}
            id="color-id"
            className="form-control"
          />
        </label>
        <label className="form-label" htmlFor="color-name">
          <h3>Color Name:</h3>
          <input
            {...register('name', {
              required: true,
              value: '',
              disabled: !isColorSelected,
            })}
            id="color-name"
            className="form-control"
          />
        </label>
        <label className="form-label" htmlFor="color-hex">
          <h3>Hex:</h3>
          <input
            {...register('hexString', {
              required: true,
              pattern: /^#([0-9A-F]{3}){1,2}$/i,
              value: '',
              onChange: onHexChange,
              disabled: !isColorSelected,
            })}
            id="color-hex"
            className="form-control"
          />
        </label>
        <div>
          <h4>RGB</h4>
          <div
            id="rgb-container"
            className="d-flex justify-content-between space-2"
          >
            {['r', 'g', 'b'].map((letter) => (
              <label
                key={letter}
                className="form-label"
                htmlFor={`color-rgb-${letter}`}
              >
                <p>{`${letter.toUpperCase()}:`}</p>
                <input
                  className="form-control"
                  id={`color-rgb-${letter}`}
                  {...register(letter as 'r' | 'g' | 'b', {
                    required: true,
                    valueAsNumber: true,
                    min: 0,
                    max: 255,
                    value: 0,
                    onChange: onRGBChange,
                    disabled: !isColorSelected,
                  })}
                />
              </label>
            ))}
          </div>
        </div>
        <div>
          <h4>HSL</h4>
          <div
            id="hsl-container"
            className="d-flex justify-content-between space-2"
          >
            {['h', 's', 'l'].map((letter) => (
              <label
                key={letter}
                className="form-label"
                htmlFor={`color-hsl-${letter}`}
              >
                <p>{`${letter.toUpperCase()}:`}</p>
                <input
                  className="form-control"
                  id={`color-hsl-${letter}`}
                  {...register(letter as 'h' | 's' | 'l', {
                    required: true,
                    valueAsNumber: true,
                    min: 0,
                    max: letter === 'h' ? 359 : 100,
                    value: 0,
                    onChange: onHSLChange,
                    disabled: !isColorSelected,
                  })}
                />
              </label>
            ))}
          </div>
        </div>
        {error && <div className="alert alert-danger">{error}</div>}
        {didColorUpdate !== null && (
          <div
            className={`alert ${
              didColorUpdate ? 'alert-success' : 'alert-danger'
            }`}
          >
            {didColorUpdate ? `Color Updated!` : 'Error updating color'}
          </div>
        )}
        <button type="submit" className="btn btn-primary mt-5">
          Update Color
        </button>
      </form>
    </div>
  ) : (
    <PulseLoader />
  );
}
export default UpdatePage;
