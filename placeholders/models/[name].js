const mongoose = require('mongoose');

/// TODO: implement [Name] schema.
/// Below is an example of using String, Number and sub-document properties.
const [Name]Schema = new mongoose.Schema({
  text: String,
  number: Number,
  subdocs: [{
    text: String,
    referenceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ReferencedClassModelName'
    }
  }]
});

module.exports = mongoose.model('[Name]', [Name]Schema);