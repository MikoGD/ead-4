import express from 'express';
import morgan from 'morgan';
import 'dotenv/config';
import routes from './routes';

export const app = express();

// Middleware
// TODO: Use env variables to change morgan config to prod or dev
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/', routes);

app.listen(process.env.PORT, () => console.log('server running'));
