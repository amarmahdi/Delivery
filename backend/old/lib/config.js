const envi = {}

envi.staging = {
    'envName': 'staging',
    'port': '4000',
    'hashingSecret':'thisisthesecret'
}

envi.production = {
    'envName': 'production',
    'port': '5000',
    'hashingSecret':'thisisthesecret'
}

const curEnv = typeof (process.env.NODE_ENV) == "string" ? process.env.NODE_ENV.toLocaleLowerCase() : ''
const setEnv = typeof (envi[curEnv]) == 'object' ? envi[curEnv] : envi.staging

module.exports = setEnv