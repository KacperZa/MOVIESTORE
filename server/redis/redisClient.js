const redis = require('redis')
const redisClient = redis.createClient()

const DEFAULT_EXPIRATION = 3600

redisClient.on('error', (err) => console.error('Redis client Error', err))
redisClient.on('connect', () => console.error('Redis connected'))

const getOrSetCache = async (key, callback) => {
    const cached = await redisClient.get(key)
    if (cached != null) {
        return JSON.parse(cached)
    } else {
        const data = await callback()
        if (data !== undefined) {
            redisClient.setEx(key, DEFAULT_EXPIRATION, JSON.stringify(data))
        }
        return data
    }
} 

module.exports = { redisClient, getOrSetCache }
