const QRCode = require("qrcode");
const uuid = require("uuid");
const path = require("path");
const fs = require("fs");

const data_path = path.join(__dirname, "generate", "data", "data.json");
const image_path = path.join(__dirname, "generate", "images");

let data = [];

try {
  data = require(data_path);
} catch (err) {
  console.error(err);
}

const qrCodeOptions = {
  color: {
    dark: "#00F", // Blue dots
    light: "#0000", // Transparent background
  },
};

const createImage = async (url) => {
  return await QRCode.toDataURL(url, qrCodeOptions);
};

const saveImage = async (url, imageData) => {
  const { labelId, qrCodeData, qrCodeImagePath } = getMetaData(url);

  QRCode.toFile(qrCodeImagePath, qrCodeData, qrCodeOptions, (err) => {
    if (err) {
      console.error(err);
      return;
    }

    addInfo(labelId, url, qrCodeData, qrCodeImagePath);
  });
};

const addInfo = (labelId, imageUrl, qrCodeData, qrCodeImagePath) => {
  const newData = {
    id: labelId,
    src: imageUrl,
    imageUrl: qrCodeData,
    imagePath: qrCodeImagePath,
  };
  data.push(newData);
  fs.writeFileSync(data_path, JSON.stringify(data, null, 2));
};

const getMetaData = (imageUrl) => {
  const labelId = uuid.v4();
  const qrCodeData = `${imageUrl}/${labelId}`;
  const qrCodeImagePath = path.join(image_path, `qrcode_${labelId}.png`);

  return { labelId, qrCodeData, qrCodeImagePath };
};
module.exports = { saveImage, createImage };
