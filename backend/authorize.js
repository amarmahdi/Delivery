const authorize = (req, res, next) => {
    if (req.query.user === 'amar') {
        req.user = { name: 'amar' }
        console.log(req.user)
        console.log(req.path)
        next()
    } else {
        res.status(401).send('Unauthorized')
    }
}

module.exports = authorize