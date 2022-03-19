import express from 'express';
import {
  handleAddNewColor,
  handleGetAllColors,
  handleGetColorById,
  handleGetColorByName,
} from './controller';

/* TODO:
- Make routes async
- Implement wrapper to catch errors
*/
const router = express.Router();

router.get('/', handleGetAllColors);
router.get('/id/:id', handleGetColorById);
router.get('/name/:name', handleGetColorByName);
router.post('/', handleAddNewColor);

export default router;
