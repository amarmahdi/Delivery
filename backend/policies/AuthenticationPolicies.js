const User = require('./../models/User')
const Joi = require('joi')
const JWT = require('./../helpers/TokenGenerator')

// Registration policy
const RegistrationPolicy = async (req, res, next) => {
    
    console.log(req.body)

    const schema = Joi.object({
        name: Joi.string(),
        email: Joi.string().email(),
        password: Joi.string(),
        streetAddress: Joi.string(),
        phone: Joi.string()
    })

    const findUserName = await User.findOne({
        where: {
            name: req.body.name
        }
    })

    const findUserEmail = await User.findOne({
        where: {
            email: req.body.email
        }
    })

    const findUserPhone = await User.findOne({
        where: {
            phone: req.body.phone
        }
    })

    if (findUserName) {
        return res.send({ 'err': "A person with that name already exists" })
    }

    if (findUserEmail) {
        res.send({ 'err': "A person with that email already exists" })
    }

    if (findUserPhone) {
        res.send({ 'err': "A person with that phone already exists" })
    }

    const { error, value } = schema.validate(req.body)

    if (error) {
        switch (error.details[0].context.key) {
            case 'name':
                res.send({ "err": "please enter a valid name" })
                break
            case 'email':
                res.send({ "err": "please enter a valid email" })
                break
            case 'password':
                res.send({ "err": "please enter a valid password" })
                break
            case 'streetAddress':
                res.send({ "err": "please enter a valid street address" })
                break
            case 'phone':
                res.send({ "err": "please enter a valid phone" })
                break
            default:
                res.send({ 'err': "just an error" })
        }

    } else {
        next()
    }
}

// Login policy
const LoginPolicy = async (req, res, next) => {
    
    console.log(req.body)

    const schema = Joi.object({
        email: Joi.string().email(),
        password: Joi.string(),
    })

    const findUserEmail = await User.findOne({
        where: {
            email: req.body.email
        }
    })


    if (!findUserEmail) {
        return res.json({ 'err': "Please enter a correct email address" })
    }


    const { error, value } = schema.validate(req.body)

    if (error) {
        switch (error.details[0].context.key) {
            case 'email':
                res.send({ "err": "please enter a valid email" })
                break
            case 'password':
                res.send({ "err": "please enter a valid password" })
                break
            default:
                res.send({ 'err': "just an error" })
        }

    } else {
        next()
    }
}

module.exports = {
    RegistrationPolicy,
    LoginPolicy
}