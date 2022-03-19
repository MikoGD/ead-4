import fs from 'fs';
import path from 'path';

export default function loadColorsJSON() {
  const colorsPath = path.resolve(__dirname, process.env.COLORS_PATH ?? '');
  const colorsFile = fs.readFileSync(colorsPath);
  return JSON.parse(String(colorsFile));
}
