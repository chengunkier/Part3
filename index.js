const http = require('http')      
const express = require('express')
const app = express()

app.use(express.json())



let persons = [
    {
        id: "1",
        name: "Arto Hellas",
        number: "040-123456"
    },
    {
        id: "2",
        name: "Ada Lovelace",
        number: "39-44-5323523"
    },
    {
        id: "3",
        name: "Dan abramov",
        number: "8905789483"
    },
    {
        id: "4",
        name: "Mary Poppendieck",
        number: "8786573208"
    }
]

app.get('/', (request, response)=> {
    response.send('<h1>The Project</h1>')
})

app.get('/api/persons',(request, response)=> {
    response.json(persons)
})

app.get('/api/persons/:id',(request, response)=> {
    const id = request.params.id
    const person = persons.find(p => p.id === id)

    if (person) {
        response.json(person)
      } else {
        response.status(404).json({ error: 'Person not found' })
      }
})
  

const PORT = 3000
app.listen(PORT)
console.log(`Server running on port ${PORT}`)