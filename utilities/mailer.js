const nodemailer = require("nodemailer");
const { User } = require("../models/users");
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: "smarthomeprojetmail@gmail.com",
    pass: "edanan5463",
  },
});

const from_address = '"SellIt support system" <sellIt@gmail.com>';
const sendValidationCodeToEmail = async (email, user) => {
  const code = Math.floor(100000 + Math.random() * 900000);
  let info = await transporter.sendMail({
    from: from_address,
    to: email,
    subject: `Hello ${user.name}`,
    html: `Your veryfication code is: <b>${code}</b>`,
  });
  user.verify_code = code;
  user.verify_code_time = Date.now();
  await user.save();
};

const sendNewListingEmail = async (listing, userId) => {
  const user = await User.findById(userId);
  if (user.subscribe === "non") return;
  const info = await transporter.sendMail({
    from: from_address,
    to: user.email,
    subject: "New Listing Was Added",
    html: `Listing: <br> ${listing}`,
  });
};
const sendNewPassword = async (password, email) => {
  let info = await transporter.sendMail({
    from: from_address,
    to: email,
    subject: "Restore Password",
    html: `Your new password is: <b>${password}</b>`,
  });
};
exports.sendValidationCodeToEmail = sendValidationCodeToEmail;
exports.sendNewListingEmail = sendNewListingEmail;
exports.sendNewPassword = sendNewPassword;
