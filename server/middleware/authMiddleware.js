const { isValidObjectId } = require("mongoose")
const User = require("../model/user")

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


module.exports = getUser;