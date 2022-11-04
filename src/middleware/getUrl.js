async function getUrl (req, _res, next) {
  const routeParts = req.originalUrl.split('/')
  const routeFor = routeParts[1]
  const routeAction = routeParts[2]

  req.info = {
    for: routeFor,
    action: routeAction,
    url: req.originalUrl,
    ip: req.ip,
    method: req.method
  }
  next()
}

module.exports = getUrl
