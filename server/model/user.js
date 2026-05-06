const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email:{
        type: String,
        requirde: true
    },
    dateOfBirth: {
        type: Date,
        required: true
    },
    creationDate: {
        type: Date,
        required: true,
        default: Date.now
    },
    password:{  
        type: String,
        required: true
    }
    
})

module.exports = mongoose.model('User', userSchema)