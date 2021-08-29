const User = require('../models/User')
const JWT = require('jsonwebtoken')
const config = require('../config/config')

function JWTSignUser(user){
    const ONE_WEEK = 60 * 60 * 24 * 7
    return JWT.sign({user}, config.authentication.JWTSecret,{
        expiresIn: ONE_WEEK
    })
}

const RegAuth = async (req, res) => {
    try {
        if(typeof req.body.name === 'undefined'){
            res.json({'err':"missing required field"})
        }
        const u = await User.create(req.body)
        res.json(u)
    } catch (error) {
        res.json({'err':error})
    }
}

const LogAuth = async (req, res)=>{
    try {
        const { name } = req.body
        const u = await User.findOne({
            where: {
                name: name
            }
        })
        if(!u){
            return res.status(403).send({
                error:'the name you entered is invalid'
            })
        }
        // res.json({
        //     'user': u,
        //     'token': JWTSignUser(name)
        // })
        res.json({
            user:u, 
            token: JWTSignUser(u)
        })
    } catch (error) {
        res.send({
            'err': error
        })
    }
}

module.exports = {
    RegAuth,
    LogAuth
}