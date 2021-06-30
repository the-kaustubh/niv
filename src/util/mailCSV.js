const nodemailer = require('nodemailer')
const fastcsv = require('fast-csv')
const fs = require('fs')

const sendMailCSV = async (uid, email, data) => {
  try {
    const ws = fs.createWriteStream('data.csv')
    fastcsv
      .write(data, { headers: true })
      .on('finish', function () {
        console.log('Write to CSV successfully!')
      })
      .pipe(ws)
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.FROM_EMAIL,
        pass: process.env.FROM_PWD
      }
    })

    const info = await transporter.sendMail({
      from: '"Kaustubh Murumkar " <kaustubh.murumkar@gmail.com>',
      to: email,
      subject: ' CSV File of readings ',
      html: `Here is your csv document of UID: ${uid}`,
      attachments: [{
        filename: `data.${uid}.csv`,
        path: 'data.csv'
      }]
    })
    console.log(info)
    return true
  } catch (e) {
    return false
  }
}

module.exports = sendMailCSV
