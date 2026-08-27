import { Request, Response, NextFunction, Router } from 'express'
import { hash, compare } from 'bcrypt'
const router =  Router() 
import User from '../model/user'
import { isValidObjectId } from 'mongoose'
import { registerUserSchema } from '../schemas/User.schema'
import z from 'zod'
// import db from '../server'

// Getting all users
router.get('/', async (req, res) =>{
    try{
        const Users = await User.find()
        res.json(Users)
    } catch (err) {
        const error = err instanceof Error ?  err.message : 'Unknown error'
        res.status(500).json( {message: error})
    }
})
// Getting one 
router.get('/:id', getUser, (req, res) =>{
    res.send(req.user)
})
// Creating a user
router.post('/register', async (req, res) =>{


    try {

        // VALIDATE DATA
        const result = registerUserSchema.safeParse(req.body);

        if(result.error) {
            const errorTree = z.treeifyError(result.error);
            
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                ...errorTree
            })
        }

        const { email, username, password: clearPassword, age } = result.data

        // HASH PASSWORD AND SAVE USER
        let hashedPassword = await hash(clearPassword, 10) 
            const user = new User({
                username: username,
                email: email,
                age: age,
                password: hashedPassword
            })
        const newUser = await user.save()

        // GET DATA WITHOUT PASSWORD
        const {password, ...UserWithoutPassword} = newUser.toObject()

        res.status(201).json(UserWithoutPassword)
    } catch(err) {
        const error = err instanceof Error ?  err.message : 'Unknown error'
        res.status(400).json({message: error})
    }
})  
// Updating a user
router.patch('/:id', getUser, async (req, res) =>{

    if(!req.user) {
        return res.status(401).json({message: 'Unauthorized'})
    }
    if(req.body.username != null){
        req.user.username = req.body.username
    }
    if(req.body.email != null){
        req.user.email = req.body.email
    }
    if(req.body.age != null){
        req.user.age = req.body.age
    }
    if(req.body.password != null){
        try {
            let hashedPassword = await hash(req.body.password, 10)
            req.user.password = hashedPassword
        } catch (err){
            const error = err instanceof Error ?  err.message : 'Unknown error'
            res.status(400).json({message: error})
        }
    }

    try {
        const updatedUser = await req.user.save()
        res.json(updatedUser)
    } catch(err) {
        const error = err instanceof Error ?  err.message : 'Unknown error'
        res.status(400).json({message: error})
    }
})
// Deleting a user
router.delete('/delete/:id', getUser, async (req, res) =>{

    if(!req.user) {
        return res.status(401).json({message: "Unauthorized"})
    }
    try {
        await req.user.deleteOne()
        res.json({message: 'Deleted a user'})
    } catch(err) {
        const error = err instanceof Error ?  err.message : 'Unknown error'
        res.status(500).json({ message: error})
    }
})
// Login to user
router.post('/login', async (req, res) =>{
    try {
        const myUser = await User.findOne({username: req.body.username})
        if (myUser == null) {
            return res.status(400).json({message:'Cannot find the user'})
        } 
        if(await compare(req.body.password, myUser.password)) {
            res.json(myUser).redirect('/')
        } else {
            res.status(401).json({message: 'Wrong password'})
        }
    } catch(err) {
        res.sendStatus(500)
    }
})

async function getUser(req: Request, res : Response, next: NextFunction){
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
        const error = err instanceof Error ?  err.message : 'Unknown error'
        return res.status(500).json({ message: error})
    }

    req.user = user
    next()
}

export { getUser }
export default router