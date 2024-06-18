const jwt = require('jsonwebtoken')

const genToken = (data)=>{
    return jwt.sign(data, process.env.JWT_SECRET, {
        expiresIn: 60 * 60 * 24
    })
}

const verifyToken = (token)=>{
    return jwt.verify(token, process.env.JWT_SECRET)
}

module.exports = {
    genToken,
    verifyToken
}