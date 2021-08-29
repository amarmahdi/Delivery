const express = require('express')
const router = express.Router()
let { arr, persons } = require('../new')
let { getPersons, addPerson, updatePerson, deletePerson } = require('../controllers/person')

router.get('/persons', getPersons)

router.post('/add-person', addPerson)

router.put('/update/:person', updatePerson)

router.delete('/delete/:person', deletePerson)

module.exports = router
