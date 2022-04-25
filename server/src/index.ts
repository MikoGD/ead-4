import express, { Request, Response, NextFunction } from 'express';
import morgan from 'morgan';
import cors from 'cors';
import 'dotenv/config';
import routes from './routes';
import { ColorRequest, ColorsBody, ColorsParams } from './types';

export const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/', routes);

interface ColorError {
  status: number;
  message?: string;
}

function handleError(
  err: string,
  _req: ColorRequest,
  res: Response,
  _next: NextFunction
) {
  const { status, message } = JSON.parse(err) as ColorError;
  res.status(status).json({ error: message });
}

app.use(handleError);

app.listen(process.env.PORT, () =>
  console.log(`server running on port ${process.env.PORT}`)
);
