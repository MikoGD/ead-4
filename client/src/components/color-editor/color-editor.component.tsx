import React, {
  useEffect,
  useRef,
  useState,
  ReactElement,
  MutableRefObject,
} from 'react';
import PulseLoader from 'react-spinners/PulseLoader';
import { AxiosError } from 'axios';
import { useForm, UseFormHandleSubmit } from 'react-hook-form';
import styles from './color-editor.module.scss';
import { getColorById } from '../../api/axios';
import { Color } from '../../types';
import { ColorResponse } from '../../api/hooks';
import getCookies, { ColorCookie } from '../../cookies';

export interface Inputs {
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

export type HandleSubmitCallback = (colorInputs: Inputs) => void;
export type HandleSubmit = (
  handleSubmitCallback: (cb: HandleSubmitCallback) => void,
  cookieObj: MutableRefObject<ColorCookie>
) => void;

interface ColorEditorProps {
  handleSubmit: HandleSubmit;
  isSubmitSuccess: null | boolean;
  submitSuccessText: string | ((colorInputs: Inputs) => string);
  submitFailedText: string | ((colorInputs: Inputs) => string);
  submitButtonText: string;
  isSearchEditor?: boolean;
}

/*
TODO:
  - Update pages to use color editor
  - Change inputs to be disabled with request error by invalid color
  - Disable button on error
  - Update index from colorId input
*/

export function ColorEditor({
  handleSubmit,
  isSubmitSuccess,
  submitSuccessText,
  submitFailedText,
  submitButtonText,
  isSearchEditor = false,
}: ColorEditorProps): ReactElement<ColorEditorProps> {
  const {
    register,
    handleSubmit: onSubmit,
    watch,
    setValue,
  } = useForm<Inputs>();
  const [error, setError] = useState<string | null>(null);
  const [isInitialColorLoaded, setIsInitialColorLoaded] = useState(false);
  const [colorIndex, setColorIndex] = useState(0);
  const timeout = useRef<NodeJS.Timeout | null>(null);
  const cookieObj = useRef(getCookies());

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
            setColorIndex(response.data.colorId);
            setError(null);
          }
        } catch (e) {
          const { message } = e as AxiosError<ColorResponse>;
          setError(`Invalid color ID - ${message}`);
        }
      }
    }, 500);
  }

  async function onIndexClick(amount: number) {
    const newIndex = colorIndex + amount;
    try {
      const color = await getColorById(newIndex);
      setColorIndex(newIndex);
      cookieObj.current.colorIndex = newIndex;
      if (!Array.isArray(color.data)) {
        setInputValues(color.data);
      }
    } catch (e) {
      const currError = e as AxiosError<ColorResponse>;
      if (currError.response && currError.response.data.error) {
        setError(currError.response.data.error);
      } else {
        setError(currError.message);
      }
    }
  }

  useEffect(() => {
    setColorIndex(cookieObj.current.colorIndex);

    getColorById(cookieObj.current.colorIndex)
      .then((response) => {
        if (!Array.isArray(response.data)) {
          setInputValues(response.data);
          setIsInitialColorLoaded(true);
          setError(null);
        }
      })
      .catch((e: AxiosError<ColorResponse>) => {
        setError(e.message);
      });
  }, []);

  const SuccessText =
    typeof submitSuccessText === 'string'
      ? submitSuccessText
      : submitSuccessText(watch());
  const FailedText =
    typeof submitFailedText === 'string'
      ? submitFailedText
      : submitFailedText(watch());

  return isInitialColorLoaded ? (
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
          <div className={`d-flex ${styles.colorNavigation}`}>
            <div className="btn-group">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => onIndexClick(-5)}
              >
                <i className="bi bi-chevron-double-left">&nbsp;</i>
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => onIndexClick(-1)}
              >
                <i className="bi bi-chevron-left">&nbsp;</i>
              </button>
            </div>
            <div className="w-25 d-flex justify-content-center align-items-center flex-grow-1">
              <h3 className="m-0">{colorIndex}</h3>
            </div>
            <div className="btn-group">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => onIndexClick(1)}
              >
                <i className="bi bi-chevron-right">&nbsp;</i>
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => onIndexClick(5)}
              >
                <i className="bi bi-chevron-double-right">&nbsp;</i>
              </button>
            </div>
          </div>
        </div>
      </div>
      <form
        onSubmit={(event) => {
          // Due to not calling onSubmit directly a function is needed to pass a
          // callback into submit to also give onSubmit the form event
          function passCallbackToOnSubmit(cb: (colorInputs: Inputs) => void) {
            onSubmit(cb)(event);
          }

          handleSubmit(passCallbackToOnSubmit, cookieObj);
        }}
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
            })}
            id="color-name"
            className="form-control"
            readOnly={isSearchEditor}
          />
        </label>
        <label className="form-label" htmlFor="color-hex">
          <h3>Hex:</h3>
          <input
            {...register('hexString', {
              required: true,
              pattern: /^#([0-9A-F]{3}){1,2}$/i,
              value: '',
            })}
            id="color-hex"
            className="form-control"
            readOnly={isSearchEditor}
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
                  })}
                  readOnly={isSearchEditor}
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
                  })}
                  readOnly={isSearchEditor}
                />
              </label>
            ))}
          </div>
        </div>
        {error && <div className="alert alert-danger">{error}</div>}
        {isSubmitSuccess !== null && (
          <div
            className={`alert ${
              isSubmitSuccess ? 'alert-success' : 'alert-danger'
            }`}
          >
            {isSubmitSuccess ? SuccessText : FailedText}
          </div>
        )}
        <button type="submit" className="btn btn-primary mt-5">
          {submitButtonText}
        </button>
      </form>
    </div>
  ) : (
    <PulseLoader />
  );
}
export default ColorEditor;
