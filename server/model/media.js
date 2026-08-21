const mongoose = require('mongoose')

const mediaSchema = new mongoose.Schema({
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
    addedAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Media', mediaSchema)