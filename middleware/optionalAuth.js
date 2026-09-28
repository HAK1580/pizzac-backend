// middleware/optionalAuth.js
const jwt = require('jsonwebtoken')

const optionalAuth = (req, res, next) => {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        req.user = null
        return next()
    }

    const token = authHeader.split(' ')[1]
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY)
        req.user = decoded.user_info
        next()
    } catch (err) {
        req.user = null // Token expired/invalid -> treat as guest
        next()
    }
}

module.exports = optionalAuth