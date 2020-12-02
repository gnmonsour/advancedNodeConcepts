const { clearHashCache } = require('../services/cache');

// middleware to run after the next call
module.exports = async (req, res, next) => {
  await next(); // route handler
  if ([201, 200].includes(res.statusCode)) clearHashCache(req.user.id);
};
