import axios from 'axios';
import { Color } from '../types';

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

export async function getColorById(colorId: number) {
  const response = await colorAxios.get<GetColorResponse>(`/id/${colorId}`);
  return response.data;
}

export async function addColor(newColor: Omit<Color, 'colorId'>) {
  const response = await colorAxios.post<PostColorResponse>('/', newColor);
  return response.data;
}

export async function updateColor(updatedColor: Color) {
  await colorAxios.put(`/id/${updatedColor.colorId}`, updatedColor);
}

export async function removeColor(colorId: number) {
  await colorAxios.delete(`/id/${colorId}`);
}
