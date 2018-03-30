const Joi = require('joi')

// Creation rules
const [Name]CreationValidationSchema = Joi.object().options({ abortEarly: false }).keys({
  text: Joi.string().exist(),
  number: Joi.number().exist()
})

// Update rules
const [Name]UpdateValidationSchema = Joi.object().options({ abortEarly: false }).keys({
  text: Joi.string(),
  number: Joi.number()
})

// Provide user-friendly validation errors
function decorateError(error) {
  if (error.isJoi) {
    let detailedError = {
      validationError: error.details.map(errorDetail => errorDetail.message)
    }
    throw detailedError
  }
}

// Expose validation rules
module.exports = {
  update: (obj) => Joi.validate(obj, [Name]UpdateValidationSchema).catch(decorateError),
  creation: (obj) => Joi.validate(obj, [Name]CreationValidationSchema).catch(decorateError)
}