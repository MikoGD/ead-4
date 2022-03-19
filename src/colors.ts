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

interface ColorIdIndex {
  [id: number]: Color;
}

interface ColorNameIndex {
  [name: string]: Color;
}

let colors: Color[] = [];

const colorIdIndex: ColorIdIndex = {};
const colorNameIndex: ColorNameIndex = {};

function loadColorsJSON() {
  const colorsPath = path.resolve(
    __dirname,
    `../${process.env.COLORS_PATH}` ?? ''
  );
  const colorsFile = fs.readFileSync(colorsPath);

  colors = JSON.parse(String(colorsFile));
}

export function getColors() {
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

export function getColorsByIdOrName(colorToFind: number | string) {
  const isColorToFindId = typeof colorToFind === 'number';

  if (isColorToFindId && colorIdIndex[colorToFind]) {
    return colorIdIndex[colorToFind];
  } else if (colorNameIndex[colorToFind]) {
    return colorNameIndex[colorToFind];
  }

  const color = colors.find(
    ({ colorId, name }) =>
      (isColorToFindId && colorId === colorToFind) || name.toLowerCase() === colorToFind
  );

  if (color) {
    if (isColorToFindId) {
      colorIdIndex[colorToFind] = color;
      return color;
    } else {
      colorNameIndex[colorToFind] = color;
      return color;
    }
  }

  return color;
}

loadColorsJSON();
