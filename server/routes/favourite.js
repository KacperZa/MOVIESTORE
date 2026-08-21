const express = require('express')
const router = express.Router()
const Media = require('../model/media')


const authMiddleware = require('../middleware/authMiddleware')
const { getOrSetCache } = require('../redis/redisClient')
const { tmdbFetch } = require('../utils/tmdbFetch')

router.delete('/clear', async (req, res) => {
    try{
        await Media.deleteMany({});
        res.status(200).json({message: 'Successfully deleted all data'})
    }catch(err){
        res.status(500).json({message: err.message})
    }
})

// Getting all the data
router.get('/', async (req, res) => {
    try{
        const Medias = await Media.find()
        res.json(Medias)
    } catch(err) {
        res.status(500).json({message: err.message})
    }
})

router.get('/:id', authMiddleware, async (req, res) => {
    const favourites = await Media.find({ userId: req.user._id})
    const detailed = await Promise.all(
        favourites.map(fav => 
            getOrSetCache(
                `details:${fav.mediaType}:${fav.tmdbId}`,
                async () => await tmdbFetch(`/${fav.mediaType}/${fav.tmdbId}`)
            )
        )
    )

    const result = detailed
    .map((media, index) => {
        if (!media) return null
        const fav = favourites[index]
        
        return {
            ...media,
            userId: req.user_id,
            mediaType: fav.mediaType
        }
    })
    .filter(Boolean)
    res.status(200).json(detailed)
})

router.get('/ids/:id', authMiddleware, async (req, res) => {
    try {
        const ids = await Media.find({ userId: req.user._id})
        res.status(200).json(ids)
    } catch (err) {
        console.error(err)
    }

})

// Adding the media record
router.post('/:id', authMiddleware, async (req, res) => {
    try{
        const exists =  await Media.findOne({
            userId: req.user._id,
            tmdbId: req.body.tmdbId,
        })

        if (exists) {
            return res.status(409).json({message: 'Already in favourites'})
        }
        const media = new Media({
            userId: req.user._id,
            mediaType: req.body.mediaType,
            tmdbId: req.body.tmdbId,
        })
        const newMedia = await media.save()
        res.status(201).json(`Added: ${newMedia}`)
    } catch(err) {
        res.status(400).json({message: err.message})
    }
})

router.patch('/:mediaId',  getMedia, async (req, res) => {
    if (req.body.mediaType !== null){
        req.media.mediaType = req.body.mediaType
    }

    try{
        const updatedMedia = await req.media.save()
        res.json(updatedMedia)
    } catch(err) {
        res.status(400).json({message:err.message})
    }
})

router.delete('/:tmdbId', getMedia, async (req, res) => {
    try{
        await req.media.deleteOne()
        res.json({message: "Removed movie/show from favourites"})
    } catch(err) {
        res.status(500).json({message: err.message})
    }
})

async function getMedia(req, res, next){
    try{
        const media = await Media.findOne({tmdbId: req.params.tmdbId})
        if (media == null){
            return res.status(404).json({ message: "Cannot find the movie/tv show."})
        }
        req.media = media
        next()
    } catch(err) {
        res.status(500).json({message: err.message})
    }
}

module.exports = router

