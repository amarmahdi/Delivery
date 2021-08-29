const Joi = require('joi')
const User = require('./../models/User')
const JWT = require('./../helpers/TokenGenerator')

// log in authentication
const LoginAuth = async (req, res) => {
    try {
        const {
            email,
        } = req.body

        const findUser = await User.findOne({
            where: {
                email: email
            }
        })
        console.log(req.body)

        res.send({
            succsess: true,
            data: findUser,
            token: JWT(findUser)
        })
    } catch (error) {
        console.log(error)
    }
}

// registration authentication
const RegisterAuth = async (req, res) => {
    try {
        const createUser = await User.create(req.body)
        res.send({
            succsess: true,
            data: createUser,
            token: JWT(createUser)
        })
    } catch (error) {
        res.send({ 'err': error })
    }
}

module.exports = {
    LoginAuth,
    RegisterAuth,
}