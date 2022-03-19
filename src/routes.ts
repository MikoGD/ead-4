import express from 'express';
import { getAllColors, getColorById } from './controller';

const router = express.Router();

router.get('/', getAllColors);
router.get('/:id', getColorById);

export default router;
