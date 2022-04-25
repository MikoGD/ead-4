import fs from 'fs';
import path from 'path';
import { ColorsBody } from './types';
import { Mutex } from 'async-mutex';

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

export interface ColorsIndex {
  [id: number]: Color;
}

const colorsIndex: ColorsIndex = {};
export const colorsMutex = new Mutex();
let currId = 0;

function loadColorsJSON() {
  const colorsPath = path.resolve(
    __dirname,
    `../${process.env.COLORS_PATH}` ?? ''
  );

  const colorsFile = fs.readFileSync(colorsPath);
  const colors: Color[] = JSON.parse(String(colorsFile));

  colors.forEach((color) => {
    const { colorId, name } = color;

    if (colorId > currId) {
      currId = colorId;
    }

    colorsIndex[colorId] = color;
  });
}

export function getColors() {
  return colorsIndex;
}

export function addColor(newColor: Omit<Color, 'colorId'>) {
  currId += 1;

  const newId = currId;
  const newColorWithId: Color = { colorId: currId, ...newColor };

  colorsIndex[newId] = newColorWithId;

  return newColorWithId;
}

function updateColor(colorId: number, updatedColor: Color) {
  colorsIndex[colorId] = updatedColor;
}

/**
 * Returns true if color was updated else false
 */
export function updateColorById(colorId: number, updatedColorBody: ColorsBody) {
  const colorToUpdate = colorsIndex[colorId];

  if (!colorToUpdate) {
    return false;
  }

  const updatedColor: Partial<ColorsBody> = {
    ...colorToUpdate,
    ...updatedColorBody,
  };

  delete updatedColor.colorNameIndex;

  updateColor((updatedColor as Color).colorId, updatedColor as Color);

  return true;
}

export function getColorsById(colorId: number): [Color, number] {
  const colorIndex = Object.values(colorsIndex).findIndex(
    ({ colorId: currColorId }) => currColorId === colorId
  );
  return [colorsIndex[colorId], colorIndex];
}

function deleteColor(colorId: number) {
  delete colorsIndex[colorId];
}

/**
 * If color found and deleted return true else false
 *
 * @param colorId
 * @returns boolean
 */
export function deleteColorById(colorId: number) {
  if (!colorsIndex[colorId]) {
    return false;
  }

  const { name } = colorsIndex[colorId];

  if (!name) {
    return false;
  }

  deleteColor(colorId);

  return true;
}

export function getColorByIndex(index: number) {
  const colors = Object.values(colorsIndex) as Color[];

  return colors[index];
}

loadColorsJSON();
