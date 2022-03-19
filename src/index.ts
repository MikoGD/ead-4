import express from 'express';
import morgan from 'morgan';
import 'dotenv/config';

const server = express();

server.use(morgan('dev'));

server.get('/', (_, res) => {
  res.status(200).json({ message: 'ok', data: [] });
});

server.listen(process.env);
