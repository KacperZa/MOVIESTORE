const mongoose = require('mongoose')

const historySchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },   
    mediaType: {
        type: String
    },
    tmdbId: {
        type: Number
    },
    adult: {
        type: Boolean,
    },
    backdrop_path: {
        type: String
    },
    genre_ids: {
        type: [Number]
    },
    original_language: {
        type: String 
    },
    original_title: {
        type: String
    },
    overview: {
        type: String
    },
    popularity: {
        type: Number
    },
    poster_path: {
        type: String
    },
    release_date: {
        type: String
    },
    title: {
        type: String
    },
    video: {
        type: Boolean
    },
    vote_average: {
        type: Number
    },
    vote_count: {
        type: Number
    }
    
})

module.exports = mongoose.model('History', historySchema)