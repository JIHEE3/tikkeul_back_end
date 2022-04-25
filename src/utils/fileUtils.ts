import fs from 'fs';

export function deleteFile(path: string): boolean {
  let result = true;
  if (fs.existsSync(path)) {
    try {
      fs.unlinkSync(path);
    } catch (error) {
      console.error(error);
      result = false
    }
  }

  return result;
}