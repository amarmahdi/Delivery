const express = require('express')
const router = express.Router()
const { LoginAuth, RegisterAuth } = require('./../controllers/Authentications')
const { RegistrationPolicy, LoginPolicy } = require('./../policies/AuthenticationPolicies')

router.post('/login', LoginPolicy, LoginAuth)
router.post('/register', RegistrationPolicy, RegisterAuth)


module.exports = router