const User = require('./../models/User')

const findUser = async (username)=>{
    await User.findOne({
        where: {
            name: username
        }
    })
}

const findAllUsers = async ()=>{
    let users;
    const userModel = await User.findAll()
}


module.exports = { findUser, findAllUsers }
