require('dotenv').config()

let PORT = process.env.PORT
let MONGODB = process.env.MONGODB
let SECRET = process.env.SECRET

module.exports = {
  MONGODB,
  PORT,
  SECRET
}