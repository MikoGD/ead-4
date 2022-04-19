import React, { useState } from 'react';
import { Color } from '../../types';
import styles from './color.module.scss';

// REVIEW:
interface ColorDisplayProps {
  hex: string;
}

export function ColorDisplay({
  hex,
}: ColorDisplayProps): React.ReactElement<ColorDisplayProps> {
  return (
    <div className="d-flex flex-column flex-grow-1">
      <h2>Color Preview</h2>
      <div>
        <div
          className={`mb-3 ${styles.display}`}
          style={{ backgroundColor: hex }}
        >
          &nbsp;
        </div>
        <div id="index-container">
          <div className="btn-toolbar d-flex w-100">
            <div className="btn-group flex-grow-1">
              <button
                id="index-back-5"
                type="button"
                className="btn btn-secondary"
              >
                -5
              </button>
              <button
                id="index-back-1"
                type="button"
                className="btn btn-secondary"
              >
                -1
              </button>
            </div>
            <div
              id="current-index"
              className="w-25 flex-shrink-0 d-flex justify-content-center align-items-center"
            >
              <h3 className="m-0">{0}</h3>
            </div>
            <div className="btn-group flex-grow-1">
              <button
                id="index-forward-1"
                type="button"
                className="btn btn-secondary"
              >
                +1
              </button>
              <button
                id="index-forward-5"
                type="button"
                className="btn btn-secondary"
              >
                +5
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default ColorDisplay;
