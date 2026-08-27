import express, { Request, Response, NextFunction } from 'express'
const router = express.Router()
import History from '../model/history'
import authMiddleware from '../middleware/authMiddleware'
import { HistorySchema } from '../schemas/History.schema'
import z from 'zod'


router.delete('/clear', async (req, res) => {
    try{
        await History.deleteMany({});
        res.status(200).json({message: 'Successfully deleted all data'})
    }catch(err){
        const error = err instanceof Error ?  err.message : 'Unknown error'
        res.status(500).json({message: error})
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

router.get('/me/:id', authMiddleware, async (req,res) => {
    if(!req.user) {
        return res.status(401).json({message: "Unauthorized"})
    }

    try{
        const medias = await History.find({ userId: req.user._id })
        res.json(medias)
    } catch (err) {
        const error = err instanceof Error ?  err.message : 'Unknown error'
        res.status(500).json({ message: error})
    }
})


// Adding the history record
router.post('/add/:id', authMiddleware, async (req, res) => {
    if(!req.user) {
        return res.status(401).json({message: "Unauthorized"})
    }

    
    const result = HistorySchema.safeParse(req.query)

    // History data validation
    if (result.error){
        const errorTree = z.treeifyError(result.error)
        return res.status(400).json({
            success: false,
            message: 'History validation failed',
            ...errorTree
        })
    }

    const { mediaType, tmdbId, adult, backdrop_path, genre_ids, original_language, original_title, overview, popularity, poster_path, release_date, title, video, vote_average, vote_count } = result.data
    
    try{
        const exists =  await History.findOne({
            userId: req.user._id,
            tmdbId: req.body.tmdbId,
        })
        if(exists){
            return res.status(409).json({message: 'Already in history.'})
        }

        const history = new History({
            userId: req.user._id,            
            mediaType: mediaType,
            tmdbId: tmdbId,
            adult: adult,
            backdrop_path: backdrop_path,
            genre_ids: genre_ids,
            original_language: original_language,
            original_title: original_title,
            overview: overview,
            popularity: popularity,
            poster_path: poster_path,
            release_date: release_date,
            title: title,
            video: video,
            vote_average: vote_average,
            vote_count: vote_count,
        })
        const newMedia = await history.save()
        res.status(201).json(newMedia)
    } catch(err) {
        const error = err instanceof Error ?  err.message : 'Unknown error'
        res.status(400).json({message: error})
    }
})

router.patch('/:id',  getMedia, async (req, res) => {
    if(!req.history) return res.status(404).json({message: 'Media not found'})

    if (req.body.mediaType !== null){
        req.history.mediaType = req.body.mediaType
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
        const history = await History.findById(req.params.id)
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

