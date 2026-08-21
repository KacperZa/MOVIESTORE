const express = require('express')
const app = express()
const bcrypt = require('bcrypt')
// const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const cors = require('cors')
require('dotenv').config()
const rateLimitMiddleware = require('./middleware/RateLimiter')
const { redisClient, getOrSetCache } = require('./redis/redisClient.js')
const { tmdbFetch } = require('./utils/tmdbFetch.js')


app.use(express.json())
app.use(cors())
app.use(rateLimitMiddleware)


mongoose.connect(process.env.DATABASE_URL)
const db = mongoose.connection
db.on('error', (error) => {console.error(error)})
db.once('open', () => {console.log('Connected to database!')})

const profilesRouter = require('./routes/profile')
app.use('/profile', profilesRouter)

const mediasRouter = require('./routes/favourite')
app.use('/favourite', mediasRouter)

const historyRouter = require('./routes/history')
app.use('/history', historyRouter)

app.get('/api', async (req, res) => {

    const { page = '1', keywords, sort, filters = 'popularity.desc', adult} = req.query;

    try {
        const allData = await getOrSetCache(`allData?page=${page}&sort?=${sort}&keywords=${keywords}&filters=${filters}&adult=${adult}`, async () => {
            let data 
            // Checking if user used search bar
            if(keywords){
                data = await tmdbFetch('/search/movie', { page, query: keywords});
            }else{
                data = await tmdbFetch('/discover/movie', { page, sort_by: filters, include_adult: adult });
            }
            return data;
        })
        res.json(allData) 
    } catch(err) {
        console.error(err)
    }
    })




app.get('/popular', async (req, res) => {
    const { page = '1'} = req.query;
    try {
        const popular = await getOrSetCache(`popular?page=${page}`, async () => await tmdbFetch('/movie/popular', { page }))
        res.json(data.results)
    } catch (err) {
        console.error(err)
    }
})
// MOVIE DETAILS
app.get('/details/movie/:id', async (req, res) => {
    const movieId = req.params.id
    try {
        const movieDetails = await getOrSetCache(`movieDetails?movieId=${movieId}`, async () => await tmdbFetch(`/movie/${movieId}`))
        res.json(movieDetails)
    } catch (err) {
        console.error(err)
    }    
})
// MOVIE VIDEOS
app.get('/movie/videos/:id',  async (req, res) => {
    const movieId = req.params.id
    try{
        const movieVideos = await getOrSetCache(`movieVideos?movieId=${movieId}`, async () => await tmdbFetch(`/movie/${movieId}/videos`))
        res.json(movieVideos.results)
    } catch(err) {
        console.error(err)
    } 
})
// TV SHOWS VIDEOS
app.get('/tv/videos/:id',  async (req, res) => {
    const tvId = req.params.id
    try{
        const tvVideos = await getOrSetCache(`tvVideos?movieId=${tvId}`, async () => await tmdbFetch(`/tv/${tvId}/videos`))
        res.json(tvVideos.results)
    } catch(err) {
        console.error(err)
    } 
})
// TV SHOWS DETAILS
app.get('/details/tv/:id', async (req, res) => {
    const tvId = req.params.id
    try {
        const tvDetails = await getOrSetCache(`tvDetails?tvId=${tvId}`, async () => await tmdbFetch(`/tv/${tvId}`))
        res.json(tvDetails)
    } catch(err) {
        console.error(err)
    }
})
// MOVIE REVIEWS
app.get('/reviews/movie/:id', async (req, res) => {
    const movieId = req.params.id

    try{
        const movieReviews = await getOrSetCache(`movieReviews?movieId=${movieId}`, async () => await tmdbFetch(`/movie/${movieId}/reviews`))
        res.json(movieReviews.results)
    } catch(err){
        console.error(err)
    }
})
// TV REVIEWS
app.get('/reviews/tv/:id', async (req, res) => {
    const tvId = req.params.id
        try{
        const tvReviews = await getOrSetCache(`tvReviews?movieId=${tvId}`, async () => await tmdbFetch(`/tv/${tvId}/reviews`))
        res.json(tvReviews.results)
    } catch(err){
        console.error(err)
    }

})
// MOVIE GENRES
app.get('/api/movie/genres', async (req, res) => {
    try {
        const genres = await getOrSetCache(`genresMovie`, async () => await tmdbFetch('/genre/movie/list'))
        res.json(genres.genres)
    } catch (err) {
        console.error(err)
    }
})
// MOVIE WITH SPEFICIC GENRE
app.get('/api/movie/:genre_id', async (req, res) => {
    const { page = '1', keywords, filters = 'popularity.desc', adult } = req.query;
    const genreId = req.params.genre_id;
    
    try {
        const specificMovieGenre = await getOrSetCache(`specificMovieGenre?genreId=${genreId}&page=${page}&keywords=${keywords}&filters=${filters}&adult=${adult}`, async () => {
            let data;
            if(keywords){
                data = await tmdbFetch('/search/tv', { page, query: keywords });
            } else {
                data = await tmdbFetch(`/discover/movie`, { with_genres: genreId, page, sort_by: filters, include_adult: adult })
            }
            return data
        })
        res.json(specificMovieGenre)
    } catch (err) {
        console.error(err)
        res.status(502).json({ error: 'Failed to fetch movie data' })
    }
})


// TV SHOWS GENRES
app.get('/api/tv/genres', async (req, res) => {
    try {
        const genres = await getOrSetCache(`genresTv`, async () => await tmdbFetch('/genre/tv/list'))
        res.json(genres.genres)
    } catch (err){
        console.error(err)
    }
})

// SHOWS WITH SPEFICIC GENRE
app.get('/api/tv/:genre_id', async (req, res) => {
    const { page = '1', keywords, filters = 'popularity.desc', adult } = req.query;
    const genreId = req.params.genre_id;

    try{
        const specificTvGenre = await getOrSetCache(`specificTvGenre?genreId=${genreId}&page=${page}&keywords=${keywords}&filters=${filters}&adult=${adult}`, async () => {
        let data;
        if(keywords){
                data = await tmdbFetch('/search/tv', { page, query: keywords });
            }else{
                data = await tmdbFetch(`/discover/tv`, { with_genres: genreId, page, sort_by: filters, include_adult: adult } )
            }
            return data
        })
        res.json(specificTvGenre)
    } catch (err) {
        console.error(err)
    }
})


// TV SHOWS
app.get('/api/tv', async (req, res) => {
    const { page = '1', keywords, filters = 'popularity.desc', adult } = req.query;
    let data;
    try{
        const tvShows = await getOrSetCache(`tvShows?page=${page}&keywords=${keywords}&filters=${filters}&adult=${adult}`, async () => {
            let data;
                if(keywords){
                    data = await tmdbFetch('/search/tv', { page, query: keywords });
                }else{
                    data = await tmdbFetch('/discover/tv', { page, sort_by: filters, include_adult: adult });
                }
                return data
        })
        res.json(tvShows)
    } catch(err){
        console.error(err)
        return res.status(500).json({error: 'Failed to fetch TV shows.'})
    }

})

const startServer = async () => {
    try {
        await redisClient.connect()
        console.log('Redis connected successfully')
    } catch (err) {
        console.error('Error while starting Redis: ', err)
    }
    app.listen(5000, () => { 
        console.log("Server started on port 5000")
    })
}
startServer()

module.exports = { db }