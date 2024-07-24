// app.js

const QRCode = require("qrcode");
const uuid = require("uuid");

const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = 3000;

const data_path = path.join(__dirname, "data", "data.json");

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

const saveImage = (imageData, imageUrl) => {
  const labelId = uuid.v4();
  const qrCodeData = `${imageUrl}${labelId}`;
  const qrCodeImagePath = path.join(
    __dirname,
    "images",
    `qrcode_${labelId}.png`
  );

  console.log("PATH", qrCodeImagePath);

  QRCode.toFile(qrCodeImagePath, qrCodeData, qrCodeOptions, (err) => {
    if (err) {
      console.error(err);
      return;
    }

    const newData = {
      id: labelId,
      src: imageUrl,
      imageUrl: qrCodeData,
      imagePath: qrCodeImagePath,
    };
    data.push(newData);
    fs.writeFileSync(data_path, JSON.stringify(data, null, 2));
  });
};

app.get("/generateQR", async (req, res) => {
  try {
    const url = req.query.url || "https://example.com";
    const qrCodeImage = await QRCode.toDataURL(url, qrCodeOptions);

    const imageData = qrCodeImage.split(",")[1];

    saveImage(imageData, url);

    res.send(`<img src="${qrCodeImage}" alt="QR Code"/>`);
  } catch (err) {
    console.error("Error generating QR code:", err);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
