import { Request, Response } from 'express';
import {
  addColor,
  deleteColorById,
  deleteColorByName,
  getColors,
  getColorsById,
  getColorsByName,
  updateColorById,
  updateColorByName,
} from './colors';
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

export function handleUpdateColorById(req: ColorRequest, res: Response) {
  const id = Number(req.params.id);
  const updatedColor = req.body;

  if (id === NaN) {
    res.status(404).json({ error: 'invalid color id to update' });
  }

  const didUpdate = updateColorById(id, updatedColor);

  if (!didUpdate) {
    res
      .status(404)
      .json({ error: `could not find color to update from id of ${id}` });
  }

  res.status(204).json({});
}

export function handleUpdateColorByName(req: ColorRequest, res: Response) {
  const name = req.params.name;
  const updatedColor = req.body;

  const didUpdate = updateColorByName(name, updatedColor);

  if (!didUpdate) {
    res
      .status(404)
      .json({ error: `could not find color to update from name of ${name}` });
  }

  res.status(204).json({});
}

export function handleDeleteColorById(req: ColorRequest, res: Response) {
  const id = Number(req.params.id);

  if (id === NaN) {
    res.status(404).json({ error: 'invalid color id to delete' });
  }

  const isDeleted = deleteColorById(id);

  if (!isDeleted) {
    res
      .status(404)
      .json({ error: `could not find color of id ${id} to delete` });
    return;
  }

  res.status(204).json({});
}

export function handleDeleteColorByName(req: ColorRequest, res: Response) {
  const name = req.params.name;

  const isDeleted = deleteColorByName(name.toLowerCase());

  if (!isDeleted) {
    res
      .status(404)
      .json({ error: `could not find color of name ${name} to delete` });

    return;
  }

  res.status(204).json({});
}
