import express, { Request, Response, NextFunction } from 'express'
const router = express.Router()
import History from '../model/history'
import authMiddleware from '../middleware/authMiddleware'
import { HistorySchema } from '../schemas/History.schema'
import z from 'zod'
import history from '../model/history'
import { getOrSetCache } from '../redis/redisClient'
import { tmdbFetch } from '../utils/tmdbFetch'


router.delete('/clear', async (req, res) => {
    try{
        await History.deleteMany({});
        res.status(200).json({message: 'Successfully deleted all data'})
    }catch(err){
        const error = err instanceof Error ?  err.message : 'Unknown error'
        res.status(500).json({message: error})
    }
})
router.get('/ids/:id', authMiddleware, async (req,res) => {
    if(!req.user) {
        return res.status(401).json({message: "Unauthorized"})
    }

    try{
        const medias = await History.find({ userId: req.user._id })
        res.status(200).json(medias)
    } catch (err) {
        const error = err instanceof Error ?  err.message : 'Unknown error'
        res.status(500).json({ message: error})
    }
})
router.get('/:id', authMiddleware, async (req, res) => {

    if(!req.user) return res.status(401).json({message: 'Unautorized'})

    const reqUserId = req.user._id
    
        const history = await History.find({ userId: reqUserId})
        const detailed = await Promise.all(
            history.map(his => 
                getOrSetCache(
                    `details:${his.mediaType}:${his.tmdbId}`,
                    async () => await tmdbFetch({ endpoint: `/${his.mediaType}/${his.tmdbId}`})
                )
            )
        )
    
        const result = detailed
        .map((details, index) => {
            if (!details) return null
            const his = history[index]
            
            return {
                ...details,
                userId: reqUserId,
                mediaType: his.mediaType,
                status: his.status,
            }
        })
        .filter(Boolean)
        res.status(200).json(result)
})


// Adding the history record
router.post('/:id', authMiddleware, async (req, res) => {

    if(!req.user) return res.status(401).json({message: "Unauthorized"})

    const result = HistorySchema.safeParse(req.body)

    // History data validation
    if (result.error){
        const errorTree = z.treeifyError(result.error)
        return res.status(400).json({
            success: false,
            message: 'History validation failed',
            ...errorTree
        })
    }

    const { mediaType, tmdbId, status } = result.data
    
    try{
        const exists =  await History.findOne({
            userId: req.user._id,
            tmdbId: tmdbId,
        })
        if(exists){
            return res.status(409).json({message: 'Already in history.'})
        }

        const history = new History({
            userId: req.user._id,            
            mediaType: mediaType,
            tmdbId: tmdbId,
            status: status
        })
        const newMedia = await history.save()
        res.status(201).json(newMedia)
    } catch(err) {
        const error = err instanceof Error ?  err.message : 'Unknown error'
        res.status(400).json({message: error})
    }
})
// Getting all the data
router.get('/', async (req, res) => {
    try{
        const Medias = await History.find()
        res.json(Medias)
    } catch(err) {
        const error = err instanceof Error ?  err.message : 'Unknown error'
        res.status(500).json({message: error})
    }
})



router.patch('/:id', getMedia, async (req, res) => {
    if(!req.history) return res.status(404).json({message: 'Media not found'})

    const result = HistorySchema.safeParse(req.body)

    if(result.error){
        const errorTree = z.treeifyError(result.error)
        return res.status(400).json({
            success: false,
            message: 'History patch validation error!',
            ...errorTree
        })
    }

    const { status } = result.data


    if (status !== undefined){
        req.history.status = status
    }

    try{
        const updatedMedia = await req.history.save()
        res.json(updatedMedia)
    } catch(err) {
        const error = err instanceof Error ?  err.message : 'Unknown error'
        res.status(400).json({message:error})
    }
})

router.delete('/:id', getMedia, async (req, res) => {

    if(!req.history) return res.status(404).json({message: 'Media not found'})

    try{
        await req.history.deleteOne()
        res.json({message: "Deleted a show/movie"})
    } catch(err) {
        const error = err instanceof Error ?  err.message : 'Unknown error'
        res.status(500).json({message: error})
    }
})


async function getMedia(req: Request, res: Response, next: NextFunction){
    try{
        const history = await History.findOne({tmdbId: Number(req.params.id)})
        if (history == null){
            return res.status(404).json({ message: "Cannot find the movie/tv show."})
        }
        req.history = history
        next()
    } catch(err) {
        const error = err instanceof Error ?  err.message : 'Unknown error'
        res.status(500).json({message: error})
    }
}

export default router

