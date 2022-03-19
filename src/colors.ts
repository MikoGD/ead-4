import fs from 'fs';
import path from 'path';

export interface Color {
  colorId: number;
  hexString: string;
  rgb: {
    r: number;
    g: number;
    b: number;
  };
  hsl: {
    h: number;
    s: number;
    l: number;
  };
  name: string;
}

let colors: Color[] = [];

function loadColorsJSON() {
  const colorsPath = path.resolve(__dirname, process.env.COLORS_PATH ?? '');
  const colorsFile = fs.readFileSync(colorsPath);

  colors = JSON.parse(String(colorsFile));
}

export function getAllColors() {
  return colors;
}

export function addColor(newColor: Color) {
  colors = [...colors, newColor];
}

/**
 * Returns true if color was updated else false
 */
export function updateColor(colorId: number, updatedColor: Color) {
  const colorToUpdateIndex = colors.findIndex(
    ({ colorId }) => colorId === colorId
  );
  const colorToUpdate = colors[colorToUpdateIndex];

  if (!colorToUpdate) {
    return false;
  }

  colors[colorToUpdateIndex] = { ...colorToUpdate, ...updatedColor };

  return true;
}

loadColorsJSON();
