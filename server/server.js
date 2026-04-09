const express = require('express')
const app = express()
require('dotenv').config()

app.get('api', async (req, res) => {
    const answer = await fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${process.env.API_KEY}`)
    const data = await answer.json()
    res.json(data.results)
})

app.listen(5000, () => { console.log("Server started on port 5000")})