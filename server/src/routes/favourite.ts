const router = express.Router()
import Media from '../model/media'
import express, { Request, Response, NextFunction } from 'express'



import authMiddleware from '../middleware/authMiddleware'
import { getOrSetCache } from '../redis/redisClient'
import { tmdbFetch } from '../utils/tmdbFetch'
import { favouriteSchema } from '../schemas/Favourite.schema'
import z from 'zod'

router.delete('/clear', async (req, res) => {
    try{
        await Media.deleteMany({});
        res.status(200).json({message: 'Successfully deleted all data'})
    }catch(err){
        const message = err instanceof Error ? err.message : 'Unknown error'
        res.status(500).json({message})
    }
})

// Getting all the data
router.get('/', async (req, res) => {
    try{
        const Medias = await Media.find()
        res.json(Medias)
    } catch(err) {
        const message = err instanceof Error ? err.message : 'Unknown error'
        res.status(500).json({message})
    }
})


// Getting all watched media from specific user
router.get('/:id', authMiddleware, async (req, res) => {

    if(!req.user) return res.status(401).json({message: 'Unautorized'})

    const reqUserId = req.user._id

    const favourites = await Media.find({ userId: reqUserId})
    const detailed = await Promise.all(
        favourites.map(fav => 
            getOrSetCache(
                `details:${fav.mediaType}:${fav.tmdbId}`,
                async () => await tmdbFetch({ endpoint: `/${fav.mediaType}/${fav.tmdbId}`})
            )
        )
    )

    const result = detailed
    .map((media, index) => {
        if (!media) return null
        const fav = favourites[index]
        
        return {
            ...media,
            userId: reqUserId,
            mediaType: fav.mediaType
        }
    })
    .filter(Boolean)
    res.status(200).json(result)
})


//Getting all the ids from specific user
router.get('/ids/:id', authMiddleware, async (req, res) => {

    if(!req.user) {
        return res.status(401).json({message: 'Unauthorized'})
    }
    
    try {
        const ids = await Media.find({ userId: req.user._id})
        res.status(200).json(ids)
    } catch (err) {
        console.error(err)
    }

})



// Adding the media record
router.post('/:id', authMiddleware, async (req, res) => {

    if(!req.user) return res.status(401).json({message: 'Unautorized'})

    const result = favouriteSchema.safeParse(req.body)

    if(result.error) {
        const errorTree = z.treeifyError(result.error)
        return res.status(400).json({
            success: false,
            message: 'Favourite data validation error',
            ...errorTree
        })
    }

    const { mediaType, tmdbId } = result.data
    try{
        const exists =  await Media.findOne({
            userId: req.user._id,
            tmdbId: tmdbId,
        })

        if (exists) {
            return res.status(409).json({message: 'Already in favourites'})
        }
        const media = new Media({
            userId: req.user._id,
            mediaType: mediaType,
            tmdbId: tmdbId,
        })
        const newMedia = await media.save()
        res.status(201).json(`Added: ${newMedia}`)
    } catch(err) {
        const message = err instanceof Error ? err.message : 'Unknown error'
        res.status(500).json({message})
    }
})

// router.patch('/:mediaId',  getMedia, async (req, res) => {
//     if (req.body.mediaType !== null){
//         req.media.mediaType = req.body.mediaType
//     }

//     try{
//         const updatedMedia = await req.media.save()
//         res.json(updatedMedia)
//     } catch(err) {
//         res.status(400).json({message:err.message})
//     }
// })

router.delete('/:tmdbId', getMedia, async (req, res) => {
    if(!req.media) return res.status(404).json({message: 'Media not found'})   


    try{
        await req.media.deleteOne()
        res.json({message: "Removed movie/show from favourites"})
    } catch(err) {
        const message = err instanceof Error ? err.message : 'Unknown error'
        res.status(500).json({message})
    }
})

async function getMedia(req: Request, res: Response, next : NextFunction){
    try{
        const media = await Media.findOne({tmdbId: Number(req.params.tmdbId)})
        if (media == null){
            return res.status(404).json({ message: "Cannot find the movie/tv show."})
        }
        req.media = media
        next()
    } catch(err) {
        const message = err instanceof Error ? err.message : 'Unknown error'
        res.status(500).json({message})
    }
}

export = router

