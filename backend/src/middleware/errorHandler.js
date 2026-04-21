function errorHandler(err, req, res, next) {
  if (res.headersSent) {
    return next(err)
  }

  console.error(err)
  return res.status(500).json({
    ok: false,
    error: "Internal Server Error",
  })
}

module.exports = { errorHandler }
