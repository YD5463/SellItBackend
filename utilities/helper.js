const mapper = require("./mapper");
const jwt = require("jsonwebtoken");

const generate_token = (user) => {
  const token = jwt.sign(
    {
      userId: user._id,
      name: user.name,
      email: user.email,
      bio: user.bio,
      gender: user.gender,
      phone_number: user.phone_number,
      profile_image: user.profile_image
        ? mapper.mapImageToUrl(user.profile_image)
        : null,
    },
    "jwtPrivateKey"
  );
  return token;
};
exports.generate_token = generate_token;
