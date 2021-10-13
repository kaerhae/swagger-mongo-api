const bcrypt = require('bcrypt')
const express = require('express')
const usersRouter = express.Router()
const User = require('../Models/user')
const jwt = require('jsonwebtoken')


usersRouter.get('/', async (request, response) => {
  const users = await User
  .find({}).populate("trips", { 
    date_start: 1,
    date_end: 1,
    locations: 1,
    kilometers: 1,
    done: 1
  })
  
  response.json(users)
})


usersRouter.post('/', async (request, response) => {
  const body = request.body

  if (body.email === undefined) {
    return response.status(400).json({ error: 'Email missing'})
  }
  if (body.username === undefined) {
    return response.status(400).json({ error: 'Username missing'})
  }
  if (body.password === undefined) {
    return response.status(400).json({ error: 'Password missing'})
  }

  if (body.password.length < 3) {
    return response.status(400).json({ error: 'Password must at least three characters'})
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(body.password, saltRounds)

  const user = new User({
    email: body.email,
    username: body.username,
    passwordHash,
  })

  const savedUser = await user.save()

  response.json(savedUser)
})

module.exports = usersRouter