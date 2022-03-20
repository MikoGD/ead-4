import { Request } from 'express';
import { Color } from './colors';

export interface ColorsParams {
  id: string;
  name: string;
}

export interface ColorsBody extends Color {
  colorNameIndex?: string;
}

export type ColorRequest = Request<ColorsParams, any, ColorsBody>;
