import { isValidObjectId } from "mongoose"
import User from "../model/user"
import { Request, Response, NextFunction } from 'express'

async function getUser(req: Request, res: Response, next: NextFunction){
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
        const error = err instanceof Error ? err.message : 'Unknown error'
        return res.status(500).json({ message: error})
    }

    req.user = user
    next()
}

export default getUser