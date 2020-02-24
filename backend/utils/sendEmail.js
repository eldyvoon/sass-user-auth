const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_KEY)

const sendEmail = ({ recipient, subject, html }) => {
  const msg = {
    to: recipient,
    from: `no-reply@${process.env.SITENAME}`,
    subject,
    html
  }
  return sgMail.send(msg)
}

module.exports = sendEmail
