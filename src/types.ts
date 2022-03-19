import { Request } from 'express';
import { Color } from './colors';

interface ColorsParams {
  id: string;
  name: string;
}

interface ColorsBody extends Color {}

export type ColorRequest = Request<ColorsParams, any, ColorsBody>;
