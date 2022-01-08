function cacheRoutes (cacheClient) {
  return async (req, _res, next) => {
    req.cache = cacheClient
    next()
  }
}

module.exports = cacheRoutes
