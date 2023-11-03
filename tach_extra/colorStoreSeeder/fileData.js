import path from 'path';
import { folderHasFiles, getFilenamesInFolder } from './utils';

function getFileData(folderPath) {
  const fileNames = getFilenamesInFolder(folderPath);
  const fileData = [];
  for (let i = 0; i < fileNames.length; i++) {
    fileData.push({
      key: `images/${fileNames[i]}`,
      metadata: {
        contentType: 'image/svg+xml',
      },
      filepath: path.join(folderPath, fileNames[i]),
    });
  }
  return fileData;
}

const folderName = 'local_data';
const hasFiles = folderHasFiles(folderName);
if (!hasFiles) {
  createCopiesWithRandomColor(svg, 100, folderName);
}

export default data = getFileData(folderName);
