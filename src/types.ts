import { Request } from 'express';
import { Color } from './colors';

interface ColorsParams {
  id: string;
  name: string;
}

export interface ColorsBody extends Color {
  colorNameIndex?: string;
}

export type ColorRequest = Request<ColorsParams, any, ColorsBody>;
