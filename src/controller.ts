import { create } from 'domain';
import { Response } from 'express';
import {
  addColor,
  deleteColorById,
  deleteColorByName,
  getColors,
  getColorsById,
  getColorsByName,
  updateColorById,
  updateColorByName,
  colorsMutex,
  ColorsIndex,
  Color,
} from './colors';
import { ColorRequest } from './types';

export function createError(status: number, message?: string) {
  return JSON.stringify({ status, message });
}

export async function handleGetAllColors(_: ColorRequest, res: Response) {
  const colors = await colorsMutex.runExclusive<ColorsIndex>(() => getColors());

  res.status(200).json({ message: 'ok', data: colors });
}

export async function handleGetColorById(req: ColorRequest, res: Response) {
  const id = Number(req.params.id);

  if (id === NaN) {
    throw new Error(createError(404, `invalid color id: ${id}`));
  }

  const color = await colorsMutex.runExclusive<Color>(() => getColorsById(id));

  if (!color) {
    throw new Error(createError(404, `could not find color: ${id}`));
  }

  res.status(200).json({ message: 'ok', data: color });
}

export async function handleGetColorByName(req: ColorRequest, res: Response) {
  const { name } = req.params;

  const color = await colorsMutex.runExclusive<Color>(() =>
    getColorsByName(name)
  );

  if (!color) {
    throw new Error(createError(404, `could not find color: ${name}`));
  }

  res.status(200).json({ message: 'ok', data: color });
}

export async function handleAddNewColor(req: ColorRequest, res: Response) {
  const newColor = req.body;

  const newColorWithId = await colorsMutex.runExclusive<Color>(() =>
    addColor(newColor)
  );

  res
    .status(201)
    .json({ message: 'Successfully added new color', data: newColorWithId });
}

export async function handleUpdateColorById(req: ColorRequest, res: Response) {
  const id = Number(req.params.id);
  const updatedColor = req.body;

  if (id === NaN) {
    throw new Error(createError(404, `invalid color id of ${id} to update`));
  }

  const didUpdate = await colorsMutex.runExclusive(() =>
    updateColorById(id, updatedColor)
  );

  if (!didUpdate) {
    throw new Error(
      createError(404, `could not find color to update from id of ${id}`)
    );
  }

  res.status(204).json({});
}

export async function handleUpdateColorByName(
  req: ColorRequest,
  res: Response
) {
  const name = req.params.name;
  const updatedColor = req.body;

  const didUpdate = await colorsMutex.runExclusive(() =>
    updateColorByName(name, updatedColor)
  );

  if (!didUpdate) {
    throw new Error(
      createError(404, `could not find color to update from name of ${name}`)
    );
  }

  res.status(204).json({});
}

export async function handleDeleteColorById(req: ColorRequest, res: Response) {
  const id = Number(req.params.id);

  if (id === NaN) {
    throw new Error(createError(404, 'invalid color id to delete'));
  }

  const isDeleted = await colorsMutex.runExclusive(() => deleteColorById(id));

  if (!isDeleted) {
    throw new Error(
      createError(404, `could not find color of id ${id} to delete`)
    );
  }

  res.status(204).json({});
}

export async function handleDeleteColorByName(
  req: ColorRequest,
  res: Response
) {
  const name = req.params.name;

  const isDeleted = colorsMutex.runExclusive(() =>
    deleteColorByName(name.toLowerCase())
  );

  if (!isDeleted) {
    throw new Error(
      createError(404, `could not find color of name ${name} to delete`)
    );
  }

  res.status(204).json({});
}
