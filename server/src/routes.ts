import express, { NextFunction } from 'express';
import {
  handleAddNewColor,
  handleDeleteColorById,
  handleDeleteColorByName,
  handleGetAllColors,
  handleGetColorById,
  handleGetColorByIndex,
  handleGetColorByName,
  handleUpdateColorById,
  handleUpdateColorByName,
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
router.get<ColorsParams, any, ColorsBody>('/name/:name', handleGetColorByName);

router.post<ColorsParams, any, ColorsBody>('/', handleAddNewColor);

router.put<ColorsParams, any, ColorsBody>(
  '/id/:id',
  addColorNameIndexMiddleware,
  handleUpdateColorById
);
router.put<ColorsParams, any, ColorsBody>(
  '/name/:name',
  addColorNameIndexMiddleware,
  handleUpdateColorByName
);

router.delete<ColorsParams, any, ColorsBody>('/id/:id', handleDeleteColorById);
router.delete<ColorsParams, any, ColorsBody>(
  '/name/:name',
  handleDeleteColorByName
);

export default router;
