const [Names] = require('../services/[names]')

function getAll(req, res) {
  [Names].findAll()
    .then([names] => res.json([names]))
    .catch(error => res.send(error))
}

function create(req, res) {
  [Names].validate.creation(req.body)
  .then(body => [Names].insert(req.body))
  .then([name] => res.json([name]))
  .catch(error => res.status(400).send(error))
}

function get(req, res) {
  [Names].findById(req.params.id)
    .then([name] => res.json([name]))
    .catch(error => res.send(error))
}

function update(req, res) {
  // TODO: implement [name] controller - update
  throw new Error("[name]Controller::update not yet implemented.")
}

function remove(req, res) {
  [Names].remove(req.params.id)
    .then([name] => res.json([name]))
    .catch(error => res.send(error))
}

// Expose API
module.exports = {
  getAll: getAll,
  create: create,
  get: get,
  update: update,
  remove: remove
}