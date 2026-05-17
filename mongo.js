require('dotenv').config()

const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI

mongoose.connect(url)
  .then(() => {
    console.log('Connected to MongoDB')
  })
  .catch(err => {
    console.error('Error connecting to MongoDB:', err.message)
  })

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length < 4) {
  console.log('Give name and number')
  process.exit(1)
}

const person = new Person({
  name: process.argv[2],
  number: process.argv[3],
})

person.save()
  .then(() => {
    console.log(`Added ${person.name}`)
    mongoose.connection.close()
  })