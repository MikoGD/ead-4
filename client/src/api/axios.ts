import axios, { AxiosError } from 'axios';
import { Color } from '../types';
import { ColorResponse } from './hooks';

export interface GetColorResponse {
  message: string;
  data: Color | Color[];
  error?: string;
}

export interface PostColorResponse {
  message: string;
  data: {
    color: Color;
    url: string;
  };
  error?: string;
}

export const colorAxios = axios.create({ baseURL: 'http://localhost:8081' });

export async function getAllColors() {
  const response = await colorAxios.get<GetColorResponse>('/');
  return response.data;
}

export async function getColorById(index: number) {
  const response = await colorAxios.get<GetColorResponse>(`/id/${index}`);
  return response.data;
}

export async function addColor(newColor: Omit<Color, 'colorId'>) {
  const response = await colorAxios.post<PostColorResponse>('/', newColor);
  return response.data;
}
