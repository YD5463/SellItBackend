const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

const outputFolder = "public/assets";

const create_image = async (file) => {
  await sharp(file.path)
    .resize(2000)
    .jpeg({ quality: 50 })
    .toFile(path.resolve(outputFolder, file.filename + "_full.jpg"));

  await sharp(file.path)
    .resize(100)
    .jpeg({ quality: 30 })
    .toFile(path.resolve(outputFolder, file.filename + "_thumb.jpg"));

  fs.unlinkSync(file.path);
};
module.exports.resize_images = async (req, res, next) => {
  const images = [];

  const resizePromises = req.files.map(async (file) => {
    create_image(file);
    images.push(file.filename);
  });

  await Promise.all([...resizePromises]);

  req.images = images;

  next();
};

module.exports.resize_profile_image = async (req, res, next) => {
  if (req.file) await create_image(req.file);
  next();
};
