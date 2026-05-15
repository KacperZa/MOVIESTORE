const express = require('express')
const app = express()
const bcrypt = require('bcrypt')
// const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const cors = require('cors')
require('dotenv').config()


app.use(express.json())
app.use(cors())

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

mongoose.connect(process.env.DATABASE_URL)
const db = mongoose.connection
db.on('error', (error) => {console.error(error)})
db.once('open', () => {console.log('Connected to database!')})

const profilesRouter = require('./routes/profile')
app.use('/profile', profilesRouter)

const tmdbFetch = async (endpoint, params = {}) => {
    const url = new URL(`${TMDB_BASE_URL}${endpoint}`);

    url.searchParams.set('language', 'en-US')

    Object.entries(params).forEach(([key, value]) => {
        url.searchParams.set(key, value)
    })

    try{
        const res = await fetch(url.toString(), {
            method: 'GET',
            headers: {
                accept: 'application/json',
                Authorization: `Bearer ${process.env.TMDB_TOKEN}`
            },
        });
        if(!res.ok){
            throw new Error (`HTTP: ${res.status}`)
        }
        return res.json();
    } catch(err) {
        console.error("Appeared an error: ", err)
    }
};





app.get('/api', async (req, res) => {
    const { page = '1', keywords, sort} = req.query;
    let data;
    // Checking if user used search bar
    if(keywords){
        data = await tmdbFetch('/search/movie', { page, query: keywords});
    }else{
        data = await tmdbFetch('/discover/movie', { page });
    }

    res.json(data.results)
})
app.get('/popular', async (req, res) => {
    const { page = '1'} = req.query;
    const data = await tmdbFetch('/movie/popular', { page })
    res.json(data.results)
})
// MOVIE DETAILS
app.get('/api/movie/details/:movieId', async (req, res) => {
    const movieId = req.params['movieId']
    const data = await tmdbFetch(`/movie/${movieId}`)
    res.json(data.genres)
})
// MOVIE GENRES
app.get('/api/movie/genres', async (req, res) => {
    const data = await tmdbFetch('/genre/movie/list')
    res.json(data.genres)
})
// MOVIE WITH SPEFICIC GENRE
app.get('/api/movie/:genre_id', async (req, res) => {
    const genreId = req.params.genre_id;
    const data = await tmdbFetch(`/discover/movie?with_genres=${genreId}`)
    res.json(data.results)
})


// TV SHOWS GENRES
app.get('/api/tv/genres', async (req, res) => {
    const data = await tmdbFetch('/genre/tv/list')
    res.json(data.genres)
})
// SHOWS WITH SPEFICIC GENRE
app.get('/api/tv/:genre_id', async (req, res) => {
    const genreId = req.params.genre_id;
    const data = await tmdbFetch(`/discover/tv?with_genres=${genreId}`)
    res.json(data.results)
})


// TV SHOWS
app.get('/api/tv', async (req, res) => {
    const { page = '1', keywords} = req.query;
    let data;

    if(keywords){
        data = await tmdbFetch('/search/tv', { page, query: keywords});
    }else{
        data = await tmdbFetch('/discover/tv', { page });
    }

    res.json(data.results)
})



// function authenticateToken(req, res, next){
//     const authHeader = req.headers['authorization']
//     const token = authHeader && authHeader.split(' ')[1]
//     if (token == null) return res.sendStatus(401)
    
//     jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) =>{
//         if (err) return res.sendStatus(403)
//         req.user = user
//         next()
//     })
// }

app.listen(5000, () => { console.log("Server started on port 5000")})

module.exports = { db }