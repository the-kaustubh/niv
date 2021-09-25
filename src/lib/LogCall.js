const axios = require('axios')

async function logCall (url, data) {
  const res = await axios
    .post(url, data)
  return res
}

module.exports = logCall
