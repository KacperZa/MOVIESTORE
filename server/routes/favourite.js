const express = require('express')
const router = express.Router()
const Media = require('../model/media')

const authMiddleware = require('../middleware/authMiddleware')

// Getting all the data
router.get('/', async (req, res) => {
    try{
        const Medias = await Media.find()
        res.json(Medias)
    } catch(err) {
        res.status(500).json({message: err.message})
    }
})

router.get('/ids/:id', authMiddleware, async (req, res) => {
    try{
        const ids = await Media.find({ userId: req.user._id}).select('tmdbId -_id')
        res.status(200).json(ids)
    } catch(err) {
        res.status(500).json({message: err.message})
    }
})


// Adding the media record
router.post('/add/:id', authMiddleware, async (req, res) => {
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
            adult: req.body.adult,
            backdrop_path: req.body.backdrop_path,
            genre_ids: req.body.genre_ids,
            original_language: req.body.original_language,
            original_title: req.body.original_title,
            overview: req.body.overview,
            popularity: req.body.popularity,
            poster_path: req.body.poster_path,
            release_date: req.body.release_date,
            title: req.body.title,
            video: req.body.video,
            vote_average: req.body.vote_average,
            vote_count: req.body.vote_count,
        })
        const newMedia = await media.save()
        res.status(201).json(newMedia)
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

