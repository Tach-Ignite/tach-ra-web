import fs from 'fs';

export function folderHasFiles(folderPath) {
  if (!fs.existsSync(folderPath)) {
    return false;
  }
  return fs.readdirSync(folderPath).length > 0;
}

export function getFilenamesInFolder(folderPath) {
  if (!fs.existsSync(folderPath)) {
    return [];
  }
  return fs.readdirSync(folderPath);
}

export function generateRandomHexString(length) {
  let result = '';
  const characters = '0123456789abcdef';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}
