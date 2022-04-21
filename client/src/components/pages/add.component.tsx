import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import convert from 'color-convert';
import { HSL, RGB } from 'color-convert/conversions';
import styles from './pages.module.scss';
import { addColor } from '../../api/axios';
import { Color } from '../../types';

interface Inputs {
  name: string;
  hexString: string;
  r: number;
  g: number;
  b: number;
  h: number;
  s: number;
  l: number;
}

export function AddPage(): React.ReactElement {
  const { register, handleSubmit, watch, setValue } = useForm<Inputs>();
  const [newColorUrl, setNewColorUrl] = useState<string | null>(null);

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

  async function onSubmit(inputs: Inputs) {
    const newColor: Omit<Color, 'colorId'> = {
      name: inputs.name,
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
      const response = await addColor(newColor);
      const {
        data: { url },
      } = response;
      setNewColorUrl(url);
    } catch (e) {
      setNewColorUrl('error');
    } finally {
      setTimeout(() => {
        setNewColorUrl(null);
      }, 5000);
    }
  }

  return (
    <div className="container mt-5 d-flex justify-content-between">
      <div className="d-flex flex-column w-50">
        <h2>Color Preview</h2>
        <div>
          <div
            className={`mb-3 ${styles.colorPreview}`}
            style={{ backgroundColor: watch().hexString }}
          >
            &nbsp;
          </div>
        </div>
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="d-flex flex-column container"
      >
        <label className="form-label" htmlFor="color-name">
          <h3>Color Name:</h3>
          <input
            {...register('name', { required: true, value: '' })}
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
                  })}
                />
              </label>
            ))}
          </div>
        </div>
        {newColorUrl !== null && (
          <div
            className={`alert ${
              newColorUrl !== 'error' ? 'alert-success' : 'alert-danger'
            }`}
          >
            {newColorUrl !== 'error'
              ? `Color added: ${newColorUrl}`
              : 'Error adding color'}
          </div>
        )}
        <button type="submit" className="btn btn-primary mt-5">
          Add Color
        </button>
      </form>
    </div>
  );
}
export default AddPage;
