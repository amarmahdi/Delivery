const express = require('express')
const router = express.Router()
const { AddToCart, GetCart } = require('./../controllers/Cart')

router.post('/', AddToCart)
router.get('/:username', GetCart)

module.exports = router
