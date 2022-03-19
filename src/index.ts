import express from 'express';
import morgan from 'morgan';
import fs from 'fs';
import path from 'path';
import 'dotenv/config';
import loadColorsJSON from './utils';

const server = express();

const colors = loadColorsJSON();

server.use(morgan('dev'));

server.get('/', (_, res) => {
  res.status(200).json({ message: 'ok', data: colors });
});

server.listen(process.env.PORT);
