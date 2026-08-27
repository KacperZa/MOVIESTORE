import { Request, Response, NextFunction } from 'express'
import TokenBucket from '../tokenBucket';

const tokenBucket = new TokenBucket(50, 1)
const rateLimitMiddleware = (req : Request, res: Response, next: NextFunction) => {
    if (tokenBucket.allowRequest()) {
        next();
    } else {
        res.status(429).send('Too many requests. Please try again later.')
    }
};

export default rateLimitMiddleware