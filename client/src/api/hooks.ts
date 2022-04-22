import { AxiosError } from 'axios';
import { useEffect, useState } from 'react';
import { Color } from '../types';
import { colorAxios } from './axios';

export enum REQUEST_METHOD {
  GET,
  POST,
  PUT,
  DELETE,
}

export interface ColorResponse {
  message: string;
  data: {
    colors?: Color[];
    color?: Color;
    url?: string;
  };
  error?: string;
}

// DELETE: Not having the intended effect, remove and switch to normal calls
export function useGetRequest(
  path: string
): [ColorResponse | undefined, string | undefined] {
  const [response, setResponse] = useState<ColorResponse>();
  const [error, setError] = useState<string>();

  function handleError(err: AxiosError<ColorResponse>) {
    const message = err.response?.data.error;

    setError(
      `Error: get request for ${path} failed${message ? ` - ${message}` : ''}`
    );
  }

  async function sendGetRequest() {
    try {
      const getResponse = await colorAxios.get<ColorResponse>(path);
      if (!error) {
        setError(undefined);
        setResponse(getResponse.data);
      }
    } catch (err) {
      handleError(err as AxiosError<ColorResponse>);
    }
  }

  useEffect(() => {
    if (!response) {
      sendGetRequest();
    }
  }, [response]);

  return [response, error];
}
