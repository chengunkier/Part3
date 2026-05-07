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

app.post('/api/persons', (request, response) => {
    const body = request.body

    if (!body.name || !body.number) {
        return response.status(400).json({
            error: 'name or number is missing'
        })
    }

    const nameExists = persons.find(
        person => person.name.toLowerCase() === body.name.toLowerCase()
    )

    if (nameExists) {
        return response.status(400).json({
            error: 'name must be unique'
        })
    }

    const generateId = () => {
        if (persons.length === 0) {
            return 1
        }

        const maxId = Math.max(...persons.map(person => person.id))
        return maxId + 1
    }

    const person = {
        id: generateId(),
        name: body.name,
        number: body.number
    }

     persons.push(person)
     response.json(persons)
 })
  
const PORT = 3000
app.listen(PORT)
console.log(`Server running on port ${PORT}`)