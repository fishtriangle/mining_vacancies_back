import sharp from 'sharp';
import { Buffer } from 'node:buffer';

const mimo = {
  png: 'data:image/png;base64',
  jpg: 'data:image/jpg;base64',
};

export const convertStringToBuffer = (string) => {
  const arr = string.split(',');
  return Buffer.from(arr[1], 'base64');
};

export const convertImgToSmall = async (img) => {
  const rawImg = await convertStringToBuffer(img);
  const { data } = await sharp(rawImg)
    .resize(400, 225)
    .jpeg()
    .toBuffer({ resolveWithObject: true });
  const str = [mimo.jpg, data.toString('base64')].join(',');
  return str;
};

export const convertImgToLarge = async (img) => {
  const rawImg = convertStringToBuffer(img);
  const { data } = await sharp(rawImg)
    .resize(1920, 1080)
    .jpeg()
    .toBuffer({ resolveWithObject: true });
  const str = [mimo.jpg, data.toString('base64')].join(',');
  return str;
};
