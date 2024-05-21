import Jimp from "jimp";

export const resizeImages = async (oldPath, newPath) => {
  Jimp.read(oldPath)
    .then((lenna) => {
      return lenna.resize(250, 250).write(newPath);
    })
    .catch((err) => {
      console.error(err);
    });
};