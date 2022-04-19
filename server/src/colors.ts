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

interface ColorNameIndex {
  [name: string]: Color;
}

const colorsIndex: ColorsIndex = {};
const colorsNameIndex: ColorNameIndex = {};
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
    colorsNameIndex[name.toLowerCase()] = color;
  });
}

export function getColors() {
  return colorsIndex;
}

/* TODO:
- Update to handle colors.JSON file update 
*/
export function addColor(newColor: Omit<Color, 'colorId'>) {
  currId += 1;

  const newId = currId;
  const newColorWithId: Color = { colorId: currId, ...newColor };

  colorsIndex[newId] = newColorWithId;
  colorsNameIndex[newColor.name.toLowerCase()] = newColorWithId;

  return newColorWithId;
}

function updateColor(colorId: number, name: string, updatedColor: Color) {
  colorsIndex[colorId] = updatedColor;
  colorsNameIndex[name] = updatedColor;
}

/**
 * Returns true if color was updated else false
 */
export function updateColorById(colorId: number, updatedColorBody: ColorsBody) {
  const colorToUpdate = colorsIndex[colorId];

  if (!colorToUpdate) {
    return false;
  }

  // No chance of undefine due to middleware
  const colorNameIndex = updatedColorBody.colorNameIndex!;
  const updatedColor: Partial<ColorsBody> = {
    ...colorToUpdate,
    ...updatedColorBody,
  };

  delete updatedColor.colorNameIndex;

  updateColor(
    (updatedColor as Color).colorId,
    colorNameIndex,
    updatedColor as Color
  );

  return true;
}

/**
 * Returns true if color was updated else false
 */
export function updateColorByName(
  colorName: string,
  updatedColorBody: ColorsBody
) {
  const colorToUpdate = colorsNameIndex[colorName];

  if (!colorToUpdate) {
    return false;
  }

  // No chance of undefine due to middleware
  const colorNameIndex = updatedColorBody.colorNameIndex!;
  const updatedColor: Partial<ColorsBody> = {
    ...colorToUpdate,
    ...updatedColorBody,
  };

  delete updatedColor.colorNameIndex;

  updateColor(
    (updatedColorBody as Color).colorId,
    colorNameIndex,
    updatedColorBody as Color
  );
  return true;
}

export function getColorsById(colorId: number) {
  return colorsIndex[colorId];
}

export function getColorsByName(colorName: string) {
  return colorsNameIndex[colorName];
}

function deleteColor(colorId: number, name: string) {
  delete colorsIndex[colorId];
  delete colorsNameIndex[name];
}

/**
 * If color found and deleted return true else false
 *
 * @param colorId
 * @returns boolean
 */
export function deleteColorById(colorId: number) {
  const { name } = colorsIndex[colorId];

  if (!name) {
    return false;
  }

  deleteColor(colorId, name.toLowerCase());

  return true;
}

/**
 * If color found and deleted return true else false
 *
 * @param name
 * @returns boolean
 */
export function deleteColorByName(name: string) {
  const color = colorsNameIndex[name];

  if (!color) {
    return false;
  }

  const { colorId } = colorsNameIndex[name];

  deleteColor(colorId, name);

  return true;
}

loadColorsJSON();
