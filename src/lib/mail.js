const nodemailer = require('nodemailer')

module.exports = nodemailer.createTransport({
  host: "smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "b6586043fe8f5b",
    pass: "0190a7464068a0"
  }
});