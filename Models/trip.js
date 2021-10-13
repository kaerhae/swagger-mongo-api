const mongoose = require('mongoose')


const tripSchema = new mongoose.Schema({
  date_start: "String",
  date_end: "String",
  locations: [],
  kilometers: "Number",
  done: "Boolean",  
  user: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
  }]
})

tripSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
    delete returnedObject.passwordHash
  }
})

module.exports = mongoose.model("Trip", tripSchema)
