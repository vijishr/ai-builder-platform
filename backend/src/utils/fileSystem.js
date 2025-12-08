import fs from 'fs';
import path from 'path';

export const createDirectory = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

export const fileExists = (filePath) => {
  return fs.existsSync(filePath);
};

export const deleteFile = (filePath) => {
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
};

export const readFile = (filePath) => {
  return fs.readFileSync(filePath, 'utf-8');
};

export const writeFile = (filePath, content) => {
  createDirectory(path.dirname(filePath));
  fs.writeFileSync(filePath, content, 'utf-8');
};

export default { createDirectory, fileExists, deleteFile, readFile, writeFile };
