import { createClient } from 'redis'
const redisClient = createClient()

const DEFAULT_EXPIRATION = 3600

redisClient.on('error', (err: Error) => console.error('Redis client Error', err))
redisClient.on('connect', () => console.error('Redis connected'))

const getOrSetCache = async <T>(key: string , callback: () => Promise<T>) => {
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

export { redisClient, getOrSetCache }
