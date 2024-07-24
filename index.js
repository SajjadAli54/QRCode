// app.js

const express = require("express");
const { createImage, saveImage } = require("./src/persistance");

const app = express();
const PORT = 3000;

app.get("/generateQR", async (req, res) => {
  try {
    const url = req.query.url || "https://example.com";

    const qrCodeImage = await createImage(url);
    const imageData = qrCodeImage.split(",")[1];

    saveImage(url, imageData);

    res.send(`<img src="${qrCodeImage}" alt="QR Code"/>`);
  } catch (err) {
    console.error("Error generating QR code:", err);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
