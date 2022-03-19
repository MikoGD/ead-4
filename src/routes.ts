import express from 'express';
import { sendAllColors, sendColorById, sendColorByName } from './controller';

/* TODO:
- Make routes async
- Implement wrapper to catch errors
*/
const router = express.Router();

router.get('/', sendAllColors);
router.get('/id/:id', sendColorById);
router.get('/name/:name', sendColorByName);

export default router;
