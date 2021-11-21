
let client
if (process.env.REDIS === 'yes') {
  // client = redis.createClient(
  //   process.env.REDIS_PORT,
  //   process.env.REDIS_HOST
  // )
}

module.exports = client
