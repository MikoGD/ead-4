import { NextFunction, Response } from 'express';
import { ColorRequest } from './types';

type ColorRoute = (req: ColorRequest, res: Response) => void;

interface ColorError {
  status: number;
  message?: string;
}

export function asyncRoute(
  req: ColorRequest,
  res: Response,
  routeCallback: ColorRoute
) {
  try {
    routeCallback(req, res);
  } catch (error) {
    const { status, message } = error as ColorError;
    res.status(status).json({ error: message });
  }
}
