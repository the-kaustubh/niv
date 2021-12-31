const transporter = require('./nodemailerTransporter')

const sendVerificationMail = async (email, username, code) => {
  const info = await transporter.sendMail({
    from: '"Kaustubh Murumkar " <kaustubh.murumkar@gmail.com>',
    to: email,
    subject: 'User verification for Central Monitoring System (ATES)',
    html:
    `Dear ${username},
      <p>
      You have been invited to <b>Central Monitoring System</b> by your superadmin.
      To continue participating, please verify your account by entering otp to login
      </p>
      <p>
      Your OTP is <h2>${code}</h2>
      </p>
      
    `
  })
  console.error(info)
}

module.exports = sendVerificationMail
