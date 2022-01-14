async function getUrl (req, _res, next) {
  const route = req.originalUrl.split('/')[1]

  console.log({
    route: route,
    url: req.originalUrl,
    method: req.method
  })
  next()
}

module.exports = getUrl
