function authCode () {
  return Math.random().toString().substring(2, 6)
}

function GenerateCode () {
  return authCode()
}

module.exports = GenerateCode
