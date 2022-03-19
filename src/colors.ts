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

interface ColorsIndex {
  [id: number]: Color;
}

interface ColorNameIndex {
  [name: string]: Color;
}

const colorsIndex: ColorsIndex = {};
const colorsNameIndex: ColorNameIndex = {};

function loadColorsJSON() {
  const colorsPath = path.resolve(
    __dirname,
    `../${process.env.COLORS_PATH}` ?? ''
  );

  const colorsFile = fs.readFileSync(colorsPath);

  const colors: Color[] = JSON.parse(String(colorsFile));
  colors.forEach((color) => {
    const { colorId, name } = color;

    colorsIndex[colorId] = color;
    colorsNameIndex[name.toLowerCase()] = color;
  });
}

export function getColors() {
  return colorsIndex;
}

export function addColor(newColor: Color) {
  colorsIndex[newColor.colorId] = newColor;
}

/**
 * Returns true if color was updated else false
 */
export function updateColor(colorId: number, updatedColor: Color) {
  const colorToUpdate = colorsIndex[colorId];

  if (!colorToUpdate) {
    return false;
  }

  colorsIndex[colorId] = { ...colorToUpdate, ...updatedColor };

  return true;
}

export function getColorsById(colorId: number) {
  return colorsIndex[colorId];
}

export function getColorsByName(colorName: string) {
  return colorsNameIndex[colorName.toLowerCase()];
}

loadColorsJSON();
