const express = require('express')
const router = express.Router()
const History = require('../model/history')
const authMiddleware = require('../middleware/authMiddleware')


router.delete('/clear', async (req, res) => {
    try{
        await History.deleteMany({});
        res.status(200).json({message: 'Successfully deleted all data'})
    }catch(err){
        res.status(500).json({message: err.message})
    }
})
// Getting all the data
router.get('/', async (req, res) => {
    try{
        const Medias = await History.find()
        res.json(Medias)
    } catch(err) {
        res.status(500).json({message: err.message})
    }
})

router.get('/me/:id', authMiddleware, async (req,res) => {
    try{
        const medias = await History.find({ userId: req.user._id })
        res.json(medias)
    } catch (err) {
        res.status(500).json({ message: err.message})
    }
})


// Adding the history record
router.post('/add/:id', authMiddleware, async (req, res) => {
    try{
        const history = new History({
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
        const newMedia = await history.save()
        res.status(201).json(newMedia)
    } catch(err) {
        res.status(400).json({message: err.message})
    }
})

router.patch('/:id',  getMedia, async (req, res) => {
    if (req.body.mediaType !== null){
        req.history.mediaType = req.body.mediaType
    }

    try{
        const updatedMedia = await req.history.save()
        res.json(updatedMedia)
    } catch(err) {
        res.status(400).json({message:err.message})
    }
})

router.delete('/:id', getMedia, async (req, res) => {
    try{
        await req.history.deleteOne()
        res.json({message: "Deleted a show/movie"})
    } catch(err) {
        res.status(500).json({message: err.message})
    }
})


async function getMedia(req, res, next){
    try{
        const history = await History.findById(req.params.id)
        if (history == null){
            return res.status(404).json({ message: "Cannot find the movie/tv show."})
        }
        req.history = history
        next()
    } catch(err) {
        res.status(500).json({message: err.message})
    }
}

module.exports = router

