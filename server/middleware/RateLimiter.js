const TokenBucket = require('../tokenBucket')

const tokenBucket = new TokenBucket(50, 1)
const rateLimitMiddleware = (req, res, next) => {
    if (tokenBucket.allowRequest()) {
        next();
    } else {
        res.status(429).send('Too many requests. Please try again later.')
    }
};

module.exports = rateLimitMiddleware