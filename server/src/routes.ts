import express, { NextFunction } from 'express';
import {
  handleAddNewColor,
  handleDeleteColorById,
  handleGetAllColors,
  handleGetColorById,
  handleGetColorByIndex,
  handleUpdateColorById,
} from './controller';
import { Response } from 'express';
import { ColorRequest, ColorsBody, ColorsParams } from './types';

const router = express.Router();

function addColorNameIndexMiddleware(
  req: ColorRequest,
  _: Response,
  next: NextFunction
) {
  if (req.body && req.body.name) {
    req.body.colorNameIndex = req.body.name.toLowerCase();
  }

  next();
}

router.get<ColorsParams, any, ColorsBody>('/', handleGetAllColors);
router.get<ColorsParams, any, ColorsBody>('/id/:id', handleGetColorById);
router.get<ColorsParams, any, ColorsBody>(
  '/index/:index',
  handleGetColorByIndex
);

router.post<ColorsParams, any, ColorsBody>('/', handleAddNewColor);

router.put<ColorsParams, any, ColorsBody>(
  '/id/:id',
  addColorNameIndexMiddleware,
  handleUpdateColorById
);

router.delete<ColorsParams, any, ColorsBody>('/id/:id', handleDeleteColorById);

export default router;
