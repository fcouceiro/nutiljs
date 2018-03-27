// Expose service API
module.exports = {
  findById : require('./find<Name>ById'),
  findAll : require('./findAll<Names>'),
  insert : require('./insert<Name>'),
  remove : require('./remove<Name>'),
  update : require('./update<Name>'),
  validate : require('./validate<Name>')
}