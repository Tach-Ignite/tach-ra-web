import { Format } from 'ajv';
import { fullFormats } from 'ajv-formats/dist/formats';

// custom ajv format to evaluate image file inputs
const fileFormat: Format = {
  type: 'string',
  validate: (input: string) => {
    // Validate the file format (JPEG, PNG, or GIF)
    const allowedFormats = ['image/jpeg', 'image/png', 'image/gif'];
    const fileType = input.split(';')[0].split(':')[1];
    if (!allowedFormats.includes(fileType)) {
      return false;
    }

    // Validate the file size (less than 1 megabyte)
    const fileSize = Buffer.byteLength(input, 'base64');
    if (fileSize > 1000000) {
      return false;
    }

    return true;
  },
};

export const customFormats: { [x: string]: Format | undefined } = {
  ...fullFormats,
  headShotFile: fileFormat,
  'github-uri-or-empty':
    /(^$|^https:\/\/(www\.)?github.com\/[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}\/?$)/i,
  'medium-uri-or-empty':
    /(^$|^https:\/\/medium.com\/@[a-zA-Z0-9_.]{1,38}\/?$)/i,
  'stack-overflow-uri-or-empty':
    /(^$|^https:\/\/(www\.)?stackoverflow.com\/users\/[0-9]{0,50}\/[a-zA-Z0-9_.]{1,60}\/?$)/i,
  'linkedin-uri':
    /^https:\/\/(www\.)?linkedin.com\/in\/[a-zA-Z0-9_.-]{1,60}\/?$/i,
  'linkedin-uri-or-empty':
    /(^$|^https:\/\/(www\.)?linkedin.com\/in\/[a-zA-Z0-9_.-]{1,60}\/?$)/i,
  'facebook-uri-or-empty':
    /(^$|^https:\/\/(www\.)?facebook.com\/[a-zA-Z0-9_.]{1,60}\/?$)/i,
  'web-uri-or-empty':
    /(^$|^((https?|ftp|smtp):\/\/)?(www.)?[a-z0-9]+\.[a-z]+(\/{1}[a-zA-Z0-9#]+)*\/?$)/,
};
