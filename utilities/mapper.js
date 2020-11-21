const getBaseUrl = require("./getBaseUrl");
const baseUrl = getBaseUrl.url;
const mapImageToUrl = (image) => ({
  url: `${baseUrl}${image}_full.jpg`,
  thumbnailUrl: `${baseUrl}${image}_thumb.jpg`,
});

const mapper = (listing) => {
  return {
    ...listing._doc,
    images: listing.images.map(mapImageToUrl),
  };
};

module.exports.mapListings = mapper;
module.exports.mapImageToUrl = mapImageToUrl;
