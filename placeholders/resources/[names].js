const express = require('express')
const router = express.Router()
const controller = require('../controllers/[name]Controller')

// Resource routes CRUD + Index

// Index
router.get('/', controller.getAll)

// Create
router.post('/', controller.create)

// Read
router.get('/:id', controller.get)

// Update
router.put('/:id', controller.update)

// Delete
router.delete('/:id', controller.remove)

module.exports = router