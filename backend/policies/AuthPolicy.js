const Joi = require('joi')
const User = require('../models/User')

module.exports = {
    async RegAuthPolicy(req, res, next){
        const g = await User.findAll()
        let userExists = g.map(e=>e.name)
        if(userExists.indexOf(req.body.name) > -1){
            res.json({'err': 'user already exits'})
        }
        const schema = Joi.object({
            name: Joi.string()
        })
        const {error, value} = schema.validate(req.body)
        if(error){
            switch(error.details[0].context.key){
                case 'name':
                    res.status(400).send({error:'you must enter a valid name'})
                default:
                    res.status(500).send({error:'internal server error'})
            }
        }else{
            next()
        }
    },

    async LogAuthPolicy(req, res, next){
        console.log('////////////////////')
        next()
    }
}