import { Request, Response } from 'express';
import { getColors, getColorsById, getColorsByName } from './colors';
import { ColorsParams } from './types';

export function sendAllColors(_: Request, res: Response) {
  res.status(200).json({ message: 'ok', data: getColors() });
}

export function sendColorById(req: Request<ColorsParams>, res: Response) {
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

export function sendColorByName(req: Request<ColorsParams>, res: Response) {
  const { name } = req.params;

  const color = getColorsByName(name);

  if (!color) {
    res.status(404).json({ error: `could not find color: ${name}` });
    return;
  }

  res.status(200).json({ message: 'ok', data: color });
}
