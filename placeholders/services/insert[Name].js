const [Name] = require('../../models/[name]')

module.exports = function(props){
  let [name] = new [Name](props)
  return [name].save()
}