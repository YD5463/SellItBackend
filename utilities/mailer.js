const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: "smarthomeprojetmail@gmail.com",
    pass: "edanan5463",
  },
});

const sendValidationCodeToEmail = async (email, user) => {
  const code = Math.floor(100000 + Math.random() * 900000);
  let info = await transporter.sendMail({
    from: '"SellIt support system" <sellIt@gmail.com>', // sender address
    to: email, // list of receivers
    subject: `Hello ${user.name}`, // Subject line
    html: `Your veryfication code is: <b>${code}</b>`, // html body
  });
  user.verify_code = code;
  user.verify_code_time = Date.now();
  await user.save();
};
exports.sendValidationCodeToEmail = sendValidationCodeToEmail;
