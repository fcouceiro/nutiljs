const [Name] = require('../services/[names]')

function getAll(req, res) {
  [Name].findAll()
    .then([names] => res.json([names]))
    .catch(error => res.send(error))
}

function create(req, res) {
  [Name].insert(req.body)
    .then([name] => res.json([name]))
    .catch(error => res.send(error))
}

function get(req, res) {
  [Name].findById(req.params.id)
    .then([name] => res.json([name]))
    .catch(error => res.send(error))
}

function update(req, res) {
  // TODO: implement [name] controller - update
  throw new Error("[name]Controller::update not yet implemented.")
}

function remove(req, res) {
  [Name].remove(req.params.id)
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