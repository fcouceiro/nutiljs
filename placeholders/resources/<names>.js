var express = require('express')
var router = express.Router()
var controller = require('../controllers/<name>Controller')

// Resource routes CRUD + Index

// Index
router.get('/', controller.getAll)

// Create
router.post('/:id', controller.create)

// Read
router.get('/:id', controller.get)

// Update
router.put('/:id', controller.update)

// Delete
router.get('/:id', controller.delete)

module.exports = router