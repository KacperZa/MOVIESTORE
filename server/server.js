const express = require('express')
const app = express()
require('dotenv').config()

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

const tmdbFetch = async (endpoint, params) => {
    const url = new URL(`${TMDB_BASE_URL}${endpoint}`);

    url.searchParams.set('language', 'en-US')

    Object.entries(params).forEach(([key, value]) => {
        url.searchParams.set(key, value)
    })

    const res = await fetch(url.toString(), {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: `Bearer ${process.env.TMDB_TOKEN}`
        },
    });

    return res.json();
};

app.get('/api', async (req, res) => {
    const { page = '1'} = req.query;
    const data = await tmdbFetch('/movie/popular', { page })
    res.json(data.results)
})

app.listen(5000, () => { console.log("Server started on port 5000")})