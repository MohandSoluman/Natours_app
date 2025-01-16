const Nodemailer = require('nodemailer');
const { MailtrapTransport } = require('mailtrap');

const sendEmail = async (options) => {
  const TOKEN = '05407a3ebcc64b7731fe027efd2bf537';

  const transport = Nodemailer.createTransport(
    MailtrapTransport({
      token: TOKEN,
      testInboxId: 3313127,
    })
  );

  const sender = {
    address: 'Natours@natours.com',
    name: 'Natours',
  };

  transport
    .sendMail({
      from: sender,
      to: options.email,
      subject: options.subject,
      text: options.message,
      category: 'Integration Test',
      sandbox: true,
    })
    .then(console.log, console.error);
};
module.exports = sendEmail;
