const express = require('express')
const bcrypt = require('bcrypt')
const router =  express.Router() 
const User = require('../model/user')
const { isValidObjectId } = require('mongoose')
const db = require('../server')

// Getting all users
router.get('/', async (req, res) =>{
    try{
        const Users = await User.find()
        res.json(Users)
    } catch (err) {
        res.status(500).json( {message: err.message})
    }
})
// Getting one 
router.get('/:id', getUser, (req, res) =>{
    res.send(req.user)
})
// Creating a user
router.post('/register', async (req, res) =>{
    try {
        let hashedPassword = await bcrypt.hash(req.body.password, 10) 
            const user = new User({
                username: req.body.username,
                email: req.body.email,
                dateOfBirth: req.body.dateOfBirth,
                password: hashedPassword
            })
        const newUser = await user.save()
        res.status(201).json(newUser)
    } catch(err) {
        res.status(400).json({message: err.message})
    }
})  
// Updating a user
router.patch('/:id', getUser, async (req, res) =>{
    if(req.body.username != null){
        req.user.username = req.body.username
    }
    if(req.body.email != null){
        req.user.email = req.body.email
    }
    if(req.body.dateOfBirth != null){
        req.user.dateOfBirth = req.body.dateOfBirth
    }
    if(req.body.password != null){
        try {
            let hashedPassword = await bcrypt.hash(req.body.password, 10)
            req.user.password = hashedPassword
        } catch (err){
            res.status(400).json({message: err.message})
        }
    }

    try {
        const updatedUser = await req.user.save()
        res.json(updatedUser)
    } catch(err) {
        res.status(400).json({message: err.message})
    }
})
// Deleting a user
router.delete('/delete/:id', getUser, async (req, res) =>{
    try {
        await req.user.deleteOne()
        res.json({message: 'Deleted a user'})
    } catch(err) {
        res.status(500).json({ message: err.message})
    }
})
// Login to user
router.post('/login', async (req, res) =>{
    try {
        const myUser = await User.findOne({email: req.body.email})
        if (myUser == null) {
            return res.status(400).json({message:'Cannot find the user'})
        } 
        if(await bcrypt.compare(req.body.password, myUser.password)) {
            res.json(myUser)
            res.redirect('/')
            res.send('Correct password')
        } else {
            res.status(401).json({message: 'Wrong password'})
        }
    } catch(err) {
        res.sendStatus(500)
    }
})

async function getUser(req, res, next){
    if(!isValidObjectId(req.params.id)){
        return res.status(404).json({ message: 'Invalid ID format' })
    }
    let user
    try {
        user = await User.findById(req.params.id)
        if (user == null){
            return res.status(404).json({ message: 'Cannot find user'})
        }
    } catch(err) {
        return res.status(500).json({ message: err.message})
    }

    req.user = user
    next()
}

module.exports = router