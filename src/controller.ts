import { Request, Response } from 'express';
import { addColor, getColors, getColorsById, getColorsByName } from './colors';
import { ColorRequest } from './types';

export function handleGetAllColors(_: ColorRequest, res: Response) {
  res.status(200).json({ message: 'ok', data: getColors() });
}

export function handleGetColorById(req: ColorRequest, res: Response) {
  const id = Number(req.params.id);

  if (id === NaN) {
    res.status(404).json({ error: `invalid color id: ${id}` });
    return;
  }

  const color = getColorsById(id);

  if (!color) {
    res.status(404).json({ error: `could not find color: ${id}` });
    return;
  }

  res.status(200).json({ message: 'ok', data: color });
}

export function handleGetColorByName(req: ColorRequest, res: Response) {
  const { name } = req.params;

  const color = getColorsByName(name);

  if (!color) {
    res.status(404).json({ error: `could not find color: ${name}` });
    return;
  }

  res.status(200).json({ message: 'ok', data: color });
}

export function handleAddNewColor(req: ColorRequest, res: Response) {
  const newColor = req.body;

  const newColorWithId = addColor(newColor);

  res
    .status(201)
    .json({ message: 'Successfully added new color', data: newColorWithId });
}
