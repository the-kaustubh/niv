const jwt = require('jsonwebtoken')
const transporter = require('./nodemailerTransporter')

const sendResetLink = async (user) => {
  try {
    const token = jwt.sign({
      username: user.username,
      id: user._id
    }, process.env.EMAIL_TOK)

    const info = await transporter.sendMail({
      from: `"ATES OPL " <${process.env.FROM_EMAIL}>`,
      to: user.email,
      subject: ' Password Reset ',
      html: `<b> Hello ${user.username}</b>, you had requested for password reset <br>
      Here is your password reset link <br>
      <a href="${process.env.HOST}:8080/passwordreset?token=${token}">Click Here</a>     

      ATES OPL
      `
    })
    return info
  } catch (err) {
    console.err(err)
    return null
  }
}

const verifyToken = async (token) => {
  let usr
  jwt.verify(token, process.env.EMAIL_TOK, (err, user) => {
    if (err) throw new Error('Authentication error')
    usr = user
  })
  return usr
}

module.exports = {
  sendResetLink,
  verifyToken
}
