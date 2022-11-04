const User = require('../models/users')
const transporter = require('./nodemailerTransporter')

const HRS = 2
const emailInterval = HRS * 60 * 60 * 1000

const reportMail = async (username) => {
  const user = await User.findOne({ username: username })
  if (user == null) {
    console.log(`invalid user ${username}`)
    return
  }

  const lastMailAt = user.mailSent
  if (!lastMailAt || new Date() - lastMailAt > emailInterval) {
    const info = await transporter.sendMail({
      from: '"Notification ATES" <atechnowdls@gmail.com>',
      to: user.email,
      subject: 'Attention Required: There are some Faulty nodes in your Dashboard ',
      html:
      `Dear ${user.username}, <br>Please check your dashboard there may be some faulty nodes present.
       You can <a href="${process.env.HOST}/">click here</a> to go to dashboard.
       <br>
       If this was not initiated by you please ignore.
       <br>
       This is a system generated email. Do not reply to this e-mail.
       <br>
       Regards,
       <br>
       <b> ATES OPL Pvt. Ltd.  </b>
      `

    })
    console.error(info)
    const updatedUser = await User.findOneAndUpdate({ username: user.username }, { mailSent: Date.now() })
    if (updatedUser) {
      console.log(updatedUser)
    }
  } else {
    console.log(`Mail sent less than ${HRS} hrs ago, not sending`)
  }
}

module.exports = reportMail
