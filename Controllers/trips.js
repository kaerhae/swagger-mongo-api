const express = require('express')
const Trip = require('../Models/trip')
const tripsRouter = express.Router()
const User = require('../Models/user')
const jwt = require('jsonwebtoken')




tripsRouter.get('/', async (request, response) => {
  
  const trips = await Trip.find({}).populate('user', { username: 1 })

  response.json(trips)
})


tripsRouter.get('/:id', async (request, response, next) => {
    const trip = await Trip.findById(request.params.id)
    if (trip) {
      response.json(trip.toJSON())
    } else {
      response.status(404).end()
  }
})

tripsRouter.delete('/:id', async (request, response, next) => {
    await Trip.findByIdAndRemove(request.params.id)
    response.status(204).end()

})

const getTokenFrom = request => {
  const authorization = request.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    return authorization.substring(7)
  }
  return null
}


tripsRouter.post('/', async (request, response, next) => {
  const body = request.body
  const token = getTokenFrom(request)
  const decodedToken = jwt.verify(token, process.env.SECRET)
  if (!token || !decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }
  if (body.locations === undefined) {
    return response.status(400).json({ error: 'Location missing'})
  }

  if (body.done === undefined) {
    return response.status(400).json({ error: "Is it done or not?"})
  }

  const user = await User.findById(decodedToken.id)

  const trip = new Trip({
    date_start: body.date_start,
    date_end: body.date_end,
    locations: body.locations,
    kilometers: body.kilometers,
    done: body.done,
    user: user._id
  })
  const savedTrip = await trip.save()
  user.trips = user.trips.concat(savedTrip._id)
  await user.save()
  response.json(savedTrip.toJSON())
})

tripsRouter.put('/:id', async (request, response, next) => {
  const body = request.body
  const trip = {
    date_start: body.date_start,
    date_end: body.date_end,
    locations: body.locations,
    kilometers: body.kilometers,
    done: body.done,
  }

  const updatedTrip = await Trip.findByIdAndUpdate(request.params.id, trip, { new: true})
  response.json(updatedTrip.toJSON())
})

module.exports = tripsRouter