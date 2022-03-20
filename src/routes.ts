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
import { ColorRequest } from './types';

/* TODO:
- Make routes async
- Implement wrapper to catch errors
*/
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

/*REVIEW:
 - Test if delete routes work
 */
router.get('/', handleGetAllColors);
router.get('/id/:id', handleGetColorById).post;
router.get('/name/:name', handleGetColorByName);

router.post('/', handleAddNewColor);

router.put('/id/:id', addColorNameIndexMiddleware, handleUpdateColorById);
router.put('/name/:name', addColorNameIndexMiddleware, handleUpdateColorByName);

router.delete('/id/:id', handleDeleteColorById);
router.delete('/name/:name', handleDeleteColorByName);

export default router;
