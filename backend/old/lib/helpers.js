const crypto = require('crypto')
const config = require('./config')

const helpers = {}

helpers.parseJsonToObject = (str) => {
    try {
        var obj = JSON.parse(str)
        return obj
    } catch {
        return {}
    }
}

helpers.hash = (password) => {
    if (typeof (password) == 'string' && password.length > 0) {
        let hash = crypto.createHmac('sha256', config.hashingSecret).update(password).digest('hex')
        return hash
    } else {
        return false
    }
}

helpers.userIdGen = (email) => {
    if (typeof (email) == 'string' && email.length > 0) {
        let hash = crypto.createHmac('sha256', config.hashingSecret).update(email).digest('hex')
        return hash
    } else {
        return false
    }
}

helpers.tokenGen = (strLength) => {
    strLength = typeof (strLength) === 'number' && strLength > 0 ? strLength : false
    if (strLength){
        var chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
        var str = ''
        for(var i = 1; i <= strLength; i++){
            let randChar = chars.charAt(Math.floor(Math.random() * chars.length))
            str += randChar
        }
        return str
    }else {
        return false
    }
}
// helpers.userIdGen(20)

module.exports = helpers