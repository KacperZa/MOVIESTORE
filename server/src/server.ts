import express from 'express'
const app = express()
import bcrypt from 'bcrypt'
import mongoose from 'mongoose'
import cors from 'cors'
require('dotenv').config()
import rateLimitMiddleware from './middleware/RateLimiter'
import { redisClient, getOrSetCache } from './redis/redisClient.js'
import { tmdbFetch } from './utils/tmdbFetch'


app.use(express.json())
app.use(cors())
app.use(rateLimitMiddleware)


mongoose.connect(process.env.DATABASE_URL ?? '')
const db = mongoose.connection
db.on('error', (error) => {console.error(error)})
db.once('open', () => {console.log('Connected to database!')})

import profilesRouter from './routes/profile'
app.use('/profile', profilesRouter)

import mediasRouter from './routes/favourite'
app.use('/favourite', mediasRouter)

import historyRouter from './routes/history'
import { deliveryQuerySchema } from './schemas/DeliveryQuery.schema'
import { deliveryParamSchema } from './schemas/DeliveryParam.schema'
import z from 'zod'
app.use('/history', historyRouter)

app.get('/api', async (req, res) => {

    const { page = '1', keywords, sort, filters = 'popularity.desc', adult} = req.query;

    try {
        const allData = await getOrSetCache(`allData?page=${page}&sort?=${sort}&keywords=${keywords}&filters=${filters}&adult=${adult}`, async () => {
            let data 

            if (
                typeof filters !== 'string' || 
                (keywords !== undefined && typeof keywords !== 'string') || 
                (adult !== undefined && typeof adult !== 'string')
            ){
                return res.status(400).json({ error: 'keywords, filters, adult variable must be a string!'})
            }
            // Checking if user used search bar
            if(keywords){
                data = await tmdbFetch({
                    endpoint: '/search/movie', 
                    params: { page: String(page), query: keywords}
                });
            }else{
                data = await tmdbFetch({ endpoint: '/discover/movie', params: { page: String(page), sort_by: filters, ...( adult ? {include_adult: adult} : {}) }});
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
        if(typeof page !== 'string') {
            return res.status(400).json({ error: 'page must be a string'})
        }
    try {
        const popular = await getOrSetCache(`popular?page=${page}`, async () => await tmdbFetch({endpoint: '/movie/popular', params: { page: String(page) }}))
        res.json(popular.results)
    } catch (err) {
        console.error(err)
    }
})
// MOVIE DETAILS
app.get('/details/movie/:id', async (req, res) => {
    const movieId = req.params.id

    if (typeof movieId !== 'string') {
        return res.status(400).json({error: 'movieId must be a string'})
    }
    try {
        const movieDetails = await getOrSetCache(`movieDetails?movieId=${movieId}`, async () => await tmdbFetch({ endpoint: `/movie/${movieId}` }))
        res.json(movieDetails)
    } catch (err) {
        console.error(err)
    }    
})
// MOVIE VIDEOS
app.get('/movie/videos/:id',  async (req, res) => {
    const movieId = req.params.id
    
    if (typeof movieId !== 'string') {
        return res.status(400).json({error: 'movieId must be a string'})
    }
    try{
        const movieVideos = await getOrSetCache(`movieVideos?movieId=${movieId}`, async () => await tmdbFetch({ endpoint: `/movie/${movieId}/videos`}))
        res.json(movieVideos.results)
    } catch(err) {
        console.error(err)
    } 
})


// GETTING MOVIE PROVIDERS FROM JUSTWATCH
app.get('/movie/providers/:id', async (req, res) => {
    const movieId = req.params.id

    if (typeof movieId !== 'string') {
        return res.status(400).json({error: 'movieId must be a string'})
    }

    try {
        const data = await getOrSetCache(`movieProviders:${movieId}`, async () => await tmdbFetch({ endpoint: `/movie/${movieId}/watch/providers`}))

        const providers = data.results.US ?? {}
        res.json(providers)
    } catch(err) {
        console.error(err)
        res.status(500).json({ error: 'Failed to fetch providers'})
    }

})
// TV SHOWS VIDEOS
app.get('/tv/videos/:id',  async (req, res) => {
    const tvId = req.params.id

    if (typeof tvId !== 'string') {
        return res.status(400).json({error: 'movieId must be a string'})
    }
    try{
        const tvVideos = await getOrSetCache(`tvVideos?movieId=${tvId}`, async () => await tmdbFetch({ endpoint: `/tv/${tvId}/videos`}))
        res.json(tvVideos.results)
    } catch(err) {
        console.error(err)
    } 
})

// GETTING MOVIE PROVIDERS FROM JUSTWATCH
app.get('/tv/providers/:id', async (req, res) => {
    const tvId = req.params.id

    if (typeof tvId !== 'string') {
        return res.status(400).json({error: 'tvId must be a string'})
    }

    try {
        const data = await getOrSetCache(`tvProviders:${tvId}`, async () => await tmdbFetch({ endpoint: `/tv/${tvId}/watch/providers`}))

        const providers = data.results.US ?? {}
        res.json(providers)
    } catch(err) {
        console.error(err)
        res.status(500).json({ error: 'Failed to fetch providers'})
    }

})

// TV SHOWS DETAILS
app.get('/details/tv/:id', async (req, res) => {
    const tvId = req.params.id

    if (typeof tvId !== 'string') {
        return res.status(400).json({error: 'movieId must be a string'})
    }

    try {
        const tvDetails = await getOrSetCache(`tvDetails?tvId=${tvId}`, async () => await tmdbFetch({ endpoint: `/tv/${tvId}`}))
        res.json(tvDetails)
    } catch(err) {
        console.error(err)
    }
})
// MOVIE REVIEWS
app.get('/reviews/movie/:id', async (req, res) => {
    const movieId = req.params.id

    if (typeof movieId !== 'string') {
        return res.status(400).json({error: 'movieId must be a string'})
    }
    try{
        const movieReviews = await getOrSetCache(`movieReviews?movieId=${movieId}`, async () => await tmdbFetch({ endpoint: `/movie/${movieId}/reviews`}))
        res.json(movieReviews.results)
    } catch(err){
        console.error(err)
    }
})
// TV REVIEWS
app.get('/reviews/tv/:id', async (req, res) => {
    const tvId = req.params.id

    if (typeof tvId !== 'string') {
        return res.status(400).json({error: 'movieId must be a string'})
    }
        try{
        const tvReviews = await getOrSetCache(`tvReviews?movieId=${tvId}`, async () => await tmdbFetch({ endpoint: `/tv/${tvId}/reviews`}))
        res.json(tvReviews.results)
    } catch(err){
        console.error(err)
    }

})
// MOVIE GENRES
app.get('/api/movie/genres', async (req, res) => {
    try {
        const genres = await getOrSetCache(`genresMovie`, async () => await tmdbFetch({ endpoint: '/genre/movie/list'}))
        res.json(genres.genres)
    } catch (err) {
        console.error(err)
    }
})
// MOVIE WITH SPEFICIC GENRE
app.get('/api/movie/:genreId', async (req, res) => {
    const resultQuery = deliveryQuerySchema.safeParse(req.query)
    const resultParams = deliveryParamSchema.safeParse(req.params)

    // Params validation
    if (resultParams.error){
        const errorTree = z.treeifyError(resultParams.error)
        return res.status(400).json({
            success: false,
            message: 'Params validation failed',
            ...errorTree
        })
    }

    // Query validation
    if (resultQuery.error
    ){
        const errorTree = z.treeifyError(resultQuery.error)
        return res.status(400).json({
            success: false,
            message: 'query validation failed',
            ...errorTree
        })
    }

    const { filters, keywords, adult, page } = resultQuery.data
    const { genreId } = resultParams.data
    
    try {
        const specificMovieGenre = await getOrSetCache(`specificMovieGenre?genreId=${genreId}&page=${page}&keywords=${keywords}&filters=${filters}&adult=${adult}`, async () => {
            let data;
            if(keywords){
                data = await tmdbFetch({ endpoint: '/search/tv', params: { page: page, query: keywords }});
            } else {
                data = await tmdbFetch({ endpoint: `/discover/movie`, params: { with_genres: genreId, page: page, sort_by: filters, include_adult: adult }})
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
        const genres = await getOrSetCache(`genresTv`, async () => await tmdbFetch({ endpoint: '/genre/tv/list'}))
        res.json(genres.genres)
    } catch (err){
        console.error(err)
    }
})

// SHOWS WITH SPEFICIC GENRE
app.get('/api/tv/:genreId', async (req, res) => {
    const resultQuery = deliveryQuerySchema.safeParse(req.query)
    const resultParams = deliveryParamSchema.safeParse(req.params)

    // Params validation
    if (resultParams.error){
        const errorTree = z.treeifyError(resultParams.error)
        return res.status(400).json({
            success: false,
            message: 'Params validation failed',
            ...errorTree
        })
    }

    // Query validation
    if (resultQuery.error
    ){
        const errorTree = z.treeifyError(resultQuery.error)
        return res.status(400).json({
            success: false,
            message: 'query validation failed',
            ...errorTree
        })
    }

    const { filters, keywords, adult, page } = resultQuery.data
    const { genreId } = resultParams.data

    try{
        const specificTvGenre = await getOrSetCache(`specificTvGenre?genreId=${genreId}&page=${page}&keywords=${keywords}&filters=${filters}&adult=${adult}`, async () => {
        let data;
        if(keywords){
                data = await tmdbFetch({ endpoint: '/search/tv',  params: { page: String(page), query: keywords }});
            }else{
                data = await tmdbFetch({ endpoint: `/discover/tv`, params: { with_genres: genreId, page: String(page), sort_by: filters, ...(adult ? {include_adult: adult} : {}) }} )
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
    // const { page = '1', keywords, filters = 'popularity.desc', adult } = req.query;

    const resultQuery = deliveryQuerySchema.safeParse(req.query)

    // Query validation
    if (resultQuery.error){
        const errorTree = z.treeifyError(resultQuery.error)
        return res.status(400).json({
            success: false,
            message: 'query validation failed',
            ...errorTree
        })
    }

    const { filters, keywords, adult, page } = resultQuery.data

    try{
        const tvShows = await getOrSetCache(`tvShows?page=${page}&keywords=${keywords}&filters=${filters}&adult=${adult}`, async () => {
            let data;
                if(keywords){
                    data = await tmdbFetch({ endpoint: '/search/tv', params: { page: page, query: keywords }});
                }else{
                    data = await tmdbFetch({ endpoint: '/discover/tv', params: { page: page, sort_by: filters, include_adult: adult }});
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