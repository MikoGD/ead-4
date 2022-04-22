import { NextFunction, Response } from 'express';
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

  res
    .status(200)
    .json({ message: 'ok', data: { colors: Object.values(colors) } });
}

export async function handleGetColorById(
  req: ColorRequest,
  res: Response,
  next: NextFunction
) {
  const id = Number(req.params.id);

  if (id === NaN) {
    next(createError(404, `invalid color id: ${id}`));
    return;
  }

  const color = await colorsMutex.runExclusive<Color>(() => getColorsById(id));

  if (!color) {
    next(createError(404, `could not find color: ${id}`));
    return;
  }

  res.status(200).json({ message: 'ok', data: color });
}

export async function handleGetColorByName(
  req: ColorRequest,
  res: Response,
  next: NextFunction
) {
  const { name } = req.params;

  const color = await colorsMutex.runExclusive<Color>(() =>
    getColorsByName(name)
  );

  if (!color) {
    next(createError(404, `could not find color: ${name}`));
    return;
  }

  res.status(200).json({ message: 'ok', data: color });
}

export async function handleAddNewColor(req: ColorRequest, res: Response) {
  const newColor = req.body;

  const newColorWithId = await colorsMutex.runExclusive<Color>(() =>
    addColor(newColor)
  );

  res.status(201).json({
    message: 'Successfully added new color',
    data: { color: newColorWithId, url: `/id/${newColorWithId.colorId}` },
  });
}

export async function handleUpdateColorById(
  req: ColorRequest,
  res: Response,
  next: NextFunction
) {
  const id = Number(req.params.id);
  const updatedColor = req.body;

  if (id === NaN) {
    next(createError(404, `invalid color id of ${id} to update`));
    return;
  }

  const didUpdate = await colorsMutex.runExclusive(() =>
    updateColorById(id, updatedColor)
  );

  if (!didUpdate) {
    next(createError(404, `could not find color to update from id of ${id}`));
    return;
  }

  res.status(204).send();
}

export async function handleUpdateColorByName(
  req: ColorRequest,
  res: Response,
  next: NextFunction
) {
  const name = req.params.name;
  const updatedColor = req.body;

  const didUpdate = await colorsMutex.runExclusive(() =>
    updateColorByName(name, updatedColor)
  );

  if (!didUpdate) {
    next(
      createError(404, `could not find color to update from name of ${name}`)
    );
    return;
  }

  res.status(204).json({});
}

export async function handleDeleteColorById(
  req: ColorRequest,
  res: Response,
  next: NextFunction
) {
  const id = Number(req.params.id);

  if (id === NaN) {
    next(createError(404, 'invalid color id to delete'));
    return;
  }

  const isDeleted = await colorsMutex.runExclusive(() => deleteColorById(id));

  if (!isDeleted) {
    next(createError(404, `could not find color of id ${id} to delete`));
    return;
  }

  res.status(204).json({});
}

export async function handleDeleteColorByName(
  req: ColorRequest,
  res: Response,
  next: NextFunction
) {
  const name = req.params.name;

  const isDeleted = colorsMutex.runExclusive(() =>
    deleteColorByName(name.toLowerCase())
  );

  if (!isDeleted) {
    next(createError(404, `could not find color of name ${name} to delete`));
    return;
  }

  res.status(204).json({});
}
