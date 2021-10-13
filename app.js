const config = require('./Utils/config')
const logger = require('./Utils/logger')
const express = require('express')
const morgan = require('morgan')
const mongoose = require('mongoose')

const userRouter = require('./Controllers/users')
const tripsRouter = require('./Controllers/trips')
const authenticationRouter = require('./Controllers/authentication')

const app = express()
morgan('tiny')
morgan(':method :url :status :res[content-length - :response-time ms')
app.use(express.json())

mongoose.connect(config.MONGODB, { useNewUrlParser: true, useUnifiedTopology: true, })
  .then(() => {
    logger.info('Connected to MongoDB')
  })
  .catch((error) => {
    logger.error('Error connection to MongoDB:', error.message)
  })

const swaggerUI = require('swagger-ui-express')
const swaggerDoc = require('./swagger.json')
app.get('/', async (request, response) => {
  response.send('Pong')
})
app.use('/api/trips', tripsRouter)
app.use('/api/users', userRouter)
app.use('/api/login', authenticationRouter)
app.use('/doc', swaggerUI.serve, swaggerUI.setup(swaggerDoc))

module.exports = app