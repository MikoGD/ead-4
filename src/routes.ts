import express, { NextFunction } from 'express';
import {
  handleAddNewColor,
  handleDeleteColorById,
  handleDeleteColorByName,
  handleGetAllColors,
  handleGetColorById,
  handleGetColorByName,
  handleUpdateColorById,
  handleUpdateColorByName,
} from './controller';
import { Response } from 'express';
import { ColorRequest, ColorsBody, ColorsParams } from './types';
import { asyncRoute } from './utils';

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

router.get<ColorsParams, any, ColorsBody>('/', async (req, res) =>
  asyncRoute(req, res, handleGetAllColors)
);

router.get<ColorsParams, any, ColorsBody>('/id/:id', async (req, res) =>
  asyncRoute(req, res, handleGetColorById)
);

router.get<ColorsParams, any, ColorsBody>('/name/:name', async (req, res) =>
  asyncRoute(req, res, handleGetColorByName)
);

router.post<ColorsParams, any, ColorsBody>('/', async (req, res) =>
  asyncRoute(req, res, handleAddNewColor)
);

router.put<ColorsParams, any, ColorsBody>(
  '/id/:id',
  addColorNameIndexMiddleware,
  async (req, res) => asyncRoute(req, res, handleUpdateColorById)
);
router.put<ColorsParams, any, ColorsBody>(
  '/name/:name',
  addColorNameIndexMiddleware,
  async (req, res) => asyncRoute(req, res, handleUpdateColorByName)
);

router.delete<ColorsParams, any, ColorsBody>('/id/:id', async (req, res) =>
  asyncRoute(req, res, handleDeleteColorById)
);
router.delete<ColorsParams, any, ColorsBody>('/name/:name', async (req, res) =>
  asyncRoute(req, res, handleDeleteColorByName)
);

export default router;
