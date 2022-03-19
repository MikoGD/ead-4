import { Request, Response } from 'express';
import { getColors, getColorsByIdOrName } from './colors';

interface ColorsParams {
  id: string;
}

export function getAllColors(_: Request, res: Response) {
  res.status(200).json({ message: 'ok', data: getColors() });
}

export function getColorById(req: Request<ColorsParams>, res: Response) {
  const colorId = isNaN(Number(req.params.id))
    ? req.params.id.toLowerCase()
    : Number(req.params.id);

  const colors = getColorsByIdOrName(colorId);

  if (!colors || (Array.isArray(colors) && colors.length === 0)) {
    res.status(404).json({ error: `could not find color: ${colorId}` });
    return;
  }
  
  res.status(200).json({ message: 'ok', data: colors });
}
