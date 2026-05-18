const http = require('http')      
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const mongoose = require('mongoose')
const path = require('path')
const dotenv = require('dotenv')
 
dotenv.config()

const Person = require('./models/person')

const app = express()

mongoose.set('strictQuery', false)

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB')
  })
  .catch(error => {
    console.log('MongoDB connection error:', error.message)
  })

app.use(express.json())
app.use(cors())

morgan.token('body', (req) => {
    return JSON.stringify(req.body)
  })
  
app.use(
    morgan(':method :url :status :res[content-length] - :response-time ms :body')
)

app.use(express.static(path.join(__dirname, 'dist')))


app.get('/', (request, response) => {
  response.send('<h1>The Project</h1>')
})


app.get('/api/persons', (req, res) => {

  Person.find({})
    .then(persons => {
      res.json(persons)
    })
})

app.get('/info', async (req, res) => {

  const count = await Person.countDocuments({})

  res.send(`
    <p>Phonebook has info for ${count} people</p>
    <p>${new Date()}</p>
  `)
})

app.get('/api/persons/:id', (req, res, next) => {

  Person.findById(req.params.id)
    .then(person => {

      if (person) {
        res.json(person)
      } else {
        res.status(404).end()
      }

    })
    .catch(error => next(error))
})

app.post('/api/persons', (req, res, next) => {

  const body = req.body

  if (!body.name || !body.number) {

    return res.status(400).json({
      error: 'name or number missing!'
    })
  }

  const person = new Person({
    name: body.name,
    number: body.number
  })

  person.save()
    .then(savedPerson => {
      res.json(savedPerson)
    })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (req, res, next) => {

  const body = req.body

  const person = {
    name: body.name,
    number: body.number
  }

  Person.findByIdAndUpdate(
    req.params.id,
    person,
    {
      new: true,
      runValidators: true,
      context: 'query'
    }
  )

    .then(updatedPerson => {
      res.json(updatedPerson)
    })

    .catch(error => next(error))
})

app.delete('/api/persons/:id', (req, res, next) => {

  Person.findByIdAndDelete(req.params.id)

    .then(deletedPerson => {

      if (!deletedPerson) {

        return res.status(404).json({
          error: 'Person not found'
        })
      }

      res.status(204).end()
    })

    .catch(error => next(error))
})


app.use((req, res) => {

  res.sendFile(
    path.join(__dirname, 'dist', 'index.html')
  )
})


// UNKNOWN ENDPOINT

const unknownEndpoint = (req, res) => {

  res.status(404).send({
    error: 'unknown endpoint'
  })
}

app.use(unknownEndpoint)

//ERROR HANDLER

const errorHandler = (error, req, res, next) => {

  console.error(error.message)

  if (error.name === 'CastError') {

    return res.status(400).send({
      error: 'malformatted id'
    })
  }

  if (error.name === 'ValidationError') {

    return res.status(400).json({
      error: error.message
    })
  }

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT || 3000
app.listen(PORT)
console.log(`Server running on port ${PORT}`)
