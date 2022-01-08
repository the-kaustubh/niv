const redis = require('redis')

function initRedisCache () {
  const client = redis.createClient({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT
  })

  client.on('error', err => {
    console.log('Error while connecting to redis ' + err)
  })
  client.connect()
    .then(
      () => {
        console.log('Redis connected')
      },
      () => {
        console.log('Redis failed')
      })
  return client
}

module.exports = initRedisCache
