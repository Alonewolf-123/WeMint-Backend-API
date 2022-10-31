module.exports = {
  secret: "wemint-secret-key",
  jwtExpiration: 43200,         // 12 hour
  jwtRefreshExpiration: 86400, // 24 hours

  /* for test */
  // jwtExpiration: 60,          // 1 minute
  // jwtRefreshExpiration: 120,  // 2 minutes
};
