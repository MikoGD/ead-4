export interface Color {
  colorId: number;
  hexString: string;
  rgb: {
    [key: string]: number;
    r: number;
    g: number;
    b: number;
  };
  hsl: {
    [key: string]: number;
    h: number;
    s: number;
    l: number;
  };
  name: string;
}

export type SetState<T> = React.Dispatch<React.SetStateAction<T>>;
