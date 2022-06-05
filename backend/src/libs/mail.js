const nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({
  host: "mail.bolsapracticasmercadotecnia.com",
  secure: false,
  port: 26,
  auth: {
    user: 'administracion@bolsapracticasmercadotecnia.com',
    pass: 'Jgonzalez1996@'
  },
  tls: {
    rejectUnauthorized: false
}
});



module.exports = transporter;