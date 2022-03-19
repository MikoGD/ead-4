import express from 'express';
import {
  handleAddNewColor,
  handleGetAllColors,
  handleGetColorById,
  handleGetColorByName,
  handleUpdateColorById,
  handleUpdateColorByName,
} from './controller';

/* TODO:
- Make routes async
- Implement wrapper to catch errors
*/
const router = express.Router();

router.use((req, _, next) => {
  if (req.body && req.body.name) {
    req.body.name = req.body.name.toLowerCase();
  }

  next();
});

router.get('/', handleGetAllColors);
router.get('/id/:id', handleGetColorById);
router.get('/name/:name', handleGetColorByName);
router.post('/', handleAddNewColor);
router.put('/id/:id', handleUpdateColorById);
router.put('/name/:name', handleUpdateColorByName);

export default router;
